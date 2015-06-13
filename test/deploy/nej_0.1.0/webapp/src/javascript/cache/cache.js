/*
 * ------------------------------------------
 * 项目缓存基类
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'util/cache/abstract'
],function(_k,_d,_p,_pro){
    /**
     * 项目缓存基类
     */
    _p._$$Cache = _k._$klass();
    _pro = _p._$$Cache._$extend(_d._$$CacheListAbstract);
    /**
     * 服务器数据返回回调
     * @param {Object} _callback
     * @param {Object} _json
     */
    _pro.__cbListLoad = function(_key,_callback,_json){
        var _list = null;
        if (_json.code==1){
            var _result = _json.result;
            if (_result.total>_result.list.length)
                this._$setTotal(_key,_result.total);
            _list = _result.list;
        }
        _callback(_list);
    };
});
