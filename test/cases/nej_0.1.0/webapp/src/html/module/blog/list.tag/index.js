/*
 * ------------------------------------------
 * 日志类别模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/element',
    'util/tab/view',
    'util/template/tpl',
    'util/template/jst',
    'pro/cache/blog',
    'pro/module/module'
], function(_k,_e,_t,_l,_jst,_d,_m,_p,_pro){
    /**
     * 日志类别模块对象
     * 
     * @class   {wd.m.b._$$ModuleBlogListTag}
     * @extends {wd.m._$$Module}
     * 
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     * 
     */
    _p._$$ModuleBlogListTag = _k._$klass();
    _pro = _p._$$ModuleBlogListTag._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__super();
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-4')
        );
        // 0 - class list box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__cache = _d._$$CacheBlog._$allocate();
        // - build tag list
        _jst._$render(
            _list[0],'jst-4-tag-list',
            {xlist:this.__cache._$getTagListInCache()}
        );
        this.__tbview = _t._$$TabView._$allocate({
            list:_e._$getByClassName(_list[0],'j-list')
        });
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__super(_options);
        this.__tbview._$match(_options.param.tid);
    };
    // notify dispatcher
    _m._$regist(
        'blog-list-tag',
        _p._$$ModuleBlogListTag
    );
});
