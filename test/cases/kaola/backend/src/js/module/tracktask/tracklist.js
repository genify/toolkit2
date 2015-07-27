/**
 * 跟单列表页
 * Created by wjf on 6/29/15.
 */
 
 NEJ.define([
 		'base/klass',
 		'base/element',
 		'base/event',
 		'util/event',
 		'base/util',
 		'pro/base/util',
 		'pro/base/request',
 		'pro/widget/module',
 		'pro/widget/form',
 		'pro/components/relateRecord/tasktrack/list',
 		'pro/components/modal/emailList/email',
	 	'pro/components/notify/notify'
 	], function(_k, _e, _v, _t, _ut, _, request, _t2, _t1, List,EmailModal,notify,_p){
 		_p._$$TaskTrackModule = _k._$klass();
 		_pro = _p._$$TaskTrackModule._$extend(_t2._$$MModule);
 
 		_pro.__init = function(_options){
 			this.__super(_options);
 			this.__initNodes();
 			this.__initForm();
 			this.__initEvent();
 		};
 
 		_pro.__initNodes = function(){
 			var list = _e._$getByClassName('searchForm', 'j-flag');
 			this.__exportBtn = list[0];
 			this.__tabList = _e._$getByClassName('tabbox', 'j-flag');
 		};

 		_pro.__initForm = function(){
 			this.webForm = _t1._$$WebForm._$allocate({form:'searchForm', onsubmit:function(_data){
 				this.__setType(_data);
 				if(!this.__list){
 					this.__list = new List({data:{condition:_data}});
 					this.__list.$inject(_e._$get('listbox'));
 				} else {
 					this.__list.refresh(_data);
 				}
 			}._$bind(this)});
 		};

 		_pro.__setType = function(data){
 			for(var i=0, len=this.__tabList.length; i < len; i++){
 				if(_e._$hasClassName(this.__tabList[i], 'active') && _e._$dataset(this.__tabList[i], 'type')){
 					data.trackTaskType = _e._$dataset(this.__tabList[i], 'type');
 				}
 			}
 		};

 		_pro.__initEvent = function(){
 			_v._$addEvent(this.__exportBtn, 'click', this.__onExportClick._$bind(this));
 			_v._$addEvent('tabbox', 'click', this.__onTabClick._$bind(this));
 		};

 		_pro.__onTabClick = function(event){
 			var elm = event.target;
 			if(_e._$hasClassName(elm, 'tab') && !_e._$hasClassName(elm, 'active')){
 				for(var i=0, len=this.__tabList.length; i<len; i++){
 					_e._$delClassName(this.__tabList[i], 'active');
 				};
 				_e._$addClassName(elm, 'active');
 				this.__initForm();
 			}
 			var _type = _e._$dataset(elm,'type');
 			if(_type==1){
 				_e._$delClassName(this.__exportBtn,'f-dn')
 			} else{
 				_e._$addClassName(this.__exportBtn,'f-dn')
 			}
 		};
 
 		_pro.__onExportClick = function(event){
	    	_v._$stop(event);
	    	request('/backend/supplychain/tracktask/exportTrackingTasks',{
	    		data: {},
	    		norest: true,
	    		method: 'POST',
	    		type: 'json',
	    		onload: function(json){
	    			if(json.code == 200){
	    				notify.show(json.message);
	    				window.location.href = json.data.trackTaskUrl;
	    			}else{
	    				notify.show('导出失败');
	    			}
	    		},
	    		onerror: function(json){
	    			notify.show('导出失败');
	    		}
	    	})

	    	// var modal = new EmailModal();
	   		//  	modal.$on('confirm',function(_email){
				// request('/backend/supplychain/tracktask/exportTrackingTasks',{
				// 	data:_ut._$object2query({emailList:_email}),
				// 	norest:true,
				// 	method:'POST',
				// 	type:'json',
				// 	onload:function(_json) {
				// 		if (_json.code == 200) {
				// 			notify.show(_json.message);
				// 		}
				// 	}
				// })
	   //  	}._$bind(this))
	    	
	    }
 
 		_p._$$TaskTrackModule._$allocate();
 	})