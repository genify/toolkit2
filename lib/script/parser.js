var util        = require('util'),
   _Abstract    = require('../util/event.js');
// script file parser
var Parser = module.exports = function(){
    _Abstract.apply(this,arguments);
    // parse file
    this.parse = function(config){
        // OVERWRITE by SubClass Implementation
    };
    // stringify file content
    this.stringify = function(config){
        // OVERWRITE by SubClass Implementation
    };
};
util.inherits(Parser,_Abstract);