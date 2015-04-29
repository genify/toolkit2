var util     = require('util'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // parse style
    this.parse = function(){
        // TODO
    };
};
util.inherits(ResStyle,_Resource);