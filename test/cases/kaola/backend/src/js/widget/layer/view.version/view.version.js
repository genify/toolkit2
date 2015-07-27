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
    'text!./view.version.css',
    'text!./view.version.html',
    'util/template/tpl',
    'pro/components/notify/notify',
    'util/template/jst'
], function(Window, _e,_v,_css, _html,_e1,_t,_e2,_p, _o, _f, _r,_pro) {
	
	var _seed_css = _e._$pushCSSText(_css),
		_seed_ui = _e1._$parseUITemplate(_html),
	    _seed_txt = _seed_ui['seedTxt'],
	    _seed_version = _seed_ui['seedversion'],
	    _seed_html = _e1._$addNodeTemplate(_e1._$getTextTemplate(_seed_txt));
	
    _p._$$CreatVersionWindow = NEJ.C();
    _pro = _p._$$CreatVersionWindow._$extend(Window);

    _pro.__reset = function(_options) {
    	_options.title='查看版本更新';
        this.__super(_options);
        _e2._$render(this.__box,_seed_version,{version:_options.version});
    };
    _pro.__destroy = function(_options) {
        this.__super(_options);
    };

    _pro.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html
    };

    _pro.__initNode = function() {
        this.__super();
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__box = _list[0];
        this.__okBtn =  _list[1];
        _v._$addEvent(this.__okBtn,'click', this.__onOK._$bind(this));
    };
    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
    	_v._$stop(_event);
    	this._$dispatchEvent('onok');
		this._$hide();
    };

    
    return _p._$$CreatVersionWindow;
});
