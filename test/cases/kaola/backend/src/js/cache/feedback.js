NEJ.define('{pro}cache/feedback.js', ['{lib}util/cache/list.js', '{lib}util/ajax/dwr.js'], function(){
	var _p = NEJ.P('haitao.bc'),
		_proCache;

	_p._$$CacheFeedback = NEJ.C();
 	_proCache = _p._$$CacheFeedback._$extend(nej.ut._$$ListCache);
 	
// 	_proCache.__init = function() {
//		this.__super();
//	};
	
	_proCache.__reset = function(_options) {
		this.__super(_options);
		
		if(!!_options.beanName){
			this.__beanName = _options.beanName;
			this.__funcName = _options.funcName;
			this.__param = _options.param || [];
			this._$addEvent('doloadlist', this.__dogetList._$bind(this));
		}
	};
	
	_proCache.__dogetList = function(_options) {
		var _callback = function(_list) {
	    	_options.onload(_list);
		}
		this.__param[1] = _options.offset;
		nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
	};
	
	_proCache.__closeItem = function(_param, _id) {
		nej.j._$haitaoDWR('FeedbackBean', 'updateStatus4Close', _param, this._$dispatchEvent._$bind(this, 'cbCloseItem'));
	};
	
	_proCache.__delItem = function(_param, _id) {
		nej.j._$haitaoDWR('FeedbackBean', 'updateStatus4Delete', _param, this._$dispatchEvent._$bind(this, 'cbDelItem'));
	};
	
	_proCache.__editItem = function(_param, _id) {
		nej.j._$haitaoDWR('FeedbackBean', 'updateFeedback', _param, this._$dispatchEvent._$bind(this, 'cbEditItem'));
	};
});
