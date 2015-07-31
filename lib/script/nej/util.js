/*
 * NEJ Utility API
 * @module   script/nej/util
 * @author   genify(caijf@corp.netease.com)
 */
var vm      = require('vm'),
    util    = require('util'),
    path    = require('path'),
    query   = require('querystring'),
   _io      = require('../../util/io.js'),
   _fs      = require('../../util/file.js'),
   _dep     = require('../../util/dependency.js'),
   _path    = require('../../util/path.js'),
   _util    = require('../../util/util.js');
// nej config cache
// nejRoot          nej source root
// nejPlatform      export platform config
// nejPatchRoot     nej patch root
// nejInjector      nej injector funciton name
// nejProcessor     nej plugin processor
// params           parameters definition, eg. lib/pro ...
var _gCache = {
    params:{},
    nejInjector:'I$',
    nejProcessor:{
        text:function(event){
            return JSON.stringify(event.content);
        },
        json:function(event){
            return event.content;
        }
    }
};
// NEJ define.js replacement
exports.NEJ_DEFINE_FILE = _path.absolute(
    './define.js',
    path.dirname(__filename)+'/'
);
/**
 * cache nej config
 * @param  {String}   key   - config key
 * @param  {Variable} value - config value
 * @return {Void}
 */
exports.cacheConfig = function(key,value){
    if (typeof key==='string'){
        // can not be overwrited
        if (key==='nejRoot'||key==='nejPlatform'){
            var ret = _gCache[key];
            if (!ret){
                _gCache[key] = value;
                if (key==='nejRoot'){
                    _gCache.params.lib = value;
                    _gCache.nejPatchRoot = value+'/patched/';
                }
            }
            return;
        }
        // for params normalize path before merge all values
        if (key==='params'){
            value = value||{};
            delete (value).lib;
            Object.keys(value).forEach(function(name){
                _gCache.params[name] = _path.normalize(value[name]);
            });
            return;
        }
        // for nejProcessor merge all values
        if (key==='nejProcessor'){
            _gCache[key] = _util.merge(
                _gCache[key],value
            );
            return;
        }
        // one config item
        _gCache[key] = value;
    }else{
        // config map
        Object.keys(key||{}).forEach(
            function(it){
                this.cacheConfig(it,key[it]);
            },this
        );
    }
};
/**
 * get nej config
 * @return {Object} nej config object
 */
exports.getConfig = function(key){
    if (!!key){
        return _gCache[key];
    }
    return _gCache;
};
/**
 * complete nej injector uri
 * @param  {String} uri    - nej uri string
 * @param  {Object} config - path parameter config, all root config should be absolute path
 * @param  {String} config.pathRoot - file path for uri relative to
 * @param  {String} config.webRoot  - web root path
 * @return {Object} uri information after complete,eg. {uri:'',patch:'',plugin:'',deps:[]}
 */
