/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./list.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_){
  
  var List = ListComponent.extend({
    template: tpl,
    url:'http://localhost:8000/backend/dw/period/warhouse/statics',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
    },
    data:{
    	warehouse:{}
    },
    xdrOption:function(){
    	return {method:"post"};
    },
    init: function(){
      this.supr();
      this.__getList();
    },
    pageChange: function(page){
      this.data.offset = page*50;
      this.data.pageNo = page;
      this.__getList();
    },
    exportDailyOrders:function(item){
    	window.open('/dw/stat/storageOutSts/dailyabnormal?date='+ item.date);
    },
    exportAbnormalData:function(){
    	window.open('/dw/stat/storageOutSts/abnormal?'+ _ut._$object2query(this.data.condition));
    },
    exportStaticsDat:function(){
    	window.open('/dw/stat/storageOutSts/statics?'+ _ut._$object2query(this.data.condition));
    },
    getListParam: function(){
        var data = this.data;
        return _.extend({
            	pageSize: data.limit,
            	pageNo: data.pageNo
          }, this.getExtraParam(data));
      },
      __getList :function(){
    	var data = this.data;
        var option = {
          progress: true,
          method:'GET',
          data: this.getListParam(),
          onload: function(_json){
              list = _json.body.list||[];
              _.mergeList(list,data.list,data.key||'id')
              _.merge(data.warehouse, _json.body.warehouse)
              data.total = _json.body.total;
              data.list = list;
          },
          onerror: function(json){
            // @TODO: remove
          }
        };
        this.$request(this.url,option)
    }

  });
  return List;

});