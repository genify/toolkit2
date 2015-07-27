/**
 * ====================================================
 * toast提示逻辑实现文件
 * 
 * @author hzjiangren@corp.netease.com
 * ===================================================
 * */
define('{pro}widget/window/confirm.js', ['{lib}ui/base.js'], function(){
var _p = NEJ.P('haitao.bw'),
	_toast,
	_erroralert;

var _seed_css = nej.e._$pushCSSText('');

_p._$$Toast = NEJ.C();
_proToast = _p._$$Toast._$extend(nej.ui._$$Abstract);

_proToast.__init = function() {
	this.__super();
};

_proToast.__reset = function(_options) {
	this.__super(_options);

	this.__text.innerText = _options.text;
	if(!_options.hide && !!_options.text) {
		window.setTimeout(function(){this.__doAnim()}._$bind(this),100);
	}
};

_proToast.__initXGui = function() {
	this.__seed_css = _seed_css;
	this.__seed_html = nej.e._$addNodeTemplate('<div class="m-toast">\
			<p class="wtag">xxxxxx</p>\
		</div>');
};

_proToast.__initNode = function() {
	this.__super();

	var _ntmp = nej.e._$getByClassName(this.__body, 'wtag'), i=0;
	this.__text = _ntmp[i++];
};

_proToast.__doAnim = function() {
	this.__body.style.opacity = 1;
	window.setTimeout(function(){this.__body.style.opacity = 0}._$bind(this), 1500);
};

_proToast.__showto = function(_text) {
	if(!!_text) {
		this.__text.innerText = _text;
	}

	this.__doAnim();
};

});