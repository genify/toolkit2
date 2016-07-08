var should = require('should'),
    fs  = require('../../../lib/util/file.js'),
    ps  = require('../../../lib/util/path.js'),
    Parser = require('../../../lib/adapter/sprite.js');

describe('adapter/sprite',function(){

    describe('new Parser',function(){
        it('should instance of Parser',function(done){
            this.timeout(100000000);
            var parser = new Parser({
                map:{
                    a:[ps.normalize(__dirname+'/sp/a/a1.png'),ps.normalize(__dirname+'/sp/a/a2.png')],
                    b:[ps.normalize(__dirname+'/sp/b/b1.png'),ps.normalize(__dirname+'/sp/b/b2.png')],
                    //c:[ps.normalize(__dirname+'/sp/b/c1.png'),ps.normalize(__dirname+'/sp/b/c2.png')],
                    sp:[ps.normalize(__dirname+'/sp/d1.png'),ps.normalize(__dirname+'/sp/d2.png')]
                },
                output:ps.normalize(__dirname+'/sp/'),
                debug:function(event){
                    event.data.unshift(event.message);
                    console.log.apply(console,event.data);
                },
                info:function(event){
                    event.data = event.data||[];
                    event.data.unshift(event.message);
                    console.log.apply(console,event.data);
                },
                done:function(ret){
                    parser.should.be.an.instanceof(Parser);
                    done();
                }
            });
        });
    });

});