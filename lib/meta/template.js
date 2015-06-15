/*
 * Template Resource Class
 * @module   meta/template
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
   _io   = require('../util/io.js'),
   _path = require('../util/path.js');
// template in html template
var Template = module.exports =
    require('../util/klass.js').create();
var pro = Template.extend(require('./resource.js'));
/**
 * resource parse
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    this._uri = this._completeURI(
        this._uri,config
    );
    // do nothing
    console.log('parse template %s',this._uri);
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
                _path.wrapURI('html',this._uri),content
            );
        }
    }
    return content;
};