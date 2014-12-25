var util     = require('util'),
    path     = require('path'),
   _path     = require('../util/path.js'),
   _mmry     = require('../util/memory.js'),
   _Abstract = require('../event.js');
// style parser
var Parser = module.exports = function(config){
    _Abstract.apply(this,arguments);
    // download style file
    var _doDownloadStyle = (function(){
        var count = 0;
        return function(url){
            
        };
    })();
    // check style list
    var _doCheckStyle = function(list){
        // style list {file:'',source:''}
        for(var i=list.length-1,it;i>=0;i--){
            it = list[i];
            // split empty style
            if (!it.file&&!it.source){
                list.splice(i,1);
                continue;
            }
            // check remote style
            if (!!it.file&&_path.isURL(it.file)){
                
            }
        }
        
    };
    var _gList = config.list||[];
    
    
};
util.inherits(Parser,_Abstract);