/**
 * ------------------------------------------
 * 模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _t = _('dm.ut'),
        _p = NEJ.P('dm.m'),
        _g = window,
        _proModuleC,
        _supModuleC;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleC = NEJ.C();
      _proModuleC = _p._$$ModuleC._$extend(_t._$$Module,!0);
      _supModuleC = _p._$$ModuleC._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleC.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('c-ntp-0');
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/c/',_p._$$ModuleC);
};
define('{pro}module/index/c.js'
     ,['{pro}module/module.js'],f);