var f = function(){
    var _  = NEJ.P,
        _t = _('nej.ut'),
        _p = _('wd.d'),
        _proCache;
    /**
     * 项目缓存基类
     *  
     */
    _p._$$Cache = NEJ.C();
      _proCache = _p._$$Cache._$extend(_t._$$AbstractListCache);
    /**
     * 
     * @param {Object} _callback
     * @param {Object} _json
     */
    _proCache.__cbListLoad = function(_key,_callback,_json){
        var _list = null;
        if (_json.code==1){
            var _result = _json.result;
            if (_result.total>_result.list.length)
                this._$setTotal(_key,_result.total);
            _list = _result.list;
        }
        _callback(_list);
    };
};
define('{pro}cache/cache.js',
      ['{lib}util/ajax/xdr.js'
      ,'{lib}util/cache/cache.list.base.js'],f);
