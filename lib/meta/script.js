var util     = require('util'),
    path     = require('path'),
   _io       = require('../util/io.js'),
   _fs       = require('../util/file.js'),
   _util     = require('../util/util.js'),
   _nej      = require('../parser/nej.js'),
   _const    = require('../config/constant.js'),
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
        this.nej = _nej.parseFile(content);
        // not nej file
        if (!this.nej){
            return content;
        }
        // parse nej file
        this.nej.parse(
            _util.merge(config,{
                file:file
            })
        );
        return this.nej.source;
    };
    
    // init setting
    this.inPage = !!this.__url&&this.url!==_const.NEJ_DEFINE_URL;
};
util.inherits(ResScript,_Resource);