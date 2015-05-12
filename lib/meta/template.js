var util     = require('util'),
   _Resource = require('./resource.js');
// template in page
var ResTemplate = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // parse template by url
    this._parseURL = function(config){
        
    };
    // parse template with content
    this._parseText = function(config){
        
    };
    // init config
    config = config||{};
    this.id = config.id;
    this.type = config.type;
};
util.inherits(ResTemplate,_Resource);