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
 		this.__startTime = _e._$get('starttime');
 		this.__endTime = _e._$get('endtime');
 		this.__searchBtn = _e._$get('btn');

 		this.__box = _e._$get('box');
 		this.__pager = _e._$get('pager');

        this.__checkAllBox = _e._$get('checkAll');

 		// 重置状态
// 		this.__resetBtn = _e._$get('resetstatus');

        // 批量查询申报状态
		this.__batchCheckBtn = _e._$get('batchcheck');
        // 批量获取运单号
        this.__batchGetBillnoBtn = _e._$get('batchgetbillno');
        // 批量推送订单
        this.__batchSendOrderBtn = _e._$get('batchsendorder');
        // 批量推送运单
        this.__batchSendWaybillBtn = _e._$get('batchsendwaybill');
        // 批量推送支付确认
        //this.__batchSendPayConfirmBtn = _e._$get('batchsendpayconfirm');
        // 批量推送申报单
        this.__batchSendDeclareBtn = _e._$get('batchsenddeclare');
        // 批量推送订单到仓库
        this.__batchSendToWCBtn = _e._$get('batchsendtowc');
        // 批量设置订单为已出关
        this.__batchSetImportedBtn = _e._$get('batchsetimported');
        // 批量重置订单推送
        this.__batchResetOrderBtn = _e._$get('batchresetorder');
        // 批量重置运单推送
        this.__batchResetWaybillBtn = _e._$get('batchresetwaybill');
        // 批量重置申报单推送
        this.__batchResetDeclareBtn = _e._$get('batchresetdeclare');
        // 批量重置获取运单号
        this.__batchResetBillnoAcqBtn = _e._$get('batchresetbillnoacq');

        //nej.v._$addEvent(window, 'resize', this.__setWrapHeight._$bind(this));

        nej.v._$addEvent(this.__checkAllBox, 'click', this.__setAllChecked._$bind(this));

 		this.__calendar = haitao.bw._$$Calendar._$allocate({});
 		nej.v._$addEvent(this.__startTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__startTime);
 		}._$bind(this));
 		nej.v._$addEvent(this.__endTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__endTime);
 		}._$bind(this));
 		nej.v._$addEvent(this.__searchBtn, 'click', this.__getCount._$bind(this));
