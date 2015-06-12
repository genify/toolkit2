/*
 * HTML Content Parser
 * @module   parser/html
 * @author   genify(caijf@corp.netease.com)
 */
var _tag    = require('./tag.js'),
    _util   = require('../util/util.js');
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
    charset     : 'utf-8',
    ignoreMode  : 'online',
    keepComment : !1,
    noCompress  : !1,
    noCoreFlag  : 0,
    noParseFlag : 0,
    exLinkAttributeFlag : !1,
    exLinkAttributeName : null
};
// state transform handler
var TRANSFORM = {
    style:function(event,config){
        if (!this.styles){
            var Style = require('../explorer/style.js'),
                opt = _util.merge(this.getLogger(),{
                    file:this.file
                });
            this.styles = new Style(opt);
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
            var Script = require('../explorer/script.js'),
                opt = _util.merge(this.getLogger(),{
                    file:this.file
                });
            this.scripts = new Script(opt);
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
            var Template = require('../explorer/template.js'),
                opt = _util.merge(this.getLogger(),{
                    file:this.file
                });
            this.templates = new Template(opt);
        }
        this.templates.push(config);
        if (this.templatePoint<0){
            this.templatePoint = event.buffer.length;
        }
        event.value = '';
    },
    module:function(event,config){
        var Template = require('../explorer/template.js'),
            opt = _util.merge(this.getLogger(),{
                file:this.file,
                list:[config]
            });
        this.modules.push(new Template(opt));
        event.value = '';
    }
};
// nej instruction config
var INSTRUCTION = {
    STYLE:function(event){
        this.stylePoint = event.buffer.length;
        this.styleConfig = _util.merge(
            this.styleConfig,event.config
        );
        var flag = this._options.noCoreFlag;
        if (flag===1||flag===3){
            this.styleConfig.core = !1;
        }
        event.buffer.push('');
    },
    SCRIPT:function(event){
        this.scriptPoint = event.buffer.length;
        this.scriptConfig = _util.merge(
            this.scriptConfig,event.config
        );
        var flag = this._options.noCoreFlag;
        if (flag===2||flag===3){
            this.scriptConfig.core = !1;
        }
        event.buffer.push('');
        // next external script is nej define.js
        if (!this.scriptConfig.nodep){
            this._state = STATE.SCRIPT;
        }
    },
    NOCOMPRESS:{
        beg:function(event){
            event.buffer.push(STATE.BEG_NOCPRS);
        },
        end:function(event){
            event.buffer.push(STATE.END_NOCPRS);
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
        this.versionPoint = event.buffer.length;
        event.buffer.push('');
        // next inline script is module version define
        this._state = STATE.VERSION;
    },
    IGNORE:{
        beg:function(event){
            // check ignore state
            var mode = (event.config||{}).mode||'online';
            if (mode.indexOf(this._options.ignoreMode)>=0){
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
// - content        html file content
// supported properties
// buffer           content buffer after parse
// styles           style explorers list
// scripts          script explorers list
// templates        template explorers list
// modules          template explorers list
// stylePoint       style insert pointer in buffer
// scriptPoint      script insert pointer in buffer
// versionPoint     nej module version pointer
// templatePoint    template insert pointer in buffer
// manifestPoint    manifest insert pointer in buffer
// styleConfig      style deploy config
// scriptConfig     script deploy config
// moduleConfig     module deploy config
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
    this.update(config.content,config);
};
/**
 * update content parse
 * @param  {String} content - content will be parsed
 * @return {Void}
 */
pro.update = function(content,config){
    this._reset(config);
    var opt = _util.merge(
        this.getLogger(),{
            content     : content||'',
            tag         : this._onTag.bind(this),
            text        : this._onText.bind(this),
            comment     : this._onComment.bind(this),
            style       : this._onResTag.bind(this,'style'),
            script      : this._onResTag.bind(this,'script'),
            textarea    : this._onResTag.bind(this,'textarea'),
            instruction : this._onInstruction.bind(this)
        }
    )
    this.buffer = (new _tag.Parser(opt)).dump();
};
/**
 * parse html file content
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    [
        this.styles,
        this.scripts,
        this.templates,
        this.modules
    ].forEach(function(explorer){
        if (!!explorer){
            explorer.parse(config);
        }
    });
};
/**
 * serialize content
 * @return {String} content
 */
pro.stringify = function(){
    var nocps = !1;
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
        if (!nocps){
            it = it.trim();
        }
        if (!!it){
            ret.push(it);
        }
    });
    return ret.join('\n');
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
    this.templates      = null;
    this.modules        = [];
    this.stylePoint     = -1;
    this.scriptPoint    = -1;
    this.versionPoint   = -1;
    this.modulePoint    = -1;
    this.templatePoint  = -1;
    this.manifestPoint  = -1;
    this.styleConfig    = {};
    this.scriptConfig   = {};
    this.moduleConfig   = {};
    this.templateConfig = {};
    // private variable
    this._ignorePoint   = -1;
    this._state         = STATE.NULL;
    this._options       = _util.fetch(
        DEFAULT,config
    );
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
    var _reg0 = /(text|application)\/(x-)?javascript/i,
        _reg1 = /\bdefine\.js$/i;
    var _getModuleRoot = function(code){
        var location = {};
        try{
            eval(code);
            if (location.config.root!=null){
                return location.config.root;
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
            if (isnej||_reg1.test(ropt.uri||'')){
                if (isnej){
                    this._state = STATE.NULL;
                }
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
                    this.versionPoint = event.buffer.length;
                    this.moduleConfig.root = root;
                    event.value = '';
                    return;
                }
            }
            var flag = this._options.noParseFlag;
            if (flag!==2&&flag!==3){
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
pro._onResTag = function(type,event){
    // ignore state
    if (this._state===STATE.IGNORE){
        event.value = '';
        return;
    }
    // noparse state
    if (this._state!==STATE.NOPARSE){
        switch(type){
            case 'style':
                this._onStyle(event);
            break;
            case 'script':
                this._onScript(event);
            break;
            case 'textarea':
                this._onTextarea(event);
            break;
        }
    }
};
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
        this.manifestPoint = event.buffer.length-1;
        this._state = STATE.NULL;
        event.value = event.tag;
        return;
    }
    // check module insert point
    if (!!this.modules&&tag.name.toLowerCase()==='body'&&tag.closed){
        this.modulePoint = event.buffer.length;
        event.buffer.push('');
        return;
    }
    // check static resource attr
    if (this._options.exLinkAttributeFlag){
        var ret = [],
            reg = this._options.exLinkAttributeName;
        Object.keys(attrs).forEach(function(key){
            var lkey = (key||'').toLowerCase();
            if (lkey==='src'||lkey==='href'||(!!reg&&reg.test(lkey))){
                ret.push(key);
            }
        });
        // buffer tag info with static resource
        if (ret.length>0){
            event.tag.keys = ret;
            event.value = event.tag;
        }
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