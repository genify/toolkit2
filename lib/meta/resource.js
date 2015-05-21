var util     = require('util'),
    path     = require('path'),
   _io       = require('../util/io.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../event.js');
// resource in html file
// uri      external resource path
// text     inline resource content
// file     html filename for resource
// entry    page entry flag
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    
    // parse content
    this._parseContent = function(){
        // TODO SubClass implementation
    };
    // adjust charset
    this._adjustCharset = function(config){
        return config.charset;
    };
    // parse resource
    // charset      content charset
    // webRoot      web root
    // aliasReg     regexp of alias in path
    // aliasDict    dictionary of alias in path
    this.parse = function(config){
        // parse url
        if (!!this.url){
            // complete url
            if (!_fs.exist(this.url)){
                // replace parameters in dict
                if (!!config.aliasReg){
                    var dict = config.aliasDict||{};
                    this.url = this.url.replace(
                        config.aliasReg,function($1,$2){
                            return dict[$2]||$1;
                        }
                    );
                }
                // absolute url
                this.url = _path.absoluteAltRoot(
                    url,this.referrer,config.webRoot
                );
            }
            // load file content
            var callback = function(event){
                event.value = this._parseContent(
                    this.url,event.value,config
                );
            };
            _io.get(
                this.url,
                callback.bind(this),
                this._adjustCharset(config)
            );
        }
        // parse text
        if (!!this.text){
            var file = this.referrer+'inline-'+_util.increment(),
                ret = this._parseContent(file,this.text,config);
            _io.cache(file,ret);
            this.text = file;
        }
    };
    // adjust static resource
    // webRoot        web root path
    // resRoot        static resource root
    // domain         domain config
    // version        version config
    this.adjust = function(config){
        // TODO SubClass implementation
    };
    // get resource dependency list
    this.getDependencies = function(config){
        // TODO SubClass implementation
    };
    // init config
    config = config||{};
    this.url = config.uri;
    this.text = config.text;
    this.entry = !!config.entry;
    this.referrer = path.dirname(config.file)+'/';
};
util.inherits(Resource,_Abstract);