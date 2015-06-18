#!/usr/bin/env node

var argc = require('../lib/util/args.js'),
    package = require('../package.json');
// cache help message
argc.config({
    '-default':[
        'Toolkit '+package.version,
        '',
        'Usage:',
        package.name+' [Command] [Options]',
        '',
        '[Options] is one of:',
        '-v, --version      Show Toolkit Version',
        '-h, --help         Quick Help on [Command]',
        '',
        '[Command] is one of:',
        'init               Create release.conf',
        'build              Build Web Project by release.conf'
    ],
    'init':[
        'Usage:',
        'nej init [Options]',
        '',
        '[Options] is one of:',
        '-o, --output       输出目录路径，默认为当前目录'
    ],
    'build':[
    
    ]


});
// parse command line
var args = argc.parse(
    process.argv.slice(2)
);
var opt = args.options;
// check help show
if (opt.h||opt.help){
    argc.show(args.command);
    process.exit(0);
}
// check command
var cmd = (args.command||'').toLowerCase();
if (!cmd&&(opt.v||opt.version)){
    cmd = 'version';
}
// handle command
var handler = require('../lib/cmd.js')[cmd];
if (!!handler){
    handler.call(null,opt);
}else{
    argc.show();
}
process.exit(0);