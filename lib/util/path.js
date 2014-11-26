var ph  = require('path'),
    reg = /^(https|http|ftp):\//i;

/**
 * 格式化路径
 * @param  {String} path 路径
 * @return {String}      格式化后路径
 */
exports.normalize = function(path){
    path = ph.normalize(path||'').replace(/[\\/]+/g,'/');
    // fix http:/a.b.com -> http://a.b.com
    return path.replace(reg,'$1://');
};
/**
 * 取URL绝对地址
 * @param  {String} url  相对地址
 * @param  {String} root 根路径
 * @return {String}      绝对地址
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
 * 取路径绝对地址
 * @param  {String} path 相对地址
 * @param  {String} root 根路径
 * @return {String}      绝对地址
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
 * 智能处理绝对路径
 * @param  {String} file 相对地址
 * @param  {String} root 根路径
 * @return {String}      绝对地址
 */
exports.absolute = function(file,root){
    file = file||'';
    if (this.isURL(file)||this.isURL(root)){
        return this.absoluteURL(file,root);
    }
    return this.absolutePath(file,root);
};
/**
 * 是否URL地址
 * @param  {String} url 地址
 * @return {Boolean}    是否URL地址
 */
exports.isURL = function(url){
    return reg.test(url);
};

