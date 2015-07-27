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
		  'pro/components/supplychain/supplierCard/card'],
		function(_k, _ut, _v, _e, _t,_,request,_t2,_t1,config,notify,List,SupplierCard,_p, _o, _f, _r, _pro) {

			/**
			 * 全局状态控件
			 * @class   {p._$$AuditEditModule}
			 * @extends {nej.ui._$$Abstract}
			 */
			_p._$$AuditEditModule = _k._$klass();
			_pro = _p._$$AuditEditModule._$extend(_t._$$EventTarget);

			/**
			 * 重置控件
			 * @param  {[type]} options [description]
			 *
			 */
			_pro.__reset = function(options) {
				this.__super(options);
				this.__searchForm = _e._$get('searchForm');
				this.__status =options.status; //0是新建，需要把id全抹掉
				this.__getNodes();
				this.__webForm = 
					_t1._$$WebForm._$allocate({form:this.__searchForm,onsubmit:function(_data){
					var warehouse = this.__getWarehouseInfo();
					var exchangeRate = this.__getExchangeRate();
					if(!this.__list){
						this.__list = new List({data:{list:auditGoodsList,warehouse:warehouse,exchangeRate:exchangeRate}});
						this.__list.$inject(_e._$get('list'));
						this.__list.$on('totalupdate',this.__updateTotal._$bind(this))
					} else{
						this.__list.refresh(_data);
					}
				}._$bind(this)})
				this.__addEvent();
				this.__initSupplierList();
			};
			
			
			_pro.__initSupplierList = function(){
				var list = this.__searchForm.supplierId.options;
				this.__supplierList =[];
				for(var i=0,l=list.length;i<l;i++){
					this.__supplierList.push({
						supplierId: list[i].value,
						supplierName: list[i].text,
						pinyin: _e._$dataset(list[i],'pinyin')
					})
				}
			};
			_pro.__updateTotal = function(totalAmount,totalPurchaseCount){
				if(totalAmount){
					this.__totalAmountNode.innerText = _ut._$fixed(totalAmount||'',2);
				} else{
					this.__totalAmountNode.innerText = '';
				}
				this.__totalCountNode.innerText = totalPurchaseCount||'';
			};
			_pro.__getNodes = function(){
				this.__totalAmountNode =  _e._$get('totalAmount'),
				this.__totalCountNode =  _e._$get('totalAccount');
				this.__supplierFilterIpt = _e._$get('supplieript');
				_v._$addEvent(this.__searchForm.warehouseId,'change',this.__onWarehouseChange._$bind(this));
			};
			
//			_pro.__onWarehouseChange = function(){
//				this.__list.$clearData();
//			};
			_pro.__getWarehouseInfo = function(data){
				var option = this.__searchForm['warehouse'].options[this.__searchForm['warehouse'].selectedIndex];
				data = data||{};
				data.type = _e._$dataset(option,'type');
				data.storageId = option.value;
				data.storageName = option.text;
				return data
			}
			_pro.__getExchangeRate = function(){
				return parseFloat(_e._$dataset(this.__searchForm['currencyType'].
						options[this.__searchForm['currencyType'].selectedIndex],'rate'));
			}
			_pro.__addEvent = function(){
				_v._$addEvent(this.__searchForm['warehouse'],'change',this.__onWarehouseChange._$bind(this));
				_v._$addEvent(this.__searchForm['currencyType'],'change',this.__onCurrencyTypeChange._$bind(this));
				_v._$addEvent('save','click',this.__onSaveAudit._$bind(this));
				_v._$addEvent('submit','click',this.__onSubmitAudit._$bind(this));
				_v._$addEvent('copy','click',this.__onCopyClick._$bind(this));
				_v._$addEvent(this.__supplierFilterIpt,'input',this.__onSupplierInput._$bind(this));
				_v._$addEvent(this.__supplierFilterIpt,'click',this.__onSupplierInput._$bind(this));
				_v._$addEvent(document.body,'click',this.__onSupplierRecycle._$bind(this));
			}
			_pro.__onCopyClick = function(){
				window.open('/backend/myAudit/copy?auditId='+auditOrder.id);
			};
			_pro.__onCurrencyTypeChange = function(){
				var rate = _e._$dataset(this.__searchForm['currencyType'].
							options[this.__searchForm['currencyType'].selectedIndex],'rate');
				this.__list.$setRate(parseFloat(rate));
			};
			_pro.__onWarehouseChange = function(){
				this.__list.$setWarehouse(this.__getWarehouseInfo());
			}
			
			_pro.__adminRequestUrlChange = function(_url){
				if(role=='admin'){
					_url = _url.replace('\/myAudit\/','\/auditMng\/');
				}
				return _url;
			};
			_pro.__validateData = function(){
				var pass = true;
				pass = this.__webForm._$checkValidity();
				var data = this.__webForm._$data();
				var expectCabinetCount = parseInt(data.expectCabinetCount);
				if((data.expectCabinetCount&&!expectCabinetCount)||(expectCabinetCount&&expectCabinetCount<=0)){
					notify.show('请输入正确到货柜数');
					pass = false;
				}
				var list = this.__list.data.list;
				if(!list.length){
					pass = false;
					notify.show('请添加商品');
				} else{
					for(var i=0,l=list.length;i<l;i++){
						if(!list[i].purchaseCount||(list[i].purchaseCount&&parseInt(list[i].purchaseCount)<0)){
							notify.show('请输入采购数量');
							pass = false;
						} else if(!list[i].unitPrice||(list[i].unitPrice&&parseInt(list[i].unitPrice)<0)){
							notify.show('请输入单价成本');
							pass = false;
						}else if(!list[i].costSum||(list[i].costSum&&parseInt(list[i].costSum)<0)){
							notify.show('请输入总成本');
							pass = false;
						}else if((list[i].competitionPrice==''&&list[i].competitionPrice!=0)||(parseInt(list[i].competitionPrice)<0)){
							notify.show('请输入竞品价格');
							pass = false;
						}
					}
				}
				return pass;
			};
			
			_pro.__onSaveAudit = function(){
				if(this.__validateData()){
					if(this.__isSaved){
						notify.show('已保存过一次')
					}
					var list = this.__list.data.list;
					var data = this.__webForm._$data(),url,headers={};
					if(data.auditId){
						data.id =data.auditId;
						delete data.auditId;
					}
					if(this.__status==0||!data.id){
						url ='/backend/myAudit/new';
						delete data.id;
						for(var i=0,l=list.length;i<l;i++){
							delete list[i].id;
						}
						this.__isSaved = true;
					} else{
						url = '/backend/myAudit/save';
						headers={auditId:auditOrder.id};
						
					}
					request(this.__adminRequestUrlChange(url),{
						method:'POST',
						type:'json',
						headers:headers,
						data:{
							auditOrder:data,
							auditGoodsList:list
						},
						onload:function(_json){
							if(_json.code==200){
								notify.show('保存成功');
								if(this.__status==0||!data.id){
									this.__searchForm.auditId.value= _json.data.id;
									location.href ='/backend/myAudit/detail?auditId='+_json.data.id;
								}
							} else{
								notify.show(_json.message)
							}
						}._$bind(this)
					})
				}
			}
			_pro.__onSubmitAudit = function(){
				if(this.__validateData()){
					var data = this.__webForm._$data();
					if(data.auditId){
						data.id =data.auditId;
						delete data.auditId;
					}
					if(!data.id){
						notify.show('请先保存审批单');
						return;
					}
					var list = this.__list.data.list;
					request(this.__adminRequestUrlChange('/backend/myAudit/submit'),{
						method:'POST',
						headers:{auditId:data.id},
						type:'json',
						data:{
							auditOrder:data,
							auditGoodsList:list
						},
						onload:function(_json){
							if(_json.code==200){
								if(role=='admin'){
									location.href ='/backend/auditMng/detail?auditId='+data.id;
								} else{
									location.href ='/backend/myAudit/detail?auditId='+data.id;
								}
							} else{
								notify.show(_json.message)
							}
						}
					})
				}
			}
			
			_pro.__getSupplierList = function(_key){
				_key = _key.toUpperCase();
	            var _filter = function(_list) { //搜索接口
	                var t = _key.split('');
	                var texp = '.*' + t.join('.*') + '.*';
	                var _reg = new RegExp(texp, 'i');
	                var _tlist = [];
	                for (var i = 0, l = _list.length; i < l; i++) {
	                    if (_reg.test(_list[i].pinyin || '') || _reg.test(_list[i].supplierName || ''))
	                        _tlist.push(_list[i]);
	                }
	                return _tlist;
	            };
	            if(!_key){
	            	return this.__supplierList;
	            }
	            return _filter(this.__supplierList);
			};
			_pro.__onSupplierInput = function(_event){
				_v._$stop(_event);
				var key = this.__supplierFilterIpt.value;
				var _supplierList = this.__getSupplierList(key);
				if(!this.__supplierCard){
					this.__supplierCard = new SupplierCard({data:{supplierList:_supplierList}});
					this.__supplierCard.$inject(this.__supplierFilterIpt.parentNode)
					this.__supplierCard.$on('onsupplyselect',function(_item){
						this.__searchForm.supplierId.value = _item.supplierId
						this.__supplierFilterIpt.value = _item.supplierName;
					}._$bind(this));
				} else{
					this.__supplierCard.$refresh(_supplierList);
				}
			};
			_pro.__onSupplierRecycle = function(_event){
				if(this.__supplierCard){
					this.__supplierCard.destroy();
					this.__supplierCard = null;
				}
			};
			
			/**
			 * 控件销毁
			 *
			 */
			_pro.__destroy = function() {
				this.__super();
			};

			return _p._$$AuditEditModule;
		})