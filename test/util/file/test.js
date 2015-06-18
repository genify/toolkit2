var fs = require('../../../lib/util/file.js'),
    path = require('../../../lib/util/path.js'),
    should = require('should'),
    root = path.normalize(__dirname+'/');

describe('util/file',function(){
    
    describe('.raw(file)',function(){
        it('should return null when file not exist',function(){
            var file = root+'abc.txt';
            fs.exist(file).should.be.false;
            (fs.raw(file)==null).should.be.true;
        });
        it('should be ok when file exist',function(){
            var buffer = fs.raw(root+'b.txt'),
                content = 'abcdefghijklnmopqrstuvwxyz';
            for(var i=0,l=buffer.length;i<l;i++){
                buffer[i].should.equal(content.charCodeAt(i));
            }
        });
    });
    
    describe('.read(file,charset)',function(){
        it('should return null when file not exist',function(){
            var file = root+'abc.txt';
            fs.exist(file).should.be.false;
            (fs.read(file)==null).should.be.true;
        });
        it('should return null when charset not support',function(){
            (fs.read(root+'a.txt','abc')==null).should.be.true;
        });
        it('should be ok when file charset is utf-8',function(){
            var list = fs.read(root+'a.txt');
            list[0].should.equal('aaaaa');
            list[1].should.equal('中文');
        });
        it('should be ok when file charset is gbk',function(){
            var list = fs.read(root+'a.gbk.txt','gbk');
            list[0].should.equal('aaaaa');
            list[1].should.equal('中文');
        });
    });

    describe('.readAsync(file,charset)',function(){
        it('should return null when file not exist',function(){
            var file = root+'abc.txt';
            fs.exist(file).should.be.false;
            fs.readAsync(file,function(content){
                (content==null).should.be.true;
            });
        });
        it('should return null when charset not support',function(){
            fs.readAsync(root+'a.txt',function(content){
                (content==null).should.be.true;
            },'abc');
        });
        it('should be ok when file charset is utf-8',function(done){
            fs.readAsync(root+'a.txt',function(list){
                list[0].should.equal('aaaaa');
                list[1].should.equal('中文');
                //console.log(list);
                done();
            });
        });
        it('should be ok when file charset is gbk',function(done){
            fs.readAsync(root+'a.gbk.txt',function(list){
                list[0].should.equal('aaaaa');
                list[1].should.equal('中文');
                //console.log(list);
                done();
            },'gbk');
        });
    });

    describe('.write(file,content,charset)',function(){
        var file = root+'out.txt';
        var content = 'aabb中文';
        it('should throw an exception when charset not support',function(){
            (function(){fs.write(file,content,'abc');}).should.throw();
        });
        it('should be ok when charset is utf-8',function(){
            fs.write(file,content);
            fs.read(file)[0].should.equal(content);
            fs.rm(file);
        });
        it('should be ok when charset is gbk',function(){
            fs.write(file,content,'gbk');
            fs.read(file,'gbk')[0].should.equal(content);
            fs.rm(file);
        });
    });

    describe('.writeAsync(file,content,charset)',function(){
        var file = root+'out.txt';
        var content = 'aabb中文';
        it('should throw an exception when charset not support',function(done){
            fs.writeAsync(file,content,'abc',function(isok){
                isok.should.be.false;
                done();
            });
        });
    });

    describe('.copy(src,dst,logger)',function(){
        it('should throw an exception when source not exist',function(){
            (function(){fs.copy(root+'x.js',root+'y.js');}).should.throw();
        });
        it('should be ok',function(){
            var src = root+'a.txt',
                dst = root+'x.txt';
            fs.rm(dst);
            fs.exist(dst).should.be.false;
            fs.copy(src,dst);
            fs.read(src).should.eql(fs.read(dst));
            fs.rm(dst);
        });
    });
    
    describe('.rm(file)',function(){
        it('should be ok when file not exist',function(){
            var file = root+'abc.txt';
            fs.exist(file).should.be.false;
            fs.rm(file);
            fs.exist(file).should.be.false;
        });
        it('should not be deleted when file is directory',function(){
            var file = root+'a/';
            fs.isdir(file).should.be.true;
            fs.rm(file);
            fs.exist(file).should.be.true;
        });
        it('should be ok when file exist',function(){
            var file = root+'z.txt';
            fs.write(file,'zzzzzz');
            fs.exist(file).should.be.true;
            fs.rm(file);
            fs.exist(file).should.be.false;
        });
    });
    
    describe('.isdir(dir)',function(){
        it('should return true when dir is directory',function(){
            fs.isdir(root).should.be.true;
        });
        it('should return false when dir is file',function(){
            fs.isdir(root+'a.txt').should.be.false;
        });
        it('should return false when dir is not exist',function(){
            fs.isdir(root+'abc/').should.be.false;
        });
    });
    
    describe('.mkdir(dir)',function(){
        it('should be ok when dir is exist',function(){
            var dir = root+'a/';
            fs.exist(dir).should.be.true;
            fs.mkdir(dir);
            fs.exist(dir).should.be.true;
        });
        it('should be ok when dir is not exist',function(){
            var dir = root+'x/';
            fs.exist(dir).should.be.false;
            fs.mkdir(dir);
            fs.exist(dir).should.be.true;
            fs.rmdir(dir);
        });
    });
    
    describe('.rmdir(dir)',function(){
        it('should be ok when dir is not exist',function(){
            var dir = root+'z/';
            fs.exist(dir).should.be.false;
            fs.rmdir(dir);
            fs.exist(dir).should.be.false;
        });
        it('should be ok when dir is exist',function(){
            var dir = root+'z/';
            fs.mkdir(dir);
            fs.exist(dir).should.be.true;
            fs.rmdir(dir);
            fs.exist(dir).should.be.false;
        });
    });
    
    describe('.cpdir(src,dst,logger)',function(){
        it('should be ok',function(){
            var dir = root+'b/';
            var dst = root+'w/';
            fs.rmdir(dst);
            fs.exist(dst).should.be.false;
            fs.cpdir(dir,dst);
            fs.exist(dst+'c/a.txt').should.be.true;
            fs.exist(dst+'d/b.txt').should.be.true;
            fs.rmdir(dst);
        });
    });
    
    describe('.lsfile(dir,filter)',function(){
        it('should return empty array when dir not exist',function(){
            var ret = fs.lsfile('/a/b/');
            ret.should.eql([]);
        });
        it('should return empty array when dir is empty',function(){
            var ret = fs.lsfile(__dirname+'/a/');
            ret.should.eql([]);
        });
        it('should return all files when no filter',function(){
            var dir = root+'c/';
            var ret = fs.lsfile(dir);
            ret.should.eql([
                dir+'d/test.html',dir+'d/test.js',
                dir+'test.css',dir+'_test.txt'
            ]);
        });
        it('should return files not be filted',function(){
            var dir = root+'c/';
            var ret = fs.lsfile(dir,function(name,path){
                return /\.(css|js)$/i.test(name);
            });
            ret.should.eql([dir+'d/test.js',dir+'test.css']);
        });
    });
    
    describe('.exist(path)',function(){
        it('should be ok when path is file',function(){
            fs.exist(root+'a.txt').should.be.true;
            fs.exist(root+'z.txt').should.be.false;
        });
        it('should be ok when path is directory',function(){
            fs.exist(root+'a/').should.be.true;
            fs.exist(root+'z/').should.be.false;
        });
    });
    
});

