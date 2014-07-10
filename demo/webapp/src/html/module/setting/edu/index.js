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
        _p = _('wd.m.s'),
        _proModuleAccountEdu;
    if (!!_p._$$ModuleAccountEdu) return;
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleAccountEdu}
     * @extends {nej.ut._$$AbstractModuleAccountEdu}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleAccountEdu = NEJ.C();
      _proModuleAccountEdu = _p._$$ModuleAccountEdu._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleAccountEdu.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-d')
        );
    };
    // notify dispatcher
    _e._$regist('setting-edu',_p._$$ModuleAccountEdu);
});
