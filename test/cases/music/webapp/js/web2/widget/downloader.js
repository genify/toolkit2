var f = function() {
	var _  = NEJ.P,
	    _e = _('nej.e'),
	    _v = _('nej.v'),
	    _u = _('nej.u'),
	    _j = _('nej.j'),
	    _i = _('nej.ui'),
	    _p = _('nm.m'),
	    _x = _('nm.g'),
	    _proDownloader, _supDownloader;
	// ui css text
    var _seed_css = '';
	// ui html code
	var _seed_html = _e._$addNodeTemplate('\
			<div class="m-codelay f-pa">\
				<a href="#" class="w-cls f-noul f-pa" title="关闭">&times;</a>\
				<div class="bymobile f-fl">\
					<p class="s-fc3">将下载链接发送到手机</p>\
					<div class="iptwrap f-pr s-vbg s-vbg-10">\
						<input type="text" value="" class="js-t txt" placeholder="手机号码" data-holder="js-placeholder" maxlength="15" autocomplete="off">\
						<a href="#" class="js-t go f-pa s-vbg s-vbg-11 f-tid" title="发送" hidefocus="true">发送</a>\
						<div class="js-t err" style="clear:both;">错误提示</div>\
					</div>\
				</div>\
			</div>');
	
	_p._$$Downloader = NEJ.C();
	_proDownloader = _p._$$Downloader._$extend(_i._$$Layer);
	_supDownloader = _p._$$Downloader._$supro;
	_proDownloader.__initXGui = function(){
		this.__seed_css = _seed_css;
        this.__seed_html= _seed_html;
	};
	_proDownloader.__initNode = function(){
		this.__supInitNode();
		var _ntmp = _e._$getChildren(this.__body);
		// clnk - 关闭按钮
		// mbox - 主内容box
		this.__clnk = _ntmp[0];
		this.__mbox = _ntmp[1];
		this.__cbox = _e._$create('div','w-mask');
		// 0 - 手机号码输入框
		// 1 - 发送按钮
		// 2 - 发送结果提示
		this.__nodes = _e._$getByClassName(this.__mbox,'js-t');

		_e._$placeholder(this.__nodes[0],'js-placeholder');
		_v._$addEvent(this.__clnk,'click',this.__onClose._$bind(this));
		_v._$addEvent(this.__nodes[1],'click',this.__onPost._$bind(this));
		_v._$addEvent(this.__nodes[0],'focus',this.__onInputFocus._$bind(this));
		_v._$addEvent(this.__nodes[0],'keypress',this.__onInputKeyPress._$bind(this));
	};
	_proDownloader.__doPositionAlign = function(){
		var _body0 = document.documentElement||document.body,
        	_body1 = document.body||document.documentElement;
	    this._$setPosition({
	    	top : (_body0.scrollTop||_body1.scrollTop)+Math.max(0,_body0.clientHeight-this.__body.clientHeight)/2,
	    	left: (_body0.scrollLeft||_body1.scrollLeft)+ Math.max(0,_body0.clientWidth-this.__body.clientWidth)/2
	    });
	};
	_proDownloader.__onClose = function(_event){
		_v._$stopDefault(_event);
		this._$hide();
	};
	_proDownloader.__onInputFocus = function(_event){
		this.__tip();
	};
	_proDownloader.__onInputKeyPress = function(_event){
		if (_event.keyCode==13)
			this.__onPost();
	};
	_proDownloader.__onPost = function(_event){
		_v._$stopDefault(_event);
		if (this.__lock()) return;
		var _mobile = this.__checkMobile();
		if (!_mobile) return;
		this.__lock(true);
		this.__doPost(_mobile);
	};
	_proDownloader.__doPost = function(_mobile){
		var _options = {type:'json',method:'POST'};
		_options.onload = this.__cbPost._$bind(this,_mobile);
		_options.onerror = this.__cbError._$bind(this);
		_options.data = _u._$object2query({cellphone:_mobile});
		_j._$request('/api/sms/downlink/sent', _options);
	};
	_proDownloader.__cbPost = function(_mobile,_result){
		this.__lock(false);
		if (!_result||_result.code!=200) {
			if (!_result||!_result.message)
				this.__error('服务请求异常');
			else
				this.__error(_result.message);
			return;
		}
//		if (_result.result!==true) {
//			this.__error('下载链接发送失败');
//			return;
//		}
		this.__tip('下载链接发送成功');
		if (typeof(g_stat)==='function') {
			var _module = 'index';
			if (/^\/invite/.test(location.pathname)) {
				_module = 'invite';
			} else if (/^\/(share|song|album|artist|playlist|program)\//.test(location.pathname)) {
				_module = 'share';
			}
    		g_stat('downloadlink',false,null,_module);
    	} else {
    		var _image=document.createElement("img");
    		_image.src="http://"+location.host+"/stat/?web=downloadlink&from="+
    			(/^\/share/.test(location.pathname)?'share':(/^\/invite/.test(location.pathname)?'invite':'index'));
    	}
	};
	_proDownloader.__cbError = function(){
		this.__lock(false);
		this.__error('服务请求超时');
	};
	_proDownloader.__tip = function(_message){
		var _div = this.__nodes[2];
		_div.innerText = _message||'';
		_div.style.display = !_message?'none':'';
		_e._$replaceClassName(_div,'s-fc6','s-fc8');
	};
	_proDownloader.__error = function(_message){
		var _div = this.__nodes[2];
		_div.innerText = _message||'';
		_div.style.display = !_message?'none':'';
		_e._$replaceClassName(_div,'s-fc8','s-fc6');
	};
	_proDownloader.__lock = function(_locked){
		if (_locked===undefined)
			return !!this.__locked;
		this.__locked = !!_locked;
	};
	_proDownloader.__checkMobile = function(){
		var _mobile = this.__nodes[0].value.trim();
		if (!_mobile||!/^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/.test(_mobile)) {
			this.__error("请输入有效的手机号码");return;
		}
		return _mobile;
	};
	_proDownloader._$show = function(){
		document.body.appendChild(this.__cbox);
		_supDownloader._$show.apply(this,arguments);
		this.__tip();
		this.__lock(false);
		this.__nodes[0].value = '';
		// IE6下不延迟操作会崩溃掉
		setTimeout(function(){this.__nodes[0].focus();}._$bind(this),10);
	};
	_proDownloader._$hide = function(){
		_supDownloader._$hide.apply(this,arguments);
		_e._$removeByEC(this.__cbox);
	};
	/**
	 * 全局登录接口
	 * @param  {Object} _options
	 * @return {Void}
	 */
	_x.download = function(_options,_event){
		_v._$stopDefault(_event);
		_options = _options||{};
		_options.parent = _options.parent||document.body;
		_p._$$Downloader._$getInstance(_options)._$show();
	};
};
define('{pro}downloader.js', 
	  ['{lib}base/event.js',
	   '{lib}ui/layer/layer.js',
	   '{lib}util/placeholder/placeholder.js'], f);