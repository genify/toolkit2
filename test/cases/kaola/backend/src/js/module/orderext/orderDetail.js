/**
 * 订单编辑页面
 * Created by zmm on 21/11/14.
 */
NEJ.define('{pro}module/orderext/orderDetail.js', [
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{pro}widget/calendar/calendar.js',
    'pro/widget/module'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro,
        _e = nej.e
        _v = nej.v,
        _funcname=['sendOrderToEport','sendWaybillToEport','sendGoodsDeclareToEport','queryOrderTax','queryPayInfoSendState','sendCancelOrderToEport','getWaybillNo','trackWaybill','sendOrderToWC','sendDeliverToWC'],
        _generatefname=['getSendOrderXml','getSendWaybillXml','getSendGoodsDeclareXml'],
        _sendText=['发送订单报文','发送运单报文','发送申报单报文'],
        _sendTypeValue=['IMPORTORDER','IMPORTBILL','PERSONAL_GOODS_DECLAR'];

    _p._$$OrderExtDetail = NEJ.C();
    _pro = _p._$$OrderExtDetail._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();

        this.__orderAry = _e._$getByClassName(document.body, 'ztag');   //订单相关需要修改的节点内容
        this.__logisticAry = _e._$getByClassName(document.body, 'ltag');
        this.__goodsAry = _e._$getByClassName(document.body, 'gtag');
        this.__importDate = _e._$get('setdate');
        var _btnary = _e._$getByClassName(document.body, 'btag');     //3个确认修改按钮

        _v._$addEvent(_btnary[0], 'click', this.__updateOrderInfo._$bind(this));
        _v._$addEvent(_btnary[1], 'click', this.__updateLogisticInfo._$bind(this));
        _v._$addEvent(_btnary[2], 'click', this.__updateGoodsInfoSnapshot._$bind(this));

        this.__calendar = haitao.bw._$$Calendar._$allocate({});
        _v._$addEvent(this.__importDate, 'click', function(_event){
            this.__calendar._$showCalendar(_event, this.__importDate);
        }._$bind(this));
        
        //订单操作
        var _ntmp = nej.e._$getByClassName(document.body,'item');
		for(var i=0,l=_ntmp.length; i<l; i++) {
			var _nodelist = _ntmp[i].children;
			nej.v._$addEvent(_nodelist[1], 'click', this.__doClickBtn._$bind(this,i));
		}
		
		//增加生成报文和发送报文的功能
		var _sdtmp = _e._$getByClassName(document.body, 'sdtag');
		this.__sdGenerateBtn1 = _sdtmp[0];
		this.__sdGenerateBtn2 = _sdtmp[1];
		this.__sdGenerateBtn3 = _sdtmp[2];
		this.__sdTextarea = _sdtmp[3];
		this.__sdSendBtn = _sdtmp[4];
		
		_v._$addEvent(this.__sdGenerateBtn1, 'click', this.__doGenerate._$bind(this,0));
		_v._$addEvent(this.__sdGenerateBtn2, 'click', this.__doGenerate._$bind(this,1));
		_v._$addEvent(this.__sdGenerateBtn3, 'click', this.__doGenerate._$bind(this,2));
		_v._$addEvent(this.__sdSendBtn, 'click', this.__doSendBtn._$bind(this,1));
		
		this.__getDeclareState = document.getElementById('checkDeclareState');
		_v._$addEvent(this.__getDeclareState, 'click', this.__doGetDeclareState._$bind(this));
    };
    
    _pro.__doGetDeclareState = function(_event) {
    	nej.j._$haitaoDWR('OrderExtMaintainBean', 'checkDeclareState', [this.__config.orderId], this.__cbMockDate._$bind(this, 0));
    };
    
    _pro.__doClickBtn = function(_st, _event) {
		//var _value = _valueElem.value||'';
		nej.j._$haitaoDWR('OrderExtMaintainBean', _funcname[_st], [this.__config.orderId], this.__cbMockDate._$bind(this, _st));
	};
	
	_pro.__cbMockDate = function(_st, _data) {
		alert(_data||'未知错误');
	};
	
	
    _pro.__updateOrderInfo = function(_event) {
        _v._$stop(_event);

        var i=0, l = this.__orderAry.length, _isInt = false, _elem, _key='', _value, _obj={};
        for(; i<l; i++) {
            _elem = this.__orderAry[i];
            _key = _elem.name;
            _value = _elem.value;
            if(_elem.type === 'radio') {    //如果是单选框则在这里单独判断
                if(_elem.checked === true) {
                    _obj[_key] = parseInt(_value);
                }
                continue;
            }

            if(_elem.getAttribute('data-int') === 'true') {     //现在只有进口日期需要转成数字
                _value = parseFloat(_value);
            }

            _obj[_key] = _value;
        }
        _obj['orderId'] = this.__config.orderId;
        // _obj['importDate'] = this.__calendar.__parseDate(this.__importDate.value).getTime();
        nej.j._$haitaoDWR('OrderExtMaintainBean', 'updateOrderExt', [_obj], this.__cbUpdateOrder._$bind(this));
    };

    _pro.__cbUpdateOrder = function(_data) {
        alert(_data);
    };

    _pro.__updateLogisticInfo = function(_event) {
        _v._$stop(_event);

        var i=0, l=this.__logisticAry.length, _elem, _key='', _value, _obj={};
        for(; i<l; i++) {
            _elem = this.__logisticAry[i];
            _key = _elem.name;
            _value = _elem.value;

            _obj[_key] = _value;
        }
        _obj['orderId'] = this.__config.orderId;
        nej.j._$haitaoDWR('OrderExtMaintainBean', 'updateLogisticInfo', [_obj], this.__cbUpdateOrder._$bind(this));
    };

    _pro.__updateGoodsInfoSnapshot = function(_event) {
        _v._$stop(_event);

        var i=0, l=this.__goodsAry.length, _inputs, _elem, _key='', _value, _obj={}, _ary=[];

        for(; i<l; i++) {
            _inputs = this.__goodsAry[i].getElementsByTagName('input');
            _obj = {};

            for(var m=0,n=_inputs.length; m<n; m++) {
                _elem = _inputs[m];
                _key = _elem.name;
                _value = _elem.value;

                if(_elem.getAttribute('data-int') === 'true') {
                    _value = parseFloat(_value);
                    if(isNaN(_value)) {
                        alert(_key+': 必须是数字');
                        return;
                    }
                }
                _obj[_key] = _value;
            }
            _obj['id'] = parseInt(this.__goodsAry[i].getAttribute('data-id'));
            _ary[i] = _obj;
        }

        nej.j._$haitaoDWR('OrderExtMaintainBean', 'updateGoodsInfoSnapshots', [_ary], this.__cbUpdateOrder._$bind(this));
    };
    
    //生成报文发送报文相关dwr
    _pro.__doGenerate = function(_index, _event) {
    	nej.j._$haitaoDWR('OrderExtMaintainBean', _generatefname[_index], [this.__config.orderId], this.__cbGenerate._$bind(this, _index));
    };
    
    _pro.__cbGenerate = function(_index, _data) {
    	this.__generateBtnIndex = _index;
    	this.__sdSendBtn.innerText = _sendText[_index];
    	this.__sdTextarea.value = _data;
    };
    
    _pro.__doSendBtn = function(_event) {
    	nej.j._$haitaoDWR('OrderExtMaintainBean', 'sendXmlToEport', [this.__sdTextarea.value||'', _sendTypeValue[this.__generateBtnIndex], this.__config.orderId], this.__cbMockDate._$bind(this, null));
    };

    new _p._$$OrderExtDetail();
});
