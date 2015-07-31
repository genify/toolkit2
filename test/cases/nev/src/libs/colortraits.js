define(function(){
  var exportTraits;
  function export$(exportObj){
    exportTraits = exportObj;
  };






var slice = Array.prototype.slice;

/*------------------   colortraits 中一些依赖的帮助函数 start  ------------------*/
//原本此类帮助函数来源于 colorbox 的 debug 和 util 模块，用来调试 和 兼容 ie6 //
//但由于 colorsight 项目需要将 colortraits 模块独立， 并由外部注入。因此才将帮助函数重新在此处实现一份//

// var assert = require("./debug").assert;
// var util = require("./util");
// var objectKeysForEach = util.objectKeysForEach;
// var arrayForEach = util.arrayForEach;
// var arraySome = util.arraySome;
// var identifier = util.identifier;
// var objectDotCreate = util.objectDotCreate;

var assert = function (exp,msg)
{
  if (exp)
  {
    return true;
  }
  else
  {
    var theMsg = msg === undefined ? "assert !!!" : msg;
    console.log("exception throwed:  " + theMsg);
    throw (theMsg);
  }
}

var objectKeysForEach = function(obj, cb)
{
  for(var key in obj)
  {
    if(obj.hasOwnProperty(key))
      cb(key, obj);
  }
}

var arrayForEach = (function(){
  if(Array.prototype.forEach)
  {
    return function(obj, cb)
    {
      obj.forEach(cb);
    }
  }
  else
  { 
    return function(obj, cb)
    {
      var i = 0, len = obj.length;
      
      for (; i<len; i++){
        cb(obj[i], i);
      };
    }
  }
})();

var arraySome = (function(){
  if(Array.prototype.some)
  {
    return function(obj, cb)
    {
      return obj.some(cb);
    };
  }
  else
  {
    return function(obj, cb)
    {
      var i = 0;
      while (i < obj.length)
      {
        if (cb(obj[i], i, obj))
          return true;
        
        i++;
      }

      return false;
    };
  }
})();

var identifier = (function(){
  var __idGenter = 0;

  return function(obj)
  {
    if (obj.__identifier === undefined)
    {
      return obj.__identifier = __idGenter++;
    }
    else
    {
      return obj.__identifier;
    }
  }
})();


//兼容ie6、7、8没有 Object.create接口。
var emptyObject = {};
var objectDotCreate = (function(){
  if(Object.create && emptyObject.__proto__)
  {
    return Object.create;
  }
  else
  {
    return function(proto)
    {
      var ExObjectDotCreate = function()
      {

      }
      ExObjectDotCreate.prototype = proto;
      var newObj = new ExObjectDotCreate();
      newObj.__proto__ = proto;
      return newObj;
    }
  }
})();

/*------------------  colortraits 中一些依赖的帮助函数 end  ------------------*/

//将 properties 中的所有属性复制到 obj 中。
var addProperties = function(obj, properties)
{
  //在IE中，__proto__是一个普通的属性。为了尽量跟其他浏览器兼容，所以这里__proto__需要是enumerable:false, writable:true,但是在 ie6 下没办法做到这件事情。
  for(var key in properties)
  {
    if(properties.hasOwnProperty(key))
    {
      obj[key] = properties[key];
    }
  }

  return obj;
}

//创建一个以 proto 为原型的对象，并为新对象中加入 properties 中所有属性。
var createObject = function(proto, properties)
{
  var newobj = objectDotCreate(proto);

  if(properties)
    addProperties(newobj, properties);

  return newobj;
};

//判断是否为 local 方法名。
var isLocalMethod = function(methodName)
{
  if(methodName[0] != undefined)
    return methodName[0] == "_" && methodName[1] == "_";
  else
    return methodName.indexOf("__") == 0;
}

//判断属性列表是否合法。
var checkTraitProperties = function(directUsedTraits, properties)
{
  var usedTraitsIds = {};
  var grantTraitsIds = [];

  if(properties === undefined)
    return;

  assert((properties instanceof Array), "bad properties type!!!!");

//判断属性列表格式是否合法，属性列表只能是 ["propName", ["propName", grantProp]]类似这样的组合。
  for(var i = 0; i < properties.length; ++i)
  {
    var value = properties[i];
    if(value instanceof Array)
    {
      assert(value.length === 2, "bad properties array value length");
      assert(typeof(value[0]) === "string", "bad properties array first value");
      assert(value[1].isGrant, "bad properties array second value");

      for(var id in value[1].grantTraitIdentifiers)
      {
        if(value[1].grantTraitIdentifiers.hasOwnProperty(id))
        {
          grantTraitsIds.push(id);
        }
      }
    }
    else if(typeof(value) != "string")
    {
      assert(false, "bad properties !!!!!!!");
    }
  }
  
//判断所有 grantProp 中的授权的 trait 是否为直接使用的 trait。
  var trait;
  for(var i = 0; i < directUsedTraits.length; ++i)
  {
    trait = directUsedTraits[i];
    usedTraitsIds[identifier(trait)] = identifier(trait);
  }

  assert(
    !(arraySome(grantTraitsIds, 
      function(id){
        if(usedTraitsIds[id] === undefined)
          return true;
    })), 
    "argument is not valid properties!!! "
  );
}

//将数组形式的属性列表转为{propName:grantValue}形式，若不是授权属性，则 grantValue 为 undefined。
var convertTraitProperties = function(properties)
{
  var objProperties = {};

  if(properties != undefined)
  {
    for(var name in properties)
    {
      if(properties.hasOwnProperty(name))
      {
        var prop = properties[name];
        if(prop instanceof Array)
        {
          objProperties[prop[0]] = prop[1];
        }
        else if(typeof(prop) === "string")
          objProperties[prop] = undefined;
      }
    }
  }

  return objProperties;
}

//初始化 trait 的默认名字映射表：{propName : traitId + propName}
function initTraitDefaultNameMap(trait)
{
  var nameMap = {};
  var id = identifier(trait);

  for(var name in trait._properties)
  {
    if(trait._properties.hasOwnProperty(name))
      nameMap[name] = id + name;
  }

  trait._defaultNameMap = nameMap;
}

//为trait对应的属性properties生成一个名字映射集合列表namesMap，该列表主要为了合并授权属性做准备。
/*
假如 trait 对应的 properties 为 
{
  a : undefined,
  b : trait1.grant("x")
}。
那么生成的名字映射集合列表 namesMap 为：
[
  {traitId+a : traitId+a},

  {
    traitId+b : traitId+b,
    trait1Id+x : trait1Id+x,
  }
]
数组中每一项代表一个名字映射集合，该名字映射集合中存放了多个trait的默认映射名字，以 map 存储；代表了这几个 trait 属性需要合并为同一个属性。
*/
var genPropertiesNamesMap = function(trait, properties)
{
  var namesMap = [];

  for(var name in properties)
  {
    if(!properties.hasOwnProperty(name))
      continue;

    var idName = trait._defaultNameMap[name];
    var value = properties[name];
    var nameMap = {};
    nameMap[idName] = idName;
    if(value != undefined)
    {
      assert(value.isGrant, "bad properties value!!!");
      for(var grantName in value.grantNames)
      {
        if(!value.grantNames.hasOwnProperty(grantName))
          continue;
        nameMap[grantName] = grantName;
      }
    }

    namesMap.push(nameMap);
  }

  return namesMap;
}

//将多个 namesMaps 合并为一个 namesMap
//namesMaps 为 namesMap array。
var mergeNamesMaps = function(namesMaps)
{
  var nameRefs = {};
  var refId = 0;
  var len = namesMaps.length;
  var namesMap;
  var idRefs = {};

  //为所有 localName 生成对应的 ref。
  //需要 merge 为一项的所有 localName 的 ref对象中的 id 值相同。
  for(var i = 0; i < len; ++i)
  {
    namesMap = namesMaps[i];
    for(var id in namesMap)
    {
      var nameMap = namesMap[id];
      var nameMapRef = {id:refId, gId:refId};

      for(var name in nameMap)
      {
        if(!nameMap.hasOwnProperty(name))
          continue;

        if(nameRefs[name] != null)
        {
          var localIdRefs = idRefs[nameRefs[name].id];
          for(var gid in localIdRefs)
          {
            if(localIdRefs.hasOwnProperty(gid))
              localIdRefs[gid].id = refId;
          }            
        }
        else
        {
          nameRefs[name] = nameMapRef;

          if(idRefs[refId] == null)
            idRefs[refId] = {};
          idRefs[refId][nameRefs[name].gId] = nameRefs[name];
        }
      }
      ++refId;
    }
  }

  //此处遍历不适用 objectKeysForEach 是为了避免生成临时函数对象。
  var idNamsMap = {};
  for(var name in nameRefs)
  {
    if(!nameRefs.hasOwnProperty(name))
      continue;
    
    if(idNamsMap[nameRefs[name].id] == null)
      idNamsMap[nameRefs[name].id] = {};
    idNamsMap[nameRefs[name].id][name] = name;
    
  }
  
  return idNamsMap;
}


/**
@itrait[Trait]{
是唯一一个模块预定义的trait，其它所有的trait都基于它产生。

@itemize[#:style 'unnumbered
  @item{Trait:是一个完备的纯粹的功能单元，不能实例化对象。}
  @item{Trait:是一组方法和私有属性的集合。}
  @item{Trait:可扩展、可组合。}
  @item{Trait:可被 Klass 直接使用。}
]

}
@property[_t traitMsg #:attr 'PRIVATE]{
  @trait[Trait]
  当前 Trait 的私有命名空间。

  @itemize[#:style 'unnumbered
    @item{_t 只能够在 Trait 内部用 this._t 的方式获取，外部 anyObj._t 获取不到。}
    @item{通过 this._t 可以访问和修改 Trait 上的私有属性及调用 Trait 上的 local 方法。}
  ]  
}
*/
var traitPrototype = {};
var Trait = (function(){
  var Trait = createObject(
    traitPrototype, 
    {
      _methods : {},
      _lMethods : {},
      _usedTraits : [],
      _directUsedTraits : [],
      _properties: {},
      _defaultNameMap:{},
      _namesMap : [],
      forbidden : {_ownerTrait: Trait}
    }
  );

/**
@method[isTrait]{
  @trait[Trait]
  @return[boolean]{true:是；false:不是。}
  询问对象是否为 Trait。
}
*/
  traitPrototype.isTrait = function()
  {
    return true;
  };
/**
@method[extend]{
  @trait[Trait]
  @param[extMethods object]{
    扩展方法集合。

    @jscode{
      例如：
      {
        move : function(){},
        __jump : function(){}
      }
    }

    @bold{local方法}扩展方法集合中，以"__"双下划线开头的方法为 local 方法，只能够在所属 
    Trait 内部或者直接使用该 Trait 的Klass 或 Trait使用。
  }
  @param[properties array]{
    扩展属性集合。

    @jscode{
      //例如：
      ["position", ["speed", base.grant("speed")]]
      //trait上声明的属性全部为 trait 私有属性，外部不可以直接访问。
      //若外部想要访问 trait 私有属性，则必须通过授权的方式访问。
      //此处授权只能针对被扩展的 base Trait。
    }
  }
  @return[@type[Trait]]{新trait。}
  以原始Trait为原型，根据扩展信息扩展出一个新的Trait。

  @bold{新 trait 中会具有被扩展 trait 上所有的方法及用户新声明的扩展方法和属性。}
}
*/
//注：extend 的实现不能复用 compose 是因为 extend 不会有名字冲突。扩展函数优先于 trait 已有函数。
  traitPrototype.extend = function (extMethods, properties)
  {
    checkTraitProperties([this], properties);
    properties = convertTraitProperties(properties);

    var methods = addProperties({}, this._methods);
    var lMethods = {};

    var nt = createObject(traitPrototype,
                          {
                            _methods : methods,
                            _lMethods : lMethods,
                            _properties : properties
                          });

    nt._usedTraits = this._usedTraits.concat([this]);
    nt._directUsedTraits = [this];
    initTraitDefaultNameMap(nt);
    var tmpNamesMap = genPropertiesNamesMap(nt, properties);
    nt._namesMap = mergeNamesMaps([this._namesMap, tmpNamesMap]);

    for(var mname in extMethods)
    {
      var f = extMethods[mname];
      assert(typeof f === "function", "expect function");

      if(isLocalMethod(mname))
      {
        lMethods[mname] = {_ownerTrait: nt,_func: f};
      }
      else
      {
        methods[mname] = {_ownerTrait: nt, _func: f};
      }
    }

    return nt;
  };

/**
@method[hasMethod]{
  @trait[Trait]
  @param[methodName string]{
    方法名。
  }
  @return[boolean]{true：存在；false：不存在。}
  询问Trait上是否存在名为 methodName 的方法。  
}
*/
  traitPrototype.hasMethod = function (methodName)
  {
    return !!this._methods[methodName];
  };

/**
@method[grant]{
  @trait[Trait]
  @param[propName string]{
    属性名。
  }
  @return[@type[GrantProperty]]{}
  得到trait中的propName的属性访问授权，一般被用于trait的扩展属性值。 
  @jscode{
    例如:
    //假如 OldTrait 有 a、b两个私有属性
    var NewTrait = OldTrait.extend(
      {
        foo:function(){}
      },
      [
        ["x", OldTrait.grant("a")], 
        ["b", OldTrait.grant("b")], 
      ]
    );
    //NewTrait 中有 x、y两个私有属性；
    //x 授权访问 OldTrait 中的 a 属性；b 授权访问 OldTrait 中的 b属性。
    //即 NewTrait 中的 x 属性 和 OldTrait 中的 a 属性是同一属性。
    //NewTrait 中的 b 属性 和 OldTrait 中的 b 属性是同一属性。
  } 
}
*/
  traitPrototype.grant = function(propName)
  {
    return new GrantProperty(this, propName);
  };
/**
@method[grantAll]{
  @trait[Trait]
  @return[array]{
    @jscode{
      [['a', trait.grant('a')], ['b', traing.grant('b')]]
    }
  }
  以相同名字授权访问 trait 中所有的属性,该返回值可以作为扩展属性列表使用。
  @jscode{
    例如:
    //假如 OldTrait 有 a、b两个私有属性
    var NewTrait = OldTrait.extend(
      {
        foo:function(){}
      },
      //此处相当于 [["a", OldTrait.grant("a")], ["b", OldTrait.grant("b")]]
      OldTrait.grantAll()
    );
    //NewTrait 以同名的方式得到了 OldTrait 中所有属性的访问授权。
    //即 NewTrait 中也有了 a、b 属性，并且跟 OldTrait 中的 a、b属性是同一属性。
  }
}
*/
  traitPrototype.grantAll = function()
  {
    var grantProps = [];
    var self = this;

    objectKeysForEach(this._properties, function(name){
      grantProps.push([name, new GrantProperty(self, name)]);
    });

    return grantProps;
  };

/**
@method[grantMany]{
  @trait[Trait]
  @param[propNames array]{
    属性名列表。
  }
  @return[array]{
    @jscode{
      [['a', trait.grant('a')], ['b', traing.grant('b')]]
    }
  }
  以相同名字授权访问 trait 中 namesAry 中的属性,该返回值可以作为扩展属性列表使用。
  @jscode{
    例如:
    //假如 OldTrait 有 a、b、c三个私有属性
    var NewTrait = OldTrait.extend(
      {
        foo:function(){}
      },
      //此处相当于 [["a", OldTrait.grant("a")], ["b", OldTrait.grant("b")]]
      OldTrait.grantMany(["a", "b"])
    );
    //NewTrait 以同名的方式得到了 OldTrait 中a、b属性的访问授权。
    //即 NewTrait 中也有了 a、b 属性，并且跟 OldTrait 中的 a、b属性是同一属性。
  }
}
*/
  traitPrototype.grantMany = function(propNames)
  {
    var grantProps = [];
    var self = this;

    arrayForEach(propNames, function(name){
      grantProps.push([name, new GrantProperty(self, name)]);
    });

    return grantProps;
  };

/**
@method[grantExclude]{
  @trait[Trait]
  @param[propNames array]{
    属性名列表。
  }
  @return[array]{
    @jscode{
      [['a', trait.grant('a')], ['b', traing.grant('b')]]
    }
  }
  以相同名字授权访问 trait 中除去 propNames 以外的属性,该返回值可以作为扩展属性列表使用。
  @jscode{
    例如:
    //假如 OldTrait 有 a、b、c三个私有属性
    var NewTrait = OldTrait.extend(
      {
        foo:function(){}
      },
      //此处相当于 [["a", OldTrait.grant("a")], ["b", OldTrait.grant("b")]]
      OldTrait.grantExlude(["c"])
    );
    //NewTrait 以同名的方式得到了 OldTrait 中a、b属性的访问授权。
    //即 NewTrait 中也有了 a、b 属性，并且跟 OldTrait 中的 a、b属性是同一属性。
  }
}
*/
  traitPrototype.grantExclude = function(propNames)
  {
    var grantProps = [];
    var self = this;

    objectKeysForEach(this._properties, function(name){
      if(!arraySome(propNames, function(exname){
        if(exname == name)
          return true;
        return false;
      }))
      {
        grantProps.push([name, new GrantProperty(self, name)]);
      }
    });

    return grantProps;
  };
/**
@method[neg]{
  @trait[Trait]
  @return[@type[Trait]]{新tarit。}
  将 trait 中所有函数遮蔽，形成一个新的trait返回。
}
*/
  traitPrototype.neg = function ()
  {
    if (this._negtive)
    {
      return _negtive;
    }

    var methods = {};
    var lMethods = {};
    var usedTraits = this._usedTraits.concat([this]);
    var nt = createObject(traitPrototype, 
                          {
                            _methods: methods,
                            _lMethods : lMethods,
                            _usedTraits: usedTraits,
                            _directUsedTraits : [this],
                            _properties:{},
                            _defaultNameMap : {},
                            _namesMap:{}
                          });

    var mtbl = this._methods;
    for (var mname in mtbl)
    {
      methods[mname] = Trait.forbidden;
    }
    mtbl = trati._lMethods;
    for (var mname in mtbl)
    {
      lMethods[mname] = Trait.forbidden;
    }

    nt._negtive = this;

    return nt;
  };

/**
@method[rename]{
  @trait[Trait]
  @param[nameMap object]{
    需要更名的函数名字映射表。需要更名的函数不能是 local 函数。
    @jscode{
      例如：{oldMethodName : newMethodName ...}
    }
  }
  @return[@type[Trait]]{新trait。}
  为 trait 中某些函数更名后，返回一个新trait。旧名字的方法将不存在。
}
*/
  traitPrototype.rename = function (nameMap)
  {
    var methods = {};
    var usedTraits = this._usedTraits.concat([this]);
    
    var nt = createObject(traitPrototype, {
      _methods: methods,
      _lMethods : this._lMethods,
      _usedTraits: usedTraits,
      _directUsedTraits : [this],
      _properties:{},
      _defaultNameMap:{},
      _namesMap : {}
    });

    var mtbl = this._methods;
    for (var mname in mtbl)
    {
      var theName = nameMap[mname];
      theName = theName ? theName : mname;

      if (methods[theName] !== undefined 
          && methods[theName] !== mtbl[mname]
          && methods[theName]._ownerTrait !== mtbl[mname]._ownerTrait
          //&& Object.isPropertyEnumerable(methods, theName) == true
          )
      {
        assert(false, "`" + theName + "' name conflicts!!!");
      }
      else
      {
        methods[theName] = mtbl[mname];
      }
    }

    return nt;
  };
/**
@method[exclude]{
  @trait[Trait]
  @param[nameList array]{
    需要剔除的方法名列表。例如[methodName1, methodName2...]
  }
  @return[@type[Trait]]{新trait。}
  剔除掉trait中的由nameList指定的那些方法后，返回一个新的trait。
}
*/
  traitPrototype.exclude = function (nameList)
  {
    var methods = {};
    var usedTraits = this._usedTraits.concat([this]);

    var nt = createObject(traitPrototype, {
      _methods: methods,
      _lMethods : this._lMethods,
      _usedTraits: usedTraits,
      _directUsedTraits : [this],
      _properties:{},
      _defaultNameMap:{},
      _namesMap : {}
    });

    var mtbl = this._methods;
    for (var mname in mtbl)
    {
      methods[mname] = mtbl[mname];
    }

    for (var i = 0; i < nameList.length; ++i)
    {
      delete methods[nameList[i]];
    }

    return nt;
  };

/**
@method[select]{
  @trait[Trait]
  @param[nameList array]{
    选择的方法名列表。例如[methodName1, methodName2...]
  }
  @return[@type[Trait]]{新trait。}
  选择trait中的由nameList指定的那些方法，组成一个新的trait返回。
}
*/
  traitPrototype.select = function (nameList)
  {
    var methods = {};
    var usedTraits = this._usedTraits.concat([this]);

    var nt = createObject(traitPrototype, {
      _methods: methods,
      _lMethods : this._lMethods,
      _usedTraits: usedTraits,
      _directUsedTraits : [this],
      _properties:{},
      _defaultNameMap:{},
      _namesMap : {}
    });

    var mtbl = this._methods;
    
    for (var i = 0; i < nameList.length; ++i)
    {
      var m = mtbl[nameList[i]];
      if(null != m)
      { 
        methods[nameList[i]] = m;
      }
    }

    return nt;
  };

/**
@method[alias]{
  @trait[Trait]
  @param[nameList array]{
    需要取别名的函数名字映射表。
    @jscode{
      例如：{oldMethodName : newMethodName ...}
    }
  }
  @return[@type[Trait]]{新trait。}
  为trait中的某些方法取个别名后，返回一个新trait。原有名字的方法仍然存在。
}
*/
  traitPrototype.alias = function (nameMap)
  {
    var methods = {};
    var usedTraits = this._usedTraits.concat([this]);

    var nt = createObject(traitPrototype, {
      _methods: methods,
      _lMethods : this._lMethods,
      _usedTraits: usedTraits,
      _directUsedTraits : [this],
      _properties:{},
      _defaultNameMap:{},
      _namesMap :{}
    });

    var mtbl = this._methods;
    for (var mname in mtbl)
    {
      methods[mname] = mtbl[mname];
    }
    
    for (var theName in nameMap)
    {
      var newName = nameMap[theName];
      if (methods[newName] !== undefined 
          && methods[newName] !== mtbl[theName]
          && methods[newName]._ownerTrait !== mtbl[theName]._ownerTrait
          //&& Object.isPropertyEnumerable(methods, theName) == true
          )
      {
        assert(false, "`" + newName + "' name conflicts!!!");
      }
      else
      {
        methods[newName] = mtbl[theName];
      }
    }

    return nt;
  };
/**
@method[prefix]{
  @trait[Trait]
  @param[prefixStr String]{
    前缀字符串。
  }
  @return[@type[Trait]]{新trait。}
  为trait中的所有方法名都增加一个由prefixStr前缀后，返回一个新的trait。
}
*/
  traitPrototype.prefix = function (prefixStr)
  {
    var methods = {};
    var usedTraits = this._usedTraits.concat([this]);

    var nt = createObject(traitPrototype, {
      _methods: methods,
      _lMethods : this._lMethods,
      _usedTraits: usedTraits,
      _directUsedTraits : [this],
      _properties:{},
      _defaultNameMap:{},
      _namesMap : {}
    });

    var mtbl = this._methods;
    for (var mname in mtbl)
    {
      methods[prefixStr + mname] = mtbl[mname];
    }

    return nt;
  };

  return Trait;
})();

/**
@function[compose]{
  @param[traits array]{
    被组合的 trait 列表。
  }
  @param[extMethods object]{
    扩展方法集合。

    @jscode{
      例如：
      {
        move : function(){}, //公有方法
        __jump : function(){}//local 方法
      }
    }

    @bold{local方法:}扩展方法集合中，以"__"双下划线开头的方法为 local 方法，只能够在所属 
    Trait 内部或者直接使用该 Trait 的Klass 或 Trait使用。
  }
  @param[properties array]{
    扩展属性集合。

    @jscode{
      //例如：
      ["position", ["speed", composedTrait.grant("speed")]]
      //trait上声明的属性全部为 trait 私有属性，外部不可以直接访问。
      //若外部想要访问 trait 私有属性，则必须通过授权的方式访问。
      //此处授权只能针对直接使用的 traits。
    }
  }
  @return[@type[Trait]]{新trait。}
  将多个 traits 组合成一个新的 trait，同时给新 trait 加入用户扩展的方法和属性。

  @bold{新的 trait 中会拥有被组合 traits 中所有的方法及用户新扩展的方法和属性。}
}
*/
function compose(traits, extMethods, properties)
{
  checkTraitProperties(traits, properties);
  properties = convertTraitProperties(properties);

  var methods = {};
  var usedTraits = [];
  var namesMaps = [];
  var lMethods = {};
  
  var nt = createObject(traitPrototype, {
    _methods : methods,
    _lMethods : lMethods,
    _directUsedTraits : traits,
    _properties : properties
  });

  for (var i = 0; i < traits.length; ++i)
  {
    var usedTrait = traits[i];
    var mtbl = usedTrait._methods;
    objectKeysForEach(mtbl, function(mname){
      if (methods[mname] !== undefined 
            && methods[mname] !== mtbl[mname]
           // && methods[mname]._ownerTrait === mtbl[mname]._ownerTrait
          //下面这句是干啥的？大家已经忘记了。谁想起来，谁加上注释
          //&& Object.isPropertyEnumerable(methods, mname) == true
          )
      {
        assert(false, "`" + mname + "' method conflicts!!!");
      }
      else
      {
        methods[mname] = mtbl[mname];
      }
    });

    usedTraits = usedTraits.concat(usedTrait._usedTraits);
    usedTraits.push(usedTrait);
    namesMaps.push(traits[i]._namesMap);
  }
  nt._usedTraits = usedTraits;
  initTraitDefaultNameMap(nt);
  var tmpNamesMap = genPropertiesNamesMap(nt, properties);
  namesMaps.push(tmpNamesMap);
  nt._namesMap = mergeNamesMaps(namesMaps);

  objectKeysForEach(extMethods, function(mname){
    var f = extMethods[mname];
    assert(typeof f === "function", "expect function");

    if(isLocalMethod(mname))
    {
      lMethods[mname] = {_ownerTrait: nt,_func: f};
    }
    else
    {
      methods[mname] = {_ownerTrait: nt,_func: f};
    }
  });

  return nt;
}

//如果 entity 中的属性是授权属性，那么需要将对应属性授权访问 entity._aggregateTrait 上的属性。
//因为 entity 内部实际上也是一个 trait，entity 上的所有属性都是 entity._aggregateTrait 上的私有属性。
function grantEntityProperties(entity)
{
  var properties = {};
  //var superGrantProperties = entity.proto()._grantProperties;
  var aggTrait = entity._aggregateTrait;
  var aggTraitProperties = aggTrait._properties;

  for(var name in aggTraitProperties)
  {
    if(!aggTraitProperties.hasOwnProperty(name))
      continue;
    var value = aggTraitProperties[name];
    var newVal;
    if(value && value.isGrant)
    {
      newVal = composeGrantProperties([value, aggTrait.grant(name)]);
    }
    else
    {
      newVal = aggTrait.grant(name);
    }

    //自动将当前entity上的属性与super上同名的属性做合并。
    // if(superGrantProperties[name] == null)
    //   properties[name] = newVal;
    // else
    // {
    //   assert(superGrantProperties[name].isGrant, "grantEntityProperties bad properties");

    //   properties[name] = composeGrantProperties([superGrantProperties[name], newVal]);
    // }
  }

  return properties;
}

//将原型上的属性平坦到当前对象上，目的是为了给原型上的属性重新生成 getter、setter；因为扩展对象有可能改变属性的 globalName，而 getter、setter 是会闭包住 globalName的，所以需要重新生成。
function  flatEntityProperties(entity)
{
  var properties = {};
  var superEntity = entity.proto();

  if(superEntity != null && superEntity.isEntity)
  {
    addProperties(properties, superEntity._properties);
  }

  var aggTrait = entity._aggregateTrait;
  var aggTraitProperties = aggTrait._properties;
  for(var key in aggTraitProperties)
  {
    if(aggTraitProperties.hasOwnProperty(key))
      properties[key] = entity;
  }

  return properties;
}
/*
性能测试发现，参数个数越多，函数调用越耗时。
并且当函数声明的参数个数为N时，如果调用函数时传入的参数个数不是N，函数调用耗时会成倍增加。
因此 wrap 用户函数时，根据函数的参数个数生成对应的 wrap 函数;函数参数最多为 8 个。
*/
function wrapEntityFunction0p(fun, ownerTraitId)
{
  return function()
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction1p(fun, ownerTraitId)
{
  return function(a)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction2p(fun, ownerTraitId)
{
  return function(a, b)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction3p(fun, ownerTraitId)
{
  return function(a, b, c)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b, c);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction4p(fun, ownerTraitId)
{
  return function(a, b, c, d)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b, c, d);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction5p(fun, ownerTraitId)
{
  return function(a, b, c, d, e)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b, c, d, e);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction6p(fun, ownerTraitId)
{
  return function(a, b, c, d, e, f)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b, c, d, e, f);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction7p(fun, ownerTraitId)
{
  return function(a, b, c, d, e, f, g)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b, c, d, e, f, g);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

function wrapEntityFunction8p(fun, ownerTraitId)
{
  return function(a, b, c, d, e, f, g, h)
  {
    var oldT = this._t;
    if(oldT)
      var oldTo = oldT._o;
    this._t = this._ts[ownerTraitId];
    var newToldO = this._t._o;
    this._t._o =  this;
    var ret = fun.call(this, a, b, c, d, e, f, g, h);
    this._t._o = newToldO;
    this._t = oldT;
    if(oldT)
      oldT._o = oldTo;
    return ret;
  }
}

var wrapEntityFunctionGenerators = [wrapEntityFunction0p, wrapEntityFunction1p,wrapEntityFunction2p,wrapEntityFunction3p,wrapEntityFunction4p, wrapEntityFunction5p, wrapEntityFunction6p, wrapEntityFunction7p, wrapEntityFunction8p];


function wrap_tLocalFunction0p(fun, ownerTraitId, o)
{
  return function()
  {
    return fun.call(this._o);
  }
}

function wrap_tLocalFunction1p(fun, ownerTraitId, o)
{
  return function(a)
  {
    return fun.call(this._o, a);
  }
}

function wrap_tLocalFunction2p(fun, ownerTraitId, o)
{
  return function(a, b)
  {
    return fun.call(this._o, a, b);
  }
}

function wrap_tLocalFunction3p(fun, ownerTraitId, o)
{
  return function(a, b, c)
  {
    return fun.call(this._o, a, b, c);
  }
}

function wrap_tLocalFunction4p(fun, ownerTraitId, o)
{
  return function(a, b, c, d)
  {
    return fun.call(this._o, a, b, c, d);
  }
}

function wrap_tLocalFunction5p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e)
  {
    return fun.call(this._o, a, b, c, d, e);
  }
}

function wrap_tLocalFunction6p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e, f)
  {
    return fun.call(this._o, a, b, c, d, e, f);
  }
}

function wrap_tLocalFunction7p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e, f, g)
  {
    return fun.call(this._o, a, b, c, d, e, f, g);
  }
}

