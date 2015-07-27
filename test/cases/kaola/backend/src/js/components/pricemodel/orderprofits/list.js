/**
 * 订单利润分析
 * author hzjiangren(hzjiangren@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./list.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/widget/layer/dialog/dialog',
  'pro/widget/layer/create.version/create.version',
  'pro/widget/layer/view.version/view.version',
  'pro/components/notify/notify',
  'pro/base/config',
  ], function(_e,_u,tpl,ut,ListComponent,Window,CreateVersionWin,ViewVersion,notify,config){
  var List = ListComponent.extend({
    url:'/backend/salesreport/orderprofits/index',
    // url:'/backend/src/js/components/pricemodel/orderprofits/data.json',
    template: tpl,
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0
        });
    },

    init: function(){
      this.supr();
      this.getList();
    },

    pageChange: function(page){
      // this.data.offset = (page-1)*50;
      this.data.pageNo = page-1;
      this.getList();
    },

    getList :function(){
      var data = this.data;

      this.$request(this.url,{
        data:_u._$object2query({
          "start":data.start,
          "end":data.end,
          "importType":data.importType,
          "storageId":data.storageId,
          "payMethod":this.data.payMethod,
          "limit":data.limit,
          "current":data.pageNo
        }),
        type:'POST',
        onload:function(_json){
          if(_json.code == 200){
            this.data.total = _json.total;
            this.data.current = this.data.pageNo+1;
            for(var i=0, l=_json.profits.length; i<l; i++) {
              _json.profits[i].finxedprofitRate = parseInt(_json.profits[i].profitRate*100)/100;
            }
            this.data.list = _json.profits;
          }else{
            // Window._$allocate({cnt:_json.message})._$show();
          }
        }._$bind(this),
        onerror:function(_json){
          // alert(0);
        }
      });
    },

    exportItem : function(item, index) {
      var param = {
        date: nej.u._$format(item.analyzeTime,'yyyy-MM-dd'),
        importType: item.importType||'',
        storageId: item.storageId||'',
        payMethod: item.payMethod||''
      }, paramString = _u._$object2query(param);

      window.location.href = "/backend/salesreport/orderprofits/exportDetail?"+paramString;
    },

    exportAll : function() {
      var param = {
          "start":nej.u._$format(this.data.start,'yyyy-MM-dd'),
          "end":nej.u._$format(this.data.end,'yyyy-MM-dd'),
          "importType":this.data.importType||'',
          "storageId":this.data.storageId||'',
          "payMethod":this.data.payMethod||''
        }, paramString = _u._$object2query(param);

        window.location.href = "/backend/salesreport/orderprofits/exportReport?"+paramString;
    }

  });
  return List;

});
