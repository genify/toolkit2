/**
 * ------------------------------------------
 * 模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = NEJ.P('dm.ut'),
        _proModule,
        _supModule;
    /**
     * 模块基类对象
     * @class   模块基类对象
     * @extends nej.ut._$$Module
     * @param  {Object} _options 可选配置参数，已处理参数列表如下所示
     *                           
     */
    _p._$$Module = NEJ.C();
      _proModule = _p._$$Module._$extend(_t._$$Module,!0);
      _supModule = _p._$$Module._$supro;
    /**
     * 构建模块
     * @return {Void}
     */
    _proModule.__init = function(){
        this.__supInit();
        this.__doBuild();
    };
    /**
     * 构建模块
     * @return {Void}
     */
    _proModule.__doBuild = function(){
        // TODO build module
        // this.__body
    };
    /**
     * 显示模块触发事件
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModule.__onShow = function(_event){
        var _data = _event.data||_o,
            _param = _event.param||_o,
            _parent = _data.box||
                      _e._$get(_param.box)||
                      _e._$get('module-box');
        if (!!this.__body) 
            _parent.appendChild(this.__body);
    };
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     * @return {Void}
     */
    _proModule.__onHide = function(_event){
        _e._$removeByEC(this.__body);
    };;
    /**
     * 刷新模块触发事件，子类实现具体逻辑
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModule.__onRefresh = function(_event){
        // TODO refresh module
    };;
    /**
     * 接受消息处理
     * @param  {Object} _message 消息
     * @return {Void}
     */
    _proModule.__onMessage = function(_message){
        var p = _e._$create('p');
        p.innerHTML = 'receive message from '+_message.from+' and say: '+_message.data;
        this.__body.appendChild(p);
    };
};
define('{pro}module/module.js'
     ,['{lib}util/dispatcher/module.2.js'],f);