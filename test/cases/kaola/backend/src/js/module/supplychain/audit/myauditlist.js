/**
 * 后台管理 新建审批单
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
    'pro/components/notify/notify',
    'pro/components/supplychain/audit/list'
], function(_k,_e, _v, _t,_ut,_,request,_t2,_t1,config,notify,List,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		var url = '/backend/myAuditList/task/pending';
		if(type==2){
			url = '/backend/myAuditList/task/unfinish';
		}
		this.__webForm = 
			_t1._$$WebForm._$allocate({form:'searchForm',
				onsubmit:function(_data){
					if(!_data.auditStatus){
						delete _data.auditStatus;
					}
					if(!this.__list){
						this.__list = new List({data:{url:url,condition:_data,type:3}});
						this.__list.$inject(_e._$get('list'));
					} else{
						this.__list.refresh(_data);
					}
				}._$bind(this)})
		_v._$addEvent('refresh','click',this.__onRefreshClick._$bind(this));
	};
	_pro.__onRefreshClick = function(){
		location.reload();
	};
    _p._$$Module._$allocate();
});