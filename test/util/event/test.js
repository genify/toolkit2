var should = require('should'),
    Klass = require('../../../lib/util/event.js');

describe('util/event',function(){

    it('should ok when instance Event',function(){
        var ret = [];
        var inst = new Klass({
            z:1,
            a:function(arg){
                ret.push(arg);
            },
            b:function(arg){
                ret.push(arg);
            }
        });
        inst.on('c',function(arg){
            ret.push(arg);
        });
        inst.emit('a','a');
        inst.emit('b','b');
        inst.emit('c','c');
        inst.emit('z','z');
        ret.should.eql(['a','b','c']);
    });

});
