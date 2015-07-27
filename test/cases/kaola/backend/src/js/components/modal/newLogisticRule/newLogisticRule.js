/*
 * --------------------------------------------
 * 新建|编辑 物流规则弹窗组件
 * @version  1.0
 * @author   luzhongfang(luzhongfang@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./newLogisticRule.html',
  '../modal.js',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'util/ajax/xdr',
  'pro/components/notify/notify'
  ], function(tpl,Modal,s,_,ui,v,ut,j,notify){

  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */

	var LogisticsModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'新增',
    		type:1,
        criticalHour:"0",
        criticalMinute:"00",
        deadlineHour1:"0",
        deadlineMinute1:"00",
        deadlineHour2:"0",
        deadlineMinute2:"00",        
        item:{},
        companyList: window.companyList || []
    	},    	
     config:function(_data){
    	 if(_data.item.availableStart){
    		 _data.item.availableStart =  _data.item.availableStart.split(' ')[0];
    	 }
    	 if(_data.item.availableEnd){
    		 _data.item.availableEnd =  _data.item.availableEnd.split(' ')[0];
    	 }
     },
      close:function(item){
          this.$emit('close');
          this.destroy();
      },
      confirm:function(){
        var data = this.data;
        var item = this.data.item; 
        var url = '';
        if(item.isDefault == 0){
          if(!item.availableStart){
            notify.showError('请设置生效日期');
            return false;
          }
          if(!item.availableEnd){
            notify.showError('请设置失效日期');
            return false;
          }
          if(item.availableStart>item.availableEnd){
            notify.showError('生效日期必须早于失效日期');
            return false;          
          }
        }
        if(parseInt(item.delayDay1)!=0 && !parseInt(item.delayDay1)){
            notify.showError('揽收后延天数不能为空且必须是整数');
            return false;          
        }
        if(parseInt(item.delayDay2)!=0 && !parseInt(item.delayDay2)){
            notify.showError('揽收后延天数不能为空且必须是整数');
            return false;          
        } 
        item.criticalTime = data.criticalHour+":"+data.criticalMinute;
        item.delayTimeDeadline1 = data.deadlineHour1+":"+data.deadlineMinute1;
        item.delayTimeDeadline2 = data.deadlineHour2+":"+data.deadlineMinute2;
          
    		if(data.type==2){
    			url = '/backend/dw/period/updatePickupRule';
    		} else{
    			url = '/backend/dw/period/addPickupRule';
    		}
      		
    		this.$request(url,{
    			data:item,
    			method:'POST',
    			onload:function(json){
    				if(json && json.code==200){
    					notify.show(json.message || '操作成功！');
    					this.$emit('confirm',item);
    					this.destroy();
    				} else{
    					notify.showError(json.message || '操作失败！');
    				}
    			}._$bind(this),
    			onerror:function(json){
              notify.show(json.message || '请求失败，稍后再试！');
    			}
    		}); 
      },
      datePick:function(evt,type){
        v._$stop(evt);
        var item = this.data.item;
        var timeVal = type==1?item.availableStart:item.availableEnd;
        var selDate = timeVal?new Date(timeVal):new Date();
        var datepick = ui._$$DatePick._$allocate({
            parent:evt.target.parentNode,
            clazz:'datapick',
            // 默认选中日期
            date:selDate,
            // 设置日期的可选范围
            onchange:function(date){
              type==1?item.availableStart=ut._$format(date,'yyyy-MM-dd'):item.availableEnd=ut._$format(date,'yyyy-MM-dd');
              this.$update();
            }._$bind(this)
        });
      }
  });
    
  return LogisticsModal;
})
