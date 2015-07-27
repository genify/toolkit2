NEJ.define('{pro}module/psinventory/list.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}widget/pager/pagelist.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/calendar/calendar.js'],
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
 		this.__state = _ntmp[i++];
 		this.__buyNumbers = _ntmp[i++];
 		this.__startTime = _ntmp[i++];
 		this.__endTime = _ntmp[i++];
 		this.__searchBtn = _ntmp[i++];
 		this.__wrap = _ntmp[i++];
 		this.__box = _ntmp[i++];
 		this.__pager = _ntmp[i++];
 		
 		nej.v._$addEvent(window, 'resize', this.__setWrapHeight._$bind(this));
 		
 		this.__calendar = haitao.bw._$$Calendar._$allocate({});
 		nej.v._$addEvent(this.__startTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__startTime, false, true);
 		}._$bind(this));
 		nej.v._$addEvent(this.__endTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__endTime, false, true);
 		}._$bind(this));
 		nej.v._$addEvent(this.__searchBtn, 'click', this.__doSearch._$bind(this));
 		
 		this.__lopts = {
 	 			limit: 20,
 	 			parent: this.__box,
 	 			pager: {parent: this.__pager, klass: haitao.bw._$$NoNumPager},
 	 			item: {klass: _p._$$Item},
 	 			cache: {
 	 				key: 'feedback',
 	 				lkey: 'feedback',
 	 				beanName: 'FeedbackBean',
 	 				funcName: 'search',
 	 				klass: _p._$$CacheOManage
 	 			},
 	 			onafterlistrender: this.__setWrapHeight._$bind(this)
 	 		};
 	};
 	
 	_pro.__setWrapHeight = function() {
 		var _winHeight = document.documentElement.clientHeight;
		this.__wrap.style.height = _winHeight - 200 + 'px';
 	};
 	
 	_pro.__doSearch = function() {
 		//TODO-必填项判断
 		var _param = [20, 0, parseInt(this.__state.value)||null, this.__buyNumbers.value||null, this.__calendar.__parseDate(this.__startTime.value).getTime(), this.__calendar.__parseDate(this.__endTime.value).getTime()];
 		this.__lopts.cache.param = _param;
		if (!!this.__listModule) {
			this.__listModule._$recycle();
			this.__listModule = haitao.bw._$$NoNumList._$allocate(this.__lopts);
		} else {
			this.__listModule = haitao.bw._$$NoNumList._$allocate(this.__lopts);
		}
		this.__cache = this.__listModule.__cache;
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
			_list = [];
	    	for(var i=0, l=20; i<l; i++) {
	    		_list.push(i);
	    	}
	    	_options.onload(_list);
		}
		this.__param[1] = _options.offset;
//		nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
		nej.j._$haitaoOnlineDWR('ProductBean', 'index', [], _callback);
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
 		this.__state = _ntmp[i++];
 		this.__relatedNum = _ntmp[i++];
 		this.__detailUrl = _ntmp[i++];
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
				<td class="xtag" title="序号">1</td>\
				<td class="xtag" title="入库单号">20133354-323-44</td>\
				<td class="xtag" title="仓库">和达仓库</td>\
				<td class="xtag" title="入库时间">2014-11-30 21:00:22</td>\
 				<td class="xtag" title="入库原因">盘盈入库</td>\
				<td class="xtag" title="入库数量">22</td>\
 				<td class="xtag" title="审核状态">未审核</td>\
				<td class="xtag" title="相关单号"></td>\
				<td title="操作">\
					<a class="xtag" href="#">查看详情</a>\
				</td>');
 	};
 	
 	_proPItem.__doRefresh = function(_data) {
 		return;
 	};
 	
 	new _p._$$OManage();
	
});