function wrap_tLocalFunction8p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e, f, g, h)
  {
    return fun.call(this._o, a, b, c, d, e, f, g, h);
  }
}

var wrap_tLocalFunctionGenerators = [wrap_tLocalFunction0p, wrap_tLocalFunction1p, wrap_tLocalFunction2p, wrap_tLocalFunction3p, wrap_tLocalFunction4p, wrap_tLocalFunction5p, wrap_tLocalFunction6p, wrap_tLocalFunction7p, wrap_tLocalFunction8p];

function generateTrait_t(o, trait, curUsedTraits, superTs)
{
  var globalNameMap = o._globalNameMap;
  //// 必须记住 _o, _t上的函数 accessors 依赖于 o 这个对象实例。
  // 必须记住 _ownerEntity,是为了正确实现 execProto
  //var _t = {_o:o, _ownerTrait:trait};
  var _t = {_ownerTrait:trait};
  if(curUsedTraits[identifier(trait)] == null)
  {
    _t._ownerEntity = superTs[identifier(trait)]._ownerEntity;
  }
  else
  {
    _t._ownerEntity = o;
  }
  var defaultNameMap = trait._defaultNameMap;
  //define private properties getter and setter;
  objectKeysForEach(trait._properties, function(propName){
    var setName = "set" + propName;
    var globalName = globalNameMap[defaultNameMap[propName]];
    _t[propName] = function(){
      return this._o._propertiesStore[globalName];
    };
    _t[setName] = function(val){
      this._o._propertiesStore[globalName] = val;
      return this._o;
    };
  });

  //define local function accessor;
  var lMethods = trait._lMethods;
  for(var medName in lMethods)
  {
    if(!lMethods.hasOwnProperty(medName))
      continue;
    assert(!(_t.hasOwnProperty(medName)), "local properties's getter setter conflict local function");
    _t[medName] = wrap_tLocalFunctionGenerators[lMethods[medName]._func.length](lMethods[medName]._func, identifier(trait), o);
  }

  return _t;
}

