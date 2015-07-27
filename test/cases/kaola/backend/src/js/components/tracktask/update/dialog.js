/**
 * 更新跟单任务
 * author hale(hzhayue@corp.netease.com)
 */

define([
    'base/event',
    'base/util',
    'base/global',
    'pro/base/util',
    'pro/components/modal/modal',
    'pro/base/config',
    'pro/widget/form'
], function(_v, _u, _g,ut, Modal, config, _form) {
    var UpdateModal = Modal.extend({
        // content: tpl,
        config: function(data) {
            ut.extend(data, {
                title: '更新信息',
                width: 340,
                msg:'',
                name:'updateForm'
            });
        },
        __webForm:null,
        init: function() {
            this.supr();
        },
        close: function(item) {
            this.$emit('close');
            this.destroy();
        },
        confirm: function() {
            this.__webForm = this.__webForm || _form._$$WebForm._$allocate({form:this.data.name, onsubmit:function() {

            }});
            var _data = this.__webForm._$data();

            // _g.X(_data, this.data.taskId);
            _data.taskId = this.data.taskId;
            _data.auditId = this.data.auditId;

            var _self = this;
            this.$request(this.data.url, {
                data:_data,
                onload:function(json) {
                    _self.$emit('success',_data, json);
                    setTimeout(function() {
                        _self.close();
                    }, 100);
                },
                onerror:function(json) {
                    this.data.msg = '更新失败';
                }
            });
        }
    })


    return UpdateModal;
});