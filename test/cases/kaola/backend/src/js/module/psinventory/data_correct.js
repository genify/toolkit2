// copy from mock.js by chenkan

NEJ.define('{pro}widget/module.js', ['{pro}system.js'],
    function () {
        var _p = NEJ.P('haitao.bw'), // widget namespace
            __proMModule,
            _funcname = ['stockTakeProfit', 'stockTakeLoss', 'ladingOutStock'];  // class prototype

        _p._$$MModule = NEJ.C();
        __proMModule = _p._$$MModule.prototype;

        __proMModule.__init = function () {
            var _ntmp = nej.e._$getByClassName(document.body, 'item');

            for (var i = 0, l = _ntmp.length; i < l; i++) {
                var _node_list = _ntmp[i].children;
                nej.v._$addEvent(_node_list[8], 'click', this.__doClickBtn._$bind(this, _node_list, i));
            }
        };

        __proMModule.__doClickBtn = function (_valueElem, _st) {
            var _value1 = _valueElem[1].value || '';
            var _value2 = _valueElem[2].value || '';
            var _value3 = _valueElem[3].value || '';
            var _value4 = _valueElem[4].value || '';
            var _value5 = _valueElem[5].value || '';
            var _value6 = _valueElem[6].value || '';
            var _value7 = _valueElem[7].value || '';

            nej.j._$haitaoDWR('InvoicingDataCorrectBean', _funcname[_st], [_value1, _value2, _value3, _value4, _value5, _value6, _value7], this.__cbMockDate._$bind(this, _st));
        };

        __proMModule.__cbMockDate = function (_st, _data) {
            alert('it works');
        };

        new _p._$$MModule();

    });
