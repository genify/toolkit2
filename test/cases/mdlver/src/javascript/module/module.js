/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'util/dispatcher/module'
], function(_k,_m,_p,_pro){
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$Module}
     * @extends {nej.ut._$$AbstractModule}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_m._$$ModuleAbstract);
    /**
     * 从地址中解析出UMI信息
     * @return {String} UMI信息
     */
    _pro.__doParseUMIFromOpt = (function(){
        var _reg0 = /\?|#/,
            _reg1 = /^\/m\//i;
        return function(_options){
            _options = (_options.input||_o).location||_options;
            return (_options.href||'/blog/').split(_reg0)[0].replace(_reg1,'/');
        };
    })();
    /**
     * 显示加载中状态
     * @param  {Object} 事件信息
     * @return {Void}
     */
    _pro.__onLoadingShow = function(_event){
        _event.value = '<p class="w-loading">&nbsp;</p>';
    };
    /**
     * 显示提示信息
     * @param  {Object} 事件信息
     * @return {Void}
     */
    _pro.__onMessageShow = function(_msg,_event){
        _event.value = '<p class="w-message">'+_msg+'</p>';
    };
    // export regist api
    _p._$regist = _m._$regist;
});
