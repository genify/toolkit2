/*
 * ------------------------------------------
 * 日志列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}module/module.js'
       ,'{pro}cache/blog.js'
       ,'{lib}util/list/module.pager.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _t = _('nej.ut'),
        _d = _('wd.d'),
        _m = _('wd.m'),
        _p = _('wd.m.b'),
        _proModuleBlogList;
    if (!!_p._$$ModuleBlogList) return;
    /**
     * 日志列表模块对象
     * 
     * @class   {wd.m.b._$$ModuleBlogList}
     * @extends {wd.m._$$Module}
     * 
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     * 
     */
    _p._$$ModuleBlogList = NEJ.C();
      _proModuleBlogList = _p._$$ModuleBlogList._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleBlogList.__doBuild = function(){
        this.__supDoBuild();
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-2')
        );
        // 0 - list box
        // 1 - pager box
        var _list = _e._$getByClassName(this.__body,'js-flag');
        this.__mopt = {
            limit:15,
            parent:_list[0],
            item:'jst-2-blog-list',
            cache:{klass:_d._$$CacheBlog},
            pager:{clazz:'w-pager',parent:_list[1]},
            onbeforelistload:this.__onLoadingShow._$bind(this),
            onemptylist:this.__onMessageShow._$bind(this,'没有日志列表！')
        };
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proModuleBlogList.__onRefresh = (function(){
        var _doParseCKey = function(_param){
            if (!!_param.cid)
                return 'class-'+_param.cid;
            if (!!_param.tid)
                return 'tag-'+_param.tid;
            return 'box-'+(_param.box||1);
        };
        return function(_options){
            this.__supOnRefresh(_options);
            if (this.__lmdl) this.__lmdl._$recycle();
            this.__mopt.cache.lkey = _doParseCKey(_options.param||_o);
            this.__lmdl = _t._$$ListModulePG._$allocate(this.__mopt);
        };
    })();
    /**
     * 
     * @param {Object} _event
     */
    _proModuleBlogList.__onSubscribe = function(_event){
        console.log('hi,i\'m '+this.__umi+', subscribe message from '+_event.from+' and say: '+JSON.stringify(_event.data));
    };
    // notify dispatcher
    _e._$regist('blog-list',_p._$$ModuleBlogList);
});
