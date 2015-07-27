/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./config.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util',
  'pro/components/modal/supplychain/warehouseModal/modal',
  'pro/components/modal/sureWindow/sure'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_,WarehouseModal,ConfirmModal){
  var List = ListComponent.extend({
    template: tpl,
    data:{
    	relateRecordConfigsList:[],
		recordRelateConfigsList:[],
		onlyRelateConfigsList:[],
		warehouseList:warehouseList
    },
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
    },
    onRemoveStorage:function(list,_index,_id){
    	var modal = new ConfirmModal({data:{desc:'<h3 class="title">确定删除该仓库？</h3>',title:'提示',width:400}});
    	modal.$on('confirm',function(){
	    	this.$request('/backend/relateRecord/deleteConfig',{
	    		data:{id:_id},
	    		type:'json',
	    		onload:function(list,_index,_json){
	    			if(_json.code==200){
	    				list.splice(_index,1);
	    				notify.show('删除成功');
	    				this.$update();
	    			}
	    		}._$bind(this,list,_index),
	    		onerror:function(_json){
	    			notify.show('删除失败');
	    		}._$bind(this)
			})
    	}._$bind(this))
    },
    onAddStorage:function(_type){
    	var modal = new WarehouseModal({data:{warehouseList:this.data.warehouseList,type:_type}});
    	modal.$on('confirm',function(warehouse){
    		if(_type==1){
    			this.data.relateRecordConfigsList.push(warehouse)
    		} else if(_type==2){
    			this.data.recordRelateConfigsList.push(warehouse)
    		}else if(_type==3){
    			this.data.onlyRelateConfigsList.push(warehouse)
    		}
    		this.$update();
    	}._$bind(this))
    },
    init: function(){
      this.supr();
    },
    removeContract:function(_index){
    	this.data.list.splice(_index,1);
    }
  });
  
  return List;

});