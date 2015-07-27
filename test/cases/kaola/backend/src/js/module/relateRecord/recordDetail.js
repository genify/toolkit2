/**
 * 后台管理 商品备案计划详情页
 * Created by hale on 12/11/14.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'pro/base/util',
    'pro/widget/module',
    'pro/widget/form',
    'pro/components/relateRecord/record/dialog'
], function(_k,_e, _v,_,_t2,_t1,Modal, _p) {

    _p._$$DetailModule = _k._$klass();
    _pro = _p._$$DetailModule._$extend(_t2._$$MModule);

    var _modal = null;
    _pro.__init = function(_options){
		this.__super(_options);
		
        
        _v._$addEvent(_e._$get('recordGoods'),'click',this.__onRecordBtnClick);
	};
    _pro.__onRecordBtnClick = function() {
        if ( _modal == null ){
            new Modal({data:{isRelated:isRelated, isRecorded:isRecorded}}).$inject(_e._$get('dialog'));
        }
    }

    _p._$$DetailModule._$allocate();
});