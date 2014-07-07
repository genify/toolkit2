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
        _proModuleA2,
        _supModuleA2;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleA2 = NEJ.C();
      _proModuleA2 = _p._$$ModuleA2._$extend(_t._$$Module,!0);
      _supModuleA2 = _p._$$ModuleA2._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleA2.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('a2-ntp-0');
        _v._$addEvent(this.__body.getElementsByTagName('input')[0],
                     'click',this.__doSendMessage._$bind(this));
    };
    /**
     * 发送消息
     * @return {Void}
     */
    _proModuleA2.__doSendMessage = function(){
        _g.dispatcher._$message({to:'/m/c/',from:this.__umi,data:'hello C! my name is a2.'});
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/a/a2/',_p._$$ModuleA2);
};
define('{pro}module/index/a.a2.js'
     ,['{pro}module/module.js'],f);