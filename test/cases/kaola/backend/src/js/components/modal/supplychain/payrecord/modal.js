/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./modal.html',
  'pro/components/modal/modal',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'base/element',
  'util/ajax/xdr',
  'pro/components/notify/notify',
  'util/form/form'
  ], function(tpl, Modal,s, _,_ui,_v,_ut,_e,_j,notify,_t1){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var PayRecordModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'修改付款记录',
    		width:1020,
    		list:[],
    		currencyTypeList:window.currencyTypeList,
    		auditId:''
    	},
    	init:function(){
    		this.supr();
    	},
    	onAddPayRecord:function(){
    		this.data.list.push({});
    	},
    	removeRecord:function(_index){
    		this.data.list.splice(_index,1);
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	var list = this.data.list,result =[];
        	for(var i=0,l=list.length;i<l;i++){
        		if(list[i].amount&&list[i].bankTrace){
        			list[i].currencyTypeStr = this.$refs['currencyType_'+i].options[this.$refs['currencyType_'+i].selectedIndex].text;
        			result.push(list[i])
        		}
        	}
        	var _url = '/backend/myAudit/savePayRecord';
        	if(role=='admin'){
        		_url = '/backend/auditMng/savePayRecord'
        	}
        	this.$request(_url,{
        		data:{
        			auditId:this.data.auditId,
        			payList:this.data.list
        		},
				headers:{auditId:this.data.auditId},
        		method:'POST',
        		onload:function(_json){
        			if(_json.code==200){
        				notify.show('添加成功');
        				this.$emit('confirm',result);
        	    		this.destroy();
        			} else{
        				notify.show(_json.message)
        			}
        		}._$bind(this),
        		onerror:function(){
        			notify.show('添加失败')
        		}
        	})
        	
        }
    })

    
  return PayRecordModal;
})
