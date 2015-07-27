/**
 * 海关对账:{/backend/reconcilition/customtax/index}
 * Created by zmm on 5/1/15.
 */
NEJ.define([
    '{lib}util/chain/chainable.js',
    '{pro}widget/calendar/calendar.js',
    '{pro}widget/window/warningWin.js',
    'pro/widget/module'
],
    function(_q, _cald, _win, _sys, _p) {
        _p._$$CustomsReconciliation = NEJ.C();
        var _pro = _p._$$CustomsReconciliation._$extend(haitao.bw._$$MModule);

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
                _this.__onSearchClick();
            });
            _q('button[name="exportBtn"]')._$on('click', function(){
                _this.__onExportClick();
            });
        };
        /**
         * 点击搜索
         * @private
         */
        _pro.__onSearchClick = function () {
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
                parent: document.body,
                content: '<p style="padding: 20px;">正在查询搜索结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            var _url = this.__getParam(false);
            window.location.href = _url;

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
                parent: document.body,
                content: '<p style="padding: 20px;">正在生成导出数据，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            var _url = this.__getParam(true);
            window.location.href = _url;
        };
        /**
         * 获取 url地址
         * @param isExport  是否导出数据
         * @returns {string}
         * @private
         */
        _pro.__getParam = function (isExport) {
            var _state = _q('select[name="state"]')._$val(),
                _import = _q('select[name="import"]')._$val(),
                _storage = _q('select[name="storage"]')._$val(),
                _result = _q('select[name="result"]')._$val(),
                _starttime = _q('input[name="starttime"]')._$val(),
                _endtime = _q('input[name="endtime"]')._$val();

            var _str = "/backend/reconciliation/customstax/index"
                + "?state=" + _state
                + "&import=" + _import
                + "&storage=" + _storage
                + "&result=" + _result
                + "&starttime=" + _starttime
                + "&endtime=" + _endtime;
            if (!!isExport) {
                _str += "&export=true";
            }
            return _str;
        };
        new _p._$$CustomsReconciliation();
    });