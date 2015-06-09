/*
 * Html Resource Class
 * @module   meta/html
 * @author   genify(caijf@corp.netease.com)
 */
var path   = require('path'),
   _io     = require('../util/io.js'),
   _fs     = require('../util/file.js'),
   _util   = require('../util/util.js'),
   _path   = require('../util/path.js');
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
 * @param  {String} config.outTplRoot - template output root
 * @param  {String} config.outResRoot - html output root
 * @return {Void}
 */
pro.begMerge = function(config){
    var parser = _io.getFromCache(this._uri),
        name = this._getOutputName();
    // calculate output resource path
    parser.styleConfig.outputName = name;
    parser.scriptConfig.outputName = name;
    // calculate output path
    var out = config.outResRoot;
    if (this._isTemplate){
        out = config.outTplRoot;
    }
    this._output = this._uri.replace(
        this._root,out
    );
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
 * update resource in style content
 * @private
 * @param  {String} name    - file name
 * @param  {String} content - style content
 * @param  {Object} config  - config object
 * @return {String} content after update resource
 */
pro._adjustResourceInStyle = function(name,content,config){
    var domain,
        file = config.outRoot+name;
    if (!!config.stcDomain){
        domain = _util.randNext(config.stcDomain);
    }
    return (content||'').replace(/#<(.*?)>/gi,function($1,$2){
        var brr = $2.split('?'),
            res = brr[0];
        // update path
        if (!domain){
            brr[0] = _path.normalize(
                path.relative(file,res)
            );
        }else{
            brr[0] = res.replace(
                config.webRoot,domain
            );
        }
        // update version
        if (!brr[1]&&config.stcVersion){
            brr[1] = _util.md5(
                _fs.raw(res)||''
            );
        }
        return brr.join('?');
    });
};
/**
 * generate output config
 * @private
 * @param  {String} name    - file name
 * @param  {String} content - style content
 * @param  {Object} config  - config object
 * @return {Object} output config
 */
pro._genOutputConfig = function(name,content,config){
    var ret = _util.version(config.version,{
        RAND:_util.increment(),
        VERSION:_util.md5(content),
        FILENAME:name
    });
    if (!!ret.version){
        ret.version = '?'+ret.version;
    }
    // check domain
    var domain;
    if (!!config.resDomain){
        domain = _util.randNext(config.resDomain);
    }
    if (!domain&&this._isTemplate){
        domain = '/';
    }
    // check external path
    ret.orignal = config.outRoot+ret.file+config.resSuffix;
    if (!domain){
        ret.file = _path.normalize(
            path.relative(this._output,ret.orignal)
        );
    }else{
        ret.file = ret.orignal.replace(config.webRoot,domain);
    }
    return ret;
};
/**
 * embed resource to html file
 * @param  {Object} config - config object
 * @return {Void}
 */
pro._embedResource = function(config){
    var parser = _io.getFromCache(this._uri),
        pointer = parser[config.resPoint];
    // check style insert point
    if (pointer<0){
        return;
    }
    // check style list
    var ret = [];
    var resConfig = parser[config.resConfig];
    if (resConfig.core){
        ret.push('core');
    }
    ret.push('p'+resConfig.outputName);
    // check inline/external content
    var arr = [],
        max = config.maxSize*1000;
    ret.forEach(function(name){
        var content = _io.getFromCache(
            name+config.resSuffix
        );
        if (!content){
            return;
        }
        // inline resource
        if (content.length<=max){
            arr.push(util.format(
                config.resInline,content
            ));
            return;
        }
        // external resource
        // update content resource
        if (config.resContentFormat){
            content = config.resContentFormat.call(
                this,name,content,config
            );
        }
        // generate output config
        var info = this._genOutputConfig(
            name,content,config
        );
        // generate link code
        arr.push(util.format(
            config.resExternal,
            info.file,info.version||''
        ));
        // output content
        _fs.write(info.orignal,content,config.charset);
    },this);
    // embed style resource
    parser.buffer[pointer] = arr.join('\n');
    parser[config.resPoint] = -1;
};
/**
 * embed style to html file
 * @param  {Object}  config - config object
 * @param  {String}  config.charset    - output charset
 * @param  {String}  config.version    - resource version pattern
 * @param  {String}  config.outRoot    - resource output root
 * @param  {String}  config.webRoot    - web root
 * @param  {Boolean} config.stcVersion - whether append version to static resource
 * @param  {Array}   config.stcDomain  - static resource domain
 * @param  {Array}   config.resDomain  - external resource domain
 * @param  {Number}  config.maxSize    - max inline size
 * @return {Void}
 */
pro.embedStyle = function(config){
    config = _util.merge(config,{
        resPoint:'stylePoint',
        resConfig:'styleConfig',
        resSuffix:'.css',
        resInline:'<style type="text/css">%s</style>',
        resExternal:'<link rel="stylesheet" href="%s%s"/>',
        resContentFormat:this._adjustResourceInStyle
    });
    this._embedResource(config);
};
/**
 * embed style to html file
 * @param  {Object}  config - config object
 * @param  {String}  config.charset    - output charset
 * @param  {String}  config.version    - resource version pattern
 * @param  {String}  config.outRoot    - resource output root
 * @param  {String}  config.webRoot    - web root
 * @param  {Boolean} config.stcVersion - whether append version to static resource
 * @param  {Array}   config.stcDomain  - static resource domain
 * @param  {Array}   config.resDomain  - external resource domain
 * @param  {Number}  config.maxSize    - max inline size
 * @return {Void}
 */
pro.embedScript = function(config){
    config = _util.merge(config,{
        resPoint:'scriptPoint',
        resConfig:'scriptConfig',
        resSuffix:'.js',
        resInline:'<script>%s</script>',
        resExternal:'<script src="%s%s"></script>'
    });
    this._embedResource(config);
};



