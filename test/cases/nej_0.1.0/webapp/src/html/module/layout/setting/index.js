/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define([
    'base/klass',
    'base/element',
    'util/template/tpl',
    'pro/module/module'
], function(_k,_e,_l,_m,_p,_pro){
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleLayoutSetting}
     * @extends {nej.ut._$$AbstractModuleLayoutSetting}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleLayoutSetting = _k._$klass();
    _pro = _p._$$ModuleLayoutSetting._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-l3')
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
    _m._$regist(
        'layout-setting',
        _p._$$ModuleLayoutSetting
    );
});
