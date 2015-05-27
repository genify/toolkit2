/*
 * Abstract Resource Class
 * @module   meta/resource
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
    path     = require('path'),
   _io       = require('../util/io.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../event.js');
// resource in html file
// uri      external resource path
// charset  charset of file uri
// text     inline resource content
// file     html filename for resource
// entry    whether page entry flag
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    // parse content
    // not trigger if resource has been in cache
    this._parseContent = function(){
        // OVERWRITE by SubClass implementation
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
        var pathRoot = path.dirname(this.file)+'/';
        // parse url
        if (!!this.uri){
            // complete url
            if (!_fs.exist(this.uri)){
                // replace parameters in dict
                if (!!config.aliasReg){
                    var dict = config.aliasDict||{};
                    this.uri = this.uri.replace(
                        config.aliasReg,function($1,$2){
                            return dict[$2]||$1;
                        }
                    );
                }
                // absolute url
                this.uri = _path.absoluteAltRoot(
                    url,pathRoot,config.webRoot
                );
            }
            // load file content
            var callback = function(event){
                event.value = this._parseContent(
                    this.uri,event.value,config
                );
            };
            _io.get(
                this.uri,
                callback.bind(this),
                this._adjustCharset(config)
            );
        }
        // parse text
        if (!!this.text){
            var file = pathRoot+'inline-'+_util.increment(),
                ret = this._parseContent(file,this.text,config);
            _io.cache(file,ret);
            this.text = file;
        }
    };
    // get resource dependency list
    this.getDependencies = function(config){
        var ret = [];
        if (!!this.uri){
            ret.push(url);
        }
        if (!!this.text){
            ret.push(this.text);
        }
    };
    // init config
    config = config||{};
    this.uri = config.uri;          // external resource uri
    this.text = config.text;        // inline resource code
    this.file = config.file;        // file path for resource
    this.entry = !!config.entry;    // entry of page for resource
};
util.inherits(Resource,_Abstract);