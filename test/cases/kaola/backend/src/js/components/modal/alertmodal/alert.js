/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./alert.html',
  './modal.js',
  'pro/base/util',
  ], function(tpl, Modal, _){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var SureModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'确认删除',
    		type:1,
    		desc:''
    	},
    	
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	this.$emit('confirm');
            this.destroy();
        }
    })

    
  return SureModal;
})