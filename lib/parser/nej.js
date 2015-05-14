var util        = require('util'),
    path        = require('path'),
   _const       = require('../constant.js'),
   _fs          = require('../util/file.js'),
   _path        = require('../util/path.js'),
   _util        = require('../util/util.js'),
   _network     = require('../util/network.js'),
   _Abstract    = require('../event.js');
// format arguments
var _formatArgs = function(){
    var args = [null,null,null],
        kfun = [
            function(arg){return typeof(arg)=='string';},
            util.isArray,
           _util.isFunction
        ];
    for(var i=0,l=arguments.length,it;i<l;i++){
        it = arguments[i];
        for(var j=0,k=kfun.length;j<k;j++){
            if (kfun[j](it)){
                args[j] = it;
                break;
            }
        }
    }
    return args;
};
/**
 * 补全路径地址
 * @param  {String} uri    待补全路径
 * @param  {Object} config 配置信息
 * @return {String}        补全后路径信息
 */
var _completeURI = function(uri,config){
    // for json!./a.json
    var arr = uri.split('!'),
        ret = {uri:arr[0]||''};
    if (arr.length>1){
        ret.parser = arr.shift().toLowerCase();
        ret.uri = arr.join('!');
    }
    // for {platform}widget.js
    // -> ./platform/widget.js and ./platform/widget.patch.js
    if (ret.uri.indexOf('{platform}')==0){
        ret.uri = ret.uri.replace(
            '{platform}','./platform/'
        );
        ret.patch = ret.uri.replace(
            /(\.js)$/i,'.patch$1'
        );
    }
    // for http://a.b.com/x.js
    if (_path.isURL(ret.uri)){
        return ret;
    }
    // for base/util or pro/widget/ui
    var map = config.nejConfig.params||{};
    if (ret.uri.search(/[./]/)!=0){
        var arr = ret.uri.split('/'),
            prefix = map[arr[0]];
        if (!prefix){
            // for base/util
            prefix = map.lib;
        }else{
            // pro/widget/ui
            arr.shift();
        }
        ret.uri = prefix+arr.join('/')+'.js';
    }
    // for {A}a/b.js
    ret.uri = ret.uri.replace(/{(.*?)}/g,function($1,$2){
        return map[$2]||$1;
    });
    
    return ret;
};
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
/**
 * 解析NEJ define.js文件路径
 * http://fed.netease.com/nej/src/define.js?c=gbk&p=./dep.js&com=/src/javascript/
 * @param  {Object} uri    文件路径
 * @param  {Object} config 配置信息
 * @return {Object}        配置信息
 */
