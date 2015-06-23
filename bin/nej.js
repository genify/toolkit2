#!/usr/bin/env node

var main = require('../main.js');

new (require('../lib/util/args.js'))({
    message:require('./nej.json'),
    package:require('../package.json'),
    msg:function(){
        process.exit(0);
    },
    init:function(event){
        event.stopped = !0;
        var opt = event.options||{},
            output = opt.o||opt.output;
        if (output==null){
            this.show('init');
        }else{
            main.init(output||'./');
        }
    },
    build:function(event){
        event.stopped = !0;
        var opt = event.options||{},
            file = opt.c||opt.config;
        if (file==null){
            this.show('build');
        }else{
            file = file||'./release.conf';
            main.build(file,function(){
                process.exit(0);
            });
        }
    },
    export:function(event){
        event.stopped = !0;
        // TODO
    }
}).exec(
    process.argv.slice(2)
);