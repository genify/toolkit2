/*
 * ------------------------------------------
 * 日志类别模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}cache/blog.js'
       ,'{pro}module/module.js'
       ,'{lib}util/tab/tab.view.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _t = _('nej.ut'),
        _d = _('wd.d'),
        _m = _('wd.m'),
        _p = _('wd.m.b'),
        _proModuleBlogListTag;
    if (!!_p._$$ModuleBlogListTag) return;
    /**
     * 日志类别模块对象
     * 
     * @class   {wd.m.b._$$ModuleBlogListTag}
     * @extends {wd.m._$$Module}
     * 
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     * 
     */
    _p._$$ModuleBlogListTag = NEJ.C();
      _proModuleBlogListTag = _p._$$ModuleBlogListTag._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleBlogListTag.__doBuild = function(){
        this.__supDoBuild();
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-4')
        );
        // 0 - class list box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__cache = _d._$$CacheBlog._$allocate();
        // - build tag list
        _e._$renderHtmlTemplate(
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
    _proModuleBlogListTag.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        this.__tbview._$match(_options.param.tid);
    };
    // notify dispatcher
    _e._$regist('blog-list-tag',_p._$$ModuleBlogListTag);
});
