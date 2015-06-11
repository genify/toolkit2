/*
 * project deploy processor
 * @module   deploy
 * @author   genify(caijf@corp.netease.com)
 */
var fs    = require('file'),
   _io    = require('./util/io.js'),
   _fs    = require('./util/file.js'),
   _util  = require('./util/util.js'),
   _path  = require('./util/path.js'),
   _log   = require('./util/logger.js'),
   _nej   = require('./script/nej/util.js');
// deploy processor
// file         config file path
// parsers      script file parser
// processors   nej dependency processors definition
var Processor = module.exports =
    require('./util/klass.js').create();
var pro = Processor.extend(require('./util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    // init private variable
    this._core = {};
    this._logger = {
        info:this._log.bind(this,'info'),
        warn:this._log.bind(this,'warn'),
        debug:this._log.bind(this,'debug')
    };
    // start process
    _log.logger.info(
        'node version is %s, toolkit version is %s',
        process.version,require('../package.json').version
    );
    // parse config
    this._parseConfig(config.file);
    // cache nej config
    _log.logger.info('cache nej config');
    var cmap = this._config.format({
        nejRoot:'NEJ_DIR',
        nejPlatform:'NEJ_PLATFORM',
        nejInjector:'NEJ_INJECTOR',
        nejProcessor:'NEJ_PROCESSOR'
    });
    if (!!config.processors){
        cmap.nejProcessor = _util.merge(
            cmap.nejProcessor,
            config.processors
        );
    }
    cmap.params = {
        pro:this._config.get('DIR_WEBROOT')+'src/javascript/'
    };
    _nej.cacheConfig(cmap);
    // update logger config
    this._parseLogConfig();
    // parse static html and server template
    this._result = new (require('./explorer/html.js'))({
        file:this._config.get('DIR_CONFIG')+'deploy.html'
    });
    this._parseInputFiles(!0);
    this._parseInputFiles(!1);
    this._result.parse(
        this._config.format({
            // for html parser
            charset:'FILE_CHARSET',
            ignoreMode:'X_RELEASE_MODE',
            keepComment:'X_KEEP_COMMENT',
            noCompress:'X_NOCOMPRESS',
            noCoreFlag:'X_NOCORE_FLAG',
            noParseFlag:'X_NOPARSE_FLAG',
            exLinkAttributeFlag:'X_AUTO_EXLINK_PATH',
            exLinkAttributeName:'X_AUTO_EXLINK_PREFIX',
            // for resource parser
            webRoot:'DIR_WEBROOT',
            resRoot:'DIR_STATIC',
            aliasReg:'ALIAS_MATCH',
            aliasDict:'ALIAS_DICTIONARY'
        })
    );
    // update merge config
    this._parseMergeConfig();
    // merge and output after resource loaded
    _io.onload(this._afterResPrepared.bind(this));
};
/**
 * logger output
 * @private
 * @param  {String} type  - log type
 * @param  {Object} event - log data information
 * @return {Void}
 */
pro._log = function(type,event){
    var func = _log.logger[type];
    if (!!func){
        var args = event.data||[];
        args.unshift(event.message);
        func.apply(_log.logger,args);
    }
};
/**
 * parse config from file
 * @private
 * @param  {String} file - config file path
 * @return {Void}
 */
pro._parseConfig = function(file){
    var error = !1;
    this._logger.error = function(event){
        error = !0;
        this._log.call(this,'error',event);
    }.bind(this);
    // parse config file
    var Parser = require('./parser/config.js'),
        opt = _util.merge(this._logger,{
            config:file
        });
    this._config = new Parser(opt);
    // exit when config parse error
    if (error){
        _log.logger.dump2file(
            this._config.get('X_LOGGER_FILE')
        );
        process.exist(-1);
    }
};
/**
 * update logger config
 * @private
 * @return {Void}
 */
pro._parseLogConfig = function(){
    // overwrite log event
    var file = this._config.get('X_LOGGER_FILE');
    _log.logger.on(
        'log',function(event){
            if (event.level!=null){
                console.log(event.message);
            }
            fs.appendFileSync(file,event.message);
        }
    );
    // update log level
    var level = _log.level[
        this._config.get('X_LOGGER_LEVEL')
    ];
    _log.logger.setLevel(level);
    // error log when processing
    this._logger.error = function(event){
        this._log.call(this,'error',event);
        process.exist(-1);
    }.bind(this);
};
/**
 * parse pages by type
 * @private
 * @param  {Boolean} istpl - is template file
 * @return {Void}
 */
pro._parseInputFiles = function(istpl){
    var key = !istpl?'DIR_SOURCE':'DIR_SOURCE_TP';
    // check root
    var root = this._config.get(key);
    if (!root){
        return;
    }
    // format config
    var filter = this._config.get('FILE_FILTER');
    // dump files and parse every file
    (this._config.get(key+'_SUB')||[root]).forEach(function(dir){
        var list = _fs.lsfile(dir,function(name,path){
            return !/^\./.test(name)&&(!filter||filter.test(path));
        });
        list.forEach(function(file){
            this._result.push({
                uri:file,
                root:root,
                isTemplate:!!istpl
            });
        },this);
    },this);
};
/**
 * parse merge config
 * @private
 * @return {Void}
 */
pro._parseMergeConfig = function(){
    var webRoot = this._config.get('DIR_WEBROOT'),
        pathRoot = this._config.get('DIR_CONFIG');
    // parse core and mask css list
    [
        {key:'CORE_LIST_CS',core:'coreCS'},
        {key:'CORE_MASK_CS',core:'maskCS'}
    ].forEach(function(config){
        var list = this._config.get(config.key);
        if (!!list){
            list.forEach(function(uri,index,list){
                list[index] = _path.absoluteAltRoot(
                    uri,pathRoot,webRoot
                );
            });
            this._core[config.core] = list;
        }
    },this);
    // parse mask js list
    var list = this._config.get('CORE_MASK_JS');
    if (!!list){
        list.forEach(function(uri,index,list){
            var ret = _nej.parseURI(uri,{
                webRoot:webRoot,
                pathRoot:pathRoot
            });
            list[index] = _nej.formatURI(ret);
        });
        this._core.maskJS = list;
    }
    // parse core js list
    var list = this._config.get('CORE_MASK_JS');
    if (!!list){
        var Script = require('./explorer/script.js');
        this._core.coreJS = new Script({
            list:list,
            file:pathRoot+'core.html'
        });
        this._core.coreJS.parse(
            this._config.format({
                webRoot:'DIR_WEBROOT',
                aliasReg:'ALIAS_MATCH',
                aliasDict:'ALIAS_DICTIONARY'
            })
        );
    }
};
/**
 * parse merge core list after all resources loaded
 * @private
 * @return {Void}
 */
pro._parseMergeCore = function(){
    // auto calculate core css list
    this._parseMergeCoreList({
        key:'coreCS',
        mask:this._core.maskCS,
        resType:'style',
        resFreq:this._config.get('CORE_FREQUENCY_CS')
    });
    // auto calculate core javascript list
    this._parseMergeCoreList({
        key:'coreJS',
        mask:this._core.maskJS,
        resType:'script',
        resFreq:this._config.get('CORE_FREQUENCY_JS'),
        ignoreEntry:this._config.get('CORE_IGNORE_ENTRY')
    });
};
/**
 * update merge core list
 * @private
 * @return {Void}
 */
pro._parseMergeCoreList = function(config){
    // calculate core list
    var list = this._core[config.key];
    if (!list){
        list = this._result.getCoreList(config);
    }else{
        list = list.getDependencies();
    }
    this._core[config.key] = list;
    // split core mask
    if (list.length>0){
        _util.split(list,config.mask);
    }
};
/**
 * do next process after resource prepared
 * @private
 * @return {Void}
 */
pro._afterResPrepared = function(){
    _nej.formatDependencies();
    // update core list
    this._parseMergeCore();
    // merge resource
    this._mergeResource();
    // embed resource
    this._embedResource();
    // output files
    this._outputFiles();
};
/**
 * merge resource
 * @private
 * @return {Void}
 */
pro._mergeResource = function(){
    var config = this._config.format({
        outTplRoot:'DIR_OUTPUT_TP',
        outResRoot:'DIR_OUTPUT'
    });
    var ret = this._result.merge(
        _util.merge(config,{
            coreStyle:this._core.coreCS,
            coreScript:this._core.coreJS
        })
    );
    // obfuscate script
    var Parser = require('./adapter/script.js'),
        parser = new Parser({
            map:ret,
            code:_io.dump()
        }),
        config = this._config.format({
            bags:'OBF_NAME_BAGS',
            level:'OBF_LEVEL',
            sourcemap:'OBF_SOURCE_MAP',
            compatible:'OBF_COMPATIBLE',
            dropconsole:'OBF_DROP_CONSOLE'
        });
    // check source map config
    if (config.sourcemap){
        config.sourcemap = {
            root:this._config.get('DIR_OUTPUT')+'s/'
        };
    }else{
        delete config.sourcemap;
    }
    // do compress and obfuscate script
    parser.parse(config);
    var ret = parser.dump();
    // cache script content
    Object.keys(ret.code).forEach(function(name){
        _io.cache(name,ret.code[name]);
    });
    // output name bags
    var bags = this._config.get('OBF_NAME_BAGS');
    _fs.writeAsync(bags,JSON.stringify(ret.bags||{}));
    _log.logger.info('output script name bags to %s',bags);
    // output source map
    if (!!ret.sourcemap){
        var root = config.sourcemap.root;
        Object.keys(ret.sourcemap).forEach(function(name){
            var content = ret.sourcemap[name]||'';
            if (!!content){
                _fs.writeAsync(root+name,content);
                _log.logger.info('output sourcemap %s%s',root,name);
            }
        });
    }
};
/**
 * embed resource to html
 * @private
 * @return {Void}
 */
pro._embedResource = function(){
    var config = this._config.format({
        charset:'FILE_CHARSET',
        version:'VERSION_MODE',
        outRoot:'DIR_OUTPUT_STATIC',
        webRoot:'DIR_WEBROOT',
        stcDomain:'DM_STATIC_RS',
        stcVersion:'VERSION_STATIC'
    });
    Object.keys(this._result).forEach(function(file){
        var parser = this._result[file];
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
/**
 * output files
 * @private
 * @return {Void}
 */
pro._outputFiles = function(){
    var config = this._config.format({
        manRoot:'DM_STATIC_MF',
        manOutput:'MANIFEST_OUTPUT',
        manFilter:'MANIFEST_FILTER',
        manTemplate:'MANIFEST_TEMPLATE'
    });
    Object.keys(this._result).forEach(function(parser){
        parser.output(config);
    });
};