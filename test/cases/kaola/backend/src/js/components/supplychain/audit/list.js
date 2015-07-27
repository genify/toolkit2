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
  'pro/base/util',
  'pro/components/modal/sureWindow/sure'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_,ConfirmModal){
  var List = ListComponent.extend({
    template: tpl,
    config: function(data){
        ut.extend(data, {
          pageSize: 20,
          current: 1,
          list:[]
        });
        this.supr(data);
    },
    data:{
    	type:1      //都用type来表示，1为审批单管理，2为审批任务，3为我的审批单列表
    },
    getListParam:function(){
    	var data = this.data;
    	return _.extend({
    		pageSize:20,
    		pageNo:data.current||1
    	},this.getExtraParam())
    },
    removeAudit:function(_index){
    	var list = this.data.list,
    		item = this.data.list[_index],
    		url = '/backend/myAuditList/task/delete';
    	if(role=='admin'){
    		url = '/backend/auditMng/task/delete'
    	}
    		
    	var model = new ConfirmModal({data:{desc:'<h3 class="title">确定要删除:<span class="orange">'+item.auditNo+'</span>这笔审批单吗？',title:'提示'}});
    	model.$on('confirm',function(){
    		this.$request(url,{
        		method:'delete',
        		data:{id:item.id},
        		headers:{auditId:item.id},
        		onload:function(_json){
        			if(_json.code==200){
        				notify.show('删除成功');
        				list.splice(_index,1);
        				this.$update();
        			} else{
        				notify.show(_json.message);
        			}
        		}._$bind(this),
        		onerror:function(){
        			notify.show('删除失败');
        		}
        	})
    	}._$bind(this))
    	
    	
    	
    },
    __getList :function(){
    	var data = this.data;
        var option = {
          progress: true,
          method:'GET',
          data: this.getListParam(),
          onload: function(result){
              list = result.data.body||[];
            _.mergeList(list, data.list,data.key||'id')
            data.total = result.data.total;
            data.list = list;
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
  })
  
  return List;

});