/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}module/module.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _m = _('wd.m'),
        _p = _('wd.m.l'),
        _proModuleLayoutBlog;
    if (!!_p._$$ModuleLayoutBlog) return;
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleLayoutBlog}
     * @extends {nej.ut._$$AbstractModuleLayoutBlog}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleLayoutBlog = NEJ.C();
      _proModuleLayoutBlog = _p._$$ModuleLayoutBlog._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleLayoutBlog.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-l1')
        );
        // 0 - tab box
        // 1 - module box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__export = {
            tab:_list[0],
            parent:_list[1]
        };
    };
    // notify dispatcher
    _e._$regist('layout-blog',_p._$$ModuleLayoutBlog);
});
