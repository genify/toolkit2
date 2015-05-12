var util     = require('util'),
    path     = require('path'),
   _const    = require('../constant.js'),
   _fs       = require('../util/file.js'),
   _util     = require('../util/util.js'),
   _network  = require('../util/network.js'),
   _Resource = require('./resource.js');
// script in html file
var ResScript = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // rewrite parse resource
    var _super = this.parse;
    this.parse = function(config){
        // check nej injector
        if (this.url===_const.NEJ_DEFINE_URL){
            if (!_network.getFromCache(this.url)){
                var file = path.dirname(__filename)+'/injector.js';
                _network.cache(this.url,_fs.read(file).join('\n'));
            }
            return;
        }
        _super.apply(this,arguments);
    };
    // parse script by url
    this._parseURL = function(config){
        _network.get(this.url,function(event){
            if (!event.fromCache){
                event.value = this._parseScriptContent(
                    this.url,event.value,config
                );
            }
        }.bind(this));
    };
    // parse script with content
    this._parseText = function(config){
        this.text = this._parseScriptContent(
            this.referrer+'inline.js',
            this.text,config
        );
    };
    
    // init setting
    this.inPage = !!this.__url&&this.url!==_const.NEJ_DEFINE_URL;
};
util.inherits(ResScript,_Resource);