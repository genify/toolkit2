/*
 * --------------------------------------------
 * UTIL控件实现
 * @version  1.0
 * @author   author(author@corp.netease.com)
 * --------------------------------------------
 */
define(
		[ 'base/klass',
		  'base/util', 
		  'base/event',
		  'base/element', 
		  'util/event' ,
		  'pro/base/util',
		  'pro/base/request',
		  'pro/widget/module',
		  'pro/widget/form',
		  'pro/base/config',
		  'pro/components/notify/notify',
		  'pro/components/supplychain/newaudit/list',
		  'pro/components/modal/supplychain/reject/modal',
		  'pro/components/supplychain/trackaudit/trackaudit',
		  'pro/widget/ui/contract/contract',
		  'pro/components/modal/sureWindow/sure',
		  'pro/components/modal/supplychain/changeDate/modal',
		  'pro/components/modal/supplychain/completeContract/modal',
		  'pro/components/modal/alertmodal/alert'],
		function(_k, _ut, _v, _e, _t,_,request,_t2,_t1,config,
				notify,List,RejectModal,PayRecordList,Contract,ConfirmModal,DatePickModal,CompleteContractModal,Alert,
				_p, _o, _f, _r, _pro) {

			/**
			 * 全局状态控件
			 * @class   {p._$$AuditReadModule}
			 * @extends {nej.ui._$$Abstract}
			 */
			_p._$$AuditReadModule = _k._$klass();
			_pro = _p._$$AuditReadModule._$extend(_t._$$EventTarget);

			/**
			 * 重置控件
			 * @param  {[type]} options [description]
			 *
			 */
			_pro.__reset = function(options) {
				this.__super(options);
				this.__getNodes();
				this.__addEvent();
				this.__updateTotal();
				if(this.__contractNode){
					this.__contract = Contract._$allocate({parent:this.__contractNode,contractList:contractList,relatedId:auditOrder.id,auditStatus:auditOrder.auditStatus,role:role})
				}
				if(this.__trackAuditNode){
					var list = new PayRecordList({data:{list:payRecordList,auditId:auditOrder.id}});
					list.$inject(this.__trackAuditNode);
				}
			};
			_pro.__updateTotal = function(totalAmount,totalPurchaseCount){
				var totalAmount=0,totalPurchaseCount=0;
				for(var i=0,l=auditGoodsList.length;i<l;i++){
					totalAmount += auditGoodsList[i].purchaseCount*auditGoodsList[i].unitPrice;
		    		totalPurchaseCount += auditGoodsList[i].purchaseCount;
				}
				if(totalAmount){
					this.__totalAmountNode&&(this.__totalAmountNode.innerText = _ut._$fixed(totalAmount,2)||'');
				} else{
					this.__totalAmountNode&&(this.__totalAmountNode.innerText = '');
				}
				this.__totalCountNode&&(this.__totalCountNode.innerText = totalPurchaseCount||'');
			};
			_pro.__getNodes = function(){
				this.__totalAmountNode =  _e._$get('totalAmount'),
				this.__totalCountNode =  _e._$get('totalAccount');
				this.__contractNode = _e._$get('contract');
				this.__trackAuditNode = _e._$get('trackaudit');
			};
			_pro.__addEvent = function(){
				_v._$addEvent('copy','click',this.__onCopyClick._$bind(this));
				_v._$addEvent('reject','click',this.__onDealAudit._$bind(this,0));
				_v._$addEvent('pass','click',this.__onDealAudit._$bind(this,1));
				
				_v._$addEvent('completeContract','click',this.__onCompleteContractClick._$bind(this));
				_v._$addEvent('cancel','click',this.__onCancelAuditClick._$bind(this));
				_v._$addEvent('instockDay','click',this.__onDayChangeClick._$bind(this,2));
				_v._$addEvent('arrivalDay','click',this.__onDayChangeClick._$bind(this,1));
				
			};
			_pro.__onDayChangeClick = function(_type,_event){
				var target = _v._$getElement(_event);
				var date = _e._$dataset(target,'date');
				var modal = new DatePickModal({data:{date:date}});
				modal.$on('confirm',function(_date){
					request(this.__adminRequestUrlChange('/backend/myAudit/updateExpectDate'),{
						data:{auditId:auditOrder.id,type:_type,newDate:_ut._$var2date(_date)},
						headers:{auditId:auditOrder.id},
						norest:true,
						type:'json',
						method:'POST',
						onload:function(_json){
							if(_json.code==200){
								notify.show('修改成功');
								var list = _e._$getByClassName(target.parentNode,'j-date');
								list[0].innerText = _date;
								 _e._$dataset(target,'date',_date);
							} else{
								notify.show('修改失败')
							}
						},
						onerror:function(){
							notify.show('修改失败')
						}
					})
				}._$bind(this))
			};
			_pro.__adminRequestUrlChange = function(_url){
				if(role=='admin'){
					_url = _url.replace('\/myAudit\/','\/auditMng\/');
				}
				return _url;
			};
			_pro.__onCopyClick = function(){
				window.open('/backend/myAudit/copy?auditId='+auditOrder.id);
			};
			_pro.__onCompleteContractClick = function(){
				///backend/myAudit/completeContract
				if(this.__validateContract()){
					var modal = new CompleteContractModal({data:{auditNo:auditOrder.auditNo}});
					modal.$on('confirm',function(_remark){
						request(this.__adminRequestUrlChange('/backend/myAudit/completeContract'),{
							headers:{auditId:auditOrder.id},
							data:{auditId:auditOrder.id,remark:_remark},
							method:'POST',
							type:'json',
							onload:function(_json){
								if(_json.code==200){
									notify.show('合同制定完毕');
									location.reload();
								} else{
									notify.show(_json.message)
								}
							},
							onerror:function(){
								notify.show('合同制定失败')
							}
						})
					}._$bind(this))
					
				}
			};
			
			_pro.__onCancelAuditClick = function(){
				var model = new ConfirmModal({data:{desc:'<h3 class="title">确要取消：<span class="orange">'+auditOrder.auditNo+'</span>这笔审批单吗？<h3>',title:'提示'}});
		    	model.$on('confirm',function(){
		    		request(this.__adminRequestUrlChange('/backend/myAudit/cancel'),{
						data:{auditId:auditOrder.id},
						headers:{auditId:auditOrder.id},
						type:'json',
						onload:function(_json){
							if(_json.code==200){
								notify.show('取消成功');
								location.reload();
							} else{
								notify.show(_json.message)
							}
						},
						onerror:function(){
							notify.show('取消失败')
						}
					})
		    	}._$bind(this))
			};
			_pro.__validateContract = function(){
				var data = this.__contract._$data();
				if(data.length<1){
					notify.show('请上传合同文件');
					return false;
				}
				return true;
			};
			_pro.__adminAuditRequestUrlChange = function(_url){
				if(role=='admin'){
					_url = _url.replace('\/auditTask\/','\/auditMng\/');
				}
				return _url;
			};
			_pro.__onDealAudit = function(_type){
				
				var url ='/backend/auditTask/auditPass',_msg;
				if(_type==0){
					url = '/backend/auditTask/auditReject';
					_msg ='驳回成功！';
				} else{
					url ='/backend/auditTask/auditPass';
					_msg ='审核通过！';
				}
				var modal = new RejectModal({data:{auditId:auditOrder.auditNo,type:_type}});
				modal.$on('confirm',function(_remark){
					request(this.__adminAuditRequestUrlChange(url),{
							data:{auditId:auditOrder.id,remark:_remark},
							headers:{auditId:auditOrder.id},
							method:'POST',
							type:'json',
							onload:function(_json){
								if(_json.code==200){
									notify.show(_msg);
									var suremodal = new Alert({data:{desc:'<h3 class="title">'+_msg+'</h3>',title:'提示',coloseText:'',width:400}});
									suremodal.$on('confirm',function(){
										window.close();
									})
								} else{
									notify.show(_json.message)
								}
							}
						})
				}._$bind(this))
			};
			return _p._$$AuditReadModule;
		})