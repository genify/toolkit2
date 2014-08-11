#!/usr/bin/env node

var _fs = require('../lib/file.js');
    
// init args
var _arr = process.argv.slice(2),
    _name = _arr[0]||'hack',
    _dst = (_arr[1]||'').trim()||process.cwd();
if (!/\/$/.test(_dst)){
    _dst += '/';
}

// check dir
if (!/\/platform\/$/.test(_dst)){
    _dst += 'platform/';
    _fs.mkdir(_dst);
}

// copy file
var _dir = __dirname+'/../template/patch/'
_fs.copy(
    _dir+'hack.js',
    _dst+_name+'.js',
    function(_from,_to){
        console.log('Create %s',_to);
    }
);
var _content = _fs.read(_dir+'hack.patch.js'),
    _to = _dst+_name+'.patch.js';
_fs.write(_to,_content.join('\n').replace('#<PATCH_NAME>',_name));
console.log('Create %s',_to);

console.log('Patch Create Success!');