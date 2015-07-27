/**
 * 版本列表
 * author yuqijun(yuqijun@corp.netease.com)
 */

define([
  'base/util',
  'text!./list.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/widget/layer/dialog/dialog',
  'pro/widget/layer/create.version/create.version',
  'pro/widget/layer/view.version/view.version',
  'pro/components/notify/notify',
  'pro/base/config',
  ], function(_u,tpl,ut,ListComponent,Window,CreateVersionWin,ViewVersion,notify,config){
  var List = ListComponent.extend({
    template: tpl,
    url:config.URLPERFIX+'/backend/app/version/list',
    config: function(data){
        ut.extend(data, {
          total: 1,
          current: 1,
          limit: 50,
          list: []
        });
        
        this.$watch(this.watchedAttr, function(){
          if(this.shouldUpdateList()) this.__getList();
        });
    },
    init: function(){
      this.supr();

    },
    _getList:function(filter){
        return this.data.list.filter(function(_item){
            return !!_item[filter];
        });
    },
    computed:{
        allChecked:{
            get: function(_data){
                return _data.list.length===(this._getList('checked')||_r).length;
            },
            set: function(_sign,_data){
                _u._$forEach(
                    _data.list,function(_it){
                        _it.checked = _sign;
                    }
                );
            }
        }
    },
    getItem:function(_id){
    	var _index = _u._$indexOf(this.data.list,function(_item){
    		return _item.id==_id;
    	})
    	if(_index!=-1){
    		return this.data.list[_index];
    	}
    },
    start:function(){
    	var _list = this._getList('checked');
    	if(_list.length>1){
    		Window._$allocate({cnt:'只能禁用/启用某一客户端最新单条更新版本记录！'})._$show();
    	}else if(_list.length==1) {
    		this.$request(config.URLPERFIX+'/backend/app/version/start',{
    			data:{id:_list[0].id},
    			onload:function(_json){
    				if(_json.code==200){
	    				var item = this.getItem(_list[0].id);
	    				item.states = 1;
	    				_list[0].checked = false;
	    				item.operationLog.splice(0,0,{createTime:+new Date,type:3})
    				}
    			}
    		})
    	}
    },
    ban:function(){
    	var _list = this._getList('checked');
    	if(_list.length>1){
    		Window._$allocate({cnt:'只能禁用/启用某一客户端最新单条更新版本记录！'})._$show();
    	} else if(_list.length==1) {
    		this.$request(config.URLPERFIX+'/backend/app/version/ban',{
    			data:{id:_list[0].id},
    			onload:function(_json){
    				if(_json.code==200){
	    				var item = this.getItem(_list[0].id);
	    				item.states = 2;
	    				_list[0].checked = false;
	    				item.operationLog.splice(0,1,{createTime:+new Date,type:2})
    				}
    			}
    		})
    	}
    },
    remove:function(){
    	var _list = this._getList('checked');
    	if(_list.length){
    		var _ids =[];
    		for(var i=0,l=_list.length;i<l;i++){
    			_ids.push(_list[i].id);
    		}
    		this.$request(config.URLPERFIX+'/backend/app/version/remove',{
    			data:{ids:_ids.join(',')},
    			onload:function(_json){
    				if(_json.code==200){
	    				for(var i=0,l=_list.length;i<l;i++){
	    					var _index = _u._$indexOf(this.data.list,_list[i]);
	    					if(_index!=-1){
	    						this.data.list.splice(_index,1);
	    					}
	    				}
	    				this.data.total -= _list.length;
    				} else{
    					notify.show('删除失败');
    				}
    			}
    		})
    	}
    },
    create:function(){
    	CreateVersionWin._$allocate({
    		onok:function(_item){
    			this.data.list.splice(0,0,_item);
    			this.$update();
    		}._$bind(this)
    	})._$show();
    },
    view:function(_item){
    	ViewVersion._$allocate({version:_item})._$show();
    }
  });
  List.filter('clientType',function(_type){
	  var map ={2:'安卓',1:'IOS'};
	  return map[_type]||'未知类型';
  })
  List.filter('forceUpdate',function(_type){
	  var map ={1:'是',2:'否'};
	  return map[_type]||'未知';
  })
  List.filter('status',function(_status){
	  var map ={1:'新建',2:'禁用',3:'启用'};
	  return map[_status]||'未知';
  })
  return List;

});