/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
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
  'ui/datepick/datepick',
  ], function(tpl, Modal,s, _,_ui,_v,_ut,_e,_j,notify,_ut0){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var DatepickModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'修改日期',
    		width:430,
    		date:''
    	},
    	init:function(){
    		this.supr();
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        datepick:function(_event){
        	var target = _event.target
        	_v._$stop(_event.event);
    		if(this.__datepick){
    			this.__datepick = this.__datepick._$recycle();
    		}
    		this.__datepick = _ut0._$$DatePick._$allocate({
    								parent:target.parentNode,
    								clazz:'datepick',
    								date:this.data.date,
    								onchange:function(_date){
    									this.data.date = _ut._$format(_date,'yyyy-MM-dd');
    									this.$update();
    								}._$bind(this)
    							})
        },
        confirm:function(){
        		this.$emit('confirm',this.data.date);
        		this.destroy();
        }
    })

    
  return DatepickModal;
})
