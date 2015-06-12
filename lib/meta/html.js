/*
 * Html Resource Class
 * @module   meta/html
 * @author   genify(caijf@corp.netease.com)
 */
var path   = require('path'),
    util   = require('util'),
   _io     = require('../util/io.js'),
   _fs     = require('../util/file.js'),
   _util   = require('../util/util.js'),
   _path   = require('../util/path.js');
// resource url handler
var URLHANDLER = {
    rs:function(uri,config){

    },
    cs:function(uri,config){

    },
    js:function(uri,config){

    },
    umi:function(uri,config){

    },
    path:function(uri,config){

    }
};
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
 * dump style dependency list
 * @param  {Object}  config - config object
 * @param  {Number}  config.listType - list type for dependency, 0 - all, 1 - only resource list, 2 - resource and template list
 * @param  {Boolean} config.checkCoreConfig - whether check core config
 * @return {Array}   dependency list
 */
pro.getStyleDependencies = function(config){
    return this.getDependencies(
        _util.merge(config,{
            resType:'style'
        })
    );
};
/**
 * dump script dependency list
 * @param  {Object}  config - config object
 * @param  {Number}  config.listType    - list type for dependency, 0 - all, 1 - only resource list, 2 - resource and template list
 * @param  {Boolean} config.ignoreEntry - whether ignore entry resource
 * @param  {Boolean} config.checkCoreConfig - whether check core config
 * @return {Array}   dependency list
 */
pro.getScriptDependencies = function(config){
    return this.getDependencies(
        _util.merge(config,{
            resType:'script'
        })
    );
};
/**
 * dump template dependency list
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.getTemplateDependencies = function(config){
    var ret = [];
    [this.templates,this.modules].forEach(function(explorer){
        if (!!explorer){
            ret.push(explorer.getDependencies({
                resType:'template'
            }));
        }
    });
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
    var name = this._getOutputName(),
        parser = _io.getFromCache(this._uri);
    parser.styleConfig.filename = name;
    parser.scriptConfig.filename = name;
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
    var root = resConfig.filename+config.sufix,
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
 * parse resource before embed
 * @private
 * @param  {Array}  list - resource file list
 * @param  {Object} config - config object
 * @return {Array}  resource embedded list
 */
pro._parseEmbedResource = function(list,config){
    var ret = [],
        max = config.maxSize*1000;
    list.forEach(
        function(name){
            var content = _io.getFromCache(
                name+config.resSuffix
            );
            if (!content){
                return;
            }
            // inline resource
            if (content.length<=max){
                if (config.resRegexp){
                    content = content.replace(
                        config.resRegexp,'<&#47;$1>'
                    );
                }
                ret.push(util.format(
                    config.resInline,content
                ));
                return;
            }
            // generate link code
            ret.push(util.format(
                config.resExternal,
                _path.wrapURI(config.resType,name)
            ));
        },this
    );
    return ret;
};
/**
 * embed resource to html file
 * @private
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
    var ret = [],
        resConfig = parser[
            config.resConfig
        ];
    if (resConfig.core){
        ret.push('core');
    }
    ret.push('p'+resConfig.filename);
    // embed style resource
    parser.buffer[pointer] = util.format(
        config.resWrap||'%s',
        this._parseEmbedResource(ret,config).join('\n')
    );
    parser[config.resPoint] = -1;
};
/**
 * embed resource in template
 * @private
 * @param  {Object} config - config object
 * @return {Void}
 */
pro._embedTemplate = function(config){
    config.regRegexp = _util.wrap2reg(
        config.resInline
    );
    var parser = _io.getFromCache(this._uri),
        ret = this._parseEmbedResource(
            ['t'+parser[config.resConfig].filename],config
        );
    if (ret.length>0){
        parser.templateConfig[config.resName] = ret.join('\n');
    }
};
/**
 * embed style to html file
 * @param  {Object} config - config object
 * @param  {Number} config.maxSize      - max inline size
 * @param  {String} config.inlineWrap   - inline wrapper
 * @param  {String} config.externalWrap - external wrapper
 * @return {Void}
 */
