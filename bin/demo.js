#!/usr/bin/env node

var _fs = require('../lib/file.js');
    
// init args
var _arr = process.argv.slice(2),
    _dst = (_arr[0]||'').trim()||process.cwd();
if (!/\/$/.test(_dst)){
    _dst += '/';
}

// make dir
_fs.copy(
    __dirname+'/../demo/',
    _dst,function(_from,_to){
        console.log('Create %s',_to);
    }
);
console.log('Demo Create Success!');