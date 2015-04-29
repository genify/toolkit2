var util     = require('util'),
   _Resource = require('./resource.js');
// script in html file
var ResScript = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // parse script
    this.parse = function(){
        // TODO
    };
};
util.inherits(ResScript,_Resource);