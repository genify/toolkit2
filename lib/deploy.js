/*
 * project deploy processor
 * @module   deploy
 * @author   genify(caijf@corp.netease.com)
 */
var fs    = require('fs'),
    util  = require('util'),
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
    this._result = new (require('./explorer/html.js'))(
        _util.merge(this._logger,{
            file:this._config.get('DIR_CONFIG')+'deploy.html'
        })
    );
    _log.logger.info('dump html files');
    this._parseInputFiles(!0);
    _log.logger.info('dump template files');
    this._parseInputFiles(!1);
    _log.logger.info('parse input files');
    this._result.parse(
        this._config.format({
            // for html parser
            charset:'FILE_CHARSET',
            ignoreMode:'X_RELEASE_MODE',
            keepComment:'X_KEEP_COMMENT',
            noCompress:'X_NOCOMPRESS',
            noCoreFlag:'CORE_MERGE_FLAG',
            noParseFlag:'X_NOPARSE_FLAG',
            exLinkAttributeFlag:'X_AUTO_EXLINK_PATH',
            exLinkAttributeName:'X_AUTO_EXLINK_PREFIX',
            exLinkAttributeRoot:'DIR_SOURCE',
            // for resource parser
            webRoot:'DIR_WEBROOT',
            resRoot:'DIR_STATIC',
            aliasReg:'ALIAS_MATCH',
            aliasDict:'ALIAS_DICTIONARY'
        })
    );
    // update merge config
    _log.logger.info('parse core and mask config');
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
    this._config = new (require('./parser/config.js'))(
        _util.merge(this._logger,{
            config:file
        })
    );
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
            fs.appendFileSync(file,event.message+'\n');
        }
    );
    // update log level
    _log.logger.setLevel(
        this._config.get('X_LOGGER_LEVEL')
    );
    // error log when processing
    this._logger.error = function(event){
        this._log.call(this,'error',event);
        var dumps = event.files;
        if (!!dumps){
            var dir = this._config.get('DIR_CONFIG');
            Object.keys(dumps).forEach(function(name){
                _fs.write(dir+name,dumps[name]||'');
            });
        }
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
    var filter = this._config.get('FILE_FILTER'),
        charset = this._config.get('FILE_CHARSET');
    // dump files and parse every file
    (this._config.get(key+'_SUB')||[root]).forEach(function(dir){
        var list = _fs.lsfile(dir,function(name,path){
            return !/^\./.test(name)&&(!filter||filter.test(path));
        });
        list.forEach(function(file){
            this._result.push({
                uri:file,
                root:root,
                charset:charset,
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
    var list = this._config.get('CORE_LIST_JS');
    if (!!list){
        this._core.coreJS = new (require('./explorer/script.js'))(
            _util.merge(
                this.getLogger(),{
                    list:list,
                    file:pathRoot+'core.html'
                }
            )
        );
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
    _log.logger.debug(
        'core style list -> %j',
        this._core.coreCS
    );
    // auto calculate core javascript list
    this._parseMergeCoreList({
        key:'coreJS',
        mask:this._core.maskJS,
        resType:'script',
        resFreq:this._config.get('CORE_FREQUENCY_JS'),
        ignoreEntry:this._config.get('CORE_IGNORE_ENTRY')
    });
    _log.logger.debug(
        'core script list -> %j',
        this._core.coreJS
    );
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
    }
    if (!util.isArray(list)){
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
    // format nej dependency list
    var map = _nej.formatDependencies();
    _log.logger.debug('dependencies map -> %j',map);
    // update core list
    _log.logger.info('merge core list');
    this._parseMergeCore();
    // resort resource
    _log.logger.info('sort input files by module dependency');
    this._result.sort();
    // merge resource
    _log.logger.info('split core from input files');
    this._result.merge({
        coreStyle:this._core.coreCS,
        coreScript:this._core.coreJS
    });
    _log.logger.info('minify script');
    this._result.minify(
        this._config.format({
            bags:'OBF_NAME_BAGS',
            level:'OBF_LEVEL',
            sourcemap:'OBF_SOURCE_MAP',
            compatible:'OBF_COMPATIBLE',
            dropconsole:'OBF_DROP_CONSOLE',
            outputRoot:'DIR_OUTPUT_STATIC'
        })
    );
    // embed resource
    _log.logger.info('embed resources to input files');
    this._result.embed(
        this._config.format({
            resWrap:'WRP_INLINE_SOURCE',
            inCSWrap:'WRP_INLINE_CS',
            exCSWrap:'WRP_EXLINE_CS',
            inJSWrap:'WRP_INLINE_JS',
            exJSWrap:'WRP_EXLINE_JS',
            inTPWrap:'WRP_INLINE_TP',
            maxCSSize:'OBF_MAX_CS_INLINE_SIZE',
            maxJSSize:'OBF_MAX_JS_INLINE_SIZE'
        })
    );
    // output files
    _log.logger.info('output files');
    this._result.output(this._config.format({
        charset:'FILE_CHARSET',
        // manifest config
        manRoot:'MANIFEST_ROOT',
        manOutput:'MANIFEST_OUTPUT',
        manFilter:'MANIFEST_FILTER',
        manTemplate:'MANIFEST_TEMPLATE',
        // output dir config
        resRoot:'DIR_STATIC',
        srcRoot:'DIR_SOURCE',
        mdlRoot:'DM_STATIC_MR',
        outStacRoot:'DIR_OUTPUT_STATIC',
        outHtmlRoot:'DIR_OUTPUT',
        outTmplRoot:'DIR_OUTPUT_TP',
        // version mode
        versionStac:'VERSION_STATIC',
        versionMode:'VERSION_MODE',
        // domain config
        rsDomain:'DM_STATIC_RS',
        csDomain:'DM_STATIC_CS',
        jsDomain:'DM_STATIC_JS'
    }));
    // check deploy finish
    _io.ondone(
        function(){
            _log.logger.info(
                'release done and log file is %s',
                this._config.get('X_LOGGER_FILE')
            );
            this.emit('done');
        }.bind(this)
    );
};