/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./holiday.html',
  '../modal.js',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'pro/components/notify/notify'
  ], function(tpl, Modal,s, _,_ui,_v,_ut,notify){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var ExportSupplyModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'设置假期名称',
    		date:'',
    		name:'',
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	this.$request('/backend/dw/period/holiday/add',{
        		data:_ut._$object2query({
        			date:_ut._$var2date(this.data.date).getTime(),
        			name:this.data.name
        		}),
        		method:'POST',
        		type:'json',
        		norest:true,
        		onload:function(_json){
        			if(_json.code==200){
        				notify.show('设置成功')
        				this.$emit('confirm',this.data.name,this.data.date);
        				this.destroy();
        			}
        		}._$bind(this)
        	})
        	
        }
    })

  return ExportSupplyModal;

})