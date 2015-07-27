/*
 * --------------------------------------------
 * 项目内工具函数集合，此页面尽量写注释
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * --------------------------------------------
 */
define([
        'base/util'
    ], function(_ut) {

  var _ = {},
    noop = function(){};


  // 类型判断， 同typeof 
  _.typeOf = function (o) {
    return o == null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase();
  }


  _.findInList = function(id, list, ident){
    ident = ident || "id";
    var len = list.length;
    for(; len--;){
      if(list[len][ident] == id) return len
    }
    return -1;
  }
  _.merge = function(obj1, obj2){
    var 
      type1 = _.typeOf(obj1),
      type2 = _.typeOf(obj2),
      len;

    if(type1 !== type2) return obj2;
    switch(type2){
      case 'object': 
        for(var i in obj2){
          if(obj2.hasOwnProperty(i)){
            obj1[i] = _.merge(obj1[i], obj2[i]);
          }
        }
        break;
      case "array": 
        for(var i = 0, len = obj2.length; i < len; i++ ){
          obj1[i] = _.merge(obj1[i], obj2[i]);
        }
        obj1.length = obj2.length;
        break;
      default: 
        return obj2;
    }
    return obj1;
   }  // meregeList
  /**
   * list merge原列表
   * list2 新列表
   * 最后改动的list
   */
  _.mergeList = function(list, list2, ident){
    ident = ident || "id";
    var len = list.length;
    for(; len--;){
      for(var i = 0, len1 = list2.length; i < len1; i++){
        if(list2[i][ident] != null&&list2[i][ident] === list[len][ident]){
          list.splice(len, 1, _.merge(list2[i],list[len]));
          break;
        }
      }
    }
  }
  // 深度clone
  _.clone = function(obj){
    var type = _.typeOf(obj);
    switch(type){
      case "object": 
        var cloned = {};
        for(var i in obj){
          cloned[i] = _.clone(obj[i])
        }
        return cloned;
      case 'array':
        return obj.map(_.clone);
      default:
        return obj;
    }
    return obj;
  }

  _.extend = function(o1, o2 ,override){
	    for( var i in o2 ) if( o1[i] == undefined || override){
	      o1[i] = o2[i]
	    }
	    return o1;
	  }
  _.initSelect = function(_select,_list,_value,_text){
	  _select.options.length = 0;
	  _value = _value||'value';
	  _text = _text||'text';
	  for(var i=0,l=_list.length;i<l;i++){
		  if(typeof _list[i]==='string'){
			  var option = new Option(_list[i],_list[i]);
		  } else{
			  var option = new Option(_list[i][_text],_list[i][_value]);
		  }
		  _select.options.add(option);
	  }
  }
  _.setSelectValue = function(_select,_value){
	  var list = _select.options,selectedIndex=-1;
	  for(var i=0,l=list.length;i<l;i++){
		  if(list[i].value == _value){
			  selectedIndex = i;
			  break;
		  }
	  }
	  if(selectedIndex!=-1){
		  _select.selectedIndex = selectedIndex
	  }
  }
  _.copyObject = function(obj){
  	var result;
	if(_ut._$isArray(obj,'array')){
		result =[];
		for(var i=0,l=obj.length;i<l;i++){
			if(typeof obj[i] =='object'){
				result.push(_.copyObject(obj[i]));
			} else{
				result.push(obj[i]);
			}
		}
	} else if(_ut._$isObject(obj,'array')){
		result ={};
    	for(var i in obj){
    		if(obj.hasOwnProperty(i)){
    			if(typeof obj[i]=='object'){
    				result[i] = _.copyObject(obj[i]);
    			} else{
    				result[i] = obj[i];
    			}
    		}
    	}
	}
	return result;
  };
  _.filterNoneData = function(_data){
	  for(var _key in _data){

		  if(_data.hasOwnProperty(_key)){
			  if(typeof _data[_key] == 'number' && isNaN(_data[_key])){
				  delete _data[_key];
			  }
		  }
	  }
  }
  _.currencyFormat = function(nStr){
	  nStr += '';
	    var x = nStr.split('.');
	    var x1 = x[0];
	    var rgx = /(\d+)(\d{3})/g;
	    var x2 = x.length >1 ? '.' + x[1] : '';
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    
	    return x1+x2;
  }
  return _;

	
})
