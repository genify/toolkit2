#!/usr/bin/env node

var main = require('../main.js');

(new (require('../lib/util/args.js'))({
    message:require('./nei.json'),
    package:require('../package.json'),
    msg:function(){
        process.exit(0);
    },
    build:function(event){
        event.stopped = !0;
        var opt = event.options||{},
            id = opt.i||opt.id;
        if (!id){
            this.show('build');
            process.exit(0);
        }else{
            var project = opt.p||opt.project;
            if (typeof project!=='string'){
                project = './';
            }
            var webroot = opt.r||opt.webroot;
            if (typeof webroot!=='string'){
                webroot = project+'/src/main/webapp/';
            }
            var template = opt.t||opt.template;
            if (typeof template!=='string'){
                template = project+'/src/main/views/';
            }
            main.nei(id,{
                project:project,
                webroot:webroot,
                template:template,
                overwrite:opt.w||opt.overwrite
            });
        }
    },
    update:function(event){
        event.stopped = !0;
        // TODO
    }
})).exec(
    process.argv.slice(2)
);