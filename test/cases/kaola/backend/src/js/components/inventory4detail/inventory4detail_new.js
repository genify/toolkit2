/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./inventory4detail_new.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/widget/layer/dialog/dialog',
  'pro/widget/layer/create.version/create.version',
  'pro/widget/layer/view.version/view.version',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,Window,CreateVersionWin,ViewVersion,notify,config,_){
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/stat/getInventory4DetailList',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
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
          method:'POST',
          data: this.getListParam(),
          onload: function(json){
            var result = json.data,
              list = result.list||[];
            _.mergeList(list, data.list,data.key||'id')

            data.total = result.total;
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