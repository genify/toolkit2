/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}module/module.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _m = _('wd.m'),
        _p = _('wd.m.s'),
        _proModuleAccountProfile;
    if (!!_p._$$ModuleAccountProfile) return;
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleAccountProfile}
     * @extends {nej.ut._$$AbstractModuleAccountProfile}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleAccountProfile = NEJ.C();
      _proModuleAccountProfile = _p._$$ModuleAccountProfile._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleAccountProfile.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-c')
        );
        _v._$addEvent(
            _e._$getByClassName(this.__body,'j-flag')[0],
            'click',this.__onPublishMessage._$bind(this)
        );
    };
    /**
     * 
     * @param {Object} _event
     */
    _proModuleAccountProfile.__onMessage = function(_event){
        console.log(
            'receive message from '+
            _event.from+' and say: '+
            JSON.stringify(_event.data)
        );
    };
    /**
     * 发布消息
     * 
     */
    _proModuleAccountProfile.__onPublishMessage = function(){
        this.__doPublishMessage(
            'onok',{a:'aaaa',b:'bbbbb'}
        );
    };
    // notify dispatcher
    _e._$regist('setting-profile',_p._$$ModuleAccountProfile);
});
