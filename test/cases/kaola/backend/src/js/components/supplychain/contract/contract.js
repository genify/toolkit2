/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./contract.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_){
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
    removeContract:function(_index){
    	//this.data.list.splice(_index,1);
    	this.$emit('removeContract',_index);
    }
  });
  
  return List;

});