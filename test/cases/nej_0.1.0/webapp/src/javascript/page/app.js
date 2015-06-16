NEJ.define([
    'util/dispatcher/dispatcher',
    'json!./rules.json',
    'json!./modules.json'
],function(dsp,rules,modules){
    /* start up dispatcher */
    dsp._$startup({
        rules:rules,
        modules:modules,
        onbeforechange:function(_options){
            var _umi = _options.path||'';
            if (!!_umi&&
                _umi.indexOf('/?')<0&&
                _umi.indexOf('/m')<0)
                _options.path = '/m'+_umi;
        }
    });
});