var should = require('should'),
    io = require('../../../lib/util/io.js'),
    Explorer = require('../../../lib/explorer/style.js');

describe('explorer/style',function(){

    var parser = new Explorer({
        file:__dirname+'/test.html',
        list:['./a.css','./b.css']
    });

    describe('new Explorer',function(){
        it('should instance of Explorer',function(){
            parser.should.be.an.instanceof(Explorer);
        });
    });

    describe('.parse(config)',function(){
        it('should return ok after parse',function(){
            parser.parse({
                webRoot:'c:/webapp/'
            });
            var list = parser.getDependencies();
            //console.log('%j',list);
            var ret = [];
            list.forEach(function(uri){
                ret.push(io.getFromCache(uri));
            });
            ret.length.should.be.eql(2);
            //console.log('%j',ret);
        });
    });

});