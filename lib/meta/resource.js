var util     = require('util'),
    path     = require('path'),
   _Abstract = require('../event.js');
// resource in html file
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    // parse resource
    // lib          lib root
    // pro          pro root
    // platform     platform placeholder
    this.parse = function(config){
        // SubClass Implement
    };
    config = config||{};
    // init config
    this.url  = config.url;
    this.text = config.text;
    this.referrer = path.dirname(config.file)+'/';
};
util.inherits(Resource,_Abstract);