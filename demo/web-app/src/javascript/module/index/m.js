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
        _proModuleM,
        _supModuleM;
    /**
     * 模块对象
     * @class   模块对象
     * @extends {dm.ut._$$Module}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$ModuleM = NEJ.C();
      _proModuleM = _p._$$ModuleM._$extend(_t._$$Module,!0);
      _supModuleM = _p._$$ModuleM._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleM.__doBuild = function(){
        this.__xlist = [
             {url:'/m/a/',name:'A',umi:'/m/a/a0/'}
            ,{url:'/m/b/',name:'B'}
            ,{url:'/m/c/',name:'C'}
            ,{url:'/m/d/',name:'D'}];
        this.__body = _e._$create('div');
        _e._$renderHtmlTemplate(this.__body,
            'm-jst-0',{xlist:this.__xlist});
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
    _proModuleM.__doSyncTab = function(_umi){
        var _index = _u._$indexOf(this.__xlist,
                     function(_item){
                         return _umi.indexOf(_item.url)>=0;
                     });
        if (_index<0) return;
        this.__tab._$go(_index);
        // last
        var _config = this.__xlist[0];
        if (_umi.indexOf(_config.url)>=0)
            _config.umi = _umi;
    };
    /**
     * 切换模块
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleM.__onTabChange = function(_event){
        var _config = this.__xlist[_event.index];
        _g.dispatcher._$redirect(_config.umi||_config.url);
    };
    /**
     * 显示模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleM.__onShow = function(_event){
        this.__doSyncTab(_event.href);
        _supModuleM.__onShow.apply(this,arguments);
    };
    /**
     * 刷新模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModuleM.__onRefresh = function(_event){
        this.__doSyncTab(_event.href);
    };
    // notify loaded
    _g.dispatcher._$loaded('/m',_p._$$ModuleM);
};
define('{pro}module/index/m.js',
      ['{lib}util/tab/tab.js'
      ,'{pro}module/module.js'],f);