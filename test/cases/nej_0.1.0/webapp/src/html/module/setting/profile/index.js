/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/event',
    'base/element',
    'util/template/tpl',
    'pro/module/module'
], function(_k,_v,_e,_l,_m,_p,_pro){
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleAccountProfile}
     * @extends {nej.ut._$$AbstractModuleAccountProfile}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleAccountProfile = _k._$klass();
    _pro = _p._$$ModuleAccountProfile._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-c')
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
    _pro.__onMessage = function(_event){
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
    _pro.__onPublishMessage = function(){
        this.__doPublishMessage(
            'onok',{a:'aaaa',b:'bbbbb'}
        );
    };
    // notify dispatcher
    _m._$regist(
        'setting-profile',
        _p._$$ModuleAccountProfile
    );
});
