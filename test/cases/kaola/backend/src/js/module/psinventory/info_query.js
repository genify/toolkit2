NEJ.define('{pro}widget/module.js', ['{pro}system.js'],
    function () {
        var _p = NEJ.P('haitao.bw'),
            __proMModule;

        _p._$$MModule = NEJ.C();
        __proMModule = _p._$$MModule.prototype;

        __proMModule.__init = function () {
            var getOrderIdBtn = nej.e._$get("get_order_id");
            nej.v._$addEvent(getOrderIdBtn, 'click', this.__doClickBtn._$bind(this));
        };

        __proMModule.__doClickBtn = function () {
            nej.j._$haitaoDWR('InvoicingHelperBean', 'getOrderIdByGorderId', [nej.e._$get("gorder_id").value], this.__cb._$bind(this));
        };

        __proMModule.__cb = function (_data) {
            nej.e._$get("order_id").value = _data;
        };

        new _p._$$MModule();
    });
