/*
 * NEJ Patcher Parser
 * @module   script/nej/patcher
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
   _util = require('./util.js'),
   _dep  = require('../../util/dependency.js'),
   _path = require('../../util/path.js');
// nej patch parser
// expression     platform expression
// dependency     dependency list
// source         source code
var Patcher = module.exports =
    require('../../util/klass.js').create();
var pro = Patcher.extend(require('../parser.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._source = config.source||'';
    this._expression = _util.parseExpression(
        config.expression
    );
    this._dependencies = config.dependency||[];
};
/**
 * whether patcher fit to platform
 * @param  {String} platform - platform config
 * @return {Boolean} whether fit to platform
 */
pro.isFit = function(platform){
    return _util.isExpFitPlatform(
        this._expression,platform
    );
};
/**
 * parse script file cotent
 * @param  {Object} config - parse config
 * @param  {String} config.pathRoot - file path
 * @param  {String} config.webRoot  - web root path
 * @param  {String} config.platformName - platform argument name
 * @return {Void}
 */
pro.parse = function(config){
    // complete uri
    this._dependencies.forEach(
        function(uri,index,list){
            list[index] = _util.parseURI(uri,config);
        }
    );
    // reformat source
    if (!!this._source){
        var cndt = _util.exp2condition(
            config.platformName,
            this._expression
        );
        var args = _util.deps2injector(
            this._dependencies
        );
        args.unshift(_path.uri2key(),this._source);
        this._source = util.format(
            'if (%s){%s(%s);}',
            cndt,_util.getConfig('nejInjector'),args.join(',')
        );
        _dep.injectable(!0);
    }
};
/**
 * stringify script file content
 * @param  {Object} config - parse config
 * @return {String} file content
 */
pro.stringify = function(config){
    return this._source;
};
/**
 * dump patcher dependency list
 * @return {Array} dependency list
 */
pro.getDependencies = function(){
    return this._dependencies;
};