/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./list.html',
  'pro/base/util',
  '../../ListComponent.js',
  'pro/widget/layer/dialog/dialog',
  'pro/components/notify/notify',
  'pro/components/modal/supplychain/newAduitProduct/modal',
  'pro/components/modal/supplychain/newProduct/modal',
  'pro/widget/layer/import.products/import.products',
  'pro/base/config',
  'pro/base/util'
  ], function(_e,_u,tpl,ut,ListComponent,Window,notify,ProductModal,NewProductModal,ImportProductsWin,config,_){
  var List = ListComponent.extend({
    template: tpl,
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 20,
          pageNo: 0,
          list:[]
        });
    },
    xdrOption:function(){
    	return {method:"post"};
    },
    init: function(){
      this.supr();
      this.blurCheck();
    },
    $setWarehouse:function(data){
    	this.data.warehouse = data;
    	this.$clearData();
    },
    $setRate:function(rate){
    	this.data.exchangeRate = rate;
    	this.$update();
    },
    removeProduct:function(_index){
    	this.data.list.splice(_index,1);
    },
    blurCheck:function(item){
    	var totalAmount = 0,totalPurchaseCount =0,
    		list = this.data.list;
    	for(var i=0,l=list.length;i<l;i++){
    		totalAmount += parseFloat(list[i].purchaseCount)*parseFloat(list[i].unitPrice);
    		totalPurchaseCount += parseFloat(list[i].purchaseCount);
    		if(parseInt(list[i].competitionPrice)){
    			var grossProfit = ((list[i].competitionPrice-list[i].costSum)/list[i].competitionPrice) *100;
    			if(grossProfit){
    				grossProfit = _u._$fixed(grossProfit,2)+'%';
    			}
    			list[i].grossProfit = grossProfit||'0';
    		} else{
    			list[i].grossProfit = 0;
    		}
    	}
    	if(item){
	    	item.costSum = parseInt(item.unitPrice)*this.data.exchangeRate+
		    	(parseFloat(item.internationalTransit)||0)+
		    	(parseFloat(item.deliveryFee)||0)+
		    	(parseFloat(item.operationFee)||0);
	    	item.costSum = _u._$fixed(item.costSum||0,2);
    	}
    	setTimeout(
    			function(totalAmount,totalPurchaseCount){
    				this.$emit('totalupdate',totalAmount,totalPurchaseCount)
    			}._$bind(this,totalAmount,totalPurchaseCount),100);
    },
    $clearData:function(){
    	var list = this.data.list,l=list.length-1;
    	for(i=l;i>=0;i--){
    		list.splice(i,1);
    	}
    	this.blurCheck();
    	this.$update();
    },
    getGrossProfit:function(_item){
    	var grossProfit;
    	if(_item.competitionPrice!=''&&parseInt(_item.competitionPrice)!=0){
    		grossProfit = ((parseInt(_item.competitionPrice)-_item.costSum)/parseInt(_item.competitionPrice)) *100;
    	}
    	if(grossProfit){
    		grossProfit = _u._$fixed(grossProfit,3) +'%'
    	}
    	_item.grossProfit =grossProfit||'0';
    	return _item.grossProfit;
    },
    getCost:function(item){
    	item.costSum = parseInt(item.unitPrice)*this.data.exchangeRate+
    	(parseFloat(item.internationalTransit)||0)+
    	(parseFloat(item.deliveryFee)||0)+
    	(parseFloat(item.operationFee)||0);
    	item.costSum = _u._$fixed(item.costSum,2);
    	return item.costSum||'';
    },
    importProduct:function(){
    	var warehouse = this.data.warehouse;
    	var newModal = ImportProductsWin._$allocate({clazz:'m-importproductswin',
    		storageId:warehouse.storageId,
    		storageName:warehouse.storageName,
    		onok:this.onImportExistProductsOK._$bind(this),
    		title:'导入商品',
			importUrl:'/backend/myAudit/updateLoadDetailGoods',
			importTplUrl:'/rsc/backend/rsc/files/importproductstpl.xlsx'
    		})._$show();
    },
    onImportExistProductsOK:function(_productList){
    	for(var i=0,l=_productList.length;i<l;i++){
    		var index = _u._$indexOf(this.data.list,function(_item){
    			return _item.skuId ==_productList[i].skuId;
    		})
    		if(index==-1){
    			var product ={
    					goodsName:_productList[i].goodsName,
    					goodsId : _productList[i].goodsId,
    					skuId : _productList[i].skuId,
    					skuDesc:_productList[i].skuDesc,
    					importType:_productList[i].importType,
    					barcode:_productList[i].barcode,
    					purchaseCount:_productList[i].purchaseCount,
    					unitPrice:_productList[i].unitPrice,
    					internationalTransit:_productList[i].internationalTransit,
    					deliveryFee:_productList[i].deliveryFee,
    					operationFee:_productList[i].operationFee,
    					costSum:'',
    					competitionPrice:_productList[i].competitionPrice,
    					newGoodsId:_productList[i].newGoodsId,
    					isNew:_productList[i].isNew
    			}
	    		this.data.list.push(product);
    		}
    	}
    	this.$update();
    },
    addProduct:function(){
    	var warehouse = this.data.warehouse;
    	var storageId = document.getElementById('warehouse').value;
    	var skuIdList =[];
    	for(var i=0,l=this.data.list.length;i<l;i++){
    		skuIdList.push(this.data.list[i].skuId);
    	}
    	var modal = new ProductModal({data:{storageId:warehouse.storageId,width:500,skuIdList:skuIdList}});
    	modal.$on('confirm',function(_productList){
    		for(var i=0,l=_productList.length;i<l;i++){
    		var product ={
					goodsName:_productList[i].goodsName,
					goodsId : _productList[i].goodsId,
					skuId : _productList[i].skuId,
					skuDesc:_productList[i].skuDesc,
					importType:_productList[i].importType,
					barcode:_productList[i].barcode,
					purchaseCount:'',
					unitPrice:'',
					internationalTransit:'',
					deliveryFee:'',
					operationFee:'',
					costSum:'',
					competitionPrice:'',
					newGoodsId:_productList[i].newGoodsId,
					isNew:_productList[i].isNew
			}
			this.data.list.push(product);
    		}
			this.$update();
    	}._$bind(this))
    	modal.$on('newProductItem',function(){
    		var newModal = new NewProductModal({data:{
    			storageId:warehouse.storageId,
    			type:warehouse.type,
    			storageName:warehouse.storageName
			}});
    		newModal.$on('confirm',function(_product){
    			var product ={
    					goodsName:_product.goodsName,
    					goodsId : '',
    					skuId : _product.id,
    					skuDesc:'默认',
    					importType:_product.importType,
    					barcode:_product.barcode,
    					purchaseCount:'',
    					unitPrice:'',
    					internationalTransit:'',
    					deliveryFee:'',
    					operationFee:'',
    					costSum:'',
    					competitionPrice:'',
    					newGoodsId:_product.id,
    					isNew:1
    			}
    			this.data.list.push(product);
    			this.$update();
    		}._$bind(this))
    	}._$bind(this))
    	modal.$on('importProductItem',function(){
    		var newModal = ImportProductsWin._$allocate({clazz:'m-importproductswin',
    			storageId:warehouse.storageId,
    			storageName:warehouse.storageName,
    			onok:this.onImportProductsOK._$bind(this),
    			importUrl:'/backend/newGoods/upload',
    			importTplUrl:'/rsc/backend/rsc/files/importtpl.xlsx'})._$show();
    	}._$bind(this))
    	
    },
    onImportProductsOK:function(_list){
    	for(var i=0,l=_list.length;i<l;i++){
    		var prd = {
    				goodsName:_list[i].goodsName,
					goodsId : '',
					skuId : _list[i].id,
					skuDesc:'默认',
					importType:_list[i].importType,
					barcode:_list[i].barcode,
					purchaseCount:_list[i].purchaseCount,
					unitPrice:_list[i].unitPrice,
					internationalTransit:_list[i].internationalTransit,
					deliveryFee:_list[i].deliveryFee,
					operationFee:_list[i].operationFee,
					costSum:'',
					competitionPrice:_list[i].competitionPrice,
					newGoodsId:_list[i].goodsId,
					isNew:1
    		}
    		this.data.list.push(prd);
    	}
    	this.$update();
    }
  });
  List.filter('importType',function(_type){
  	var map = {'0':'直邮','1':'保税','2':'海淘'};
  			return map[_type];
  })
  List.filter('fixed',function(_num){
  	return _u._$fixed(_num,2)
  })
  return List;

});