if (!this.[INJECTOR_NAME]){
    this.[INJECTOR_NAME] = function() {
        var o = {},
            f = function() {return !1;}, 
            cache = {};
        var is = function(data,type){
            return o.toString.call(data)==='[object '+type+']';
        };
        return function(key,func) {
            var result = cache[key],
                isfunc = is(func,'Function');
            // func is data
            if (func!=null&&!isfunc){
                result = func;
            }
            // do function defined
            if (isfunc){
                var arr = [];
                for(var i=2,l=arguments.length;i<l;i++){
                    arr.push(this.[INJECTOR_NAME](arguments[i]));
                }
                var exports = {};
                arr.push.call(arr,exports,{},f,[]);
                var ret = func.apply(null,arr)||exports;
                if (!result||!is(ret,'Object')){
                    // for non-object return
                    result = ret;
                }else{
                    // for namespace return
                    // bad performance for-in in v8 for instance
                    if (!!Object.keys){
                        for(var ls=Object.keys(ret),i=0,l=ls.length,x;i<l;i++){
                            x = ls[i];
                            result[x] = ret[x];
                        }
                    }else{
                        for(var x in ret){
                            result[x] = ret[x];
                        }
                    }
                }
            }
            // init data
            if (!result){
                result = {};
            }
            cache[key] = result;
            // return 
            return result;
        };
    };
}