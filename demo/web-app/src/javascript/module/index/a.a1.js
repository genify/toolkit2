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
        _proModuleA1,
        _supModuleA1;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleA1 = NEJ.C();
      _proModuleA1 = _p._$$ModuleA1._$extend(_t._$$Module,!0);
      _supModuleA1 = _p._$$ModuleA1._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleA1.__doBuild = function(){
        this.__body = _e._$getNodeTemplate('a1-ntp-0');
        var _list = this.__body.getElementsByTagName('input');
        _v._$addEvent(_list[0],'click',this.__doSendMessage._$bind(this,'/m/c/'));
        _v._$addEvent(_list[1],'click',this.__doSendMessage._$bind(this,'/m/a/a0/'));
    };
    /**
     * 发送消息
     * @return {Void}
     */
    _proModuleA1.__doSendMessage = function(_to){
        _g.dispatcher._$message({to:_to,from:this.__umi,data:'hello C! my name is a1.'});
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/a/a1/',_p._$$ModuleA1);
};
define('{pro}module/index/a.a1.js'
     ,['{pro}module/module.js'],f);