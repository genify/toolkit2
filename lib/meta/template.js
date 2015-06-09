/*
 * Template Resource Class
 * @module   meta/template
 * @author   genify(caijf@corp.netease.com)
 */
var _io = require('../util/io.js');
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
};
/**
 * serialize template content
 * @return {String} template content
 */
pro.stringify = function(){
    var parser = _io.getFromCache(this._uri);
    // template has been serialized
    if (typeof parser==='string'){
        return parser;
    }
    // serialize template
    var content = parser.stringify();
    _io.cache(this._uri,content);
    return content;
};