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
    'pro/components/inventory4detail/inventory4detail_new'
], function(_k,_e, _v, _t,_ut,_,request,_t2,_t1,config,List,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__searchForm = _e._$get('searchForm');
		this.__onCategry1Change();
		this.webForm = 
				_t1._$$WebForm._$allocate({form:'searchForm',onsubmit:function(_data){
				this.__filterData(_data);
				if(!this.__list){
					this.__list = new List({data:{condition:_data}});
					this.__list.$inject(_e._$get('list'));
				} else{
					this.__list.refresh(_data);
				}
			}._$bind(this)})
		_v._$addEvent(this.__searchForm.firstCategoryId,'change',this.__onCategry1Change._$bind(this));
		_v._$addEvent(this.__searchForm.secondCategoryId,'change',this.__onCategry2Change._$bind(this));
		_v._$addEvent(this.__searchForm.exportData,'click',this.__onExportClick._$bind(this));
	};
	_pro.__filterData = function(data){
		if(data.isWarning==-1){
			delete data.isWarning;
		} else{
			data.isWarning = data.isWarning=='1'?true:false;
		}
		return data;
	}
    _pro.__onExportClick = function(event){
    	_v._$stop(event);
    	window.open('/backend/dw/stat/exportInventory4Details?'+_ut._$object2query(this.__filterData(this.webForm._$data())));
    }
	_pro.__onCategry1Change = function(){
		var categoryId = this.__searchForm.firstCategoryId.value;
		var index = _ut._$indexOf(categoryTree,function(item){
				return item.id==categoryId;
			});
		if(index!=-1){
			this.category2list = categoryTree[index].children;
			this.__initSelect(this.__searchForm.secondCategoryId,this.category2list);
		}
	};
	_pro.__initSelect =function(selectNode,list){
		selectNode.options.length=1;
		for(var i=0,l=list.length;i<l;i++){
			var op = new Option(list[i].categoryName,list[i].id);
			selectNode.options.add(op);
		}
	};
	_pro.__onCategry2Change = function(){
		var categoryId = this.__searchForm.secondCategoryId.value;
		var index = _ut._$indexOf(this.category2list,function(item){
			return item.id==categoryId;
		});
		this.__initSelect(this.__searchForm.thirdCategoryId,this.category2list[index].children);
	};
    _p._$$Module._$allocate();
});