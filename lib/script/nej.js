/*
 * NEJ File Content Parser
 * @module   script/parser
 * @author   genify(caijf@corp.netease.com)
 */
var Parser = require('../util/klass.js').create();
var pro = Parser.extend(require('./parser.js'));








var util        = require('util'),
    path        = require('path'),
   _const       = require('../constant.js'),
   _fs          = require('../util/file.js'),
   _path        = require('../util/path.js'),
   _util        = require('../util/util.js'),
   _network     = require('../util/network.js'),
   _Abstract    = require('../util/event.js');
/**
 * NEJ文件内容信息分析
 * @param  {String} content 文件内容
 * @return {Object}
 */
var _parseDefineFile = (function(){
    // do nej define
    var _doDefine = function(uri,deps,func){
        var args = _doFormatArgs.apply(this,arguments);
        this.isNEJ = !0;
        this.depList = args[1];
        this.sourceCode = (args[2]||'').toString();
    };
    return function(content){
        // emulate NEJ define env
        // void over write result
        var re_20150511_sult = {},
            define = _doDefine.bind(re_20150511_sult),
            NEJ = { define:define };
        // eval content for nej check
        try{
            eval(content);
        }catch(ex){
            // ignore
        }
        if (re_20150511_sult.isNEJ){
            return new NEJParser(
                re_20150511_sult
            );
        }
        return null;
    };
})();
// nej file parser
// depList        dependency list
// sourceCode     source code
var NEJParser = function(config){
    _Abstract.apply(this,arguments);
    
    // private variable
    var _gDepCache = {};
    
    // parse nej patch
    var _doPatch = function(patform,deps,func){
        var args = _doFormatArgs.apply(this,arguments);
        if (!this.patches){
            this.patches = [];
        }
        this.patches.push(
            new PatchParser({
                expression:args[0],
                dependency:args[1],
                source:(args[2]||'').toString()
            })
        );
    };
    // eval content to check nej patch
    var _doEvalNEJPatch = function(content){
        // emulate NEJ patch env
        var re_20150511_sult = {}, 
            NEJ = {
                patch:_doPatch.bind(re_20150511_sult)
            };
        // eval content for nej patch check
        try{
            eval(util.format('(%s)();',content));
        }catch(ex){
            // ignore
        }
        return re_20150511_sult.patches;
    };
    // parse patch source
    var _doParseNEJPatch = function(source,config){
        this.patchConfig = {};
        // for function (a,b,c) -> [a,b,c]
        var reg1 = /^\s*function\s*\((.*?)\)/;
        if (reg1.test(source)){
            this.patchConfig.args = RegExp.$1.split(/\s*,\s*/)||[];
        }
        // for return a; } -> return a;
        var reg2 = /(return\s*[\w;\s$]+)\s*}\s*$/;
        if (reg2.test(source)){
            this.patchConfig.returnExp = RegExp.$1;
        }
        // find 
        // platform argument index
        var platform = config.nejRoot+'base/platform.js',
            pconf = this.patchConfig;
        this.injectorList.forEach(function(arg,index){
            var uri = arg.uri;
            if (uri===platform){
                pconf.platformName = 
                    pconf.args[index]||
                    util.format('arguments[%s]',index);
                return;
            }
        },this);
        // check platform dependency
        if (!pconf.platformName){
            this.dependencyList.unshift(platform);
            this.injectorList.unshift({
                uri:platform
            });
            pconf.platformName = 'b'+(+new Date);
            pconf.args.unshift(pconf.platformName);
        }
    };
    // merge patch source
    var _doMergeNEJPatch = function(patches,source,config){
        var ret = [];
        patches.forEach(function(patch){
            patch.parse(config);
            if (patch.isFitPlatform){
                ret.push(patch.getSource(this.patchConfig));
                var list = patch.getDependencies();
                list.forEach(function(uri){
                    if (this.dependencyList.indexOf(uri)<0){
                        this.dependencyList.push(uri);
                    }
                },this);
            }
        },this);
        // rebuild source code
        if (ret.length>0){
            var conf = this.patchConfig;
            return util.format(
                'function(%s){\n%s\n%s;\n}',
                conf.args.join(','),
                ret.join('\n'),
                conf.returnExp
            );
        }
        return '';
    };
    // complete dependency list
    var _doCompleteDepList = function(config){
        this.dependencyList = [];
        this.injectorList.forEach(function(uri,index,list){
            var ret = _completeURI(uri,config);
            if (this.dependencyList.indexOf(ret.uri)<0){
                this.dependencyList.push(ret.uri);
                if (!!ret.patch){
                    this.dependencyList.push(ret.patch);
                }
            }
            list[index] = ret;
        },this);
    };
    // serialize injector list
    var _doSerializeInjector = function(list){
        var ret = [];
        list.forEach(function(item){
            ret.push(
                _fs.key(
                    ret.patch||ret.uri
                )
            );
        });
        return ret.join(',');
    };
    // update nej file
    this.update = function(config){
        this.source = config.sourceCode;
        this.injectorList = config.depList||[];
    };
    // parse nej file
    // file           file path
    // params         parameters in path for nej dependency
    // webRoot        web root path
    // nejRoot        nej lib root
    // nejPlatform    nej output platform
    // preprocessor   pre-processor for resource
    this.parse = function(config){
        this.filepath = config.file;
        config = _util.merge(config,{
            pathRoot:path.dirname(this.filepath)+'/'
        });
        // complete injector list
        _doCompleteDepList.call(this,config);
        // check nej patch source
        var source = this.source,
            patches = _doEvalNEJPatch(source);
        // for nej patch file
        if (!!patches){
            _doParseNEJPatch.call(
                this,source,config
            );
            source = _doMergeNEJPatch.call(
                this,patches,source,config
            );
        }
        // update source code
        if (!source){
            this.source = '';
        }else{
            var arr = _doSerializeInjector(this.injectorList);
            arr.unshift(_fs.key(this.filepath),source);
            this.source = util.format('I$(%s);',arr.join(','));
        }
        // cache and load dependency list
        _gDepCache[this.filepath] = this.dependencyList;
        this.dependencyList.forEach(function(uri){
            _network.get(uri,function(event){
                // content has been parsed
                if (event.fromCache){
                    return;
                }
                var content = event.value,
                    ret = _parseDefineFile(content);
                // common file
                if (!ret){
                    return;
                }
                // nej file
                var config = _util.merge(
                    config,{file:uri}
                );
                ret.parse(config);
                event.value = ret.source;
            });
        });
    };
    // dump dependency list
    this.getDependencies = function(){
        
    };
    // update nej content
    if (!!config){
        this.update(config);
    }
};
util.inherits(NEJParser,_Abstract);


// exports
exports.Parser 		= NEJParser;
exports.Patcher 		= PatchParser;
exports.parseURI 	= _parseDefineURI;
exports.parseFile 	= _parseDefineFile;
exports.completeURI 	= _completeURI;
