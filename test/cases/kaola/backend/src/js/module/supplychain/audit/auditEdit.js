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
    './auditEditCompont.js',
], function(_k,_e, _v, _t,_ut,_t2,EditModule,_p, _o, _f, _r,_pro) {

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		EditModule._$allocate();
	};
    _p._$$Module._$allocate();
});