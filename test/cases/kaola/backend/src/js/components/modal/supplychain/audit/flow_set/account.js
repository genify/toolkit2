/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./account.html',
  'pro/components/modal/modal',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'base/element',
  'util/ajax/xdr',
  'pro/components/notify/notify'
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


	var AcountModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		account:'',
    		title:'添加账号',
    		level:'',
    		width:340,
    	},
    	init:function(){
    		this.supr();
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	if(!this.data.account){
        		notify.show('请输入帐号');
        	} else{
        		this.$request('/backend/audit/flow/account/add',{
            		method:'POST',
            		data:{
            			flowLevel:this.data.level,
            			account:this.data.account
            		},
            		onload:function(_json){
            			if(_json.code==200){
            				notify.show('添加帐号成功');
            				this.$emit('confirm',this.data.account);
            				 this.destroy();
            			} else{
            				notify.show(_json.message);
            			}
            		}._$bind(this),
            		onerror:function(){
            			notify.show('添加帐号失败')
            		}
            	})
        	
        	}
        }
    })

    
  return AcountModal;
})
