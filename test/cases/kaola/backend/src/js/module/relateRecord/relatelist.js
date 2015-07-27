/**
 * 后台管理 商品备案列表页
 * Created by hale on 12/11/14.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'base/global',
    'text!pro/components/relateRecord/relatelist.html',
    'text!pro/components/relateRecord/searchForm/relate.html',
    'pro/base/util',
    'pro/module/common/tablist',
    'pro/widget/form',
    'pro/base/config',
    'pro/components/relateRecord/relate',
    'pro/components/common/databox',
], function(_k,_e, _v,_g,tpl,sf, _,_mod,_form,config,List, DataBox, _p, _o, _f, _r,_pro) {

    _p._$$RelateModule = _k._$klass();
    _pro = _p._$$RelateModule._$extend(_mod._$$MModule);

    _pro.__init = function(_options){

    	var _conf = {
			wrapper:{
				data:{
					tabs:["未备案商品", "已备案商品"],
					searchBox:{
						importType:false
					},
					exportUrl:'/backend/relateRecord/exportNotRecordedSku',
					searchForm:sf
				}
			},
			list:{
				url: config.URLPERFIX + '/backend/relateRecord/searchRecord',
				data:{
					action:{del:'/backend/relateRecord/canDeleteNewGoods'}
				},
				template:tpl
			}
		};

		this.__super(_options, _conf, List);
	};

    _p._$$RelateModule._$allocate();
});