/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/element',
    'util/template/tpl',
    'pro/module/module'
], function(_k,_e,_l,_m,_p,_pro){
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleAccountEdu}
     * @extends {nej.ut._$$AbstractModuleAccountEdu}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleAccountEdu = _k._$klass();
    _pro = _p._$$ModuleAccountEdu._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-d')
        );
    };
    // notify dispatcher
    _m._$regist(
        'setting-edu',
        _p._$$ModuleAccountEdu
    );
});
