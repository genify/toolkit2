/*
 * project deploy processor
 * @module   parser/proc
 * @author   genify(caijf@corp.netease.com)
 */
var fs    = require('file'),
   _io    = require('./util/io.js'),
   _fs    = require('./util/file.js'),
   _util  = require('./util/util.js'),
   _log   = require('./util/logger.js');
// default config
var DEFAULT = {
    parsers     : null,
    processors  : null
};
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
    this._options = _util.fetch(
        DEFAULT,config
    );
    // init private variable
    this._core = {
        list:{},
        mask:{}
    };
    this._result = {};
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
    // update logger and merge config
    this._parseLoggerConfig();
    this._parseMergeConfig();
    // parse static html and server template
    this._parseInputFiles(!0);
    this._parseInputFiles(!1);
    // merge and output after resource loaded
    _io.onload(this._afterResourceLoaded.bind(this));
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
pro._parseLoggerConfig = function(){
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
 * parse merge config
 * @private
 * @return {Void}
 */
pro._parseMergeConfig = function(){
    var config = _getParseConfig(),
        opt = _util.merge(this._logger,{
            file:this._config.get('DIR_CONFIG')+'core.html'
        });
    [
        {key:'list',type:'js'},{key:'list',type:'cs'},
        {key:'mask',type:'js'},{key:'mask',type:'cs'}
    ].forEach(function(item){
        opt.list = this._config.get(
            util.format(
                'CORE_%s_%s',
                item.key,item.type
            )
        );
        if (!!config.list&&config.list.length>0){
            var name = item.type==='js'?'script':'style',
                Klass = require('./explorer/'+name+'.js');
            var ret = new Klass(opt);
            this._core[item.key][item.type] = ret;
            ret.parse(config);
        }
    },this);
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
    var Parser = require('./meta/html.js'),
        filter = this._config.get('FILE_FILTER'),
        opt = _util.merge(this._logger,{
            root:root,
            isTemplate:!!istpl,
            file:this._config.get('DIR_CONFIG')+'deploy.html'
        });
    // dump files and parse every file
    (this._config.get(key+'_SUB')||[root]).forEach(function(dir){
        var list = _fs.lsfile(dir,function(name,path){
            return !/^\./.test(name)&&(!filter||filter.test(path));
        });
        list.forEach(function(file){
            opt.uri = file;
            var ret = new Parser(opt);
            this.result[file] = ret;
            ret.parse(config);
        },this);
    },this);
};
/**
 * do next process after resource loaded
 * @private
 * @return {Void}
 */
pro._afterResourceLoaded = function(){

};





// deploy processor
// file         config file path
// processors   nej processors definition
var Processor = module.exports = function(config){
    _Abstract.apply(this,arguments);

    // private variable
    var _gConfig;
    // get parse config
    var _getParseConfig = function(){
        var flag = this.get('X_NOPARSE_FLAG');
        return {
            charset:this.get('FILE_CHARSET'),
            noCompress:this.get('X_NOCOMPRESS'),
            noCoreFlag:this.get('X_NOCORE_FLAG'),
            ignoreMode:this.get('X_RELEASE_MODE'),
            keepComment:this.get('X_KEEP_COMMENT'),
            exLinkAttributeName:this.get('X_AUTO_EXLINK_PREFIX'),
            notParseInlineStyle:flag==1||flag==3,
            notParseInlineScript:flag==2||flag==3,
            aliasReg:this.get('ALIAS_MATCH'),
            aliasDict:this.get('ALIAS_DICTIONARY'),
            webRoot:this.get('DIR_WEBROOT'),
            libRoot:this.get('NEJ_DIR'),
            nejPlatform:this.get('NEJ_PLATFORM'),
            processors:this.get('NEJ_PROCESSOR')
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

    var _doZipResource = function(){

    };
    // merge and output after resource loaded
    var _onResourceLoaded = function(){
        _doUpdateMergeConfig.call(this);
        var config = _getOutputConfig();
        Object.keys(this.result).forEach(function(parser){
            parser.beginZip(config);
            parser.zipStyle({
                core:_gCoreMap.cs,
                csDomain:_gConfig.get('DM_STATIC_CS'),
                spriteRoot:_gConfig.get('OPT_IMAGE_SPRITE')
            });
            parser.zipScript({
                core:_gCoreMap.js,
                jsDomain:_gConfig.get('DM_STATIC_JS')
            });
            parser.zipTemplate(config);
            parser.zipModule(config);
            parser.endZip();
            parser.output(config);
        });
    };
};
util.inherits(Processor,_Abstract);