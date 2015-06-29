/*
 * WebApp Builder
 * @module   nei/webapp
 * @author   genify(caijf@corp.netease.com)
 */
// webapp project builder
// webRoot  - absolute path of web root
// viewRoot - absolute path of server view template
var WebApp = module.exports
    = require('../util/klass.js').create();
var pro = WebApp.extend('./builder.js');
/**
 * filter config field from input
 * @param  {Object} config - config data
 * @return {Object} result will be save to config file
 */
pro.config = function(config){
    return {
        webRoot:config.webRoot,
        viewRoot:config.viewRoot
    };
};
/**
 * build project
 * @param  {Object}  config - config object, parameters return from this.config api
 * @param  {Number}  config.id - project id
 * @param  {Object}  options - build options
 * @param  {Boolean} options.overwrite - whether overwrite mode
 * @param  {Number}  options.checkTime - last update check time
 * @param  {Object}  data - data config from nei platform
 * @return {Void}
 */
pro.build = function(config,options,data){

};
/**
 * update project
 * @param  {Object}  config - config object, parameters return from this.config api
 * @param  {Number}  config.id - project id
 * @param  {Object}  options - update options
 * @param  {Boolean} options.overwrite - whether overwrite mode
 * @param  {Number}  options.checkTime - last update check time
 * @param  {Object}  data - data config from nei platform
 * @return {Void}
 */
pro.update = function(config,options,data){

};