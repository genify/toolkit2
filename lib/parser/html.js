/*
 * HTML Content Parser
 * @module   parser/html
 * @author   genify(caijf@corp.netease.com)
 */
var vm   = require('vm'),
    util = require('util'),
    path = require('path'),
   _tag  = require('./tag.js'),
   _fs   = require('../util/file.js'),
   _util = require('../util/util.js'),
   _path = require('../util/path.js'),
   _nej  = require('../script/nej/util.js');
// nej deploy comment state
var STATE = {
    NULL        : 0,
    SCRIPT      : 1,
    MODULE      : 2,
    IGNORE      : 3,
    NOPARSE     : 4,
    VERSION     : 5,
    MANIFEST    : 6,
    BEG_NOCPRS  : '<!--BEGN0CPRS-->',
    END_NOCPRS  : '<!--ENDN0CPRS-->'
};
// default config
var DEFAULT = {
    webRoot     : '',
    resRoot     : '',
    charset     : 'utf-8',
    ignoreMode  : 'online',
    keepComment : !1,
    cprsFlag    : 0,
    noCoreFlag  : 0,
    noParseFlag : 0,
    inCoreFlag  : 0,
    aliasReg    : null,
    aliasDict   : {},
    exLinkAttributeRoot : '',
    exLinkAttributeFlag : !1,
    exLinkAttributeName : null
};
// state transform handler
var TRANSFORM = {
    style:function(event,config){
        if (!this.styles){
            this.styles = new (require('../explorer/style.js'))(
                _util.merge(this.getLogger(),{
                    file:this._file
                })
            );
        }
        this.styles.push(config);
        // style insert pointer
        if (this.stylePoint<0){
            this.stylePoint = event.buffer.length;
        }
        event.value = '';
    },
    script:function(event,config){
        if (!this.scripts){
            this.scripts = new (require('../explorer/script.js'))(
                _util.merge(this.getLogger(),{
                    file:this._file
                })
            );
        }
        this.scripts.push(config);
        // script insert pointer
        if (this.scriptPoint<0){
            this.scriptPoint = event.buffer.length;
        }
        event.value = '';
    },
    template:function(event,config){
        if (this._state===STATE.MODULE&&!!config.uri){
            this._saveResource(
                'module',event,config
            );
            return;
        }
        if (!this.templates){
            this.templates = new (require('../explorer/template.js'))(
                _util.merge(this.getLogger(),{
                    file:this._file
                })
            );
        }
        this.templates.push(config);
        if (this.templatePoint<0){
            this.templatePoint = event.buffer.length;
        }
        event.value = '';
    },
    module:function(event,config){
        if (!this.modules){
            this.modules = new (require('../explorer/template.js'))(
                _util.merge(this.getLogger(),{
                    file:this._file
                })
            );
        }
        this.modules.push(config);
        event.value = '';
    }
};
// nej instruction config
var INSTRUCTION = {
    STYLE:function(event){
        this.stylePoint = event.buffer.length;
        this.styleConfig = _util.merge(
            event.config,this.styleConfig
        );
        event.buffer.push('');
    },
    SCRIPT:function(event){
        this.scriptPoint = event.buffer.length;
        this.scriptConfig = _util.merge(
            event.config,this.scriptConfig
        );
        event.buffer.push('');
        // next external script is nej define.js
        if (!this.scriptConfig.nodep){
            this._state = STATE.SCRIPT;
        }
    },
    NOCOMPRESS:{
        beg:function(event){
            if (this._options.cprsFlag===0){
                event.buffer.push(STATE.BEG_NOCPRS);
            }
        },
        end:function(event){
            if (this._options.cprsFlag===0){
                event.buffer.push(STATE.END_NOCPRS);
            }
        }
    },
    NOPARSE:{
        beg:function(event){
            this._state = STATE.NOPARSE;
        },
        end:function(event){
            this._state = STATE.NULL;
        }
    },
    TEMPLATE:function(event){
        this.templatePoint = event.buffer.length;
        event.buffer.push('');
    },
    MODULE:{
        beg:function(event){
            this._state = STATE.MODULE;
        },
        end:function(event){
            this._state = STATE.NULL;
        }
    },
    VERSION:function(event){
        // next inline script is module version define
        this._state = STATE.VERSION;
    },
    IGNORE:{
        beg:function(event){
            // check ignore state
            var mode = (event.config||{}).mode||'online',
                test = this._options.ignoreMode;
            // online|test
            // !online
            if (_util.isModeOf(mode,test)){
                this._state = STATE.IGNORE;
                this._ignorePoint = event.buffer.length;
            }
        },
        end:function(event){
            // remove ignore content
            if (this._state===STATE.IGNORE){
                this._state = STATE.NULL;
                if (this._ignorePoint>=0){
                    var count = event.buffer.length-this._ignorePoint;
                    if (count>0){
                        event.buffer.splice(this._ignorePoint,count);
                    }
                    this._ignorePoint = -1;
                }
            }
        }
    },
    MANIFEST:function(event){
        this._state = STATE.MANIFEST;
    }
};
INSTRUCTION.DEFINE = INSTRUCTION.SCRIPT;
// html content parser
// input config
// - file           html file path
// - content        html file content
// supported properties
// buffer           content buffer after parse
// styles           style explorers list
// scripts          script explorers list
// templates        template explorers list
// modules          template explorers list
// stylePoint       style insert pointer in buffer
// scriptPoint      script insert pointer in buffer
// modulePoint      module insert pointer in buffer
// templatePoint    template insert pointer in buffer
// styleConfig      style deploy config
// scriptConfig     script deploy config
// templateConfig   template deploy config
var Parser = module.exports =
    require('../util/klass.js').create();