//generateEntityAll_Ts ：生成 entity 上所有使用过的 traits 及 _aggregateTrait 的 _t 对象。
//每个 trait 都拥有一个自己的 _t, _t中存储了 trait 中所有私有属性、私有方法的getter、setter。
//在 wrapFunction 内部，根据 ownerTraitId，动态设置 _t。
function generateEntityAll_Ts(o, superEntity, curUsedTraits)
{
  var _ts = {};
  var usedTraits = o._usedTraits;

  for(var id in usedTraits)
  {
    if(usedTraits.hasOwnProperty(id))
    {
      var trait = usedTraits[id];
      _ts[identifier(trait)] = generateTrait_t(o, trait, curUsedTraits, superEntity._ts);
    }
  }

/*
  var aggregateTrait = o._aggregateTrait;
  _ts[aggregateTrait.cIdentifier()] = generateTrait_t(aggregateTrait);
*/
  return _ts;
}

function wrapSubtraitLocalFunction0p(fun, ownerTraitId, o)
{
  return function()
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction1p(fun, ownerTraitId, o)
{
  return function(a)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction2p(fun, ownerTraitId, o)
{
  return function(a, b)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction3p(fun, ownerTraitId, o)
{
  return function(a, b, c)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b, c);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction4p(fun, ownerTraitId, o)
{
  return function(a, b, c, d)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b, c, d);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction5p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b, c, d, e);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction6p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e, f)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b, c, d, e, f);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}

