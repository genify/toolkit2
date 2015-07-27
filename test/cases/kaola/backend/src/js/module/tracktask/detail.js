/**
 * 后台管理 跟单详情页
 * Created by hale on 23/06/15.
 */
NEJ.define([
	'base/klass',
	'base/element',
	'base/event',
	'pro/widget/module',
	'pro/base/config',
	'pro/module/tracktask/tabview',
	'text!./task.html',
	'text!./detail.html'
], function(_k, _e,_v, _mod, config,TabView,taskTpl, detailTpl,_p, _o, _f, _r,_pro) {

	_p._$$Module = _k._$klass();
	_pro = _p._$$Module._$extend(_mod._$$MModule);

	_pro.__init = function(_options) {
		this.__super(_options);

		var _conf = {
			data:{
				tabs:['跟单任务','审批单详情'],
				specs:[taskTpl,detailTpl]
			}
		}

		var _tabview = new TabView(_conf);
		_tabview.$inject(_e._$get('tabview'));
		
	};

	_p._$$Module._$allocate();
});