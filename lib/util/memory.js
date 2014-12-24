var _gMCache = {};
/**
 * 设置缓存
 * @param  {String}   key   键
 * @param  {Variable} value 值
 * @return {Void}
 */
exports.set = function(key,value){
    _gMCache[key] = value;
};
/**
 * 获取缓存信息
 * @param  {String} key 键
 * @return {Variable}   值
 */
exports.get = function(key){
    return _gMCache[key];
};

var _gFCache = {};
/**
 * 缓存文件内容 
 * @param  {String} file    文件路径
 * @param  {String} content 文件内容
 * @return {Void}
 */
exports.setFileContent = function(file,content){
    _gFCache[file] = content;
};
/**
 * 取文件内容
 * @param  {String} file 文件路径
 * @return {String}      文件内容
 */
exports.getFileContent = function(file){
    return _gFCache[file];
};

var _gKCache = [];
/**
 * 取文件标识
 * @param  {String} file 文件名
 * @return {Number}      文件标识
 */
exports.getFileKey = (function(){
    var seed = 1;
    return function(file){
        var key = _gKCache[file];
        if (!key){
            key = seed++;
            _gKCache[file] = key;
        }
        return key;
    };
})();

