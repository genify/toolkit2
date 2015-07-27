/**
 * ====================================================
 * 确认框窗体逻辑实现文件
 * 
 * @author hzjiangren@corp.netease.com
 * ===================================================
 * */
define('{pro}widget/window/confirm.js', ['{lib}ui/layer/window.js'], function(){
var _p = NEJ.P('haitao.bw'),
	_proConfirm,
	_proConfirmWithRemark;

var _seed_css = nej.e._$pushCSSText('.#<uispace>{position:absolute;z-index:1000;width:400px;border:1px solid #aaa;background:#fff;}\
		.#<uispace> .warmt{padding:10px;background-color:#158cba;border-bottom:1px solid #666;color:#fff;font-size:14px;}\
		.#<uispace> .warmc{padding:60px 40px 70px;}\
		.#<uispace> .layerb{float:right; margin:0 20px 20px 0;}\
		.#<uispace> .layerb button{display:inline-block;margin-left:20px;}')

_p._$$Confirm = NEJ.C();
_proConfirm = _p._$$Confirm._$extend(nej.ui._$$Window);

_proConfirm.__reset = function(_options) {
	this.__super(_options);
	
	this.__c1.innerHTML = nej.u._$escape(_options.c1);
	this.__c2.innerHTML = nej.u._$escape(_options.c2);
};

_proConfirm.__initXGui = function() {
	this.__seed_css = _seed_css;
	this.__seed_html = nej.e._$addNodeTemplate('<div class="layerm">\
		        	<h4 class="warmt wtag">xxxxx</h4>\
		            <div class="warmc">\
		            	<p class="wtag">xxxx</p>\
		            </div>\
		        </div>\
		        <div class="layerb">\
		        	<button class="w-btn w-btn-blue wtag" href="#" hidefocus="true">确 定</button><button class="w-btn w-btn-blue wtag" href="#" hidefocus="true">取 消</button>\
		        </div>');
};

_proConfirm.__initNode = function() {
	nej.ui._$$Layer._$supro.__initNode.call(this);
	
	var _ntmp = nej.e._$getByClassName(this.__body, 'wtag');
	this.__dopt.mbar = this.__c1 = _ntmp[0];
	this.__c2 = _ntmp[1];
	this.__ok = _ntmp[2];
	this.__cc = _ntmp[3];
	this.__dopt.body = this.__body;
	nej.v._$addEvent(this.__ok, 'click', this.__onOK._$bind(this));
	nej.v._$addEvent(this.__cc, 'click', this.__onCC._$bind(this));
	nej.v._$addEvent(this.__c1,'mousedown',this.__onDragStart._$bind(this));
};

/**
 * 点击"确定"按钮事件响应
 * */
_proConfirm.__onOK = function(_event){
	nej.v._$stop(_event);
	this._$hide();
	this._$dispatchEvent('onok');
};

/**
 * 点击"取消"按钮事件响应
 * */
_proConfirm.__onCC = function(_event){
	nej.v._$stop(_event);
	this._$hide();
	this._$dispatchEvent('oncc');
};

/**
 * ====================================================
 * 确认框窗体逻辑实现文件,可以填写富文本
 * 
 * @author hzjiangren@corp.netease.com
 * ===================================================
 * */
_p._$$ConfirmWithRemark = NEJ.C();
_proConfirmWithRemark = _p._$$ConfirmWithRemark._$extend(nej.ui._$$Window);

_proConfirmWithRemark.__reset = function(_options) {
	this.__super(_options);
	
	this.__c1.innerHTML = nej.u._$escape(_options.c1);
	this.__c2.innerHTML = _options.c2;
};

_proConfirmWithRemark.__initXGui = function() {
	this.__super();
	this.__seed_html = nej.e._$addNodeTemplate('<div class="layerm">\
		        	<h4 class="warmt wtag">xxxxx</h4>\
		            <div class="warmc">\
		            	<p class="wtag">xxxx</p>\
						<textarea class="wtag" style="width:350;height:100px;"></textarea>\
		            </div>\
		        </div>\
		        <div class="layerb">\
		        	<a class="w-sbtn w-sbtn-0 wtag" href="#" hidefocus="true">确 定</a><a class="w-sbtn w-sbtn-3 wtag" href="#" hidefocus="true">取 消</a>\
		        </div>');
};

_proConfirmWithRemark.__initNode = function() {
	nej.ui._$$Layer._$supro.__initNode.call(this);
	
	var _ntmp = nej.e._$getByClassName(this.__body, 'wtag'), i=0;
	this.__dopt.mbar = this.__c1 = _ntmp[i++];
	this.__c2 = _ntmp[i++];
	this.__remarktext = _ntmp[i++]
	this.__ok = _ntmp[i++];
	this.__cc = _ntmp[i++];
	this.__dopt.body = this.__body;
	nej.v._$addEvent(this.__ok, 'click', this.__onOK._$bind(this));
	nej.v._$addEvent(this.__cc, 'click', this.__onCC._$bind(this));
	nej.v._$addEvent(this.__c1,'mousedown',this.__onDragStart._$bind(this));
};

/**
 * 点击"确定"按钮事件响应
 * */
_proConfirmWithRemark.__onOK = function(_event){
	nej.v._$stop(_event);
	this._$hide();
	this._$dispatchEvent('onok', this.__remarktext.value);
};

/**
 * 点击"取消"按钮事件响应
 * */
_proConfirmWithRemark.__onCC = function(_event){
	nej.v._$stop(_event);
	this._$hide();
	this._$dispatchEvent('oncc');
};

});