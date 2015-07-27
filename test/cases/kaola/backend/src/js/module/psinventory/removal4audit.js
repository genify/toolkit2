NEJ.define('{pro}module/psinventory/list.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/calendar/calendar.js'],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proPItem;
	
	_p._$$Audit = NEJ.C();
	_pro = _p._$$Audit._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
 		this.__state = _ntmp[i++];
 		this.__type = _ntmp[i++];
 		this.__startTime = _ntmp[i++];
 		this.__endTime = _ntmp[i++];
 		this.__searchBtn = _ntmp[i++];
 		this.__wrap = _ntmp[i++];
 		this.__box = _ntmp[i++];
 		this.__pager = _ntmp[i++];
 		
 		this.__showTotal = nej.e._$get('total');
 		
 		nej.v._$addEvent(window, 'resize', this.__setWrapHeight._$bind(this));
 		
 		this.__calendar = haitao.bw._$$Calendar._$allocate({});
 		nej.v._$addEvent(this.__startTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__startTime);
 		}._$bind(this));
 		nej.v._$addEvent(this.__endTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__endTime);
 		}._$bind(this));
 		nej.v._$addEvent(this.__searchBtn, 'click', this.__getCount._$bind(this));
 		
 		this.__lopts = {
 	 			limit: 20,		//这个页面的dwr请求没有翻页，所以这里暂时设置成500来获取所有的内容
 	 			parent: this.__box,
 	 			pager: {parent: this.__pager, klass: haitao.bw._$$NoNumPager},
 	 			item: {klass: _p._$$Item},
 	 			cache: {
 	 				key: 'storage',
 	 				lkey: 'storage',
 	 				beanName: 'InvoicingBean',
 	 				funcName: this.__config.type===1?'getStockOutRecordsByTypeAndTime':'getStockInRecordsByTypeAndTime',
 	 				clear: true,
 	 				klass: _p._$$CacheStorage
 	 			},
 	 			onafterlistrender: this.__setWrapHeight._$bind(this)
 	 		};
 	
 		this.__getCount();
 	};
 	//页面resize时，修改列表内容的高度
 	_pro.__setWrapHeight = function() {
		var _winHeight = document.documentElement.clientHeight,
			_beHeight = _winHeight - 220,
			_listHeight = this.__box.clientHeight;
		if(_listHeight >= _beHeight) {
			this.__wrap.style.height = _winHeight - 220 + 'px';
		}
 	};
 	
 	_pro.__getCount = function() {
 		var _param = [parseInt(this.__state.value),parseInt(this.__type.value),
  		             this.__startTime.value?this.__calendar.__parseDate(this.__startTime.value).getTime():-1,
  		             this.__endTime.value?this.__calendar.__parseDate(this.__endTime.value).getTime():-1];
 		
 		nej.j._$haitaoDWR('InvoicingBean', (this.__config.type===1?'getStockOutRecordCountByTypeAndTime':'getStockInRecordCountByTypeAndTime'), _param, this.__cbGetCount.bind(this,_param));
 	}
 	
 	_pro.__cbGetCount = function(_param, _data) {
 		if(!!_data && _data > 0) {
 			this.__showTotal.innerHTML = '总记录' + _data + '条';
 			_param.push(20);
 			_param.push(0);
 			this.__doSearch(_param, _data);
 		} else {
 			this.__showTotal.innerHTML = '';
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
	    	_options.onload(_list);
		}
		this.__param[this.__param.length - 1] = _options.offset;
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
 		this.__orderNumber = _ntmp[i++];
 		this.__putinNumbers = _ntmp[i++];
 		this.__storage = _ntmp[i++];
 		this.__time = _ntmp[i++];
 		this.__reason = _ntmp[i++];
 		this.__count = _ntmp[i++];
 		this.__type = _ntmp[i++];
 		this.__relatedNum = _ntmp[i++];
 		this.__detailUrl = _ntmp[i++];
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
				<td class="xtag" title="序号">1</td>\
				<td class="xtag">20133354-323-44</td>\
				<td class="xtag" title="仓库">和达仓库</td>\
				<td class="xtag">2014-11-30 21:00:22</td>\
 				<td class="xtag">盘盈入库</td>\
				<td class="xtag">22</td>\
 				<td class="xtag">已审核</td>\
				<td class="xtag" title="相关单号"></td>\
				<td title="操作">\
					<a target="_blank" class="xtag" href="#">查看详情</a>\
				</td>');
 	};
 	
 	_proPItem.__doRefresh = function(_data) {
 		this.__orderNumber.innerText = this.__index+1;
 		this.__putinNumbers.innerText = _data.id||'';
 		this.__storage.innerText = _data.storageName||'';
 		this.__time.innerText = nej.u._$format(_data.time, 'yyyy-MM-dd HH:mm:ss');
 		this.__count.innerText = _data.count;
 		this.__relatedNum.innerText = _data.relatedId||'';
 		this.__type.innerText = _data.auditStatusName||'';
 		if (!!_data.stockInTypeName) {		//这里需要区分是入库记录还是出库记录
 			this.__reason.innerText = (_data.stockInTypeName+'入库')||'';
 			this.__detailUrl.href = '/backend/invoicing/stockin/audit?id='+_data.id;
 		} else if (!!_data.stockOutTypeName) {
 			this.__reason.innerText = (_data.stockOutTypeName+'出库')||'';
 			this.__detailUrl.href = '/backend/invoicing/stock_out/audit?id='+_data.id;
 		}
 	};
 	
 	new _p._$$Audit();
	
});