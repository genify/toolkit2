/*
 * Html Explorer, used to manage html list
 * @module   explorer/html
 * @author   genify(caijf@corp.netease.com)
 */
var _io   = require('../util/io.js'),
    _util = require('../util/util.js');
// style explorer
var Html = module.exports =
    require('../util/klass.js').create();
var pro = Html.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = function(res){
    return new (require('../meta/html.js'))(res);
};
/**
 *  dump core resource list
 *  @param  {Object}  config - config object
 *  @param  {Number}  config.resFreq - core resource count
 *  @param  {String}  config.resType - core resource type, style or script
 *  @param  {Boolean} config.ignoreEntry - ignore entry for script
 *  @return {Array}   core list
 */
pro.getCoreList = function(config){
    var list  = [],
        test  = {},
        count = config.resFreq;
    this._list.forEach(function(parser){
        var ret = parser.getDependencies({
            checkCoreConfig:!0,
            resType:config.resType,
            ignoreEntry:config.ignoreEntry
        });
        ret.forEach(function(uri){
            if (!test[uri]){
                test[uri] = !0;
            }
            test[uri]++;
            if (test[uri]===count){
                list.push(uri);
            }
        });
    });
    return list;
};
/**
 * merge resource
 * @param  {Object} config - config object
 * @param  {Array}  config.coreStyle  - core style list
 * @param  {Array}  config.coreScript - core script list
 * @param  {String} config.outTplRoot - template output root
 * @param  {String} config.outResRoot - html output root
 * @return {Object} script file config
 */
pro.merge = function(config){
    // cache core list
    _io.cache(
        'core.css',
        _io.fill(config.coreStyle)
    );
    _io.cache(
        'core.js',
        _io.fill(config.coreScript)
    );
    // merge resource
    var jMap = {
        'core.js':['core.js']
    };
    this._list.forEach(function(parser){
        parser.begMerge(config);
        parser.mergeStyle({
            core:config.coreStyle
        });
        var ret = parser.mergeScript({
            core:config.coreScript
        });
        ret.forEach(function(name){
            jMap[name] = [name];
        });
    },this);
    return jMap;
};
/**
 *
 * @param config
 */
pro.embed = function(config){
    this._list.forEach(function(parser){
        parser.embedStyle(
            _util.merge(config,{
                resDomain:this._config.get('DM_STATIC_CS'),
                maxSize:this._config.get('OBF_MAX_CS_INLINE_SIZE')
            })
        );
        parser.embedScript(
            _util.merge(config,{
                resDomain:this._config.get('DM_STATIC_JS'),
                resWrap:this._config.get('X_INSERT_WRAPPER'),
                maxSize:this._config.get('OBF_MAX_JS_INLINE_SIZE')
            })
        );
        parser.embedTemplate({
            resWrap:this._config.get('X_INSERT_WRAPPER')
        });
    },this);
};