// 		nej.v._$addEvent(this.__resetBtn, 'click', this.__doReset._$bind(this));
        nej.v._$addEvent(this.__batchCheckBtn, 'click', this.__doBatchCheckStatus._$bind(this));
        nej.v._$addEvent(this.__batchGetBillnoBtn, 'click', this.__doBatchGetBillno._$bind(this));
        nej.v._$addEvent(this.__batchSendOrderBtn, 'click', this.__doBatchSendOrder._$bind(this));
        nej.v._$addEvent(this.__batchSendWaybillBtn, 'click', this.__doBatchSendWaybill._$bind(this));
        //nej.v._$addEvent(this.__batchSendPayConfirmBtn, 'click', this.__doBatchSendPayConfirm._$bind(this));
        nej.v._$addEvent(this.__batchSendDeclareBtn, 'click', this.__doBatchSendDeclare._$bind(this));
        nej.v._$addEvent(this.__batchSendToWCBtn, 'click', this.__doBatchSendToWC._$bind(this));
        nej.v._$addEvent(this.__batchSetImportedBtn, 'click', this.__doBatchSetImported._$bind(this));
        nej.v._$addEvent(this.__batchResetOrderBtn, 'click', this.__doBatchResetOrder._$bind(this));
        nej.v._$addEvent(this.__batchResetWaybillBtn, 'click', this.__doBatchResetWaybill._$bind(this));
        nej.v._$addEvent(this.__batchResetDeclareBtn, 'click', this.__doBatchResetDeclare._$bind(this));
        nej.v._$addEvent(this.__batchResetBillnoAcqBtn, 'click', this.__doBatchResetBillnoAcq._$bind(this));

 		this.__lopts = {
 	 			limit: 20,
 	 			parent: this.__box,
 	 			pager: {parent: this.__pager},
 	 			item: {klass: _p._$$Item},
 	 			cache: {
 	 				key: 'orderlist',
 	 				lkey: 'orderlist',
 	 				beanName: 'OrderExtMaintainBean',
 	 				funcName: 'searchOrderExt',
 	 				clear: true,
 	 				klass: _p._$$CacheStorage
 	 			},
 	 			onafterlistrender: this.__setWrapHeight._$bind(this)
 	 		};
 		
 		this.__getCount();
 	};
 	//页面resize时，修改列表内容的高度
 	_pro.__setWrapHeight = function() {
 		return;
 		if(!!this.__box.children && this.__box.children.length < 500) {
 			this.__pager.style.display = 'none';
 		} else {
 			this.__pager.style.display = 'block';
 		}
 		
		var _winHeight = document.documentElement.clientHeight,
			_beHeight = _winHeight - 220,
			_listHeight = this.__box.clientHeight;
		if(_listHeight >= _beHeight) {
			this.__wrap.style.height = _winHeight - 220 + 'px';
		}
 	};

 	_pro.__getCount = function(){
 		var _param = this.__getSearchParam(1,0);
 		nej.j._$haitaoDWR('OrderExtMaintainBean', 'searchOrderExt', _param, this.__cbGetCount.bind(this,_param));
 	};

    _pro.__getResetCount = function(_type, _typestr) {
        var _param = this.__getSearchParam(1,0);
        nej.j._$haitaoDWR('OrderExtMaintainBean', 'searchOrderExtCount', _param, this.__cbBatchReset.bind(this, _param, _type, _typestr));
    }

    _pro.__cbBatchReset = function(_param, _type, _typestr, _dt) {
        if (window.confirm('确定重置符合查询条件的 [' + _dt + '] 个订单的 [' + _typestr + '] 状态吗？')) {
            _param.push(_type);
            nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchResetStatesByQueryCondition', _param, this.__cbResetStatus._$bind(this));
        }
    }

 	_pro.__cbGetCount = function(_param, _dt) {
 		if(_dt.code == 200) {
 			_param[0] = 20;
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
 	};

 	_pro.__getSearchParam = function(_limit,_offset) {
 		var param = [_limit,_offset,
 					 parseInt(this.__selectionAry[0].value),this.__selectionAry[1].value,parseInt(this.__selectionAry[2].value),
 					 parseInt(this.__selectionAry[3].value),parseInt(this.__selectionAry[4].value),parseInt(this.__selectionAry[5].value),
 					 parseInt(this.__selectionAry[6].value),parseInt(this.__selectionAry[7].value),parseInt(this.__selectionAry[8].value),
                     parseInt(this.__selectionAry[9].value),parseInt(this.__selectionAry[10].value),parseInt(this.__selectionAry[11].value),
                     this.__startTime.value?this.__calendar.__parseDate(this.__startTime.value).getTime():-1,
 		             this.__endTime.value?this.__calendar.__parseDate(this.__endTime.value).getTime():-1,
                     this.__userOrderId.value, this.__userName.value,this.__phone.value,this.__purchaserAddress.value];

        return param;
 	}

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
 	
 	_pro.__doReset = function(_event) {
 		nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchResetFailedGoodsDeclareState', [], this.__cbResetStatus._$bind(this));
 	};
 	
 	_pro.__cbResetStatus = function(_data) {
 		alert(_data||'未知错误');
 	};

    _pro.__doBatchCheckStatus = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行查询申报状态操作吗？未完成申报或已取消的订单将会被跳过')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchCheckDeclareState', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        //} else {
        //    if (window.confirm('确定对所有订单、运单、申报单已推送、未取消且未出关的订单执行查询申报状态操作吗？')) {
        //        nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchCheckDeclareState', [_ids], this.__cbBatchCheckStatus._$bind(this));
        //    }
        }
    };

    _pro.__doBatchGetBillno = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行获取运单号操作吗？')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchGetWaybillNo', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        }
    };

    _pro.__doBatchSendOrder = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行推送订单流操作吗？')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchSendOrderToEport', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        }
    };

    _pro.__doBatchSendWaybill = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行推送运单流操作吗？')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchSendWaybillToEport', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        }
    };

    //_pro.__doBatchSendPayConfirm = function(_event) {
    //    nej.v._$stop(_event);
    //    var _ids = this.__getCheckedIds();
    //
    //    if(_ids.length > 0) {
    //        if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行推送支付确认操作吗？')) {
    //            nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchSendPayConfirmToEport', [_ids], this.__cbBatchCheckStatus._$bind(this));
    //        }
    //    }
    //};

    _pro.__doBatchSendDeclare = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行推送申报单操作吗？')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchSendGoodsDeclareToEport', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        }
    };

    _pro.__doBatchSendToWC = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行推送订单到仓库操作吗？')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchSendOrderToWC', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        }
    };

    _pro.__doBatchSetImported = function(_event) {
        nej.v._$stop(_event);
        var _ids = this.__getCheckedIds();

        if(_ids.length > 0) {
            if (window.confirm('确定对选中的 ['+_ids.length+'] 个订单执行设置为已出关操作吗？')) {
                nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchSetImported', [_ids], this.__cbBatchCheckStatus._$bind(this));
            }
        }
    };

    _pro.__doBatchResetOrder = function(_event) {
        nej.v._$stop(_event);
        this.__getResetCount('order', '订单推送');
        //if (window.confirm('确定重置符合查询条件的 [' + _count + '] 个订单的 [订单推送] 状态吗？')) {
        //    var _param = this.__getSearchParam(-1,-1);
        //    _param.push('order');
        //    nej.j._$haitaoDWR('OrderExtMaintainBean', 'batchResetStatesByQueryCondition', _param, this.__cbResetStatus._$bind(this));
        //}
    };

    _pro.__doBatchResetWaybill = function(_event) {
        nej.v._$stop(_event);
        this.__getResetCount('waybill', '运单推送');
    };

    _pro.__doBatchResetDeclare = function(_event) {
        nej.v._$stop(_event);
        this.__getResetCount('declare', '申报单推送');
    };

    _pro.__doBatchResetBillnoAcq = function(_event) {
        nej.v._$stop(_event);
        this.__getResetCount('billno', '获取运单号');
    };

    _pro.__cbBatchCheckStatus = function(_data) {
        alert(_data||'未知错误');
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
 		this.__billno = _ntmp[i++];
 		this.__payTime = _ntmp[i++];
 		this.__storage = _ntmp[i++];
 		this.__importType = _ntmp[i++];
 		this.__orderPacState = _ntmp[i++];
 		this.__waybillPacState = _ntmp[i++];
 		this.__goodsDeclareState = _ntmp[i++];
 		this.__stockState = _ntmp[i++];
 		this.__outState = _ntmp[i++];
 		this.__verifyState = _ntmp[i++];
 		this.__url = _ntmp[i++];
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
 		        <td><label><input class="subcheck xtag" type="checkbox" /> <span class="xtag" style="word-break:break-all;"></span></label></td>\
                <td class="xtag">fgdkg</td>\
                <td class="xtag">246</td>\
                <td class="xtag">1970-01-01</td>\
                <td class="xtag">仓库</td>\
                <td class="xtag">直邮</td>\
                <td class="xtag">未推送</td>\
                <td class="xtag">未推送</td>\
 				<td class="xtag">未推送</td>\
                <td class="xtag"></td>\
                <td class="xtag">未出关</td>\
 				<td class="xtag">审核状态</td>\
                <td>\
                    <a target="_blank" href="/backend/orderExtMaintain?orderId=2014111914ORDER16088057" class="w-btn w-btn-blue icf-pencil xtag">修改</a>\
                </td>');
 	};
 	
 	_proPItem.__doRefresh = function(_data) {
        this.__checkbox.checked = false;
        this.__checkbox.setAttribute('data-id', _data.orderId);
 		this.__orderId.innerText = _data.orderId;
 		this.__purchaserName.innerText = _data.purchaserName;
 		this.__billno.innerText = _data.billno;
 		this.__payTime.innerText = nej.u._$format(_data.payTime, 'yyyy-MM-dd HH:mm:ss');
 		this.__importType.innerText = _data.importTypeString;
        if (_data.orderPacStateValue!=0){
            this.__orderPacState.innerHTML = '<a target="_blank" href="/backend/orderExtMaintain/orderCallback?orderId=' + _data.orderId+'">' + _data.orderPacStateString||'' + '</a>';
        } else {
            this.__orderPacState.innerText = _data.orderPacStateString||'';
        }
        if (_data.waybillPacStateValue!=0) {
            this.__waybillPacState.innerHTML = '<a target="_blank" href="/backend/orderExtMaintain/waybillCallback?orderId=' + _data.orderId+'">' + _data.waybillPacStateString||'' + '</a>';
        } else {
            this.__waybillPacState.innerText = _data.waybillPacStateString||'';
        }
        //if (_data.payConfirmSendStateValue!=0) {
        //    this.__payConfirmSendState.innerHTML = '<a target="_blank" href="/backend/orderExtMaintain/payConfirmCallback?orderId=' + _data.orderId+'">' + _data.payConfirmSendStateString||'' + '</a>';
        //} else {
        //    this.__payConfirmSendState.innerText = _data.payConfirmSendStateString||'';
        //}
        if (_data.goodsDeclareStateValue!=0) {
            this.__goodsDeclareState.innerHTML = '<a target="_blank" href="/backend/orderExtMaintain/goodsDeclareCallback?orderId=' + _data.orderId+'">' + _data.goodsDeclareStateString||'' + '</a>';
        } else {
            this.__goodsDeclareState.innerText = _data.goodsDeclareStateString||'';
        }
        this.__outState.innerHTML = '<a target="_blank" href="/backend/orderExtMaintain/importCallback?orderId=' + _data.orderId+'">' + _data.outStateString||'' + '</a>';
        this.__verifyState.innerText = _data.verifyStateString||'';
        this.__storage.innerText = _data.storageName||'';
 		this.__stockState.innerText = _data.stockStateString||'';
 		this.__url.href = '/backend/orderExtMaintain?orderId='+_data.orderId;
 	};
 	
 	new _p._$$OrderList();
	
});