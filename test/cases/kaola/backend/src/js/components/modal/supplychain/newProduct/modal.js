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
  'base/element',
  'util/ajax/xdr',
  'pro/components/notify/notify',
  'util/form/form'
  ], function(tpl, Modal,s, _,_ui,_v,_ut,_e,_j,notify,_t1){


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
    		title:'新品新增计划品',
    		width:1000
//    		id:'1232',
//    		goodsName:'goodsName' +Math.random(),
//    		barcode:'12234',
//    		importType:'',
//    		storageId:'',
//    		storageName:'',
//    		brandName:'brandName',
//    		goodsUnit:'1',
//    		category:'est',
//    		originCountry:'japan',
//    		purchasingCountry:'japan',
//    		productionEnterprise:'toyoto',
//    		expirationDate:'100',
//    		weight:'5',
//    		goodsSize:'10*10*10',
//    		goodsModel:'XL',
//    		goodsVoltage:'220',
//    		goodsAccessory:'safda',
//    		isMultiSku:'1',
//    		skuDesc:'skuDesc',
//    		referenceLink:'http://kaola.com/test',
//    		ingredient:'1',
//    		goodsMaterial:'mateial',
//    		productSkuCode:'1112',
//    		mmSkuId:''
    	},
    	config:function(data){
    		this.data.type = data.type;
    		this.data.storageId = data.storageId;
    		this.data.storageName = data.storageName;
    	},
    	init:function(){
    		this.supr();
    		this.__webForm = _t1._$$WebForm._$allocate({
              form:this.$refs['productform'],
              oninvalid:function(_event){
					if(!this.__errorMsg){
						this.__errorMsg = _e._$dataset(_event.target,'message');
					}
				}._$bind(this),
          });
    	},
    	getStorage:function(){
    		
    	},
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	this.__errorMsg = ''
        	if(this.__webForm._$checkValidity()){
        		var data = this.__webForm._$data();
        		this.$request('/backend/newGoods/save',{
        			data:data,
        			method:'POST',
        			type:'json',
        			onload:function(_json){
        				if(_json.code==200){
        					var prd = (_json.data&&_json.data.newSku)||data;
        					this.$emit('confirm',prd);
        	        		this.destroy();
        				} else{
        					notify.show(_json.message)
        				}
        			}
        		})
        		
        	}else if(this.__errorMsg){
        		notify.show(this.__errorMsg);
        	}
        }
    })

    
  return NewProductModal;
})
