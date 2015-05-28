var util     = require('util'),
    css      = require('css'),
    path     = require('path'),
   _fs       = require('../util/file.js'),
   _util     = require('../util/util.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../util/event.js');
// token parser
// file         file path
// content      file content
var CSSParser = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    // private variable
    var _gAST,_gRes;
    // dump static resource
    var _rMap = {
        // background with url(/path/to/image.png)
        background:function(rule){
            if (/url\(['"]?(.*?)['"]?\)/i.test(rule.value)){
                return RegExp.$1;
            }
        }
    };
    var _doDumpStaticRes = function(rules){
        var list = Object.keys(rules||{});
        if (!list||!list.length){
            return;
        }
        // check static resource
        list.forEach(function(key){
            var rule = rules[key];
            if (key!=='declaration'){
                _doDumpStaticRes(rule);
                return;
            }
            // check resource in css rule
            var func = _rMap[rule.property];
            if (!!func){
                var ret = func(rule);
                if (!!ret){
                    _gRes[ret] = rule;
                }
            }
        });
    };
    // update content
    this.parse = function(config){
        // init options
        this.file = config.file;
        // parse css source
        _gAST = css.parse(
            config.content,{
                silent:!0,
                source:this.file
            }
        );
        // dump static resource
        _gRes = {};
        _doDumpStaticRes(_gAST);
    };
    // merge static resource
    // webRoot        web root path
    // resRoot        static resource root
    // domain         domain config
    // version        version config
    this.stringify = function(config){
        var pathRoot = path.dirname(this.file)+'/';
        Object.keys(_gRes).forEach(function(key){
            var arr = key.split('?'),
                file = _path.absoluteAltRoot(
                    arr[0],pathRoot,config.webRoot
                );
            // only update resource root for files in resource root
            if (!_fs.exist(file)||
                 _fs.isdir(file)||
                file.indexOf(config.resRoot)<0){
                return;
            }
            // check version
            if (!!config.version&&!arr[1]){
                arr[1] = _util.version(
                    _fs.raw(file)
                );
            }
            // check file path
            if (!config.domain){
                // use relative path
                arr[0] = _path.normalize(
                    path.relative(
                        pathRoot,file
                    )
                );
            }else{
                // use absolute path
                var domain = config.domain;
                if (util.isArray(domain)){
                    domain = domain[_util.rand(
                        0,domain.length
                    )];
                }
                arr[0] = file.replace(
                    config.webRoot,domain
                );
            }
            // update rule
            var rule = _gRes[key];
            rule.value = rule.value.replace(
                key,arr.join('?')
            );
        });
        return css.stringify(_gAST,{
            indent:0,
            compress:!0,
            sourcemap:!1,
            inputSourcemaps:!1
        });
    };
    // update content
    if (!!config){
        this.parse(config);
    }
};
util.inherits(CSSParser,_Abstract);