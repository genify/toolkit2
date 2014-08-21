#!/usr/bin/env node

var  fs   = require('fs'),
     ut   = require('util'),
     cmd  = require('child_process'),
    _fs   = require('../lib/file.js'),
    _util = require('../lib/util.js'),
    _path = require('../lib/path.js');
    
// init args
// 0 - input dir
// 1 - output dir
var _arr = process.argv.slice(2),
    _dst = (_arr[1]||'').trim()||process.cwd();
if (!/\/$/.test(_dst)){
    _dst += '/';
}
// dump file list
var _ignore = /^(demo|test|platform)$/i;
var _regfle = /\.js$/i;
var _dump = function(_dir,_list){
    var _xrr = fs.readdirSync(_dir);
    if (!_xrr||!_xrr.length) return;
    for(var i=0,l=_xrr.length,_it,_file;i<l;i++){
        _it = _xrr[i];
        if (_util.svn(_it)){
            continue;
        }
        _file = _dir+_it;
        if (_fs.isdir(_file)){
            if (!_ignore.test(_it)){
                _dump(_file+'/',_list);
            }
            continue;
        }
        if (_regfle.test(_it)){
            _list.push(_file);
        }
    }
};
// do dump file
var _dir = _path.path(_arr[0]+'/',__dirname+'/');
console.log('Dump Files from %s ...',_dir);
var _brr = [];
_dump(_dir,_brr);
// output config file
var _file = _dst+'config.json',
    _conf = JSON.stringify({
        "plugins" : [ "plugins/markdown" ],
        "source"  : {
            "include" : _brr
        }
    },null,'\t');
_fs.write(_file,_conf);
// do generate document
console.log('Generate Document ...');
'jsdoc',['-c',_file,'-d',_dst]
var _cmd = cmd.exec(
    ut.format('jsdoc -c %s -d %s',_file,_dst),
    function(error,stdout,stderr){
        console.log(stdout);
        console.log(stderr);
        if (error!==null){
            // fs.unlinkSync(_file);
            console.log('Output Success!');
        }
    }
);
