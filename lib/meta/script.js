/*
 * Script Resource Class
 * @module   meta/script
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
    path     = require('path'),
   _dep      = require('./../util/dependency.js'),
   _nej      = require('../script/nej.js'),
   _util     = require('../util/util.js'),
   _path     = require('../util/path.js'),
   _Resource = require('./resource.js');
// script in html file
// entry    whether page entry flag
// defined  whether nej define.js file
var ResScript = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // adjust charset
    this._adjustCharset = function(config){
        // force use utf8 for injector and nej file
        if (this.isnej||
            this.uri.indexOf(config.nejRoot)===0){
            return 'utf-8';
        }
        return config.charset;
    };
    // overwrite complete uri
    var _gNEJConfig;
    var _supCompleteURI = this._completeURI;
    this._completeURI = function(uri,config){
        uri = _supCompleteURI.apply(this,arguments);
        if (this.isnej){
            _gNEJConfig = _nej.parseURI(
                uri,config
            );
            uri = _path.absolute(
                '../define.js',
                path.dirname(__filename)+'/'
            );
        }
        return uri;
    };
    // parse script file
    this._parseContent = function(file,content,config){
        // check file content
        var ret,
            list = config.parsers||[];
        list.unshift('../script/nej.js');
        list.some(function(parser){
            if (typeof parser==='string'){
                parser = require(parser);
            }
            ret = parser.parseFile(content);
            return !!ret;
        });
        // common file content
        if (!ret){
            return content;
        }
        // parse file content
        ret.parse(
            _util.merge(config,{
                file:file
            })
        );
        return ret;
    };
    // overwrite get resource dependency list
    var _supGetDependencies = this.getDependencies;
    this.getDependencies = function(config){
        var ret = _dep.complete(
            _supGetDependencies.apply(this,arguments)
        );
        // check ignore entry
        if (config.ignoreEntry&&this.entry){
            var index = ret.indexOf(this.uri);
            if (index>=0){
                ret.splice(index,1);
            }
        }
        return ret;
    };
    //  dump nej config
    this.getNEJConfig = function(){
        return _gNEJConfig;
    };
    // init config
    config = config||{};
    this.isnej = !!config.defined;
};
util.inherits(ResScript,_Resource);