pro.embedStyle = function(config){
    // embed style resource
    this._embedResource({
        maxSize:config.maxSize,
        resType:'cs',
        resPoint:'stylePoint',
        resConfig:'styleConfig',
        resSuffix:'.css',
        resInline:'<style type="text/css">%s</style>',
        resExternal:'<link rel="stylesheet" href="%s"/>'
    });
    // embed style template
    this._embedTemplate({
        maxSize:config.maxSize,
        resType:'cs',
        resName:'styles',
        resSuffix:'.css',
        resConfig:'styleConfig',
        resInline:config.inlineWrap,
        resExternal:config.externalWrap
    });
};
/**
 * embed style to html file
 * @param  {Object}  config - config object
 * @param  {Number} config.maxSize      - max inline size
 * @param  {String} config.resWrap      - source wrapper
 * @param  {String} config.inlineWrap   - inline wrapper
 * @param  {String} config.externalWrap - external wrapper
 * @return {Void}
 */
pro.embedScript = function(config){
    // embed script resource
    this._embedResource({
        resType:'js',
        resPoint:'scriptPoint',
        resConfig:'scriptConfig',
        resSuffix:'.js',
        resRegexp:/<\/(script)>/gi,
        resInline:'<script>%s</script>',
        resExternal:'<script src="%s"></script>',
        resWrap:config.resWrap,
        maxSize:config.maxSize
    });
    // embed script template
    this._embedTemplate({
        maxSize:config.maxSize,
        resType:'js',
        resName:'scripts',
        resSuffix:'.js',
        resConfig:'scriptConfig',
        resInline:config.inlineWrap,
        resExternal:config.externalWrap
    });
};
/**
 * embed template to html file
 * @private
 * @param  {Object} config - config object
 * @param  {String} config.resWrap    - source wrapper
 * @param  {String} config.inlineWrap - inline wrapper
 * @return {Void}
 */
pro._inlineTemplate = function(config){
    var parser = _io.getFromCache(this._uri);
    if (parser.templatePoint<0) {
        return;
    }
    var ret = [],
        conf = parser.templateConfig,
        explorer = parser.templates;
    // embed text template
    if (!!explorer){
        var content = explorer.stringify({
            resType:'text',
            resWrap:config.inlineWrap
        });
        if (!!content){
            ret.push(content);
        }
    }
    // embed style template
    if (!!conf.styles){
        ret.push(conf.styles);
    }
    // embed script template
    if (!!conf.scripts){
        ret.push(conf.scripts);
    }
    // embed external template
    if (!!explorer){
        var content = explorer.stringify({
            resType:'html'
        });
        if (!!content){
            ret.push(content);
        }
    }
    parser.buffer[parser.templatePoint] = util.format(
        config.resWrap,ret.join('\n')
    );
    parser.templatePoint = -1;
};
/**
 * embed template to html file
 * @private
 * @param  {Object} config - config object
 * @param  {String} config.resWrap    - source wrapper
 * @param  {String} config.inlineWrap - inline wrapper
 * @return {Void}
 */
pro._inlineModule = function(config){
    var parser = _io.getFromCache(this._uri);
    if (parser.modulePoint<0){
        return;
    }
    var explorer = this.modules;
    if (!!explorer){
        var content = explorer.stringify({
            resType:'html',
            resWrap:'<div style="display:none" id="%s">%s</div>'
        });
        if (!!content){
            parser.buffer[parser.modulePoint] = util.format(
                config.resWrap,content
            );
        }
    }
    parser.modulePoint = -1;
};
/**
 * embed template to html file
 * @param  {Object} config - config object
 * @param  {String} config.resWrap    - source wrapper
 * @param  {String} config.inlineWrap - inline wrapper
 * @return {Void}
 */
pro.embedTemplate = function(config){
    this._inlineTemplate(config);
    this._inlineModule(config);
};
/**
 * output content
 * @param  {Object} config - config object
 * @param  {String} config.charset     - output file charset
 * @param  {String} config.outHtmlRoot - html output root
 * @param  {String} config.outTmplRoot - template output root
 * @param  {String} config. -
 * @param  {String} config. -
 * @return {Void}
 */
pro.output = function(config){
    var parser = _io.getFromCache(this._uri),
        content = parser.stringify(),
        name = this._isTemplate
             ? 'outTmplRoot' : 'outHtmlRoot',
        output = this._uri.replace(
            this._root,config[name]
        );
    // unwrap resource uri
    content = _path.unwrapURI(content,function(type,uri){
        var func = URLHANDLER[type];
        if (!!func){
            func.call(this,uri,config);
        }
        return uri;
    }.bind(this));
    this.emit('info',{
        data:[output],
        message:'output %s'
    });
    _fs.writeAsync(output,content,config.charset);
};
