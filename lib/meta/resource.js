var util     = require('util'),
   _Abstract = require('../event.js');
// resource in html file
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    // parse resource
    this.parse = function(){
        // SubClass Implement
    };
    config = config||{};
    // init config
    this.url = config.url;
    this.text = config.text;
};
util.inherits(Resource,_Abstract);