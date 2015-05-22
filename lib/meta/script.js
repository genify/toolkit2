/*
 * Script Resource Class
 * @module   meta/script
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
    path     = require('path'),
   _dep      = require('./dependency.js'),
   _util     = require('../util/util.js'),
   _Resource = require('./resource.js');
// script in html file
var ResScript = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // nej define path
    var _gDefine = _path.absolute(
        '../define.js',
        path.dirname(__filename)+'/'
    );
    // adjust charset
    this._adjustCharset = function(config){
        // force use utf8 for injector and nej file
        if (this.url===_gDefine||
            this.url.indexOf(config.nejRoot)===0){
            return 'utf-8';
        }
        return config.charset;
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
    // get resource dependency list
    var _super = this.getDependencies;
    this.getDependencies = function(config){
        var ret = _dep.complete(
            _super.apply(this,arguments)
        );
        // check ignore entry
        if (config.ignoreEntry&&this.entry){
            var index = ret.indexOf(this.url);
            if (index>=0){
                ret.splice(index,1);
            }
        }
        return ret;
    };
};
util.inherits(ResScript,_Resource);