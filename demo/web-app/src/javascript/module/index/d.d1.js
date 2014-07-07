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
        _proModuleD1,
        _supModuleD1;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleD1 = NEJ.C();
      _proModuleD1 = _p._$$ModuleD1._$extend(_t._$$Module,!0);
      _supModuleD1 = _p._$$ModuleD1._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleD1.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('d1-ntp-0');
    };
    // notify loaded
    _g.dispatcher._$loaded('/?/d/d1/',_p._$$ModuleD1);
};
define('{pro}module/index/d.d1.js'
     ,['{pro}module/module.js'],f);