/*
 * ------------------------------------------
 * 
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
define(['{lib}util/event.js'],
function(){
    var _  = NEJ.P,
        _t = _('nej.ut'),
        _p = _('nm.ut'),
        _pro;
    if (!!_p._$$Class) return;
    /**
     * 
     * @class   {nm.ut._$$Class}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$Class = NEJ.C();
    _pro = _p._$$Class._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__supInit();
        // TODO
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        // TODO
    };
    /**
     * 控件回收
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        // TODO
    };
    
    
});
