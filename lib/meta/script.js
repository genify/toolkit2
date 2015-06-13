/*
 * Script Resource Class
 * @module   meta/script
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _dep  = require('./../util/dependency.js'),
   _nej  = require('../script/nej/util.js'),
   _util = require('../util/util.js'),
   _path = require('../util/path.js');
// script in html file
// entry    whether page entry flag
// defined  whether nej define.js file
var Script = module.exports =
    require('../util/klass.js').create();
var pro = Script.extend(require('./resource.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._isEntry = !!config.entry;         // entry of page for resource
    this._isNEJDefine = !!config.defined;  // nej define.js
};
/**
 * get resource dependency list
 * @param  {Object}  config - config object
 * @param  {Boolean} config.ignoreEntry - ignore entry
 * @return {Array}   dependency list
 */
pro.getDependencies = function(config){
    var ret = _dep.complete(
        this._super(config)
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
/**
 * adjust file read charset
 * @protected
 * @param  {Object} config - config object
 * @return {String}
 */
pro._adjustCharset = function(config){
    // force use utf8 for injector and nej file
    if (this._isNEJDefine||
        this._uri.indexOf(config.nejRoot)===0){
        return 'utf-8';
    }
    return this._super(config);
};
/**
 * complete url with config
 * @protected
 * @param  {String} uri    - original url
 * @param  {Object} config - config object
 * @return {String} url after complete
 */
pro._completeURI = function(uri,config){
    uri = this._super(uri,config);
    if (this._isNEJDefine){
        _nej.cacheConfig(
            _nej.parseConfig(
                uri,config
            )
        );
        uri = _path.absolute(
            './define.js',
            path.dirname(__filename)+'/'
        );
    }
    return uri;
};
/**
 * parse file content with config
 * @protected
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {Object} config  - config object
 * @return {String} file content after parse
 */
pro._parseContent = function(file,content,config){
    this._super(file,content,config);
    // merge nej injector function name
    if (this._isNEJDefine){
        content = content.replace(
            /\[INJECTOR_NAME\]/gi,
            config.nejInjector
        );
        return content;
    }
    // check file content
    config = _util.merge(config,{
        file:file,
        content:content
    });
    // parse file content
    var ret,
        list = config.parsers||[];
    list.unshift('../script/nej.js');
    list.some(function(parser){
        if (typeof parser==='string'){
            parser = require(parser);
        }
        ret = parser.try(config);
        return !!ret;
    });
    // common file content
    if (!ret){
        return content;
    }
    // check parser instance
    var Parser = require('../script/parser.js');
    if (!(ret instanceof Parser)){
        return ret;
    }
    // parse file content
    ret.parse(config);
    return ret.stringify(config);
};