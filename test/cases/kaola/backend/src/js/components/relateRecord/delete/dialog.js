/**
 * 关联商品弹框
 * author hale(hzhayue@corp.netease.com)
 */

define([
    'base/event',
    'base/util',
    'text!./dialog.html',
    'pro/base/util',
    'pro/components/modal/modal',
    'pro/base/config',
], function(_v, _u, tpl, ut, Modal, config) {
    var DelModal = Modal.extend({
        content: tpl,
        config: function(data) {
            ut.extend(data, {
                title: '删除提示',
                width: 340,
                msg:''
            });
        },
        init: function() {
            this.supr();
        },
        close: function(item) {
            this.$emit('close');
            this.destroy();
        },
        confirm: function() {
            if ( this.data.canDel ) {
                var _self   = this,
                    _url    = '/backend/relateRecord/deleteNewGoods',
                    _config = {
                        data:{'newSkuId':this.data.id},
                        onload:function(json) {
                            _self.$emit('success', this.data.id);
                            setTimeout(function() {
                                _self.close();
                            }, 100);
                        },
                        onerror:function() {
                            this.data.msg = '删除失败，请重试！';
                        }
                    };

                this.$request(_url, _config);
            } else {
                this.close();
            }
        }
    })


    return DelModal;
});