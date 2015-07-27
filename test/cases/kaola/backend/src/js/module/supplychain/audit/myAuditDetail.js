/**
 * 后台管理 新建审批单
 * Created by yuqijun on 2015/05/08.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'base/util',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/widget/form',
    'pro/base/config',
    'pro/components/notify/notify',
    'pro/components/supplychain/trackaudit/trackaudit',
    'pro/widget/ui/contract/contract',
    './auditReadCompont.js',
], function(_k,_e, _v, _t,_ut,_,request,_t2,_t1,config,notify,PayRecordList,Contract,AuditReadModule,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		
		AuditReadModule._$allocate();
		
    }
    _p._$$Module._$allocate();
});