var pro = Parser.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._reset(config);
    var opt = _util.merge(
        this.getLogger(),{
            content     : config.content||'',
            tag         : this._onTag.bind(this),
            text        : this._onText.bind(this),
            restxt      : this._onResText.bind(this),
            comment     : this._onComment.bind(this),
            style       : this._onResTag.bind(this,'style'),
            script      : this._onResTag.bind(this,'script'),
            textarea    : this._onResTag.bind(this,'textarea'),
            instruction : this._onInstruction.bind(this)
        }
    );
    this.buffer = (new _tag.Parser(opt)).dump();
};
/**
 * parse html file content
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    // update module root
    var root = this.moduleConfig.root;
    if (!!root){
        [
            this.modules,
            this.templates
        ].forEach(function(explorer){
            if (!!explorer){
                explorer.updateModuleRoot(root);
            }
        });
    }
    // parse explorers
    [
        this.styles,
        this.scripts,
        this.modules,
        this.templates
    ].forEach(function(explorer){
        if (!!explorer){
            explorer.parse(config);
        }
    });
};
/**
 * scan buffer for doing something with style/script text
 * @param  {Function} func  - do something
 * @param  {Object}   scope - function scope
 * @return {Void}
 */
pro.scan = (function(){
    var reg = /^<\/?(style|script)>$/i;
    return function(func,scope){
        if (!_util.isFunction(func)){
            return;
        }
        var opt = null;
        this.buffer.forEach(function(content,index,list){
            if (reg.test(content)){
                if (content.indexOf('/')>0){
                    // for end style/script
                    opt = null;
                }else{
                    // for start style/script
                    opt = {type:RegExp.$1};
                }
            }else if(!!opt){
                opt.file = this._file;
                opt.content = content;
                func.call(scope||null,opt);
                if (opt.value!=null){
                    list[index] = opt.value;
                }
            }
        },this);
    };
})();
/**
 * serialize content
 * @return {String} content
 */
pro.stringify = function(){
    var ret = [],
        flag = this._options.cprsFlag,
        nocps = flag===1,
        single = flag===2;
    this.buffer.forEach(function(it){
        // check no compress flag
        if (it===STATE.BEG_NOCPRS){
            nocps = !0;
            return;
        }
        if (it===STATE.END_NOCPRS){
            nocps = !1;
            return;
        }
        if (typeof it !== 'string'){
            it = _tag.stringify(it);
        }
        // not compress
        if (!nocps){
            //it = it.trim().replace(/[\r\n]\s*/g,'\n');
            //if (!!it){
            //    it += '\n';
            //}
            it = it.replace(/[ \t\v\f]*(\r?\n)[ \t\v\f]*/g,'$1');
        }
        if (!!it){
            ret.push(it);
        }
    });
    // remove empty line
    var arr = ret.join('').split(/[\r\n]/);
    for(var i=arr.length- 1,it;i>=0;i--){
        it = arr[i].trim();
        if (!it){
            arr.splice(i,1);
        }
    }
    return arr.join(single?' ':'\n');
};
/**
 * reset parse state
 * @private
 * @param  {Object} config - config object
 * @return {Void}
 */
