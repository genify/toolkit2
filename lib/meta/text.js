/*
 * Text Resource Class
 * @module   meta/text
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
   _Resource = require('./resource.js');
// text template in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);

    // parse style content
    this._parseContent = function(file,content,config){
        return content;
    };

    // init config
    config = config||{};
    this.id = config.id;
    this.type = config.type;
};
util.inherits(ResStyle,_Resource);