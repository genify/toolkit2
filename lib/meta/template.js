/*
 * Template Resource Class
 * @module   meta/template
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
   _Resource = require('./resource.js');
// template in page
var ResTemplate = module.exports = function(config,events){
    _Resource.apply(this,arguments);

    // parse style content
    this._parseContent = function(file,content,config){

    };
};
util.inherits(ResTemplate,_Resource);