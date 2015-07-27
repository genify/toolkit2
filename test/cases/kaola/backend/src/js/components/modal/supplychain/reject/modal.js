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
  ], function(tpl, Modal,s, _,_ui,_v,_ut,_e,_j,notify){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var RejectModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'驳回',
    		width:430,
    		type:0,
    		auditId:'',
    		remark:''
    	},
    	init:function(){
    		this.supr();
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	if(!this.data.remark){
        		notify.show('请输入备注')
        	} else{
        		this.$emit('confirm',this.data.remark);
        		this.destroy();
        	}
        }
    })

    
  return RejectModal;
})
