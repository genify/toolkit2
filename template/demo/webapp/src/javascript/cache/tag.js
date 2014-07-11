var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('wd.d'),
        _proCacheTag;
    /**
     * 活动缓存对象
     * 
     * 
     * 
     */
    _p._$$CacheTag = NEJ.C();
      _proCacheTag = _p._$$CacheTag._$extend(_p._$$Cache);
    /**
     * 
     */
    _proCacheTag.__doLoadList = function(_options){
        var _key = _options.key,
            _callback = _options.onload;
        
        // for test
        if (DEBUG){
            var _list = window['tag-list'],
                _limit = _options.limit,
                _offset = _options.offset;
            var _json = {
                code:1,
                result:{
                    total:_list.length,
                    list:_list.slice(_offset,_offset+_limit)
                }
            };
            window.setTimeout(
                this.__cbListLoad._$bind(
                    this,_key,_callback,_json),1000
            );
            return;
        }
        // end for test
        
        _j._$request('/api/tag/list',{
            method:'POST',
            type:'json',
            data:_u._$object2query(_options.data),
            onload:this.__cbListLoad._$bind(this,_key,_callback),
            onerror:this.__cbListLoad._$bind(this,_key,_callback,_o)
        });
    };
};
define('{pro}cache/tag.js',
      ['{pro}cache/cache.js'],f);
