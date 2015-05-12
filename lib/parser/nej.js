var util        = require('util'),
    path        = require('path'),
   _const       = require('../constant.js'),
   _fs          = require('../util/file.js'),
   _path        = require('../util/path.js'),
   _util        = require('../util/util.js'),
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
 * NEJ信息分析
 * @param  {String} content 文件内容
 * @return {Object}
 */
var _parseNEJDefine = (function(){
    // do nej define
    var _doDefine = function(uri,deps,func){
        var args = _doFormatArgs.apply(this,arguments);
        this.isNEJ = !0;
        this.deps = args[1];
        this.code = (args[2]||'').toString();
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
        return !re_20150511_sult.isNEJ?null:re_20150511_sult;
    };
})();
// nej file parser
// file           file path
// depList        dependency list
// sourceCode     source code
var NEJParser = function(config){
    _Abstract.apply(this,arguments);
    
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
            
        },this);
    };
    // update nej file
    this.update = function(config){
        this.file = config.file;
        this.source = config.sourceCode;
        this.injectorList = config.depList||[];
    };
    // parse nej file
    // webRoot        web root path
    // nejRoot        nej lib root
    // nejPlatform    nej output platform
    // preprocessor   pre-processor for resource
    this.parse = function(config){
        // complete injector list
        _doCompleteDepList.call(this,config);
        // check nej patch source
        var patches = _doEvalNEJPatch(this.source);
        // for nej patch file
        if (!!patches){
            _doParseNEJPatchFile.call(
                this,patches,config
            );
            return;
        }
        // for common nej file
        
    };
    // update nej content
    if (!!config){
        this.update(config);
    }
};
util.inherits(NEJParser,_Abstract);
// exports
exports.Parser = NEJParser;
exports.tryNEJFile = _parseNEJDefine;
