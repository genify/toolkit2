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
    'util/template/tpl',
    'util/list/waterfall',
    'pro/cache/tag',
    'pro/module/module'
], function(_k,_e,_l,_t,_d,_m,_p,_pro){
    /**
     * 标签列表模块
     * @class   {wd.m._$$ModuleTagList}
     * @extends {nej.ut._$$AbstractModuleTagList}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleTagList = _k._$klass();
    _pro = _p._$$ModuleTagList._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-6')
        );
        // 0 - list box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__lmdl = _t._$$ListModuleWF._$allocate({
            limit:1000,
            parent:_list[0],
            item:'jst-6-tag-list',
            cache:{klass:_d._$$CacheTag,lkey:'blog-tag'},
            onbeforelistload:this.__onLoadingShow._$bind(this),
            onemptylist:this.__onMessageShow._$bind(this,'没有标签列表！')
        });
    };
    // notify dispatcher
    _m._$regist(
        'blog-tag',
        _p._$$ModuleTagList
    );
});