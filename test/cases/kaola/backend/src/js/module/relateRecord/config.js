/**
 * 
 * Created by yuqijun on 2015/06/11.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'base/util',
    'pro/widget/module',
    'pro/components/supplychain/config/config'
], function(_k,_e, _v, _t,_ut,_t2,Config,_p, _o, _f, _r,_pro) {

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		
		this.__config = new Config({data:{
			relateRecordConfigsList:relateRecordConfigsList,
			recordRelateConfigsList:recordRelateConfigsList,
			onlyRelateConfigsList:onlyRelateConfigsList
		}})
		this.__config.$inject(_e._$get('configbox'));
	};
    _p._$$Module._$allocate();
});