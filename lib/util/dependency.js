/*
 * dependency management api
 * @module   util/dependency
 * @author   genify(caijf@corp.netease.com)
 */
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
 * dump dependency cache
 * @returns {Object} dependency cache
 */
exports.dump = function(){
    return _gCache;
};
/**
 * complete dependency list
 * @param  {Array} list - file path list
 * @return {Array} file path list after complete
 */
exports.complete = (function(){
    var _doComplete = function(ret,list,lock){
        if (!list||!list.length){
            return;
        }
        list.forEach(function(uri){
            // lock for circular reference
            if (!!lock[uri]){
                return;
            }
            lock[uri] = !0;
            // complete dependency list
            _doComplete.call(
                this,ret,this.get(uri),lock
            );
            // push current uri
            if (ret.indexOf(uri)<0){
                ret.push(uri);
            }
        },this);
    };
    return function(list){
        var ret = [];
        if (!list||!list.length){
            return ret;
        }
        _doComplete.call(
            this,ret,list,{}
        );
        return ret;
    };
})();
/**
 * set or get nej injectable
 * @param  {Boolean} injectable - nej injectable
 * @return {Boolean} nej injectable
 */
exports.injectable = (function(){
    var injected = !1;
    return function(injectable){
        if (injectable==null){
            return injected;
        }
        injected = !!injectable;
    };
})();