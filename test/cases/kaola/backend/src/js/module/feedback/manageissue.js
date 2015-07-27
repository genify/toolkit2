NEJ.define('{pro}module/psinventory/list.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/dialog/dialog.js'],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proPItem,
		_tkey = nej.e._$addHtmlTemplate('\
			<td title="${item.id|default:""|escape}">${item.id|default:""|escape}</td>\
			<td title="${item.typeName|default:""}">${item.typeName|default:""}</td>\
			<td title="${item.createrName|default:""}">${item.createrName|default:""}</td>\
			<td title="${item.ctime|default:""}" class="createTime">${item.ctime|default:0}</td>\
			<td title="操作" class="totalcountInStock">\
				<a class="xtag" href="#" onclick="haitao.g.editType(1,${item.id},\'${item.typeName}\',${item.pid},\'${item.pTypeName}\',event)">编辑</a>\
				<a class="xtag" href="#" onclick="haitao.g.delType(1,${item.id},event)">删除</a>\
			</td>\
			'),
		_tkey1 = nej.e._$addHtmlTemplate('\
				<a class="xtag" href="#" onclick="haitao.g.editType(1,${item.id},\'${item.typeName}\',${item.pid},\'${item.pTypeName}\',event)">编辑</a>\
			');
	
	_p._$$Issue = NEJ.C();
	_pro = _p._$$Issue._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
 		this.__createMold = _ntmp[i++];
 		this.__moldList = _ntmp[i++];
 		this.__moldPager = _ntmp[i++];
 		this.__createSubMold = _ntmp[i++];
 		this.__subMoldList = _ntmp[i++];
 		
 		nej.v._$addEvent(this.__createMold, 'click', this.__onCreateMold._$bind(this, null));
 		nej.v._$addEvent(this.__createSubMold, 'click', this.__onCreateSubMold._$bind(this, null));
 		
 		this.__lopts = {
 	 			limit: 20,		//这个页面的dwr请求没有翻页，所以这里暂时设置成500来获取所有的内容
 	 			parent: this.__moldList,
 	 			pager: {parent: this.__moldPager},
 	 			item: {klass: _p._$$Item},
 	 			cache: {
 	 				key: 'issue',
 	 				lkey: 'issue',
 	 				beanName: 'FeedbackBean',
 	 				funcName: 'showFeedbackTypeList',
 	 				clear: true,
 	 				klass: _p._$$CacheIssue
 	 			},
 	 			onafterlistrender: this.__initSubMold._$bind(this)
 	 		};
 		if(this.__config.totalcount > 0) {
 			this.__doSearch([20,0],this.__config.totalcount);
 		}
 		
 		var g = NEJ.P('haitao.g');
 		g.editType = this.__editType._$bind(this);
 		g.delType = this.__delType._$bind(this);
 		g.generateSubMold = this.__generateSubMold._$bind(this);
 	};
 	
 	_pro.__initSubMold = function(_obj) {
 		if(_obj.list.length > 0) {
	 		var _index = _obj.offset, _data = this.__listModule.__items[_index%20].__data;
	 		_obj.parent.children[0].className = 'active';

	 		this.__generateSubMold(_data, _index);
 		}
 	}

 	_pro.__onCreateMold = function(_data, _event) {
 		var _html = '<div style="padding:50px 50px;font-size:12px;">类型名称：<input style="width:200px;" type="text" class="moldtext" value="'+(!!_data?_data[1]:'')+'"/></div>', _val;
 		this.__moldDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: !!_data?'编辑类型':'新增类型',
            align: 'middle middle',
            draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
            	_val = nej.e._$getByClassName(_dialogBody,'moldtext')[0].value;
            	if(!_val) {
            		alert('请输入内容');
            		return;
            	}
            	if(_val.length > 99) {
            		alert('字符不能超过99');
            		return;
            	}
            	nej.j._$haitaoDWR('FeedbackBean', 'checkTypeName',
                      [_val], function(_data,_val,_cbparam){
            		if(_cbparam){
            			if(!!_data) {
                    		_data[1] = _val;
                    		nej.j._$haitaoDWR('FeedbackBean', 'updateFeedbackType',
                            _data, function(_data){
                        		if(!!_data && _data == 100) {
                        			alert('修改成功，刷新页面');
                                    this.__moldDialog._$hide();
                                    location.reload();
                        		} else {
                        			alert('修改失败，请重试');
                        		}
                            }._$bind(this));
                    	} else {
                    		nej.j._$haitaoDWR('FeedbackBean', 'addFeedbackType',
                            [_val, null, null], function(_data){
                        		if(!!_data) {
                        			alert('添加成功，刷新页面');
                                    this.__moldDialog._$hide();
                                    location.reload();
                        		} else {
                        			alert('添加失败，请重试');
                        		}
                            }._$bind(this));
                    	}
            		} else {
            			alert('名称重复');
                		return;
            		}
            	}._$bind(this,_data,_val));
//            	if(!!_data) {
//            		_data[1] = _val;
//            		nej.j._$haitaoDWR('FeedbackBean', 'updateFeedbackType',
//                    _data, function(_data){
//                		if(!!_data && _data == 100) {
//                			alert('修改成功，刷新页面');
//                            this.__moldDialog._$hide();
//                            location.reload();
//                		} else {
//                			alert('修改失败，请重试');
//                		}
//                    }._$bind(this));
//            	} else {
//            		nej.j._$haitaoDWR('FeedbackBean', 'addFeedbackType',
//                    [_val, null, null], function(_data){
//                		if(!!_data) {
//                			alert('添加成功，刷新页面');
//                            this.__moldDialog._$hide();
//                            location.reload();
//                		} else {
//                			alert('添加失败，请重试');
//                		}
//                    }._$bind(this));
//            	}
                
            }._$bind(this)
        });
        this.__moldDialog._$show();
 	};
 	
 	_pro.__onCreateSubMold = function(_data,_event) {
 		var _html = '<div style="padding:50px 50px;font-size:12px;">子类型名称：<input style="width:200px;" type="text" class="submoldtext"  value="'+(!!_data?_data[1]:'')+'"/></div>', _val;
 		var _target = nej.v._$getElement(_event);
 		this.__moldSubDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: !!_data?'编辑子类型':'新增子类型',
            align: 'middle middle',
            draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
            	if(!this.__selectMoldData) {
            		this.__selectMoldData = this.__listModule.__items[0].__data;
            		this.__selectMoldData.index = 0;
            	}

            	_val = nej.e._$getByClassName(_dialogBody,'submoldtext')[0].value;
            	if(!_val) {
            		alert('请输入内容');
            		return;
            	}
            	if(_val.length > 99) {
            		alert('字符不能超过99');
            		return;
            	}
            	if(this.__checkRepeat(this.__selectMoldData.index, _val)){
            		alert('名称重复');
            		return;
            	}
            	if(!!_data) {
            		_data[1] = _val;
            		nej.j._$haitaoDWR('FeedbackBean', 'updateFeedbackType',
                    _data, function(_param,_target,_data){
                		if(!!_data && _data == 100) {
                			alert('修改成功');
                            this.__moldSubDialog._$hide();
                            _target.parentNode.parentNode.children[1].innerText = _param[1];

                            var _itemdata = {};
                            _itemdata.id = _param[0];
                            _itemdata.typeName = _param[1];
                            _itemdata.pid = _param[2];
                            _itemdata.pTypeName = _param[3];
                            _target.outerHTML = nej.e._$getHtmlTemplate(_tkey1, {item:_itemdata});
                            this.__updateSub(this.__selectMoldData.index, _val, _param[0]);
                		} else {
                			alert('修改失败，请重试');
                		}
                    }._$bind(this, _data, _target));
            	} else {
            		nej.j._$haitaoDWR('FeedbackBean', 'addFeedbackType',
                    [_val,this.__selectMoldData.id,this.__selectMoldData.typeName], function(_data){
                		if(!!_data) {
                			alert('添加成功');
                            this.__moldSubDialog._$hide();
                            var _tr = document.createElement('tr');
                            _data.ctime = nej.u._$format(_data.createTime, 'yyyy-MM-dd HH:mm:ss');
                            _data.pTypename = _data.PTypeName;
                            _data.pid = _data.pId;
 							_tr.innerHTML = nej.e._$getHtmlTemplate(_tkey, {item: _data});
 							this.__subMoldList.appendChild(_tr);
 							this.__addSub(this.__selectMoldData.index, _data);
                		} else {
                			alert('添加失败，请重试');
                		}
                    }._$bind(this));
            	}
                
            }._$bind(this)
        });
        this.__moldSubDialog._$show();
 	};
 	
 	_pro.__checkRepeat = function(_index, _val) {
 		var _data = this.__listModule.__items[_index%20].__data, _flag=false, feedbackSecondTypeList = _data.feedbackSecondTypeList;
 		for(var i=0,l=feedbackSecondTypeList.length; i<l; i++){
 			if(feedbackSecondTypeList[i].typeName == _val) {
 				_flag = true;
 				break;
 			}
 		}
 		return _flag;
 	};
 	
 	_pro.__updateSub = function(_index, _val, _id) {
 		var _data = this.__listModule.__items[_index%20].__data, _flag=false, feedbackSecondTypeList = _data.feedbackSecondTypeList;
 		for(var i=0,l=feedbackSecondTypeList.length; i<l; i++){
 			if(feedbackSecondTypeList[i].id == _id) {
 				feedbackSecondTypeList[i].typeName = _val;
 				break;
 			}
 		}
 	};
 	
 	_pro.__addSub = function(_index, _obj) {
 		var _data = this.__listModule.__items[_index%20].__data, _flag=false, feedbackSecondTypeList = _data.feedbackSecondTypeList;
 		feedbackSecondTypeList.push(_obj);
 	};
 	
 	_pro.__generateSubMold = function(_data, _index) {
 		var _subdata,_tr;
 		this.__selectMoldData = _data;
 		this.__selectMoldData.index = _index;
 		this.__subMoldList.innerHTML = '';
 		for(var i=0, l=_data.feedbackSecondTypeList.length; i<l; i++) {
 			_subdata = _data.feedbackSecondTypeList[i];
 			_subdata.pid = _data.id;
 			_subdata.pTypeName = _data.typeName;
 			_subdata.ctime = nej.u._$format(_data.createTime, 'yyyy-MM-dd HH:mm:ss');
 			_tr = document.createElement('tr');
 			_tr.innerHTML = nej.e._$getHtmlTemplate(_tkey, {item: _subdata});
 			this.__subMoldList.appendChild(_tr);
 		}
 	};
 	
 	_pro.__editType = function(_flag, _id, _typename, pid, ptypename, _event) {
 		var _param = [_id, _typename, pid, ptypename];
 		if(_flag == 1){	//编辑子类型
 			this.__onCreateSubMold(_param, _event);
 		} else {
 			this.__onCreateMold(_param, _event);
 		}
 	};
 	
 	_pro.__delType = function(_flag, _id, _event) {
 		var _text = _flag==1?'子':'', _html = '<div style="padding:30px 50px;font-size:12px;"><b>确定要删除该问题'+_text+'类型吗？</b><br>删除后不可还原，请谨慎操作<br></div>';
 		var _target = nej.v._$getElement(_event);
 		this.__delMoldDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '提示',
            align: 'middle middle',
            draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
        		nej.j._$haitaoDWR('FeedbackBean', 'deleteFeedbackType',
                [_id], function(_flag,_target,_data){
            		if(!!_data && _data == 100) {
                        this.__delMoldDialog._$hide();
                        if(_flag == 1) {
                        	alert('修改成功');
                        	nej.e._$remove(_target.parentNode.parentNode);
                        } else {
                        	alert('修改成功，刷新页面');
                        	location.reload();
                        }
            		} else {
            			alert('修改失败，请重试');
            		}
                }._$bind(this,_flag,_target));
                
            }._$bind(this)
        });
        this.__delMoldDialog._$show();
 	};
 	
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
 	}
 	
	_p._$$CacheIssue = NEJ.C();
 	_proCache = _p._$$CacheIssue._$extend(nej.ut._$$ListCache);
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
 		this.__id = _ntmp[i++];
 		this.__type = _ntmp[i++];
 		this.__operator = _ntmp[i++];
 		this.__createTime = _ntmp[i++];
 		this.__editMoldBtn = _ntmp[i++];
 		this.__delMoldBtn = _ntmp[i++];
 		
 		nej.v._$addEvent(this.__editMoldBtn, 'click', this.__editMold._$bind(this));
 		nej.v._$addEvent(this.__delMoldBtn, 'click', this.__delMold._$bind(this));
 		nej.v._$addEvent(this.__body, 'click', this.__generateSubMold._$bind(this));
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
				<td class="xtag" title="序号">1</td>\
				<td class="xtag" title="问题类型"></td>\
				<td class="xtag" title="操作人"></td>\
				<td class="xtag" title="创建时间"></td>\
				<td title="操作">\
					<a class="xtag" href="#">编辑</a>\
 					<a class="xtag" href="#">删除</a>\
				</td>');
 	};

 	_proPItem.__doRefresh = function(_data) {
 		this.__id.innerText = _data.id;
 		this.__type.innerText = _data.typeName;
 		this.__operator.innerText = _data.createrName;
 		this.__createTime.innerText = nej.u._$format(_data.createTime, 'yyyy-MM-dd HH:mm:ss');
 	};
 	
 	_proPItem.__editMold = function(_event) {
 		haitao.g.editType(0, this.__data.id, this.__data.typeName, null, null, _event);
 	};
 	
 	_proPItem.__delMold = function(_event) {
 		haitao.g.delType(0, this.__data.id,_event);
 	};
 	
 	_proPItem.__generateSubMold = function(_event){
 		var _activeElems = nej.e._$getByClassName(this.__body.parentNode, 'active');
 		for(var i=0,l=_activeElems.length; i<l; i++) {
 			_activeElems[i].className = '';
 		}

 		this.__body.className = 'active';
 		haitao.g.generateSubMold(this.__data, this.__index);
 	};
 	
 	new _p._$$Issue();
	
});