/*
 * ------------------------------------------
 * UI控件描述
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/klass.js',
    '{lib}ui/base.js',
    '{lib}util/template/tpl.js'
],function(_k,_i,_t,_p,_o,_f,_r){
    // variables
    var _seed_html,
        _seed_css,
        _pro;
    /**
     * 控件描述
     * 
     * @class   {_$$Class}
     * @extends {_$$Abstract}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$Class = _k._$klass();
    _pro = _p._$$Class._$extend(_i._$$Abstract);
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
    /**
     * 初始化外观信息，子类实现具体逻辑
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点，子类重写具体逻辑
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        // TODO
    };
    
    return _p;
});
