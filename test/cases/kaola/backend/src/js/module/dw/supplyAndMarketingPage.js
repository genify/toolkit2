/**
 * 后台管理 登陆页面
 * Created by zmm on 12/11/14.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/components/modal/exportSupply/exportSupply',
    'pro/components/progress/progress',
    'util/file/select',
    'util/ajax/xdr',
    'pro/components/notify/notify'
], function(_k,_e, _v, _t,_,request,_t2,ExportModal,progress,_s,_j,notify,_p, _o, _f, _r,_pro) {

    _p.SupplyMarketingModule = _k._$klass();
    _pro = _p.SupplyMarketingModule._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		var resultNode = _e._$get('result');
		var _id = _s._$bind('importVolume',{
	 		  accept:'.xls,.xlsx',
	 		  parent:resultNode.parentNode,
              onchange:function(_event){
                  // _event.form
                  // _event.id
            	var _form = _event.form;
              	_form.action = '/backend/dw/supplyandmarketing/uploadPreSalesExcel';
              	progress.start();
              	_j._$upload(_form,{
              		timeout:5*1000*60,
              		onload:function(_json){
              			progress.end();
	              		if(_json.code==200){
	              			notify.show('导入成功');
	              			resultNode.innerHTML ='预估销量'+_json.message.replace('/;/g','<br/>');
	            		} else if(_json.code==401){
	            			resultNode.innerHTML ='预估销量'+_json.message.replace('/;/g','<br/>');
	            		} else{
	            			resultNode.innerHTML ='预估销量导入失败<br/>' +_json.message ;
	            		}
	              		_form.reset();
	              	}._$bind(this),
	              	onuploading:function(_data){
	              		if(!!_data.total&&_data.progress){
	              			progress.move(_data.progress);
	              			console.log(_data.progress);
	              		}
	              	},
	              	onerror:function(e){
	              		progress.end();
	              		resultNode.innerHTML ='导入预估销量失败';
	              		_form.reset();
	              		notify.show('导入失败');
	              	}})
              }
		});
	     var _id2 = _s._$bind('importPlan',{
	 		 accept:'.xls,.xlsx',
	 		 parent:resultNode.parentNode,
             onchange:function(_event){
                 // _event.form
                 // _event.id
            	 progress.start();
            	 var _form = _event.form;
	              	_form.action = '/backend/dw/supplyandmarketing/uploadInventoryArrival';
	              	_j._$upload(_form,{
	              		timeout:5*1000*60,
	              		onload:function(_json){
	              			progress.end();
		              		if(_json.code==200){
		              			notify.show('导入成功');
		              			resultNode.innerHTML = '到货计划'+_json.message.replace('/;/g','<br/>');
		            		} else if(_json.code==401){
		            			resultNode.innerHTML = '到货计划'+_json.message.replace('/;/g','<br/>');
		            		} else{
		            			resultNode.innerHTML ='到货计划导入失败<br/>' +_json.message ;
		            		}
		              		_form.reset();
		              	}._$bind(this),
		              	onuploading:function(_data){
		              		if(!!_data.total&&_data.progress){
		              			progress.move(_data.progress);
		              			console.log(_data.progress);
		              		}
		              	},
		              	onerror:function(e){
		              		progress.end();
		              		resultNode.innerHTML ='导入到货计划失败';
		              		notify.show('导入失败');
		              		_form.reset();
		              	}})
             }
	     });
	     _v._$addEvent('export','click',this.__onExportClick._$bind(this));
	};
    
	_pro.__onExportClick = function(){
		var modal = new ExportModal();
		modal.$on('confirm',function(_startTime,_endTime,_emailList){
			request('/backend/dw/supplyandmarketing/exportSupplyAndMarketingAnalysis',{
				data:{
					fromTime:_startTime,
					toTime:_endTime,
					emailList:_emailList
				},
				onload:function(_json){
					if(_json.code==200){
    					notify.show(_json.message||'导出成功');
    				} else{
    					notify.showError(_json.message||'导出失败');
    				}
				},
				onerror:function(_json){
					notify.showError(_json.message||'导出失败');
				}
			})
		})
	};
	
    _p.SupplyMarketingModule._$allocate();
});