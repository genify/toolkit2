
 /* ====================================================
 * 确认框窗体逻辑实现文件
 *
 * @author hzjiangren@corp.netease.com
 * @author hzliuxinqi@corp.netease.com
 * ===================================================
 * */
define(['../../window.js',
    'base/util',
    'base/element',
    'base/event',
    'text!./deliveryInfo.css',
    'text!./deliveryInfo.html',
    'util/template/tpl',
    'util/form/form',
    'ui/datepick/datepick',
    'pro/base/request',
    'pro/components/notify/notify',
    'util/template/jst'
], function(Window, _u, _e,_v,_css, _html,_e1, _t, _ut0, request, notify,_e2,_p, _o, _f, _r,_pro) {
	
	var _seed_css = _e._$pushCSSText(_css),
		_seed_ui = _e1._$parseUITemplate(_html),
	    _seed_txt = _seed_ui['seedTxt'],
	    _seed_info = _seed_ui['seedInfo'],
	    _seed_html = _e1._$addNodeTemplate(_e1._$getTextTemplate(_seed_txt));
	
    _p._$$DeliveryInfoWindow = NEJ.C();
    _pro = _p._$$DeliveryInfoWindow._$extend(Window);

    _pro.__reset = function(_options) {
        if(!_options.info || !_options.info.storageId){
            _options.title='新增仓库'; 
            _options.info.ruleType=1;
            _options.info.criticalTime="0:00";
            _options.info.delayTimeDeadline1="0:00";
            _options.info.delayTimeDeadline2="0:00";
            window.requestUrl='/backend/dw/period/addStockRule';
            this.__index = -1;
        }else{
    	   _options.title='编辑仓库'; 
           window.requestUrl='/backend/dw/period/updateStockRule';
           this.__index = _options.index;
        }
        this.__info = _options.info;
        this.__super(_options);
        _e2._$render(this.__formBox,_seed_info,{info: this.__info, warehouseList: window.__warehouseList__});
        this.initForm();
        this.__doInitFormCtrl(this.__formBox, _options);
    };
    _pro.initForm = function(){
        this.__webForm = _t._$$WebForm._$allocate({
            form: this.__formBox
        });
        _v._$addEvent('ruleType', 'change', this.onRuleSelectClick._$bind(this));
        _v._$addEvent('isDefault', 'change', this.onRuleSelectClick._$bind(this));
    };
    //规则选择
    _pro.onRuleSelectClick = function(_event){
        var ruleType = _e._$get("ruleType").value;
        var isDefault=_e._$get("isDefault").value;
        this.__info.ruleType = ruleType;
        this.__info.isDefault = isDefault;
        
        _e2._$render(this.__formBox,_seed_info,{info: this.__info, warehouseList: window.__warehouseList__});
        _v._$addEvent('isDefault', 'change', this.onRuleSelectClick._$bind(this));
        _v._$addEvent('ruleType', 'change', this.onRuleSelectClick._$bind(this));
        this.__doInitFormCtrl(this.__formBox);
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
     * 初始化表单控件
     * @return {Void}
     */
    _pro.__doInitFormCtrl = function(_form,_options){
        // init datepick
        _u._$forEach(
            _e._$getByClassName(_form,'j-datepick'),
            function(_parent){
                if(_parent.tagName=='INPUT'){
                    _v._$addEvent(_parent,'click',this.__onDatePickClick._$bind(this,_parent));
                } 
            }._$bind(this)
        );
    };
    
    _pro.__onDatePickClick = function(_elm,_event){
        _v._$stop(_event);
        if(this.__datepick){
            this.__datepick = this.__datepick._$recycle();
        }
        this.__datepick = _ut0._$$DatePick._$allocate({
                                parent:_elm.parentNode,
                                date:_elm.value,
                                onchange:function(_date){
                                    _elm.value = _u._$format(_date,'yyyy-MM-dd');
                                }
                            })
    }
    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
    	_v._$stop(_event);
        if(this.__webForm._$checkValidity()){
            var _data = this.__webForm._$data();
            if(_e._$get("isDefault").value == 0){
                if(_e._$get("availableStart").value == ''){
                    notify.showError('请设置生效日期');
                    return false;
                }
                if(_e._$get("availableEnd").value == ''){
                    notify.showError('请设置失效日期');
                    return false;
                }
                if(_e._$get("availableStart").value>_e._$get("availableEnd").value){
                    notify.showError('生效日期必须早于失效日期');
                    return false;          
                }
            }else{
                _data.availableStart =null;
                _data.availableEnd =null;
            }
            if(_e._$get("ruleType").value == 1){
                if(_e._$get("delayDay1").value == ''){
                    notify.showError('请填写发货延后天数1');
                    return false; 
                }
                if(_e._$get("delayDay2").value == ''){
                    notify.showError('请填写发货延后天数2');
                    return false; 
                }
            }else{
                if(_e._$get("delayHours").value == ''){
                    notify.showError('后延小时数必须为整数');
                    return false; 
                }
            }
            request(requestUrl,{
                data:_data,
                method: 'POST',
                onload:function(_json){
                    if(_json && _json.code==200){
                        notify.show(_json.message || '操作成功！');
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
    return _p._$$DeliveryInfoWindow;
});