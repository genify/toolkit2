/**
 * ====================================================
 * 确认框窗体逻辑实现文件
 *
 * @author hzjiangren@corp.netease.com
 * @author hzliuxinqi@corp.netease.com
 * ===================================================
 * */
define(['../../window.js',
    'base/element',
    'base/event',
    'text!./deletePerson.css',
    'text!./deletePerson.html',
    'util/template/tpl',
    'util/form/form',
    'pro/base/request',
    'pro/components/notify/notify',
    'util/template/jst'
], function(Window, _e,_v,_css, _html, _e1 , _f, request, _t,_e2,_p, _o, _r,_pro) {
	
    var _seed_css = _e._$pushCSSText(_css),
        _seed_ui = _e1._$parseUITemplate(_html),
        _seed_txt = _seed_ui['seedTxt'],
        _seed_info = _seed_ui['seedInfo'],
        _seed_html = _e1._$addNodeTemplate(_e1._$getTextTemplate(_seed_txt));
    
    _p._$$DeletePersonWindow = NEJ.C();
    _pro = _p._$$DeletePersonWindow._$extend(Window);

    _pro.__reset = function(_options) {
    	_options.title='删除用户'; 
        this.__index = _options.index;
        this.__super(_options);
        _e2._$render(this.__formBox,_seed_info,{info:_options.info});
        this.initForm();
    };
    _pro.initForm = function(){
        this.__webForm = _f._$$WebForm._$allocate({
            form: this.__formBox
        });
    };
    _pro.__destroy = function(_options) {
        this.__super(_options);
    };

    _pro.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };

    _pro.__initNode = function() {
        this.__super();
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__formBox = _list[0];
        this.__okBtn =  _list[1];
        this.__cancelBtn =  _list[2];
        _v._$addEvent(this.__okBtn,'click', this.__onOK._$bind(this));
        _v._$addEvent(this.__cancelBtn,'click', this.__onCancel._$bind(this));
    };
    /**
     * 点击"确定"按钮事件响应删除用户
     * */
    _pro.__onOK = function(_event) {
        _v._$stop(_event);
        if(this.__webForm._$checkValidity()){
            var _data = this.__webForm._$data();
            request('/backend/dw/warningEmail/delete',{
                data:_data,
                method: 'GET',
                onload:function(_json){
                    if(_json && _json.code==200){
                        this._$dispatchEvent('onok', _data, this.__index);
                        this._$hide();
                    }else{
                        notify.showError(_json.message || '操作失败！');
                    }
                }._$bind(this),
                onerror:function(_json){
                    notify.show(_json.message || '请求失败，稍后再试！');
                }
            })
        }
    };
    _pro.__onCancel = function(_event) {
        _v._$stop(_event);
        this._$hide();
    };
    
    return _p._$$DeletePersonWindow;
});
