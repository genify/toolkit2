/*
 * script exporter
 * @module   export
 * @author   genify(caijf@corp.netease.com)
 */
var Exporter = module.exports =
    require('./util/klass.js').create();
var pro = Exporter.extend(require('./util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);

};


