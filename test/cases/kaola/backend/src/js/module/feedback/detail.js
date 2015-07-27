NEJ.define(['pro/widget/module','{lib}util/event.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js'],
function(){
 	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proCache,
		_proItme;
	
	_p._$$MDetail = NEJ.C();
	_pro = _p._$$MDetail._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		
		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
		this.__delOrderBtn = _ntmp[i++];
		this.__closeOrderBtn = _ntmp[i++];
		this.__textarea = _ntmp[i++];
		this.__submitReply = _ntmp[i++];
		
//		this.__cache = xxxx._$allocate({})
		
		nej.v._$addEvent(this.__delOrderBtn, 'click', this.__doDone._$bind(this));
		nej.v._$addEvent(this.__closeOrderBtn, 'click', this.__doClose._$bind(this));
		nej.v._$addEvent(this.__submitReply, 'click', this.__doAddComment._$bind(this));
	};

	_pro.__doDone = function(_event) {
		nej.v._$stop(_event);
		nej.j._$haitaoDWR('FeedbackBean', 'updateStatus4Done', [this.__config.feedbackId], this.__cbAddComment._$bind(this));
	};
	
	_pro.__doClose = function(_event) {
		nej.v._$stop(_event);
		nej.j._$haitaoDWR('FeedbackBean', 'updateStatus4Close', [this.__config.feedbackId], this.__cbAddComment._$bind(this));
	};
	
	_pro.__doAddComment = function(_event) {
		nej.v._$stop(_event);
		var _value = this.__textarea.value;
		if(_value.length > 2000) {
			alert('最多2000个字');
			return;
		}
		nej.j._$haitaoDWR('FeedbackBean', 'addComment', [this.__config.feedbackId, _value], this.__cbAddComment._$bind(this));
	};

	_pro.__cbAddComment = function(_type) {
		alert('操作成功');
		location.reload();
	};
	
	
	new _p._$$MDetail();
});
