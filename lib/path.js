var fs   = require('fs'),
    path = require('path');
/*
 * 判断路径是否为相对路径
 * @param  {String} _path 路径
 * @return {Boolean}      是否相对路径
 */
var __isRelative = (function(){
    var _reg = /^\.?\.[\/\\]/;
    return function(_path){
        return _reg.test(_path);
    };
})();
/**
 * 判断是否远程地址文件
 * @param  {String} _file 文件地址
 * @return {Void}
 */
var __isRemoteAddress = (function(){
    var _reg = /^\s*(https?:\/)\//i;
    return function(_file){
        return _reg.test(_file);
    };
})();
/**
 * 判断路径是否存在
 * @param  {String} _path 路径
 * @return {Boolean}      是否存在
 */
var __isPathExist = function(_path){
	_path = (_path||'').split(/[?#]/)[0];
	return (fs.existsSync||path.existsSync)(_path);
};
/**
 * 格式化反斜杠
 * @param  {String} _content 待格式化内容
 * @return {String}          格式化后内容
 */
var __doFormatSlash = (function(){
    var reg0 = /\\/g,
	    reg1 = /([^:])\/+/g;
    return function(_string){
		// fix http://a.b.com//a//c -> http://a.b.com/a/c
		// or  /a/b//c              -> /a/b/c
        return (_string||'').replace(reg0,'/').replace(reg1,'$1/');
    };
})();
/**
 * 格式化地址
 * @param  {String} _path 待格式化地址
 * @return {String}       格式化后地址
 */
var __doNormalizePath = function(_path){
    var _prefix = '';
    if (__isRemoteAddress(_path)){
        _prefix = RegExp.$1;
        _path = _path.replace(_prefix+'/','/');
    }
    return _prefix+path.normalize(_path);
};
/**
 * 格式化URL为绝对路径
 * @param  {String} _path 路径
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doFormatURL2Absolute = function(_url,_root){
    // /a/b/c is relative
    if (__isRelative(_url)||
        _url.indexOf(':')<0)
        _url = (_root||'')+_url;
    return __doFormatSlash(__doNormalizePath(_url));
};
/**
 * 格式化路径为绝对路径
 * @param  {String} _path 路径
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doFormatPath2Absolute = (function(){
    var _reg = /\r$/;
    return function(_path,_root){
        // fix end path's \r on mac
        _path = _path.replace(_reg,'');
        // /a/b/c is absolute
        if (__isRelative(_path))
            _path = (_root||'')+_path;
        return __doFormatSlash(__doNormalizePath(_path));
    };
})();
// export api
exports.url       = __doFormatURL2Absolute;
exports.path      = __doFormatPath2Absolute;
exports.slash     = __doFormatSlash;
exports.exist     = __isPathExist;
exports.remote    = __isRemoteAddress;
exports.normalize = __doNormalizePath;