/**
 * 物流时效管理 - 揽投列表
 * Created by luzhongfang on 2015/05/16.
 */

define([
  'base/element',
  'base/util',
  'pro/base/util',
  'text!./lanTouList.html',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/components/modal/newLogisticRule/newLogisticRule',
  'pro/components/modal/sureWindow/sure',
  'pro/base/config',
  'pro/base/util'
  ], function(e,u,ut,tpl,ListComponent,notify,newRuleModal,Sure,config,_){
  
  // 揽投时效管理列表
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/period/getPickupRule',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
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
      var time1 = item.criticalTime.split(":");
      var time2 = item.delayTimeDeadline1.split(":");
      var time3 = item.delayTimeDeadline2.split(":");
    	var modal =new newRuleModal({data:{type:2,title:'编辑',
          item:item,
          criticalHour:time1[0],
          criticalMinute:time1[1],
          deadlineHour1:time2[0],
          deadlineMinute1:time2[1],
          deadlineHour2:time3[0],
          deadlineMinute2:time3[1]
    	}});
    	modal.$on('confirm',function(item){
    		this.$update();
    	}._$bind(this));
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
            var list = result.data.list||[];
            _.mergeList(list, data.list,data.key||'id')

            data.total = result.data.total;
            data.list = list;
            data.ruleType = ["特殊","默认"];
            data.delay = ["否","是"];
            data.companyMap = window.companyMap;
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