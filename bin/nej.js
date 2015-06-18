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
        '-h, --help         Quick help on [Command]',
        '',
        '[Command] is one of:',
        'init               Create release.conf',
        'build              Build web project by release.conf',
        'export             Export script files'
    ],
    'init':[
        'Usage:',
        package.name+' init [Options]',
        '',
        '[Options] is one of:',
        '-o, --output       Specify output directory where to generate release.conf',
        '',
        'Example:',
        package.name+' init',
        'or',
        package.name+' init -o=/path/to/output/'
    ],
    'build':[
        'Usage:',
        package.name+' build [Options]',
        '',
        '[Options] is one of:',
        '-c, --config       Specify release.conf file path'
    ],
    'export':[
        'Usage:',
        package.name+' export [Input Script Files] [Options]',
        '',
        '[Input Script Files]',
        'it can take multiple input files',
        '',
        '[Options] is one of:',
        '-o, --output       Specify output file where to generate source'
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
var handler = require('../main.js')[cmd];
if (!!handler){
    handler.call(null,opt,args.args);
}else{
    argc.show();
}
process.exit(0);