NEJ.define([
	'{pro}system.js',
	'{lib}util/event.js', 
	'{pro}widget/window/confirm.js', 
	'{lib}util/cache/list.js', 
	'{lib}util/ajax/dwr.js', 
	'{pro}widget/calendar/calendar.js',
	'util/file/select',
  'util/ajax/xdr'
	], function(_s, _t, _cof, _list, _dwr, _calendar, _t1, _j, _p, _o, _f, _r,_pro){
 	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proCache,
		_proItme;

	var paramName = {
		'iconImg':'图片',
		'title':'消息标题',
		'content':'消息内容',
		'pushTime':'发送时间',
		'validTime':'有效时长',
		'showContent':'spring版显示文案'
	}
	
	_p._$$PushList = NEJ.C();
	_pro = _p._$$PushList._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		
		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
		this.__group = _ntmp[i++];
		this.__startTime = _ntmp[i++];	//搜索开始时间
		this.__endTime = _ntmp[i++];	//搜索结束时间
		this.__search = _ntmp[i++];		//搜索按钮

		this.__createNew = _ntmp[i++];	//创建按钮
		this.__startMessages = _ntmp[i++];	//开启按钮
		this.__forbidMessages = _ntmp[i++];	//禁止按钮
		this.__deleteMessages = _ntmp[i++];	//删除按钮

		this.__createLayer = _ntmp[i++];	//创建浮层
		this.__createLayerContent = _ntmp[i++];	//创建正文节点
		this.__createImg = _ntmp[i++];
		this.__createUpload = _ntmp[i++];
		this.__createImgInput = _ntmp[i++];
		this.__createLayerPushTime = _ntmp[i++];	//创建push时间
		this.__createLayerOK = _ntmp[i++];		//创建确定按钮
		this.__createLayerCC = _ntmp[i++];		//创建取消按钮
		
		this.__editLayer = _ntmp[i++];		//编辑浮层
		this.__editLayerContent = _ntmp[i++];
		this.__editImg = _ntmp[i++];
		this.__editUpload = _ntmp[i++];
		this.__editImgInput = _ntmp[i++];
		this.__editLayerPushTime = _ntmp[i++];
		this.__editLayerOk = _ntmp[i++];
		this.__editLayerCC = _ntmp[i++];
		
		this.__logLayer = _ntmp[i++];		//查看浮层
		this.__logLayerContent = _ntmp[i++];
		this.__logLayerCC = _ntmp[i++];
		
		this.__createOpElems = nej.e._$getByClassName(this.__createLayer, 'cntag');	//创建浮层输入节点
		this.__editOpElems = nej.e._$getByClassName(this.__editLayer, 'edtag');		//编辑浮层输入节点

		this.__calendar = haitao.bw._$$Calendar._$allocate({});
		
		nej.v._$addEvent(this.__search, 'click', this.__doSearch._$bind(this));
		
 		nej.v._$addEvent(this.__startTime, 'click', this.__bindCalendar._$bind(this,this.__startTime, null, null));
 		nej.v._$addEvent(this.__endTime, 'click', this.__bindCalendar._$bind(this,this.__endTime, null, null));
 		nej.v._$addEvent(this.__createLayerPushTime, 'click', this.__bindCalendar._$bind(this,this.__createLayerPushTime, true, true));
 		nej.v._$addEvent(this.__editLayerPushTime, 'click', this.__bindCalendar._$bind(this,this.__editLayerPushTime, true, true));

 		nej.v._$addEvent(this.__createNew, 'click', function(_event){
 			this.__createLayer.style.display = 'block';
 		}._$bind(this));
 		nej.v._$addEvent(this.__createLayerOK, 'click', this.__onCreateBtn._$bind(this,'create'));
 		nej.v._$addEvent(this.__createLayerCC, 'click', function(_event){
 			this.__createLayer.style.display = 'none';
 		}._$bind(this));
 		nej.v._$addEvent(this.__editLayerOk, 'click', this.__onCreateBtn._$bind(this,'edit'));
 		nej.v._$addEvent(this.__editLayerCC, 'click', function(_event){
 			this.__editLayer.style.display = 'none';
 		}._$bind(this));
 		nej.v._$addEvent(this.__logLayerCC, 'click', function(_event){
 			this.__logLayer.style.display = 'none';
 		}._$bind(this));
 		//开启、禁用、删除
 		nej.v._$addEvent(this.__startMessages, 'click', this.__onStartMessages._$bind(this));
 		nej.v._$addEvent(this.__forbidMessages, 'click', this.__onForbidMessages._$bind(this));
 		nej.v._$addEvent(this.__deleteMessages, 'click', this.__onDeleteMessages._$bind(this));

 		//上传图片事件绑定
 		_t1._$bind(this.__createUpload, {
 			parent:this.__createUpload.parentNode,
 			multiple: false,
 			name: 'fileData',
 			accept: 'image/*',
 			onchange:this.__onPackageUpload._$bind(this, this.__createImg, this.__createImgInput)
 		})

 		_t1._$bind(this.__editUpload, {
 			parent:this.__editUpload.parentNode,
 			multiple: false,
 			name: 'fileData',
 			accept: 'image/*',
 			onchange:this.__onPackageUpload._$bind(this, this.__editImg, this.__editImgInput)
 		})

 		this.__checkedIds = [];
 		this.__checkboxElems = nej.e._$getByClassName(document.body, 'checkbox');

 		this.__allCheckbox = document.getElementById('checkAll');
 		nej.v._$addEvent(this.__allCheckbox, 'click', this.__setAllChecked._$bind(this));
 		
 		NEJ.P('haitao.g');
 		haitao.g.look = this.__onLook._$bind(this);		//查看
 		haitao.g.edit = this.__onEdit._$bind(this);		//编辑
	};

	_pro.__onPackageUpload = function(_imgElem,_inputElem,_event){
  	var _form = _event.form;
  	_form.action = '/backend/upload';
  	_j._$upload(_form,{onload:function(result){
  		var img = document.createElement('img');
  		img.onload = img.onerror = this.__imgOnload._$bind(this,result.body.url,_imgElem,_inputElem);
  		img.src = result.body.url;
  	}._$bind(this),
  	onerror:function(e){
  		notify.show('上传图片可能超过2M');
  	}})
  }

  _pro.__imgOnload = function(_src, _imgElem,_inputElem, _event) {
  	var _width = _event.target.naturalWidth,
  			_height = _event.target.naturalHeight;

  	if(_width == _height && _height == 240) {
  		_imgElem.src = _src;
  		_inputElem.value = _src;
  		nej.e._$delClassName(_imgElem, 'f-hide');
  		return;
  	}

  	if(_width == _height && _height == 0) {
  		alert('上传失败')
  		return;
  	}

  	alert('上传图片尺寸为240*240');
  	return;

  }
	
	//搜索按钮
	_pro.__doSearch = function(_event) {
		var _baseurl = '/backend/message/push/list?limit=50',
			_minPushTime = this.__startTime.value?this.__calendar.__parseDate(this.__startTime.value).getTime():-1,
			_maxPushTime = this.__endTime.value?this.__calendar.__parseDate(this.__endTime.value).getTime():-1,
			_inputElem = this.__group.getElementsByTagName('input')[0],
			_selectElems = this.__group.getElementsByTagName('select'),
			_id = _inputElem.value?_inputElem.value:-1,
			_client = _selectElems[0].value,
			_version = _selectElems[1].value,
			_channal = _selectElems[2].value;
		
		location.href = _baseurl+'&minPushTime='+_minPushTime+'&maxPushTime='+_maxPushTime+'&id='+_id+'&client='+_client+'&version='+_version+'&channal='+_channal+'&offset=0';
	};
	
	//显示日期控件
	_pro.__bindCalendar = function(_elem, _addtime, _nochosebeforetime, _event) {
		this.__calendar._$showCalendar(_event, _elem, _addtime, _nochosebeforetime);
	};
	//新建-编辑   消息
	_pro.__onCreateBtn = function(_type,_event) {
		if(!!this.__isHandelMessage){	//避免多次监督及操作
			return;
		}
		
		var _messageObj = {}, i=0, l=this.__createOpElems.length,
			_name, _value, _moldattr, _canemptyattr, _maxNum,
			_funcname = 'addMessagePush', _success='添加成功，刷新页面',
			_nodelist = this.__createOpElems;
		
		if(_type == 'edit') {
			l = this.__editOpElems.length;
			_nodelist = this.__editOpElems;
			_funcname = 'updateMessagePush';
			_success = '编辑成功，刷新页面';
		}
		//输入校验
		for(; i<l; i++) {
			_name = _nodelist[i].name;
			_value = _nodelist[i].value;
			_moldattr = _nodelist[i].getAttribute('mold');			//输入类型
			_canemptyattr = _nodelist[i].getAttribute('canempty');	//是否可以为空
			if(!!_name) {
				//判断必填的项
				if(!_value && _canemptyattr != 1) {
					alert('请输入'+paramName[_name]+'的值');
					return;
				}

				if(!_value && _canemptyattr == 1) {

				}else {
					//校验url
					if(_moldattr == 'url') {
						if(!(/^http:\/\/(www|m)\.kaola\.com.*/.test(_value))){
							alert('请输入正确的url,以http://www|m.kaola.com开头');
							return;
						}
					}
					//校验数字
					if(_moldattr == 'number') {
						if(isNaN(_value)){
							alert(_name+'请输入数字');
							return;
						}
						//校验最大字数
						_value = Number(_value);
						var _maxNum = _nodelist[i].getAttribute('maxNum');
						if(!!_maxNum && (_value > _maxNum)) {
							alert(_name+'数字必须小于'+_maxNum);
							return;
						}
					}
					//处理时间
					if(_moldattr == 'time') {
						_value = this.__calendar.__parseDate(_value).getTime();
					}
				}

				_messageObj[_name] = _value;
			}
		}
		
		//在这里判断消息标题和消息内容是否有1项是填写的
		// if(!_nodelist[1].value && !_nodelist[2].value) {
		// 	alert('消息标题和消息内容至少填写一项');
		// 	return;
		// }

		var _contentext = _nodelist[2].value;
		// if(!!_contentext) {		//最多输入50个英文字符，中文字符算2个
		// 	var ilength = _contentext.replace(/[^\x00-\xff]/g, 'xx').length;
		// 	if(ilength > 50) {
		// 		alert('消息内容不能填写超过50个字符【中文算2个字符】');
		// 		return;
		// 	}
		// }
		nej.j._$haitaoDWR('MessagePushBean', 'isMessageTooLong', [_messageObj], function(_data){
			if(!_data){
				this.__isHandelMessage = true;
				nej.j._$haitaoDWR('MessagePushBean', _funcname, [_messageObj], function(_data){
					this.__isHandelMessage = false;
					if(_data){
						alert(_success);
						location.reload();
					}else{
						alert('操作失败，请重试');
					}
				}._$bind(this));
			}else{
				alert('文案太长');
			}
		}._$bind(this));		
	};
	//开启
	_pro.__onStartMessages = function(_event) {
		this.__getCheckedId();
		
		if(this.__checkedIds.length > 0) {
			if(!!this.__isHandelItem) {	//三类操作不能同时进行和避免多次点击
				return;
			}
			this.__isHandelItem = true;
			nej.j._$haitaoDWR('MessagePushBean', 'reUseMessagePush', [this.__checkedIds], this.__cbItemOperate._$bind(this));
		} else {
			alert('请选择至少1条消息');
		}
	};
	//禁止
	_pro.__onForbidMessages = function(_event) {
		this.__getCheckedId();
		if(this.__checkedIds.length > 0) {
			if(!!this.__isHandelItem) {	//三类操作不能同时进行和避免多次点击
				return;
			}
			this.__isHandelItem = true;
			nej.j._$haitaoDWR('MessagePushBean', 'forbidMessagePush', [this.__checkedIds], this.__cbItemOperate._$bind(this));
		} else {
			alert('请选择至少1条消息');
		}
	};
	//删除
	_pro.__onDeleteMessages = function(_event) {
		this.__getCheckedId();
		if(this.__checkedIds.length > 0) {
			if(!!this.__isHandelItem) {	//三类操作不能同时进行和避免多次点击
				return;
			}
			this.__isHandelItem = true;
			nej.j._$haitaoDWR('MessagePushBean', 'deleteMessagePush', [this.__checkedIds], this.__cbItemOperate._$bind(this));
		} else {
			alert('请选择至少1条消息');
		}
	};
	//操作回调
	_pro.__cbItemOperate = function(_data) {
		this.__isHandelItem = false;
		if(_data == -1) {
			alert('操作失败或发送成功消息不能修改，请重试');
			return;
		} else if(_data == 0) {
			alert('部分失败或发送成功消息不能修改，刷新后请重试');
		} else if(_data == 1) {
			alert('操作成功，刷新页面');
		}
		location.reload();
	};
	//获取选中item的id数组
	_pro.__getCheckedId = function() {
		var i=0, l=this.__checkboxElems.length, _id;
		this.__checkedIds = [];
		for(;i<l;i++) {
			if(!!this.__checkboxElems[i].checked) {
				_id = this.__checkboxElems[i].getAttribute('data-id');
				this.__checkedIds.push(Number(_id));
			}
		}
	};
	//全选操作
	_pro.__setAllChecked = function() {
		var i=0, l=this.__checkboxElems.length;
		if(this.__allCheckbox.checked) {	//选中状态
			for(;i<l;i++) {
				this.__checkboxElems[i].checked = true;
			}
		} else {	//没有选中状态
			for(;i<l;i++) {
				this.__checkboxElems[i].checked = false;
			}
		}
	};
	//查看
	_pro.__onLook = function(_event) {
		nej.v._$stop(_event);
		if(this.__logLayer.style.display == 'block') {
			return;
		}
		var _target = nej.v._$getElement(_event), _id = _target.getAttribute('data-id');
		nej.j._$haitaoDWR('MessagePushBean', 'getLogsByMessageId', [_id], this.__cbGetLogs._$bind(this));
	};
	
	_pro.__cbGetLogs = function(_data) {
		if(!!_data && _data.length > 0) {
			var _string = '操作日志：<br>', i=0, l=_data.length, _newmessage;
			
//			if(_data[l-1].content.indexOf('新增消息')>=0) {
//				_newmessage = _data.pop();
//				l = _data.length;
//			}
			
			for(;i<l;i++) {
				if(_data[i].type == 1) {	//获取"新增消息"的item，用来显示新建时的原始信息
					_newmessage = _data[i];
					continue;
				}
				_string += '<br>'+nej.u._$format(_data[i].updateTime, 'yyyy-MM-dd HH:mm:ss') + ' ' + _data[i].content + '<br>';
			}
			//显示新建时的信息
			if(!!_newmessage) {
				_string += '<hr>';
				_string += _newmessage.content.replace(/[,，]/ig,'<br>');
			}
			
			this.__logLayerContent.innerHTML = _string;
			this.__logLayer.style.display = 'block';
		} else {
			alert('获取日志失败')
		}
	}

	_pro.__onEdit = function(_event) {
		nej.v._$stop(_event);
		if(this.__editLayer.style.display == 'block') {
			return;
		}
		var _target = nej.v._$getElement(_event), _obj={};
		_obj['id'] = _target.getAttribute('data-id');
		_obj['title'] = _target.getAttribute('data-title');
		_obj['content'] = _target.getAttribute('data-content');
		_obj['url'] = _target.getAttribute('data-url');
		_obj['pushTime'] = nej.u._$format(Number(_target.getAttribute('data-pushTime')), 'yyyy-MM-dd HH:mm');
		_obj['validTime'] = _target.getAttribute('data-validTime');
		_obj['allClient'] = _target.getAttribute('data-allClient');
		_obj['allVersion'] = _target.getAttribute('data-allVersion');
		_obj['allChannal'] = _target.getAttribute('data-allChannal');
		_obj['allArea'] = _target.getAttribute('data-allArea');
		_obj['iconImg'] = _target.getAttribute('data-iconImg');
		_obj['testAccount'] = _target.getAttribute('data-testAccount');
		_obj['userAccount'] = _target.getAttribute('data-userAccount');
		_obj['showContent'] = _target.getAttribute('data-showContent');

		
		var i=0, l=this.__editOpElems.length, _name, _value, _moldattr, _canemptyattr, _maxNum;
		for(; i<l; i++) {	//渲染编辑的数据
			_name = this.__editOpElems[i].name;
			if(!!_obj[_name]) {
				this.__editOpElems[i].value = _obj[_name];
			}
		}
		if(!!_obj['iconImg']) {
			this.__editImg.src = _obj['iconImg'];
			nej.e._$delClassName(this.__editImg, 'f-hide');
		}

		this.__editLayer.style.display = 'block';
		
	};
	
	new _p._$$PushList();
});
