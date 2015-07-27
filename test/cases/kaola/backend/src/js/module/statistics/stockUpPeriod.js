/**
 * 后台管理 登陆页面
 * Created by yuqijun on 2015/05/08.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'base/util',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/widget/form',
    'pro/base/config',
    'pro/components/inventory4detail/stockUpPeriod',
    'pro/components/inventory4detail/mailUserList',
    'pro/components/modal/newProduct/newProduct',
    'pro/components/modal/newMailUser/newMailUser'
], function(_k,_e, _v, _t,_ut,_,request,_t2,_t1,config,List,MailUserList,NewProductModal,NewMailUserModal,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__searchForm = _e._$get('searchForm');
		this.webForm = 
				_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
				this.__filterData(_data);
				if(!this.__list){
					this.__list = new List({data:{condition:_data}});
					this.__list.$inject(_e._$get('list'));
				} else{
					this.__list.refresh(_data);
				}
			}._$bind(this)})
		_v._$addEvent(this.__searchForm.adddata,'click',this.__onAddClick._$bind(this));
		_v._$addEvent('addmail','click',this.__onAddMailUser._$bind(this));
		this.MailUserList = new MailUserList();
		this.MailUserList.$inject(_e._$get('list1'));
	};
	_pro.__filterData = function(data){
		if(data.type==1){
			data.productId = data.searchvalue;
		}
		if(data.type==2){
			data.goodsItemNo = data.searchvalue;
		}
		delete data.searchvalue;
		delete data.type;
	}
    _pro.__onAddClick = function(event){
    	_v._$stop(event);
    	var modal = new NewProductModal({type:1});
    	modal.$on('confirm',function(){
    		this.__list.refresh();
    	}._$bind(this))
    }
    _pro.__onAddMailUser = function(_event){
    	_v._$stop(event);
    	var modal = new NewMailUserModal({type:1});
    	modal.$on('confirm',function(_user){
    		this.MailUserList.refresh();
    	}._$bind(this))
    }
    _p._$$Module._$allocate();
});