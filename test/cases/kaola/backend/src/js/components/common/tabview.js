/**
 * tab切换
 * author hale(hzhayue@corp.netease.com)
 */

define([
    'base/event',
    'base/element',
    'base/util',
    'text!./tabview.html',
    'pro/base/util',
    'pro/widget/BaseComponent',
    'pro/base/config',
], function(_v,_e, _u, tpl, ut, BaseComponent, config) {
    var TabView = BaseComponent.extend({
        template: tpl,
        watchedAttr: ['current'],
        current: 0,
        config: function(data) {
            ut.extend(data, {
                current: 0
            });

            this.$watch(this.watchedAttr, function(val) {
                this.current = val;

                // _v._$dispatchEvent('tabs', 'change');    
                this.$emit('tabchange',val);

                // 清除form数据
                var _form = _e._$get('searchForm');;
                _form && _form.reset();
            });
        },
        init: function() {
            this.supr();
        }
    });

    return TabView;

});