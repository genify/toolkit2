NEJ.define(['{pro}widget/module.js'],
function(){
	var _p = NEJ.P('haitao.bw'), // widget namespace
    __proMModule,
    _funcname=['wcSuccDeliver','wcLackStock','wcDetain','wcSuccPurchase'];  // class prototype
	
	// interface
	/**
	 * 模块内容管理对象
	 * @constructor
	 * @class   模块内容管理对象
	 * @extends #<N.ut>._$$Event
	 * @param   {jp.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 */
	_p._$$MModule = NEJ.C();
	__proMModule = _p._$$MModule.prototype;
	/**
	 * 初始化函数
	 * @param   {nb.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 * @return  {Void}
	 */
	__proMModule.__init = function(){
		var _ntmp = nej.e._$getByClassName(document.body,'item');
		
		for(var i=0,l=_ntmp.length; i<l; i++) {
			var _nodelist = _ntmp[i].children;
			nej.v._$addEvent(_nodelist[4], 'click', this.__doClickBtn._$bind(this, _nodelist, i));
		}
	};
	
	__proMModule.__doClickBtn = function(_valueElem, _st, _event) {
		var _value = _valueElem[1].value||'', _value2 = parseInt(_valueElem[2].value)||0, _value3 = _valueElem[3].value||'';
		if(_st === 3) {
			_value = parseInt(_value);
		}
		nej.j._$haitaoDWR('MockBean', _funcname[_st], [_value, _value2, _value3], this.__cbMockDate._$bind(this, _st));
	};
	
	__proMModule.__cbMockDate = function(_st, _data) {
		var _prefix = '';
		switch(_st) {
			case 0:
				_prefix = '订单发货成功';
				break;
			case 1:
				_prefix = '订单库存不足';
				break;
			case 2:
				_prefix = '订单海关扣押';
				break;
			case 3:
				_prefix = '采购成功';
				break;
		}
		alert(_data||'未知错误');
//		if(!!_data) {
//			alert(_prefix + '----数据模拟成功');
//		} else {
//			alert(_prefix + '----数据模拟失败');
//		}
	};
	
	new _p._$$MModule();

});