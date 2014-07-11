/*
 * ------------------------------------------
 * 标签列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}module/module.js'
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
        _proModuleBlogTagTab;
    if (!!_p._$$ModuleBlogTagTab) return;
    /**
     * 标签列表模块
     * @class   {wd.m._$$ModuleBlogTagTab}
     * @extends {nej.ut._$$AbstractModuleTagList}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleBlogTagTab = NEJ.C();
      _proModuleBlogTagTab = _p._$$ModuleBlogTagTab._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleBlogTagTab.__doBuild = function(){
        this.__supDoBuild();
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-7')
        );
        this.__tbview = _t._$$TabView._$allocate({
            list:_e._$getChildren(this.__body)
        });
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proModuleBlogTagTab.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        this.__tbview._$match(
            this.__doParseUMIFromOpt(_options)
        );
    };
    // notify dispatcher
    _e._$regist('blog-tab',_p._$$ModuleBlogTagTab);
});