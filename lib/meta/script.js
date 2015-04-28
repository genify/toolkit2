var util     = require('util'),
   _Resource = require('./resource.js');
// script in html file
var ResScript = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    
};
util.inherits(ResScript,_Resource);