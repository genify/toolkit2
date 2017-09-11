/*
 * utility api
 * @module   util/util
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util');
/**
 * NEJ module version mode placeholder
 * @type {String}
 */
exports.MODULE_VERSION_HOLDER = '#[NEJ_MODULE_VERSION_MODE]';
/**
 * generator md5 for content
 * @param  {String} content - content
 * @return {String} md5 hash value
 */
exports.md5 = function(content){
    if (!content){
        return 'FILE_NOT_EXIST';
    }
    return require('crypto').createHash('md5').update(content).digest('hex');
};
/**
 * generator number between min and max
 * @param  {Number} min - min value, contain this value
 * @param  {Number} max - max value, not contain this value
 * @return {Number} random value
 */
exports.rand = function(min,max){
    return Math.floor(Math.random()*(max-min)+min);
};
/**
 * generator an increment number
 * @return {Number} increment number
 */
exports.increment = (function(){
    var seed = +new Date;
    return function(){
        return seed++;
    };
})();
/**
 * generator an increment number
 * @return {Number} increment number
 */
exports.inc = (function () {
    var seed = 1;
    var kmap = {};
    return function (key) {
        if (!key){
            return seed++;
        }
        var it = kmap[key]||0;
        kmap[key] = it+1;
        return kmap[key];
    }
})();
/**
 * merge all object
 * @param  {Object} arg - object to be merged
 * @return {Object} union properties with all object
 */
exports.merge = function(){
    var ret = {},
        args = [].slice.call(arguments,0);
    args.forEach(function(item){
        var keys = Object.keys(item||{});
        keys.forEach(function(key){
            ret[key] = item[key];
        });
    });
    return ret;
};
/**
 * fetch value from config with template
 * @param  {Object} template - object template
 * @param  {Object} config   - value config
 * @return {Object} object after merge
 */
exports.fetch = function(template,config){
    config = config||{};
    template = template||{};
    var ret = {},
        keys = Object.keys(template);
    keys.forEach(function(key){
        var value = config[key];
        ret[key] = value==null?template[key]:value;
    });
    return ret;
};
/**
 * formatted time string
 * @param  {String} format - time format
 * @param  {Date}   time   - time object
 * @return {String} time string after formatted
 */
exports.getFormatTime = (function(){
    var _doFormat = function(number){
        if (number<10){
            return '0'+number;
        }
        return number;
    };
    var _doFormatMill = function(number){
        if (number<10){
            return '00'+number;
        }
        if (number<100){
            return '0'+number;
        }
        return number;
    }
    return function(format,time){
        time = time||new Date();
        return util.format(
            format,time.getFullYear(),
            _doFormat(time.getMonth()+1),
            _doFormat(time.getDate()),
            _doFormat(time.getHours()),
            _doFormat(time.getMinutes()),
            _doFormat(time.getSeconds()),
            _doFormatMill(time.getMilliseconds())
        );
    };
})();
/**
 * whether function parameter
 * @param  {Variable} func - function object
 * @return {Boolean}  whether function type
 */
exports.isFunction = function(func){
    return Object.prototype.toString.call(func).toLowerCase()=='[object function]';
};
/**
 *  concat multiple array
 *  @param  {Array}    list   - list to be merged
 *  @param  {Function} filter - filter to return item key value
 *  @return {Array}    array merged after filter repeat item
 */
exports.concat = function(){
    // check filter
    var len = arguments.length-1,
        filter = arguments[len];
    if (!this.isFunction(filter)){
        len = arguments.length;
        filter = null;
    }
    // merge list
    var ret = [],test = {};
    for(var i= 0,it,key;i<len;i++){
        it = arguments[i];
        if (it==null){
            continue;
        }
        // check array
        if (!util.isArray(it)){
            ret.push(it);
            continue;
        }
        // do merge
        it.forEach(function(item){
            if (!filter){
                if (ret.indexOf(item)<0){
                    ret.push(item);
                }
            }else{
                key = filter(item);
                if (!test[key]){
                    ret.push(item);
                    test[key] = !0;
                }
            }
        })
    }
    return ret;
};
/**
 * split right array from left array
 * @param  {Array} left  - left array
 * @param  {Array} right - right array
 * @return {Array} items split from left array
 */
exports.split = function(left,right){
    var ret = [];
    left = left||[];
    (right||[]).forEach(function(it){
        var index = left.indexOf(it);
        if (index>=0){
            left.splice(index,1);
            ret.push(it);
        }
    });
    return ret;
};
/**
 * generator file name and version with mode
 * @param  {String|Number} mode - version mode
 * @param  {Object} map - parameters map
 * @param  {String} map.RAND     - rand version
 * @param  {String} map.VERSION  - file content md5 version
 * @param  {String} map.FILENAME - file name value
 * @return {Object} file name and version, eg. {file:'',version:''}
 */
