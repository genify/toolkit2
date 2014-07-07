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
        _proModuleD,
        _supModuleD;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleD = NEJ.C();
      _proModuleD = _p._$$ModuleD._$extend(_t._$$Module,!0);
      _supModuleD = _p._$$ModuleD._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleD.__doBuild = function(){
        this.__xlist = [
             {url:'/?/d/d0/',name:'D0'}
            ,{url:'/?/d/d1/',name:'D1'}
            ,{url:'/?/d/d2/',name:'D2'}];
        this.__body = _e._$create('div','m-d');
        _e._$renderHtmlTemplate(this.__body,
            'd-jst-0',{xlist:this.__xlist});
        var _list = _e._$getChildren(this.__body);
        this.__export.box = _list[1];
        this.__tab = _e._$tab(_list[0],{
            clazz:'js-tag',
            onchange:this.__onTabChange._$bind(this)
        });
    };
    /**
     * 切换模块
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleD.__onTabChange = function(_event){
        var _id = _e._$id(this.__export.box);
        _g.dispatcher._$redirect(this.__xlist[_event.index].url+'?box='+_id);
    };
    /**
     * 显示模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleD.__onShow = function(_event){
        this.__onRefresh();
        _supModuleD.__onShow.apply(this,arguments);
    };
    /**
     * 刷新模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleD.__onRefresh = function(_event){
        this.__tab._$go(0);
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/d/',_p._$$ModuleD);
};
define('{pro}module/index/d.js',
      ['{lib}util/tab/tab.js'
      ,'{pro}module/module.js'],f);