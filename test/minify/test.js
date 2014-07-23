var fs = require('fs'),
    obf = require('../../lib/minify.js');

var result = obf.obfuscate({
    'core.js':['h.js']
},{
    bags:{
        "_$id": "Zz8",
        "_$get": "gh6",
        "_$randString": "a7",
        "_$isString": "vf5",
        "_$isNumber": "z7",
        "_$getChildren": "abc",
    },
    obf_level:3,
    obf_line_mode:1,
    code_map:{
        //'e.js':fs.readFileSync('./element.js', "utf8"),
        //'f.js':fs.readFileSync('./json.js', "utf8"),
        'h.js':'var x = {\'for\': "htmlFor"};if (!!x.b){ console.log(x); }',
        'g.js':'var x = "http://a.b.com/a/a.html";location.href = "http://nei.hz.netease.com/";',
        '2.js':'var x ={},y=\'xxx\'; x[\'__abc\'] = \'xxxx\';console.log(x[y]);e = {7:\'rgb\',\'a-b\':4,__init : 0,__reset : 1,__destroy : 2,__initNode : 3,__doBuild : 4,__onShow : 5,__onHide : 6,__onRefresh : 7}, t = {__supInit : 0,__supReset : 1,__supDestroy : 2,__supInitNode : 3,__supDoBuild : 4,__supOnShow : 5,__supOnHide : 6,__supOnRefresh : 7};',
        '1.js':'HTMLElement.prototype[\'__defineGetter__\']("innerText",function(){return this.textContent;});HTMLElement.prototype[\'__defineSetter__\']("innerText",function(_content){this.textContent = _content;});',
        'a.js':'var a = {}; a.abc = function zzr(zx,zy){zx=1;zy=2;}; function xj(){}; xj();var a = true; var x = {a:"zzzz",v:"vvvvvvvvvvv"};console.log(x.a+":"+x.v);x.b = "mmmmmm"',
        'b.js':'var b = "bbbb"; test: while(true){var dddddddddddd = "xxxxx";}',
        'c.js':'(function(){var ccccccc = "ccccccccc";window.abc=function def(){return ccccccc;};})();',
        'd.js':'(function(){var dddddddddddd = "ddddddddddddddddd";a="zzzzzz";if(DEBUG){var x="xxxxx";}})();'
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

