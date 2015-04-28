var util     = require('util'),
    path     = require('path'),
   _tag      = require('./tag.js'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _util     = require('../util/util.js'),
   _Abstract = require('../event.js');
var _ResStyle    = require('../meta/style.js'),
    _ResScript   = require('../meta/script.js'),
    _ResTemplate = require('../meta/template.js');
// html parser
// file 
// notParseInlineStyle
// notparseInlineScript
var Parser = module.exports = function(config){
    _Abstract.apply(this,arguments);
    // nej deploy state
    var STATE_NULL       = 0,
        STATE_NOPARSE    = 1,
        STATE_NOCOMPRESS = 2;
    // default config
    var DEFAULT_CONFIG = {
        notParseInlineStyle: !1,
        notparseInlineScript: !1
    };
    // private cache
    var _gState,_gOption;
    var _doReset = function(options){
        _gState  = STATE_NULL;
        _gOption = _util.fetch(
            DEFAULT_CONFIG,options
        );
        // attr can be visited
        this.styles = [];
        this.scripts = [];
        this.templates = [];
        this.styleInsertPoint = -1;
        this.scriptInsertPoint = -1;
        this.templateInsertPoint = -1;
    };
    // dump content
    var _doDumpContent = function(file){
        var content;
        var absrc = _path.absolute(
            file,process.cwd()+'/'
        );
        if (_fs.exist(absrc)){
            this.file = absrc;
            content = _fs.read(absrc);
            if (!!content){
                content = content.join('\n');
            }else{
                this.emit('warn',{
                    data:[absrc],
                    message:'empty content for %s'
                });
            }
        }else{
            this.file = '';
            this.emit('error',{
                data:[absrc],
                message:'file not exist -> %s'
            });
        }
        return content;
    };
    // for style
    var _doSaveStyle = function(name,event,conf){
        switch(name){
            case 'style':
                this.styles.push(
                    new _ResStyle(conf)
                );
                if (this.styleInsertPoint<0){
                    this.styleInsertPoint = event.buffer.length;
                }
            break;
            case 'template':
                this.templates.push(
                    new _ResTemplate(conf)
                );
            break;
            default:
                // do nothing
            return;
        }
        // clear source
        event.value = '';
    };
    var _onStyle = function(event){
        console.log('style -> %j',event);
        var conf = event.config||{};
        // check external style
        // check nej external template
        if (!!conf.href){
            var name,ropt = {},
                rel = (conf.rel||'').toLowerCase().trim();
            if (rel.indexOf('stylesheet')>=0){
                name = 'style';
            }else if(rel==='nej'){
                name = 'template';
                ropt.type = conf.type;
            }
            if (!!name){
                ropt.url = conf.href;
                _doSaveStyle.call(this,name,event,ropt);
            }
            return;
        }
        // check inline style
        var name,ropt = {},
            type = (conf.type||'').toLowerCase().trim();
        if ((!type||type==='text/css')&&
             !_gOption.notParseInlineStyle){
            name = 'style';
        }
        // check nej inline style template
        if (type.indexOf('nej/')===0){
            name = 'template';
            ropt.type = 'text/css';
        }
        if (!!name){
            ropt.text = (event.source||'').trim();
            _doSaveStyle.call(this,name,event,ropt);
        }
    };
    // for script
    var _doSaveScript = function(){
        
    };
    var _onScript = function(event){
        console.log('script -> %j',event);
        var conf = event.config||{};
        // check external script
        if (!!conf.src){
            var type = (conf.type||'').toLowerCase().trim();
            
            
            
        }
    };
    // for textarea
    var _doSaveTemplate = function(){
        
    };
    var _onTextarea = function(event){
        console.log('textarea -> %j',event);
    };
    // for nej deploy instruction
    var _onInstruction = function(event){
        console.log('instrction -> %j',event);
    };
    // for comment
    var _onComment = function(event){
        console.log('comment -> %j',event);
    };
    
    // api
    this.update = function(file,options){
        _doReset.call(this,options);
        var content = _doDumpContent.call(this,file);
        if (!!content){
            var self = this;
            new _tag.Parser(
                content,{
                    style:function(){
                        _onStyle.apply(self,arguments);
                    },
                    script:function(){
                        _onScript.apply(self,arguments);
                    },
                    textarea:function(){
                        _onTextarea.apply(self,arguments);
                    },
                    instruction:function(){
                        _onInstruction.apply(self,arguments);
                    },
                    comment:function(){
                        _onComment.apply(self,arguments);
                    }
                }
            );
        }
    };
    
    // init parser
    config = config||{};
    if (!!config.file){
        this.update(config.file,config);
    }
};
util.inherits(Parser,_Abstract);
