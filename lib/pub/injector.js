var I$ = function() {
    var o = {}, 
        r = [], 
        f = function() {return !1;}, 
        cache = {};
    return function(key,func) {
        var result = cache[key],
            isfunc = o.toString.call(func)==='[object Function]';
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
            for(var x in ret){
                result[x] = ret[x];
            }
        }
        return result;
    };
}();