/**
 * 收入查询:{/backend/income/getIncomeList}
 * Created by zmm on 7/1/15.
 */
NEJ.define([
    '{lib}util/chain/chainable.js',
    '{pro}widget/calendar/calendar.js',
    '{pro}widget/window/warningWin.js',
    'pro/widget/module'
],
    function(_q, _cald, _win, _sys, _p) {
        _p._$$IncomeReconciliation = NEJ.C();
        var _pro = _p._$$IncomeReconciliation._$extend(haitao.bw._$$MModule);
        /**
         * 初始化，绑定事件
         * @private
         */
        _pro.__init = function () {
            var _calendar = haitao.bw._$$Calendar._$allocate({});

            //初始化日历
            var _fromEle = nej.e._$get('starttime'),
                _toEle = nej.e._$get('endtime');

            nej.v._$addEvent(_fromEle, 'click', function (_event) {
                _calendar._$showCalendar(_event, _fromEle, false);
            }._$bind(this));
            nej.v._$addEvent(_toEle, 'click', function(_event) {
                _calendar._$showCalendar(_event, _toEle, false);
            }._$bind(this));

            var _this = this;
            _q('#searchBtn')._$on('click', function(){
                _this.__onSearchClick();
            });
        };
        /**
         * 点击搜索
         * @private
         */
        _pro.__onSearchClick = function() {

            var _from = _q('#starttime')._$val(),
                _end = _q('#endtime')._$val();

            if (Date.parse(_from) > Date.parse(_end)) {
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
                parent: document.body,
                content: '<p style="padding: 20px;">正在查询搜索结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            var _url = this.__getParam();
            window.location.href = _url;
        };
        /**
         * 获取 url地址
         * @returns {string}
         * @private
         */
        _pro.__getParam = function () {
            var _type = _q('#type')._$val(),
                _from = _q('#starttime')._$val(),
                _end = _q('#endtime')._$val();

            var _str = "/backend/income/getIncomeList"
                + "?type=" + _type
                + "&startTime=" + _from
                + "&endTime=" + _end;
            return _str;
        };
        new _p._$$IncomeReconciliation();
    });