/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./newMailUser.html',
  '../modal.js',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'util/ajax/xdr',
  'pro/components/notify/notify'
  ], function(tpl, Modal,s, _,_ui,_v,_ut,_j,notify){


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
    		title:'新增联系人',
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
        	if(!this.data.user.name){
        		notify.showError('写填写用户姓名');
        		pass = false;
        	}
        	if(!this.data.user.email){
        		notify.showError('写填写邮箱地址');
        		pass = false;
        	}
        	if(pass){
        		var url;
        		if(this.data.type==1){
        			url = '/backend/dw/warningEmail/add';
        		} else{
        			url = '/backend/dw/warningEmail/update';
        		}
        		this.$request(url,{
        			data:this.data.user,
        			method:'POST',
        			onload:function(_json){
        				if(_json.code==200){
        					this.$emit('confirm',{name:this.data.user.name,email:this.data.user.email});
        					this.destroy();
        				} else{
        					notify.showError(_json.message);
        				}
        			},
        			onerror:function(){
        				
        			}
        		})
        	}
        }
    })

  return NewMailUserModal;
})