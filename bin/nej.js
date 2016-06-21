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
            var opt = event.options||{};
            this.format('build',opt);
            main.build(file,opt,function(){
                process.exit(0);
            });
        }
    },
    export:function(event){
        event.stopped = !0;
        var files = decodeURIComponent(
            event.args.join(',')
        );
        if (!files){
            this.show('export');
            process.exit(0);
        }else{
            files = files.split(/\s*[,;，；]+\s*/);
            var opt = event.options||{};
            this.format('export',opt);
            main.export(files,opt,function(){
                process.exit(0);
            });
        }
    },
    cache:function(event){
        event.stopped = !0;
        var file = event.args[0]||'./cache.json';
        if (!file){
            this.show('build');
            process.exit(0);
        }else{
            if (typeof file!=='string'){
                file = './cache.json';
            }
            var opt = event.options||{};
            this.format('cache',opt);
            main.cache(file,opt,function(){
                process.exit(0);
            });
        }
    }
})).exec(
    process.argv.slice(2)
);