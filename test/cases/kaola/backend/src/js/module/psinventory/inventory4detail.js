/**
 * 缺货统计
 * Created by mating on 2015/03/27.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/widget/form',
    'pro/base/config',
    'pro/components/inventory4detail/inventory4detail'
], function(_k,_e, _v, _t,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
	// var channals ={};

    _p._$$VersionModule = _k._$klass();
    _pro = _p._$$VersionModule._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__searchForm = _e._$get('searchForm');
		_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
			var filterDate = function (data){
				var item = ["goodsId","from","to"];
				item.forEach(function(i){
					if(!data[i] || data[i].trim()==""){
						data[i] = -1;
					}else{
						data[i] = +data[i];
					}	
				});
				data.type = ~~data.type;
			}
			filterDate(_data);
			if(!this.__list){
				var self = this;
				this.__list = new List({data:_data});
				this.__list.$inject(_e._$get('list'));
			} else{
				_.extend(this.__list.data, _data, true);
				this.__list.getList();
			}
		}})
	};
    _pro.__onPageChange = function(page){
    	
    };

    _p._$$VersionModule._$allocate();
});