var util     = require('util'),
   _Resource = require('./resource.js');
// template in page
var ResTemplate = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // parse template
    this.parse = function(){
        // TODO
    };
    config = config||{};
    // init config
    this.id = config.id;
    this.type = config.type;
};
util.inherits(ResTemplate,_Resource);