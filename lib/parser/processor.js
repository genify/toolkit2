/*
 * project deploy processor
 * @module   parser/proc
 * @author   genify(caijf@corp.netease.com)
 */
var fs         = require('file'),
    util       = require('util'),
   _io         = require('../util/io.js'),
   _fs         = require('../util/file.js'),
   _util       = require('../util/util.js'),
   _path       = require('../util/path.js'),
   _logger     = require('../util/logger.js'),
   _nej        = require('../script/nej.js'),
   _Abstract   = require('../event.js'),
   _ConfParser = require('./config.js'),
   _HtmlParser = require('../meta/html.js'),
   _CSExplorer = require('../explorer/style.js'),
   _JSExplorer = require('../explorer/script.js');
// deploy processor
// file         config file path
// processors   nej processors definition
var Processor = module.exports = function(config){
    _Abstract.apply(this,arguments);
    // default config
    var _gOption;
    var DEFAULT_CONFIG = {
        parsers     : null,
        processors  : null
    };
    // exports process result
    this.result = {};
    // log information from parser
    var _doLog = function(type,event){
        var func = _logger[type];
        if (!!func){
            var args = event.data||[];
            args.unshift(event.message);
            func.apply(_logger,args);
        }
    };
    // protected variables
    this._logger = {
        debug:_doLog.bind(this,'debug'),
        info:_doLog.bind(this,'info'),
        warn:_doLog.bind(this,'warn')
    };
    // private variable
    var _gConfig;
    // get parse config
    var _getParseConfig = function(){
        var flag = _gConfig.get('X_NOPARSE_FLAG');
        return {
            charset:_gConfig.get('FILE_CHARSET'),
            noCompress:_gConfig.get('X_NOCOMPRESS'),
            noCoreFlag:_gConfig.get('X_NOCORE_FLAG'),
            ignoreMode:_gConfig.get('X_RELEASE_MODE'),
            keepComment:_gConfig.get('X_KEEP_COMMENT'),
            exLinkAttributeName:_gConfig.get('X_AUTO_EXLINK_PREFIX'),
            notParseInlineStyle:flag==1||flag==3,
            notParseInlineScript:flag==2||flag==3,
            aliasReg:_gConfig.get('ALIAS_MATCH'),
            aliasDict:_gConfig.get('ALIAS_DICTIONARY'),
            webRoot:_gConfig.get('DIR_WEBROOT'),
            nejRoot:_gConfig.get('NEJ_DIR'),
            nejPlatform:_gConfig.get('NEJ_PLATFORM'),
            parsers:_gOption.parsers,
            processors:_util.merge(
                _gConfig.get('NEJ_PROCESSOR'),
                _gOption.processors
            )
        };
    };
    // get output config
    var _getOutputConfig = function(){
        return {
            webRoot:_gConfig.get('DIR_WEBROOT'),
            staticRoot:_gConfig.get('DIR_STATIC'),
            sourceRoot:_gConfig.get('DIR_OUTPUT'),
            templateRoot:_gConfig.get('DIR_OUTPUT_TP'),
            outputRoot:_gConfig.get('DIR_OUTPUT_STATIC'),
            versionMode:_gConfig.get('VERSION_MODE'),
            versionStatic:_gConfig.get('VERSION_STATIC'),
            rsDomain:_gConfig.get('DM_STATIC_RS')
        };
    };
    // parse config file
    var _doParseConfig = function(file){
        var error = !1;
        this._logger.error = function(event){
            error = !0;
            _doLog.call(this,'error',event);
        };
        // parse config file
        var ret = new _ConfParser(
            file,this._logger
        );
        // exit when config parse error
        if (error){
            _logger.dump2file(
                ret.get('X_LOGGER_FILE')
            );
            process.exist(-1);
        }
        return ret;
    };
    // init logger config
    var _doUpdateLogger = function(level,file){
        // config logger level
        _logger.config({
            level:_gConfig.get('X_LOGGER_LEVEL'),
            onlog:function(event){
                if (!!event.level){
                    console.log(event.message);
                }
                fs.appendFileSync(
                    _gConfig.get('X_LOGGER_FILE'),
                    event.message
                );
            }
        });
        // error log when processing
        this._logger.error = function(event){
            _doLog.call(this,'error',event);
            process.exist(-1);
        };
    };
    // parse html files
    var _doParseHtmlFiles = function(istpl){
        var key = !istpl?'DIR_SOURCE':'DIR_SOURCE_TP';
        // check root
        var root = _gConfig.get(key);
        if (!root){
            return;
        }
        // format config
        var config = _getParseConfig(),
            filter = _gConfig.get('FILE_FILTER'),
            opt = {
                root:root,
                isTemplate:!!istpl,
                file:_gConfig.get('DIR_CONFIG')+'deploy.html'
            };
        // dump files and parse every file
        (_gConfig.get(key+'_SUB')||[root]).forEach(function(dir){
            var list = _fs.lsfile(dir,function(name,path){
                return !/^\./.test(name)&&(!filter||filter.test(path));
            });
            list.forEach(function(file){
                opt.uri = file;
                var ret = new _HtmlParser(
                    opt,this._logger
                );
                this.result[file] = ret;
                ret.parse(config);
            },this);
        },this);
    };
    // prepare merge config
    var _gCoreMap = {},
        _gCoreMask = {};
    var _doParseMergeConfig = function(){
        var config = _getParseConfig(),
            opt = {
                file:_gConfig.get('DIR_CONFIG')+'core.html'
            };
        [
            {key:'list',type:'js'},{key:'list',type:'cs'},
            {key:'mask',type:'js'},{key:'mask',type:'cs'}
        ].forEach(function(item){
            opt.list = _gConfig.get(
                util.format(
                    'CORE_%s_%s',
                    item.key,item.type
                )
            );
            if (!!config.list&&config.list.length>0){
                var cache = item.key==='mask'?_gCoreMask:_gCoreMap,
                    Klass = item.type==='js'?_JSExplorer:_CSExplorer;
                var ret = new Klass(
                    opt,this._logger
                );
                cache[item.type] = ret;
                ret.parse(config);
            }
        },this);
    };
    // update merge config after file load
    var _doUpdateMergeConfig = function(){
        ['js','cs'].forEach(function(name){
            // dump core list
            var parser = _gCoreMap[name];
            if (!!parser){
                _gCoreMap[name] = parser.getDependencies();
            }
            // dump mask list
            parser = _gCoreMask[name];
            if (!!parser){
                _gCoreMask[name] = parser.getDependencies({
                    noRecursion:!0
                });
            }
            // calculate core list
            if (!_gCoreMap[name]){
                _gCoreMap[name] = _doMergeCoreList.call(
                    this,name,
                    _gConfig.get('CORE_FREQUENCY_'+name)
                );
            }
            // mask file from core list
            _doMaskCoreList(_gCoreMap[name],_gCoreMask[name]);
        });
    };
    // merge core list
    var _doMergeCoreList = function(type,count){
        var ret = [],
            test = {};
        Object.keys(this.result).forEach(function(parser){
            var list = parser.getDependencies({
                resType:type,
                ignoreEntry:_gConfig.get('CORE_IGNORE_ENTRY')
            });
            list.forEach(function(uri){
                if (!test[uri]){
                    test[uri] = 0;
                }
                test[uri]++;
                if (test[uri]===count){
                    ret.push(uri);
                }
            });
        });
        return ret;
    };
    //  mask uri from core list
    var _doMaskCoreList = function(core,mask){
        if (!core||!mask||!mask.length){
            return;
        }
        mask.forEach(function(uri){
            var index = core.indexOf(uri);
            if (index>=0){
                core.splice(index,1);
            }
        });
    };
    // merge and output after resource loaded
    var _onResourceLoaded = function(){
        _doUpdateMergeConfig.call(this);
        var config = _getOutputConfig();
        Object.keys(this.result).forEach(function(parser){
            parser.zipStyle(
                _util.merge(
                    config,{
                        core:_gCoreMap.cs,
                        csDomain:_gConfig.get('DM_STATIC_CS'),
                        maxInlineSize:_gConfig.get('OBF_MAX_CS_INLINE_SIZE')
                    }
                )
            );
            parser.zipScript(config);
            parser.zipTemplate(config);
            parser.zipModule(config);
            parser.output(config);
        });
    };
    // init processor
    var _doStartProcess = function(file){
        // start process
        _logger.info(
            'node version is %s, toolkit version is %s',
            process.version,require('../../package.json').version
        );
        // parse config file
        _gConfig = _doParseConfig.call(
            this,file
        );
        // update logger config
        _doUpdateLogger.call(
            this,
            _gConfig.get('X_LOGGER_LEVEL'),
            _gConfig.get('X_LOGGER_FILE')
        );
        // parse html/template files
        _doParseHtmlFiles.call(this,!1);
        _doParseHtmlFiles.call(this,!0);
        // prepare merge config
        _doParseMergeConfig.call(this);
        // merge resource after download finish
        _io.onload(_onResourceLoaded.bind(this));
    };
    // start deploy process
    var file;
    if (typeof config==='string'){
        file = config;
    }else{
        file = config.file;
        _gOption = _util.fetch(
            DEFAULT_CONFIG,config
        );
    }
    _doStartProcess.call(this,file);
};
util.inherits(Processor,_Abstract);