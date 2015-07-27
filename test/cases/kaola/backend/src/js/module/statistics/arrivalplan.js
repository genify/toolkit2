/**
 * 后台管理 登陆页面
 * Created by zmm on 12/11/14.
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
    'pro/components/supplychain/statistics/list'
], function(_k,_e, _v, _t,_ut,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__searchForm = _e._$get('searchForm');
		this.__setDate();
		this.webForm = 
				_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
				_.filterNoneData(_data);
				if(!this.__list){
					this.__list = new List({data:{condition:_data,url:'/backend/arrivalPlan/search'}});
					this.__list.$inject(_e._$get('list'));
				} else{
					this.__list.refresh(_data);
				}
			}._$bind(this)})
	};
	_pro.__getMontDays = function(_date){
		var map = {
				'0':31,
				'1':28,
				'2':31,
				'3':30,
				'4':31,
				'5':30,
				'6':31,
				'7':31,
				'8':30,
				'9':31,
				'10':30,
				'11':31,
		}
		var month = _date.getMonth();
		if(month==1){
			var _year = _date.getYearFull();
			if((((_year%4)==0)&&(_year%100)!=0)||(_year%400==0)){
				return 29;
			} else {
				return 28;
			}
		} else{
			return map[month+''];
		}
	}
	_pro.__setDate = function(){
		var date = new Date();
		monthFirstDay = date.setDate(1);
		this.__searchForm.start.value = _ut._$format(monthFirstDay,'yyyy-MM-dd');
		monthLastDay = date.setDate(this.__getMontDays(date));
		this.__searchForm.end.value = _ut._$format(monthLastDay,'yyyy-MM-dd');
	};
    _p._$$Module._$allocate();
});