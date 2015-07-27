/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./alarmlist.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util',
  'pro/widget/layer/warehouse/personInfo/personInfo',
  'pro/widget/layer/warehouse/personInfo/deletePerson'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_, PersonInfoWin,DeletePersonWin){
  
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/warningEmail/get',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 5,
          pageNo: 1,
          warningType: 2,
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
      this.data.offset = page*5;
      this.data.pageNo = page;
      this.__getList();
    },
    removeItem:function(item,index){
    	var modal = new Sure({data:{desc:'确认删除该备货周期',title:'删除数据'}});
    	modal.$on('confirm',function(){
    	}._$bind(this))
    },
    getListParam: function(){
      var data = this.data;
      return _.extend({
          	pageSize: data.limit,
          	pageNo: data.pageNo,
            warningType: data.warningType
        }, this.getExtraParam(data));
    },
    __getList: function(){
  	var data = this.data;
      var option = {
        progress: true,
        method:'GET',
        data: this.getListParam(),
        onload: function(_json){
            list = _json.data.list||[];
            _.mergeList(list,data.list,data.key||'id')
            // _.merge(data.warehouse, _json.body.warehouse)
            data.total = _json.data.total;
            data.list = list;
        },
        onerror: function(json){
          // @TODO: remove
        }
      };
      this.$request(this.url,option)
    },
    addPersonInfo: function(data,index){
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
      PersonInfoWin._$allocate(_option)._$show();
    },
    deletePersonInfo: function(data,index){
      var _option = {
        info: data,
        index: index,
        onok: function(cbdata, index){
          this.data.list.splice(index,1);
          this.$update();
        }._$bind(this)
      }
      DeletePersonWin._$allocate(_option)._$show();
    }
  });
  return List;

});