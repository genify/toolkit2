#!/usr/bin/env node

var _fs = require('../lib/file.js');
    
// init args
// nej-widget ui abc
var _arr = process.argv.slice(2),
    _dst = (_arr[0]||'').trim()||process.cwd();
if (!/\/$/.test(_dst)){
    _dst += '/';
}

// make dir
_fs.copy(
    __dirname+'/../template/widget/util/',
    _dst,function(_from,_to){
        console.log('Create %s',_to);
    }
);
console.log('Widget Create Success!');