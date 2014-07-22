/*
 * ------------------------------------------
 * 
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
define(['{lib}util/dispatcher/module.base.js'],
function(){
    var _  = NEJ.P,
        _t = _('nej.ut'),
        _p = _('nm.m'),
        _pro;
    if (!!_p._$$Module) return;
    /**
     * 
     * @class   {nm.m._$$Module}
     * @extends {nej.ut._$$AbstractModule}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$Module = NEJ.C();
    _pro = _p._$$Module._$extend(_t._$$AbstractModule);
    /**
     * 显示模块触发事件
     * @protected
     * @method {__onShow}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _pro.__onShow = function(_options){
        this.__supOnShow(_options);
        // TODO
    };
    /**
     * 显示模块触发事件
     * @protected
     * @method {__onRefresh}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        // TODO
    };
    /**
     * 隐藏模块触发事件
     * @protected
     * @method {__onHide}
     * @return {Void}
     */
    _pro.__onHide = function(){
        this.__supOnHide();
        // TODO
    };
});
