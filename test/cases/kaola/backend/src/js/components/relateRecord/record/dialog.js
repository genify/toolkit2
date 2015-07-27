/**
 * 备案商品弹框
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
    var RecordModal = Modal.extend({
        content: tpl,
        config: function(data) {
            ut.extend(data, {
                title: '完成备案',
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
            if ( this.data.code == '' ) {
                this.data.msg = '请填写料号';
                return;
            }

            var _self   = this,
                _url    = '/backend/relateRecord/recordNewGoods',
                _config = {
                    data:{'newSkuId':id},
                    onload:function(json) {
                        _self.$emit('success', this.data.id);
                        setTimeout(function() {
                            _self.close();
                            window.location.reload();
                        }, 100);
                    },
                    onerror:function() {
                        this.data.msg = '操作失败，请重试！';
                    }
                };
            if ( this.data.isRelated/1 == 0) {
                _config.data.productSkuCode = this.data.code;
            }
            this.$request(_url, _config);
        }
    })


    return RecordModal;
});