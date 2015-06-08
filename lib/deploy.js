/*
 * project deploy processor
 * @module   parser/proc
 * @author   genify(caijf@corp.netease.com)
 */
var fs    = require('file'),
   _io    = require('./util/io.js'),
   _fs    = require('./util/file.js'),
   _util  = require('./util/util.js'),
   _path  = require('./util/path.js'),
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
    this._core = {};
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
    this._parseLogConfig();
    this._parseMergeConfig();
    // parse static html and server template
    this._parseInputFiles(!0);
    this._parseInputFiles(!1);
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
    // parse core and mask js list
    var config = this._config.format({
        nejPlatform:'NEJ_PLATFORM',
        webRoot:'DIR_WEBROOT',
        libRoot:'NEJ_DIR'
    });
    config = _util.merge(config,{
        pathRoot:pathRoot,
        params:{
            lib:config.libRoot,
            pro:config.webRoot+'src/javascript/'
        }
    });
    // parse mask js list
    var list = this._config.get('CORE_MASK_JS');
    if (!!list){
        var nej = require('./script/nej/util.js');
        list.forEach(function(uri,index,list){
            var ret = nej.parseURI(
                uri,config
            );
            list[index] = ret.uri;
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
        this._core.coreJS.parse(config);
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
        var list  = [],
            test  = {},
            count = config.resFreq;
        Object.keys(this.result).forEach(function(parser){
            var ret = parser.getDependencies({
                resType:config.resType,
                ignoreEntry:config.ignoreEntry
            });
            ret.forEach(function(uri){
                if (!test[uri]){
                    test[uri] = 0;
                }
                test[uri]++;
                if (test[uri]===count){
                    list.push(uri);
                }
            });
        });
        this._core[config.key] = list;
    }
    // split core mask
    if (list.length>0){
        var mask = config.mask||[];
        mask.forEach(function(uri){
            var index = list.indexOf(uri);
            if (index>=0){
                list.splice(index,1);
            }
        });
    }
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
 * do next process after resource prepared
 * @private
 * @return {Void}
 */
pro._afterResPrepared = function(){
    // update core list
    this._parseMergeCore();
    // merge resource
    Object.keys(this._result).forEach(
        function(file){
            var parser = this._result[file];
            parser.begMerge();
            parser.mergeStyle({
                core:this._core.coreCS
            });
            parser.mergeScript({
                core:this._core.coreJS
            });
            parser.endMerge();
        },this
    );
    //
};