function wrapSubtraitLocalFunction7p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e, f, g)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b, c, d, e, f, g);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  }
}


function wrapSubtraitLocalFunction8p(fun, ownerTraitId, o)
{
  return function(a, b, c, d, e, f, g, h)
  {
    var o = this._o;
    var oldT = o._t;
    var old_to = o._t._o;
    o._t = o._ts[ownerTraitId];
    o._t._o = o;
    var ret = fun.call(o, a, b, c, d, e, f, g, h);
    //this._o = this.oldO;
    o._t = oldT;
    oldT._o = old_to;
    return ret;
  };
}

var wrapSubtraitLocalFunctionGenerators = [wrapSubtraitLocalFunction0p, wrapSubtraitLocalFunction1p, wrapSubtraitLocalFunction2p, wrapSubtraitLocalFunction3p, wrapSubtraitLocalFunction4p, wrapSubtraitLocalFunction5p, wrapSubtraitLocalFunction6p, wrapSubtraitLocalFunction7p, wrapSubtraitLocalFunction8p];

function generateTraitSubtrait(o, trait)
{
  //define local function accessor;
  var lMethods = trait._lMethods;
  //var subTrait = {_o:o, _ownerTrait:trait};
  var subTrait = {_ownerTrait:trait};
  for(var medName in lMethods)
  {
    if(lMethods.hasOwnProperty(medName))
      subTrait[medName] = wrapSubtraitLocalFunctionGenerators[lMethods[medName]._func.length](lMethods[medName]._func, identifier(trait), o);
  }

  return subTrait;
}

//为entity所有直接使用的traits生成对应的 traitMsg。
function generateEntityAllSubtraits(o)
{
  var subTraits = {};

  for(var i in o._usedTraits)
  {
    if(o._usedTraits.hasOwnProperty(i))
    {
      var trait = o._usedTraits[i];
      subTraits[identifier(trait)] = generateTraitSubtrait(o, trait);
    }
  }

  return subTraits;
}

//生成最终的 GlobalNamemap，全局名字映射表。
//GlobalName 只会以 superEntity 上的最大 id 递增是为了保持 propertiesStore 的原型继承。
function genEntityGlobalNamemap(o, superEntity)
{
  var namesMap = o._namesMap;
  var superGlobalNameMap = superEntity._globalNameMap;

  //序列化 serialize properties's global nameMap
  var globalNameMap = {};
  var maxGlobalNameNum = superEntity._maxGlobalNameNum;
  var globalName;


  for(var id in namesMap)
  {
    var tmpNamesMap = namesMap[id];
    for(var key in tmpNamesMap)
    {
      if(tmpNamesMap.hasOwnProperty(key))
      {
        var name = tmpNamesMap[key];

        if(superGlobalNameMap.hasOwnProperty(name))
        {
          if(globalName === undefined)
          {
            globalName = superGlobalNameMap[name];
            continue;
          }
          if(globalName != superGlobalNameMap[name])
          {
            globalName = maxGlobalNameNum++;
            break;
          }
        }
        else
        {
          globalName = maxGlobalNameNum++;
          break;
        }
      }
    }
    for(var key in tmpNamesMap)
    {
      if(tmpNamesMap.hasOwnProperty(key))
      {
        globalNameMap[tmpNamesMap[key]] = globalName;
      }
    }
    globalName = undefined;
  }
  
  o._globalNameMap = globalNameMap;
  o._maxGlobalNameNum = maxGlobalNameNum;
}

