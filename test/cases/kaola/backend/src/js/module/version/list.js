/**
 * 后台管理 登陆页面
 * Created by zmm on 12/11/14.
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
    'pro/components/version/list'
], function(_k,_e, _v, _t,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$VersionModule = _k._$klass();
    _pro = _p._$$VersionModule._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__searchForm = _e._$get('searchForm');
		_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
			var fileDate = function (data){
				if(!data.startDate){
					data.startDate = '';
				}
				if(!data.endDate){
					data.endDate = '';
				}
			}
			fileDate(_data);
			if(!this.__list){
				this.__list = new List({data:{condition:_data}});
				this.__list.$inject(_e._$get('list'));
			} else{
				this.__list.refresh(_data);
			}
		}})
		_v._$addEvent(this.__searchForm.type,'change',this.__onTypeChange._$bind(this));
		this.__onTypeChange();
	};
    
	_pro.__onTypeChange = function(){
		var _type = this.__searchForm.type.value;
		if(channals[_type]){
			_.initSelect(this.__searchForm.channal,channals[_type],'id','name');
		} else{
	    	request(config.URLPERFIX+'/backend/app/version/clientInfo',{
	    		data:{type:_type},
	    		onload:function(_json){
	    			this.__channalList = _json.body.chanels;
	    			channals[_type] =[{id:'',name:'All'}];
	    			_r.push.apply(channals[_type],this.__channalList);
	    			_.initSelect(this.__searchForm.channal,channals[_type],'id','name');
	    		}._$bind(this)
	    	})
		}
	};
    _p._$$VersionModule._$allocate();
});