var util    = require('util'),
    path    = require('path'),
    html    = require('parse5'),
   _fs      = require('../util/file.js'),
   _path    = require('../util/path.js'),
    Abstract = require('./parser.js');

var Parser = module.exports = function(file){
    Abstract.apply(this,arguments);
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
    // private variable
    var _root;
    this.update = function(file){
        var content = _doDumpContent.call(this,file);
        if (!content) return;
        
    };
    
    
};
util.inherits(Parser,Abstract);
