/**
 * 后台管理 商品关联列表页
 * Created by hale on 12/11/14.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'base/util',
    'text!pro/components/relateRecord/relate.html',
    'text!pro/components/relateRecord/searchForm/relate.html',
    'pro/base/util',
    'pro/base/request',
    'pro/module/common/tablist',
    'pro/widget/form',
    'pro/base/config',
    'pro/components/relateRecord/relate',
    'pro/components/common/databox',
], function(_k,_e, _v,_u,tpl,sf,_,request,_mod,_form,config,List, DataBox, _p, _o, _f, _r,_pro) {

    _p._$$RelateModule = _k._$klass();
    _pro = _p._$$RelateModule._$extend(_mod._$$MModule);

    _pro.__init = function(_options){
	
    	/**
         * 默认起始日期为系统当前日期，取后三天内预计入港的商品（既截止日期为系统当前日期+2）
         */
        var _now = new Date().getTime(),
            _3dl = _now + 2 * 24 * 60 * 60 * 1000;

    	var _conf = {
			wrapper:{
				data:{
					tabs:["未关联商品", "已关联商品"],
					searchBox:{
						importType:true
					},
					defaults: {
			            start:_u._$format(_now, 'yyyy-MM-dd'),
			            end:_u._$format(_3dl,'yyyy-MM-dd')
			        },
					exportUrl:'/backend/relateRecord/exportNonRelatedGoods',
					searchForm:sf,
					page:'relate'
				}
			},
			list:{
				url: config.URLPERFIX + '/backend/relateRecord/searchRelate',
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