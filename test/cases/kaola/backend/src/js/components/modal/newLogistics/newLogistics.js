/*
 * --------------------------------------------
 * 新建|编辑 揽投规则弹窗组件
 * @version  1.0
 * @author   luzhongfang(luzhongfang@corp.netease.com)
 * --------------------------------------------
 */
define([
  'base/event',
  'text!./newLogistics.html',
  '../modal.js',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'util/ajax/xdr',
  'pro/components/notify/notify'
  ], function(v,tpl,Modal,s,_,ui,v,ut,j,notify){

  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */

  var LogisticRuleModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
      content:tpl,
      data:{
        title:'新增物流公司',
        item:{},
        companyList: window.companyList || [],
        confirmTitle:'新增',
        coloseText:'取消'
      },      
      close: function(item){
          this.$emit('close');
          this.destroy();
      },
      confirm:function(){
        var fm = document.getElementById('ruleform');
        var data = this.data.item;
        if(this.data.type==2){
          // 编辑
          fm.setAttribute("action", '/backend/dw/period/duration/rule/update');
        } else{
          fm.setAttribute("action", '/backend/dw/period/duration/rule/add');
        }
        if(data.ruleType == 2){
          if(!data.startTime){
            notify.showError('请设置生效日期');
            return false;
          }
          if(!data.endTime){
            notify.showError('请设置失效日期');
            return false;
          }
          if(data.startTime>data.endTime){
            notify.showError('生效日期必须早于失效日期');
            return false;          
          }
        }

        // fm表单提交
        j._$upload(fm, {
          onload: this.uploadCB._$bind(this),
          onerror: this.uploadCB._$bind(this),
        })  
          
      },
      uploadCB:function(json){
        if(json && json.code == 200){
          notify.show('保存成功！');
          this.$emit('confirm',this.data.item);
          this.destroy();          
        }else{
          notify.showError(json.message || '保存出错，请重试！');
        }
      },
      datePick:function(evt,type){
        v._$stop(evt);
        var timeVal = type==1?this.data.item.startTime:this.data.item.endTime;
        var selDate = timeVal?new Date(timeVal):new Date();
        var datepick = ui._$$DatePick._$allocate({
            parent:evt.target.parentNode,
            clazz:'datapick',
            // 默认选中日期
            date:selDate,
            // 设置日期的可选范围
            onchange:function(date){
              type==1?this.data.item.startTime=date.getTime():this.data.item.endTime=date.getTime();
              this.$update();
            }._$bind(this)
        });
      }
    });
    
    return LogisticRuleModal;
});
