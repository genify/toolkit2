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
   _nej		   = require('../script/nej.js'),
   _Abstract   = require('../event.js'),
   _ConfParser = require('./config.js'),
   _HtmlParser = require('./html.js');
// deploy processor
var Processor = module.exports = function(file){
    _Abstract.apply(this,arguments);
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
    var _gConfig = null;
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
    var _doInitLogger = function(level,file){
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
    var _doParseHtmlFiles = function(key){
        // check root
        var root = _gConfig.get(key);
        if (!root) return;
        var flag = _gConfig.get('X_NOPARSE_FLAG'),
            filter = _gConfig.get('FILE_FILTER'),
            prsConfig = {
                charset:_gConfig.get('FILE_CHARSET'),
                noCompress:_gConfig.get('X_NOCOMPRESS'),
                noCoreFlag:_gConfig.get('X_NOCORE_FLAG'),
                ignoreMode:_gConfig.get('X_RELEASE_MODE'),
                keepComment:_gConfig.get('X_KEEP_COMMENT'),
                exLinkAttributeName:_gConfig.get('X_AUTO_EXLINK_PREFIX'),
                notParseInlineStyle:flag==1||flag==3,
                notParseInlineScript:flag==2||flag==3
            },
            resConfig = {
                aliasReg:_gConfig.get('ALIAS_MATCH'),
                aliasDict:_gConfig.get('ALIAS_DICTIONARY'),
                webRoot:_gConfig.get('DIR_WEBROOT'),
                nejRoot:_gConfig.get('NEJ_DIR'),
                nejPlatform:_gConfig.get('NEJ_PLATFORM'),
                processors:_gConfig.get('NEJ_PROCESSOR')
            };
        // dump files and parse every file
        (_gConfig.get(key+'_SUB')||[root]).forEach(function(dir){
            var list = _fs.lsfile(dir,function(name,path){
                return !/^\./.test(name)&&(!filter||filter.test(path));
            });
            list.forEach(function(file){
                prsConfig.file = file;
                var ret = new HtmlParser(
                    prsConfig,this._logger
                );
                this.result[file] = ret;
                ret.parseResource(resConfig);
            },this);
        },this);
    };



    // prepare merge config
    var _doParseMergeConfig = function(){
        var pathRoot = _gConfig.get('DIR_CONFIG');
        var config = {
            file:pathRoot+'core.html'
        };
        // check core script list config
        config.list = _gConfig.get('CORE_LIST_JS');
        if (!!config.list&&config.list.length>0){
            _gCoreMap.js = new _JSExplorer(
                config,_gLogger
            );
        }
        // check core css list config
        config.list = _gConfig.get('CORE_LIST_CS');
        if (!!config.list&&config.list.length>0){
            _gCoreMap.css = new _CSExplorer(
                config,_gLogger
            );
        }
        var webRoot = _gConfig.get('DIR_WEBROOT');
        // check mask script list config
        var mask = _gConfig.get('CORE_MASK_JS');
        if (!!mask){
        		var opt = {
        			webRoot:webRoot,
        			pathRoot:pathRoot
        		};
        		mask.forEach(function(uri,index,list){
        			list[index] = _nej.completeURI(uri,opt);
        		});
        }
        // check mask style list config
        var mask = _gConfig.get('CORE_MASK_CS');
        if (!!mask){
        		mask.forEach(function(uri,index,list){
        			list[index] = _path.absoluteAltRoot(
        				uri,pathRoot,webRoot
        			);
        		});
        		_gCoreMask.css = mask;
        }
    };
    // mask core list from mask list
    var _doMaskCore = function(list,mask){
        if (!mask||!list.length){
            return;
        }
        mask.forEach(function(uri){
            var index = list.indexOf(uri);
            if (index>=0){
                list.splice(index,1);
            }
        });
    };
    // merge style
    var _doMergeCore = function(map,key){
        var ret = [], test = {},
            count = _gConfig.get(key)||2;
        Object.keys(map).forEach(function(file){
            map[file].forEach(function(uri){
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
    // merge result
    var _doMergeResult = function(){
        var styles = {},
            scripts = {};
        // core js config
        if (!!_gCoreMap.js){
            scripts = null;
            _gCoreMap.js = _gCoreMap.js.getDependencies();
        }
        // core css config
        if (!!_gCoreMap.css){
            styles = null;
            _gCoreMap.css = _gCoreMap.css.getDependencies();
        }
        // dump core from html/template file
        if (!!styles||!!scripts){
            Object.keys(this.result).forEach(function(file){
                var inst = this.result[file];
                if (!!styles){
                    styles[file] = inst.getStyles();
                }
                if (!!scripts){
                    scripts[file] = inst.getScripts();
                }
            },this);
            // merge core
            if (!!styles){
                _gCoreMap.css = _doMergeCore.call(
                    this,styles,'CORE_FREQUENCY_CS'
                );
            }
            if (!!scripts){
                _gCoreMap.js = _doMergeCore.call(
                    this,scripts,'CORE_FREQUENCY_JS'
                );
            }
        }
        // split by mask
        _doMaskCore(_gCoreMap.js,_gCoreMask.js);
        _doMaskCore(_gCoreMap.css,_gCoreMask.css);
        // split core from html/template file
        _util.loop(
            this.result,function(inst){
                inst.splitCore(_gCoreMap);
            }
        );
    };
    // update static resource
    var _doUpdateResource = function(){
        Object.keys(this.result).forEach(function(file){
            var inst = this.result[file];
            // adjust static resource
            inst.adjustStaticResource({
                webRoot:_gConfig.get('DIR_WEBROOT'),
                resRoot:_gConfig.get('DIR_STATIC'),
                domain:_gConfig.get('DM_STATIC_RS'),
                version:_gConfig.get('VERSION_STATIC')
            });
        },this);
    };
    // output deploy result
    var _doOutputResult = function(){
        
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
        _doInitLogger.call(
            this,
            _gConfig.get('X_LOGGER_LEVEL'),
            _gConfig.get('X_LOGGER_FILE')
        );
        // parse html/template files
        _doParseHtmlFiles.call(this,'DIR_SOURCE');
        _doParseHtmlFiles.call(this,'DIR_SOURCE_TP');
        // prepare merge config
        _doParseMergeConfig.call(this);
        // merge resource after download finish
        _io.onload(function(){
            _doMergeResult.call(this);
            _doUpdateResource.call(this);
            _doOutputResult.call(this);
        }.bind(this));
    };
    // start deploy process
    _doStartProcess.call(this,file);
};
util.inherits(Processor,_Abstract);