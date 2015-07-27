/**
 * 订单明细-列表组件
 * author wjf(hzwujingfei@corp.netease.com)
 */

 define([
 		'base/element',
 		'base/util',
 		'text!./orderdetailList.html',
 		'pro/base/util',
 		'../ListComponent.js',
 		'pro/components/notify/notify',
 		'pro/base/util'
 	], function(_e, _u, tpl, ut, ListComponent, notify, _){
 		var List = ListComponent.extend({
 			template: tpl,
 			url: '/backend/dw/stat/searchOrderDelivery',
 			config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
    	},
 			init: function(){
 				this.supr();
 				this.__getList();
 			},
 			pageChange: function(page){
	      this.data.offset = (page-1)*50;
	      this.data.pageNo = page;
	      this.__getList();
	    },
 			getListParam: function(){
        var data = this.data;
        return _.extend({
            	pageSize: data.limit,
            	pageNo: data.pageNo
          }, this.getExtraParam(data));
      },
		  __getList: function(){
		  	var data = this.data;
		  	var option = {
		  		progress: true,
		  		method: 'POST',
		  		data: this.getListParam(),
		  		onload: function(json){
		  			var result = json.data,
		  					list = result.list || [];
		  			_.mergeList(List, data.list, data.key || 'id')
		  			data.total = result.total;
		  			data.list = list;
		  		},
		  		onerror: function(json){

		  		}
		  	};
		  	this.$request(this.url,option);
		  }
 		});

 		return List;
 	})