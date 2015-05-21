var util     = require('util'),
    path     = require('path'),
   _nej      = require('../script/nej.js'),
   _util     = require('../util/util.js'),
   _Resource = require('./resource.js');
// script in html file
var ResScript = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    
    // nej define path
    var _gDefine = _path.absolute(
        '../define.js',
        path.dirname(__filename)+'/'
    );
    // adjust charset
    this._adjustCharset = function(config){
        // force use utf8 for injector and nej file
        if (this.url===_gDefine||
            this.url.indexOf(config.nejRoot)===0){
            return 'utf-8';
        }
        return config.charset;
    };
    // parse script file
    this._parseContent = function(file,content,config){
        // check nej file
        var ret = _nej.parseFile(content);
        // not nej file
        if (!ret){
            return content;
        }
        // parse nej file
        ret.parse(
            _util.merge(config,{
                file:file
            })
        );
        return ret;
    };
};
util.inherits(ResScript,_Resource);