/**
 * 付款记录列表
 * author yqj(yqj@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./trackaudit.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/widget/layer/dialog/dialog',
  'pro/components/notify/notify',
  'pro/components/modal/supplychain/payrecord/modal',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,Window,notify,EditPayRecordModal,config,_){
  var List = ListComponent.extend({
    template: tpl,
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
    },
    init: function(){
      this.supr();
    },
    addPayRecord:function(){
    	var list = ut.copyObject(this.data.list);
    	var modal = new EditPayRecordModal({data:{list:list,auditId:this.data.auditId}});
    	modal.$on('confirm',function(_list){
    		var oldlist= this.data.list;
    		ut.mergeList(_list,oldlist,'id');
    		this.data.list = _list;
    		this.$update();
    	}._$bind(this))
    }
  });
  
  return List;

});