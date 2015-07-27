/**
 * 物流时效管理 - 妥投列表
 * Created by luzhongfang on 2015/05/16.
 */

define([
  'base/element',
  'base/util',
  'pro/base/util',
  'text!./tuoTouList.html',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/components/modal/newLogistics/newLogistics',
  'pro/components/modal/sureWindow/sure',
  'pro/base/config',
  'pro/base/util'
  ], function(e,u,ut,tpl,ListComponent,notify,newLogisModal,Sure,config,_){
  
  // 妥投时效管理列表
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/period/duration/rules',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 30,
          pageNo: 1,
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
    updateItem:function(item,index){
      var modal =new newLogisModal({
        data:{type:2,
            title:'编辑物流公司',
            item:item,
            confirmTitle:'更新'
          }
        });
      modal.$on('confirm',function(item){
        this.$update();
      }._$bind(this))
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
        onload: function(result){
          if(result && result.code == 200){
            var list = result.data.body||[];
            _.mergeList(list, data.list,data.key||'id')

            data.total = result.data.total || 0;
            data.ruleNames = ["","默认","特殊"];
            data.delayMap = ["否","是"];
            data.companyMap = window.companyMap;
            data.list = list;
            data.errmsg = null;
          }else{
            notify.showError(result.message || '请求数据列表出错');
          }
        },
        onerror: function(json){
          data.errmsg = json.message || '请求数据列表出错';
        }
      };
      this.$request(this.url,option)
    }
  });
  return List;
});