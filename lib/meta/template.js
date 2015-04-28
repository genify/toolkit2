var util     = require('util'),
   _Resource = require('./resource.js');
// template in page
var ResTemplate = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    config = config||{};
    // init config
    this.type = config.type;
};
util.inherits(ResTemplate,_Resource);