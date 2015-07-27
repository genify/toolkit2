/**
 * 获取待审批任务
 * author yuqijun(yuqijun@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./list.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_){
  var List = ListComponent.extend({
    template: tpl,
    config: function(data){
        ut.extend(data, {
          limit: 20,
          current: 1,
          list:[]
        });
        this.supr(data);
    },
    data:{
    	auditDelete:true,
    	auditmng:false,
    },
    getListParam:function(){
    	var data = this.data;
    	var tmp = _.extend({
    		limit:20,
    		isNext:true
    	},this.getExtraParam());
    	if(this.pageTime){
    		tmp.pageTime = this.pageTime;
    	}
    	return tmp;
    },
    prePage:function(){
    	this.isNext = false;
    	if(this.data.list.length){
    		var _date = this.data.list[0].date;
        	var pageTime = _u._$var2date(_date);
        	pageTime.setDate(pageTime.getDate()-1);
        	this.pageTime = _u._$format(pageTime,'yyyy-MM-dd');
        	this.$emit('updatelist');
    	} else{
    		delete this.pageTime;
    		notify.show('已经是第一页了');
    	}
    	this.$emit('updatelist');
    },
    refresh:function(_data){
    	this.isNext = true;
    	delete this.pageTime;
    	this.data.current = 1;
        this.data.pageNo = 1;
        this.data.condition = _data;
        this.$emit('updatelist');
    },
    nextPage:function(){
    	this.isNext = true;
    	if(this.data.list.length){
    		var _date = this.data.list[this.data.list.length-1].date;
        	var pageTime = _u._$var2date(_date);
        	pageTime.setDate(pageTime.getDate()+1);
        	this.pageTime = _u._$format(pageTime,'yyyy-MM-dd');
        	this.$emit('updatelist');
    	} else{
    		delete this.pageTime;
    		notify.show('已经是最后一页了')
    	}
    	
    	
    },
    __getList :function(){
    	var data = this.data;
        var option = {
          progress: true,
          method:'GET',
          data: this.getListParam(),
          onload: function(result){
              list = result.data.arrivalPlanList||[];
            _.mergeList(list, data.list,data.key||'id')
            data.total = result.data.total;
            data.list = list;
            data.inTransitSkuCount =  result.data.inTransitSkuCount;
            data.inTransitGoodCount =  result.data.inTransitGoodCount;
            data.inTransitContainerCount =  result.data.inTransitContainerCount;
            data.inTransitAmount =  result.data.inTransitAmount;
          },
          onerror: function(json){
        	  notify.show('请求失败');
          }
        };
        this.$request(this.data.url,option)
    },
    init: function(){
      this.supr();
    },
  });
  List.filter('auditStatus',function(_status){
  	var map = {1:"编辑中",
  			2:"经理审核中",
  			3:"经理驳回",
  			4:"总监审核中",
  			5:"总监驳回",
  			6:"总裁审核中",
  			7:"总裁驳回",
  			8:"合同待制定",
  			9:"跟单中" ,
  			10:"跟单完成",
  			11:"已取消",
  			'-1':"已删除"};
  			return map[_status];
  })
  List.filter('purchaseType',function(_type){
  	var map = {1:"编辑中",
  			2:"经理审核中",
  			3:"经理驳回",
  			4:"总监审核中",
  			5:"总监驳回",
  			6:"总裁审核中",
  			7:"总裁驳回",
  			8:"合同待制定",
  			9:"跟单中" ,
  			10:"跟单完成",
  			11:"已取消",
  			'-1':"已删除"};
  			return map[_status];
  });
  List.filter('currencyFormat',function(nStr){
	  	return _.currencyFormat(Math.round(nStr));
  });
  return List;

});