/**
 * 判断是否空白内容
 * @param  {String} _content 内容
 * @return {Boolean}         是否空白内容
 */
var __isBlank = (function(){
    var _reg = /^\s*$/;
    return function(_content){
        return _reg.test(_content);
    };
})();
/**
 * 判断是否注释
 * @param  {String} _content 内容
 * @return {Boolean}         是否注释行
 */
var __isComment = (function(){
    var _reg = /^\s*#/;
    return function(_content){
        return _reg.test(_content);
    };
})();
/**
 * 判断是否SVN文件
 * @param  {String} _path 文件路径
 * @return {Boolean}      是否SVN文件
 */
var __isSVNFile = (function(){
    var _reg = /^\./;
    return function(_path){
        return _reg.test(_path);
    };
})();
/**
 * 判断是否函数
 * @param  {Variable} _func 判断参数
 * @return {Boolean}        是否函数
 */
var __isFunction = function(_func){
    return Object.prototype.toString.call(_func)==='[object Function]';
};
/**
 * 执行脚本
 * @param  {String} _code 脚本
 * @return {Variable}     结果
 */
var __doEvalScript = function(_code){
    try{
        return !_code?null:eval(_code);
    }catch(e){
        return null;
    }
};
/**
 * 计算MD5值
 * @param  {String} _content 内容
 * @return {String}          MD5值
 */
var __doCalculateMD5 = function(_content){
    return require('crypto')
          .createHash('md5')
          .update(_content)
          .digest('hex');
};
// export api
exports.svn     = __isSVNFile;
exports.func    = __isFunction;
exports.blank   = __isBlank;
exports.comment = __isComment;
exports.eval    = __doEvalScript;
exports.md5     = __doCalculateMD5;
