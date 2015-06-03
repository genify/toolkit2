// private variable
var _gCache = {};
/**
 * set dependency for file
 * @param  {String} file - absolute file path
 * @param  {Array}  deps - dependency file path list
 * @return {Void}
 */
exports.set = function(file,deps){
    _gCache[file] = deps;
};
/**
 * get dependency list by file path
 * @param  {String} file - absolute file path
 * @return {Array}  return dependency list of file
 */
exports.get = function(file){
    return _gCache[file];
};
/**
 * complete dependency list
 * @param  {Array} list - file path list
 * @return {Array} file path list after complete
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
