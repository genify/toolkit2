NEJ.define('{pro}module/psinventory/list.js',
    [
        '{lib}util/event.js',
        '{lib}util/list/module.pager.js',
        '{pro}widget/window/confirm.js',
        '{lib}util/cache/list.js',
        '{lib}util/ajax/dwr.js',
        '{pro}widget/calendar/calendar.js',
        '{pro}widget/window/warningWin.js',
        'pro/widget/module'
    ],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proPItem,
		_tkey1 = nej.e._$addHtmlTemplate('\
			<td rowspan="${item.rowspan|default:1}" title="${item.goodsId|default:""}">${item.goodsId|default:""}</td>\
			<td rowspan="${item.rowspan|default:1}" title="${item.goodsName|default:""|escape}">${item.goodsName|default:""|escape}</td>\
			<td rowspan="${item.rowspan|default:1}" title="${item.barcode|default:""}">${item.barcode|default:""}</td>\
			<td title="${item.storageName|default:""|escape}">${item.storageName|default:""|escape}</td>\
			<td title="${item.importType|default:""}">${item.importType|default:""}</td>\
			<td title="${item.skuName|default:""}">${item.skuName|default:""}</td>\
			<td title="${item.productSkuCode|default:""}"><a target="_blank" class="xtag" href="/backend/invoicing/checkSkuInventory?skuId=${item.skuId|default:""}&goodsName=${item.goodsName|default:""|escape}">${item.productSkuCode|default:""}</a><span class="skucodedit" onclick="haitao.g.skucodedit(this,${item.goodsId|default:""},\'${item.skuId|default:""}\',\'${item.productSkuCode|default:""}\')">[编辑]</span></td>\
			<td title="${item.countInMM|default:""}" class="totalCountInMM">${item.countInMM|default:0}</td>\
			<td title="${item.countInBackend|default:""}" class="totalcountInBackend" >${item.countInBackend|default:0}</td>\
			<td title="${item.goodCountInBackend|default:""}" class="totalgoodCountInBackend">${item.goodCountInBackend|default:0}</td>\
			<td title="${item.badCountInBackend|default:""}" class="totalbadCountInBackend">${item.badCountInBackend|default:0}</td>\
			<td title="${item.countInStock|default:""}" class="totalcountInStock">${item.countInStock|default:0}</td>\
			<td title="${item.goodCountInStock|default:""}" class="totalgoodCountInStock">${item.goodCountInStock|default:0}</td>\
			<td title="${item.badCountInStock|default:""}" class="totalbadCountInStock">${item.badCountInStock|default:0}</td>\
			<td title="${item.lockedCountInStock|default:""}" class="totallockedCountInStock">${item.lockedCountInStock|default:0}</td>\
			<td title="${item.availableCountInStock|default:""}" class="totalavailableCountInStock">${item.availableCountInStock|default:0}</td>\
			<td title="${item.totalStockOutInBackend|default:""}" class="totalTotalStockOutInBackend">${item.totalStockOutInBackend|default:0}</td>\
			<td title="${item.weight|default:""}">${item.weight|default:0}</td>\
			<td title="${item.cost|default:""}">${item.cost|default:0}</td>\
			'),
		_tkey2 = nej.e._$addHtmlTemplate('\
			<td title="${item.storageName|default:""|escape}">${item.storageName|default:""|escape}</td>\
			<td title="${item.importType|default:""}">${item.importType|default:""}</td>\
			<td title="${item.skuName|default:""}">${item.skuName|default:""}</td>\
			<td title="${item.productSkuCode|default:""}"><a target="_blank" class="xtag" href="/backend/invoicing/checkSkuInventory?skuId=${item.skuId|default:""}&goodsName=${item.goodsName|default:""|escape}">${item.productSkuCode|default:""}</a><span class="skucodedit" onclick="haitao.g.skucodedit(this,${item.goodsId|default:""},\'${item.skuId|default:""}\',\'${item.productSkuCode|default:""}\')">[编辑]</span></td>\
			<td title="${item.countInMM|default:""}" class="totalCountInMM">${item.countInMM|default:0}</td>\
			<td stockcount="${item.countInStock|default:""}" title="${item.countInBackend|default:""}" class="totalcountInBackend">${item.countInBackend|default:0}</td>\
			<td title="${item.goodCountInBackend|default:""}" class="totalgoodCountInBackend">${item.goodCountInBackend|default:0}</td>\
			<td title="${item.badCountInBackend|default:""}" class="totalbadCountInBackend">${item.badCountInBackend|default:0}</td>\
			<td title="${item.countInStock|default:""}" class="totalcountInStock">${item.countInStock|default:0}</td>\
			<td title="${item.goodCountInStock|default:""}" class="totalgoodCountInStock">${item.goodCountInStock|default:0}</td>\
			<td title="${item.badCountInStock|default:""}" class="totalbadCountInStock">${item.badCountInStock|default:0}</td>\
			<td title="${item.lockedCountInStock|default:""}" class="totallockedCountInStock">${item.lockedCountInStock|default:0}</td>\
			<td title="${item.availableCountInStock|default:""}" class="totalavailableCountInStock">${item.availableCountInStock|default:0}</td>\
			<td title="${item.totalStockOutInBackend|default:""}" class="totalTotalStockOutInBackend">${item.totalStockOutInBackend|default:0}</td>\
			<td title="${item.weight|default:""}">${item.weight|default:0}</td>\
			<td title="${item.cost|default:""}">${item.cost|default:0}</td>\
			');
	
	_p._$$Storage = NEJ.C();
	_pro = _p._$$Storage._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
 		this.__storage = _ntmp[i++];
 		this.__crossWay = _ntmp[i++];
 		this.__type = _ntmp[i++];
 		this.__input = _ntmp[i++];
 		this.__searchBtn = _ntmp[i++];
        var _exportBtn = _ntmp[i++];
		var _exportNosaleBtn = _ntmp[i++];
		var _exportSpeBtn = _ntmp[i++];//导出上传的Excel中指定的库存
 		this.__wrap = _ntmp[i++];
 		this.__box = _ntmp[i++];
 		this.__pager = _ntmp[i++];
 		
 		nej.v._$addEvent(this.__searchBtn, 'click', this.__getCount._$bind(this));
        nej.v._$addEvent(_exportBtn, 'click', this.__exportClick._$bind(this));
		nej.v._$addEvent(_exportNosaleBtn, 'click', this.__exportNosaleClick._$bind(this));
		nej.v._$addEvent(_exportSpeBtn, 'click', this.__onImportData._$bind(this));

 		this.__lopts = {
 	 			limit: 20,		//这个页面的dwr请求没有翻页，所以这里暂时设置成500来获取所有的内容
 	 			parent: this.__box,
 	 			pager: {parent: this.__pager, klass: haitao.bw._$$NoNumPager},
 	 			item: {klass: _p._$$Item},
 	 			cache: {
 	 				key: 'statistic',
 	 				lkey: 'statistic',
 	 				beanName: 'InvoicingBean',
 	 				funcName: 'queryInventory',
 	 				clear: true,
 	 				klass: _p._$$CacheStorage
 	 			},
 	 			onafterlistrender: this.__setTotal._$bind(this)
 	 		};
 	
 		this.__getCount();

 		var g = NEJ.P('haitao.g');
 		g.skucodedit = this.__skucodedit._$bind(this);
 	};

 	_pro.__skucodedit = function(_target, _goodsId, _skuId, _skuCode) {
 		var _dialog = haitao.bw._$$WarningWindow._$allocate({
            title: "修改料号",
            parent: document.body,
            content: '<div style="min-width:320px;padding:20px;font-size:16px;line-height:20px;">\
                        <label>料号</label><input class="codeinput" style="padding:0 5px;margin-left:15px;" value="'+_skuCode+'" />\
                      </div>',
            hideOnok: false,
            mask: 'w-winmask',
            onok: function(_node){
                var _value = nej.e._$getByClassName(_node, 'codeinput')[0].value;
                if(!_value) {
                	alert('请输入料号')
                	return;
                }
                nej.j._$haitaoDWR(
                    'InvoicingBean',
                    'updateProductSkuCode',
                    [_skuId,_value],
                    function (_res) {
                    	if(!!_res) {
                        	location.reload();
                    	} else {
                    		alert('操作失败请重试')
                    	}
                    }
                );
                // _dialog._$hide();
            }
        });
        _dialog._$show();
 	};

 	_pro.__setTotal = function() {
 		var _obj = {}, _totalcountInBackend = 0, _totalcountInStock = 0, _totallockedCountInStock = 0, _totalavailableCountInStock = 0, _totalgoodCountInBackend = 0,
 			_totalgoodCountInStock = 0, _totalbadCountInBackend = 0, _totalbadCountInStock = 0, _totalCountInMM = 0, _totalTotalStockOutInBackend = 0,
            _totalInventoryWorth = 0;

        //库存货值统计
        //nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalInventoryWorth'), function(_item, _index) {
        //    if(!!_item.innerText) {
        //        _totalInventoryWorth += parseFloat(_item.innerText);
        //    }
        //});
		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalCountInMM'), function(_item, _index) {
			if(!!_item.innerText) {
				_totalCountInMM += parseInt(_item.innerText);
			}
		});
		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalcountInBackend'), function(_item, _index) {
 			if(!!_item.innerText) {
	 			_totalcountInBackend += parseInt(_item.innerText);
 			}
            //var _stockItem = nej.e._$getSibling(_item);
            //var _preStockItem = nej.e._$getSibling(_item, {backward:true});

            //// 库存！=后台库存 高亮  add by zmm
            //var _count1 = nej.e._$attr(_item, 'title');
            //var _count2 = nej.e._$attr(_stockItem, 'title');
            //var _count3 = nej.e._$attr(_preStockItem, 'title');
            //if (_count3=='') {
            //    nej.e._$addClassName(_preStockItem, 'bgc-grey');
            //}
            //if (_count1=='' &&  _count2=='') {
            //    nej.e._$addClassName(_item, 'bgc-grey');
            //    nej.e._$addClassName(_stockItem, 'bgc-grey');
            //} else if (parseInt(_count1) != parseInt(_count2)) {
            //    nej.e._$addClassName(_item, 'bgc-yellow');
            //    nej.e._$addClassName(_stockItem, 'bgc-yellow');
            //}
            //// 值为负时  高亮红色
            //if (parseInt(_count1) < 0) {
            //    nej.e._$addClassName(_item, 'bgc-red');
            //}
            //if (parseInt(_count2) < 0) {
            //    nej.e._$addClassName(_stockItem, 'bgc-red');
            //}
            //if (parseInt(_count3) < 0) {
            //    nej.e._$addClassName(_preStockItem, 'bgc-red');
            //}

 		});
 		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalcountInStock'), function(_item, _index) {
 			if(!!_item.innerText) {
 				_totalcountInStock += parseInt(_item.innerText);
 			}
 		});
 		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totallockedCountInStock'), function(_item, _index) {
 			if(!!_item.innerText) {
 				_totallockedCountInStock += parseInt(_item.innerText);
 			}
 		});
		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalavailableCountInStock'), function(_item, _index) {
			if(!!_item.innerText) {
				_totalavailableCountInStock += parseInt(_item.innerText);
			}
		});
		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalgoodCountInBackend'), function(_item, _index) {
 			if(!!_item.innerText) {
 				_totalgoodCountInBackend += parseInt(_item.innerText);
 			}
 		});
 		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalgoodCountInStock'), function(_item, _index) {
 			if(!!_item.innerText) {
 				_totalgoodCountInStock += parseInt(_item.innerText);
 			}
        });
 		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalbadCountInBackend'), function(_item, _index) {
 			if(!!_item.innerText) {
 				_totalbadCountInBackend += parseInt(_item.innerText);
 			}
 		});
 		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalbadCountInStock'), function(_item, _index) {
 			if(!!_item.innerText) {
 				_totalbadCountInStock += parseInt(_item.innerText);
                // 次品库存与次品后台数不一致，高亮
                //var _backendItem = nej.e._$getSibling(_item, {backward:true}); //后台次品库存节点
                //var _count1 = nej.e._$attr(_item, 'title');
                //var _count2 = nej.e._$attr(_backendItem, 'title');
                //if (_count1 != _count2) {
                //    nej.e._$addClassName(_item, 'bgc-red');
                //    nej.e._$addClassName(_backendItem, 'bgc-red');
                //}
 			}
 		});
		nej.u._$forEach(nej.e._$getByClassName(this.__box, 'totalTotalStockOutInBackend'), function(_item, _index) {
			if(!!_item.innerText) {
				_totalTotalStockOutInBackend += parseInt(_item.innerText);
			}
		});

		var _tr = document.createElement('tr');
 		_tr.innerHTML = nej.e._$getHtmlTemplate(_tkey1, {item: {goodsId:'统计', countInMM:_totalCountInMM, countInBackend:_totalcountInBackend, countInStock:_totalcountInStock, lockedCountInStock:_totallockedCountInStock, availableCountInStock:_totalavailableCountInStock, goodCountInBackend:_totalgoodCountInBackend, goodCountInStock:_totalgoodCountInStock, badCountInBackend:_totalbadCountInBackend, badCountInStock:_totalbadCountInStock, totalStockOutInBackend:_totalTotalStockOutInBackend, weight:" ", cost:" "}});

 		this.__box.appendChild(_tr);

 	};
    /**
     * 点击导出报表
     * @private
     */
    _pro.__exportClick = function() {
        var _dialog = haitao.bw._$$WarningWindow._$allocate({
            title: "提示",
            parent: document.body,
            content: '<div style="min-width: 400px; padding: 20px;">\
                        <p style="margin-bottom: 10px">生成报表须一些时间，请输入你的邮箱地址，稍后发送邮件</p>\
                        <input type="text" placeholder="请输入邮箱地址" class="expemail zwarn"/>\
                        <span class="errorInfo zwarn"></span>\
                      </div>',
            hideOnok: false,
            mask: 'w-winmask',
            onok: function(_node){
                var _nodes = nej.e._$getByClassName(_node, 'zwarn'),
                    _emailNode = _nodes[0],
                    _errorNode = _nodes[1];

                var _email = _emailNode.value;
                var _res = eval("/^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/").test(_emailNode.value);
                if (!_res) {
                    _errorNode.innerHTML="邮箱地址有问题呀 -。=";
                    return;
                }
                nej.j._$haitaoDWR(
                    'InvoicingBean',
                    'sendInventoryExcelMail',
                    [_email],
                    function (_res) {
                        console.log("点击导出成功");
                        if(_res.length>0){
                        	location.href=_res;
                        }else{
                        	alert("暂时未生成数据稍后发送实时库存至邮箱");
                        }
                    }
                );
                _dialog._$hide();
            }
        });
        _dialog._$show();
    };
    
	/**
	 * 点击导出最近N天一直未销售商品的库存报表
	 * @private
	 */
	_pro.__exportNosaleClick = function() {
		var _dialog = haitao.bw._$$WarningWindow._$allocate({
			title: "提示",
			parent: document.body,
			content: '<div style="min-width: 400px; padding: 20px;">\
                        <p style="margin-bottom: 10px">生成报表须一些时间，请输入你的邮箱地址，稍后发送邮件</p>\
                        <input type="text" placeholder="请输入邮箱地址" class="expemail zwarn"/>\
                        <span class="errorInfo zwarn"></span>\
                      </div>',
			hideOnok: false,
			mask: 'w-winmask',
			onok: function(_node){
				var _nodes = nej.e._$getByClassName(_node, 'zwarn'),
					_emailNode = _nodes[0],
					_errorNode = _nodes[1];

				var _email = _emailNode.value;
				var _res = eval("/^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/").test(_emailNode.value);
				if (!_res) {
					_errorNode.innerHTML="邮箱地址有问题呀 -。=";
					return;
				}
				nej.j._$haitaoDWR(
					'InvoicingBean',
					'sendNosaleInventoryExcelMail',
					[_email],
					function (_res) {
						console.log("点击导出成功");
					}
				);
				_dialog._$hide();
			}
		});
		_dialog._$show();
	};
	
    /**
     * 上传excel格式
     * @private
     */
    _pro.__onImportData = function(_event) {
        if(!this.__importDialog) {
            this.__importDialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                title: '导入数据',
                align: 'middle middle',
                draggable: true,
                content:'<div style="width:400px;height:70px;"><form enctype="multipart/form-data" class="itag" action="/backend/invoicing/stock/statistic/upload" target="_blank" method="post"><input class="itag" name="file" type="file" /><p class="itag" style="display:none;color:#f80000;"></p></form></div>',
                hideOnok: false,
                initContent: function() {

                },
                onok: function(_dialogBody){
                    var _elements = nej.e._$getByClassName(_dialogBody,'itag');
                    var _form = _elements[0],
                        _file = _elements[1],
                        _err = _elements[2];
                    if(!_file.value) {
                        _err.innerText = '请选择上传文件';
                        _err.style.display = '';
                        return;
                    }
                    if(_file.value.indexOf('xls') < 0 && _file.value.indexOf('xlsx')) {
                    	_err.innerText = '请选择上传Excel文件';
                        _err.style.display = '';
                        return;
                    }
                    _err.style.display = 'none';
                    _form.submit();
                    this.__importDialog._$hide();
                }._$bind(this)
            });
        }
        this.__importDialog._$show();
    };
    
 	_pro.__getCount = function() {
 		var _param = [parseInt(this.__storage.value),parseInt(this.__crossWay.value),-1,"",""],
 			_type = parseInt(this.__type.value),
 			_value = this.__input.value;
 		
 		if(!!_value) {
 			if(_type === 2) {
 				if(isNaN(_value)) {
 					alert('输入正确的商品ID');
 					return;
 				} else {
 					_value = parseInt(_value);
 				}
 			}
 			
 			_param[_type] = _value;
 		}
 		
 		 nej.j._$haitaoDWR('InvoicingBean', 'queryInventoryCount', _param, this.__cbGetCount.bind(this,_param));
// 		this.__cbGetCount([-1,-1,-1], 97);	//TODO DEL 模拟数据
 	}
 	
 	_pro.__cbGetCount = function(_param, _data) {
 		if(!!_data && _data > 0) {
 			// this.__showTotal.innerHTML = '总记录' + _data + '条';
 			_param.push(20);	//塞入limit
 			_param.push(0);		//塞入offset
 			this.__doSearch(_param, _data);
 		} else {
 			alert('没有数据');
 			try{
 				this.__listModule._$recycle();
 			}catch(e){
 				
 			}
 		}
 	}
 	
 	_pro.__doSearch = function(_param, _count) {
 		this.__lopts.cache.param = _param;
 		this.__lopts.cache.total = _count;
		if (!!this.__listModule) {
			try{
				this.__listModule._$recycle();
				this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
			}catch(e){
				this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
			}
		} else {
			this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
		}
		this.__cache = this.__listModule.__cache;
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
			//由于后端传的可能不足limit，为了页码正确显示，这里填充空Object
			for(var i=0; i<20; i++) {
				if(!_list[i]) {
					_list.push({});
				}
			}
	    	_options.onload(_list);
		}
		this.__param[6] = _options.offset;
		nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
	};
	
 	/**
 	 * 关注用户Item
 	 * */
 	_p._$$Item = NEJ.C();
 	_proPItem = _p._$$Item._$extend(nej.ui._$$ListItem);
 	
 	_proPItem.__init = function(_options){
 		this.__super();
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('<tr></tr>');
 	};

 	_proPItem.__doRefresh = function(_data) {
 		//剔除在数据返回是添加的空Object
 		if(!_data.goodsId) {
 			this.__body.parentNode.removeChild(this.__body);
 			return;
 		}

 		var _list = {}, _list2 = {}, sku;
 		var _html = '';
 		for(var i=0, l=_data.skuList.length; i<l; i++) {
 			sku = _data.skuList[i];
 			if (i===0) {
 				sku.rowspan = l;
 				this.__body.innerHTML = nej.e._$getHtmlTemplate(_tkey1, {item: sku});
 			} else {
 				var _tr = document.createElement('tr');
 				_tr.innerHTML = nej.e._$getHtmlTemplate(_tkey2, {item: sku});
 				this.__parent.appendChild(_tr);
 			}
 		}
 	};
 	
 	new _p._$$Storage();
	
});
