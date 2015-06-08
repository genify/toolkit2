/*
 * Template Resource Class
 * @module   meta/template
 * @author   genify(caijf@corp.netease.com)
 */
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