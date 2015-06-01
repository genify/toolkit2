/*
 * NEJ Patcher Parser
 * @module   script/nej/patcher
 * @author   genify(caijf@corp.netease.com)
 */
// nej patch parser
// expression     platform expression
// dependency     dependency list
// source         source code
var Patcher = module.exports =
    require('../../util/klass.js').create();
var pro = Patcher.extend(require('../../util/event.js'));



var PatchParser = function(config){
    _Abstract.apply(this,arguments);

    // serialize injector list
    var _doSerializeInjector = function(list){
        var ret = [];
        list.forEach(function(uri){
            ret.push(_fs.key(uri));
        });
        return ret.join(',');
    };
    // update config
    this.update = function(config){
        this.exp = _doParseExpression(
            config.expression
        );
        this.source = config.source||'';
        this.dependency = config.dependency||[];
    };
    // parse patch information
    this.parse = function(config){
        // expression illegal
        if (!this.exp){
            this.isFitPlatform = !1;
            return;
        }
        // complete dependency list
        this.dependency.forEach(function(uri,index,list){
            list[index] = _completeURI(uri,config);
        });
        // parse platform
        this.platform = _doCheckPlatform.call(
            config.nejPlatform
        );
        // parse platform support
        _doParseSupport.call(this);
    };
    // get patch source
    // platformName    platform argument name
    this.getSource = function(config){
        // only for dependency
        // NEJ.path('TR<=4.0',['./3rd/json.js']);
        if (!this.source){
            return '';
        }
        // injector list
        var arr = _doSerializeInjector(this.dependency);
        arr.unshift(_fs.key(),this.source);
        return util.format(
            'if(%s){\nI$(%s);\n}\n',
            _doGenCondition.call(
                this,config.platformName
            ),
            arr.join(',')
        );
    };
    // dump dependency list
    this.getDependencies = function(){
        return this.dependency;
    };
    // update config
    if (!!config){
        this.update(config);
    }
};
util.inherits(PatchParser,_Abstract);
