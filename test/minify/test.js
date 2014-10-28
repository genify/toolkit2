var fs = require('fs'),
    obf = require('../../lib/pub/minify.js');

var result = obf.obfuscate({
    'core.js':['z.js']
},{ 
    bags:{
        "w":"w"
    },
    obf_level:3,
    code_map:{
        //'e.js':fs.readFileSync('./element.js', "utf8"),
        //'f.js':fs.readFileSync('./json.js', "utf8"),
        'h.js':'(function(){_def = "xxxxxxx";console.log(_def);window._aaaaaaaaaaaa = {\'for\': "htmlFor"};if (!!_aaaaaaaaaaaa.b){ console.log(_aaaaaaaaaaaa); }})();',
        'g.js':'var x = "http://a.b.com/a/a.html";location.href = "http://nei.hz.netease.com/";',
        '2.js':'var x ={},y=\'xxx\'; x[\'__abc\'] = \'xxxx\';console.log(x[y]);e = {7:\'rgb\',\'a-b\':4,__init : 0,__reset : 1,__destroy : 2,__initNode : 3,__doBuild : 4,__onShow : 5,__onHide : 6,__onRefresh : 7}, t = {__supInit : 0,__supReset : 1,__supDestroy : 2,__supInitNode : 3,__supDoBuild : 4,__supOnShow : 5,__supOnHide : 6,__supOnRefresh : 7};',
        '1.js':'HTMLElement.prototype[\'__defineGetter__\']("innerText",function(){return this.textContent;});HTMLElement.prototype[\'__defineSetter__\']("innerText",function(_content){this.textContent = _content;});',
        'a.js':'var a = {}; a.abc = function zzr(zx,zy){zx=1;zy=2;}; function xj(){}; xj();var a = true; var x = {a:"zzzz",v:"vvvvvvvvvvv"};console.log(x.a+":"+x.v);x.b = "mmmmmm"',
        'b.js':'var b = "bbbb"; test: while(true){var dddddddddddd = "xxxxx";}',
        'c.js':'(function(){var ccccccc = "ccccccccc";window.abc=function def(){return ccccccc;};})();',
        'd.js':'(function(){var dddddddddddd = "ddddddddddddddddd";a="zzzzzz";if(DEBUG){var x="xxxxx";}})();',
        'i.js':'var a=1,b=2,c;c=a;b=a;a=c;',
        'z.js':'function u(x) {        var v = [];        (function w(y, z) {            for (var A = y.firstChild; A; A = A.nextSibling) {                if (A.nodeType == 3) {                    z += A.nodeValue.length                } else {                    if (A.nodeType == 1) {                        v.push({                            event: "start",                            offset: z,                            node: A                        });                        z = w(A, z);                        if (!t(A).match(/br|hr|img|input/)) {                            v.push({                                event: "stop",                                offset: z,                                node: A                            })                        }                    }                }            }            return z        })(x, 0);        return v    }'
    }
});

var bags = result.bags;
var test = {};
for(var x in bags){
    if (!!test[bags[x]]){
        console.log(bags[x]+' exist! ');
    }
    test[bags[x]] = !0;
}

fs.writeFileSync('./bags.json',JSON.stringify(result.bags,null,'\t'));
fs.writeFileSync('./code.json',JSON.stringify(result.files,null,'\t'));
fs.writeFileSync('./core.js',result.files['core.js']);