pro._reset = function(config){
    // export variable
    this.buffer         = null;
    this.styles         = null;
    this.scripts        = null;
    this.modules        = null;
    this.templates      = null;
    this.stylePoint     = -1;
    this.scriptPoint    = -1;
    this.modulePoint    = -1;
    this.templatePoint  = -1;
    this.styleConfig    = {};
    this.scriptConfig   = {};
    this.moduleConfig   = {};
    this.templateConfig = {};
    // private variable
    this._ignorePoint  = -1;
    this._file          = config.file;
    this._state         = STATE.NULL;
    this._options       = _util.fetch(
        DEFAULT,config
    );
    // init core flag
    var flag = this._options.noCoreFlag;
    if (flag===1||flag===3){
        this.styleConfig.core = !1;
    }
    if (flag===2||flag===3){
        this.scriptConfig.core = !1;
    }
    // inline core flag
    var flag = this._options.inCoreFlag;
    if (flag===1||flag===3){
        this.styleConfig.inline = !0;
    }
    if (flag===2||flag===3){
        this.scriptConfig.inline = !0;
    }
};
/**
 * save resource
 * @private
 * @param  {String} name   - name of resource
 * @param  {Object} event  - event object from tag parser
 * @param  {Object} config - parser config object
 * @return {Void}
 */
pro._saveResource = function(name,event,config){
    var func = TRANSFORM[name];
    if (!!func){
        func.call(this,event,config);
    }
};
/**
 * check has external link adjust
 * @private
 * @param  {Object}  attrs - tag attrs map
 * @return {Boolean} whether has external link
 */
