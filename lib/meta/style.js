var util     = require('util'),
   _Style    = require('../adapter/css.js'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // parse style content
    this._parseContent = function(file,content,config){
        return new _Style({
            file:file,
            content:content
        });
    };
};
util.inherits(ResStyle,_Resource);