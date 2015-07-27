/**
 * tab切换
 * author hale(hzhayue@corp.netease.com)
 */

define([
    'base/event',
    'base/element',
    'base/util',
    'text!./databox.html',
    'pro/base/util',
    'pro/widget/BaseComponent',
    'pro/base/config'
], function(_v,_e, _u, tpl, ut, BaseComponent, config) {
    var DataBox = BaseComponent.extend({
        template: tpl,
        watchedAttr: ['current'],
        current: 0,
        config: function(data) {
            ut.extend(data, {
                current: 0,
                importTypeList:window.importTypeList,
                storages: window.storages
            });

            this.$watch(this.watchedAttr, function(val) {
                if (this.shouldUpdateList()) {
                    setTimeout(function() {
                        _v._$dispatchEvent('tabs', 'change');
                    }, 100);
                    this.current = val;

                    // 清除form数据
                    _e._$get('searchForm').reset();
                }
            });
        },
        init: function() {
            this.supr();
        },
        __onTotalChange:function(val) {
            // if (this.data.current === 1) {
            _e._$get('count').innerHTML = val;
            // }
        },
        //@ 自雷修改
        shouldUpdateList: function(data) {
            if (this.current === this.data.current) {
                return false;
            }
            return true;
        },
        exportFile:function() {
            var _form = nej.ut._$$WebForm._$allocate({  form:'searchForm' }),
                _data = _form._$data();
            ut.filterNoneData(_data);
            var _config = {
                data:_data,
                onload:function(json) {
                    if ( json.success != true ) {
                        alert(json.message);
                        return;
                    } 
                    window.location.href = json.data.excel;
                }
            }

            this.$request(this.data.exportUrl, _config);
        }
    });

    return DataBox;

});