pro._hasExtLinkAdjust = function(attrs){
    // check static resource attr
    var ret = !1,
        pathRoot = path.dirname(this._file)+'/',
        webRoot = this._options.webRoot,
        resRoot = this._options.resRoot,
        ext = this._options.exLinkAttributeFlag,
        reg = this._options.exLinkAttributeName,
        res = this._options.exLinkAttributeRoot;
    Object.keys(attrs).forEach(function(key){
        var lkey = (key||'').toLowerCase(),
            islk = lkey==='src'||lkey==='href',
            file = _path.absoluteAltRoot(
                attrs[key],pathRoot,webRoot
            );
        // adjust path in resource root
        if (islk&&!!resRoot&&file.indexOf(resRoot)>=0){
            if (!_fs.exist(file)){
                this.emit('warn',{
                    data:[file,this._file],
                    message:'resource %s in %s not exist'
                });
                return;
            }
            // need add version
            ret = !0;
            attrs[key] = _path.wrapURI(
                'rs',file
            );
            return;
        }
        // adjust path in html root for server template
        if (!!ext&&
           (islk||(!!reg&&reg.test(lkey)))&&
           (!!res&&file.indexOf(res)>=0)){
            ret = !0;
            attrs[key] = _path.wrapURI(
                'path',file
            );
            return;
        }
    },this);
    return ret;
};
/**
 * style event from tag parser
 * for style
 * <link rel="stylesheet" type="text/css" href="./a.css"/>
 * <style>.a{color:#aaa;}</style>
 * <style type="text/css">.a{color:#aaa;}</style>
 * for nej template
 * <link rel="nej" type="nej/css" href="./a.css"/>
 * <link rel="nej" type="nej/html" href="./a.html"/>
 * <link rel="nej" type="nej/javascript" href="./a.js"/>
 * <style type="nej/css">.a{color:#aaa;}</style>
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onStyle = function(event){
    var conf = event.config||{},
        type = (conf.type||'').toLowerCase().trim();
    // check external style
    // check nej external template
    if (!!conf.href){
        var name,ropt = {},
            rel = (conf.rel||'').toLowerCase().trim();
        if (rel.indexOf('stylesheet')>=0){
            name = 'style';
        }else if(rel==='nej'){
            name = 'template';
            ropt.type = type;
        }
        if (!!name){
            ropt.uri = conf.href;
            this._saveResource(name,event,ropt);
        }
        return;
    }
    // check inline style
    var name,ropt = {},
        flag = this._options.noParseFlag;
    if ((!type||type==='text/css')&&(flag!==1&&flag!==3)){
        name = 'style';
    }
    // check nej inline style template
    if (type.indexOf('nej/')===0){
        name = 'template';
        ropt.type = type;
        ropt.id = conf.id;
    }
    if (!!name){
        ropt.text = (event.source||'').trim();
        this._saveResource(name,event,ropt);
    }
};
/**
 * script event from tag parser
 * for script
 * <script src="./a.js"></script>
 * <script>var a = "aaa";</script>
 * <script type="text/javascript">var a = "aaa";</script>
 * for nej template
 * <script type="nej/css">.a{color:#aaa;}</script>
 * <script type="nej/html"><div>xxxx</div></script>
 * <script type="nej/javascript">var a = "aaaa";</script>
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onScript = (function(){
    var _reg0 = /(text|application)\/(x-)?javascript/i;
    var _getModuleRoot = function(code){
        var sandbox = {location:{}};
        try{
            //eval(code);
            vm.createContext(sandbox);
            vm.runInContext(code,sandbox);
            var root = sandbox.location.config.root;
            if (root!=null){
                return root;
            }
        }catch(ex){
            // ignore
        }
    };
    return function(event){
        var conf = event.config||{},
            type = (conf.type||'').toLowerCase().trim(),
            isscript = !type||_reg0.test(type);
        // check external script
        if (!!conf.src&&isscript){
            // check NEJ define.js
            var ropt = {
                    entry:!0,
                    uri:conf.src
                },
                isnej = this._state===STATE.SCRIPT;
            if (!isnej){
                if (_nej.isNEJDefine(ropt.uri||'')){
                    isnej = !0;
                    this.emit('warn',{
                        data:[ropt.uri],
                        message:'auto set nej define.js -> %s'
                    });
                }
            }else{
                this._state = STATE.NULL;
            }
            if (isnej){
                ropt.entry = !1;
                ropt.defined = !0;
            }
            this._saveResource(
                'script',event,ropt
            );
            return;
        }
        // check inline script
        var name,ropt = {},
            text = (event.source||'').trim();
        if (isscript){
            // check nej module config
            if (this._state===STATE.VERSION){
                this._state = STATE.NULL;
                var root = _getModuleRoot(text);
                if (root!=null){
                    var file = _path.absoluteAltRoot(
                        root,path.dirname(this._file)+'/',
                        this._options.webRoot
                    );
                    this.moduleConfig.root = file;
                    event.value = util.format(
                        "<script>location.config = {root:'%s',ver:%s};</script>",
                        _path.wrapURI('mdl',file),_path.wrapVersion(file)
                    );
                    return;
                }
            }
            // not see NEJ.define as inline source
            var flag = this._options.noParseFlag;
            if ((flag!==2&&flag!==3)||
                _nej.isNEJScript(text)){
                name = 'script';
            }
        }
        // check nej inline template
        if (type.indexOf('nej/')>=0){
            name = 'template';
            ropt.type = type;
            ropt.id = conf.id;
        }
        if (!!name){
            ropt.text = text;
            this._saveResource(name,event,ropt);
        }
    };
})();
/**
 * textarea event from tag parser
 * for textarea
 * <textarea name="txt" id="xxx">xxxx</textarea>
 * <textarea name="jst" id="xxx">xxxx</textarea>
 * <textarea name="ntp" id="xxx">xxxx</textarea>
 * <textarea name="js" data-src="yyy">xxxx</textarea>
 * <textarea name="css" data-src="yyy">xxxx</textarea>
 * <textarea name="html" data-src="yyy">xxxx</textarea>
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onTextarea = function(event){
    var reg = /txt|jst|ntp|js|css|html/i,
        conf = event.config||{},
        ropt = {
            type:(conf.name||'').toLowerCase().trim()
        };
    // check nej inline resource template
    if (reg.test(ropt.type)){
        ropt.id = conf.id;
        ropt.uri = conf['data-src'];
        ropt.text = (event.source||'').trim();
        this._saveResource('template',event,ropt);
    }
};
/**
 * instruction event from tag parser
 * for nej deploy instruction
 * <!-- @STYLE {core:true,inline:true} -->
 * <!-- @SCRIPT {nodep:true,core:true,inline:true} -->
 * <!-- @VERSION -->
 * <!-- @MANIFEST -->
 * <!-- @TEMPLATE -->
 * <!-- @MODULE -->     <!-- /@MODULE -->
 * <!-- @NOPARSE -->    <!-- /@NOPARSE -->
 * <!-- @NOCOMPRESS --> <!-- /@NOCOMPRESS -->
 * <!-- @IGNORE {mode:'online|test|develop'} --> <!-- /@IGNORE -->
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onInstruction = function(event){
    //console.log('instrction -> %j',event);
    var func = INSTRUCTION[event.command];
    if (!!func){
        if (!event.closed){
            // begin
            (func.beg||func).call(this,event);
        }else if(func.end){
            // end
            func.end.call(this,event);
        }
    }else{
        if (!this._options.keepComment){
            event.value = '';
        }
        this.emit('warn',{
            data:[event.command,event.source],
            message:'not supported command %s for %s'
        });
    }
};
/**
 * comment event from tag parser
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onComment = function(event){
    if (!this._options.keepComment){
        event.value = '';
    }
};
/**
 * resource tag filter
 * @private
 * @param  {String} callback - resource type
 * @param  {Object} event    - event object
 * @return {Void}
 */
