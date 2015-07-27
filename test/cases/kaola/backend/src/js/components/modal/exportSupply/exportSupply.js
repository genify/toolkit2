/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./exportSupply.html',
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
    		title:'导出所有商品供销分析'
    	},
    	onTimeSelect:function(event,fieldName){
    		var elm = event.target;
    		_v._$stop(event.event);
    		this.data[fieldName] = this.$refs[fieldName].value;
    		if(this.__dp){
    			this.__dp = this.__dp._$recycle();
    		}
		    this.__dp = _ui._$$DatePick._$allocate({
		              parent:elm.parentNode,
		              clazz:'datepick',
		              range:['','startTime'==fieldName?new Date:''],
		              // 设置日期的可选范围
		              onchange:function(_date){
		                  this.data[fieldName] = +_date;
		                  this.$update();
		              }._$bind(this)
		          });
    	},
    	getTime:function(fieldName){
    		var date;
    		if(this.data[fieldName]){
    			date = _ut._$format(this.data[fieldName],'yyyy-MM-dd');
    		}
    		return date||'';
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	if(!this.data.startTime||!this.data.endTime){
        		notify.show('请输入正确的开始和结束时间');
        		return;
        	}
        	if(this.data.startTime>this.data.endTime){
        		notify.show('开始时间大于结束时间');
        		return;
        	}
        	if(!this.data.emaillist){
        		notify.show('请输入邮件接收人');
        		return;
        	} else{
        		var list = this.data.emaillist.split(';'),mailReg =/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        		for(var i=0,l=list.length;i<l;i++){
        			if(!mailReg.test(list[i])){
        				notify.show('请输入正确的邮件地址');
        				break;
                		return;
        			}
        		}
        	}
        	this.$emit('confirm',this.data.startTime,this.data.endTime,this.data.emaillist);
        }
    })

  return ExportSupplyModal;

})