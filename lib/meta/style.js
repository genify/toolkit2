var util     = require('util'),
   _CSParser = require('../parser/css.js'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // parse style content
    this._parseContent = function(file,content,config){
        return new _CSParser({
            file:file,
            content:content
        });
    };
    // get resource dependency list
    this.getDependencies = function(){
        var ret = [];
        if (!!this.url){
            ret.push(url);
        }
        if (!!this.text){
            ret.push(this.text);
        }
        return ret;
    };
};
util.inherits(ResStyle,_Resource);