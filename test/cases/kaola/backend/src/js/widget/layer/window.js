/*
 * --------------------------------------------
 * 项目窗体基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
define(['ui/layer/window.wrapper'],
function(i,p,o,f,r){
    // variable
    var pro,sup;
    /**
     * 项目窗体基类
     * 
     * @class   {nm.l._$$LWindow}
     * @extends {nej.ui._$$WindowWrapper}
     * 
     * @param   {}
     */
    var $$Window = NEJ.C();
    pro = $$Window._$extend(i._$$WindowWrapper);
    sup = $$Window._$supro;
    /**
     * 控件重置
     * @param {Object} _options
     */
    pro.__reset = function(_options){
        _options.parent = _options.parent||document.body;
        _options.clazz = (_options.clazz||'')+ ' m-window';
        _options.mask = 'm-mask'; 
        this.__super(_options);
        this.__layer._$setTitle(_options.title||' ',true);
    };
    /**
     * 显示窗体
     */
    pro._$show = function(){
        this.__super.apply(this,arguments);
        this.__body.focus();
        return this;
    };
    return $$Window;
});