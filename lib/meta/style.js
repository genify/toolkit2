var util     = require('util'),
   _fs       = require('../util/file.js'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // private variable
    this._resReg = /url\((.*?)\)/gi;
    
    // parse style by url
    this._parseURL = function(config){
        _fs.cache(this.url,function(event){
            if (!event.fromCache){
                event.value = this._parseStaticResource(
                    event.value,config
                );
            }
        }.bind(this));
    };
    // parse style with content
    this._parseText = function(config){
        
    };
};
util.inherits(ResStyle,_Resource);