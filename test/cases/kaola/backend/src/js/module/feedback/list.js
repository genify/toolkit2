NEJ.define('{pro}module/feedback/list.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}cache/feedback.js', '{pro}widget/pager/pagelist.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/calendar/calendar.js'],
function(){
 	var _p = NEJ.P('haitao.bm'),
 		_pro,
 		_proCache,
 		_proItme;
 	
 	_p._$$MList = NEJ.C();
 	_pro = _p._$$MList._$extend(haitao.bw._$$MModule);
 	
 	_pro.__init = function() {
 		this.__super();
 		
 		this.__setNode();
 		this.__setPlugsOpt();
 		this.__initEvents();
 	};
 	
 	_pro.__setNode = function() {
 		this.__box = nej.e._$get('bklist');
 		this.__pager = nej.e._$get('bkpager');
 		this.__searchBox = nej.e._$getByClassName(document.body, 'm-search')[0];
 		
 		this.__selectAry = this.__searchBox.getElementsByTagName('select');
 		this.__inputAry = this.__searchBox.getElementsByTagName('input');
 		
 		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
 		this.__addFbBtn = _ntmp[i++];
 		this.__startTime = _ntmp[i++];
 		this.__endTime = _ntmp[i++];
 		this.__searchBtn = _ntmp[i++];
 		
 		var _ntmpl = nej.e._$getByClassName(document.body, 'ltag'), i=0;
 		this.__layer = _ntmpl[i++];
 		this.__contentBox = _ntmpl[i++];
 		this.__userDesc = _ntmpl[i++];
 		this.__lsave = _ntmpl[i++];
 		this.__lcancel = _ntmpl[i++];
 		this.__status = _ntmpl[i++];
 		this.__addSelectAry = this.__layer.getElementsByTagName('select');
 		this.__addInputAry = this.__layer.getElementsByTagName('input');

 		var _date = new Date().getTime();
 		this.__startTime.value = nej.u._$format((_date - 30*24*60*60*1000), 'yyyy-MM-dd');
 		this.__endTime.value = nej.u._$format((_date + 24*60*60*1000), 'yyyy-MM-dd');
 	};
 	
 	_pro.__initEvents = function() {
 		nej.v._$addEvent(this.__addFbBtn, 'click', this.__doAddItem._$bind(this, 0, {}));
 		nej.v._$addEvent(this.__startTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__startTime);
 		}._$bind(this));
 		nej.v._$addEvent(this.__endTime, 'click', function(_event) {
 			this.__calendar._$showCalendar(_event, this.__endTime);
 		}._$bind(this));
 		nej.v._$addEvent(this.__searchBtn, 'click', this.__doSearch._$bind(this));
 		
 		//初始化layer的节点事件
 		nej.v._$addEvent(this.__lsave, 'click', this.__doAddFeedback._$bind(this));
 		nej.v._$addEvent(this.__lcancel, 'click', function(){
 			this.__layer.style.display = 'none';
 			this.__resetLayerDate({});
 		}._$bind(this));
 		
 		nej.v._$addEvent(this.__selectAry[0], 'change', this.__changeType._$bind(this,this.__selectAry[0], this.__selectAry[1], 0));
 		nej.v._$addEvent(this.__addSelectAry[0], 'change', this.__changeType._$bind(this,this.__addSelectAry[0], this.__addSelectAry[1], 1));

 		this.__doSearch();
 	};
 
 	_pro.__changeType = function(_target,_parent,_type,_event) {
 		var _value = _target.value, _obj = _typeList[_value], _subtype, _optionsElem;
 		if(_type == 1) {
 			_parent.innerHTML = '';
 		} else {
 			_parent.innerHTML = '<option value="0">全部</option>';
 		}
 		
 		if(!!_obj) {
 			for(subtypeIndex in _obj.subTypeArry) {
 	 			_subtype = _obj.subTypeArry[subtypeIndex];
 	 			_optionsElem = document.createElement('option');
 	 			_optionsElem.innerText = _subtype;
 	 			_optionsElem.value = subtypeIndex;
 	 			_parent.appendChild(_optionsElem);
 	 		}
 		}
 	};

 	_pro.__setPlugsOpt = function() {
 		//列表控件options
 		this.__lopts = {
 	 			limit: 20,
 	 			parent: this.__box,
 	 			pager: {parent: this.__pager, klass: haitao.bw._$$NoNumPager},
 	 			item: {
 	 				klass: _p._$$Item,
 	 				onedit: this.__doItemEdit._$bind(this),
 	 				ondel: this.__doItemDel._$bind(this),
 	 				onclose: this.__doItemClose._$bind(this)
 	 			},
 	 			cache: {
 	 				key: 'feedback',
 	 				beanName: 'FeedbackBean',
 	 				funcName: 'search',
 	 				lkey: 'feedback',
 	 				clear: true,		//在控件销毁时，清楚cache里的数据缓存
 	 				param: [],
 	 				klass: haitao.bc._$$CacheFeedback,
 	 				cbCloseItem: this.__cbDoItem._$bind(this),		//关闭问题回调
 	 				cbDelItem: this.__cbDoItem._$bind(this),			//删除问题回调
 	 				cbEditItem: this.__cbDoLayer._$bind(this)		//编辑问题回调
 	 			},
 	 			onbeforelistload: this.__beforeListLoad._$bind(this),
 	 			onafterlistrender: this.__afterListRender._$bind(this)
 	 		};
 		//confirm控件
 		//删除确认弹窗
 		this.__delWindow = haitao.bw._$$Confirm._$allocate({
 			parent: document.body,title: '提示',align: 'middle middle',draggable: true,
 			c1: '删除提示',c2: '确认删除该条工单',
 			onok: this.__doDelDwr._$bind(this)
 		});
 		this.__delWindow._$hide();
 		
 		//关闭确认弹窗
 		this.__closeWindow = haitao.bw._$$Confirm._$allocate({
 			parent: document.body,title: '提示',align: 'middle middle',draggable: true,
 			c1: '提示',c2: '该客诉问题是否确认解决完毕？',
 			onok: this.__doCloseDwr._$bind(this)
 		});
 		this.__closeWindow._$hide();
 		
 		this.__calendar = haitao.bw._$$Calendar._$allocate({});
 	};
 	
 	_pro.__beforeListLoad = function(_node, _obj) {
 		_node.stopped = true;
 	};
 	
 	_pro.__afterListRender = function(_param) {
 		if(_param.list.length < (_param.offset+20)) {	//没有下一页
 			this.__listModule.__pager.__page._$setNextPageHide('none');
 		} else {
 			this.__listModule.__pager.__page._$setNextPageHide('');
 		}
 		
 		if(_param.offset === 0) {
 			this.__listModule.__pager.__page._$setPrePageHide('none');
 		} else {
 			this.__listModule.__pager.__page._$setPrePageHide('');
 		}
 	};
 	
 	_pro.__doSearch = function() {
 		this.__lopts.cache.param = this.__getSearchValues();
		if (!!this.__listModule) {
			this.__listModule._$recycle();
			this.__listModule = haitao.bw._$$NoNumList._$allocate(this.__lopts);
		} else {
			this.__listModule = haitao.bw._$$NoNumList._$allocate(this.__lopts);
	 		this.__cache = this.__listModule.__cache;
	 		//通过 this.__listModule._$items()来获取所有的当前显示的item对象
	 		//通过this.__listModule.__pager._$setIndex()来跳转到指定页数
		}
 	};
 	
 	_pro.__getSearchValues = function() {
// 		int limit, int offset, int type, int secondType,int priority,
//		int status, String lastCommentUserId, String mobilePhone,
//		String accountName, String createrName, String desc,String orderId, 
// 		long minCreateTime, 
//		long maxCreateTime
 		return [20, 0, parseInt(this.__selectAry[0].value)||0, parseInt(this.__selectAry[1].value)||0, parseInt(this.__selectAry[2].value)||0,
 		       parseInt(this.__selectAry[3].value)||0, this.__selectAry[4].value||null, this.__inputAry[0].value||null,
 		       this.__inputAry[1].value||null, this.__selectAry[4].value||null, this.__inputAry[2].value||null,this.__inputAry[3].value||null, 
 		       this.__inputAry[4].value?this.__calendar.__parseDate(this.__inputAry[4].value).getTime():-1,
 		       this.__inputAry[5].value?this.__calendar.__parseDate(this.__inputAry[5].value).getTime():-1];
 	};
 	
 	_pro.__doAddItem = function() {
 		this.__fbFlag = 'add';
 		this.__layer.style.display = 'block';
 		this.__changeType(this.__addSelectAry[0], this.__addSelectAry[1], 1);
 	}
 	
 	//item点击回调，统一在这里处理
 	_pro.__doItemEdit = function(_index, _data) {
 		this.__fbFlag = 'edit';
 		this.__disposeItem = _index;
 		this.__resetLayerDate(_data);
 		this.__changeType(this.__addSelectAry[0], this.__addSelectAry[1], 1);
 		this.__addSelectAry[1].value = _data.secondType||2;		//当渲染完子类型节点后，根据secondType选中
 		this.__layer.style.display = 'block';
 	};
 	
 	_pro.__doItemDel = function(_index) {
 		this.__disposeItem = _index;	//记录当前处理的问题，当成功或者失败后，这个参数设置为null
 		this.__delWindow._$show();
 	};
 	
 	_pro.__doDelDwr = function(_id) {
 		var _data = this.__listModule._$items()[this.__disposeItem%20].__data;
 		this.__cache.__delItem([_data.id], this.__disposeItem);
 	};
 	
 	_pro.__doItemClose = function(_index) {
 		this.__disposeItem = _index;
 		this.__closeWindow._$show();
 	};
 	
 	_pro.__doCloseDwr = function(_id) {
 		var _data = this.__listModule._$items()[this.__disposeItem%20].__data;
 		this.__cache.__closeItem([_data.id], this.__disposeItem);
 	};
 	
 	//cahce请求回调，统一在这里处理
	_pro.__cbDoItem = function(_type) {
		if(!!_type) {
			alert('操作成功');
			this.__doSearch();
		}
	};
	
	_pro.__cbDoLayer = function(_type) {
		if(!!_type) {
			alert('操作成功');
			this.__layer.style.display = 'none';
 			this.__resetLayerDate({});
			this.__doSearch();
		}
	};
	
	//设置浮层的内容
	_pro.__resetLayerDate = function(_data) {
 		this.__addSelectAry[0].value = _data.type||1;
		this.__addSelectAry[2].value = _data.priority||2;
		this.__addInputAry[0].value = _data.mobilePhone||'';
		this.__addInputAry[1].value = _data.orderId||'';
		this.__addInputAry[2].value = _data.userAccount||'';
		this.__addInputAry[3].value = _data.userEmail||'';
		this.__userDesc.value = _data.description||'';
		this.__status.value = _data.status||1;
 	};

	//由于新建问题的时候，cache对象实例可能还没有建立，因此这个dwr请求放置在这里，其他的放置在cache对象里
	_pro.__doAddFeedback = function() {
		var _param = {}, phoneReg = /^(13|14|15|18)\d{9}$/i;
		_param.type = parseInt(this.__addSelectAry[0].value)||0;
		_param.secondType = parseInt(this.__addSelectAry[1].value)||0;
		_param.priority = parseInt(this.__addSelectAry[2].value)||0;
		_param.mobilePhone = this.__addInputAry[0].value||'';
		_param.orderId = this.__addInputAry[1].value||'';
		_param.userAccount = this.__addInputAry[2].value||'';
		_param.userEmail = this.__addInputAry[3].value||'';
		_param.description = this.__userDesc.value||'';
		_param.status = parseInt(this.__status.value)||1;

		if(!_param.mobilePhone) {
			alert('请输入手机号码！');
			return;
		}
		
		if(!phoneReg.test(_param.mobilePhone)) {
			alert('手机号码格式不对！')
			return;
		}
		
		if(!_param.userAccount) {
			alert('请输入账号！');
			return;
		}
		
		if (this.__fbFlag === 'add') {
			_param.status = 1;
			nej.j._$haitaoDWR('FeedbackBean', 'addFeedback', [_param], this.__cbDoLayer._$bind(this));
		} else if (this.__fbFlag === 'edit') {
			//编辑问题
			var _data = this.__listModule._$items()[this.__disposeItem%20].__data;
			_param.id = _data.id;
			this.__cache.__editItem([_param], this.__disposeItem);
		}
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
 		this.__priority = _ntmp[i++];
 		this.__phone = _ntmp[i++];
 		this.__account = _ntmp[i++];
 		this.__problemType = _ntmp[i++];
 		this.__subProblemType = _ntmp[i++];
 		this.__state = _ntmp[i++];
 		this.__creater = _ntmp[i++];
 		this.__time = _ntmp[i++];
 		this.__checkReply = _ntmp[i++];
 		this.__edit = _ntmp[i++];
 		this.__close = _ntmp[i++];
 		this.__del = _ntmp[i++];
 		
 		nej.v._$addEvent(this.__edit, 'click', this.__editComplain._$bind(this));
 		nej.v._$addEvent(this.__close, 'click', this.__closeComplain._$bind(this));
 		nej.v._$addEvent(this.__del, 'click', this.__delComplain._$bind(this));
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
				<td class="xtag" title="序号">123</td>\
				<td class="xtag" title="优先级">高</td>\
				<td class="xtag" title="手机号">12343327876</td>\
				<td class="xtag" title="账号">3333333@qq.com</td>\
				<td class="xtag" title="问题类型">订单问题</td>\
				<td class="xtag" title="子类型">子类型</td>\
				<td class="xtag" title="处理状态">未处理</td>\
 				<td class="xtag" title="创建人">创建人</td>\
				<td class="xtag" title="客诉时间">2014-10-24<br>21:22:22</td>\
				<td title="操作">\
					<a class="xtag" target="_blank" href="#">查看及回复&nbsp;</a>\
					<a class="xtag" href="#">编辑&nbsp;</a>\
					<a class="xtag" href="#">关闭&nbsp;</a>\
					<a class="xtag" href="#">删除</a>\
				</td>');
 	};
 	
 	_proPItem.__doRefresh = function(_data) {
 		this.__number.innerText = _data.id;
 		this.__priority.innerText = this.__getPriority(_data.priority);
 		this.__phone.innerText = _data.mobilePhone;
 		this.__account.innerText = _data.userEmail||_data.userAccount||'';
 		this.__creater.innerText = _data.createrName||'';
 		if(!!_typeList[_data.type]){
 			this.__problemType.innerText = _typeList[_data.type].typeName||'';
 		} else {
 			this.__problemType.innerText = _typeList[_data.type]||'';
 		}
 		
 		this.__subProblemType.innerText = !!_typeList[_data.type]?_typeList[_data.type].subTypeArry[_data.secondType]:'';
 		this.__state.innerText = this.__getState(_data.status);
 		this.__time.innerHTML = nej.u._$format(_data.createTime,'yyyy-MM-dd mm:ss');
 		this.__checkReply.href = '/backend/feedback/detail?feedbackId='+_data.id;
 	};
 	
 	_proPItem.__getState = function(_status) {
 		var _string = '';
 		switch(_status){
 			case 1:_string='未处理';
 				break;
 			case 2:_string='处理中';
				break;
 			case 3:_string='已处理';
				break;
 			case 4:_string='已完成';
				break;
 			case 10:_string='已删除';
				break;
 		}
 		
 		return _string;
 	};
 	
 	_proPItem.__getPriority = function(_priority) {
 		var _string = '';
 		switch(_priority){
			case 1:_string='高';
				break;
			case 2:_string='中';
				break;
			case 3:_string='低';
				break;
		}
		
		return _string;
 	};
 	
 	_proPItem.__editComplain = function(_event) {
 		nej.v._$stop(_event);
 		this._$dispatchEvent('onedit', this.__index||0, this.__data);
 	};
 	
 	_proPItem.__closeComplain = function(_event) {
 		nej.v._$stop(_event);
 		this._$dispatchEvent('onclose', this.__index||0, this.__data);
 	};
 	
 	_proPItem.__delComplain = function(_event) {
 		nej.v._$stop(_event);
 		this._$dispatchEvent('ondel', this.__index||0, this.__data);
 	};
 	
 	new _p._$$MList();
});
