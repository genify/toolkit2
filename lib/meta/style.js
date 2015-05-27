/*
 * Style Resource Class
 * @module   meta/style
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // parse style content
    var _gParser;
    this._parseContent = function(file,content,config){
        _gParser = new require('../adapter/css.js')({
            file:file,
            content:content
        });
        return _gParser;
    };
};
util.inherits(ResStyle,_Resource);