var _parseDefineURI = (function(){
    var _doConfig = function(map){
        this.map = map;
    };
    var _doEvalNEJConfig = function(content){
        var re_20150511_sult = {},
            handler = _doConfig.bind(re_20150511_sult),
            NEJ = { deps:handler, config:handler };
        // detect dep config 
        try{
            eval(content);
        }catch(ex){
            // ignore
        }
        return re_20150511_sult.map||null;
    };
    return function(uri,config){
        // for ${libRoot}define.js${nejConfig}
        var src = uri.replace(
            config.aliasReg,function($1,$2){
                return config.aliasDict[$2]||$1;
            }
        );
        // 0 - http://a.b.com/nej/define.js
        // 1 - a=aaaa&b=bbbb&c=ccccc
        var ret = {},
            arr = src.split(/[?#]/),
            params = query.parse(arr[1]||'')||{};
        ret.params = params;
        // for c or d or p or g
        delete params.g;
        delete params.c;
        if (!!params.d){
            // dump dep config
            var file = _path.absoluteAltRoot(
                params.d,config.pathRoot,config.webRoot
            );
            ret.deps = _doEvalNEJConfig(
                _fs.read(file,config.charset).join('\n')
            );
            delete params.d;
            // complete uri
            var map = ret.deps||{},
                opt = _util.merge(config,{
                    pathRoot:path.dirname(file)+'/'
                });
            Object.keys(map).forEach(function(key){
                var xlist = map[key];
                xlist.forEach(function(uri,index,list){
                    list[index] = _completeURI(uri,opt).uri;
                });
                map[_completeURI(key,opt).uri] = xlist;
            });
        }
        if (!!params.p){
            ret.platform = params.p;
            delete params.p;
        }
        // absolute param path
        Object.keys(params).forEach(function(key){
            params[key] = _path.absoluteAltRoot(
                params[key],config.pathRoot,config.webRoot
            );
        },this);
        // check parameters
        if (config.nejRoot){
            params.lib = config.nejRoot;
        }else{
            params.lib = _path.absoluteAltRoot(
                path.dirname(arr[0])+'/',
                config.pathRoot,config.webRoot
            );
        }
        if (!params.pro){
            params.pro = _path.absolute(
                './src/javascript/',
                config.webRoot
            );
        }
        return ret;
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
                _fs.getFileKey(
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
            arr.unshift(_fs.getFileKey(this.filepath),source);
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

// nej patch parser
// expression     platform expression
// dependency     dependency list
// source         source code
var PatchParser = function(config){
    _Abstract.apply(this,arguments);
    
    // parse platform expression eg. TR>=8
    var _pMap = {
            td:'trident',wk:'webkit',gk:'gecko',
            android:'webkit',ios:'webkit',cef:'webkit',win:'td-1'
        },
        _cMap = {t:'trident',w:'webkit',g:'gecko'},
        _vMap = {r:'release',v:'version'},
        _fMap = [
            // for 2.0a<= or 2.0a= or 2.0a>=
            function(result,exp){
                switch(exp.op){
                    case '<':
                    case '<=':
                        result.lower = exp;
                    break;
                    case '>':
                    case '>=':
                        result.upper = exp;
                    break;
                    case '=':
                    case '==':
                        result.midle = exp;
                    break;
                }
            },
            // for <=2.0a or =2.0a or >=2.0a
            function(result,exp){
                switch(exp.op){
                    case '<':
                    case '<=':
                        // check over write upper
                        var upper = result.upper;
                        if (!upper||exp.value<=upper.value){
                            result.upper = exp;
                            if (!!upper){
                                exp.eq = upper.eq&&exp.eq;
                            }
                        }
                    break;
                    case '>':
                    case '>=':
                        // check over write lower
                        var lower = result.lower;
                        if (!lower||exp.value>=lower.value){
                            result.lower = exp;
                            if (!!lower){
                                exp.eq = lower.eq&&exp.eq;
                            }
                        }
                    break;
                    case '=':
                    case '==':
                        // check over write lower
                        var midle = result.midle;
                        if (!midle){
                            result.midle = exp;
                        }else if(midle.value!==exp.value){
                            result.dirty = !0;
                            delete result.midle;
                        }
                    break;
                }
            }
        ];
    var _doParseExpression = function(exp){
        exp = (exp||'').replace(/\s/g,'').toLowerCase();
        if (!/(tr|wr|gr|tv|wv|gv)/i.test(exp)){
            return null;
        }
        // parse expresion to platfrom
        var ret = {},
            eng = RegExp.$1.toLowerCase(),
            arr = eng.split('');
        ret.engine = util.format(
            "._$KERNEL.engine==='%s'",
            _cMap[arr[0]]||''
        );
        // for TR or GR or WR
        if (eng===exp){
            return ret;
        }
        // for TR=3.0 or 2.0<=TR<=4.0
        ret.version = util.format(
            '._$KERNEL.%s',
            _vMap[arr[1]]||'release'
        );
        // check version condition
        var ver = /([<>=]+)/;
        exp.split(eng).forEach(function(value,index){
            if (!ver.test(value)){
                return;
            }
            var op = RegExp.$1,
                vl = str.replace(op,'');
            _fMap[index](ret,{
                value:vl,op:op,
                eq:op.indexOf('=')>=0
            });
        });
        return !ret.dirty?ret:null;
    };
    // parse platform eg. td|wk|gk
    var _doParsePlatform = function(platform){
        platform = (platform||'td|wk|gk').toLowerCase();
        var ret = { engines:[] };
        // check engine
        platform.split('|').forEach(function(key){
            var arr = key.split('-'),
                eng = _pMap[arr[0]];
            if (ret.engines.indexOf(eng)<0){
                ret.engines.push(eng);
            }
        });
        // td-0 -> TR>=3.0 (ie>=7)
        // td-1 -> TR>=6.0 (ie>=10)
        if (platform.indexOf('td-0')>=0){
            ret.lower = '3.0';
        }
        if (platform==='win'||
            platform.indexOf('td-1')>=0){
            ret.lower = '6.0';
        }
        return ret;
    };
    // parse platform support
    var _doParseSupport = function(){
        var engines = this.platform.engines,
            index = engines.indexOf(this.exp.engine);
        this.isFitPlatform = index>=0;
        if (!this.isFitPlatform){
            return;
        }
        // check version
        var lower = this.platform.lower;
        if (lower==null){
            return;
        }
        // check upper
        var upper = this.exp.upper;
        if (!!upper){
            if (upper.value<lower||
               (upper.value==lower&&!upper.eq)){
                this.isFitPlatform = !1;
            }
            return;
        }
        // check middle
        var midle = this.exp.midle;
        if (!!midle&&midle.value<lower){
            this.isFitPlatform = !1;
        }
    };
    // generate platform condition
    var _doGenCondition = function(name){
        var ret = name+this.exp.engine,
            ver = name+this.exp.version,
            arr = [];
        // check lower
        var lower = this.exp.lower;
        if (!!lower){
            arr.push(
                util.format(
                    "%s>%s'%s'",
                    ver,lower.eq?'=':'',
                    lower.value
                )
            );
        }
        // check middle
        var midle = this.exp.midle;
        if (!!midle){
            arr.push(ver+"=='"+midle.value+"'");
        }
        // check upper
        var upper = this.exp.upper;
        if (!!upper){
            arr.push(
                util.format(
                    "%s>%s'%s'",
                    ver,upper.eq?'=':'',
                    upper.value
                )
            );
        }
        // suffix
        var other = '';
        if (arr.length>0){
            other = '&&'+arr.join('&&');
        }
        return ret+other;
    };
    // serialize injector list
    var _doSerializeInjector = function(list){
        var ret = [];
        list.forEach(function(uri){
            ret.push(_fs.getFileKey(uri));
        });
        return ret.join(',');
    };
    // update config
    this.update = function(config){
        this.exp = _doParseExpression(
            config.expression
        );
        this.source = config.source||'';
        this.dependency = config.dependency||[];
    };
    // parse patch information
    this.parse = function(config){
        // expression illegal
        if (!this.exp){
            this.isFitPlatform = !1;
            return;
        }
        // complete dependency list
        this.dependency.forEach(function(uri,index,list){
            list[index] = _completeURI(uri,config);
        });
        // parse platform
        this.platform = _doCheckPlatform.call(
            config.nejPlatform
        );
        // parse platform support
        _doParseSupport.call(this);
    };
    // get patch source
    // platformName    platform argument name
    this.getSource = function(config){
        // only for dependency
        // NEJ.path('TR<=4.0',['./3rd/json.js']);
        if (!this.source){
            return '';
        }
        // injector list
        var arr = _doSerializeInjector(this.dependency);
        arr.unshift(_fs.getFileKey(),this.source);
        return util.format(
            'if(%s){\nI$(%s);\n}\n',
            _doGenCondition.call(
                this,config.platformName
            ),
            arr.join(',')
        );
    };
    // dump dependency list
    this.getDependencies = function(){
        return this.dependency;
    };
    // update config
    if (!!config){
        this.update(config);
    }
};
util.inherits(PatchParser,_Abstract);

// exports
exports.Parser = NEJParser;
exports.Patcher = PatchParser;
exports.parseURI = _parseDefineURI;
exports.parseFile = _parseDefineFile;
