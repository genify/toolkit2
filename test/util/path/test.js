var path = require('../../../lib/util/path.js'),
    should = require('should'),
    root = __dirname+'/';

describe('util/path',function(){
    
    describe('.normalize(path)',function(){
        it('should return /a/c/d/e/ for /a/./b/../c//d\\e\\',function(){
            path.normalize('/a/./b/../c//d\\e\\').should.equal('/a/c/d/e/');
        });
        it('should return c:/a/c/d/e/ for c:\\a/./b/../c//d\\e\\',function(){
            path.normalize('c:\\a/./b/../c//d\\e\\').should.equal('c:/a/c/d/e/');
        });
        it('should return http://a.b.com/a/c/d/e/ for http://a.b.com/a/./b/../c//d\\e\\',function(){
            path.normalize('http://a.b.com/a/./b/../c//d\\e\\').should.equal('http://a.b.com/a/c/d/e/');
        });
        it('should return https://a.b.com/a/c/d/e/ for https://a.b.com/a/./b/../c//d\\e\\',function(){
            path.normalize('https://a.b.com/a/./b/../c//d\\e\\').should.equal('https://a.b.com/a/c/d/e/');
        });
    });
    
    describe('.absoluteURL(url,root)',function(){
        it('should return http://a.b.com/c/ for http://a.b.com/c/ with root http://a.b.com/c/d/',function(){
            path.absoluteURL('http://a.b.com/c/','http://a.b.com/c/d/').should.equal('http://a.b.com/c/');
        });
        it('should return http://a.b.com/c/d/a/b for ./a/b with root http://a.b.com/c/d/',function(){
            path.absoluteURL('./a/b','http://a.b.com/c/d/').should.equal('http://a.b.com/c/d/a/b');
        });
        it('should return http://a.b.com/c/a/b for ../a/b with root http://a.b.com/c/d/',function(){
            path.absoluteURL('../a/b','http://a.b.com/c/d/').should.equal('http://a.b.com/c/a/b');
        });
        it('should return http://a.b.com/a/b for /a/b with root http://a.b.com/c/d/',function(){
            path.absoluteURL('/a/b','http://a.b.com/c/d/').should.equal('http://a.b.com/a/b');
        });
        it('should return http://a.b.com/a/b for /a/b with root http://a.b.com/',function(){
            path.absoluteURL('/a/b','http://a.b.com/').should.equal('http://a.b.com/a/b');
        });
        it('should return http://a.b.com/a/b for ../../a/b with root http://a.b.com/',function(){
            path.absoluteURL('../../a/b','http://a.b.com/').should.equal('http://a.b.com/a/b');
        });
        it('should return http://a.b.com:8090/a/b for a/b with root http://a.b.com:8090/',function(){
            path.absoluteURL('a/b','http://a.b.com:8090/').should.equal('http://a.b.com:8090/a/b');
        });
    });
    
    describe('.absolutePath(path,root)',function(){
        it('should return /home/user/local/a/b for .//a/b with root /home/user/local/',function(){
            path.absolutePath('.//a/b','/home/user/local/').should.equal('/home/user/local/a/b');
        });
        it('should return /a/b for /a/b with root /home/user/local/',function(){
            path.absolutePath('/a/b','/home/user/local/').should.equal('/a/b');
        });
        it('should return /a/b for ../../../../../a/b with root /home/user/local/',function(){
            path.absolutePath('../../../../../a/b','/home/user/local/').should.equal('/a/b');
        });
        it('should return /home/user/local/a/b for a/b with root /home/user/local/',function(){
            path.absolutePath('a/b','/home/user/local/').should.equal('/home/user/local/a/b');
        });
        it('should return c:/a/b for c:/a/b with root c:/user/local/',function(){
            path.absolutePath('c:/a/b','c:/user/local/').should.equal('c:/a/b');
        });
        it('should return c:/a/b for ../../../../../a/b with root c:/user/local/',function(){
            path.absolutePath('../../../../../a/b','c:/user/local/').should.equal('c:/a/b');
        });
        it('should return c:/user/local/a/b for a/b with root c:/user/local/',function(){
            path.absolutePath('a/b','c:/user/local/').should.equal('c:/user/local/a/b');
        });
    });
    
    describe('.absolute(file,root)',function(){
        it('should return http://a.b.com/c/ for http://a.b.com/c/ with root http://a.b.com/c/d/',function(){
            path.absolute('http://a.b.com/c/','http://a.b.com/c/d/').should.equal('http://a.b.com/c/');
        });
        it('should return http://a.b.com/c/d/a/b for ./a/b with root http://a.b.com/c/d/',function(){
            path.absolute('./a/b','http://a.b.com/c/d/').should.equal('http://a.b.com/c/d/a/b');
        });
        it('should return http://a.b.com/c/a/b for ../a/b with root http://a.b.com/c/d/',function(){
            path.absolute('../a/b','http://a.b.com/c/d/').should.equal('http://a.b.com/c/a/b');
        });
        it('should return http://a.b.com/a/b for /a/b with root http://a.b.com/c/d/',function(){
            path.absolute('/a/b','http://a.b.com/c/d/').should.equal('http://a.b.com/a/b');
        });
        it('should return http://a.b.com/a/b for /a/b with root http://a.b.com/',function(){
            path.absolute('/a/b','http://a.b.com/').should.equal('http://a.b.com/a/b');
        });
        it('should return http://a.b.com/a/b for ../../a/b with root http://a.b.com/',function(){
            path.absolute('../../a/b','http://a.b.com/').should.equal('http://a.b.com/a/b');
        });
        it('should return http://a.b.com:8090/a/b for a/b with root http://a.b.com:8090/',function(){
            path.absolute('a/b','http://a.b.com:8090/').should.equal('http://a.b.com:8090/a/b');
        });
        it('should return /home/user/local/a/b for .//a/b with root /home/user/local/',function(){
            path.absolute('.//a/b','/home/user/local/').should.equal('/home/user/local/a/b');
        });
        it('should return /a/b for /a/b with root /home/user/local/',function(){
            path.absolute('/a/b','/home/user/local/').should.equal('/a/b');
        });
        it('should return /a/b for ../../../../../a/b with root /home/user/local/',function(){
            path.absolute('../../../../../a/b','/home/user/local/').should.equal('/a/b');
        });
        it('should return /home/user/local/a/b for a/b with root /home/user/local/',function(){
            path.absolute('a/b','/home/user/local/').should.equal('/home/user/local/a/b');
        });
        it('should return c:/a/b for c:/a/b with root c:/user/local/',function(){
            path.absolute('c:/a/b','c:/user/local/').should.equal('c:/a/b');
        });
        it('should return c:/a/b for ../../../../../a/b with root c:/user/local/',function(){
            path.absolute('../../../../../a/b','c:/user/local/').should.equal('c:/a/b');
        });
        it('should return c:/user/local/a/b for a/b with root c:/user/local/',function(){
            path.absolute('a/b','c:/user/local/').should.equal('c:/user/local/a/b');
        });
    });
    
    describe('.isURL(url)',function(){
        it('should return true when url is http://a.b.com/a/b',function(){
            path.isURL('http://a.b.com/a/b').should.be.true;
        });
        it('should return true when url is https://a.b.com/a/b',function(){
            path.isURL('https://a.b.com/a/b').should.be.true;
        });
        it('should return true when url is ftp://a.b.com/a/b',function(){
            path.isURL('ftp://a.b.com/a/b').should.be.true;
        });
        it('should return false when url is /home/user/local/',function(){
            path.isURL('/home/user/local/').should.be.false;
        });
    });
    
});
