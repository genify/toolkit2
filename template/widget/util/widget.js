/*
 * ------------------------------------------
 * 通用控件实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/event.js'
],function(_k,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 控件描述
     * 
     * @class   {_$$Class}
     * @extends {_$$Event}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$Class = _k._$klass();
    _pro = _p._$$Class._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
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
        this.__super(_options);
        // TODO
    };
    /**
     * 控件回收
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        // TODO
    };
    
    return _p;
});
