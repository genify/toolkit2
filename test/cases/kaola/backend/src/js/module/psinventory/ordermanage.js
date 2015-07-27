NEJ.define('{pro}module/psinventory/list.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/calendar/calendar.js'],
	function(){
		var _p = NEJ.P('haitao.bm'),
			_pro,
			_proPItem;

		_p._$$OManage = NEJ.C();
		_pro = _p._$$OManage._$extend(haitao.bw._$$MModule);

		_pro.__init = function() {
			this.__super();
			this.__setNode();
		};

		_pro.__setNode = function() {
			var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
			this.__gbd = _ntmp[i++];
			this.__storage = _ntmp[i++];
			this.__supplier = _ntmp[i++];
			this.__currencyType = _ntmp[i++];	//币种
			this.__state = _ntmp[i++];
			this.__guoji = _ntmp[i++];		//国际费用
			this.__zhuanguan = _ntmp[i++];	//转关费用
			this.__yongjin = _ntmp[i++];	//佣金费用
			this.__caiwu = _ntmp[i++];		//财务核对
			this.__caigou = _ntmp[i++];		//采购方式
			this.__shtext = _ntmp[i++];		//采购单号
			this.__contractNo = _ntmp[i++];		//合同编号
			this.__searchBtn = _ntmp[i++];		//搜索按钮
			this.__wrap = _ntmp[i++];
			this.__box = _ntmp[i++];		//包裹列表的节点
			this.__pageInfo = _ntmp[i++];
			this.__jump = _ntmp[i++];		//跳转页数输入框
			this.__go = _ntmp[i++];			//跳转的按钮
			this.__pager = _ntmp[i++];		//包裹控件翻页器的节点

			nej.v._$addEvent(this.__searchBtn, 'click', this.__getCount._$bind(this));
			nej.v._$addEvent(this.__go, 'click', this.__doPageJump._$bind(this));
			// nej.v._$addEvent(window, 'resize', this.__setWrapHeight._$bind(this));	
			//翻页控件传递的options
			this.__lopts = {
				limit: 20,
				parent: this.__box,
				pager: {parent: this.__pager},
				item: {
					klass: _p._$$Item,
					ondel: this.__doItemDel._$bind(this)
				},
				cache: {
					key: 'invoicing',
					lkey: 'invoicing',
					beanName: 'InvoicingBean',
					funcName: 'getPurchaseOrdersNew',
					clear: true,		//在控件销毁时，清楚cache里的数据缓存
					klass: _p._$$CacheOManage,
					cbDelItem: this.__cbDoDelItem._$bind(this),			//删除问题回调
				}
				// onafterlistrender: this.__setWrapHeight._$bind(this),
				// onafterpagershow: this.__afterpagershow._$bind(this),
				// onpagechange: this.__cbSetPageIndex._$bind(this)
			};
			//删除确认弹窗
			this.__delWindow = haitao.bw._$$Confirm._$allocate({
				parent: document.body,title: '提示',align: 'middle middle',draggable: true,
				c1: '删除提示',c2: '确认删除该条采购单',
				onok: this.__doDelDwr._$bind(this)
			});
			this.__delWindow._$hide();	//隐藏弹窗
			//默认显示搜索全部内容
			this.__getCount();
		};
		//页面resize时，修改列表内容的高度
		// _pro.__setWrapHeight = function() {
		// 	var _winHeight = document.documentElement.clientHeight,
		// 		_beHeight = _winHeight - 220,
		// 		_listHeight = this.__box.clientHeight;
		// 	if(_listHeight >= _beHeight) {
		// 		this.__wrap.style.height = _winHeight - 220 + 'px';
		// 	}
		// };

		_pro.__getCount = function(){
			var _text = this.__shtext.value;
			if(_text.replace(/\d*/ig, '').length > 0) {	//采购单只能是数字
				alert('采购单号请输入数字');
				return;
			}

			var _param = [parseInt(this.__supplier.value)||-1, 
						parseInt(this.__storage.value)||-1, parseInt(this.__shtext.value)||-1, 
						parseInt(this.__state.value), parseInt(this.__currencyType.value), 
						parseInt(this.__guoji.value),parseInt(this.__zhuanguan.value),
						parseInt(this.__yongjin.value),parseInt(this.__caiwu.value),
						parseInt(this.__caigou.value),
						this.__contractNo.value, this.__lopts.limit, 0];
			nej.j._$haitaoDWR('InvoicingBean', 'getPurchaseOrderCountNew', _param, this.__cbGetCount.bind(this,_param));

		}

		_pro.__cbGetCount = function(_param, _data) {
			if(!!_data && _data > 0) {
				this.__doSearch(_param, _data);
				if(_data <= 20) {
					this.__pageInfo.style.display = 'none';
				} else {
					this.__pageInfo.style.display = 'block';
				}
			}else{
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
					this.__listModule._$recycle();	//回收控件
					this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
				}catch(e){
					this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
				}
			} else {
				this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
			}
			this.__cache = this.__listModule.__cache;
		};
		//页面跳转
		_pro.__doPageJump = function(_event) {
			var _pageIndex = parseInt(this.__jump.value)||0;
			this.__listModule.__pager._$setIndex(_pageIndex);
		};
		//item删除回调
		_pro.__doItemDel = function(_index) {
			this.__delIndex = _index;
			this.__delWindow._$show();
		};

		_pro.__doDelDwr = function() {
			var _item = this.__listModule._$items()[this.__delIndex%20];
			var _data = _item.__data;
			var _calargs = {lkey:this.__lopts.cache.key, index:this.__delIndex};
			this.__cache._$delItem([_data.id], _calargs);
		};

		_pro.__cbDoDelItem = function(_type) {
			if(!!_type) {	//删除成功回调
				this.__listModule._$refresh();
			} else {
				alert('删除失败');
			}
		};

		_p._$$CacheOManage = NEJ.C();
		_proCache = _p._$$CacheOManage._$extend(nej.ut._$$ListCache);
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
				_options.onload(_list);
			}
			this.__param[12] = _options.offset;
			nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
		};

		_proCache._$delItem = function(_param, _cbp) {
			nej.j._$haitaoDWR('InvoicingBean', 'deletePurchaseOrder', _param, this.__delItemData._$bind(this,_cbp));
		};
		//删除请求返回后回调
		_proCache.__delItemData = function(_args, _data) {
			if (!!_data) {	//删除成功
				var _list = this._$getListInCache(_args.lkey);
				_list.splice(_args.index,1);
			}

			this._$dispatchEvent('cbDelItem', _data);
		};

		/**
		 * 关注用户Item
		 * */
		_p._$$Item = NEJ.C();
		_proPItem = _p._$$Item._$extend(nej.ui._$$ListItem);

		_proPItem.__init = function(_options){
			this.__super();
			var _ntmp = nej.e._$getByClassName(this.__body,'xtag'),i=0;
			this.__number = _ntmp[i++];
			this.__time = _ntmp[i++];
			this.__storage = _ntmp[i++];
			this.__supplier = _ntmp[i++];
			this.__contractNo = _ntmp[i++];
			this.__currencyType = _ntmp[i++];
			this.__sum = _ntmp[i++];
			this.__count = _ntmp[i++];
			this.__state = _ntmp[i++];
			this.__link = _ntmp[i++];
			this.__del = _ntmp[i++];

			nej.v._$addEvent(this.__del, 'click', this.__delComplain._$bind(this));
		};

		_proPItem.__initNodeTemplate = function() {
			this.__seed_html = nej.e._$addNodeTemplate('\
				<td class="xtag" title="采购单号">1234567</td>\
				<td class="xtag" title="预计入库时间">2014-33-44</td>\
				<td class="xtag" title="入库仓库">地面</td>\
				<td class="xtag" title="采购商">天空</td>\
				<td class="xtag" title="合同编号">天空</td>\
				<td class="xtag" title="币种">天空</td>\
				<td class="xtag" title="采购金额">2222</td>\
 				<td class="xtag" title="采购数量">111</td>\
				<td class="xtag" title="处理状态">未处理</td>\
				<td title="操作">\
					<a class="xtag" href="#" target="_blank">查看详情</a>\
					<a class="xtag" href="#">&nbsp;&nbsp;删除</a>\
				</td>');
		};

		_proPItem.__doRefresh = function(_data) {
			this.__number.innerText = _data.id||'';
			this.__time.innerText = nej.u._$format(_data.expectedTime, 'yyyy-MM-dd');
			this.__storage.innerText = _data.storageName||'';
			this.__supplier.innerText = _data.supplierName||'';
			this.__contractNo.innerText = _data.contractNo||'';
			this.__currencyType.innerText = _data.currencyName||'';
			this.__sum.innerText = _data.purchaseAmount||0;
			this.__count.innerText = _data.purchaseCount||0;
			this.__state.innerText = _data.statusName;
			this.__link.href = '/backend/invoicing/order?id='+_data.id||'';
			if (_data.statusValue == 0 || _data.statusValue == 1) {	//只有编辑中和审核驳回2种情况可以删除
				this.__del.style.display = '';
			} else {
				this.__del.style.display = 'none';
			}
			return;
		};

		_proPItem.__delComplain = function(_event) {
			nej.v._$stop(_event);
			this._$dispatchEvent('ondel', this.__index||0);
		};

		new _p._$$OManage();

	});