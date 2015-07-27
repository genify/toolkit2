/*
 * --------------------------------------------
 * 采购单修改费用弹层
 * @version  1.0
 * @author   hzjiangren(hzjiangren@corp.netease.com)
 * --------------------------------------------
 */
define([
  '../modal.js',
  'util/file/select',
  'pro/base/util',
  'base/event',
  'base/util',
  'util/ajax/xdr',
  'pro/components/notify/notify'
  ], function(Modal,s, _,_v,_ut,_j,notify){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var FeesChangeModal = Modal.extend({
      //content里的内容需要用到ftl里的参数，因此写在ftl里
    	content:document.getElementById('feesChange').value,
    	data:{
        title:'修改费用',
        width:540,
        purchaseState:-1,
        feesData:{},
        index:-1,
        purchaseId:-1
    	},
      fixedNumber: function(num) {
        //截取6位小数
        if(!num) {
            return null;
        }
        return parseInt(Number(num)*1000000)/1000000;
      },
    	
      close: function(item){
          this.$emit('close');
          this.destroy();
      },
      confirm:function(){
      	var pass = true, fees={}, item=this.data.feesData;
        if(this.data.feesData.State == 1) {   //有费用
          if(Number(item.CurrencyType)<1) {
            notify.showError('请选择币种');
            pass = false;
          }
          if(!!item.ExchangeRate && (isNaN(item.ExchangeRate) || Number(item.ExchangeRate)<0)) {
            notify.showError('请输入正确的汇率');
            pass = false;
          }
          if(!!item.PaymentAmount && (isNaN(item.PaymentAmount) || Number(item.PaymentAmount)<0)) {
            notify.showError('请输入正确的支付金额');
            pass = false;
          }

        } else {  //无费用
          item.CurrencyType = 0;
          item.ExchangeRate = null;
          item.PaymentAmount = null;
        }

      	if(pass){
      		nej.j._$haitaoDWR('InvoicingBean', 'changeFees',
            [this.data.purchaseId, item.State, item.CurrencyType,
              this.fixedNumber(item.ExchangeRate),
              this.fixedNumber(item.PaymentAmount),
              (this.data.index+1)], function(_data){
                if(!_data) {
                    alert('修改失败，请重试');
                } else {
                    alert('修改成功，刷新页面');
                    location.reload();
                    // this.$emit('confirm', this.data.feesData, this.data.index);
                    this.destroy();
                }
            }._$bind(this));
      	}
      }
    })
    
  return FeesChangeModal;
})
