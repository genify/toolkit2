/*
 * ------------------------------------------
 * 标签列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/element',
    'util/tab/view',
    'util/template/tpl',
    'pro/module/module'
], function(_k,_e,_t,_l,_m,_p,_pro){
    /**
     * 标签列表模块
     * @class   {wd.m._$$ModuleSettingTab}
     * @extends {nej.ut._$$AbstractModuleTagList}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleSettingTab = _k._$klass();
    _pro = _p._$$ModuleSettingTab._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__super();
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-8')
        );
        this.__tbview = _t._$$TabView._$allocate({
            list:_e._$getChildren(this.__body),
            oncheck:this.__doCheckMatchEQ._$bind(this)
        });
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__super(_options);
        this.__tbview._$match(
            this.__doParseUMIFromOpt(_options)
        );
    };
    /**
     * 验证选中项
     * @param  {Object} 事件信息
     * @return {Void}
     */
    _pro.__doCheckMatchEQ = function(_event){
        if (_event.target=='/setting/'){
            _event.target = '/setting/account/'
        }
        _event.matched = _event.target.indexOf(_event.source)==0
    };
    // notify dispatcher
    _m._$regist(
        'setting-tab',
        _p._$$ModuleSettingTab
    );
});