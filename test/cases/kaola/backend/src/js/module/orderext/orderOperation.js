NEJ.define(['pro/widget/module'],
function(){
	var _p = NEJ.P('haitao.bw'), // widget namespace
    _proOrderOperation,
    _funcname=['sendOrderToEport','sendWaybillToEport','sendGoodsDeclareToEport','getWaybillNo','sendOrderToWC','sendDeliverToWC'];  // class prototype
	
	// interface
	/**
	 * 模块内容管理对象
	 * @constructor
	 * @class   模块内容管理对象
	 * @extends #<N.ut>._$$Event
	 * @param   {jp.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 */
	_p._$$OrderOperation = NEJ.C();
	_proOrderOperation = _p._$$OrderOperation.prototype;
	/**
	 * 初始化函数
	 * @param   {nb.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 * @return  {Void}
	 */
	_proOrderOperation.__init = function(){
		var _ntmp = nej.e._$getByClassName(document.body,'item');
		
		for(var i=0,l=_ntmp.length; i<l; i++) {
			var _nodelist = _ntmp[i].children;
			nej.v._$addEvent(_nodelist[2], 'click', this.__doClickBtn._$bind(this, _nodelist[1], i));
		}
	};
	
	_proOrderOperation.__doClickBtn = function(_valueElem, _st, _event) {
		var _value = _valueElem.value||'';
		nej.j._$haitaoDWR('OrderExtMaintainBean', _funcname[_st], [_value], this.__cbMockDate._$bind(this, _st));
	};
	
	_proOrderOperation.__cbMockDate = function(_st, _data) {
		alert(_data||'未知错误');
	};
	
	new _p._$$OrderOperation();

});