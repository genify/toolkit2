/**
 * Regular Component 基类，用于启动整页component
 * author yuqijun(yuqijun@corp.netease.com)
 */
define([
  'pro/lib/regularjs/dist/regular',
  'pro/widget/regular/directive/index',
  'pro/widget/regular/filter',
  'pro/base/request'
  ], function(x, directive,filters,request){

	 var slice = Regular.util.slice,
     msie = Regular.dom.msie,
     noop = function(){},
     config = {BEGIN: "{{", END: "}}"};

 if(Regular.config){
   Regular.config(config);
 }

 // 一些基础帮助函数
 var util = function(){
   var rEvent = /^on-(\w+)$/,
     rExpression = new RegExp("^" + config.BEGIN + "(.*)" + config.END + "$");

   // 获得元素的所有属性
   function getAttrs( element ){
     var attrs = element.attributes, len = attrs && attrs.length,
       attr, passedAttr = [];

     if(len){
       for( var i = 0; i < len; i++ ){
         if(!msie || msie > 8 || attrs[i].specified){
           attr = attrs[i]
           passedAttr.push(attr);
         }
       }
     }
     return passedAttr;
   }

   function getEventName(str){
     var matched = rEvent.exec(str);
     return matched && matched[1];
   }
   function getExpression(str){
     var matched = rExpression.exec(str) ;
     return matched && matched[1] && Regular.expression(matched[1]);
   }
   return {
     getAttrs: getAttrs,
     getEventName: getEventName,
     getExpression: getExpression
   }

 }();


 // 由Hub去承载初始化分立的全部component的责任;
 var Hub = Regular.extend({
   scope: Regular,
   init: function initHub(){
     var scope = this.scope;
     this._initComponents(scope._components);
     // @TODO: 是否开发指令的全局启动？
     // this._initDirective(scope._directives);
   },
   // 初始化所有Components
   _initComponents: function(components){
     var Component;
     for( var i in components ){
       Component = components[i];
       if( Component){
         this._initComponent(i, Component);
       }
     }
   },
   /**
    * 使用nes找到带有directive的节点,
    * 并初始化
    */
   _initDirectives: function(directives){
     var directive;
     for( var i in directives ){
       directive = directives[i];
       if( directive){
         this._initDirective(i, directive);
       }
     }
   },
   // 初始化单个指令
   _initDirective: function(name, directive){
     var container = this.container || document.body;
     var nodes = nes.all("[" + name +"]") ;
     nodes.forEach(this._singleDirective.bind(this, "r-" + name ,  directive, "name"))
   },
   // 初始化Component
   _initComponent: function(name, Component){
     var container =  this.container || document.body;
     var nodes = slice( container.getElementsByTagName(name) );
     nodes.forEach(this._initTag.bind(this, Component));
   },
   // 初始化单个标签
   _initTag: function(Component, node){
     var attrs = util.getAttrs(node);
     var data = {}, events = {},
       watchers = {}, context = this, id;

     attrs.forEach(function(attr){
       var value = attr.value,
         name = attr.name, expression, eventName;


       if(name === 'id') id=name;
       eventName = util.getEventName(name);
       expression = util.getExpression(value);
       if( !eventName ){ // data
         if( !expression ){
           data[name] = value
         }else{
           watchers[name] = expression;
           data[name] = expression.get(context);
         }
       }else{ //event bind
         events[eventName] = Regular.util.handleEvent.call(context, expression || value, eventName);
       }
     })



     var component = new Component({data: data, events: events, $parent: this});
     if(id) this[id] = component;
     component.$bind(this, watchers);
     component.$inject(node, 'after');
     node.parentNode.removeChild(node);
   }
 });
  /**
   * 重写Regular.dom.find. 使得可以使用选择器
   * @param  {String} sl 选择器
   * @return {[type]}    [description]
   */
  Regular.dom.find = function(sl){
    return nes.one(sl);
  }


  // BaseComponent与Hub没有任何关系， 它是整个工程的基础Regular组件(基类)，
  // 主要是作为容器使用, 你可以通过扩展BaseComponent来达到工程范围内的组件能力
  // 具体: http://regularjs.github.io/guide/zh/core/use.html
  //
  var BaseComponent = Regular.extend({
    // TODO
    $request: function(_url,_options){
      var self = this;
      var olderror = _options.onerror || noop,
        oldload = _options.onload || noop;


      self.$update('loading', true);
      function oncomplete(){
        self.$update('loading', false);
      }

      _options.onload = oldload._$aop(null, oncomplete).bind(this);
      _options.onerror = olderror._$aop(null, oncomplete).bind(this);

      request(_url,_options);
    }
  })// 扩展指令和事件
    .directive(directive.directives||{})
    .event(directive.events||{})
    .filter(filters || {});

  /**
   * 启动BaseComponent下的所有注册component
   * @return {[type]} [description]
   */
  BaseComponent.boot = function(data){
    new Hub({
      scope: BaseComponent,
      data: data || window.__data__ || {}
    })
  }

  return BaseComponent;
})