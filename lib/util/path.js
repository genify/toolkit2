/*
 * path utility api
 * @module   util/path
 * @author   genify(caijf@corp.netease.com)
 */
var ph  = require('path'),
    reg = /^(https|http|ftp):\//i;
/**
 * format path
 * @param  {String} path - original file path
 * @return {String} file path after formatted
 */
exports.normalize = function(path){
    path = ph.normalize(path||'').replace(/[\\/]+/g,'/');
    // fix http:/a.b.com -> http://a.b.com
    return path.replace(reg,'$1://');
};
/**
 * absolute url path
 * @param  {String} url  - original url
 * @param  {String} root - root relative to
 * @return {String} absolute path
 */
exports.absoluteURL = function(url,root){
    if (this.isURL(url)){
        return this.normalize(url);
    }
    url = url||'';
    root = root||'';
    // http://a.b.com:4040/a/b/
    var arr = root.split('/'),
        // http://a.b.com:4040
        host = arr.slice(0,3).join('/'),
        // /a/b/
        path = '/'+arr.slice(3,arr.length).join('/');
    // /c/d or c/d is relative
    if (url.indexOf('/')!=0&&
        url.indexOf(':')<0){
        url = path+url;
    }
    return host+this.normalize(url);
};
/**
 * absolute file path
 * @param  {String} url  - original url
 * @param  {String} root - root relative to
 * @return {String} absolute path
 */
exports.absolutePath = function(path,root){
    // fix end path's \r on mac
    path = (path||'').replace(/\r$/,'');
    // a/b -> ./a/b
    // c:/a/b -> c:/a/b
    if (path.search(/[./]/)!=0&&
        path.indexOf(':')<0){
        path = './'+path;
    }
    // /a/b is absolute
    // startwith ./ or ../
    if (path.indexOf('.')==0){
        path = (root||'')+path;
    }
    return this.normalize(path);
};
/**
 * absolute path with path root or web root
 * @param  {String} url      - original path
 * @param  {String} pathRoot - current path root
 * @param  {String} webRoot  - web root
 * @return {String} absolute path
 */
exports.absoluteAltRoot = function(url,pathRoot,webRoot){
    if (url.indexOf('/')==0){
        return this.absolute('./'+url,webRoot);
    }
    return this.absolute(url,pathRoot);
};
/**
 * auto absolute path
 * @param  {String} url  - original url
 * @param  {String} root - root relative to
 * @return {String} absolute path
 */
exports.absolute = function(file,root){
    file = file||'';
    if (this.isURL(file)||this.isURL(root)){
        return this.absoluteURL(file,root);
    }
    return this.absolutePath(file,root);
};
/**
 * check if url path
 * @param  {String}  url - original path
 * @return {Boolean} whether url path
 */
exports.isURL = function(url){
    return reg.test(url);
};
/**
 * wrap uri with flag
 * @param  {String} uri - uri
 * @return {String} uri after wrap
 */
exports.wrapURI = function(uri){
    return util.format('#<%s>#',uri||'');
};
/**
 * unwrap uri flag
 * @param  {String}   content  - content with uri wrap
 * @param  {Function} callback - url handler
 * @return {String}   content after unwrap uri
 */
exports.unwrapURI = function(content,callback){
    return content.replace(/#<(.+?)>#/gi,function($1,$2){
        return callback($2)||$1;
    });
};

