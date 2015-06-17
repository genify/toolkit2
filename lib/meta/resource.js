/*
 * Abstract Resource Class
 * @module   meta/resource
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _io   = require('../util/io.js'),
   _fs   = require('../util/file.js'),
   _util = require('../util/util.js'),
   _path = require('../util/path.js');
// resource in html file
// uri      external resource path
// charset  charset of file uri
// text     inline resource content
// file     html filename for resource
var Resource = module.exports =
    require('../util/klass.js').create();
var pro = Resource.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._uri = config.uri;     // external resource uri
    this._text = config.text;   // inline resource code
    this._file = config.file;   // file path for resource
};
/**
 * resource parse
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    config = _util.merge(
        this.getLogger(),config,{
            pathRoot:path.dirname(this._file)+'/'
        }
    );
    this._uri = this._completeURI(
        this._uri,config
    );
    if (!!this._uri){
        // load file content
        var callback = function(event){
            event.value = this._parseContent(
                this._uri,event.value,config
            );
        };
        this.emit('debug',{
            data:[this._uri],
            message:'cache resource %s'
        });
        _io.get(
            this._uri,
            callback.bind(this),
            this._adjustCharset(config)
        );
    }
    // parse text
    if (!!this._text){
        var file = config.pathRoot+'inline-'+_util.increment(),
            ret = this._parseContent(file,this._text,config);
        _io.cache(file,ret);
        this._text = file;
    }
};
/**
 * stringify resource
 * @return {String} resource source
 */
pro.stringify = function(){
    // OVERWRITE by SubClass implementation
};
/**
 * get resource path
 * @returns {String} resource path
 */
pro.getURI = function(){
    return this._uri;
};
/**
 * get resource dependency list
 * @param  {Object} config - config object
 * @return {Array}  dependency list
 */
pro.getDependencies = function(config){
    var ret = [];
    if (!!this._uri){
        ret.push(this._uri);
    }
    if (!!this._text){
        ret.push(this._text);
    }
    return ret;
};
/**
 * parse file content with config, overwrited by subclass
 * @protected
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {Object} config  - config object
 * @return {String} file content after parse
 */
pro._parseContent = function(file,content,config){
    this.emit('debug',{
        data:[file],
        message:'parse resource %s'
    });
    // OVERWRITE by SubClass implementation
};
/**
 * adjust file read charset
 * @protected
 * @param  {Object} config - config object
 * @return {String}
 */
pro._adjustCharset = function(config){
    return config.charset;
};
/**
 * complete url with config
 * @protected
 * @param  {String} uri    - original url
 * @param  {Object} config - config object
 * @return {String} url after complete
 */
pro._completeURI = function(uri,config){
    if (!uri){
        return;
    }
    // check file exist
    if (_fs.exist(uri)&&uri.indexOf('.')!=0){
        return uri;
    }
    // replace parameters in dict
    uri = _path.completeURI(uri,config);
    // absolute url
    var pathRoot = path.dirname(this._file)+'/';
    uri = _path.absoluteAltRoot(
        uri,pathRoot,config.webRoot
    );
    return uri;
};