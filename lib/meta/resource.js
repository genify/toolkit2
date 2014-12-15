var util     = require('util'),
   _Abstract = require('../event.js');
// resource in html file
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    
    config = config||{};
    // resource url
    var _url;
    this.setURL = function(url){
        
    };
    this.getURL = function(){
        return _url;
    };
    // resource text
    var _text;
    this.setText = function(text){
        
    };
    this.getText = function(){
        return _text;
    };
    
    
    // init config
    this.setURL(config.url);
    this.setText(config.text);
};
util.inherits(Resource,_Abstract);