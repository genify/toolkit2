/*
 * Abstract File Content Parser
 * @module   script/parser
 * @author   genify(caijf@corp.netease.com)
 */
var Parser = module.exports =
    require('../util/klass.js').create();
var pro = Parser.extend(require('../util/event.js'));
/**
 * parse script file cotent
 * @param  {Object} config - parse config
 * @return {Void}
 */
pro.parse = function(config){
    // OVERWRITE by SubClass Implementation
};
/**
 * stringify script file content
 * @param  {Object} config - parse config
 * @return {String} file content
 */
pro.stringify = function(config){
    // OVERWRITE by SubClass Implementation
};