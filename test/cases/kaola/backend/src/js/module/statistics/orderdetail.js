/**
 * 供应链数据统计报表--订单明细表
 * Created by wjf on 5/16/15.
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
 		'pro/base/config',
 		'pro/components/dw/orderdetailList',
 		'pro/components/modal/emailList/email',
	 	'pro/components/notify/notify'
 	], function(_k, _e, _v, _t, _ut, _, request, _t2, _t1, config, List,EmailModal,notify,_p){
 		_p._$$Module = _k._$klass();
 		_pro = _p._$$Module._$extend(_t2._$$MModule);

 		_pro.__init = function(_options){
 			this.__super(_options);
 			this.__initNodes();
 			this.__initForm();
 			this.__initEvent();
 		};

 		_pro.__initNodes = function(){
 			this.__searchForm = _e._$get('searchForm');
 			this.__exportBtn = this.__searchForm.exportData;
 		};
 		_pro.__filterData = function(_data){
 			var date = new Date();
 			if(!_data.start){
 				_data.start = 0;
 			}
 			if(!_data.end){
 				_data.end = date.valueOf();
 			}

 		};
 		_pro.__initForm = function(){
 			this.webForm = _t1._$$WebForm._$allocate({form:'searchForm', onsubmit:function(_data){
 				
 				this.__filterData(_data);
 				if(!this.__list){
 					this.__list = new List({data:{condition:_data}});
 					this.__list.$inject(_e._$get('list'));
 				} else {
 					this.__list.refresh(_data);
 				}
 			}._$bind(this)});
 		};

 		_pro.__initEvent = function(){
 			_v._$addEvent(this.__exportBtn, 'click', this.__onExportClick._$bind(this));
 		};

 		_pro.__onExportClick = function(event){
    	_v._$stop(event);
    	var modal = new EmailModal();
    	modal.$on('confirm',function(_email){
    		var data = this.webForm._$data();
    		this.__filterData(data)
    		data.emailList = _email;
			request('/backend/dw/stat/exportOrderDelivery',{
				data:_ut._$object2query(data),
				method:'POST',
				norest:true,
				type:'json',
				onload:function(_json) {
					if (_json.code == 200) {
						notify.show('导出成功');
					}
				}
			})
    	}._$bind(this))
    	
    }

 		_p._$$Module._$allocate();
 	})