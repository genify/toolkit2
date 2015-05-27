/*
 * Html Resource Class
 * @module   meta/html
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
   _util     = require('../util/util.js'),
   _tag      = require('../parser/tag.js'),
   _Resource = require('./resource.js');
// html resource parser
// root             page input root
// isTemplate       is server template file
var ResHtml = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // nej deploy comment state
    var STATE_NULL       = 0,
        STATE_SCRIPT     = 1,
        STATE_MODULE     = 2,
        STATE_IGNORE     = 3,
        STATE_NOPARSE    = 4,
        STATE_VERSION    = 5,
        STATE_MANIFEST   = 6;
    // default config
    var DEFAULT_CONFIG = {
        charset               : 'utf-8',
        ignoreMode            : 'online',
        keepComment           : !1,
        noCompress            : !1,
        noCoreFlag            : 0,
        notParseInlineStyle  : !1,
        notParseInlineScript : !1
    };
    // private variable
    var _gState,_gOption,_gParser,
        _gStyles,_gStylePoint,_gStyleConfig,
        _gScripts,_gScriptPoint,_gScriptConfig,_gNEJConfig,
        _gModules,_gModuleConfig,_gTemplates,_gTemplatePoint,
        _gIgnorePoint,_gVersionPoint,_gManifestPoint,_gNoCompressPoint;
    // reset private variable
    var _doReset = function(options){
        _gState  = STATE_NULL;
        _gOption = _util.fetch(
            DEFAULT_CONFIG,options
        );
        _gParser          = null;
        // style information
        _gStyles          = null;
        _gStylePoint      = -1;
        _gStyleConfig     = {};
        // script information
        _gScripts         = null;
        _gScriptPoint     = -1;
        _gScriptConfig    = {};
        _gNEJConfig       = null;
        // module information
        _gModules         = [];
        _gModuleConfig    = {};
        _gVersionPoint    = -1;
        // template information
        _gTemplates       = null;
        _gTemplatePoint   = -1;
        // deploy control
        _gIgnorePoint     = -1;
        _gManifestPoint   = -1;
        _gNoCompressPoint = [-1,-1];
    };
    // save resource
    var _doSaveResource = function(name,event,conf){
        switch(name){
            case 'style':
                if (!_gStyles){
                    _gStyles = new require('../explorer/style.js')({
                        file:this.file
                    });
                }
                _gStyles.push(conf);
                // style insert pointer
                if (_gStylePoint<0){
                    _gStylePoint = event.buffer.length;
                }
            break;
            case 'script':
                if (!_gScripts){
                    _gScripts = new require('../explorer/script.js')({
                        file:this.file
                    });
                }
                _gScripts.push(conf);
                // script insert pointer
                if (_gScriptPoint<0){
                    _gScriptPoint = event.buffer.length;
                }
            break;
            case 'template':
                if (_gState===STATE_MODULE){
                    _doSaveResource.call(
                        this,'module',event,conf
                    );
                    return;
                }
                if (!_gTemplates){
                    _gTemplates = new require('../explorer/template.js')({
                        file:this.file
                    });
                }
                _gTemplates.push(conf);
                if (_gTemplatePoint<0){
                    _gTemplatePoint = event.buffer.length;
                }
            break;
            case 'module':
                _gModules.push(
                    new require('../explorer/template.js')({
                        file:this.file,
                        list:[conf]
                    })
                );
            break;
            default:
                // do nothing
            return;
        }
        // clear source
        event.value = '';
    };
    // for style
    // <link rel="stylesheet" type="text/css" href="./a.css"/>
    // <style>.a{color:#aaa;}</style>
    // <style type="text/css">.a{color:#aaa;}</style>
    // for nej template
    // <link rel="nej" type="nej/css" href="./a.css"/>
    // <link rel="nej" type="nej/html" href="./a.html"/>
    // <link rel="nej" type="nej/javascript" href="./a.js"/>
    // <style type="nej/css">.a{color:#aaa;}</style>
    var _onStyle = function(event){
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
                _doSaveResource.call(this,name,event,ropt);
            }
            return;
        }
        // check inline style
        var name,ropt = {};
        if ((!type||type==='text/css')&&
            !_gOption.notParseInlineStyle){
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
            _doSaveResource.call(this,name,event,ropt);
        }
    };
    // for script
    // <script src="./a.js"></script>
    // <script>var a = "aaa";</script>
    // <script type="text/javascript">var a = "aaa";</script>
    // for nej template
    // <script type="nej/css">.a{color:#aaa;}</script>
    // <script type="nej/html"><div>xxxx</div></script>
    // <script type="nej/javascript">var a = "aaaa";</script>
    var _onScript = (function(){
        var _reg0 = /(text|application)\/(x-)?javascript/i,
            _reg1 = /\bdefine\.js$/i;
        var _hasModuleVersion = function(code){
            var location = {};
            try{
                eval(code);
                if (!!location.config.root){
                    _gModuleConfig.root = location.config.root;
                }
                return !0;
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
                    isnej = _gState===STATE_SCRIPT;
                if (isnej||_reg1.test(ropt.uri||'')){
                    if (isnej){
                        _gState = STATE_NULL;
                    }
                    ropt.entry = !1;
                    ropt.defined = !0;
                    event.value = '';
                }
                _doSaveResource.call(
                    this,'script',
                    event,ropt
                );
                return;
            }
            // check inline script
            var name,ropt = {},
                text = (event.source||'').trim();
            if (isscript){
                // check nej module config
                if (_gState===STATE_VERSION){
                    _gState = STATE_NULL;
                    if (_hasModuleVersion.call(this,text)){
                        _gVersionPoint = event.buffer.length;
                        event.value = '';
                        return;
                    }
                }
                if (!_gOption.notParseInlineScript){
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
                _doSaveResource.call(this,name,event,ropt);
            }
        };
    })();
    // for textarea
    // <textarea name="txt" id="xxx">xxxx</textarea>
    // <textarea name="jst" id="xxx">xxxx</textarea>
    // <textarea name="ntp" id="xxx">xxxx</textarea>
    // <textarea name="js" data-src="yyy">xxxx</textarea>
    // <textarea name="css" data-src="yyy">xxxx</textarea>
    // <textarea name="html" data-src="yyy">xxxx</textarea>
    var _onTextarea = function(event){
        var reg = /txt|jst|ntp|js|css|html/i,
            conf = event.config||{},
            ropt = {
                type:(conf.name||'').toLowerCase().trim()
            };
        // check nej inline resource template
        if (reg.test(ropt.type)){
            ropt.id = conf.id;
            ropt.uri = conf['data-src'],
            ropt.text = (event.source||'').trim();
            _doSaveResource.call(this,'template',event,ropt);
        }
    };
    // for nej deploy instruction
    // <!-- @STYLE {core:true,inline:true} -->
    // <!-- @SCRIPT {nodep:true,core:true,inline:true} -->
    // <!-- @VERSION -->
    // <!-- @MANIFEST -->
    // <!-- @TEMPLATE -->
    // <!-- @MODULE -->     <!-- /@MODULE -->
    // <!-- @NOPARSE -->    <!-- /@NOPARSE -->
    // <!-- @NOCOMPRESS --> <!-- /@NOCOMPRESS -->
    // <!-- @IGNORE {mode:'online|test|develop'} --> <!-- /@IGNORE -->
    var _onInstruction = (function(){
        var _insFuncMap = {
            STYLE:function(event){
                _gStylePoint = event.buffer.length;
                _gStyleConfig = _util.merge(
                    _gStyleConfig,event.config
                );
                var flag = _gOption.noCoreFlag;
                if (flag===1||flag===3){
                    _gStyleConfig.core = !1;
                }
                event.buffer.push('');
            },
            SCRIPT:function(event){
                _gScriptPoint = event.buffer.length;
                _gScriptConfig = _util.merge(
                    _gScriptConfig,event.config
                );
                var flag = _gOption.noCoreFlag;
                if (flag===2||flag===3){
                    _gScriptConfig.core = !1;
                }
                event.buffer.push('');
                // next external script is nej define.js
                if (!_gScriptConfig.nodep){
                    _gState = STATE_SCRIPT;
                }
            },
            NOCOMPRESS:{
                beg:function(event){
                    _gNoCompressPoint[0] = event.buffer.length;
                },
                end:function(event){
                    _gNoCompressPoint[1] = event.buffer.length-1;
                }
            },
            NOPARSE:{
                beg:function(event){
                    _gState = STATE_NOPARSE;
                },
                end:function(event){
                    _gState = STATE_NULL;
                }
            },
            TEMPLATE:function(event){
                _gTemplatePoint = event.buffer.length;
                event.buffer.push('');
            },
            MODULE:{
                beg:function(event){
                    _gState = STATE_MODULE;
                },
                end:function(event){
                    _gState = STATE_NULL;
                }
            },
            VERSION:function(event){
                _gVersionPoint = event.buffer.length;
                event.buffer.push('');
                // next inline script is module version define
                _gState = STATE_VERSION;
            },
            IGNORE:{
                beg:function(event){
                    // check ignore state
                    var mode = (event.config||{}).mode||'online';
                    if (mode.indexOf(_gOption.ignoreMode)>=0){
                        _gState = STATE_IGNORE;
                        _gIgnorePoint = event.buffer.length;
                    }
                },
                end:function(event){
                    // remove ignore content
                    if (_gState===STATE_IGNORE){
                        _gState = STATE_NULL;
                        var count = event.buffer.length-_gIgnorePoint;
                        if (count>0){
                            event.buffer.splice(_gIgnorePoint,count);
                        }
                        _gIgnorePoint = -1;
                    }
                }
            },
            MANIFEST:function(event){
                _gState = STATE_MANIFEST;
            }
        };
        _insFuncMap.DEFINE = _insFuncMap.SCRIPT;
        return function(event){
            //console.log('instrction -> %j',event);
            var func = _insFuncMap[event.command];
            if (!!func){
                if (!event.closed){
                    // begin
                    (func.beg||func).call(this,event);
                }else if(func.end){
                    // end
                    func.end.call(this,event);
                }
            }else{
                if (!_gOption.keepComment){
                    event.value = '';
                }
                this.emit('warn',{
                    data:[event.command,event.source],
                    message:'not supported command %s for %s'
                });
            }
        };
    })();
    // for comment
    var _onComment = function(event){
        if (!_gOption.keepComment){
            event.value = '';
        }
    };
    // resource tag parser
    var _onResTag = function(callback,event){
        // ignore state
        if (_gState===STATE_IGNORE){
            event.value = '';
            return;
        }
        // noparse state
        if (_gState!==STATE_NOPARSE){
            callback.call(this,event);
        }
    };
    // for tag
    var _onTag = function(event){
        var attrs = (event.tag||{}).attrs||{};
        // check manifest for html
        if (_gState===STATE_MANIFEST&&
            attrs.name.toLowerCase()==='html'){
            _gState = STATE_NULL;
            event.value = event.tag;
            return;
        }
        // check static resource attr
        var ret = [],
            reg = _gOption.exLinkAttributeName;
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
    };
    // for text content
    var _onText = function(event){
        // TODO something
    };
    // parse html content
    this._parseContent = function(file,content,config){
        _doReset.call(this,config);
        // parse html content
        var logger = _util.merge(
            this._logger, {
                tag: _onTag.bind(this),
                text: _onText.bind(this),
                comment: _onComment.bind(this),
                style: _onResTag.bind(this, _onStyle),
                script: _onResTag.bind(this, _onScript),
                textarea: _onResTag.bind(this, _onTextarea),
                instruction: _onInstruction.bind(this)
            }
        );
        _gParser = new _tag.Parser(
            content, logger
        );
        return _gParser;
    };
    // hasCore      core file in page
    // fileList     css file list after core split
    // outputFile   css file output path
    var _gStyleOutput;
    // zip style
    this.zipStyle = function(config){
        _gStyleOutput = {
            hasCore:_gStyleConfig.core,
            fileList:this.getDependencies({
                resType:'cs'
            })
        };
        // check core list
        var core = config.core;
        if (!core||!core.length){
            _gStyleOutput.hasCore = !1;
        }
        // split core file
        if (_gStyleOutput.hasCore==null){
            _gStyleOutput.hasCore = !1;
            var list = _gStyleOutput.fileList;
            for(var i=list.length--,index;i>=0;i--){
                index = core.indexOf(list[i]);
                if (index>=0){
                    list.splice(index,1);
                    _gStyleOutput.hasCore = !0;
                }
            }
        }
        // generate output path
        if (_gStyleOutput.fileList.length>0){

        }
    };
    // zip script
    this.zipScript = function(config){

    };
    // zip template
    this.zipTemplate = function(config){

    };
    // zip module
    this.zipModule = function(config){

    };
    // output content
    this.output = function(config){

    };

    // init config
    config = config||{};
    this.root = config.root;
    this.isTemplate = !!config.isTemplate;

    

};
util.inherits(ResHtml,_Resource);