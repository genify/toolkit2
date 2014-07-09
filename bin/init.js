#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');
    
// init args
var _arr = process.argv.slice(2),
    _dst = (_arr[0]||'').trim()||process.cwd();
if (!/\/$/.test(_dst)){
    _dst += '/';
}
// copy files in config to Directory
var _root = __dirname+'/../config/',
    _list = fs.readdirSync(_root);
for(var i=0,l=_list.length,_it,_ot,_content;i<l;i++){
    _ot = _dst+_list[i];
    _it = _root+_list[i];
    fs.writeFileSync(
        _ot,fs.readFileSync(_it,'utf-8')
    );
}
console.log('publish config file init success!');