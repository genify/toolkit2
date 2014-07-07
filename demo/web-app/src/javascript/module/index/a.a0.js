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
        _proModuleA0,
        _supModuleA0;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleA0 = NEJ.C();
      _proModuleA0 = _p._$$ModuleA0._$extend(_t._$$Module,!0);
      _supModuleA0 = _p._$$ModuleA0._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleA0.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('a0-ntp-0');
        _v._$addEvent(this.__body.getElementsByTagName('input')[0],
                     'click',this.__doSendMessage._$bind(this));
    };
    /**
     * 发送消息
     * @return {Void}
     */
    _proModuleA0.__doSendMessage = function(){
        _g.dispatcher._$message({to:'/m/c/',from:this.__umi,data:'hello C! my name is a0.'});
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/a/a0/',_p._$$ModuleA0);
};
define('{pro}module/index/a.a0.js'
     ,['{pro}module/module.js'],f);