var should = require('should'),
    klass = require('../../../lib/util/klass.js');

describe('util/klass',function(){
    var type = function(klass){
        return Object.prototype.toString.call(klass);
    };
    describe('.create()',function(){
        it('should return a Class constructor with extend api',function(){
            var Klass = klass.create();
            type(Klass).should.eql('[object Function]');
            Klass.prototype.should.have.ownProperty('init');
            type(Klass.prototype.init).should.eql('[object Function]');
            Klass.should.have.ownProperty('extend');
            type(Klass.extend).should.eql('[object Function]');
        });

        it('should use init api to construct Class',function(){
            var A = klass.create();
            A.prototype.init = function(arg){
                arg.should.eql('argument');
            };
            var a = new A('argument');
        });

        it('should inherit from super by extend api',function(){
            var ret = [];
            var AA = klass.create();
            AA.prototype.init = function(arg){
                ret.push(arg);
            };
            AA.prototype.a = function(arg){
                ret.push(arg);
            };
            var B = klass.create();
            B.extend(AA);
            var b = new B(1);
            b.a(2);
            ret.join(',').should.eql('1,2');
        });

        it('can be call super method use _super api',function(){
            var ret = [];
            var AA = klass.create();
            AA.prototype.init = function(arg){
                ret.push(arg);
            };
            AA.prototype.a = function(arg){
                ret.push(arg);
            };
            var B = klass.create();
            var pro = B.extend(AA);
            pro.a = function(arg){
                this._super(arg);
                ret.push(arg+1);
            };
            var b = new B(1);
            b.a(2);
            ret.join(',').should.eql('1,2,3');
        });

        it('should be ok when call _super from different method',function(){
            var ret = [];
            var AA = klass.create();
            AA.prototype.init = function(arg){
                ret.push(arg);
            };
            AA.prototype.a = function(arg){
                ret.push(arg);
            };
            AA.prototype.b = function(arg){
                this.a(arg);
                ret.push(arg+1);
            };
            var B = klass.create();
            var pro = B.extend(AA);
            pro.a = function(arg){
                this._super(arg);
                ret.push(arg+'a');
            };
            pro.b = function(arg){
                this._super(arg);
                ret.push(arg+'b');
            };
            var b = new B(1);
            b.b(2);
            ret.join(',').should.eql('1,2,2a,3,2b');
        });
    });

});