exports.parseURI = function(uri,config){
    // split version
    uri = (uri||'').split('?')[0]||'';
    config = _util.merge(
        this.getConfig(),config
    );
    // for json!/path/to/data.json
    var arr = uri.split('!'),
        ret = {
            uri:arr[0]||''
        };
    if (arr.length>1){
        ret.plugin = arr.shift().toLowerCase();
        ret.uri = arr.join('!');
    }
    // for {platform}hack.js
    if (ret.uri.indexOf('{platform}')===0){
        ret.uri = ret.uri.replace('{platform}','./platform/');
        ret.patch = ret.uri.replace(/(\.js)$/i,'.patch$1');
    }
    // complete patch uri
    if (!!ret.patch){
        ret.patch = this.parseURI(ret.patch,config).uri;
    }
    // for begin with ./ or ../ or /
    if (/^[./]/.test(ret.uri)){
        ret.uri = _path.absoluteAltRoot(
            ret.uri,config.pathRoot,config.webRoot
        );
        return ret;
    }
    var dict = config.params||{};
    // for {patch}hack.js
    if (ret.uri.indexOf('{patch}')===0){
        var arr = dict.patch;
        if (typeof arr==='string'){
            // for string patch
            ret.uri = _path.normalize(
                ret.uri.replace('{patch}',arr)
            );
        }else{
            // for list patch
            ret.deps = [];
            var name = ret.uri.replace('{patch}','');
            arr.forEach(function(root){
                ret.deps.push(_path.normalize(root+name));
            });
            ret.uri = _path.normalize(
                ret.uri.replace('{patch}',config.nejPatchRoot)
            );
        }
        return ret;
    }
    // for begin with {abc}a.js
    if (ret.uri.indexOf('{')===0){
        ret.uri = _path.normalize(
            ret.uri.replace(/\{(.*?)\}/gi,function($1,$2){
                return dict[$2]||$1;
            })
        );
        return ret;
    }
    // for lib/util/base or pro/a/b/c
    var brr = ret.uri.split('/'),
        root = dict[brr[0]],
        ext = (brr[brr.length-1]||'').indexOf('.')>=0?'':'.js';
    if (!!root){
        brr.shift();
    }else{
        root = config.nejRoot||'';
    }
    ret.uri = _path.normalize(
        root+brr.join('/')+ext
    );
    // try to fix file path
    if (!ext&&
        !_path.isURL(ret.uri)&&
        !_fs.exist(ret.uri)){
        var file = _path.normalize(
            root+brr.join('/')+'.js'
        );
        if (_fs.exist(file)){
            ret.uri = file;
        }
    }
    return ret;
};
/**
 * parse nej config from define.js
 * @param  {String} uri - absolute path of define.js
 * @param  {Object} config - config object
 * @param  {String} config.pathRoot - file path for uri relative to
 * @param  {String} config.webRoot  - web root path
 * @return {Object} result of nej config, eg. {deps:{},params:{},nejPlatform:'',nejRoot:''}
 */
exports.parseConfig = (function(){
    // dump dependency config
    var _doDumpDepConfig = function(content){
        var ret,
            handler = function(map){
                ret = map;
            },
            sandbox = {NEJ:{deps:handler, config:handler}};
        // detect dep config
        try{
            //eval(content);
            vm.createContext(sandbox);
            vm.runInContext(content,sandbox);
        }catch(ex){
            // ignore
        }
        return ret||null;
    };
    return function(uri,config){
        // 0 - http://a.b.com/nej/define.js
        // 1 - a=aaaa&b=bbbb&c=ccccc
        var ret = {},
            arr = (uri||'').split(/[?#]/),
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
            ret.deps = _doDumpDepConfig(
                _fs.read(file,config.charset).join('\n')
            );
            delete params.d;
        }
        if (!!params.p){
            ret.nejPlatform = params.p;
            delete params.p;
        }
        // absolute param path
        Object.keys(params).forEach(
            function(key){
                params[key] = _path.absoluteAltRoot(
                    params[key],config.pathRoot,config.webRoot
                );
            },this
        );
        // check lib root
        ret.nejRoot = _path.absoluteAltRoot(
            path.dirname(arr[0])+'/',
            config.pathRoot,config.webRoot
        );
        // check default pro parameter
        if (!params.pro){
            params.pro = _path.absolute(
                './src/javascript/',
                config.webRoot
            );
        }
        // compatible for nej 20140721
        return ret;
    };
})();
/**
 * parse function arguments and return
 * @param  {String} content - function string content
 * @return {Object} function information, eg. {args:[],riturn:''}
 */
exports.parseFunction = function(content){
    var ret = { args:[], riturn:'' };
    // check args list
    if (/^\s*function\s*\(([\w\W]*?)\)/.test(content)){
        var args = RegExp.$1.trim();
        if (!!args){
            ret.args = args.split(/\s*,\s*/);
        }
    }
    // check return name
    if (/(return\s*[\w;\s$]+)\s*}\s*$/.test(content)){
        var name = RegExp.$1.trim();
        if (!!name){
            ret.riturn = name;
        }
    }
    return ret;
};
/**
 * parse nej patch
 * @param  {String} content - patch source content
 * @param  {Object} config  - config object
 * @return {Object} patch information, eg. {args:[],riturn:'',patches:[]}
 */
