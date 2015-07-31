/*
 * script exporter
 * @module   export
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _io   = require('./util/io.js'),
   _fs   = require('./util/file.js'),
   _util = require('./util/util.js'),
   _log  = require('./util/logger.js'),
   _nej  = require('./script/nej/util.js');
// default config
var DEFAULT = {
    charset:'utf-8',
    output:'output.js',
    webRoot:'/',
    // obfuscate
    level:0,
    bags:'',
    codeWrap:'',
    compatible:!0,
    dropconsole:!1
};
// script exporter
// file  - file relative to
// list  - script file list
var Exporter = module.exports =
    require('./util/klass.js').create();
var pro = Exporter.extend(require('./util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    config = config||{};
    this._super(config);
    this._logConfig = {
        info:_log.log.bind(_log,'info'),
        warn:_log.log.bind(_log,'warn'),
        debug:_log.log.bind(_log,'debug'),
        error:function(event){
            _log.log('error',event);
            process.abort();
        }
    };
    this._options = _util.fetch(
        DEFAULT,config
    );
    // check nej define.js
    var list = config.list||[];
    // format export list
    var ret;
    _log.logger.info('format %j',list);
    list.some(function(uri,index,list){
        if (_nej.isNEJDefine(uri||'')){
            _log.logger.debug('see uri as nej define.js %s',uri);
            list.splice(index,1);
            ret = [
                {defined:!0,uri:uri},
                {text:util.format('NEJ.define(%j);',list)}
            ];
            return !0;
        }
    });
    ret = ret||list;
    _log.logger.info('export %j',ret);
    // parse script list
    this._explorer = new (require('./explorer/script.js'))(
        _util.merge(this._logConfig,{
            file:config.file,
            list:ret
        })
    );
    this._explorer.parse(this._options);
    _io.onload(this._afterScriptLoad.bind(this));
};
/**
 * after script loaded
 * @private
 * @return {Void}
 */
pro._afterScriptLoad = function(){
    var map = _nej.formatDependencies();
    _log.logger.debug('dependency map %j',map);
    _log.logger.info('compress resources');
    var config = this._options,
        bags = config.bags,
        list = this._explorer.getDependencies(),
        content = util.format(
            config.codeWrap||'%s',
            _io.fill(list)
        ),
        script = new (require('./adapter/script.js'))(
            _util.merge(this._logConfig,{
                map:{'output.js':content}
            })
        );
    if (!!bags){
        config.bags = _util.file2json(bags);
    }
    var ret = script.parse(config),
        content = ret.code['output.js'];
    if (!!bags){
        _log.logger.info('output name bags');
        _fs.write(bags,JSON.stringify(ret.bags||{},null,4));
    }
    var output = config.output;
    _log.logger.info('output script %s',output);
    _fs.write(output,content,config.charset);
    this.emit('done');
};