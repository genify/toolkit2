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
        _proModuleD2,
        _supModuleD2;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleD2 = NEJ.C();
      _proModuleD2 = _p._$$ModuleD2._$extend(_t._$$Module,!0);
      _supModuleD2 = _p._$$ModuleD2._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleD2.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('d2-ntp-0');
    };
    // notify loaded
    _g.dispatcher._$loaded('/?/d/d2/',_p._$$ModuleD2);
};
define('{pro}module/index/d.d2.js'
     ,['{pro}module/module.js'],f);