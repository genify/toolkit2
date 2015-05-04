var util      = require('util'),
    path      = require('path'),
    _tag      = require('./tag.js'),
    _fs       = require('../util/file.js'),
    _path     = require('../util/path.js'),
    _util     = require('../util/util.js'),
    _Abstract = require('../event.js');
var _ResStyle    = require('../meta/style.js'),
    _ResScript   = require('../meta/script.js'),
    _ResTemplate = require('../meta/template.js');
// html parser config

// file                     local file path
// filepath                 file path, can be remote url
// content                  file content, need filepath if use this property
// ignoreMode               ignore code if mode matches ignore config
// keepComment              not remove html comment
// notParseInlineStyle      not parse inline style flag
// notParseInlineScript     not parse inline script flag
var Parser = module.exports = function(config){
    _Abstract.apply(this,arguments);
    // nej deploy comment state
    var STATE_NULL       = 0,
        STATE_SCRIPT     = 1,
        STATE_MODULE     = 2,
        STATE_IGNORE     = 3,
        STATE_NOPARSE    = 4,
        STATE_VERSION    = 5;
    // default config
    var DEFAULT_CONFIG = {
        ignoreMode           : 'online',
        keepComment          : !1,
        notParseInlineStyle  : !1,
        notParseInlineScript : !1
    };
    // private cache
    var _gState,_gOption,_gIgnPoint;
    var _doReset = function(options){
        _gState  = STATE_NULL;
        _gOption = _util.fetch(
            DEFAULT_CONFIG,options
        );
        // attr can be visited
        this.buffer              = null;
        this.styles              = [];
        this.scripts             = [];
        this.modules             = [];
        this.templates           = [];
        this.manifest            = !1;
        this.styleConfig         = {};
        this.scriptConfig        = {};
        this.moduleConfig        = {};
        this.noCompressPoint     = [-1,-1];
        this.styleInsertPoint    = -1;
        this.scriptInsertPoint   = -1;
        this.versionInsertPoint  = -1;
        this.templateInsertPoint = -1;
    };
    // dump content
    var _doDumpContent = function(file){
        var content;
        this.file = _path.absolute(
            file,process.cwd()+'/'
        );
        if (_fs.exist(this.file)){
            content = _fs.read(this.file);
            if (!!content){
                content = content.join('\n');
            }else{
                this.emit('warn',{
                    data:[this.file],
                    message:'empty content for %s'
                });
            }
        }else{
            this.emit('error',{
                data:[this.file],
                message:'file not exist -> %s'
            });
        }
        return content||'';
    };
    // save resource
    var _doSaveResource = function(name,event,conf){
        if (!conf.file){
             conf.file = this.file;
        }
        switch(name){
            case 'style':
                this.styles.push(
                    new _ResStyle(conf)
                );
                if (this.styleInsertPoint<0){
                    this.styleInsertPoint = event.buffer.length;
                }
            break;
            case 'script':
                this.scripts.push(
                    new _ResScript(conf)
                );
                if (this.scriptInsertPoint<0){
                    this.scriptInsertPoint = event.buffer.length;
                }
            break;
            case 'template':
                var cache = 
                    _gState===STATE_MODULE
                    ? this.modules
                    : this.templates;
                cache.push(new _ResTemplate(conf));
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
        console.log('style -> %j',event);
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
                ropt.url = conf.href;
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
            _reg1 = /[\\\/]define\.js$/i;
        var _isNEJDefine = function(url){
            return _reg1.test(url||'');
        };
        var _doParseNEJModule = function(code){
            var location = {};
            try{
                eval(code);
                if (!!location.config.root){
                    this.moduleConfig.root = location.config.root;
                }
                return !0;
            }catch(ex){
                // ignore
            }
        };
        var _doParseNEJConfig = function(url){
            
        };
        return function(event){
            console.log('script -> %j',event);
            var conf = event.config||{},
                type = (conf.type||'').toLowerCase().trim(),
                issp = !type||_reg0.test(type);
            // check external script
            if (!!conf.src&&issp){
                // check NEJ define.js
                var src = conf.src,
                    ishd = _gState===STATE_SCRIPT;
                if (ishd||_reg1.test(src||'')){
                    if (ishd){
                        _gState = STATE_NULL;
                    }
                    _doParseNEJConfig.call(this,src);
                    event.value = '';
                    src = '_NEJ_INJECTOR_';
                }
                _doSaveResource.call(
                    this,'script',event,{
                        url:src
                    }
                );
                return;
            }
            // check inline script
            var name,ropt = {},
                text = (event.source||'').trim();
            if (issp){
                // check nej module config
                if (_gState===STATE_VERSION){
                    _gState = STATE_NULL;
                    if (_doParseNEJModule.call(this,text)){
                        this.versionInsertPoint = event.buffer.length;
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
    var _onTextarea = (function(){
        var _inTypeMap = {
            txt : 'nej/text',
            jst : 'nej/jst',
            ntp : 'nej/ntp'
        };
        var _exTypeMap = {
            js   : 'nej/javascript',
            css  : 'nej/css',
            html : 'nej/html'
        };
        return function(event){
            console.log('textarea -> %j',event);
            var conf = event.config||{},
                name = (conf.name||'').toLowerCase().trim(),
                ropt = {type:_inTypeMap[name]};
            // check inline resource template
            if (!!ropt.type){
                ropt.id = conf.id;
                ropt.text = (event.source||'').trim();
                _doSaveResource.call(this,'template',event,ropt);
                return;
            }
            // check external resource template
            ropt.type = _exTypeMap[name];
            if (!!ropt.type){
                ropt.url = conf['data-src'];
                ropt.text = (event.source||'').trim();
                _doSaveResource.call(this,'template',event,ropt);
            }
        };
    })();
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
                this.styleInsertPoint = event.buffer.length;
                this.styleConfig = _util.merge(
                    this.styleConfig,event.config
                );
                event.buffer.push('');
            },
            SCRIPT:function(event){
                this.scriptInsertPoint = event.buffer.length;
                this.scriptConfig = _util.merge(
                    this.scriptConfig,event.config
                );
                event.buffer.push('');
                if (!this.scriptConfig.nodep){
                    _gState = STATE_SCRIPT;
                }
            },
            NOCOMPRESS:{
                beg:function(event){
                    this.noCompressPoint[0] = event.buffer.length;
                },
                end:function(event){
                    this.noCompressPoint[1] = event.buffer.length-1;
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
                this.templateInsertPoint = event.buffer.length;
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
                this.versionInsertPoint = event.buffer.length;
                event.buffer.push('');
                _gState = STATE_VERSION;
            },
            IGNORE:{
                beg:function(event){
                    // check ignore state
                    var mode = (event.config||{}).mode||'online';
                    if (mode.indexOf(_gOption.ignoreMode)>=0){
                        _gState = STATE_IGNORE;
                        _gIgnPoint = event.buffer.length;
                    }
                },
                end:function(event){
                    // remove ignore content
                    if (_gState===STATE_IGNORE){
                        _gState = STATE_NULL;
                        var count = event.buffer.length-_gIgnPoint;
                        if (count>0){
                            event.buffer.splice(_gIgnPoint,count);
                        }
                        _gIgnPoint = null;
                    }
                }
            },
            MANIFEST:function(event){
                this.manifest = !0;
            }
        };
        _insFuncMap.DEFINE = _insFuncMap.SCRIPT;
        return function(event){
            console.log('instrction -> %j',event);
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
        console.log('comment -> %j',event);
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
    // update by file path
    this.update = function(file,options){
        var content = _doDumpContent.call(this,file);
        this.updateByContent(content,options);
    };
    // update by content
    this.updateByContent = function(content,options){
        _doReset.call(this,options);
        if (!!content){
            var self = this;
            var parser = new _tag.Parser(
                content,{
                    style:_onResTag.bind(this,_onStyle),
                    script:_onResTag.bind(this,_onScript),
                    textarea:_onResTag.bind(this,_onTextarea),
                    instruction:function(){
                        _onInstruction.apply(self,arguments);
                    },
                    comment:function(){
                        _onComment.apply(self,arguments);
                    }
                }
            );
            this.buffer = parser.dump();
        }
    };
    // parse resource
    this.parseResource = function(config){
        
    };
    
    // update html content
    config = config||{};
    if (!!config.file){
        this.update(config.file,config);
    }else if(!!config.content){
        this.file = config.filepath;
        this.updateByContent(config.content,config);
    }
};
util.inherits(Parser,_Abstract);
