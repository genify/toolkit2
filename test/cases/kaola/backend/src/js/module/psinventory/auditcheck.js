NEJ.define('{pro}module/psinventory/list.js',['pro/widget/module','{lib}util/event.js', '{pro}widget/window/confirm.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/dialog/dialog.js'],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proPItem;
	
	_p._$$Auditcheck = NEJ.C();
	_pro = _p._$$Auditcheck._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		this.__checkBtn = nej.e._$get("checkbtn");
		this.__rejectBtn = nej.e._$get("reject_btn");
 		
 		if(!!this.__checkBtn) {
 			nej.v._$addEvent(this.__checkBtn, 'click', this.__doClickCheck._$bind(this));
 		}
		if(!!this.__rejectBtn) {
			nej.v._$addEvent(this.__rejectBtn, 'click', this.__doClickReject._$bind(this));
		}
 	};
 	
 	_pro.__doClickCheck = function(_event) {
 		var _text = this.__config.type == 1 ? '出库' : '入库';
 		var _html = "<div style='width:400px;padding:0 20px;'><p>确认要对： <span style='color:#f80000;'>"+(this.__config.sockId||0)+"</span> 进行"+_text+"确认？<br>确认后库存会更新到前台<br>&nbsp;</p><div><span style='display:block;float:left;margin-right:20px;'><span style='color:#f80000'>*</span>备注</span><textarea class='textshow' style='width:300px;height:90px;padding:5px;'></textarea></div></div>", _val;
 		
 		this.__editExchangeDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: _text+'确认',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                _val = nej.e._$getByClassName(document.body,'textshow')[0].value;
                if(!_val) {
                	alert('请填写备注');
                	return;
                }
                
                nej.j._$haitaoDWR('InvoicingBean', (this.__config.type == 1 ?'stockOutConfirm':'stockInConfirm'),
                    [this.__config.sockId||0, _val], function(_data){
                        if(!_data) {
                            alert('修改失败，请重试');
                        } else {
                            alert('修改成功，刷新页面');
                            this.__editExchangeDialog._$hide();
                            location.reload();
                        }
                    }._$bind(this));
            }._$bind(this)
        });
        this.__editExchangeDialog._$show();
 	};

 	_pro.__doClickReject = function() {
		var _text = this.__config.type == 1 ? '出库' : '入库';
		var _html = "<div class='dialog-reject' style='width:400px;padding:0 20px;'><p>确认要对： <span style='color:#f80000;'>"+(this.__config.sockId||0)+"</span> "+_text+"拒绝？</p><div><span style='display:block;float:left;margin-right:20px;'><span style='color:#f80000'>*</span>备注</span><textarea class='textshow' style='width:300px;height:90px;padding:5px;'></textarea></div></div>", _val;

		this.__editExchangeDialog = haitao.bw._$$Dialog._$allocate({
			parent: document.body,
			title: _text+'拒绝',
			align: 'middle middle',draggable: true,
			content: _html,
			hideOnok: false,
			onok: function(_dialogBody){
				_val = nej.e._$getByClassName(document.body,'textshow')[0].value;
				if(!_val) {
					alert('请填写备注');
					return;
				}

				nej.j._$haitaoDWR('InvoicingBean', (this.__config.type == 1 ?'stockOutReject':'stockInReject'),
					[this.__config.sockId||0, _val], function(_data){
						if(!_data) {
							alert('修改失败，请重试');
						} else {
							alert('修改成功，刷新页面');
							this.__editExchangeDialog._$hide();
							location.reload();
						}
					}._$bind(this));
			}._$bind(this)
		});
		this.__editExchangeDialog._$show();

		// setup title color
		var curNode = nej.e._$getByClassName(nej.e._$getByClassName(document.body, this.__editExchangeDialog.__cssId)[0], "title")[0];
		nej.e._$attr(curNode, "style","background-color:red");
	};
 	
 	new _p._$$Auditcheck();
	
});