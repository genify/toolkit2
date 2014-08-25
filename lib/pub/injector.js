var I$ = function() {
    var o = {}, 
        r = [], 
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
        if (!result){
            result = {};
        }
        cache[key] = result;
        // do function defined
        if (isfunc){
            var arr = [];
            for(var i=2,l=arguments.length;i<l;i++){
                arr.push(I$(arguments[i]));
            }
            var export = {};
            arr.push.call(arr,export,o,f,r);
            var ret = func.apply(null,arr)||export;
            if (!is(ret,'Object')){
                // for non-object return
                result = ret;
                cache[key] = result;
            }else{
                // for namespace return
                for(var x in ret){
                    result[x] = ret[x];
                }
            }
        }
        return result;
    };
}();