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
    'pro/components/supplychain/audit/flow_set',
], function(_k,_e, _v, _t,_ut,_t2,Flow_setList,_p, _o, _f, _r,_pro) {

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		
		for(var i=0,l=flowLevelList.length;i<l;i++){
			if(flowLevelList[i].flowLevel==100){
				flowLevelList[i].accountList = managerLevelList;
			}else if(flowLevelList[i].flowLevel==200){
				flowLevelList[i].accountList = directorLevelList;
			}else if(flowLevelList[i].flowLevel==300){
				flowLevelList[i].accountList = presidentLevelList;
			}
		}
		var list = new Flow_setList({data:{flowLevelList:flowLevelList}});
		list.$inject(_e._$get('configbox'));
	};
    _p._$$Module._$allocate();
});