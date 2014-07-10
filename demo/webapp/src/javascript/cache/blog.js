var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('wd.d'),
        _proCacheBlog;
    /**
     * 活动缓存对象
     * 
     * 
     * 
     */
    _p._$$CacheBlog = NEJ.C();
      _proCacheBlog = _p._$$CacheBlog._$extend(_p._$$Cache);
    /**
     * 
     */
    _proCacheBlog.__doLoadList = function(_options){
        var _key = _options.key,
            _callback = _options.onload;
        
        // for test
        if (DEBUG){
            var _list = window['blog-list']
                              [(parseInt(_key.split('-')[1])||0)%10],
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
        
        _j._$request('/api/blog/list',{
            method:'POST',
            type:'json',
            data:_u._$object2query(_options.data),
            onload:this.__cbListLoad._$bind(this,_key,_callback),
            onerror:this.__cbListLoad._$bind(this,_key,_callback,_o)
        });
    };
    /**
     * 
     */
    _proCacheBlog._$getClassListInCache = function(){
        // for test
        var _arr = [],
            _nmb = 0,
            _seed = +new Date;
        for(var i=0;i<10;i++){
            _seed++;
            _arr.push({id:_seed,name:'class-'+_seed,count:_nmb++});
        }
        return _arr;
    };
    /**
     * 
     */
    _proCacheBlog._$getTagListInCache = function(){
        // for test
        var _arr = [],
            _nmb = 0,
            _seed = +new Date;
        for(var i=0;i<20;i++){
            _seed++;
            _arr.push({id:_seed,name:'tag-'+_seed,count:_nmb++});
        }
        return _arr;
    };
};
define('{pro}cache/blog.js',
      ['{pro}cache/cache.js'],f);
