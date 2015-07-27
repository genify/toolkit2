/**
 * 后台管理 登陆页面
 * Created by zmm on 12/11/14.
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
    'pro/components/storageOutSts/list'
], function(_k,_e, _v, _t,_ut,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
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
		}._$bind(this)});
		
		_v._$addEvent('exportData','click',this.__exportData._$bind(this))
	};
	
	_pro.__exportData = function(){
		var data = this.webForm._$data();
		window.open('/backend/dw/period/exportWarehouse?'+_ut._$object2query(this.webForm._$data()));
	};
	_pro.__filterData = function(_data){
		
	};
    _p._$$Module._$allocate();
});