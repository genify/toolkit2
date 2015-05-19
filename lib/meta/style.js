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
    // adjust static resource
    this.adjust = function(config){
        // stringify css text
        if (!!this.text){
            this.text = this.text.stringify(config);
        }
        // stringify css url
        var parser = _network.getFromCache(this.uri);
        if (!!parser){
            _network.cache(
                this.uri,
                parser.stringify(config)
            );
        }
    };
};
util.inherits(ResStyle,_Resource);