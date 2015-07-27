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
    'pro/components/pricemodel/orderprofits/list'
], function(_k,_e, _v, _t,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
	// var channals ={};

    _p._$$storageMonitor = _k._$klass();
    _pro = _p._$$storageMonitor._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		var __searchForm = _e._$get('searchForm');

		_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
			var filterDate = function (data){
				var item = ["importType","storageId","start","end","payMethod"];
				var form = this.__form.__form.children[0].children;
				item.forEach(function(i){
					if(!data[i]){
						data[i] = "";
					}

					if(i=="start"||i=="end"){
						var d;
						if(data[i] == ""){
							if(i=="end"){
								d = nej.u._$format(new Date(), 'yyyy-MM-dd');
								form[6].getElementsByTagName('input')[0].value = d;
							} else {
								var sdata = nej.u._$format(new Date(), 'yyyy-MM-dd');
								d = sdata.replace(/-\d{2}$/ig,'-01');
								form[4].getElementsByTagName('input')[0].value = d;
							}
						}else{
							d = nej.u._$format(data[i], 'yyyy-MM-dd');
						}
                        data[i] = d;
						// data[i] = d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
					}
				});
			}._$bind(this);
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