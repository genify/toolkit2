/*
 * ------------------------------------------
 * 标签列表模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define(['{pro}cache/tag.js'
       ,'{pro}module/module.js'
       ,'{lib}util/list/module.waterfall.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _t = _('nej.ut'),
        _d = _('wd.d'),
        _m = _('wd.m'),
        _p = _('wd.m.b'),
        _proModuleTagList;
    if (!!_p._$$ModuleTagList) return;
    /**
     * 标签列表模块
     * @class   {wd.m._$$ModuleTagList}
     * @extends {nej.ut._$$AbstractModuleTagList}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$ModuleTagList = NEJ.C();
      _proModuleTagList = _p._$$ModuleTagList._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleTagList.__doBuild = function(){
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-6')
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
    _e._$regist('blog-tag',_p._$$ModuleTagList);
});