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
 * NEJ信息分析
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
        this.patches.push({
            plat:args[0],
            deps:args[1],
            code:(args[2]||'').toString()
        });
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
    // filter patch list
    var _doFilterPatch = function(patches,config){
        var ret = {
            all:[],
            patches:[]
        };
        patches.forEach(function(item){
            
        });
    };
    // parse nej patch file
    var _doParseNEJPatchFile = function(){
        // [{deps:[],code:''},...]
        var result = _doFilterPatch(
            patches,config
        );
        list = result.all;
        this.patchList = result.patches;
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
        if (!!patches){
            // for nej patch file
            _doParseNEJPatchFile.call(
                this,patches,config
            );
        }else{
            // for common nej file
            
        }
        // update source code
        this.source = util.format(
            'I$(%s,%s,%s);',
            _fs.getFileKey(this.filepath),source,
            _doSerializeInjector(this.injectorList)
        );
        // cache and load dependency list
        _gDepCache[this.filepath] = this.dependencyList;
        this.dependencyList.forEach(function(uri){
            _network.get(uri,function(event){
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
    // update nej content
    if (!!config){
        this.update(config);
    }
};
util.inherits(NEJParser,_Abstract);

// exports
exports.Parser = NEJParser;
exports.parseURI = _parseDefineURI;
exports.parseFile = _parseDefineFile;
