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
    'pro/base/config',
    'pro/components/warehouse/alarmlist',
    'pro/components/warehouse/deliverylist'
], function(_k,_e, _v, _t,_ut,_,request,_t2,config,alarmList,deliveryList,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__initNodes();
		this.__addEvents();
		this.__initList();
	};

	// 获取页面dom节点函数
	_pro.__initNodes = function(){
		this.__alarmListBox = _e._$get('alarmRecieverList');
		this.__deliveryListBox = _e._$get('deliveryList');
	};
	// 绑定事件函数
	_pro.__addEvents = function(){
		// _v._$addEvent('exportData','click',this.__exportData._$bind(this))

	};

	_pro.__initList = function(){
		var alarmlist = new alarmList();
		var deliverylist = new deliveryList();
		alarmlist.$inject(this.__alarmListBox);
		deliverylist.$inject(this.__deliveryListBox);
	};

    _p._$$Module._$allocate();
});