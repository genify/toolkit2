/**
 * 后台管理 跟单任务列表页
 * Created by hale on 23/06/15.
 */
NEJ.define([
	'base/klass',
	'base/element',
	'base/event',
	'text!pro/components/tracktask/index.html',
	'text!pro/components/tracktask/searchForm/index.html',
	'pro/base/request',
	'pro/module/common/tablist',
	'pro/widget/form',
	'pro/base/config',
	'pro/components/tracktask/index',
	'pro/components/common/databox'
], function(_k, _e,_v, tpl, sf, request, _mod, _form, config, List, DataBox, _p, _o, _f, _r,_pro) {

	_p._$$Module = _k._$klass();
	_pro = _p._$$Module._$extend(_mod._$$MModule);

	_pro.__init = function(_options) {
		
		var _conf = {
			wrapper:{
				data:{
					tabs:["未跟单任务","跟单中任务","跟单完成任务"],
					searchForm:sf
				}
			},
			list:{
				url: config.URLPERFIX + '/backend/supplychain/tracktask/getAudits4TrackTask',
				data:{
					action:{del:'/backend/relateRecord/canDeleteNewGoods'}
				},
				template:tpl
			}
		};

		this.__super(_options, _conf, List);
		
	};


	_p._$$Module._$allocate();
});