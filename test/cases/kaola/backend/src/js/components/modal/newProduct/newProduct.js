/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./newProduct.html',
  '../modal.js',
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
    		type:1,
    		createType:1,
    		productId:'',
			goodsItemNo:'',
			stockUpPeriod:''
    	},
    	
        close: function(item){
            this.$emit('close');
            this.destroy();
        },
        confirm:function(){
        	//this.$emit('confirm', this.data.product);
        	//this.destroy();
        	var pass = true;
        	if(!this.data.productId){
        		notify.showError('写填写商品ID');
        		pass = false;
        	}
        	if(!this.data.goodsItemNo){
        		notify.showError('写填写料号');
        		pass = false;
        	}
        	if(!this.data.goodsItemNo){
        		notify.showError('写填写备货周期');
        		pass = false;
        	}
        	if(pass){
        		var url;
        		var product = {
        			productId:this.data.productId,
        			goodsItemNo:this.data.goodsItemNo,
        			stockUpPeriod:this.data.stockUpPeriod
        		}
        		if(this.data.type==2){
        			url = '/backend/dw/period/updateStockUpPeriod';
        			product.id = this.data.id;
        			product.skuId = this.data.skuId;
        		} else{
        			url = '/backend/dw/period/addStockUpPeriod';
        		}
        		
        		this.$request(url,{
        			data:product,
        			method:'POST',
        			onload:function(_json){
        				if(_json.code==200){
        					notify.show(_json.message);
        					this.$emit('confirm',product);
        					this.destroy();
        				} else{
        					notify.showError(_json.message);
        				}
        			},
        			onerror:function(){
        				
        			}
        		})
        	}
        },
        startDatePick:function(event){
        	_v._$stop(event.event);
        	var _dp = _ui._$$DatePick._$allocate({
        	              parent:event.target.parentNode,
        	              clazz:'datapick',
        	              // 默认选中日期
        	              date:this.data.product.availableStart?new Date(this.data.product.availableStart):new Date(),
        	              // 设置日期的可选范围
        	              onchange:function(_date){
        	            	  this.data.product.availableStart = _ut._$format(_date,'yyyy-MM-dd');
        	            	  this.$update();
        	              }._$bind(this)
        	          });
        },
        endDatePick:function(event){
        	_v._$stop(event.event);
        	var _dp = _ui._$$DatePick._$allocate({
	              parent:event.target.parentNode,
	              clazz:'datapick',
	              // 默认选中日期
	              date:this.data.product.availableEnd?new Date(this.data.product.availableEnd):new Date(),
	              // 设置日期的可选范围
	              onchange:function(_date){
	            	  this.data.product.availableEnd = _ut._$format(_date,'yyyy-MM-dd');
	            	  this.$update();
	              }._$bind(this)
	          });
        },
        uploadFile:function(_json){
        	if(this.data.$event.type=='upload'){
        		notify.show('导入成功！');
        		this.$emit('confirm');
				this.destroy();
    		} else if(this.data.$event.type=='error'){
    			notify.showError(this.data.$event.message);
    		}
        }
    })

    NewProductModal.event('upload',function(elem, fire, attrs) {
        // 我们需要另外一个属性以提取参数
    	var form,target = this.data.target || elem.target; 
    	function onUpload(json){
            if(json && json.code === 200){ //success
              fire({type: "upload", data: json.result});
            }else{
              fire({type: "error", message: json.message});
            }
            bindSelectFile();
          }
    	
    	function onFileChange(ev){
            ev.form.setAttribute("action", '/backend/dw/period/uploadStockUpPeriodExcel')
            _j._$upload(ev.form, {
              onload: onUpload,
              onerror: onUpload
            })
          }
    	 
    	var id;
    	 function bindSelectFile(){
	        if(id) s._$unbind(id);
	        setTimeout(function(){
	          id = s._$bind(elem, {
	            parent: target || elem.parentNode,
	            name: 'file',
	            multiple: false,
	            accept:'.xls,.xlsx',
	            onchange: onFileChange
	          });
	        },0)
	      }
    	 var $root = this.$root;
         if(!$root.parentNode){
           $root.$on("inject",bindSelectFile)
         }else{
           bindSelectFile();
         }
         
         return function destroy(){
             if(id) s._$unbind(id);
             // TODO: remove form 根据id
           }
    })

    
  return NewProductModal;
})
