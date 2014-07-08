var fs = require('fs'),
    obf = require('../../lib/minify.js');

var result = obf.obfuscate({
    'core.js':['a.js','b.js'],
    'a.html':['c.js','d.js'],
    'b.html':['e.js','f.js']
},{
    bags:{},
    code_map:{
        'a.js':'var a = true; var x = {a:"zzzz",v:"vvvvvvvvvvv"};console.log(x.a+":"+x.v);x.b = "mmmmmm"',
        'b.js':'var b = "bbbb"; test: while(true){var dddddddddddd = "xxxxx";}',
        'c.js':'(function(){var ccccccc = "ccccccccc";window.abc=function(){return ccccccc;};})();',
        'd.js':'(function(){var dddddddddddd = "ddddddddddddddddd";a="zzzzzz";if(DEBUG){var x="xxxxx";}})();',
        'e.js':fs.readFileSync('./element.js', "utf8"),
        'f.js':'(function(){})();'
    }
});

fs.writeFileSync('./code.json',JSON.stringify(result.code));


