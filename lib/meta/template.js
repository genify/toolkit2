/*
 * Template Resource Class
 * @module   meta/template
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _io   = require('../util/io.js'),
   _path = require('../util/path.js');
// template in html template
var Template = module.exports =
    require('../util/klass.js').create();
var pro = Template.extend(require('./resource.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    this._sfx = '.tpl';
};
/**
 * resource parse
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    this._uri = this._completeURI(
        this._uri,config
    );
};
/**
 * serialize template content
 * @param  {Object} config - config object
 * @param  {String} config.resWrap - template wrapper
 * @return {String} template content
 */
pro.stringify = function(config){
    var content = '',
        parser = _io.getFromCache(this._uri);
    if (!!parser){
        content = parser.stringify();
        if (!!config.resWrap){
            content = util.format(
                config.resWrap,
                _path.wrapURI('umi',this._uri),content
            );
        }
    }
    return content;
};