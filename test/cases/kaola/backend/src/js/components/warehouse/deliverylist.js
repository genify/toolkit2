/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./deliverylist.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util',
  'pro/widget/layer/warehouse/deliveryInfo/deliveryInfo'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_, DeliveryInfoWin){
  
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/period/getStockOutRule',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 8,
          pageNo: 1,
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
      this.data.offset = page*8;
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
    __getList :function(){
  	var data = this.data;
      var option = {
        progress: true,
        method:'GET',
        data: this.getListParam(),
        onload: function(_json){
          if(_json && _json.code == 200){
            list = _json.data.list||[];
            _.mergeList(list,data.list,data.key||'id')

            data.total = _json.data.total;
            data.list = list;
            data.isDefault = ["特殊","默认"];
            data.holidayDelay = ["否","是"];
            data.warehouseMap = window.warehouseMap;
            data.errmsg = null;
          }else{
            notify.showError(_json.message || '请求数据列表出错');
          } 
        },
        onerror: function(json){
          data.errmsg = json.message || '请求数据列表出错';
        }
      };
      this.$request(this.url,option)
    },
    /*addDeliveryInfo: function(data){
      DeliveryInfoWin._$allocate({info: data})._$show();
    }*/
    addDeliveryInfo: function(data, index){
      var _option = {
        info: data,
        index: index,
        onok: function(cbdata, index){
          if (!cbdata.id) {
            location.reload(true);
          }else{            
            ut.merge(this.data.list[index], cbdata);
          }
          this.$update();
        }._$bind(this)
      }
      DeliveryInfoWin._$allocate(_option)._$show();
    }
  });
  return List;
});