/**
 * 分账对账 订单销售统计
 * Created by zmm on 22/12/14.
 */

NEJ.define([
        'base/element',
        '{lib}util/chain/chainable.js',
        '{pro}widget/calendar/calendar.js',
        '{pro}widget/window/warningWin.js',
        '{pro}widget/animation.js',
        'pro/widget/module',
        '{pro}components/ordersale/list.js'
    ],
    function(_e,_q, _cald, _win, _ani,_sys, OrderSaleList, _p) {
        _p._$$OrderSaleStatistics = NEJ.C();
        var _pro = _p._$$OrderSaleStatistics._$extend(haitao.bw._$$MModule);

        _pro.__list = null;

        /**
         * 初始化，绑定事件
         * @private
         */
        _pro.__init = function () {
            var _calendar = haitao.bw._$$Calendar._$allocate({});

            //初始化日历
            var _fromEle = nej.e._$get('J-starttime'),
                _toEle = nej.e._$get('J-endtime');
            nej.v._$addEvent(_fromEle, 'click', function (_event) {
                _calendar._$showCalendar(_event, _fromEle, false);
            }._$bind(this));
            nej.v._$addEvent(_toEle, 'click', function(_event) {
                _calendar._$showCalendar(_event, _toEle, false);
            }._$bind(this));

            var _this = this;
            _q('button[name="searchBtn"]')._$on('click', function(){
                _this.__onSubmit();
            });
            _q('button[name="exportBtn"]')._$on('click', function(){
                _this.__onExportClick();
            });

            this.__onSubmit();

        };
        _pro.__checkValidity = function() {
            var _fromEle = nej.e._$get('J-starttime'),
                _toEle = nej.e._$get('J-endtime');
            var _from = Date.parse(_fromEle.value),
                _end = Date.parse(_toEle.value);
            if (_from > _end) {
                var _dialog = haitao.bw._$$WarningWindow._$allocate({
                    parent: document.body,
                    content: '<p style="padding: 20px;">结束时间比开始时间还早，再检查下吧~</p>',
                    hideOnok: true,
                    mask: 'w-winmask'
                });
                _dialog._$show();
                return false;
            }
            return true;
        }

        /**
         * 点击搜索
         * @private
         */
        _pro.__onSubmit = function () {
            if ( !this.__checkValidity() ) {
                return;
            }

            var _data = this.__getParam();
            if ( !this.__list ) {
                this.__list = new OrderSaleList({data:{condition:_data}}).$inject(_e._$get('j-databox'));
            } else {
                this.__list.refresh(_data);
            }
        };
        /**
         * 点击导出数据
         * @private
         */
        _pro.__onExportClick = function () {
            var _fromEle = nej.e._$get('J-starttime'),
                _toEle = nej.e._$get('J-endtime');
            var _from = Date.parse(_fromEle.value),
                _end = Date.parse(_toEle.value);
            if (_from > _end) {
                var _dialog = haitao.bw._$$WarningWindow._$allocate({
                    parent: document.body,
                    content: '<p style="padding: 20px;">结束时间比开始时间还早，再检查下吧~</p>',
                    hideOnok: true,
                    mask: 'w-winmask'
                });
                _dialog._$show();
                return;
            }

            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                title: "提示",
                parent: document.body,
                content: '<div style="min-width: 400px; padding: 20px;">\
                            <p style="margin-bottom: 10px">生成报表须一些时间，请输入你的邮箱地址，稍后发送邮件</p>\
                            <input type="text" placeholder="请输入邮箱地址" class="expemail zwarn"/>\
                            <span class="errorInfo zwarn"></span>\
                          </div>',
                hideOnok: false,
                mask: 'w-winmask',
                onok: function(_node){
                    var _nodes = nej.e._$getByClassName(_node, 'zwarn'),
                        _emailNode = _nodes[0],
                        _errorNode = _nodes[1];

                    var _email = _emailNode.value;
                    var _res = eval("/^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/").test(_emailNode.value);
                    if (!_res) {
                        _errorNode.innerHTML="邮箱地址有问题呀 -。=";
                        return;
                    }
                    nej.j._$haitaoDWR(
                        'OrderSaleStatisticsBean',
                        'exportSales',
                        _pro.__getParamStrs(_email),
                        function(_result){
                            console.log("点击导出成功");
                        }
                    );
                    _dialog._$hide();
                }
            });
            _dialog._$show();


        };
        /**
         * 获取 url地址
         * @param isExport  是否导出数据
         * @returns {string}
         * @private
         */
        _pro.__getParam = function () {
            var _paymethod = _q('select[name="paymethod"]')._$val(),
                _state = _q('select[name="state"]')._$val(),
                _refund = _q('select[name="refund"]')._$val(),
                _import = _q('select[name="import"]')._$val(),
                _logistic = _q('select[name="logistic"]')._$val(),
                _storage = _q('select[name="storage"]')._$val(),
                _timetype = _q('select[name="timetype"]')._$val(),
                _starttime = _q('#J-starttime')._$val(),
                _endtime = _q('#J-endtime')._$val(),
                _order = _q('input[name="order"]')._$val();
            return {
                'paymethod':_paymethod,
                'state':_state,
                'refund':_refund,
                'import':_import,
                'logistic':_logistic,
                'storage':_storage,
                'timetype':_timetype,
                'starttime':_starttime,
                'endtime':_endtime,
                'order':_order
            }
        }

        _pro.__getParamStrs = function (email) {
            var _paymethod = _q('select[name="paymethod"]')._$val(),
                _state = _q('select[name="state"]')._$val(),
                _refund = _q('select[name="refund"]')._$val(),
                _import = _q('select[name="import"]')._$val(),
                _logistic = _q('select[name="logistic"]')._$val(),
                _storage = _q('select[name="storage"]')._$val(),
                _timetype = _q('select[name="timetype"]')._$val(),
                _starttime = _q('#J-starttime')._$val(),
                _endtime = _q('#J-endtime')._$val(),
                _order = _q('input[name="order"]')._$val();
            return [_paymethod, _state, _refund, _logistic, _storage, _import, _order, _timetype, _starttime, _endtime, email];
        }

        new _p._$$OrderSaleStatistics();
    });