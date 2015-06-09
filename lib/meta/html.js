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
 * parse file content with config
 * @protected
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {Object} config  - config object
 * @return {String} file content after parse
 */
pro._parseContent = function(file,content,config){
    var Parser = require('../parser/html.js');
    var opt = _util.merge(
        this.getLogger(),config,{
            content:content
        }
    );
    var parser = new Parser(opt);
    parser.parse(config);
    return parser;
};
/**
 * dump resource dependency list
 * @param  {Object}  config - config object
 * @param  {String}  config.resType     - resouce type, style or script
 * @param  {Number}  config.listType    - list type for dependency, 0 - all, 1 - only resource list, 2 - resource and template list
 * @param  {Boolean} config.ignoreEntry - whether ignore entry resource
 * @param  {Boolean} config.checkCoreConfig - whether check core config
 * @return {Array}   dependency list
 */
pro.getDependencies = function(config){
    config = config||{};
    // check explorer
    var parser = _io.getFromCache(this._uri),
        resConfig = parser.scriptConfig,
        resExplorer = parser.scripts;
    if (config.resType==='style'){
        resConfig = parser.styleConfig;
        resExplorer = parser.styles;
    }
    // check no core merge
    if (config.checkCoreConfig&&resConfig.core===!1){
        return [];
    }
    var ret = [],
        type = parseInt(config.listType)||0;
    // dump dependency list from style list
    if (!!resExplorer&&(type===0||type===1)){
        ret.push(resExplorer.getDependencies(config));
    }
    // dump dependency list from tempalte list
    var explorer = parser.templates;
    if (!!explorer&&(type===0||type===2)){
        var list = explorer.getDependencies(config);
        if (type===2&&!!resExplorer){
            var res = resExplorer.getDependencies(config);
            list = _util.split(list,res);
        }
        ret.push(list);
    }
    return _util.concat.apply(_util,ret);
};
/**
 * parse output style/script name
 * @private
 * @return {Void}
 */
pro._getOutputName = function(){
    // a/b/c.html
    var name = this._uri.replace(this._root,'');
    // a/b/c
    name = name.replace(/\.[^.\/\\]+?$/i,'');
    // a_b_c
    name = name.replace(/\//gi,'_');
    // t_a_b_c
    return util.format(
        '%s_%s',this._isTemplate?'t':'p',name
    );
};
/**
 * init merge
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.begMerge = function(config){
    var parser = _io.getFromCache(this._uri),
        name = this._getOutputName();
    parser.styleConfig.outputName = name;
    parser.scriptConfig.outputName = name;
};
/**
 * merge resource
 * @private
 * @param  {Object} config - config object
 * @return {Array}  file name after merge
 */
pro._mergeResource = function(config){
    config = config||{};
    var parser = _io.getFromCache(this._uri),
        resConfig = parser[config.resConfig],
        res = this.getDependencies({
            resType:config.resType,
            listType:1
        }),
        tpl = this.getDependencies({
            resType:config.resType,
            listType:2
        });
    // split core if need
    if (resConfig.core!==!1){
        [res,tpl].forEach(function(list){
            var ret = _util.split(list,config.core);
            if (ret.length>0){
                resConfig.core = !0;
            }
        });
    }
    // cache css content
    var root = resConfig.outputName+config.sufix,
        ret = [];
    if (res.length>0){
        var name = 'p'+root;
        ret.push(name);
        _io.cache(name,_io.fill(res));
    }
    if (tpl.length>0){
        var name = 't'+root;
        ret.push(name);
        _io.cache(name,_io.fill(tpl));
    }
    return ret;
};
/**
 * merge style
 * @param  {Object} config - config object
 * @param  {Array}  config.core - core css list
 * @return {String} css file path
 */
pro.mergeStyle = function(config){
    return this._mergeResource({
        sufix:'.css',
        core:config.core,
        resType:'style',
        resConfig:'styleConfig'
    });
};
/**
 * merge script
 * @param  {Object} config - config object
 * @param  {Array}  config.core - core css list
 * @return {String}
 */
pro.mergeScript = function(config){
    return this._mergeResource({
        sufix:'.js',
        core:config.core,
        resType:'script',
        resConfig:'scriptConfig'
    });
};
/**
 * embed resource to html file
 * @param  {Object} config - config object
 * @param  {String} config.domain  - external resource domain
 * @param  {String} config.version - resource version pattern
 * @param  {Number} config.maxInlineSize - max inline size
 * @return {Void}
 */
pro.embedStyle = function(config){
    var parser = _io.getFromCache(this._uri);
    // check style insert point
    if (parser.stylePoint<0){
        return;
    }
    // check style list
    var ret = [];
    var resConfig = parser.styleConfig;
    if (resConfig.core){
        ret.push('core');
    }
    ret.push('p'+resConfig.outputName);
    // check content
    var max = config.maxInlineSize*1000;
    ret.forEach(function(name){
        var content = _io.getFromCache(name+'.css');
        if (!content){
            return;
        }
        // inline resource
        if (content.length<=max){
            ret.push(util.format(
                '<style type="text/css">%s</style>',content
            ));
            return;
        }
        // external resource
        var file,version,
            verDict = {
                RAND:_util.increment(),
                VERSION:_util.md5(content),
                FILENAME:name
            };
    });





};




