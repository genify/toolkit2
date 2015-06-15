/*
 * ------------------------------------------
 * 日志缓存对象
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/util',
    'util/ajax/xdr',
    './cache.js'
],function(_k,_u,_j,_d,_p,_pro){
    /**
     * 日志缓存对象
     */
    _p._$$CacheBlog = _k._$klass();
    _pro = _p._$$CacheBlog._$extend(_d._$$Cache);
    /**
     * 从服务器端载入列表
     *
     * @param    {Object}   arg0   - 请求信息
     * @property {String}   key    - 列表标识
     * @property {Number}   offset - 偏移量
     * @property {Number}   limit  - 数量
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doLoadList = function(_options){
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
            onerror:this.__cbListLoad._$bind(this,_key,_callback,{})
        });
    };
    /**
     * 从缓存中取日志分类列表
     * @return {Array} 日志分类列表
     */
    _pro._$getClassListInCache = function(){
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
     * 从缓存中取日志标签列表
     * @return {Array} 日志标签列表
     */
    _pro._$getTagListInCache = function(){
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
});
