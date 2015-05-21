var util     = require('util'),
    path     = require('path'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _util     = require('../util/util.js'),
   _nej      = require('../parser/nej.js'),
   _CSParser = require('../parser/css.js'),
   _Abstract = require('../event.js');
// resource in html file
// uri      external resource path
// text     inline resource content
// file     html filename for resource
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    
    // parse url
    this._parseURL = function(config){
        // TODO SubClass implementation
    };
    // parse content
    this._parseText = function(config){
        // TODO SubClass implementation
    };
    // parse script file
    this._parseScriptContent = function(file,content,config){
        // check nej file
        this.nej = _nej.parseFile(content);
        // not nej file
        if (!this.nej){
            return content;
        }
        // parse nej file
        this.nej.parse(
            _util.merge(config,{
                file:file
            })
        );
        return this.nej.source;
    };
    // parse style content
    this._parseStyleContent = function(file,content,config){
        return new _CSParser({
            file:file,
            content:content
        });
    };
    // rand inline file name
    this._randFileName = (function(){
        var seed = +new Date;
        return function(){
            return 'inline-'+(seed++)+'.js';
        };
    })();
    // parse resource
    // webRoot      web root
    // nejRoot      nej lib root
    // nejPlatform  nej platform config
    // aliasReg     regexp of alias in path
    // aliasDict    dictionary of alias in path
    this.parse = function(config){
        // parse url
        if (!!this.url){
            if (!!config.aliasReg){
                var dict = config.aliasDict||{};
                this.url = this.url.replace(
                    config.aliasReg,function($1,$2){
                        return dict[$2]||$1;
                    }
                );
            }
            this.url = _path.absoluteAltRoot(
                url,this.referrer,config.webRoot
            );
            this._parseURL(config);
        }
        // parse text
        if (!!this.text){
            this._parseText(config);
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
    // 
    this.getDependencies = function(){
        // TODO SubClass implementation
    };
    // init config
    config = config||{};
    this.url  = config.url;
    this.text = config.text;
    this.inPage = !!this.url;
    this.referrer = path.dirname(config.file)+'/';
};
util.inherits(Resource,_Abstract);