exports.parsePatch = (function(){
    // parse nej patch
    var _doPatch = function(patform,deps,func){
        var args = exports.formatARG.apply(
            exports,arguments
        );
        if (!this.patches){
            this.patches = [];
        }
        // illegal patch
        if (!args[0]){
            return;
        }
        // cache patch config
        this.patches.push({
            expression:args[0],
            dependency:args[1],
            source:(args[2]||'').toString()
        });
    };
    // eval content to dump nej patch
    var _doDumpNEJPatch = function(content){
        // emulate NEJ patch env
        var ret = {},
            sandbox = {
                NEJ:{
                    patch:_doPatch.bind(ret)
                }
            };
        // eval content for nej patch check
        try{
            //eval(util.format('(%s)();',content));
            vm.createContext(sandbox);
            vm.runInContext(util.format('(%s)();',content),sandbox);
        }catch(ex){
            // ignore
        }
        return ret.patches;
    };
    return function(content){
        var patches = _doDumpNEJPatch.call(
            this,content
        );
        if (!!patches){
            var ret = this.parseFunction(content);
            ret.patches = patches;
            return ret;
        }
    };
})();
/**
 * parse nej file
 * @param  {String} content - file content
 * @return {Object} nej file information, eg. {}
 */
exports.parseFileContent = (function(){
    // do nej define
    var _doDefine = function(uri,deps,func){
        var args = exports.formatARG.apply(
            exports,arguments
        );
        this.isNEJ = !0;
        this.dependency = args[1];
        this.source = (args[2]||'').toString();
    };
    return function(content){
        // emulate NEJ define env
        // void over write result
        var ret = {},
            sandbox = {
                NEJ:{
                    define:_doDefine.bind(ret)
                },
                define:_doDefine.bind(ret)
            };
        // eval content for nej check
        try{
            //eval(content);
            vm.createContext(sandbox);
            vm.runInContext(content,sandbox);
        }catch(ex){
            // ignore
        }
        if (ret.isNEJ){
            return _util.fetch({
                source:'',
                dependency:null
            },ret);
        }
        return null;
    };
})();
/**
 * parse platform string
 * result properties
 * - engines        platform supported
 * - lower          platform lower version
 * @param  {String} platform - platform config
 * @return {Object} result of platform config
 */
exports.parsePlatform = (function(){
    var _pMap = {
        td:'trident',wk:'webkit',gk:'gecko',
        android:'webkit',ios:'webkit',cef:'webkit',win:'trident'
    };
    return function(platform){
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
})();
/**
 * parse nej patch version expression
 * result properties
 * - engine     patch supported engine expression
 * - version    patch supported version expression
 * - lower      lower version config, eg. {value:'3.0',eq:true}
 * - middle     middle version config, eg. {value:'5.0',eq:true}
 * - upper      upper version config, eg. {value:'6.0',eq:true}
 * @param  {String} expression - version expression
 * @return {Object} result of expression
 */
exports.parseExpression = (function(){
    var _vMap = {r:'release',v:'version'},
        _cMap = {t:'trident',w:'webkit',g:'gecko',p:'presto'},
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
                delete exp.op;
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
                delete exp.op;
            }
        ];
    return function(expression){
        var exp = (expression||'').replace(/\s/g,'').toLowerCase();
        if (!/(tr|wr|gr|pr|tv|wv|gv|pv)/i.test(exp)){
            console.log(expression);
            return null;
        }
        // parse expresion to platfrom
        var ret = {},
            eng = RegExp.$1.toLowerCase(),
            arr = eng.split('');
        ret.engine = _cMap[arr[0]]||'';
        // for TR or GR or WR
        if (eng===exp){
            return ret;
        }
        // for TR=3.0 or 2.0<=TR<=4.0
        ret.version = _vMap[arr[1]]||'release';
        // check version condition
        var ver = /([<>=]+)/;
        exp.split(eng).forEach(function(value,index){
            if (!ver.test(value)){
                return;
            }
            var op = RegExp.$1,
                vl = value.replace(op,'');
            _fMap[index](ret,{
                value:vl,op:op,
                eq:op.indexOf('=')>=0
            });
        });
        return !ret.dirty?ret:null;
    };
})();
/**
 * check expression fit to platform
 * @param  {Object}  exp - expression parse result
 * @param  {Object}  platform - platform parse result
 * @return {Boolean} is expression fit to platform
 */
