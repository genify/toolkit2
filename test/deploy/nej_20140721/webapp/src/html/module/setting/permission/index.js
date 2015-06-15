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
        _proModulePermission;
    if (!!_p._$$ModulePermission) return;
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModulePermission}
     * @extends {nej.ut._$$AbstractModulePermission}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModulePermission = NEJ.C();
      _proModulePermission = _p._$$ModulePermission._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModulePermission.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-e')
        );
        // subscribe /m/setting/account/ message
        /*
        dispatcher._$subscribe(
            '/m/setting/account/','onok',
            this.__onSubscribe._$bind(this)
        );
        */
        // send message to /m/setting/account/
        _v._$addEvent(
            _e._$getByClassName(this.__body,'j-flag')[0],
            'click',this.__onSendMessage._$bind(this)
        );
    };
    /**
     * 
     * @param {Object} _event
     */
    _proModulePermission.__onSubscribe = function(_event){
        console.log('hi,i\'m '+this.__umi+', subscribe message from '+_event.from+' and say: '+JSON.stringify(_event.data));
    };
    /**
     * 
     */
    _proModulePermission.__onSendMessage = function(){
        this.__doSendMessage(
            '/m/setting/account/',
            {d:'ddddd',e:'eeeeee'}
        );
    };
    // notify dispatcher
    _e._$regist('setting-permission',_p._$$ModulePermission);
});