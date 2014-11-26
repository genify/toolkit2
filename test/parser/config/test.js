var Parser = require('../../../lib/parser/config.js'),
    should = require('should');

describe('parser/config',function(){
    
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
        parser.get('NEJ_PLATFORM').should.equal('td|wk|gk');
        
        parser.get('OPT_IMAGE_FLAG').should.be.false;
        parser.get('OPT_IMAGE_QUALITY').should.equal(100);
        
       (parser.get('MANIFEST_OUTPUT')==null).should.be.true;
       (parser.get('MANIFEST_TEMPLATE')==null).should.be.true;
       (parser.get('MANIFEST_FILTER')==null).should.be.true;
       
        parser.get('ALIAS_START_TAG').should.equal('${');
        parser.get('ALIAS_END_TAG').should.equal('}');
        parser.get('ALIAS_DICTIONARY').should.eql({});
        '${abc}'.should.match(parser.get('ALIAS_REG'));
        '{abc}'.should.not.match(parser.get('ALIAS_REG'));
        
       (parser.get('FILE_FILTER')==null).should.be.true;
        parser.get('FILE_CHARSET').should.equal('utf-8');
        
        parser.get('VERSION_STATIC').should.be.false;
        parser.get('VERSION_MODE').should.equal(0);
        parser.get('VERSION_MERGE').should.equal(0);
        
       (parser.get('DM_STATIC')==null).should.be.true;
       (parser.get('DM_STATIC_RS')==parser.get('DM_STATIC')).should.be.true;
       (parser.get('DM_STATIC_CS')==parser.get('DM_STATIC')).should.be.true;
       (parser.get('DM_STATIC_JS')==parser.get('DM_STATIC')).should.be.true;
       (parser.get('DM_STATIC_MF')==parser.get('DM_STATIC')).should.be.true;
       (parser.get('DM_STATIC_MR')==null).should.be.true;
        
        parser.get('OBF_LEVEL').should.equal(3);
        parser.get('OBF_COMPATIBLE').should.be.true;
        parser.get('OBF_SOURCE_MAP').should.be.false;
        parser.get('OBF_MAX_CS_INLINE_SIZE').should.equal(50);
        parser.get('OBF_MAX_JS_INLINE_SIZE').should.equal(0);
        
        (parser.get('CORE_LIST_JS')==null).should.be.true;
        (parser.get('CORE_LIST_CS')==null).should.be.true;
        (parser.get('CORE_MASK_JS')==null).should.be.true;
        (parser.get('CORE_MASK_CS')==null).should.be.true;
        
        parser.get('X_NOCOMPRESS').should.be.false;
        parser.get('X_NOPARSE_FLAG').should.equal(0);
        parser.get('X_NOCORE_FLAG').should.equal(0);
        parser.get('X_AUTO_EXLINK_PATH').should.be.false;
       (parser.get('X_AUTO_EXLINK_PREFIX')==null).should.be.true;
        parser.get('X_INSERT_WRAPPER').should.equal('%s');
        parser.get('X_RELEASE_MODE').should.equal('online');
        parser.get('X_LOGGER_LEVEL').should.equal('ALL');
    };
    
    describe('new Parser',function(){
        it('should be ok when create parser instance',function(){
            var parser = new Parser();
            parser.should.be.an.instanceof(Parser);
        });
        it('should has right default value when no init config',function(){
            _doCheckDefault(new Parser());
        });
        it('should has right default value when init config from property file',function(){
            _doCheckDefault(new Parser('./config.ini'));
        });
        it('should has right default value when init config from json file',function(){
            _doCheckDefault(new Parser('./config.json'));
        });
    });
    
});
