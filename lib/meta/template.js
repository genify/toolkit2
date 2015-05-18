var util     = require('util'),
   _network  = require('../util/network.js'),
   _Resource = require('./resource.js');
// template in page
var ResTemplate = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // inline resource handler map
    var _inMap = {
        text:function(config){
            
        },
        jst:function(config){
            
        },
        ntp:function(config){
            
        },
        css:function(config){
            this.text = this._parseStaticResource(
                this.text,config
            );
        },
        javascript:function(config){
            this.text = this._parseScriptContent(
                this.referrer+this._randFileName(),
                this.text,config
            );
        }
    };
    // external resource handler map
    var _exMap = {
        css:function(config){
            _network.get(this.url,function(event){
                if (!event.fromCache){
                    event.value = this._parseStaticResource(
                        event.value,config
                    );
                }
            }.bind(this));
        },
        html:function(config){
            this.html = new require('../parser/html.js')({
                file:this.url,
                charset:config.charset
            });
            this.html.parseResource(config);
        },
        javascript:function(config){
            _network.get(this.url,function(event){
                if (!event.fromCache){
                    event.value = this._parseScriptContent(
                        this.url,event.value,config
                    );
                }
            }.bind(this));
        }
    };
    // parse template by url
    this._parseURL = function(config){
        var func = _exMap[this.url];
        if (!!func){
            func.call(this,config);
        }
    };
    // parse template with content
    this._parseText = function(config){
        var func = _inMap[this.url];
        if (!!func){
            func.call(this,config);
        }
    };
    // init config
    config = config||{};
    this.id = config.id;
    this.type = config.type;
};
util.inherits(ResTemplate,_Resource);