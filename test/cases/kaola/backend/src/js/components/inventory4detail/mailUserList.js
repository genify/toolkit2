/**
 * 缺货统计
 * author mating(hzmating@corp.netease.com)
 */

define([
  'base/element',
  'base/util',
  'text!./mailUserList.html',
  'pro/base/util',
  '../ListComponent.js',
  'pro/components/notify/notify',
  'pro/base/config',
  'pro/base/util',
  'pro/components/modal/sureWindow/sure',
  'pro/components/modal/newMailUser/newMailUser'
  ], function(_e,_u,tpl,ut,ListComponent,notify,config,_,Sure,NewMailUserModal){
  var List = ListComponent.extend({
    template: tpl,
    url:'/backend/dw/warningEmail/get',
    config: function(data){
        ut.extend(data, {
          offset: 0,
          limit: 50,
          pageNo: 0,
          list:[]
        });
        this.url += data.warningType?'?warningType='+data.warningType:'';
    },
    xdrOption:function(){
    	return {method:"post"};
    },
    onUpdateUser:function(item){
      var obj = {type:2,title:'编辑联系人',user:{name:item.name,email:item.email,id:item.id}};
    	var modal = new NewMailUserModal({data:obj});
    	modal.$on('confirm',function(_user){
    		item.name = _user.name;
    		item.email = _user.email;
    		this.$update();
    	}._$bind(this))
    },
    onRemoveUser:function(item,index){
    	var modal = new Sure({data:{desc:'确认删除该联系人？',title:'删除用户'}});
    	modal.$on('confirm',function(){
    		this.$request('/backend/dw/warningEmail/delete',{
    			data:{id:item.id},
    			onload:function(_json){
    				if(_json.code==200){
    					this.data.list.splice(index,1)
    				} else{
    					notify.showError(_json.message);
    				}
    			}._$bind(this),
    			onerror:function(_json){
              notify.showError(_json.message || '请求失败，请稍后重试！');
    			}
    		})
    		this.$update();
    	}._$bind(this))
    },
    init: function(){
      this.supr();
      this.__getList();
    },
    pageChange: function(page){
      this.data.offset = (page-1)*50;
      this.data.pageNo = page-1;
      this.__getList();
    },
    getListParam: function(){
        var data = this.data;
        return _.extend({
            	pageSize: data.limit,
            	pageNo: data.current
          }, this.getExtraParam(data));
      },
      __getList :function(){
    	var data = this.data;
        var option = {
          progress: true,
          method:'GET',
          data: this.getListParam(),
          onload: function(result){
              list = result.data.list||[];
            _.mergeList(list, data.list,data.key||'id')

            data.total = result.data.total;
            data.list = list;
          },
          onerror: function(json){
            // @TODO: remove
          }
        };
        this.$request(this.url,option)
    }

  });
  return List;

});