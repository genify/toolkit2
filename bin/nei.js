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
            var output = opt.o||opt.output;
            if (typeof output!=='string'){
                output = './';
            }
            var template = opt.t||opt.template;
            if (typeof template!=='string'){
                template = output+'/templates/';
            }
            main.nei(id,{
                output:output,
                template:template
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