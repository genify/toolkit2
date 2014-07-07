var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _t = _('nej.ut');
    window.dispatcher = _t._$$Dispatcher._$getInstance({
        rules:{
            rewrite:{
                '404':'/m/a/a0/',
                '/m/a/a0/':'/'
            },
            title:{
                '/m/b/':'Module B',
                '/m/c/':'Module C'
            }
        },
        modules:{
            '/':'index/ui.html',
            
            '/m':'index/m.html',
            '/m/a':'index/a.html',
            '/m/b/':'index/b.html',
            '/m/c/':'index/c.html',
            '/m/d/':'index/d.html',
            
            '/m/a/a0/':{module:'index/a.a0.html',title:'Module A-A0',clazz:'g-aa0'},
            '/m/a/a1/':{module:'index/a.a1.html',title:'Module A-A1',clazz:'g-aa1'},
            '/m/a/a2/':{module:'index/a.a2.html',title:'Module A-A2',clazz:'g-aa2'},
            
            '/?/b/b0/':'index/b.b0.html',
            '/?/b/b1/':'index/b.b1.html',
            '/?/b/b2/':'index/b.b2.html',
            
            '/?/d/d0/':{module:'index/d.d0.html',title:'Module D-D0',gid:'d'},
            '/?/d/d1/':{module:'index/d.d1.html',title:'Module D-D1',gid:'d'},
            '/?/d/d2/':{module:'index/d.d2.html',title:'Module D-D2',gid:'d'}
        }
    });
    _e._$parseTemplate('template-box');
    dispatcher._$active();
};
define(['{lib}util/template/tpl.js'
       ,'{lib}util/dispatcher/dispatcher.2.js'],f);
