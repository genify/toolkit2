;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['regularjs'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('regularjs'));
  } else {
    window.Hub = factory(root.Regular);
  }

}(this, function( Regular ) {


  var slice = Regular.util.slice,
    msie = Regular.dom.msie,
    config = Regular.config || {BEGIN: "{{", END: "}}"};

  var util = function(){
    var rEvent = /^on-(\w+)$/,
      rExpression = new RegExp("^" + config.BEGIN + "(.*)" + config.END + "$");

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



  var Hub = Regular.extend({
    scope: Regular,
    init: function initHub(){
      var scope = this.scope;
      this._initComponents(scope._components);
    },
    _initComponents: function(components){
      var Component;
      for( var i in components ){
        Component = components[i];
        if( Component){
          this._initComponent(i, Component);
        }
      }
    },
    _initComponent: function(name, Component){
      var container =  this.container || document.body;
      var nodes = slice( container.getElementsByTagName(name) );
      nodes.forEach(this._initTag.bind(this, Component));
    },
    _initTag: function(Component, node){
      var attrs = util.getAttrs(node);
      var data = {}, events = {},
        watchers = {}, context = this;

      attrs.forEach(function(attr){
        var value = attr.value,
          name = attr.name, expression, eventName;


        eventName = util.getEventName(name);
        if( !eventName ){ // data
          expression = util.getExpression(value);
          if( !expression ){
            data[name] = value
          }else{
            watchers[name] = expression; 
            data[name] = expression.get(context);
          }
        }else{ //event bind
          events[eventName] = Regular.util.handleEvent.call(context, value, eventName);
        }
      })

      var component = new Component({data: data, events: events, $parent: this});
      component.$bind(this, watchers);
      component.$inject(node, 'after');
      node.parentNode.removeChild(node);
    }
  });


  return Hub;

}));




