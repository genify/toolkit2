/**
 * 订单监控
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./storageMonitor.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/widget/layer/dialog/dialog',
  'pro/widget/layer/create.version/create.version',
  'pro/widget/layer/view.version/view.version',
  'pro/components/notify/notify',
  'pro/base/config',
  ], function(_e,_u,tpl,ut,ListComponent,Window,CreateVersionWin,ViewVersion,notify,config){
  var List = ListComponent.extend({
    template: tpl,
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0
        });
    },
    xdrOption:function(){
    	return {method:"post"};
    },
    init: function(){
      this.supr();
      this.getList();
    },
    pageChange: function(page){
      this.data.offset = (page-1)*50;
      this.data.pageNo = page-1;
      this.getList();
    },
    getList :function(){
      var data = this.data, self = this;
      this.$request('/backend/dw/orderMonitor/searchOrderStorageStat',{
        data:_u._$object2query({
          "start":data.start,
          "end":data.end,
          "importType":data.importType,
          "storageId":data.storageId,
          "limit":data.limit,
          "offset":data.offset
        }),
        onload:function(_json){
          if(_json.code == 200){
            self.data.noData = "";
            if(_json.data && _json.data.total == 0){
              self.data.noData = "true";
            }
            self.data.total = _json.data.total;
            self.data.list = _json.data.list;
            self.data.current = self.data.pageNo+1;
            self.$update();
            var ul = _e._$getByClassName(_e._$get("list"),"m-pagination")[0];
            _u._$forEach(_e._$getChildren(ul), function(li){
              li.style.background="";
              if(_e._$hasClassName(li,"active")){
                li.style.background="#add8e6";
              }
            });
          }else{
            Window._$allocate({cnt:_json.message})._$show();
          }
        }
      });

      // nej.j._$haitaoDWR(
      //     'InvoicingBean',
      //     'searchInventory4Detail',
      //     [data.goodsId,data.type,data.from,data.to,data.limit,data.offset],
      //     function(_json){
      //       if(_json.code == 200){
      //         self.data.noData = "";
      //         if(_json.result.total == 0){
      //           self.data.noData = "true";
      //         }
      //         self.data.total = _json.result.total;
      //         self.data.list = _json.result.list;
      //         self.data.current = self.data.pageNo+1;
      //         self.$update();
      //         var ul = _e._$getByClassName(_e._$get("list"),"m-pagination")[0];
      //         _u._$forEach(_e._$getChildren(ul), function(li){
      //           li.style.background="";
      //           if(_e._$hasClassName(li,"active")){
      //             li.style.background="#add8e6";
      //           }
      //         });
      //       }else{
      //         Window._$allocate({cnt:'查询错误！'})._$show();
      //       }
      //     }
      // );

    }

  });
  return List;

});