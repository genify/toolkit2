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
        _proModuleD0,
        _supModuleD0;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleD0 = NEJ.C();
      _proModuleD0 = _p._$$ModuleD0._$extend(_t._$$Module,!0);
      _supModuleD0 = _p._$$ModuleD0._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleD0.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('d0-ntp-0');
    };
    // notify loaded
    _g.dispatcher._$loaded('/?/d/d0/',_p._$$ModuleD0);
};
define('{pro}module/index/d.d0.js'
     ,['{pro}module/module.js'],f);