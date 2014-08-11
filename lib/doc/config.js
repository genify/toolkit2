var __config = {},
    _fs      = require('../file.js'),
    _log     = require('../logger.js'),
    _util    = require('../util.js'),
    _path    = require('../path.js'),
     path    = require('path'),
     util    = require('util');
/*
 * 设置配置信息
 * @param  {String} _key   配置标识
 * @param  {String} _value 配置内容
 * @return {Void}
 */
var __setConfig = function(_key,_value){
    __config[_key.trim().toUpperCase()] =
            !_value.trim?_value:_value.trim();
};
/**
 * 取配置信息
 * @param  {String} _key   配置标识
 * @return {String} _value 配置内容
 */
var __getConfig = function(_key){
    var _value = __config[_key.
                 trim().toUpperCase()];
    return _value==null?'':_value;
};
/*
 * 检查输入路径
 * @param  {String} _key  配置标识
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doCheckInputPathConfig = function(_key,_root){
    var _value = __getConfig(_key);
    if (!!_value){
        _value = _path.path(_value+'/',_root);
        if (!_path.exist(_value)){
            _log.error('%s[%s] not exist!',_key,_value);
            _value = '';
        }
    }
    __setConfig(_key,_value);
    return _value;
};
/*
 * 检查输出路径
 * @param  {String} _key  配置标识
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doCheckOutputPathConfig = function(_key,_root){
    var _value = __getConfig(_key);
    if (!!_value){
        _value = _path.path(_value+'/',_root);
        _fs.mkdir(_value);
    }
    __setConfig(_key,_value);
    return _value;
};
/*
 * 检查字符型配置
 * @param  {String} _key     配置标识
 * @param  {String} _default 默认值
 * @return {Void}
 */
var __doCheckValueWithDefault = function(_key,_default){
    __setConfig(_key,__getConfig(_key)||_default);
    return __getConfig(_key)||_default;
};
/*
 * 检查数值型配置
 * @param  {String} _key     配置标识
 * @param  {Number} _default 默认值
 * @return {Void}
 */
var __doCheckNumberWithDefault = function(_key,_default){
    _value = parseInt(__getConfig(_key));
    __setConfig(_key,isNaN(_value)?_default:_value);
};
/*
 * 检查路径相关配置
 * @return {Void}
 */
var __doCheckConfig_DIR = function(){
    // DIR_INPUT
    // DIR_OUTPUT
    // DIR_OUTPUT_API
    // DIR_OUTPUT_CLS
    // DIR_OUTPUT_SRC
    // DIR_TEMPLATE
    // DIR_SRC_ROOT
    var _root = __getConfig('DIR_CONFIG');
    __doCheckInputPathConfig('DIR_INPUT',_root);
    __doCheckValueWithDefault('DIR_OUTPUT',_root+'doc/');
    __doCheckOutputPathConfig('DIR_OUTPUT',_root);
    var _output = __getConfig('DIR_OUTPUT');
    __setConfig('DIR_OUTPUT_API',_output+'api/');
    __doCheckOutputPathConfig('DIR_OUTPUT_API');
    __setConfig('DIR_OUTPUT_SRC',_output+'code/');
    __doCheckOutputPathConfig('DIR_OUTPUT_SRC');
    __setConfig('DIR_OUTPUT_CLS',_output+'class/');
    __doCheckOutputPathConfig('DIR_OUTPUT_CLS');
    __setConfig('DIR_OUTPUT_RES',_output+'res/');
    __doCheckOutputPathConfig('DIR_OUTPUT_RES');
    __doCheckValueWithDefault('DIR_TEMPLATE',__dirname+'/../template/');
    __doCheckInputPathConfig('DIR_TEMPLATE',_root);
    __doCheckValueWithDefault('DIR_SRC_ROOT','../code/');
};
/*
 * 检查输出文件配置
 * @return {Void}
 */
var __doCheckConfig_FILE = function(){
    // FILE_EXTENSION
    // FILE_EXTENSION_REG
    // FILE_CHARSET
    __doCheckValueWithDefault('FILE_EXTENSION','js');
    __setConfig('FILE_EXTENSION_REG',
        new RegExp(util.format('\\.(?:%s)$',
          __getConfig('FILE_EXTENSION')),'i'));
    var _charset = __getConfig('FILE_CHARSET')||'utf-8';
    __setConfig('FILE_CHARSET',_charset.toLowerCase());
    
};
/*
 * 检查代码配置
 * @return {Void} 
 */
var __doCheckConfig_CODE = (function(){
    var _reg0 = /\/\*[\w\W]*?\*\//gi,
        _cmap = ['shCoreDefault','shCoreDjango'
                ,'shCoreEclipse','shCoreEmacs'
                ,'shCoreFadeToGrey','shCoreMDUltra'
                ,'shCoreMidnight','shCoreRDark','shCoreCustom'],
        _ftpl = __dirname+'/3rd/syntaxhighlighter/styles/%s.css';
    return function(){
        // CODE_THEME
        var _theme = __getConfig('CODE_THEME'),
            _file = _cmap[parseInt(_theme)];
        if (!_path.exist(_file)){
            _file = util.format(_ftpl,_file);
            if (!_path.exist(_file))
                _file = util.format(_ftpl,_cmap[2]);
        }
        var _content = _fs.read(_file,__getConfig('FILE_CHARSET')).join(' ');
        __setConfig('CODE_THEME',_content.replace(_reg0,''));
    };
})();
/**
 * 解析配置文件
 * @param  {String} _file 配置文件地址
 * @return {Void}
 */
var __doParseConfig = function(_file){
    _file = _path.path(_file);
    _log.info('parse %s',_file);
    try{
        var _list = _fs.read(_file);
        if (!!_list&&_list.length>0){
            for(var i=0,l=_list.length,_line;i<l;i++){
                _line = _list[i];
                if (_util.blank(_line)||
                    _util.comment(_line))
                    continue;
                _line = _line.split('=');
                __setConfig(_line.shift().trim()
                          ,_line.join('=').trim());
            }
        }
        __setConfig('DIR_CONFIG',
                     path.dirname(_file)+'/');
        __doCheckConfig_DIR();
        __doCheckConfig_FILE();
        __doCheckConfig_CODE();
        _log.info('config -> %j',__config);
    }catch(e){
        _log.error('can\'t parse config for %s',e);
    }
};
// export api
exports.get   = __getConfig;
exports.parse = __doParseConfig;
