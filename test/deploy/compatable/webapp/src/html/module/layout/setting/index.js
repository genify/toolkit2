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
        _proModuleLayoutSetting;
    if (!!_p._$$ModuleLayoutSetting) return;
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleLayoutSetting}
     * @extends {nej.ut._$$AbstractModuleLayoutSetting}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleLayoutSetting = NEJ.C();
      _proModuleLayoutSetting = _p._$$ModuleLayoutSetting._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleLayoutSetting.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-l3')
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
    _e._$regist('layout-setting',_p._$$ModuleLayoutSetting);
});
