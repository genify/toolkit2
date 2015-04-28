var util     = require('util'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    
};
util.inherits(ResStyle,_Resource);