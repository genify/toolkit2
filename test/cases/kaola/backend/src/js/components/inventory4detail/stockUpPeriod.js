/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./stockUpPeriod.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/components/modal/newProduct/newProduct',
  'pro/components/modal/sureWindow/sure',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,notify,newProductModal,Sure,config,_){
  
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/period/getStockUpPeriodList',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
    },
    xdrOption:function(){
    	return {method:"post"};
    },
    init: function(){
      this.supr();
      this.__getList();
    },
    pageChange: function(page){
      this.data.offset = page*50;
      this.data.pageNo = page;
      this.__getList();
    },
    removeItem:function(item,index){
    	var modal = new Sure({data:{desc:'确认删除该备货周期',title:'删除数据'}});
    	modal.$on('confirm',function(){
    		this.$request('/backend/dw/period/deleteStockUpPeriod',{
    			data:{id:item.id},
    			onload:function(_json){
    				if(_json.code==200){
    					notify.show(_json.message);
    					this.data.list.splice(index,1);
    				} else{
    					notify.showError(_json.message);
    				}
    			}._$bind(this),
    			onerror:function(_json){
    				
    			}
    		})
    		this.data.list.splice(index,1);
    		this.$update();
    	}._$bind(this))
    },
    updateItem:function(item,index){
    	var modal =new newProductModal({data:{type:2,title:'编辑商品',
    			productId:item.productId,
    			goodsItemNo:item.goodsItemNo,
    			stockUpPeriod:item.stockUpPeriod,
    			id:item.id,
    			skuId:item.skuId
    	}})
    	modal.$on('confirm',function(_product){
    		item.productId = _product.productId,
			item.goodsItemNo = _product.goodsItemNo,
			item.stockUpPeriod = _product.stockUpPeriod;
    		this.$update();
    	}._$bind(this))
    },
    getListParam: function(){
        var data = this.data;
        return _.extend({
            	pageSize: data.limit,
            	pageNo: data.pageNo
          }, this.getExtraParam(data));
      },
      __getList :function(){
    	var data = this.data;
        var option = {
          progress: true,
          method:'GET',
          data: this.getListParam(),
          onload: function(result){
              list = result.data.list||[];
            _.mergeList(list, data.list,data.key||'id')

            data.total = result.data.total;
            data.list = list;
          },
          onerror: function(json){
            // @TODO: remove
          }
        };
        this.$request(this.url,option)
    }

  });
  return List;

});