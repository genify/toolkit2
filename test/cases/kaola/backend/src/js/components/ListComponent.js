/**
 * 基于NEJ和bootstrap的日期选择器
 * author hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 */

define([
  'pro/base/util',
  'base/util',
  'pro/widget/BaseComponent',
  'pro/components/pager/pager'
  ], function(_,_ut, BaseComponent){

  // ###data
  //  - pager
  //    * total: 列表总数 
  //    * list : 列表数组
  // ###example
  // <div>
  //  {{#list list as item}}
  //     
  //  {{/item}}
  // </div>

  var ListComponent = BaseComponent.extend({
    // 配置链接
    // @子类必须提供
    // dwr: {beanName:'xxx',method:'yyy'},
  // 任意一个监听列表发生改变时，判断更新列表 
  // @子类修改
    watchedAttr: ['current'],
    config: function(data){
      _.extend(data, {
        total: 1,
        current: 1,
        limit: 10,
        list: []
      });
      
      this.$watch(this.watchedAttr, function(){
        if(this.shouldUpdateList()){
           this.__getList();
        }
      })
    },
    init: function(){
      //if(!this.url) throw 'ListModule未指定url';
      
      // 需要自定义复杂的更新策略, $emit('updatelist')事件即可
      this.$on('updatelist', this.__getList.bind(this));

    },
    // @子类修改
    shouldUpdateList: function(data){
      return true;
    },
    getExtraParam:function(){
      return this.data.condition;
    },
    refresh:function(_data){
      this.data.current = 1;
      this.data.pageNo = 1;
      this.data.condition = _data;
      this.$emit('updatelist');
    },
    getListParam: function(){
      var data = this.data;
      return _.extend({
          limit: data.limit,
          offset: data.limit * (data.current-1),
          page: data.current
        }, this.getExtraParam(data));
    },
    __bodyResolver:function(json) {
      var result = json.body || json.data,
          list = result.list||[];
      _.mergeList(list, this.data.list,this.data.key||'id')

      this.data.total = result.total;
      this.data.list = list;
    },
    // update loading
    __getList: function(){
      var data = this.data;
      var option = {
        progress: true,
        data: this.getListParam(),
        type:'json', // 如果不加
        onload: function(json){
            this.__bodyResolver(json);    
        },
        onerror: function(json){
          // @TODO: remove
          console.log(json);
        }
      };
      //继承类提供xdrOption方法，用来表明请求类型
      /**
       * function(){
       *  return {method:'POST',norest:true}
       & }
      **/
      if(this.xdrOption){
        var xdrOpt = this.xdrOption();
        if(xdrOpt.norest){
          option.data = _ut._$object2query(this.getListParam());
          option.norest = true;
        }

        option.method = xdrOpt.method||'GET';

      }
      this.$request(this.url,option)
    },
    _$remove:function(_id) {
      var _index = 0,
          data   = this.data;
      for ( var i = 0, len = data.list.length; i < len; i++ ) {
        var _obj = data.list[i];
        if ( _obj.id == _id ){
          break;
        }
        _index ++;
      }
      data.total--;
      data.list.splice(_index, 1);
      this.$update();
    }
  })


  return ListComponent;

})