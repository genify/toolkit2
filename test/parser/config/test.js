var should = require('should'),
    Parser = require('../../../lib/parser/config.js');

describe('parser/config',function(){
    
    describe('new Parser',function(){
        
        var _doCheckDefault = function(parser){
            parser.get('DIR_CONFIG').should.equal((process.cwd()+'/').replace(/\\+/g,'/'));
            parser.get('DIR_WEBROOT').should.equal(parser.get('DIR_CONFIG'));
           (parser.get('DIR_SOURCE')==null).should.be.true;
           (parser.get('DIR_SOURCE_SUB')==null).should.be.true;
            parser.get('DIR_OUTPUT').should.equal(parser.get('DIR_WEBROOT'));
            parser.get('DIR_OUTPUT_STATIC').should.equal(parser.get('DIR_OUTPUT'));
           (parser.get('DIR_SOURCE_TP')==null).should.be.true;
           (parser.get('DIR_SOURCE_TP_SUB')==null).should.be.true;
           (parser.get('DIR_OUTPUT_TP')==parser.get('DIR_OUTPUT')).should.be.true;
            parser.get('DIR_STATIC').should.equal(parser.get('DIR_WEBROOT')+'res/');
            
           (parser.get('NEJ_DIR')==null).should.be.true;
            parser.get('NEJ_PLATFORM').should.equal('');
            parser.get('NEJ_REGULAR').should.equal('regularjs');
            parser.get('NEJ_PROCESSOR').should.have.properties('text','json','regular','rgl');
            
            parser.get('OPT_IMAGE_FLAG').should.be.false;
            parser.get('OPT_IMAGE_QUALITY').should.equal(100);
           (parser.get('OPT_IMAGE_SPRITE')==null).should.be.true;
            
           (parser.get('MANIFEST_OUTPUT')==null).should.be.true;
           (parser.get('MANIFEST_TEMPLATE')==null).should.be.true;
           (parser.get('MANIFEST_FILTER')==null).should.be.true;
           
            parser.get('ALIAS_DICTIONARY').should.eql({});
            '${abc}'.should.match(parser.get('ALIAS_MATCH'));
            '{abc}'.should.not.match(parser.get('ALIAS_MATCH'));
            
           (parser.get('FILE_FILTER')==null).should.be.true;
            parser.get('FILE_CHARSET').should.equal('utf-8');
            
            parser.get('VERSION_STATIC').should.be.false;
            parser.get('VERSION_MODE').should.equal(0);

            parser.get('DM_STATIC').should.eql([]);
            parser.get('DM_STATIC_RS').should.eql([]);
            parser.get('DM_STATIC_CS').should.eql([]);
            parser.get('DM_STATIC_JS').should.eql([]);
            parser.get('DM_STATIC_MF').should.eql([]);
           (parser.get('DM_STATIC_MR')==null).should.be.true;
            
            parser.get('OBF_LEVEL').should.equal(3);
            parser.get('OBF_COMPATIBLE').should.be.true;
            parser.get('OBF_SOURCE_MAP').should.be.false;
            parser.get('OBF_MAX_CS_INLINE_SIZE').should.equal(50);
            parser.get('OBF_MAX_JS_INLINE_SIZE').should.equal(0);
            parser.get('OBF_NAME_BAGS').should.equal(parser.get('DIR_CONFIG')+'names.json');
            
           (parser.get('CORE_LIST_JS')==null).should.be.true;
           (parser.get('CORE_LIST_CS')==null).should.be.true;
           (parser.get('CORE_MASK_JS')==null).should.be.true;
           (parser.get('CORE_MASK_CS')==null).should.be.true;
            parser.get('CORE_FREQUENCY_JS').should.eql(2);
            parser.get('CORE_FREQUENCY_CS').should.eql(2);
            parser.get('CORE_IGNORE_ENTRY').should.be.false;


            parser.get('X_NOCOMPRESS').should.be.false;
            parser.get('X_KEEP_COMMENT').should.be.false;
            parser.get('X_NOPARSE_FLAG').should.equal(0);
            parser.get('X_NOCORE_FLAG').should.equal(0);
            parser.get('X_AUTO_EXLINK_PATH').should.be.false;
           (parser.get('X_AUTO_EXLINK_PREFIX')==null).should.be.true;
            parser.get('X_INSERT_WRAPPER').should.equal('%s');
            parser.get('X_RELEASE_MODE').should.equal('online');
            parser.get('X_LOGGER_LEVEL').should.equal('ALL');
        };

        it('should be ok when create parser instance',function(){
            var parser = new Parser();
            parser.should.be.an.instanceof(Parser);
        });
        it('should has right default value when no init config',function(){
            _doCheckDefault(new Parser());
        });
        it('should has right default value when init config from property file',function(){
            _doCheckDefault(new Parser({
                config:'./config.ini'
            }));
        });
        it('should has right default value when init config from json file',function(){
            _doCheckDefault(new Parser({
                config:'./config.json'
            }));
        });
    });
    
    describe('#set(key,value)',function(){
        it('should save value what setted',function(){
            var parser = new Parser();
            parser.set('abc','aaaaaa');
            parser.get('abc').should.equal('aaaaaa');
        });
    });
    
    describe('#get(key)',function(){
        it('should return value what setted',function(){
            var parser = new Parser();
            parser.set('abc','aaaaaa');
            parser.get('abc').should.equal('aaaaaa');
           (parser.get('xyz')==null).should.be.true;
        });
    });
    
    describe('config value',function(){
        it('should emit error when config file not exist',function(){
            var ret;
            var parser = new Parser({
                config:'./config.json',
                error:function(event){
                    if (event.field==='DIR_CONFIG'){
                        ret = !0;
                    }
                }
            });
            ret.should.be.true;
        });
        it('should emit error when DIR_WEBROOT not exist',function(){
            var ret;
            var root = './'+(+new Date);
            var parser = new Parser({
                config:{
                    DIR_WEBROOT:root
                },
                error:function(event){
                    if (event.field==='DIR_WEBROOT'){
                        ret = !0;
                    }
                }
            });
            require('fs').rmdirSync(root);
            ret.should.be.true;
        });
        it('should emit error when no input',function(){
            var ret;
            var parser = new Parser({
                error:function(event){
                    var test = [
                        'DIR_SOURCE','DIR_SOURCE_SUB',
                        'DIR_SOURCE_TP','DIR_SOURCE_TP_SUB'
                    ];
                    if (test.should.eql(event.field)){
                        ret = !0;
                    }
                }
            });
            ret.should.be.true;
        });
        it('should compatible with ALIAS_START_TAG/ALIAS_END_TAG',function(){
            var parser = new Parser({
                config:{
                    ALIAS_START_TAG:'{{',
                    ALIAS_END_TAG:'}}'
                }
            });
            var v = '{{config_lib_root}}define.js?pro={{pro_root}}'.replace(
                parser.get('ALIAS_MATCH'),function($1,$2){
                    return $2;
                }
            );
            v.should.equal('config_lib_rootdefine.js?pro=pro_root');
        });
        it('should be ok when set ALIAS_MATCH with type of string/regexp',function(){
            // string
            var parser = new Parser({
                config:{
                    ALIAS_MATCH : '\\{\\{(.*?)\\}\\}'
                }
            });
            var v = '{{config_lib_root}}define.js?pro={{pro_root}}'.replace(
                parser.get('ALIAS_MATCH'),function($1,$2){
                    return $2;
                }
            );
            v.should.equal('config_lib_rootdefine.js?pro=pro_root');
            // regexp
            var parser = new Parser({
                config:{
                    ALIAS_MATCH:/\{\{(.*?)\}\}/gi
                }
            });
            var v = '{{config_lib_root}}define.js?pro={{pro_root}}'.replace(
                parser.get('ALIAS_MATCH'),function($1,$2){
                    return $2;
                }
            );
            v.should.equal('config_lib_rootdefine.js?pro=pro_root');
        });
        var _doMatchFile = function(reg){
            '/home/user/app/a.html'.should.match(reg);
            '/home/user/app/a.ftl'.should.match(reg);
            '/home/user/app/a.vm'.should.match(reg);
            '/home/user/app/a.js'.should.not.match(reg);
            '/home/user/app/a.css'.should.not.match(reg);
        };
        it('should compatible with FILE_SUFFIXE',function(){
            var parser = new Parser({
                config:{
                    FILE_SUFFIXE:'html|ftl|vm'
                }
            });
            _doMatchFile(parser.get('FILE_FILTER'));
        });
        it('should be ok when set FILE_FILTER with type of string/regexp',function(){
            var parser = new Parser({
                config:{
                    FILE_FILTER:'\\.(?:html|ftl|vm)$'
                }
            });
            _doMatchFile(parser.get('FILE_FILTER'));
            var parser = new Parser({
                config:{
                    FILE_FILTER:/\.(?:html|ftl|vm)$/i
                }
            });
            _doMatchFile(parser.get('FILE_FILTER'));
        });
        it('should compatible with NAME_SUFFIX',function(){
            var parser = new Parser({
                config:{
                    NAME_SUFFIX:'v2'
                }
            });
            parser.get('VERSION_MODE').should.equal('[FILENAME]_v2');
        });
        it('should compatible with RAND_VERSION',function(){
            var parser = new Parser({
                config:{
                    RAND_VERSION:true
                }
            });
            parser.get('VERSION_MODE').should.equal(1);
        });
        it('should compatible with STATIC_VERSION',function(){
            var parser = new Parser({
                config:{
                    STATIC_VERSION:true
                }
            });
            parser.get('VERSION_STATIC').should.be.true;
        });
        it('should compatible with X_NOCORE_STYLE/X_NOCORE_SCRIPT',function(){
            var parser = new Parser({
                config:{
                    X_NOCORE_STYLE:true
                }
            });
            parser.get('X_NOCORE_FLAG').should.equal(1);
            var parser = new Parser({
                config:{
                    X_NOCORE_SCRIPT:true
                }
            });
            parser.get('X_NOCORE_FLAG').should.equal(2);
            var parser = new Parser({
                config:{
                    X_NOCORE_STYLE:true,
                    X_NOCORE_SCRIPT:true
                }
            });
            parser.get('X_NOCORE_FLAG').should.equal(3);
        });
        it('should compatible with X_MODULE_WRAPPER/X_SCRIPT_WRAPPER',function(){
            var parser = new Parser({
                config:{
                    X_MODULE_WRAPPER:'<#noparse>%s</#noparse>'
                }
            });
            parser.get('X_INSERT_WRAPPER').should.equal('<#noparse>%s</#noparse>');
            var parser = new Parser({
                config:{
                    X_SCRIPT_WRAPPER:'<#noparse>%s</#noparse>'
                }
            });
            parser.get('X_INSERT_WRAPPER').should.equal('<#noparse>%s</#noparse>');
        });
    });
});
