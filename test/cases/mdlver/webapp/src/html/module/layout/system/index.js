/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/element',
    'util/template/tpl',
    'pro/module/module'
], function(_k,_e,_l,_m,_p,_pro){
    /**
     * 项目模块基类对象
     * @class   {wd.m._$$ModuleLayoutSystem}
     * @extends {nej.ut._$$AbstractModuleLayoutSystem}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleLayoutSystem = _k._$klass();
    _pro = _p._$$ModuleLayoutSystem._$extend(_m._$$Module);
    /**
     * 解析模块所在容器节点
     * @param  {Object} 配置信息
     * @return {Node}   模块所在容器节点
     */
    _pro.__doParseParent = function(_options){
        return _e._$get('module-box');
    };
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-l0')
        );
        // 0 - tab box
        // 1 - module box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__export = {
            tab:_list[0],
            parent:_list[1]
        };
    };
    // notify dispatcher
    _m._$regist(
        'layout-system',
        _p._$$ModuleLayoutSystem
    );
});
