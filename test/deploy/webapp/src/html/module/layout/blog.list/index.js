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
        _pro;
    if (!!_p._$$ModuleLayoutBlogList) return;
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleLayoutBlogList}
     * @extends {nej.ut._$$AbstractModuleLayoutBlogList}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleLayoutBlogList = NEJ.C();
    _pro = _p._$$ModuleLayoutBlogList._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-l2')
        );
        // 0 - box select
        // 1 - class list box
        // 2 - tag list box
        // 3 - sub module box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__export = {
            box:_list[0],
            clazz:_list[1],
            tag:_list[2],
            list:_list[3],
            parent:_list[3]
        };
    };
    // notify dispatcher
    _e._$regist('layout-blog-list',_p._$$ModuleLayoutBlogList);
});
