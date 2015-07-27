/**
 * 订单监控
 * Created by mating on 2015/05/11.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/widget/form',
    'pro/base/config',
    'pro/components/dw/storageMonitor'
], function(_k,_e, _v, _t,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
	// var channals ={};

    _p._$$storageMonitor = _k._$klass();
    _pro = _p._$$storageMonitor._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		var __searchForm = _e._$get('searchForm');
		var exportParamFilter = function (searchForm){
			var param = {};
			var item = ["importType","storageId","start","end"];
			item.forEach(function(i){
				param[i] = !searchForm[i].value? "" : searchForm[i].value;
				if(i=="start"||i=="end"){
					var d;
					if(param[i] == ""){
						d = i=="start"?(new Date(+new Date() - 604800000)):new Date();
					}else{
						d = new Date(param[i]);
					}
					param[i] = d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
				}
			});
			return nej.u._$object2query(param);
		}
		_v._$addEvent(
    		'export','click',function(_event){
    			var data = exportParamFilter(__searchForm);
    			window.location.href = "/backend/dw/orderMonitor/exportOrderStorageStat?"+data;
    		},false
		);
		_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
			var filterDate = function (data){
				var item = ["importType","storageId","start","end"];
				item.forEach(function(i){
					if(!data[i]){
						data[i] = "";
					}
					//if(i=="start"||i=="end"){
					//	var d = new Date(data[i]);
					//	data[i] = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
					//}
					if(i=="start"||i=="end"){
						var d;
						if(data[i] == ""){
							d = i=="start"?(new Date(+new Date() - 604800000)):new Date();
						}else{
							d = new Date(data[i]);
						}
						data[i] = d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
					}
				});
			}
			filterDate(_data);
			if(!this.__list){
				var self = this;
				this.__list = new List({data:_data});
				this.__list.$inject(_e._$get('list'));
			} else{
				_.extend(this.__list.data, _data, true);
				_.extend(this.__list.data, {offset: 0,limit: 50,pageNo: 0}, true);
				this.__list.getList();
			}
		}});
	};
    _pro.__onPageChange = function(page){
    	
    };

    _p._$$storageMonitor._$allocate();
});