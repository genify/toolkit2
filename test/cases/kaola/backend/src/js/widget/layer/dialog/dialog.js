/**
 * ====================================================
 * 确认框窗体逻辑实现文件
 *
 * @author hzjiangren@corp.netease.com
 * @author hzliuxinqi@corp.netease.com
 * ===================================================
 * */
define(['../window.js',
    'base/element',
    'base/event',
    'text!./dialog.css',
    'text!./dialog.html',
    'util/template/tpl'
], function(Window, _e,_v,_css, _html,_e1, _p, _o, _f, _r,_pro) {
	
	var _seed_css = _e._$pushCSSText(_css),
		_seed_html= _e1._$addNodeTemplate(_html);
	
    _p._$$SureWindow = NEJ.C();
    _pro = _p._$$SureWindow._$extend(Window);

    _pro.__reset = function(_options) {
        this.__super(_options);
        this.__content.innerHTML = _options.cnt;
        if(_options.type==1){
        	_e._$delClassName(this.__btnBar,'alert');
        } else{
        	_e._$addClassName(this.__btnBar,'alert');
        }
        //设置是否在点击OK时自动隐藏，如果设置为true,那么需要手工在onok事件中隐藏对话
        //重置后，触发initContent事件，来初始化参数中的content内容
    };


    _pro.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html
    };

    _pro.__initNode = function() {
        this.__super();
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__content = _list[0];
        this.__btnBar = _list[1];
        this.__okBtn =  _list[2];
        this.__ccBtn = _list[3];
        _v._$addEvent(this.__okBtn,'click', this.__onOK._$bind(this));
        _v._$addEvent(this.__ccBtn,'click', this.__onCC._$bind(this));
    };

    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
    	_v._$stop(_event);
        this._$dispatchEvent('onok');
        this._$hide();
    };

    /**
     * 点击"取消"按钮事件响应
     * */
    _pro.__onCC = function(_event) {
    	_v._$stop(_event);
        this._$dispatchEvent('oncc');
        this._$hide();
    };
    
    return _p._$$SureWindow;
});