var PrivateGetterStr = "Error: get private property: ";
var PrivateSetterStr = "Error: set private property: ";
var ReadonlySetterStr = "Error: set readonly property: ";
var CustomSetterStr = "Error: did't give a setter function then you set custom_setter property: ";

//为对象属性定义公有的 getter、setter。其中包括 superEntity 上的属性。
//原因是扩展对象有可能改变属性的 globalName，而 getter、setter 会闭包住对应的 globalName，所以全部重新生成。
function defineEntityPropertyGetterSetter(o, superEntity)
{
  var globalNameMap = o._globalNameMap;
  var properties = o._properties;
  var ownerEntity, defaultMappedName, specialProperties;

  objectKeysForEach(properties, function(name){
    ownerEntity = properties[name];
    specialProperties = ownerEntity._specialProperties;
    defaultMappedName = ownerEntity._aggregateTrait._defaultNameMap[name];
    var globalName = globalNameMap[defaultMappedName];
    
    //entity 上的属性 getter、setter 可以直接复用对应的 _aggregateTrait _t 上的属性的 getter、setter。
    //好处是因为当发生hook时，只会替换所有 _ts 受影响的 getter、setter。不必再去替换 entity上公有属性访问的 getter、setter。
    //代价是会多付出访问时间，用 _t 上的getter、setter需要多几次属性查找。
    //经测试，最终不使用 _t 上的 getter、setter。因为性能代价太大，是直接访问的 10 倍以上。

    var type;
    var setName = "set" + name;
    if(specialProperties.hasOwnProperty(name))
    {
      type = specialProperties[name];
      if(type == PRIVATE)
      {
        //若属性定义为 PRIVATE 属性，且用户没有重写 getter、setter 函数则为用户生成一个抛出异常的 getter、setter 函数。
        if(!o[name])
        {
          o[name] = function()
          {
            throw (PrivateGetterStr + name);
          };
        }

        if(!o[setName])
        {
          o[setName] = function()
          {
            throw (PrivateSetterStr + name);
          }
        }
      }
      else if(type == READONLY)
      {
        assert(!o.hasOwnProperty(name), "READONLY property: " + name + " getter conflict with methods");
        o[name] = function()
        {
          //return this._ts[aggTraitId][name]();
          return this._propertiesStore[globalName];
        };
        //若属性定义为 READONLY 属性,用户没有重写 setter 函数则为用户生成一个抛出异常的 setter 函数。
        if(!!o[setName])
        {
          o[setName] = function()
          {
            throw (ReadonlySetterStr + name);
          }
        }
      }
      else if(type == CUSTOM_SETTER)
      {
        assert(!o.hasOwnProperty(name), "CUSTOM_SETTER property: " + name + " getter conflict with methods");
        o[name] = function()
        {
          //return this._ts[aggTraitId][name]();
          return this._propertiesStore[globalName];
        };
        //若属性定义为 CUSTOM_SETTER 属性，但用户却没有实现其 setter，则为用户生成一个抛出异常的 setter 函数。
        if(!o[setName])
        {
          o[setName] = function()
          {
            throw (CustomSetterStr + name);
          }
        }
      }
      else
      {

      }
    }
    else
    {
      assert(!o.hasOwnProperty(name), "public property: " + name + " getter conflict with methods");
      assert(!o.hasOwnProperty(setName), "public property: " + name + " setter conflict with methods");
      o[name] = function()
      {
        //return this._ts[aggTraitId][name]();
        return this._propertiesStore[globalName];
      };
      o[setName] = function(val)
      {
        //return this._ts[aggTraitId][setName](val);
        this._propertiesStore[globalName] = val;
        return this;
      }
    }
  });
}

//将 entity 所有使用过的 traits 去重且合并。
function compressEntityUsedTraits(superEntityUsedTraits, aggregateTrait, curUsedTraits)
{
  var usedTraits = {};

  for(var key in superEntityUsedTraits)
  {
    if(superEntityUsedTraits.hasOwnProperty(key))
      usedTraits[key] = superEntityUsedTraits[key];
  }

  var aggUsedTraits = aggregateTrait._usedTraits;
  for(var i = 0; i < aggUsedTraits.length; ++i)
  {
    var trait = aggUsedTraits[i];
    usedTraits[identifier(trait)] = trait;
    curUsedTraits[identifier(trait)] = trait;
  }

  usedTraits[identifier(aggregateTrait)] = aggregateTrait;
  curUsedTraits[identifier(aggregateTrait)] = aggregateTrait;

  return usedTraits;
}

//分离各类属性。
function separateProperties(properties)
{
  var allPropsAry = [];
  //特殊类型属性用 map 形式存储是为了查找方便。
  var specialProperties = {}
  var i = 0;

  for(var name in properties)
  {
    if(properties.hasOwnProperty(name))
    {
      var prop = properties[name];
      if(typeof(prop) === "string")
      {
        allPropsAry[i++] = prop;
      }
      else if(prop instanceof Array)
      {
        if(typeof(prop[0]) === "string")
        {
          allPropsAry[i++] = prop;
        }
        else if(prop[0].type)
        {
          allPropsAry[i++] = [prop[0].name, prop[1]];
          specialProperties[prop[0].name] = prop[0].type;
        }
        else
        {
          assert(false, "bad property" + prop);
        }
      }
      else
      {
        if(prop.type)
        {
          allPropsAry[i++] = prop.name;
          specialProperties[prop.name] = prop.type;
        }
        else
        {
          assert(false, "bad property" + prop);
        }
      }
    }
  }

  return {
    allPropsAry : allPropsAry,
    specialProperties : specialProperties
  };
}

/*
为对象 o 应用上扩展方法、属性及所使用的traits。
*/
function useTraits(o, extMethods, properties, traits)
{
  var superEntity = o.proto();

  if(traits == null && extMethods == null && properties == null)
  {
    //保持属性原型链结构；获取属性时，在用户没有修改属性的情况下，取得的是原型上的属性值。
    o._propertiesStore = createObject(superEntity._propertiesStore);
    return;
  }

  if(traits == null)
    traits = [];
  if(extMethods == null)
    extMethods = {};
  if(properties == null)
    properties = [];

  //保持属性原型链结构；获取属性时，在用户没有修改属性的情况下，取得的是原型上的属性值。
  //即使新对象中存在新的属性合并等操作，也不会影响到该原型链语义；原则上只要保证新对象上有属性合并的属性最终的 globalName 是唯一的(跟原型上的 globalName不一样)。
  o._propertiesStore = createObject(superEntity._propertiesStore);

  var sepProps = separateProperties(properties);
  o._specialProperties = sepProps.specialProperties;
  var aggregateTrait = compose(traits, extMethods, sepProps.allPropsAry);
  var traitMethods = aggregateTrait._methods;
  for (var mname in traitMethods)
  {
    if(!traitMethods.hasOwnProperty(mname))
      continue;
    var md = traitMethods[mname];
    var wrapFun = wrapEntityFunctionGenerators[md._func.length](md._func, identifier(md._ownerTrait));
    //wrapEntityFunction(md._func, md._ownerTrait.cIdentifier());
    wrapFun._ownerEntity = o;

    //methods can be call by this.methodName();
    o[mname] = wrapFun;
  }
 
  o._aggregateTrait = aggregateTrait;

  var curUsedTraits = {};
  o._usedTraits = compressEntityUsedTraits(superEntity._usedTraits, aggregateTrait, curUsedTraits);

  var grantProperties = grantEntityProperties(o);
  //o._grantProperties = grantProperties;
  var tmpNamesMap = genPropertiesNamesMap(aggregateTrait, grantProperties);
  o._properties = flatEntityProperties(o);
  o._namesMap = mergeNamesMaps([superEntity._namesMap, aggregateTrait._namesMap, tmpNamesMap]);
  
  genEntityGlobalNamemap(o, superEntity);
  //generate entity's traits all _ts.
  o._ts = generateEntityAll_Ts(o, superEntity, curUsedTraits);
  //generate entity's traits all _subTraits.
  o._subTraits = generateEntityAllSubtraits(o, traits);
  defineEntityPropertyGetterSetter(o, superEntity);

  return o;
}

