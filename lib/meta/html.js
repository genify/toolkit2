/*
 * Html Resource Class
 * @module   meta/html
 * @author   genify(caijf@corp.netease.com)
 */
var _io     = require('../util/io.js'),
    _util   = require('../util/util.js');
// html resource parser
// root             page input root
// isTemplate       is server template file
var Html = module.exports =
    require('../util/klass.js').create();
var pro = Html.extend(require('./resource.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._root = config.root;
    this._isTemplate = !!config.isTemplate;
};
/**
 * dump resource dependency list
 * @param  {Object}  config - config object
 * @param  {String}  config.resType     - resouce type, style or script
 * @param  {Boolean} config.ignoreEntry - whether ignore entry resource
 * @param  {Boolean} config.checkCoreConfig - whether check core config
 * @return {Array}   dependency list
 */
pro.getDependencies = function(config){
    var ret = [],
        parser = _io.getFromCache(this._uri),
        explorer = parser.scripts,
        pgconfig = parser.scriptConfig||{};
    // check explorer
    if (config.resType==='style'){
        explorer = parser.styles;
        pgconfig = parser.styleConfig||{};
    }
    // dump from style explorer
    if (!!explorer&&(!config.checkCoreConfig||pgconfig.core!==!1)){
        ret.push(explorer.getDependencies(config));
    }
    // dump from template explorer
    if (!!parser.templates){
        ret.push(parser.templates.getDependencies(config));
    }
    return _util.concat.apply(_util,ret);
};
/**
 * begin merge resource
 * @param  {Object} config - config object
 * @param  {String} config.outStaticRoot - static resource output root
 * @param  {String} config.
 * @return {Void}
 */
pro.begMerge = function(config){
    var parser = _io.getFromCache(this._uri);
    // update style config

};
/**
 * merge style
 * @param  {Object} config - config object
 * @param  {Array}  config.core - core css list
 * @return {String}
 */
pro.mergeStyle = function(config){
    config = config||{};
    var core = config.core||[],
        list = this.getDependencies({
            resType:'css'
        });
    // split core file
    core.forEach(function(uri){
        var index = list.indexOf(uri);
        if (index>=0){
            list.splice(index,1);
            this._outputOpt.hasCoreStyle = !0;
        }
    });
    // cache page css content
    var root = this._mergeOpt.outStaticRoot
             + this._outputOpt.style;
    _io.cache(root,_io.fill(list));
};
/**
 *
 * @param config
 */
pro.mergeScript = function(config){

};
/**
 * parse file content with config
 * @protected
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {Object} config  - config object
 * @return {String} file content after parse
 */
pro._parseContent = function(file,content,config){
    var Parser = require('../parser/html.js');
    var opt = _util.merge(config,{
        content:content
    });
    return new Parser(opt);
};
/**
 * parse output style/script name
 * @private
 * @return {Void}
 */
pro._parseOutputName = function(){
    // a/b/c.html
    var name = this._uri.replace(this._root,'');
    // a/b/c
    name = name.split('.');
    name.pop();
    name = name.join('.');
    // a_b_c
    name = name.replace(/\//gi,'_');
    // t_a_b_c
    this._prefix = util.format(
        '%s_%s',this._isTemplate?'t':'p',name
    );
};
/**
 * dump style dependency list
 * @param config
 * @private
 */
pro._getStyleDependencies = function(config){
    var ret = [],
        parser = _io.getFromCache(this._uri);
    // dump from style explorer
    if (!!parser.styles){
        ret.push(parser.styles.getDependencies(config));
    }
    // dump from template explorer
    if (!!parser.templates){
        ret.push(parser.templates.getDependencies(config));
    }
    return _util.concat.apply(_util,ret);
};
/**
 *
 * @param config
 * @private
 */
pro._getScriptDependencies = function(config){

};


