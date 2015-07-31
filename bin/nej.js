#!/usr/bin/env node

var main = require('../main.js');

(new (require('../lib/util/args.js'))({
    message:require('./nej.json'),
    package:require('../package.json'),
    msg:function(){
        process.exit(0);
    },
    init:function(event){
        event.stopped = !0;
        var output = event.args[0]||'./';
        if (!output){
            this.show('init');
        }else{
            if (typeof output!=='string'){
                output = './';
            }
            main.init(output);
        }
        process.exit(0);
    },
    build:function(event){
        event.stopped = !0;
        var file = event.args[0]||'./release.conf';
        if (!file){
            this.show('build');
            process.exit(0);
        }else{
            if (typeof file!=='string'){
                file = './release.conf';
            }
            main.build(file,function(){
                process.exit(0);
            });
        }
    },
    export:function(event){
        event.stopped = !0;
        var files = event.args.join(',');
        console.log(files);
        if (!files){
            this.show('export');
            process.exit(0);
        }else{
            files = files.split(/\s*[,;，；]+\s*]/);
            var opt = event.options||{};
            opt.output = opt.o||opt.output||'./';
            main.export(files,opt,function(){
                process.exit(0);
            });
        }
    }
})).exec(
    process.argv.slice(2)
);