/*
 * ------------------------------------------
 * 标签列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}module/module.js'
       ,'{lib}util/tab/tab.view.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _t = _('nej.ut'),
        _d = _('wd.d'),
        _m = _('wd.m'),
        _p = _('wd.m.s'),
        _proModuleSettingAccountTab;
    if (!!_p._$$ModuleSettingAccountTab) return;
    /**
     * 标签列表模块
     * @class   {wd.m._$$ModuleSettingAccountTab}
     * @extends {nej.ut._$$AbstractModuleTagList}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleSettingAccountTab = NEJ.C();
      _proModuleSettingAccountTab = _p._$$ModuleSettingAccountTab._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleSettingAccountTab.__doBuild = function(){
        this.__supDoBuild();
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-9')
        );
        this.__tbview = _t._$$TabView._$allocate({
            list:_e._$getChildren(this.__body,'j-flag'),
            oncheck:this.__doCheckMatchEQ._$bind(this)
        });
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proModuleSettingAccountTab.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        this.__tbview._$match(
            this.__doParseUMIFromOpt(_options)
        );
    };
    /**
     * 验证选中项
     * @param  {Object} 事件信息
     * @return {Void}
     */
    _proModuleSettingAccountTab.__doCheckMatchEQ = function(_event){
        if (_event.target=='/setting/'){
            _event.target = '/setting/account/'
        }
        _event.matched = _event.target==_event.source;
    };
    // notify dispatcher
    _e._$regist('setting-account-tab',_p._$$ModuleSettingAccountTab);
});