//准备好遍历 globalName 所对应所有的 trait 属性的信息，存放于 _globalNameLocalpropInfo 上。
function updateGlobalNameLocalpropsInfo(obj, globalName)
{
  //obj 有可能层次很深，在遥远的 proto 上 _globalNameLocalpropInfo 有可能已经被别的类型初始化好了。
  //因此需要判断里 obj 最近的 proto 上是否存在 _globalNameLocalpropInfo。
  if(obj._globalNameLocalpropInfo == null || !obj.__proto__.hasOwnProperty("_globalNameLocalpropInfo"))
  {
    //defaultMappedNameInfo 存放该 obj 上所有使用过 trait 中的属性信息。
    //key 是属性的默认映射名，value是属性所在的 traitId及真实属性名。
    var defaultMappedNameInfo = {};
    objectKeysForEach(obj._usedTraits, function(key){
      var trait = obj._usedTraits[key];
      objectKeysForEach(trait._properties, function(propName){
        defaultMappedNameInfo[trait._defaultNameMap[propName]] = {traitId:key, propName:propName};
      });
    });
/*
    var aggTrait = obj._aggregateTrait;
    objectKeysForEach(aggTrait._properties, function(propName){
      defaultMappedNameInfo[aggTrait._defaultNameMap[propName]] = {traitId:aggTrait.cIdentifier(), propName:propName};
    });
*/
    var globalNameMap = obj._globalNameMap;
    var namesMap = obj._namesMap;
    //globalNameLocalpropInfo 中存放了每个 globalName 所对应的所有 trait 属性信息。
    //key 是 globalName，value是个数组，数组中存放了多个 defaultMappedNameInfo 项。
    var globalNameLocalpropInfo = {};

    objectKeysForEach(namesMap, function(key){
      //names 中存放了多个属性默认映射名，代表这些属性是同一属性。
      var names = namesMap[key];
      var reversedInfo;
      var globalName;
      objectKeysForEach(names, function(defaultMappedName){
        if(reversedInfo == null)
        {
          //初始化好 globalName 所对应的所有 trait 属性信息。
          globalName = globalNameMap[defaultMappedName];
          reversedInfo = [];
          globalNameLocalpropInfo[globalName] = reversedInfo;
        }
        reversedInfo.push(defaultMappedNameInfo[defaultMappedName]);
      });
    });

    //同类型的 object 的 setter 替换信息是一样的，因此信息放在对象的 __proto__ 上，以便复用。
    obj.__proto__._globalNameLocalpropInfo = globalNameLocalpropInfo;
  }
}

//记录globalName所对应所有 trait 属性的 hook 信息。以便替换setter以及unhook。
function updateGlobalNameHookInfos(obj, cbTime, cb, defaultMappedName, globalName)
{
  if(obj._hookInfos == null)
  {
    obj._hookInfos = {a:{}, b:{}};
  }
  var timeHookInfos = obj._hookInfos[cbTime];
  var hookInfo = timeHookInfos[globalName];
  //为了 setter 函数效率，如果某个globalName 对应的  hookinfo 只有一项，则直接存储；如果有多项，则用数组存储。
  if(hookInfo == null)
  {
    hookInfo = {defaultMappedName:defaultMappedName, cb:cb};
    timeHookInfos[globalName] = hookInfo;
  }
  else
  {
    if(hookInfo instanceof Array)
    {
      if(!arraySome(hookInfo, function(infoItem)
        {
          if(infoItem.defaultMappedName === defaultMappedName && infoItem.cb === cb)
          {
            infoItem.cb = cb;
            return true;
          }
          return false;
        }))
      {
        //如果原有的 hookinfoArray 不存在新加入的trait属性的hook，那么将新的信息push到数组末尾。
        hookInfo.push({defaultMappedName:defaultMappedName, cb:cb});
      };
    }
    else
    {
      if(hookInfo.defaultMappedName === defaultMappedName && hookInfo.cb === cb)
      {
        hookInfo.cb = cb;
      }
      else
      {
        timeHookInfos[globalName] = [hookInfo, 
          {defaultMappedName:defaultMappedName, cb:cb}];
      }
    }
  }

  return hookInfo;
}

//根据 globalName 的 hookInfo 信息，生成对应的 setter 函数。hookInfo 有可能没有、直接一个hookInfo值，或存储了多个 hookInfo 值的数组；因此生成 setter 函数时要区别对待。
function generateSetterFun(obj, globalName)
{
  var tSetterFun, eSetterFun;
  var beforeHookInfo = obj._hookInfos.b[globalName];
  var afterHookInfo = obj._hookInfos.a[globalName];
  var beforeIsArray = beforeHookInfo instanceof Array;
  var afterIsArray = afterHookInfo instanceof Array;

  if(!beforeIsArray && !afterIsArray)
  {
    if(beforeHookInfo == undefined && afterHookInfo != undefined)
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        this._o._propertiesStore[globalName] = val;
        afterHookInfo.cb(obj, oldVal, val);
        return val;
      };

      eSetterFun = function(val)
      {
        var oldVal = this._propertiesStore[globalName];
        this._propertiesStore[globalName] = val;
        afterHookInfo.cb(obj, oldVal, val);
        return val;
      };
    }
    else if(beforeHookInfo != undefined && afterHookInfo == undefined)
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        if(!beforeHookInfo.cb(obj, oldVal, val))
        {
          this._o._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        return val;
      };

      eSetterFun = function(val)
      {
        var oldVal = this._propertiesStore[globalName];
        if(!beforeHookInfo.cb(obj, oldVal, val))
        {
          this._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        return val;
      };
    }
    else if(beforeHookInfo != undefined && afterHookInfo != undefined)
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        if(!beforeHookInfo.cb(obj, oldVal, val))
        {
          this._o._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        afterHookInfo.cb(obj, oldVal, val);
        return val;
      };
      eSetterFun = function(val){
        var oldVal = this._propertiesStore[globalName];
        if(!beforeHookInfo.cb(obj, oldVal, val))
        {
          this._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        afterHookInfo.cb(obj, oldVal, val);
        return val;
      };
    }
    else
    {
      //beforeHookInfo is undefined && afterHookInfo is undefined
      //tSetterFun can use the _t proto's setter fun;
      //tSetterFun = undefined;
      
      tSetterFun = function(val){
        return this._o._propertiesStore[globalName] = val;
      };
      eSetterFun = function(val){
        return this._propertiesStore[globalName] = val;
      };
    }
  }
  else if(!beforeIsArray && afterIsArray)
  {
    if(beforeHookInfo == undefined)
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        this._o._propertiesStore[globalName] = val;
        arrayForEach(afterHookInfo, function(info){
          info.cb(obj, oldVal, val);
        });
        return val;
      };
      eSetterFun = function(val){
        var oldVal = this._propertiesStore[globalName];
        this._propertiesStore[globalName] = val;
        arrayForEach(afterHookInfo, function(info){
          info.cb(obj, oldVal, val);
        });
        return val;
      };
    }
    else
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        if(!beforeHookInfo(obj, oldVal, val))
        {
          this._o._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        arrayForEach(afterHookInfo, function(info){
          info.cb(obj, oldVal, val);
        });
        return val;
      };

      eSetterFun = function(val){
        var oldVal = this._propertiesStore[globalName];
        if(!beforeHookInfo(obj, oldVal, val))
        {
          this._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        arrayForEach(afterHookInfo, function(info){
          info.cb(obj, oldVal, val);
        });
        return val;
      };
    }
  }
  else if(beforeIsArray && !afterIsArray)
  {
    if(afterHookInfo == undefined)
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        var bOld = false;
        arrayForEach(beforeHookInfo, function(info){
          bOld |= info.cb(obj, oldVal, val); 
        });
        if(!bOld)
        {
          this._o._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        return val;
      };

      eSetterFun = function(val){
        var oldVal = this._propertiesStore[globalName];
        var bOld = false;
        arrayForEach(beforeHookInfo, function(info){
          bOld |= info.cb(obj, oldVal, val); 
        });
        if(!bOld)
        {
          this._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        return val;
      };
    }
    else
    {
      tSetterFun = function(val){
        var oldVal = this._o._propertiesStore[globalName];
        var bOld = false;
        arrayForEach(beforeHookInfo, function(info){
          bOld |= info.cb(obj, oldVal, val); 
        });
        if(!bOld)
        {
          this._o._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        afterHookInfo.cb(obj, oldVal, val);
        return val;
      };

      eSetterFun = function(val){
        var oldVal = this._propertiesStore[globalName];
        var bOld = false;
        arrayForEach(beforeHookInfo, function(info){
          bOld |= info.cb(obj, oldVal, val); 
        });
        if(!bOld)
        {
          this._propertiesStore[globalName] = val;
        }
        else
        {
          val = oldVal;
        }
        afterHookInfo.cb(obj, oldVal, val);
        return val;
      };
    }
  }
  else
  {
    // beforeIsArray && afterIsArray
    tSetterFun = function(val){
      var oldVal = this._o._propertiesStore[globalName];
      var bOld = false;
      arrayForEach(beforeHookInfo, function(info){
        bOld |= info.cb(obj, oldVal, val); 
      });
      if(!bOld)
      {
        this._o._propertiesStore[globalName] = val;
      }
      else
      {
        val = oldVal;
      }
      arrayForEach(afterHookInfo, function(info){
        info.cb(obj, oldVal, val);
      });
      return val;
    };

    eSetterFun = function(val){
      var oldVal = this._propertiesStore[globalName];
      var bOld = false;
      arrayForEach(beforeHookInfo, function(info){
        bOld |= info.cb(obj, oldVal, val); 
      });
      if(!bOld)
      {
        this._propertiesStore[globalName] = val;
      }
      else
      {
        val = oldVal;
      }
      arrayForEach(afterHookInfo, function(info){
        info.cb(obj, oldVal, val);
      });
      return val;
    };
  }

  return {tSetter:tSetterFun, eSetter:eSetterFun};
}

