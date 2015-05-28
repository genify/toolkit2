#!/usr/bin/env node

var argc = require('../lib/util/args.js');
// cache help message
argc.config({
    '-default':[
        '使用方式：',
        'nej [命令] [参数]',
        '',
        '可选参数：',
        '-v, --version      显示版本信息',
        '-h, --help         显示帮助信息',
        '',
        '可用命令：',
        'new                生成工程、页面、模块、组件及初始代码',
        'test               运行当前项目下的所有测试用例',
        'init               初始化发布配置信息',
        'build              打包发布'
    ],
    'create':[
        
    
    ],
    'init':[
        '使用方式：',
        'nej init [参数]',
        '',
        '可选参数：',
        '-h, --help         显示帮助信息',
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