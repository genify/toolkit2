var util     = require('util'),
    path     = require('path'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _nej      = require('../parser/nej.js'),
   _Abstract = require('../event.js');
// resource in html file
var Resource = module.exports = function(config,events){
    _Abstract.apply(this,arguments);
    
    // private/protected variable
    var _gResMap = {};
    this._resReg = null;
    
    // parse resource
    // webRoot      web root
    // aliasReg     regexp of alias in path
    // aliasDict    dictionary of alias in path
    this.parse = function(config){
        // parse url
        if (!!this.url){
            var url = this.url.replace(
                config.aliasReg,function($1,$2){
                    return config.aliasDict[$2]||$1;
                }
            );
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
    // parse url
    this._parseURL = function(config){
        // TODO SubClass implementation
    };
    // parse content
    this._parseText = function(config){
        // TODO SubClass implementation
    };
    // parse nej file
    this._parseNEJFile = function(file,content,config){
        // check define() or NEJ.define()
        var result = _nej.tryNEJFile(content);
        if (!result){
            // not nej file
            return content;
        }
        // parse nej information
        this.nej = new _nej.Parser({
            file:file,
            depList:result.deps,
            sourceCode:result.code
        });
        this.nej.parse(config);
        return this.nej.source;
    };
    // dump static resource
    this._parseStaticResource = (function(){
        var seed = +new Date;
        return function(content,config){
            if (!this._resReg){
                return content;
            }
            var pathRoot = this.referrer,
                webRoot = config.webRoot;
            return (content||'').replace(
                this._resReg,function($1,$2){
                    var file = _path.absoluteAltRoot(
                        $2,pathRoot,webRoot
                    );
                    if (_fs.exist(file)){
                        var key = seed++;
                        _gResMap[key] = file;
                        return util.format('url(%s)',key);
                    }
                    return $1;
                }
            );
        };
    })();
    // init config
    config = config||{};
    this.url  = config.url;
    this.text = config.text;
    this.inPage = !!this.url;
    this.referrer = path.dirname(config.file)+'/';
};
util.inherits(Resource,_Abstract);