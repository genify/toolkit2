/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./modal.html',
  'pro/components/modal/modal',
  'util/file/select',
  'pro/base/util',
  'ui/datepick/datepick',
  'base/event',
  'base/util',
  'util/ajax/xdr',
  'pro/components/notify/notify'
  ], function(tpl, Modal,s, _,_ui,_v,_ut,_j,notify){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


	var NewProductModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
    	content:tpl,
    	data:{
    		title:'新增商品',
    		list:[],
    		width:500,
    		goodsIdList:[]
    	},
    	init:function(){
    		this.supr();
    		//this.__getList();
    	},
    	onSearchProducts:function(){
    		this.__getList();
    	},
    	onCheckGoods:function(event,_index){
    		this.data.list[_index].checked =  event.target.checked;
			var skuList = this.data.list[_index].skuList||[];
			for(var i=0,l=skuList.length;i<l;i++ ){
				skuList[i].checked = event.target.checked;
			}
    	},
    	onCheckSku:function(event,sku){
    		sku.checked = event.target.checked;
    	},
    	isSkuUsed:function(_sku){
    		var index = _ut._$indexOf(this.data.skuIdList,function(_item){
    			return _item==_sku.skuId;
    		})
    		return index!=-1;
    	},
    	__getList:function(){
    		var data = this.data;
    		this.$request('/backend/newGoods/search',{
    			query:{storageId:this.data.storageId,condition:this.data.key},
    			norest:true,
    			type:'json',
    			onload:function(_json){
    				if(_json.code==200){
    					var list = _json.data.list||[],useFullList=[];
    					for(var i=0,l=list.length;i<l;i++){  //用来过滤已经添加了的sku商品
    						var goods = list[i];
    						var skuList = goods.skuList;
    						for(var j=skuList.length-1;j>=0;j--){
								var index = _ut._$indexOf(this.data.skuIdList,function(_item){
					    			return _item==skuList[j].skuId;
					    		});
								if(index!=-1){
									skuList.splice(j,1);
								}
    						}
    						if(skuList.length!=0){
    							useFullList.push(goods);
    						}
    					}
    					_.mergeList(useFullList, data.list,data.key||'goodsId')
    		          data.total = _json.data.total;
    		          data.list = useFullList;
    				}
    			},
    			onerror:function(_json){
    			}
    		})
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	var list = this.data.list, result =[];
        	for(var i=0,l=list.length;i<l;i++){
        		var skuList = list[i].skuList||[];
        		for(var j=0,jl=skuList.length;j<jl;j++){
        			if(skuList[j].checked){
        				result.push({
        					goodsName:list[i].goodsName,
        					goodsId:list[i].goodsId,
        					skuId:skuList[j].skuId,
        					skuDesc:skuList[j].skuDesc,
        					importType:list[i].importType,
        					barcode:list[i].barcode,
        					newGoodsId:list[i].goodsId,
        					isNew:list[i].newGoods?1:0
    					})
        			}
        		}
        	}
        	if(!result.length){
        		notify.show('请至少选择一种商品')
        	}else{
        		this.$emit('confirm',result);
        		this.destroy();
        	}
        },
        onNewProductItem:function(){
        	this.$emit('newProductItem');
        	this.destroy();
        },
        importProducts:function(){
        	this.$emit('importProductItem');
        	this.destroy();
        }
    })

    NewProductModal.filter('importType',function(_type){
    	var map = {'0':'直邮','1':'保税','2':'海淘'};
    			return map[_type];
    })
  return NewProductModal;
})