//发生 hook 时，需要更新 _t 及 obj 上的 setter 函数；在属性改变时，才能够正确的通知出去。
function updateSetters(obj, globalName)
{
  var _ts = obj._ts;
  var setter = generateSetterFun(obj, globalName);
  var localProps = obj._globalNameLocalpropInfo[globalName];

  var _t;
  var propName, setterName, ownerEntity;

  //替换 globalName 影响的所有_t上的 setter
  arrayForEach(localProps, function(prop){
    propName = prop.propName;
    setterName = "set" + propName;
    ownerEntity = obj._properties[propName];
    _t = _ts[prop.traitId];
    _t[setterName] = setter.tSetter;

    //替换对象上公有属性的外部访问 api。
    //如果 prop.traitId 所代表的 trait 是 obj 上使用过的 _aggregateTrait
    //并且在该属性是公有属性，则需要替换。
    if( ownerEntity
        && ownerEntity._aggregateTrait == obj._usedTraits[prop.traitId]
        && ownerEntity._specialProperties[propName] == null
      )
    {
      obj[setterName] = setter.eSetter;
    }
    /*
    if(setterFun != undefined)
    {
      _t["set"+prop.propName] = setterFun;
    }
    else
    {
      //use _t proto's setterFun;
      delete _t["set"+prop.propName];
    }
    */
  });
}

//获取 obj 直接使用的 index 所代表的 trait 对外命名空间。
function getDirectedUsedTrait(obj, index)
{
  var ownerTrait;
  var directUsedTrait;

  assert(((typeof index) === "number"), "getDirectedUsedTrait bad index type");
  if(obj._t == null)
  {
    //在trait外部调用此方法，只能访问entity上直接使用的trait方法
    ownerTrait = obj._aggregateTrait;
  }
  else
  {
    ownerTrait = obj._t._ownerTrait;
  }

  return ownerTrait._directUsedTraits[index];
}

/**
@iclass[GrantProperty]{
  属性授权类；代表对 trait 某个私有属性的访问许可证。
}
*/
var GrantProperty = (function(){
  function GrantProperty(trait, name)
  {
    //授权的名字映射表；key 是 授权属性名 defaultNameMap，value 也是 defaultNameMap。
    //之所以用 {key:value} 形式存储是为了方便做属性合并和查找。
    this.grantNames = {};
    //授权访问的 trait 映射表；key 是 trait identifier，value 是对应的 trait。
    this.grantTraitIdentifiers = {};
    this.isGrant = true;
    if(trait != undefined)
    {
      var grantName = trait._defaultNameMap[name];
      var traitIdentifier = identifier(trait);
      this.grantNames[grantName] = grantName;
      this.grantTraitIdentifiers[traitIdentifier] = traitIdentifier;
    }

    return this;
  }

/**
@method[merge #:hidden]{
  @class[GrantProperty]
  @param[grantProp GrantProperty]{
    属性授权。
  }
  @return[this]{}
  将grantProp属性授权合并到当前属性授权上。  
}
*/
  GrantProperty.prototype.merge = function (grantProp)
  {
    //merge grantNames
    var grantNames = this.grantNames;
    var mergeNames = grantProp.grantNames;
    for(var name in mergeNames)
    {
      if(mergeNames.hasOwnProperty(name))
        grantNames[name] = name;
    }

    //merge grantTraitIdentifiers
    var grantIds = this.grantTraitIdentifiers;
    var mergeIds = grantProp.grantTraitIdentifiers;
    for(var name in mergeIds)
    {
      if(mergeIds.hasOwnProperty(name))
        grantIds[name] = name;
    }

    return this;
  };

/**
@method[compose]{
  @class[GrantProperty]
  @param[grantProps array]{
    属性授权列表。
  }
  @return[@type[GrantProperty]]{新的属性授权}
  将当前属性授权和grantProps中的所有属性授权组合为一个新的属性授权返回。  
}
*/
  GrantProperty.prototype.compose = function (grantProps)
  {
    var composeGrants = [this];

    if((grantProps instanceof Array))
      composeGrants = composeGrants.concat(grantProps);
    else
      composeGrants = composeGrants.concat(slice.call(arguments, 0));

    return composeGrantProperties(composeGrants);
  };

  return GrantProperty;
})();

/**
@function[composeGrantProperties]{
  @param[grantProps array]{
    授权属性列表。
  }
  @return[@type[GrantProperty]]{}
  将多个授权属性合并为一个新的授权返回。

  此方法可以将多个trait中的多个属性合并为同一个属性。
}
*/
function composeGrantProperties(grantProps)
{
  var newGrantProp = new GrantProperty();

  for(var i = 0; i < grantProps.length; ++i)
  {
    newGrantProp.merge(grantProps[i]);
  }
  return newGrantProp;
}

var Entity = {
  _usedTraits : [],
  _namesMap : [],
  _properties:{},
  _specialProperties:{},
  _propertiesStore:{},
  _globalNameMap:{},
  _maxGlobalNameNum:0,
/**
@method[identifier #:hidden]{
  @class[Klass]
  @return[number]{全局唯一id}
  获取本对象的全局id  
}
*/
  identifier: function(){
    return identifier(this);
  },
  //_grantProperties:{},//目的是为了将当前 entity 上的属性和 super 上的同名属性自动合并。

/**
@method[isEntity #:hidden]{
  @class[Klass]
  @return[boolean]{true：是；false：不是。}
  询问对象是否是一个原型对象。  
}
*/
  isEntity : function ()
  {
    return true;
  },
/**
@method[proto]{
  @class[Klass]
  @return[prototype]{}
  获取类的原型信息。  
}
*/
  proto : function()
  {
    return this.__proto__;
  },
/**
@method[aggregateTrait #:hidden]{
  @class[Klass]
  @return[@type[Trait]]{}
  获取类的内部trait，在实现上可以把类看成是一个 trait。  
}
*/
  aggregateTrait : function ()
  {
    return this._aggregateTrait;
  },

/**
@method[execProto]{
  @class[Klass]
  @param[methodName string]{
    父类上某方法名。
  }
  @param[arguments arguments]{
    可变参数列表；父类上 methodName 所指定方法所需要的参数。
  }
  @return[value]{父类 methodName 方法的返回值。}
  调用父类上 methodName 所代表的方法。
}
*/
  execProto: function (methodName, a, b, c, d, e, f, g, h)
  {
    var m = this._t._ownerEntity.proto()[methodName];
    return m.call(this, a, b, c, d, e, f, g, h);  
  },
/**
@method[tryExec]{
  @class[Klass]
  @param[methodName string]{
    方法名。
  }
  @param[arguments arguments]{
    可变参数列表；methodName 所指定方法所需要的参数。
  }
  @return[value]{methodName 方法的返回值。}
  安全执行 methodName 所代表的方法，若方法不存在，则不执行直接返回。
}
*/
  tryExec: function (methodName, a, b, c, d, e, f, g, h)
  {
    var m = this[methodName];
    if (m)
    {
      return m.call(this, a, b, c, d, e, f, g, h);
    }
  },
/**
@method[hasMethod]{
  @class[Klass]
  @param[methodName string]{
    方法名。
  }
  @return[boolean]{true：存在；false：不存在。}
  询问对象是否存在名为 methodName 的方法。  
}
*/
  hasMethod : function(methodName)
  {
    return !!this[methodName];
  },
/**
@method[hasProperty]{
  @class[Klass]
  @param[propName string]{
    属性名。
  }
  @return[boolean]{true：存在；false：不存在。}
  询问对象是否存在名为 propName 的属性。  
}
*/
  hasProperty : function(propName)
  {
    return this._properties.hasOwnProperty(propName);
  },

/**
@method[clone #:hidden]{
  @class[Klass]
  @param[extMethods obj]{
    扩展方法集合。
  }
  @param[properties array]{
    扩展属性集合。
  }
  @param[properties traitArray]{
    扩展所需的 traits 集合。
  }
  @return[entity]{}
  以原始对象为原型，根据扩展信息克隆出一个新的对象。
}
*/
  clone: function (extMethods, properties, traits)
  {
    var obj = createObject(this);

    useTraits(obj, extMethods, properties, traits);

    return obj;
  },
/**
@method[hook]{
  @class[Klass]
  @param[hookTraitmsg traitMsg]{
    hook的属性所属的 trait，例如 this._t 或者 this.subTraits(n)等。
  }
  @param[propName string]{
    属性名。
  }
  @param[cb function]{
    hook 函数。
    @jscode{
      //hook函数参数分别表示：hook的对象、旧属性值、新属性值
      function cb(obj, oldVal, newVal){ ... }
    }
  }
  @param[cbTime string]{
    hook 函数调用时间；可以是 "b":属性变化前， "a":属性变化后。
  }
  @return[this]{}
  用函数 cb 去 hook 住 traitMsg 上 propName 属性。

  若cbTime是 "b",则在用户设置该属性时，在属性真正修改前会调用 cb 函数。

  若cbTime是 "a",则在用户设置该属性时，在属性真正修改后会调用 cb 函数。
}
*/
  hook : function(hookTraitmsg, propName, cb, cbTime)
  {
    var hookTrait = hookTraitmsg._ownerTrait;
    if(hookTrait == null || cb == null)
      return this;

    if(cbTime == undefined)
    {
      cbTime = "a";
    }
/*
    if(propName == "dirtyStamp")
    {
      console.log(this.aaa)
      this.aaa = 2;
      debugger;
    }*/

    //受同一个 globalName 影响的 localNames
    var defaultMappedName = hookTrait._defaultNameMap[propName];
    var globalNameMap = this._globalNameMap[defaultMappedName];
    
    updateGlobalNameLocalpropsInfo(this, globalNameMap);
    updateGlobalNameHookInfos(this, cbTime, cb, defaultMappedName, globalNameMap);
    updateSetters(this, globalNameMap);

    return this;
  },
/**
@method[hookMany]{
  @class[Klass]
  @param[hookTraitmsg traitMsg]{
    hook的属性所属的 trait，例如 this._t 或者 this.subTraits(n)等。
  }
  @param[propNames array]{
    包含多个属性名的数组。
  }
  @param[cb function]{
    hook 函数。
    @jscode{
      //hook函数参数分别表示：hook的对象、旧属性值、新属性值
      function cb(obj, oldVal, newVal){ ... }
    }
  }
  @param[cbTime string]{
    hook 函数调用时间；可以是 "b":属性变化前， "a":属性变化后。
  }
  @return[this]{}
  用函数 cb 去 hook 住 propNames 中所有的属性。

  若cbTime是 "b",则在用户设置这些属性时，在属性真正修改前会调用 cb 函数。
  
  若cbTime是 "a",则在用户设置这些属性时，在属性真正修改后会调用 cb 函数。
}
*/
  hookMany : function(hookTraitmsg, propNames, cb, cbTime)
  {
    var len = propNames.length;

    for(var i = 0; i < len; ++i)
    {
      this.hook(hookTraitmsg, propNames[i], cb, cbTime);    
    }

    return this;
  },
/**
@method[unhook]{
  @class[Klass]
  @param[hookTraitmsg traitMsg]{
    unhook的属性所属的 trait，例如 this._t 或者 this.subTraits(n)等。
  }
  @param[propName string]{
    属性名。
  }
  @param[cb function]{
    unhook 的函数。    
  }
  @param[cbTime string]{
    hook 时间；可以是 "b":属性变化前， "a":属性变化后。
  }
  @return[this]{}
  取消对 traitMsg 所代表trait 上 propName 属性的 hook。
}
*/
  unhook : function(hookTraitmsg, propName, cb, cbTime)
  {
    var hookTrait = hookTraitmsg._ownerTrait;
    if(hookTrait == null)
      return this;

    if(cbTime == undefined)
    {
      cbTime = "a";
    }

    var defaultMappedName = hookTrait._defaultNameMap[propName];
    var globalName = this._globalNameMap[defaultMappedName];
    var timeHookInfos = this._hookInfos[cbTime];
    var hookInfo = timeHookInfos[globalName];

    if(hookInfo == null)
      assert(false, "unhook cb is undefined!!");
    //clear hookInfo
    if(hookInfo instanceof Array)
    {
      var bTwo = (hookInfo.length == 2);
      if(arraySome(hookInfo, function(info, i){
          if(info.defaultMappedName === defaultMappedName && info.cb === cb)
          {
            hookInfo.splice(i, 1);
            //timeHookInfos[globalName] = hookInfo.splice(i, 1);
            return true;
          }
          return false;
        }))
      {
        if(bTwo)
        {
          timeHookInfos[globalName] = timeHookInfos[globalName][0];
        }
      }
      else
      {
        assert(false, "unhook a no exist cb hook");
      }

    }
    else
    {
      if(hookInfo.defaultMappedName === defaultMappedName && hookInfo.cb === cb)
      {
        delete timeHookInfos[globalName];
        /*
        var hookGlobalNames = Object.cKeys(timeHookInfos);
        if(hookGlobalNames.length == 0)
        {
          delete this._hookInfos[cbTime];
        }
        */
      }
      else
      {
        assert(false, "unhook a no exist cb");
      }
    }

    updateSetters(this, globalName);

    return this;
  },
/**
@method[unhookMany]{
  @class[Klass]
  @param[hookTraitmsg traitMsg]{
    unhook的属性所属的 trait，例如 this._t 或者 this.subTraits(n)等。
  }
  @param[propNames array]{
    包含多个属性名的数组。
  }
  @param[cb function]{
    unhook 的函数。    
  }
  @param[cbTime string]{
    hook 时间；可以是 "b":属性变化前， "a":属性变化后。
  }
  @return[this]{}
  取消对 traitMsg 所代表trait 上 propNames 中所有属性的 hook。
}
*/
  unhookMany : function(hookTraitmsg, propNames, cb, cbTime)
  {
    var len = propNames.length;

    for(var i = 0; i < len; ++i)
    {
      this.unhook(hookTraitmsg, propNames[i], cb, cbTime);    
    }

    return this;
  },
/**
@method[subTraits]{
  @class[Klass]
  @param[index number]{
    Klass直接使用的 trait 所在的数组下标值。
  }
  @return[traitMsg]{trait 描述。}
  获取 Klass 直接使用的 name 所代表的 trait 对外命名空间。

  通过 traitMsg 可以 hook trait 的属性及可以调用 trait 上的私有方法。
}
*/
  subTraits : function(index)
  {
    var directUsedTrait = getDirectedUsedTrait(this, index);
    if(directUsedTrait != null)
    {
      var subTrait = this._subTraits[identifier(directUsedTrait)]
      //subTrait.oldO = directUsedTrait._o;
      subTrait._o = this;
      return subTrait;
    }
  }
};

