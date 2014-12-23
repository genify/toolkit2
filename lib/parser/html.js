var util     = require('util'),
    path     = require('path'),
   _tag      = require('./tag.js'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../event.js');

var Parser = module.exports = function(file){
    _Abstract.apply(this,arguments);
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
    // serialize attributes
    var _doSerializeAttr = function(name,attr){
        var arr = [];
        var ist = name.search(/[@#]/)==0;
        var sep = ist?'':'=';
        var dot = ist?'':'"';
        Object.keys(attr).forEach(function(k){
            arr.push(k+sep+dot+attr[k]+dot);
        });
        return arr.join(' ').trim();
    };
    // dump text function map
    var _tmap = {
        style:function(name,attr){
            
        },
        script:function(name,attr){
            
        },
        textarea:function(name,attr){
            
        }
    };
    // private variable
    var _buffer,_config;
    this.update = function(file){
        _buffer = [];
        _config = {style:[],script:[]};
        var content = _doDumpContent.call(this,file);
        if (!content) return;
        
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
