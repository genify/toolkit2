NEJ.define(['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}widget/pager/pagelist.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/calendar/calendar.js'],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proPItem,
		_e = nej.e,
		_v = nej.v;
	
	_p._$$OrderList = NEJ.C();
	_pro = _p._$$OrderList._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		this.__searchBox = _e._$get('searchbox');
 		this.__selectionAry = this.__searchBox.getElementsByTagName('select');

        this.__userName = _e._$get('username');
        this.__userOrderId = _e._$get('orderid');
        this.__phone = _e._$get('phone');
        this.__purchaserAddress = _e._$get('purchaserAddress');
        this.__mainGoodsName = _e._$get('mainGoodsName');
 		this.__startTime = _e._$get('starttime');
 		this.__endTime = _e._$get('endtime');
 		this.__searchBtn = _e._$get('btn');

 		this.__box = _e._$get('box');
 		this.__pager = _e._$get('pager');

 		this.__checkAllBox = _e._$get('checkAll');
 		this.__verifyPass = _e._$get('passverify');
 		this.__verifyFailed = _e._$get('failedverify');
 		this.__closeOrders = _e._$get('closeOrder');
 		
 		nej.v._$addEvent(this.__searchBtn, 'click', this.__getCount._$bind(this));

 		nej.v._$addEvent(this.__checkAllBox, 'click', this.__setAllChecked._$bind(this));
 		nej.v._$addEvent(this.__verifyPass, 'click', this.__doUpdateState._$bind(this, 1));
 		nej.v._$addEvent(this.__verifyFailed, 'click', this.__doUpdateState._$bind(this, 2));
 		nej.v._$addEvent(this.__closeOrders, 'click', this.__doCloseOrders._$bind(this));

 		this.__lopts = {
 	 			limit: 50,
 	 			parent: this.__box,
 	 			pager: {parent: this.__pager},
 	 			item: {klass: _p._$$Item},
 	 			cache: {
 	 				key: 'orderlist',
 	 				lkey: 'orderlist',
 	 				beanName: 'OrderExtMaintainBean',
 	 				funcName: 'searchOrderExtForVerify',
 	 				clear: true,
 	 				klass: _p._$$CacheStorage
 	 			},
                onafterlistrender: this.__resetAllChecked._$bind(this)
 	 		};
 		
 		this.__getCount();
 	};

 	_pro.__getCount = function(){
 		var _param = this.__getSearchParam(1,0);
 		nej.j._$haitaoDWR('OrderExtMaintainBean', 'searchOrderExtForVerify', _param, this.__cbGetCount.bind(this,_param));
 	};

 	_pro.__cbGetCount = function(_param, _dt) {
 		if(_dt.code == 200) {
 			_param[0] = 50;
 			this.__doSearch(_param, _dt.result.total);
 		}else{
 			alert('搜索失败，请重试')
 		}
 	};
 	
 	_pro.__doSearch = function(_param,_count) {
 		this.__lopts.cache.param = _param;
 		this.__lopts.cache.total = _count;
		if (!!this.__listModule) {
			this.__listModule._$recycle();
			this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
		} else {
			this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
		}
		this.__cache = this.__listModule.__cache;

        this.__resetAllChecked();
 	};

 	_pro.__getSearchParam = function(_limit,_offset) {
 		var param = [_limit,_offset,
 					 parseInt(this.__selectionAry[0].value),this.__selectionAry[1].value,parseInt(this.__selectionAry[2].value),
 					 parseInt(this.__selectionAry[3].value),parseInt(this.__selectionAry[4].value),
                     this.__userOrderId.value, this.__userName.value,this.__phone.value,this.__purchaserAddress.value,this.__mainGoodsName.value];

        return param;
 	}
 	
 	_pro.__cbResetStatus = function(_data) {
 		if(!!_data) {
 			alert('操作成功,请手动刷新页面');
 		} else {
 			alert('操作失败');
 		}
 	};

 	_pro.__getCheckedIds = function() {
 		var _checkboxs = nej.e._$getByClassName(document.body,'subcheck'),
 			_idAry = [];
 		for(var i=0,l=_checkboxs.length; i<l; i++) {
 			if(_checkboxs[i].checked == true) {
				_idAry.push(_checkboxs[i].getAttribute('data-id'));
 			}
 		}

 		return _idAry;
 	};

 	_pro.__setAllChecked = function(_event) {
 		var _checkboxs = nej.e._$getByClassName(document.body,'subcheck'), _type;
 		if(this.__checkAllBox.checked == true) {
 			_type = true;
 		} else {
 			_type = false;
 		}

 		this.__checkAllBox.checked = _type;
 		for(var i=0,l=_checkboxs.length; i<l; i++) {
 			_checkboxs[i].checked = _type;
 		}
 	};

    _pro.__resetAllChecked = function() {
        this.__checkAllBox.checked = false;
        this.__setAllChecked();
    };

 	_pro.__doUpdateState = function(_type, _event) {
 		nej.v._$stop(_event);
 		var _ids = this.__getCheckedIds();

 		if(_type == 2) {
 			if(window.confirm('确定要设置【审核不通过】吗？')){
				nej.j._$haitaoDWR('OrderExtMaintainBean', 'updateOrderVerifyStatePassed', [_ids,_type], this.__cbResetStatus._$bind(this));
			}
 		} else {
 			nej.j._$haitaoDWR('OrderExtMaintainBean', 'updateOrderVerifyStatePassed', [_ids,_type], this.__cbResetStatus._$bind(this));
 		}
 		
 	};

 	_pro.__doCloseOrders = function(_event) {
		nej.v._$stop(_event);
 		var _ids = this.__getCheckedIds();
 		if(window.confirm('确定要【关闭订单】吗？')){
			nej.j._$haitaoDWR('OrderExtMaintainBean', 'cancelOrder', [_ids], function(_data){alert(_data)}._$bind(this));
		}
 		// nej.j._$haitaoDWR('OrderExtMaintainBean', 'cancelOrder', [_ids], function(_data){alert(_data)}._$bind(this));
 	};
 	
	_p._$$CacheStorage = NEJ.C();
 	_proCache = _p._$$CacheStorage._$extend(nej.ut._$$ListCache);
 	_proCache.__reset = function(_options) {
		this.__super(_options);
		
		if(!!_options.beanName){
			this.__beanName = _options.beanName;
			this.__funcName = _options.funcName;
			this.__param = _options.param || [];
			this._$addEvent('doloadlist', this.__dogetList._$bind(this));
		}
	};
	
	_proCache.__dogetList = function(_options) {
		var _callback = function(_list) {
	    	_options.onload(_list.result.list);
		}
		this.__param[1] = _options.offset;
		nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
	};
	
 	/**
 	 * 关注用户Item
 	 * */
 	_p._$$Item = NEJ.C();
 	_proPItem = _p._$$Item._$extend(nej.ui._$$ListItem);
 	
 	_proPItem.__init = function(_options){
 		this.__super();
 		var _ntmp = nej.e._$getByClassName(this.__body,'xtag'),i=0;
 		this.__checkbox = _ntmp[i++];
 		this.__orderId = _ntmp[i++];
 		this.__purchaserName = _ntmp[i++];
 		this.__payTime = _ntmp[i++];
 		this.__importType = _ntmp[i++];
 		this.__goodsName = _ntmp[i++];
 		this.__verifyState = _ntmp[i++];
 		this.__suspectedType = _ntmp[i++];
 		this.__url = _ntmp[i++];
 		this.__checkStatus = _ntmp[i++];

 		nej.v._$addEvent(this.__checkStatus, 'click', this.__verifyPassOne._$bind(this));
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
                <td><label><input class="subcheck xtag" type="checkbox" /> <span class="xtag" style="word-break:break-all;"></span></label></td>\
                <td class="xtag">fgdkg</td>\
                <td class="xtag">1970-01-01</td>\
                <td class="xtag"></td>\
                <td class="xtag"></td>\
 				<td class="xtag">审核状态</td>\
 				<td class="xtag">嫌疑类型</td>\
                <td>\
                    <a target="_blank" href="" class="w-btn w-btn-blue icf-pencil xtag">查看</a>\
                    <a target="_blank" href="" class="w-btn w-btn-blue icf-pencil xtag">审核通过</a>\
                </td>');
 	};
 	
 	_proPItem.__doRefresh = function(_data) {
 		this.__checkbox.checked = false;
 		this.__checkbox.setAttribute('data-id', _data.orderId);
 		this.__orderId.innerText = _data.orderId;
 		this.__purchaserName.innerText = _data.purchaserName;
 		this.__payTime.innerText = nej.u._$format(_data.payTime, 'yyyy-MM-dd HH:mm:ss');
 		this.__importType.innerHTML = _data.importTypeString+'<br>优惠券金额：'+_data.couponAmount;
 		this.__goodsName.innerHTML = nej.u._$escape(_data.mainGoodsName)+'<br>电话：'+_data.purchaserTel+'<br>地址：'+nej.u._$escape(_data.purchaserAddress);
        this.__verifyState.innerText = _data.verifyStateString||'';
        this.__suspectedType.innerText = _data.suspectedTypeString;
 		this.__url.href = '/backend/orderVerfiy/detail?orderId='+_data.orderId;
 	};

 	_proPItem.__verifyPassOne = function(_event) {
 		nej.v._$stop(_event);
 		nej.j._$haitaoDWR('OrderExtMaintainBean', 'updateOrderVerifyStatePassed', [[this.__data.orderId],1], this.__cbResetStatusOne._$bind(this));
 	};

 	_proPItem.__cbResetStatusOne = function(_data) {
 		if(!!_data) {
 			alert('操作成功,请手动刷新页面');
 		} else {
 			alert('操作失败');
 		}
 	}
 	
 	new _p._$$OrderList();
	
});