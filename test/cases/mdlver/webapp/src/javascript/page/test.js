NEJ.define(function(){
    var c = 'ccccc';
    var f = function(){
        return 'ffffff';
    };
    var xx = '\
    aaaa\
    bbbbbbbbbbbbbb'+f('xxxxx')+'cccccc\
    dddddddddddddddddd\
    zzzzzzzzzzzzzzzzzzzzzzzzz';

    console.log(xx);
});