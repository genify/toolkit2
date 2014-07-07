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
        _proModuleB1,
        _supModuleB1;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleB1 = NEJ.C();
      _proModuleB1 = _p._$$ModuleB1._$extend(_t._$$Module,!0);
      _supModuleB1 = _p._$$ModuleB1._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleB1.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('b1-ntp-0');
    };
    // notify loaded
    _g.dispatcher._$loaded('/?/b/b1/',_p._$$ModuleB1);
};
define('{pro}module/index/b.b1.js'
     ,['{pro}module/module.js'],f);