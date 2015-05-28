// private variable
var _gCache = {};
/**
 * 设置文件的依赖列表
 * @param  {String} file 文件路径
 * @param  {Array}  deps 依赖列表
 * @return {Void}
 */
exports.set = function(file,deps){
    _gCache[file] = deps;
};
/**
 * 获取文件的依赖列表
 * @param  {String} file 文件路径
 * @return {Array}       依赖列表
 */
exports.get = function(file){
    return _gCache[file];
};
/**
 * 补全文件依赖列表
 * @param  {Array} list 文件列表
 * @return {Array}      补全依赖关系后的列表
 */
exports.complete = (function(){
    var _doComplete = function(ret,list){
        if (!list||!list.length){
            return;
        }
        list.forEach(function(uri){
            _doComplete(ret,this.get(uri));
            if (ret.indexOf(uri)<0){
                ret.push(uri);
            }
        },this);
    };
    return function(list){
        var ret = [];
        _doComplete.call(
            this,ret,list
        );
        return ret;
    };
})();
