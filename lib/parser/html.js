var util     = require('util'),
    path     = require('path'),
   _tag      = require('./tag.js'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../event.js');
// html parser
var Parser = module.exports = function(file){
    _Abstract.apply(this,arguments);
    // nej deploy state
    var STATE_NULL       = 0,
        STATE_NOCOMPRESS = 1;
    // private cache
    var _gParser,_gConfig,_gState;
    var _doReset = function(){
        _gParser = null;
        _gState  = STATE_NULL;
        _gConfig = {
            style:[],   // page style list
            script:[],  // page script list
            module:[],  // nej module list
            template:[] // nej template list
        };
    };
    // dump content
    var _doDumpContent = function(file){
        var content;
        var absrc = _path.absolute(
            file,process.cwd()+'/'
        );
        if (_fs.exist(absrc)){
            // content from file
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
            // input content
            content = file;
        }
        return content;
    };
    // for style
    var _onStyle = function(event){
        
    };
    // for script
    var _onScript = function(event){
        
    };
    // for textarea
    var _onTextarea = function(event){
        
    };
    // for nej deploy instruction
    var _onInstruction = function(event){
        
    };
    
    // private variable
    this.update = function(file){
        _doReset();
        var content = _doDumpContent.call(this,file);
        if (!!content){
            var self = this;
            _gParser = _tag.Parser(
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
                    }
                }
            );
        }
    };
    // get style list for html file
    this.getStyles = function(){
    
    };
    // get script list for html file
    this.getScripts = function(){
    
    };
    // update parser
    this.update(file);
};
util.inherits(Parser,_Abstract);
