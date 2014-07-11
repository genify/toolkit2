/*
 * ------------------------------------------
 * 日志类别模块实现文件
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
        _p = _('wd.m.b'),
        _proModuleBlogListBox;
    if (!!_p._$$ModuleBlogListBox) return;
    /**
     * 日志类别模块对象
     * 
     * @class   {wd.m.b._$$ModuleBlogListBox}
     * @extends {wd.m._$$Module}
     * 
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     * 
     */
    _p._$$ModuleBlogListBox = NEJ.C();
      _proModuleBlogListBox = _p._$$ModuleBlogListBox._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _proModuleBlogListBox.__doBuild = function(){
        this.__supDoBuild();
        this.__body = _e._$html2node(
            _e._$getTextTemplate('module-id-5')
        );
        // 0 - box type box
        // 1 - class or tag name
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__ntip = _list[1];
        this.__nprt = _list[0].parentNode;
        this.__tbview = _t._$$TabView._$allocate({
            list:_e._$getByClassName(_list[0],'j-list')
        });
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proModuleBlogListBox.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        var _param = _options.param||_o,
            _tname = _param.cid||_param.tid;
        if (!!_tname){
            var _prefix = !!_param.cid?'分类：':'标签：';
            this.__ntip.innerText = _prefix+_tname+'的日志列表';
            _e._$addClassName(this.__nprt,'js-ntbx');
        }else{
            this.__tbview._$match(_param.box||0);
            _e._$delClassName(this.__nprt,'js-ntbx');
        }
    };
    // notify dispatcher
    _e._$regist('blog-list-box',_p._$$ModuleBlogListBox);
});