pro._onResTag = (function(){
    // common parse
    var cmap = {
        style:function(event){
            this._onStyle(event);
        },
        script:function(event){
            // for <script src="{nej_path}"
            var opt = event.config||{},
                src = opt.src;
            if (!!src){
                opt.src = _path.completeURI(
                    src,this._options
                );
            }
            this._onScript(event);
        },
        textarea:function(event){
            this._onTextarea(event);
        }
    };
    // no parse flag
    var nmap = {
        style:function(event){
            var tag = event.tag||{},
                attrs = tag.attrs||{};
            if (this._hasExtLinkAdjust(attrs)){
                event.value = _tag.stringify(event.tag);
            }
        },
        script:function(event){
            var attrs = event.config||{};
            if (this._hasExtLinkAdjust(attrs)){
                var source = _tag.stringify({
                    name:'script',
                    attrs:attrs
                });
                event.value = util.format(
                    '%s</script>',source
                );
            }
        },
        textarea:function(event){
            // do nothing
        }
    };
    return function(type,event){
        // ignore state
        if (this._state===STATE.IGNORE){
            event.value = '';
            return;
        }
        // noparse state
        var map = cmap;
        if (this._state===STATE.NOPARSE){
            map = nmap;
        }
        var func = map[type];
        if (_util.isFunction(func)){
            func.call(this,event);
        }
    };
})();
/**
 * tag event from tag parser
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onTag = function(event){
    var tag = event.tag||{},
        attrs = tag.attrs||{};
    // check manifest for html
    if (this._state===STATE.MANIFEST&&
        tag.name.toLowerCase()==='html'){
        event.value = event.tag;
        this._state = STATE.NULL;
        attrs.manifest = _path.wrapURI(
            'mf','cache.mf'
        );
        return;
    }
    // check module insert point, before </body>
    if (!!this.modules&&tag.name.toLowerCase()==='body'&&tag.closed){
        this.modulePoint = event.buffer.length;
        event.buffer.push('');
        return;
    }
    // check external link adjust
    if (this._hasExtLinkAdjust(attrs)){
        tag.source = _tag.stringify(event.tag);
        return;
    }
};
/**
 * text in style/script/textarea
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onResText = function(event){
    // ignore text in resource text
    if (this._state===STATE.IGNORE){
        event.value = '';
    }
};
/**
 * text event from tag parser
 * @private
 * @param  {Object} event - event object
 * @return {Void}
 */
pro._onText = function(event){
    // TODO something
};