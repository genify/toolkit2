var ph  = require('path');
/**
 * 格式化路径
 * @param  {String} path 路径
 * @return {String}      格式化后路径
 */
exports.normalize = function(path){
    path = ph.normalize(path||'').replace(/[\\/]+/g,'/');
    // fix http:/a.b.com -> http://a.b.com
    return path.replace(/^(https|http|ftp):\//i,'$1://');
};
/**
 * 取URL绝对地址
 * @param  {String} url  相对地址
 * @param  {String} root 根路径
 * @return {String}      绝对地址
 */
exports.absoluteURL = function(url,root){
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
 * 取路径绝对地址
 * @param  {String} path 相对地址
 * @param  {String} root 根路径
 * @return {String}      绝对地址
 */
exports.absolutePath = function(path,root){
    // fix end path's \r on mac
    path = (path||'').replace(/\r$/,'');
    // /a/b is absolute
    // startwith ./ or ../
    if (path.indexOf('.')==0){
        path = (root||'')+path;
    }
    return this.normalize(path);
};
/**
 * 是否URL地址
 * @param  {String} url 地址
 * @return {Boolean}    是否URL地址
 */
exports.isURL = function(url){
    return url.search(/(https|http|ftp):/i)==0;
};

