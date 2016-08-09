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
   _dep   = require('./util/dependency.js'),
   _nej   = require('./script/nej/util.js');
// deploy processor
// file         config file path
// mode         release mode
// level        logger level
// processors   processors definition
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
        info:_log.log.bind(_log,'info'),
        warn:_log.log.bind(_log,'warn'),
        debug:_log.log.bind(_log,'debug')
    };
    // start process
    _log.logger.info(
        'node version is %s, toolkit version is %s',
        process.version,require('../package.json').version
    );
    // parse config
    this._parseConfig(config.file,config);
    // cache nej config
    _log.logger.info('cache nej config');
    var cmap = this._config.format({
        params:'NEJ_CONFIG',
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
    if (!cmap.params.pro){
        cmap.params.pro = this._config.get('DIR_WEBROOT')+'src/javascript/';
    }
    _nej.cacheConfig(cmap);
    // update logger config
    _log.logger.info('prepare merge config');
    this._parseLogConfig();
    this._parseMergeConfig();
    // parse static html and server template
    this._result = new (require('./explorer/html.js'))(
        _util.merge(this._logger,{
            file:this._config.get('DIR_CONFIG')+'deploy.html'
        })
    );
    _log.logger.info('dump template files');
    this._parseInputFiles(!1);
    _log.logger.info('dump html files');
    this._parseInputFiles(!0);
    _log.logger.info('parse input files');
    this._result.parse(
        this._config.format({
            // for html parser
            charset:'FILE_CHARSET',
            ignoreMode:'X_RELEASE_MODE',
            keepComment:'CPRS_KEEP_COMMENT',
            cprsFlag:'CPRS_FLAG',
            noCoreFlag:'CORE_MERGE_FLAG',
            noParseFlag:'CORE_NOPARSE_FLAG',
            inCoreFlag:'OBF_CORE_INLINE_FLAG',
            exLinkAttributeFlag:'X_AUTO_EXLINK_PATH',
            exLinkAttributeName:'X_AUTO_EXLINK_PREFIX',
            exLinkAttributeRoot:'DIR_SOURCE',
            // for resource parser
            webRoot:'DIR_WEBROOT',
            resRoot:'DIR_STATIC',
            sptRoot:'OPT_IMAGE_SPRITE',
            aliasReg:'ALIAS_MATCH',
            aliasDict:'ALIAS_DICTIONARY'
        })
    );
    // optimate image
    this._optimizeImage();
    // merge and output after resource loaded
    _io.onload(this._afterResPrepared.bind(this));
};
/**
 * parse config from file
 * @private
 * @param  {String} file - config file path
 * @param  {Object} options - config object
 * @param  {String} options.mode  - relase mode
 * @param  {String} options.level - logger level
 * @return {Void}
 */
pro._parseConfig = function(file,options){
    var error = !1;
    this._logger.error = function(event){
        error = !0;
        _log.log('error',event);
    }.bind(this);
    // parse config file
    this._config = new (require('./parser/config.js'))(
        _util.merge(this._logger,{
            config:file
        })
    );
    // check release mode from command line
    if (!!options.mode){
        var mode = options.mode.toLowerCase();
        this._config.set('X_RELEASE_MODE',mode);
        _log.logger.debug('overwrite X_RELEASE_MODE to %s',mode);
    }
    // check logger level from command line
    if (!!options.level){
        var level = options.level.toUpperCase();
        this._config.set('X_LOGGER_LEVEL',level);
        _log.logger.debug('overwrite X_LOGGER_LEVEL to %s',level);
    }
    // exit when config parse error
    if (error){
        _log.logger.dump2file(
            this._config.get('X_LOGGER_FILE')
        );
        process.abort();
        //process.exist(-1);
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
        _log.log('error',event);
        var dumps = event.files;
        if (!!dumps){
            var dir = this._config.get('DIR_CONFIG');
            Object.keys(dumps).forEach(function(name){
                _fs.write(dir+name,dumps[name]||'');
            });
        }
        process.abort();
        //process.exist(50);
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
        exclude = this._config.get('FILE_EXCLUDE'),
        charset = this._config.get('FILE_CHARSET');
    // dump files and parse every file
    (this._config.get(key+'_SUB')||[root]).forEach(function(dir){
        var list = _fs.lsfile(dir,function(name,path){
            return !/^\./.test(name)&&
                   (!filter||filter.test(path))&&   // match path
                   (!exclude||!exclude.test(path)); // not exclude path
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
    // check merge flag
    var flag = this._config.get('CORE_MERGE_FLAG');
    // merge core style
    if (flag===1||flag===3){
        this._core.coreCS = [];
        this._core.maskCS = null;
    }else{
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
    }
    // merge core script
    if (flag===2||flag===3){
        this._core.coreJS = [];
        this._core.maskJS = null;
    }else{
        // parse core and mask js list config
        var copt = this._config.format({
            aliasReg:'ALIAS_MATCH',
            aliasDict:'ALIAS_DICTIONARY'
        });
        [
            {key:'CORE_LIST_JS',core:'coreJS'},
            {key:'CORE_MASK_JS',core:'maskJS'}
        ].forEach(function(config){
            var list = this._config.get(config.key);
            if (!!list){
                list.forEach(function(uri,index,list){
                    uri = _path.completeURI(uri,copt);
                    var ret = _nej.parseURI(uri,{
                        webRoot:webRoot,
                        pathRoot:pathRoot
                    });
                    list[index] = _nej.formatURI(ret);
                });
                this._core[config.core] = list;
            }
        },this);
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
    // complete core script dependency list
    var list = this._core.coreJS;
    if (!!list){
        this._core.coreJS = _dep.complete(list);
    }
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
    this._core[config.key] = list;
    // split core mask
    if (list.length>0){
        _util.split(list,config.mask);
    }
};
/**
 * optimate resource image
 * @private
 * @return {Void}
 */
pro._optimizeImage = function(){
    var opted = this._config.get('OPT_IMAGE_FLAG'),
        resRoot = this._config.get('DIR_STATIC');
    if (!opted||!_fs.exist(resRoot)){
        return;
    }
    // opt command
    var command = util.format(
        'nej-minimage -i=%s -o=%s -q=%s -f',
        resRoot,resRoot,
        this._config.get('OPT_IMAGE_QUALITY')
    );
    // do image optimize
    _log.logger.info('exec optimize image command [%s]',command);
    require('child_process').exec(command,function(err,stdout,stderr){
        if (!!stdout){
            _log.logger.debug(stdout);
        }
        if (!!stderr){
            _log.logger.warn(stderr);
        }
        if (err!=null){
            _log.logger.warn('please install nej-minimage first. usage: npm install nej-minimage -g');
        }
    });
};
/**
 * output web cache config
 * @private
 * @return {Void}
 */
pro._outputWebCacheConfig = function(){
    // check web cache server config flag
    if (!this._config.get('WCS_UPLOAD_URL')){
        return;
    }
    // dump config info
    var tmp = this._config.format({
        output:'WCS_CONFIG_FILE',
        dfDomain:'DM_STATIC',
        rsDomain:'DM_STATIC_RS',
        jsDomain:'DM_STATIC_JS',
        csDomain:'DM_STATIC_CS',
        resRoot:'DIR_STATIC',
        staticRoot:'DIR_OUTPUT_STATIC'
    });
    // dump web cache config
    var config = this._config.format({
        api:'WCS_UPLOAD_URL',
        token:'WCS_UPLOAD_TOKEN',
        appid:'WCS_APP_ID',
        nativeId:'WCS_NATIVE_ID',
        webRoot:'DIR_WEBROOT',
        fileInclude:'WCS_FILE_INCLUDE',
        fileExclude:'WCS_FILE_EXCLUDE',
        extension:'WCS_CONFIG_EXTENSION'
    });
    config.resRoot = [
        tmp.resRoot,tmp.staticRoot
    ].join(',');
    var ret = _util.concat(
        tmp.dfDomain,tmp.rsDomain,
        tmp.jsDomain,tmp.csDomain
    );
    // check domain list
    for(var i=ret.length-1,it;i>=0;i--){
        it = ret[i];
        // http://b1.bst.126.net/pub/ -> b1.bst.126.net/pub/
        if (/^https?:\/\/([^\/]+)(\/.+(\/|$))?/i.test(it)){
            ret[i] = RegExp.$1+(RegExp.$2||'');
        }else{
            ret.splice(i,1);
        }
    }
    config.domains = ret.join(',');
    // output web cache config
    _log.logger.info('output web cache config to %s',tmp.output);
    _fs.write(tmp.output,JSON.stringify(config,null,4));
};
/**
 * output sprite images
 * @private
 * @param  {Function} next - next process
 * @return {Void}
 */
pro._outputSpriteImages = function(next){
    var map = _io.dumpSpriteFiles();
    if (Object.keys(map).length<=0){
        next();
        return;
    }
    var opt = this._config.format({
        webRoot:'DIR_WEBROOT',
        resRoot:'DIR_STATIC',
        sptRoot:'OPT_IMAGE_SPRITE',
        options:'OPT_IMAGE_SPRITE_OPTIONS'
    });
    var conf = _util.merge(
        this._logger,opt.options,{
            map:map,
            done:next,
            webRoot:opt.webRoot,
            output:opt.sptRoot||opt.resRoot
        }
    );
    _io.cache(
        'nej://sprite-background',
        new (require('./adapter/sprite.js'))(conf)
    );
};
/**
 * output all resource files
 * @private
 * @return {Void}
 */
pro._outputAllFiles = function(){
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
        webRoot:'DIR_WEBROOT',
        resRoot:'DIR_STATIC',
        srcRoot:'DIR_SOURCE',
        mdlRoot:'NEJ_MODULE_ROOT',
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
            this._outputWebCacheConfig();
            _log.logger.debug(
                'version map -> %j',
                _io.dumpResource()
            );
            _log.logger.debug(
                'file key map -> %j',
                _path.dumpURIKeys()
            );
            _log.logger.info(
                'release done and log file is %s',
                this._config.get('X_LOGGER_FILE')
            );
            this.emit('done');
        }.bind(this)
    );
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
    // minify script
    _log.logger.info('minify script');
    this._result.minify(
        this._config.format({
            bags:'OBF_NAME_BAGS',
            level:'OBF_LEVEL',
            sourcemap:'OBF_SOURCE_MAP',
            variables:'OBF_GLOBAL_VAR',
            compatible:'OBF_COMPATIBLE',
            dropconsole:'OBF_DROP_CONSOLE',
            outputRoot:'DIR_OUTPUT_STATIC',
            codeWrap:'WRP_SCRIPT_SOURCE'
        }),
        this._config.format({
            lnkCheck:'X_AUTO_EXLINK_SCRIPT',
            lnkOption:'X_AUTO_EXLINK_SCRIPT_EXTENSION',
            webRoot:'DIR_WEBROOT',
            resRoot:'DIR_STATIC',
            rsDomain:'DM_STATIC_RS',
            versionStac:'VERSION_STATIC'
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
            inStyleWrap:'WRP_INLINE_STYLE',
            exStyleWrap:'WRP_EXLINE_STYLE',
            inScriptWrap:'WRP_INLINE_SCRIPT',
            exScriptWrap:'WRP_EXLINE_SCRIPT',
            maxCSSize:'OBF_MAX_CS_INLINE_SIZE',
            maxJSSize:'OBF_MAX_JS_INLINE_SIZE'
        })
    );
    // sprite background image
    this._outputSpriteImages(
        this._outputAllFiles.bind(this)
    );
};