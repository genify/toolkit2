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
    var RelateModal = Modal.extend({
        // 默认对列表数据做合并，减少节点回收
        content: tpl,
        isCheckBarcode:true,
        config: function(data) {
            ut.extend(data, {
                title: '关联商品',
                width: 340,
                product:null, // 当前的product
                msg:'',// 提示信息
                sku:{
                    skuDesc:'',//根据选择的sku， 显示的skuCode
                    skuCode:'',
                    skuId:''
                },
                step:1,
                newSkuId:window.location.search.split('=')[1] //当前新品的skuId
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
            if ( !this.data.product ) {
                this.data.msg = '请至少选择一个商品';
                return;
            }
            if ( this.data.step == 1 ) { 
                this.data.step = 2;  
                this.data.msg = '';
            } else if ( this.data.step == 2 ) {
                this.__relateNewGoods();
            }   
        },
        __relateNewGoods:function() {
            var _url = '/backend/relateRecord/relateNewGoods',
                _option = {
                    data:{'skuId':this.data.sku.skuId, 'newSkuId':this.data.newSkuId, 'isCheckBarcode':this.isCheckBarcode},
                    onload:function(json) {
                        var code = json.code;
                        if ( code == 100 ) { 
                            //失败， 只是提示， 下一次可以继续提交；
                            this.isCheckBarcode = false;
                        } else if ( code == 200 ){
                            // 成功
                            this.close();
                            window.location.reload();
                        } else {
                            // 失败
                            this.data.step = 1;
                        }
                        this.data.msg = json.message;

                    }
                };
            this.$request(_url,_option);
        },
        queryById:function() {
            this.data.msg = '';
            var _url = '/backend/relateRecord/searchNewGoods',
                _option = {
                    data: {goodsId: this.data.id},
                    onload: function(json){
                        var result = json.data.goods;
                        if ( result ) {
                            this.data.product = result;
                            this.data.sku = result.skuList[0]; 
                        } else {
                            this.data.msg = '未找到此id的相关信息';
                        }
                    },
                    onerror: function(json){
                      // @TODO: remove
                      this.data.msg = '系统出错，请稍后再试';
                    }
                };
            this.$request(_url,_option);
        },
        updateSkuCode:function(sku) {
            this.data.sku = sku;
        }
    })


    return RelateModal;
});