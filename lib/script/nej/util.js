/*
 * NEJ Utility API
 * @module   script/nej/util
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util');
/**
 * parse platform string
 * result properties
 * - engines        platform supported
 * - lower          platform lower version
 * @param  {String} platform - platform config
 * @return {Object} result of platform config
 */
exports.parsePlatform = (function(){
    var _pMap = {
        td:'trident',wk:'webkit',gk:'gecko',
        android:'webkit',ios:'webkit',cef:'webkit',win:'trident'
    };
    return function(platform){
        platform = (platform||'td|wk|gk').toLowerCase();
        var ret = { engines:[] };
        // check engine
        platform.split('|').forEach(function(key){
            var arr = key.split('-'),
                eng = _pMap[arr[0]];
            if (ret.engines.indexOf(eng)<0){
                ret.engines.push(eng);
            }
        });
        // td-0 -> TR>=3.0 (ie>=7)
        // td-1 -> TR>=6.0 (ie>=10)
        if (platform.indexOf('td-0')>=0){
            ret.lower = '3.0';
        }
        if (platform==='win'||
            platform.indexOf('td-1')>=0){
            ret.lower = '6.0';
        }
        return ret;
    };
})();
/**
 * parse nej patch version expression
 * result properties
 * - engine     patch supported engine expression
 * - version    patch supported version expression
 * - lower      lower version config, eg. {value:'3.0',eq:true}
 * - middle     middle version config, eg. {value:'5.0',eq:true}
 * - upper      upper version config, eg. {value:'6.0',eq:true}
 * @param  {String} expression - version expression
 * @return {Object} result of expression
 */
exports.parseExpression = (function(){
    var _vMap = {r:'release',v:'version'},
        _cMap = {t:'trident',w:'webkit',g:'gecko'},
        _fMap = [
            // for 2.0a<= or 2.0a= or 2.0a>=
            function(result,exp){
                switch(exp.op){
                    case '<':
                    case '<=':
                        result.lower = exp;
                    break;
                    case '>':
                    case '>=':
                        result.upper = exp;
                    break;
                    case '=':
                    case '==':
                        result.midle = exp;
                    break;
                }
                delete exp.op;
            },
            // for <=2.0a or =2.0a or >=2.0a
            function(result,exp){
                switch(exp.op){
                    case '<':
                    case '<=':
                        // check over write upper
                        var upper = result.upper;
                        if (!upper||exp.value<=upper.value){
                            result.upper = exp;
                            if (!!upper){
                                exp.eq = upper.eq&&exp.eq;
                            }
                        }
                    break;
                    case '>':
                    case '>=':
                        // check over write lower
                        var lower = result.lower;
                        if (!lower||exp.value>=lower.value){
                            result.lower = exp;
                            if (!!lower){
                                exp.eq = lower.eq&&exp.eq;
                            }
                        }
                    break;
                    case '=':
                    case '==':
                        // check over write lower
                        var midle = result.midle;
                        if (!midle){
                            result.midle = exp;
                        }else if(midle.value!==exp.value){
                            result.dirty = !0;
                            delete result.midle;
                        }
                    break;
                }
                delete exp.op;
            }
        ];
    return function(expression){
        var exp = (expression||'').replace(/\s/g,'').toLowerCase();
        if (!/(tr|wr|gr|tv|wv|gv)/i.test(exp)){
            return null;
        }
        // parse expresion to platfrom
        var ret = {},
            eng = RegExp.$1.toLowerCase(),
            arr = eng.split('');
        ret.engine = util.format(
            "._$KERNEL.engine==='%s'",
            _cMap[arr[0]]||''
        );
        // for TR or GR or WR
        if (eng===exp){
            return ret;
        }
        // for TR=3.0 or 2.0<=TR<=4.0
        ret.version = util.format(
            '._$KERNEL.%s',
            _vMap[arr[1]]||'release'
        );
        // check version condition
        var ver = /([<>=]+)/;
        exp.split(eng).forEach(function(value,index){
            if (!ver.test(value)){
                return;
            }
            var op = RegExp.$1,
                vl = value.replace(op,'');
            _fMap[index](ret,{
                value:vl,op:op,
                eq:op.indexOf('=')>=0
            });
        });
        return !ret.dirty?ret:null;
    };
})();
/**
 * check expression fit to platform
 * @param  {Object}  exp - expression parse result
 * @param  {Object}  platform - platform parse result
 * @return {Boolean} is expression fit to platform
 */
exports.isExpFitPlatform = function(exp,platform){
    // check string exp and platform
    if (typeof exp==='string'){
        exp = this.parseExpression(exp);
    }
    if (typeof platform==='string'){
        platform = this.parsePlatform(platform);
    }
    // check engine
    var engines = platform.engines,
        index = engines.indexOf(exp.engine);
    // engine not match
    if (index<0){
        return !1;
    }
    // check version
    var lower = platform.lower;
    if (lower==null){
        return !0;
    }
    // check upper
    var upper = exp.upper;
    if (!!upper){
        if (upper.value<lower||
            (upper.value==lower&&!upper.eq)){
            return !1;
        }
        return !0;
    }
    // check middle
    var midle = exp.midle;
    if (!!midle&&midle.value<lower){
        return !1;
    }
    return !0;
};
/**
 * stringify expression to condition
 * @param  {String} name - name of platform argument name
 * @param  {Object} exp - expression parse result
 * @return {String} condition expression
 */
exports.stringifyExp = function(name,exp){
    if (typeof exp==='string'){
        exp = this.parseExpression(exp);
    }
    var ret = name+exp.engine,
        ver = name+exp.version,
        arr = [];
    // check lower
    var lower = exp.lower;
    if (!!lower){
        arr.push(
            util.format(
                "%s>%s'%s'",
                ver,lower.eq?'=':'',
                lower.value
            )
        );
    }
    // check middle
    var midle = exp.midle;
    if (!!midle){
        arr.push(ver+"=='"+midle.value+"'");
    }
    // check upper
    var upper = exp.upper;
    if (!!upper){
        arr.push(
            util.format(
                "%s>%s'%s'",
                ver,upper.eq?'=':'',
                upper.value
            )
        );
    }
    // suffix
    var other = '';
    if (arr.length>0){
        other = '&&'+arr.join('&&');
    }
    return ret+other;
};