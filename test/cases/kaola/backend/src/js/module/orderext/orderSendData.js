NEJ.define(['pro/widget/module'],
function(){
	var _p = NEJ.P('haitao.bw'), // widget namespace
    _proOrderSendData,
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
	_p._$$OrderSendData = NEJ.C();
	_proOrderSendData = _p._$$OrderSendData.prototype;
	/**
	 * 初始化函数
	 * @param   {nb.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 * @return  {Void}
	 */
	_proOrderSendData.__init = function(){
		var _ntmp = nej.e._$getByClassName(document.body,'ztag'), i=0;
		this.__select = _ntmp[i++];
		this.__textarea = _ntmp[i++];
		this.__button = _ntmp[i++];
		
		nej.v._$addEvent(this.__button, 'click', this.__doClickBtn._$bind(this));
	};
	
	_proOrderSendData.__doClickBtn = function(_event) {
		nej.j._$haitaoDWR('OrderExtMaintainBean', 'sendXmlToEport', [this.__textarea.value||'', this.__select.value], this.__cbMockDate._$bind(this));
	};
	
	_proOrderSendData.__cbMockDate = function(_data) {
		alert(_data||'未知错误');
	};
	
	new _p._$$OrderSendData();

});