exports.isExpFitPlatform = function(exp,platform){
    // check string exp and platform
    if (typeof exp==='string'){
        exp = this.parseExpression(exp);
    }
    if (!platform||(typeof platform==='string')){
        platform = this.parsePlatform(platform);
    }
    // check engine
    var engines = platform.engines,
        index = engines.indexOf(exp.engine);
    // engine not match
    if (index<0){
        return !1;
    }
    // check version
    var lower = platform.lower;
    if (lower==null){
        return !0;
    }
    // check upper
    var upper = exp.upper;
    if (!!upper){
        if (upper.value<lower||
            (upper.value==lower&&!upper.eq)){
            return !1;
        }
        return !0;
    }
    // check middle
    var midle = exp.midle;
    if (!!midle&&midle.value<lower){
        return !1;
    }
    return !0;
};
/**
 * stringify expression to condition
 * @param  {String} name - name of platform argument name
 * @param  {Object} exp - expression parse result
 * @return {String} condition expression
 */
exports.exp2condition = function(name,exp){
    if (typeof exp==='string'){
        exp = this.parseExpression(exp);
    }
    var ret = util.format(
            "%s._$KERNEL.engine==='%s'",
            name,exp.engine
        ),
        ver = util.format(
            '%s._$KERNEL.%s',
            name,exp.version||'release'
        ),
        arr = [];
    // check lower
    var lower = exp.lower;
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
    var midle = exp.midle;
    if (!!midle){
        arr.push(ver+"=='"+midle.value+"'");
    }
    // check upper
    var upper = exp.upper;
    if (!!upper){
        arr.push(
            util.format(
                "%s<%s'%s'",
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
/**
 * dependency list to injector arguments list
 * @param  {Array} list - dependency list
 * @return {Array} injector arguments list
 */
exports.deps2injector = function(list){
    var ret = [];
    (list||[]).forEach(function(item){
        var key = _path.uri2key(
            this.formatURI(item)
        );
        ret.push(key);
    },this);
    return ret;
};
/**
 * format arguments, order by string,array,function
 * @param  {String}   uri - uri path
 * @param  {Array}    dep - dependency list
 * @param  {Function} func - callback
 * @return {Array}    result after formatted
 */
exports.formatARG = (function(){
    var _fList = [
        function(arg){return typeof(arg)=='string';},
        util.isArray,
        _util.isFunction
    ];
    return function(){
        var args = [null,null,null];
        for(var i=0,l=arguments.length,it;i<l;i++){
            it = arguments[i];
            _fList.some(function(func,index,list){
                if (func(it)){
                    args[index] = it;
                    return !0;
                }
            });
        }
        return args;
    };
})();
/**
 * uri result to string
 * @param  {String|Object} uri - uri information
 * @return {String} uri flag
 */
exports.formatURI = function(uri){
    if (typeof uri==='string'){
        return uri;
    }
    if (uri.patch){
        return uri.patch;
    }
    var plugin = uri.plugin||'';
    return plugin+(!plugin?'':':')+uri.uri;
};
/**
 * cache nej dependency list config
 * @param  {Object} map - dependency config
 * @param  {Object} config - config object
 * @return {Array}  dependency list
 */
exports.cacheDependencies = function(map,config){
    if (!map){
        return;
    }
    var ret = [];
    // complete uri
    Object.keys(map).forEach(
        function(file){
            var arr = map[file],
                file = this.parseURI(file,config).uri;
            arr.forEach(function(uri,index,list){
                list[index] = this.parseURI(uri,config).uri;
            },this);
            ret.push(file,arr);
            _dep.set(file,arr);
        },this
    );
    return _util.concat.apply(_util,ret);
};
/**
 * format nej dependency list
 * @param  {Object} config - config object
 * @return {Object} dependency list map
 */
exports.formatDependencies = (function(){
    // format patch
    var _doFormatPatch = function(name,config){
        var patch = config.patch;
        if (!patch){
            return;
        }
        // cache patch content if not x.patch.js
        var content = _io.getFromCache(patch);
        if (!content){
            var ret = [
                _path.uri2key(patch),
                'function(x){return x;}',
                _path.uri2key(config.uri)
            ];
            _io.cache(config.patch,util.format(
                '%s(%s);',name,ret.join(',')
            ));
        }
        // cache dependency list for x.patch.js
        if (!_dep.get(patch)){
            _dep.set(patch,[config.uri]);
        }
    };
    // format plugin
    var _doFormatPlugin = function(name,config,plugins){
        var plugin = config.plugin;
        if (!plugin){
            return;
        }
        // check plugin content
        var key = plugin+':'+config.uri;
        if (_io.getFromCache(key)!=null){
            return;
        }
        // update plugin content
        var content = _io.getFromCache(config.uri)||'';
        var func = plugins[plugin];
        if (!!func){
            if (typeof func=='string'){
                func = plugins[func];
            }
            if (_util.isFunction(func)){
                var ret = func({
                    file:config.uri,
                    content:content
                });
                if (ret!=null){
                    content = ret;
                }
            }
        }
        // cache content after process
        _io.cache(key,util.format(
            '%s(%s,%s);',name,
            _path.uri2key(key),content
        ));
    };
    return function(config){
        config = config||{};
        var map = _dep.dump();
        // check injectable
        //if (!_dep.injectable()){
        //    var root = this.getConfig('nejRoot')||config.nejRoot,
        //        global = _path.absolute('./base/global.js',root);
        //    _dep.set(global,[]);
        //}
        // format dependency patch and plugin
        var name = this.getConfig('nejInjector')||config.nejInjector,
            plugins = _util.merge(
                this.getConfig('nejProcessor'),
                config.nejProcessor
            );
        Object.keys(map).forEach(function(uri){
            var list = map[uri];
            list.forEach(function(uri,index,deps){
                if (typeof uri==='string'){
                    return;
                }
                // format nej uri object, eg. {uri:'',patch:'',plugin:''}
                _doFormatPatch.call(this,name,uri);
                // process plugin
                _doFormatPlugin.call(this,name,uri,plugins);
                // update dependency list
                deps[index] = this.formatURI(uri);
            },this);
        },this);
        return map;
    };
})();
/**
 * support before nej 20140721 version compatible
 * @return {Void}
 */
exports.supportNEJCompatible = (function(){
    var os = /(cef|ios|win|android)/,
        bw = {
            gk:'gecko',wk:'webkit',pt:'presto',
            td:['trident-1','trident','trident-0'], // for ie6+
           'td-0':['trident-1','trident'],          // for ie7+
           'td-1':'trident-1'                        // for ie10+
        };
    return function(){
        var params = this.getConfig('params'),
            libRoot = this.getConfig('nejRoot'),
            patRoot = this.getConfig('nejPatchRoot'),
            platform = this.getConfig('nejPlatform')||'td|wk|gk';
        // for mobile os
        if (os.test(platform)){
            var name = RegExp.$1;
            params.native = libRoot+'native/'+name+'/';
            params.patch = patRoot+(name==='win'?'trident-1':'webkit')+'/';
            return;
        }
        // for browser
        var ret = [];
        platform.split('|').forEach(function(name){
            ret.push(bw[name]);
        });
        ret = _util.concat.apply(_util,ret);
        ret.forEach(function(name,index,list){
            list[index] = patRoot+name+'/';
        });
        params.patch = ret;
    };
})();
/**
 * check whether nej define.js
 * @param  {String} uri - script uri
 * @return {Boolean} whether nej define.js
 */
exports.isNEJDefine = (function(){
    var reg = /\bdefine\.js\b/i;
    return function(uri){
        return reg.test(uri||'');
    };
})();
/**
 * check whether nej script code
 * @param  {String} code - script code
 * @return {Boolean} whether nej script code
 */
exports.isNEJScript = (function(){
    var reg = /(NEJ\.)?define\s*\(/;
    return function(code){
        return reg.test(code||'');
    };
})();

