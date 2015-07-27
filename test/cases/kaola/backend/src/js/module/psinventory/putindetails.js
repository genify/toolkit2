NEJ.define('{pro}module/psinventory/list.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{pro}widget/pager/pagelist.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/calendar/calendar.js'],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proPItem;
	
	_p._$$OManage = NEJ.C();
	_pro = _p._$$OManage._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__id = this.__config.id;
		
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		this.__checkBtn = nej.e._$get('checkBtn');
 		if(!!this.__checkBtn) {
 			nej.v._$addEvent(this.__checkBtn, 'click', this.__showLayer._$bind(this));
 			
 			//confirm控件
 	 		//删除确认弹窗
 			var _string = '<b style="font-weight:bold;">确认要对:<span style="color:#f60;">xxxxxx</span>进行入库确认？</br>确认后库存会更新到前台<br><span style="color:#f60">*</span>备注'
 	 		this.__checkWindow = haitao.bw._$$ConfirmWithRemark._$allocate({
 	 			parent: document.body,title: '提示',align: 'middle middle',draggable: true,
 	 			c1: '提示',c2: _string,
 	 			onok: this.__sendCheckDWR._$bind(this),
 	 			oncc: function() {
 	 				alert('取消');
 	 			}
 	 		});
 			this.__checkWindow._$hide();
 		}
 	};
 	
 	_pro.__showLayer = function() {
 		this.__checkWindow._$show();
 	};
 	
 	_pro.__sendCheckDWR = function(_text) {
 		alert(_text);
 	};
 	
 	_pro.__cbCheckDWR = function() {
 		
 	};
 	
 	new _p._$$OManage();
	
});