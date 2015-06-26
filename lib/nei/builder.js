/*
 * Abstract NEI Builder
 * @module   nei/builder
 * @author   genify(caijf@corp.netease.com)
 */
// nei builder
// nei      - nei config get api
// config   - build config object
var NEIBuilder = module.exports
    = require('../util/klass.js').create();
var pro = NEIBuilder.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);

};
/**
 * build project
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.build = function(config){

};
/**
 * update project
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.update = function(config){

};
