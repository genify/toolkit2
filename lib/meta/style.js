var util     = require('util'),
   _network  = require('../util/network.js'),
   _Resource = require('./resource.js');
// style in html file
var ResStyle = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // parse style by url
    this._parseURL = function(config){
        _network.get(this.url,function(event){
            if (!event.fromCache){
                event.value = this._parseStyleContent(
                    this.url,event.value,config
                );
            }
        }.bind(this));
    };
    // parse style with content
    this._parseText = function(config){
        this.text = this._parseStyleContent(
            this.referrer+this._randFileName(),
            this.text,config
        );
    };
};
util.inherits(ResStyle,_Resource);