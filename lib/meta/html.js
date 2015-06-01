/*
 * Html Resource Class
 * @module   meta/html
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
   _util     = require('../util/util.js'),
   _tag      = require('../parser/tag.js'),
   _Resource = require('./resource.js');
// html resource parser
// root             page input root
// isTemplate       is server template file
var ResHtml = module.exports = function(config,events){
    _Resource.apply(this,arguments);
    // nej deploy comment state
    var STATE_NULL       = 0,
        STATE_SCRIPT     = 1,
        STATE_MODULE     = 2,
        STATE_IGNORE     = 3,
        STATE_NOPARSE    = 4,
        STATE_VERSION    = 5,
        STATE_MANIFEST   = 6;
    // default config
    var DEFAULT_CONFIG = {
        charset               : 'utf-8',
        ignoreMode            : 'online',
        keepComment           : !1,
        noCompress            : !1,
        noCoreFlag            : 0,
        notParseInlineStyle  : !1,
        notParseInlineScript : !1
    };
    // private variable
    var _gState,_gOption,_gParser,
        _gStyles,_gStylePoint,_gStyleConfig,
        _gScripts,_gScriptPoint,_gScriptConfig,_gNEJConfig,
        _gModules,_gModuleConfig,_gTemplates,_gTemplatePoint,
        _gIgnorePoint,_gVersionPoint,_gManifestPoint,_gNoCompressPoint;
    // reset private variable
    var _doReset = function(options){
        _gState  = STATE_NULL;
        _gOption = _util.fetch(
            DEFAULT_CONFIG,options
        );
        _gParser          = null;
        _gNoCompressPoint = [-1,-1];
    };
    // parse html content
    this._parseContent = function(file,content,config){
        _doReset.call(this,config);
        // parse html content
        var logger = _util.merge(
            this._logger, {
                tag: _onTag.bind(this),
                text: _onText.bind(this),
                comment: _onComment.bind(this),
                style: _onResTag.bind(this, _onStyle),
                script: _onResTag.bind(this, _onScript),
                textarea: _onResTag.bind(this, _onTextarea),
                instruction: _onInstruction.bind(this)
            }
        );
        _gParser = new _tag.Parser(
            content, logger
        );
        return _gParser;
    };
    // output config
    var _gOutputConfig;
    this.beginZip = function(config){
        _gOutputConfig = _util.merge(config);
    };
    // hasCore      core file in page
    // fileList     css file list after core split
    // outputFile   css file output path
    var _gStyleOutput;
    // zip style
    this.zipStyle = function(config){
        _gStyleOutput = {
            hasCore:_gStyleConfig.core,
            fileList:this.getDependencies({
                resType:'cs'
            })
        };
        // check core list
        var core = config.core;
        if (!core||!core.length){
            _gStyleOutput.hasCore = !1;
        }
        // split core file
        if (_gStyleOutput.hasCore==null){
            _gStyleOutput.hasCore = !1;
            var list = _gStyleOutput.fileList;
            for(var i=list.length--,index;i>=0;i--){
                index = core.indexOf(list[i]);
                if (index>=0){
                    list.splice(index,1);
                    _gStyleOutput.hasCore = !0;
                }
            }
        }
        // generate output path
        if (_gStyleOutput.fileList.length>0){

        }
    };
    // zip script
    this.zipScript = function(config){

    };
    // zip template
    this.zipTemplate = function(config){

    };
    // zip module
    this.zipModule = function(config){

    };
    // end zip
    this.endZip = function(){

    };
    // output content
    this.output = function(config){

    };

    // init config
    config = config||{};
    this.root = config.root;
    this.isTemplate = !!config.isTemplate;
};
util.inherits(ResHtml,_Resource);