/**
@iclass[Klass]{
  模块预定义的 Class。

  @itemize[#:style 'unnumbered
    @item{Klass:可被扩展出新的 Class。}
    @item{Klass:可以实例化出对象。}
    @item{Klass:可以直接使用 Trait。}
  ]

  在它的基础上可以扩展出新的Klass，并且通过Klass可以创建实例化对象。
}

@property[_t traitMsg #:attr 'PRIVATE]{
  @class[Klass]
  当前 Klass 实例化对象的私有命名空间。

  @itemize[#:style 'unnumbered
    @item{_t 只能够在 Klass 内部用 this._t 的方式获取，外部 anyObj._t 获取不到。}
    @item{通过 this._t 可以访问和修改 Klass 上所有的属性及调用 Klass 上的 local 方法。}
  ]  
}
*/
var Klass = Entity.clone({
/**
@method[extend]{
  @class[Klass]
  @param[extMethods obj]{
    派生方法集合。

    @jscode{
      例如：
      {
        move : function(){},
        __jump : function(){}
      }
    }

    @bold{local方法}派生方法集合中，以"__"双下划线开头的方法为 local 方法，只能够在 Klass 内部使用。
  }
  @param[properties array]{
    派生属性列表。
    @jscode{
      例如：
      [
        "position",//公有属性
        READONLY("speed"),//只读属性
        PRIVATE("girlFriend"), //私有属性
        ["money", Tom.grant("money").compose(Lucy.grant("money"))] //公有属性，并且将Tom 和 Lucy 的钱都占为己有。 
      ]
    }
  }
  @param[traits array]{
    派生类所使用的 trait array。
  }
  @param[extKlass array]{
    用来订制 Klass 的方法及属性。

    数组最多有三项[extMethods, properties, traits]
    @jscode{
      extMethods ： NewKlass 上的扩展方法；
      properties ： NewKlass 上的扩展属性；
      traits : NewKlass 所使用的traits；
    }
  }
  @return[Klass]{派生类}
  用 extMethods, properties, traits 对父类进行扩展，得到一个新的派生类。
}
*/
  extend:function(extMethods, properties, traits, extKlass)
  //extend:function(extMethods, properties, traits)
  {
    var newKlass;
    if(extKlass)
      newKlass = this.clone(extKlass[0], extKlass[1], extKlass[2]);
    else
      newKlass = this.clone();
    newKlass._objectProto = this._objectProto.clone(extMethods, properties, traits);

    return newKlass;
  }
});

//Klass的create函数是不定长参数，因此不能定义在clone的扩展函数集合里面，否则参数有可能被截断。
/**
@method[create]{
  @class[Klass]
  @param[arguments arguments]{
    创建对象所需的参数；即Klass 上的 initialize 函数所需的参数。
  }
  @return[object]{类实例化对象。}
  创建一个 Klass 实例化对象，默认会调用 Klass 上的 initialize 函数最为实例对象的初始化函数。
}
*/
Klass.create = function()
{
  var inst = this._objectProto.clone();

  inst.Klass = this;
  inst.initialize.apply(inst, arguments);

  return inst;
}

Klass._objectProto = Entity.clone({initialize:function(){}});


/**
@function[READONLY]{
  @param[propName String]{
    属性名。
  }
  @return[object]{}
  将 propName 属性标识为只读属性；一般用于 Klass 属性定义。
  @jscode{
    //例如:
    //MyKlass 中 money 为只读属性，外部只能访问不能修改。
    var MyKlass = Klass.extend(
      extMethods,
      [READONLY("money")]
    );
  }
}
*/
var READONLY = function(propName)
{
  return {name:propName, type:READONLY};
}

/**
@function[PRIVATE]{
  @param[propName String]{
    属性名。
  }
  @return[object]{}
  将 propName 属性标识为私有属性；一般用于 Klass 属性定义。
  @jscode{
    //例如:
    //MyKlass 中 money 为私有属性；外部不能访问和修改。
    var MyKlass = Klass.extend(
      extMethods,
      [PRIVATE("money")]
    );
  }
}
*/
var PRIVATE = function(propName)
{
  return {name:propName, type:PRIVATE};
}

/**
@function[CUSTOM_SETTER]{
  @param[propName String]{
    属性名。
  }
  @return[object]{}
  将 propName 属性标识为由用户提供设置接口的属性；一般用于 Klass 属性定义。
  @jscode{
    //例如:
    var MyKlass = Klass.extend(
      {
        setmoney : function(){...}
      },
      [PRIVATE("money")]
    );
  }
}
*/
var CUSTOM_SETTER = function(propName)
{
  return {name:propName, type:CUSTOM_SETTER};
}

export$({
  Trait: Trait,
  compose: compose,
  Entity: Entity,
  Klass: Klass,
  composeGrantProperties: composeGrantProperties,
  READONLY: READONLY,
  PRIVATE: PRIVATE,
  CUSTOM_SETTER: CUSTOM_SETTER
});


﻿
  return exportTraits;

});