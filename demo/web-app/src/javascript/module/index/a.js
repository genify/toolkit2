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
        _proModuleA,
        _supModuleA;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleA = NEJ.C();
      _proModuleA = _p._$$ModuleA._$extend(_t._$$Module,!0);
      _supModuleA = _p._$$ModuleA._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleA.__doBuild = function(){
        this.__xlist = [
             {url:'/m/a/a0/',name:'A0'}
            ,{url:'/m/a/a1/',name:'A1'}
            ,{url:'/m/a/a2/',name:'A2'}];
        this.__body = _e._$create('div','m-a');
        _e._$renderHtmlTemplate(this.__body,
            'a-jst-0',{xlist:this.__xlist});
        var _list = _e._$getChildren(this.__body);
        this.__export.box = _list[1];
        this.__tab = _e._$tab(_list[0],{clazz:'js-tag'});
        this.__tab._$setEvent('onchange',this.__onTabChange._$bind(this));
    };
    /**
     * 同步模块标签
     * @param  {String} _umi 模块UMI
     * @return {Void}
     */
    _proModuleA.__doSyncTab = function(_umi){
        var _index = _u._$indexOf(this.__xlist,
                     function(_item){
                         return _item.url===_umi;
                     });
        if (_index<0) return;
        this.__tab._$go(_index);
    };
    /**
     * 切换模块
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleA.__onTabChange = function(_event){
        _g.dispatcher._$redirect(this.__xlist[_event.index].url);
    };
    /**
     * 显示模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleA.__onShow = function(_event){
        this.__doSyncTab(_event.href);
        _supModuleA.__onShow.apply(this,arguments);
    };
    /**
     * 刷新模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleA.__onRefresh = function(_event){
        this.__doSyncTab(_event.href);
    };
    // notify loaded
    _g.dispatcher._$loaded('/m/a',_p._$$ModuleA);
};
define('{pro}module/index/a.js',
      ['{lib}util/tab/tab.js'
      ,'{pro}module/module.js'],f);