/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./email.html',
  '../modal.js',
  'util/file/select',
  'pro/base/util',
  'base/event',
  'base/util',
  'util/ajax/xdr',
  'pro/components/notify/notify'
  ], function(tpl, Modal, _,_v,_ut,_j,notify){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var NewMailUserModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'email地址',
    		type:1,
    		user:{}
    	},
    	
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	//this.$emit('confirm', this.data.product);
        	//this.destroy();
        	var pass = true;
        	if(!this.data.user.email){
        		notify.showError('写填写邮箱地址');
        		pass = false;
        	}
        	if(pass){
        		this.$emit('confirm',this.data.user.email);
				this.destroy();
        	}
        }
    })

  return NewMailUserModal;
})