exports.version = function(mode,map){
    var ret = {
        file:map.FILENAME,
        version:''
    };
    if (mode===0){
        ret.version = map.VERSION;
    }else if(mode===1){
        ret.version = map.RAND;
    }else{
        mode = (mode||'')+'';
        ret.file = mode.replace(/\[(.+?)\]/g,function($1,$2){
            return map[$2.toUpperCase()]||$1;
        });
        if (ret.file===mode){
            ret.file = map.FILENAME+'_'+mode;
        }
    }
    return ret;
};
/**
 * rand next value
 * @param  {Array}  list - candidate value list
 * @return {String} rand value
 */
exports.randNext = function(list){
    if (!list){
        return '';
    }
    // for domain string
    if (typeof list==='string'){
        return list;
    }
    // for domain list
    if (list.length<2){
        return list[0];
    }
    return list[this.rand(0,list.length)];
};
/**
 * generate rand string
 * @param  {Number} length - string length
 * @return {String} rand string
 */
exports.randString = (function(){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz ';
    return function(length){
        length = length||10;
        var ret = [];
        for(var i=0,it;i<length;++i){
            it = Math.floor(Math.random()*chars.length);
            ret.push(chars.charAt(it));
        }
        return ret.join('');
    };
})();
/**
 * wrapper string to end tag regexp
 * @param  {String} wrap - wrap string
 * @return {RegExp} end tag regexp
 */
exports.wrap2reg = function(wrap){
    if (/<\/(.*?)>/.test(wrap||'')){
        return new RegExp('<\\/('+RegExp.$1+')>','gi');
    }
};
/**
 * import json file
 * @param  {String} file - file path
 * @return {Object} json object
 */
exports.file2json = function(file){
    var ret;
    try{
        ret = require(file);
    }catch(ex){
        ret = {};
    }
    return ret;
};
/**
 * format data time, variables can be
 * yyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w
 *
 * variables：
 *
 * | var  | desc |
 * | :--  | :-- |
 * | yyyy | 四位年份，如2001 |
 * | yy   | 两位年费，如01 |
 * | MM   | 两位月份，如08 |
 * | M    | 一位月份，如8 |
 * | dd   | 两位日期，如09 |
 * | d    | 一位日期，如9 |
 * | HH   | 两位小时，如07 |
 * | H    | 一位小时，如7 |
 * | mm   | 两位分钟，如03 |
 * | m    | 一位分钟，如3 |
 * | ss   | 两位秒数，如09 |
 * | s    | 一位秒数，如9 |
 * | ms   | 毫秒数，如234 |
 * | w    | 中文星期几，如一 |
 * | ct   | 12小时制中文后缀，上午/下午 |
 * | et   | 12小时制英文后缀，A.M./P.M. |
 * | cM   | 中文月份，如三 |
 * | eM   | 英文月份，如Mar |
 *
 * @param  {Date}   time   - date object
 * @param  {String} format - format string
 * @return {String} string after format
 */
exports.datetime = (function(){
    var reg0 = /\byyyy|yy|MM|M|dd|d|HH|H|mm|ms|ss|m|s\b/g,
        keys = ['M','d','H','m','s'];
    var formatNumber = function(number){
        number = parseInt(number,10)||0;
        return (number<10?'0':'')+number;
    };
    return function(time,format){
        var map = {
            yyyy:time.getFullYear(),
            M:time.getMonth()+1,
            d:time.getDate(),
            H:time.getHours(),
            m:time.getMinutes(),
            s:time.getSeconds(),
            ms:time.getMilliseconds()
        };
        // complete double key format
        map.yy = (''+map.yyyy).substr(2);
        keys.forEach(function(k){
            map[k+k] = formatNumber(map[k]);
        });
        // replace key word
        return (format||'').replace(reg0,function($1){
            var ret = map[$1];
            return ret!=null?ret:$1;
        });
    };
})();
/**
 * check mode is match to test
 * @param  {String} mode - mode string,e.g. online|test or !online
 * @param  {String} test - test string
 * @return {Boolean} mode is match to test
 */
exports.isModeOf = function(mode,test){
    var arr = (mode||'').split('|');
    // check mode
    var ret = !1;
    arr.some(function(value){
        if (!value){
            return;
        }
            // for !xxxx
        var ret1 = value===test,
            // for yyyy
            ret2 = value.indexOf('!')===0&&
                   value.substr(1)!=test;
        // match result
        if (ret1||ret2){
            ret = !0;
            return !0;
        }
    });
    return ret;
};