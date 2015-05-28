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
    this._parseContent = function(file,content,config){
        var parser = new require('../adapter/css.js')({
            file:file,
            content:content
        });
        return parser.stringify(config);
    };
    // adjust static resource
    this.adjust = function(config){

    };
};
util.inherits(ResStyle,_Resource);