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
            opt.id = id;
            opt.project = opt.p||opt.project||'./';
            opt.overwrite = opt.w||opt.overwrite||!1;
            opt.template = opt.t||opt.template||'';
            main.nei(opt);
        }
    },
    update:function(event){
        event.stopped = !0;
        // TODO
    }
})).exec(
    process.argv.slice(2)
);