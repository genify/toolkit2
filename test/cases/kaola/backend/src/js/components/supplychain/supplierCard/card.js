/**
 * 基于NEJ和bootstrap的日期选择器
 * author hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 */

define([
  'pro/base/util',
  'base/util',
  'pro/widget/BaseComponent',
  'text!./card.html'
  ], function(_,_ut, BaseComponent,html){

  // ###data
  //  - pager
  //    * total: 列表总数 
  //    * list : 列表数组
  // ###example
  // <div>
  //  {{#list list as item}}
  //     
  //  {{/item}}
  // </div>

  var SupplierCard = BaseComponent.extend({
    // 配置链接
    // @子类必须提供
    // dwr: {beanName:'xxx',method:'yyy'},
  // 任意一个监听列表发生改变时，判断更新列表 
  // @子类修改
    data: {
    	supplierList:[]
    },
    template:html,
    onSupplierSelect:function(_item){
    	this.$emit('onsupplyselect',_item);
    	this.destroy();
    },
    $refresh:function(_list){
    	_.mergeList(this.data.supplierList,_list,'supplierId');
    	this.data.supplierList = _list;
    	this.$update();
    }
  })


  return SupplierCard;

})