/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./flow_set.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util',
  'pro/components/modal/supplychain/audit/flow_set/account',
  'pro/components/modal/sureWindow/sure'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_,AccountModal,ConfirmModal){
  var List = ListComponent.extend({
    template: tpl,
    data:{
    	flowLevelList:[]
    },
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
    },
    onOperate:function(_type,_level,_item){
    	var map ={'100':'经理',
			  '200':'总监',
			  '300':'总裁'};
    	if(_type==0){
	    	var model = new ConfirmModal({data:{desc:'<h3 class="title">确认要半闭'+map[_level]+'审核吗?<h3><br/>关闭后采购单不会经过'+map[_level]+'审核，直接进入下一环节',title:'提示'}});
	    	model.$on('confirm',function(){
		    	this.$request('/backend/audit/flow/level/delete',{
		    		data:{flowLevel:_level},
		    		type:'json',
		    		method:'DELETE',
		    		onload:function(_json){
		    			if(_json.code==200){
		    				_item.disable = true;
		    				notify.show('关闭成功');
		    				this.$update();
		    			}
		    		}._$bind(this),
		    		onerror:function(_json){
		    			notify.show('关闭失败');
		    		}._$bind(this)
		    	})
	    	}._$bind(this))
    	} else{
    		var model = new ConfirmModal({data:{desc:'<h3 class="title">确认要 开启'+map[_level]+'审核吗?<h3><br/>开启后采购单会经过'+map[_level]+'审核，才能进入下一环节',title:'提示'}});
	    	model.$on('confirm',function(){
		    	this.$request('/backend/audit/flow/level/add',{
		    		data:{flowLevel:_level},
		    		type:'json',
		    		method:'POST',
		    		onload:function(_json){
		    			if(_json.code==200){
		    				_item.disable = false;
		    				notify.show('开启成功');
		    				this.$update();
		    			}
		    		}._$bind(this),
		    		onerror:function(_json){
		    			notify.show('开启失败');
		    		}._$bind(this)
		    		
		    	})
	    	}._$bind(this))
    	}
    },
    onAddAccount:function(_list,_level){
    	var modal = new AccountModal({data:{level:_level}});
    	modal.$on('confirm',function(_list,_account){
    		_list.push(_account);
    		this.$update();
    	}._$bind(this,_list))
    },
    init: function(){
      this.supr();
    },
    onRemoveAccount:function(_list,_level,_account,_index){
    	var modal = new ConfirmModal({data:{desc:'<h3 class="title">确定删除该帐号？</h3>',title:'提示',width:400}});
    	modal.$on('confirm',function(){
    	this.$request('/backend/audit/flow/account/delete',{
    		method:'DELETE',
    		data:{
    			flowLevel:_level,
    			account:_account
    		},
    		onload:function(_list,_index,_json){
    			if(_json.code==200){
    				notify.show('删除成功');
    				_list.splice(_index,1);
    			} else{
    				notify.show('删除失败')
    			}
    		}._$bind(this,_list,_index),
    		onerror:function(){
    			notify.show('删除失败')
    		}
    		})
	   }._$bind(this))
    }
  });
  List.filter('level',function(_level){
	  var map ={
			  '100':'经理审批设置',
			  '200':'总监审批设置',
			  '300':'总裁审批设置'
	  }
	  return map[_level];
  })
  return List;

});