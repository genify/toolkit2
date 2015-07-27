/**
 * 订单销售数据列表
 * author hale(hzhayue@corp.netease.com)
 */

define([
    'base/element',
    'base/util',
    'base/event',
    'text!./list.html',
    'pro/base/util',
    '../ListComponent.js',
    'pro/base/config',
    'pro/components/pager/pager'
], function(_e,_u,_v, tpl, ut, ListComponent,config) {
    var List = ListComponent.extend({
        template: tpl,
        initial:false, // 第一次初始化不需要请求list
        url:'/backend/stat/order/search',
        config: function(data) {
            ut.extend(data, {
                total: 1,
                current: 1,
                limit: 50,
                orders:[],
                summary:null
            });

            this.$watch('current', function(){
                if ( this.shouldUpdateList() ) {
                    this.__getList();
                }
                
            }) 
        },
        shouldUpdateList:function() {
            var flag = this.initial;
            this.initial = true;
            return flag;
        },
        xdrOption: function() {
            return {
                method: "post",
                norest:true  // 如果使用post请求，想以formdata的形式传数据，就要设置norest：true，否则数据在request payload，可能造成服务端获取不到数据
            };
        },
        init: function() {
            this.supr();
        },
        __bodyResolver:function(json) {
            if ( json.code != 200 ) {
                this.data.summary = null;
                this.data.orders.length = 0;
                this.data.total = 0;
            } else {
                this.data.summary = json.saleTotal;
                this.data.orders.length = 0;
                this.data.orders.push.apply(this.data.orders, json.orders);
                this.data.total = json.saleTotal.orderCount;
            }
        }
    });
    List.filter('paymethod', function(val) {
        var methods = ['其他','网易宝跨境','支付宝跨境','网易宝国内','支付宝国内'];
        return methods[val || 0] || '';
    });
    List.filter('importtype', function(val) {
        var types = ['直邮','保税','海淘'];
        return types[val || 0] || '';
    });
    List.filter('state', function(val) {
        var states = ['','待发货','已发货','交易完成','交易失败','','交易失败'];
        return states[val || 0] ||'';
    });
    List.filter('format', function(val, format) {
        if ( !val ) return '';
        return _u._$format(val, format);
    });

    return List;

});