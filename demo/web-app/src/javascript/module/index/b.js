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
        _proModuleB,
        _supModuleB;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleB = NEJ.C();
      _proModuleB = _p._$$ModuleB._$extend(_t._$$Module,!0);
      _supModuleB = _p._$$ModuleB._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleB.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('b-ntp-0');
        var _list = _e._$getChildren(this.__body),
            _id = _e._$id(_list[0]);
        _g.dispatcher._$apply('/?/b/b0/?box='+_id);
        _id = _e._$id(_list[1]);
        _g.dispatcher._$apply('/?/b/b1/?box='+_id);
        _id = _e._$id(_list[2]);
        _g.dispatcher._$apply('/?/b/b2/?box='+_id);
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/b/',_p._$$ModuleB);
};
define('{pro}module/index/b.js'
     ,['{pro}module/module.js'],f);