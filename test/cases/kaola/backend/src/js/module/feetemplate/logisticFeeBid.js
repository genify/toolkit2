/**
 * 物流、仓库报价单页面:{/backend/logisticFeeBid}
 * Created by zmm on 16/12/14.
 */

NEJ.define([
        '{lib}util/chain/chainable.js',
        '{pro}widget/calendar/calendar.js',
        '{pro}widget/window/warningWin.js',
        '{pro}widget/animation.js',
        'pro/widget/module'
        ],
    function(_q, _cald, _win, _ani, _sys) {

        var _p = NEJ.P('haitao.bw');    // widget namespace
            _p._$$LogisticFeeBid = NEJ.C();
        var _pro = _p._$$LogisticFeeBid._$extend(haitao.bw._$$MModule);

        /**
         * 初始化，绑定事件
         * @private
         */
        _pro.__init = function () {
            var _this = this;
            var _calendar = haitao.bw._$$Calendar._$allocate({});

            //初始化日历
            var _fromEle = nej.e._$get('fromDate'),
                _toEle = nej.e._$get('toDate');
            nej.v._$addEvent(_fromEle, 'click', function(_event) {
                _calendar._$showCalendar(_event, _fromEle, false);
            }._$bind(this));
            nej.v._$addEvent(_toEle, 'click', function(_event) {
                _calendar._$showCalendar(_event, _toEle, false);
            }._$bind(this));
            // add窗口最小化 事件
            _q('.js-minimize')._$on('click', function(){
                _this.__showAddBox(_q(this),'');
            });
            // 物流公司/仓库值发生修改时
            _q('select[name="logisticSelect"]')._$on('change', function(){
                _this.__showUpdateBox(null);
                _q('#J-logisticTable tbody')._$style('display','none');
                _q('#J-logisticTable #fee-'+ _q(this)._$val())._$style('display','');
            });
            // 点击添加
            _q('button[name="submitbutton"]')._$on('click', function(){
                _this.__onAddClick();
            });
            // 点击修改
            _q('button[name="updatebutton"]')._$on('click', function(){
                _this.__onUpdateClick();
            });
            // 点击取消修改
            _q('button[name="cancleupbutton"]')._$on('click', function(){
                _this.__showUpdateBox(null);
            });
            // 点击删除
            _q('#J-logisticTable .zdelbtn')._$on('click', function(){
                _this.__onDeleteClick(_q(this));
            });
            // 点击显示 修改弹窗
            _q('#J-logisticTable .zupbtn')._$on('click', function(){
                _this.__showUpdateBox(_q(this));
            });
            _q('#J-logisticTable #fee-'+ _q('select[name="logisticSelect"]')._$val())._$style('display','');
        };
        /**
         * 添加窗口 点击显示和隐藏
         * @param _element  点击隐藏的button.js-minimize
         * @param _show     _element不存在时，使用_show 字段判断是否显示
         * @private
         */
        _pro.__showAddBox = function(_element, _show) {
            if (( !!_element && _q('#J-addLogisticBox')._$hasClassName('js-minus')) || _show) {
                _q('#J-addLogisticBox')._$delClassName('js-minus');
                NEJ.P('haitao.bwg')._$showToggle({
                    show: true,
                    element: _q('#J-addLogisticBox .detail')[0],
                    onShowBeginFunc: function(){
                        _q('#J-addLogisticBox')._$delClassName('js-minus');
                    }
                });
                var _cname = _q('select[name="logisticSelect"]')._$val();
                _q('input[name="logistic"]')._$val(_cname);
            } else {
                if (_q('#J-addLogisticBox')._$hasClassName('js-minus')) return;
                NEJ.P('haitao.bwg')._$showToggle({
                    show: false,
                    element: _q('#J-addLogisticBox .detail')[0],
                    onHideEndFunc: function(){
                        _q('#J-addLogisticBox')._$addClassName('js-minus');
                    }
                });
            }
        };
        /**
         * 点击修改显示 修改弹窗
         * @param _element
         * @private
         */
        _pro.__showUpdateBox = function (_element) {
            var _show = false;
            if (_q(_element).length >0) {
                _show = true;
            }
            _q('#J-addLogisticBox .js-head')._$html(_show? "编辑报价单" : "添加报价单");
            _q('#J-errorInfo')._$addClassName('f-hide')._$html('');
            _q('button[name="submitbutton"]')._$setStyle('display', _show? 'none': '');
            _q('button[name="updatebutton"]')._$setStyle('display', _show? '': 'none');
            _q('button[name="cancleupbutton"]')._$setStyle('display', _show? '': 'none');

            if (_show) {
                window.scrollTo(0,0);
                _q('input[name="id"]')._$val(_element._$attr('data-id'));
                _q('select[name="template"]')._$val(_element._$attr('data-tid'));
                _q('#fromDate')._$val(_element._$attr('data-fromdate'));
                _q('#toDate')._$val(_element._$attr('data-todate'));
                this.__showAddBox(null, true);
            } else {
                _q('input[name="id"]')._$val('');
                _q('select[name="template"]')._$val('');
                _q('#fromDate')._$val('');
                _q('#toDate')._$val('');
                this.__showAddBox(null, false);
            }
        };

        /**
         * 点击发dwr添加报价单
         * @private
         */
        _pro.__onAddClick = function() {
            var _param = {};
            _param.templateId = _q('select[name="template"]')._$val();
            _param.templateName = _q('select[name="template"] option[value='+ _param.templateId + ']')._$html();
            _param.logisticName = _q('input[name="logistic"]')._$val();
            _param.startDate = _q('#fromDate')._$val();
            _param.endDate = _q('#toDate')._$val();
            _param.type = parseInt(_q('#J-logisticTable')._$attr('data-type')); //1：运费，2：仓库费
            if (_param.templateId == 0) {
                _q('#J-errorInfo')._$delClassName('f-hide')._$html('请选择模板');
                return;
            } else if (_param.startDate == '') {
                _q('#J-errorInfo')._$delClassName('f-hide')._$html('请选择开始时间');
                return;
            }
            if (_param.startDate.length < 12) {
                _param.startDate += ' 00:00:00';
            }
            // 截止日期未选择时，默认显示 开始日期+10年
            if (_param.endDate =='') {
                var year = parseInt(_param.startDate.substr(0,4));
                _param.endDate = _param.startDate.replace(year, year+10);
            } else if (_param.endDate.length < 12) {
                _param.endDate += ' 00:00:00';
            }
            // 判断结束时间和开始时间
            var _from = Date.parse(_param.startDate),
                _end = Date.parse(_param.endDate);
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
            nej.j._$haitaoDWR(
                'LogisticFeeBidBean',
                'add',
                [_param.logisticName, _param.templateId, _param.templateName, _param.startDate, _param.endDate, _param.type],
                function (_res) {
                    if (_res > 0) {
                        alert("添加成功");
                        location.reload();
                    } else if (_res == -2){
                        alert("添加失败：时间段冲突了啊.");
                    } else {
                        alert('添加失败了.');
                    }
                }
            );
        };
        /**
         * 点击发dwr修改报价单
         * @private
         */
        _pro.__onUpdateClick = function() {
            var _param = {};
            _param.id = parseInt(_q('input[name="id"]')._$val());
            _param.templateId = _q('select[name="template"]')._$val();
            _param.templateName = _q('select[name="template"] option[value='+ _param.templateId + ']')._$html();
            _param.logisticName = _q('input[name="logistic"]')._$val();
            _param.startDate = _q('#fromDate')._$val();
            _param.endDate = _q('#toDate')._$val();

            if (_param.templateId == 0) {
                _q('#J-errorInfo')._$delClassName('f-hide')._$html('请选择物流模板');
                return;
            } else if (_param.startDate == '') {
                _q('#J-errorInfo')._$delClassName('f-hide')._$html('请选择开始时间');
                return;
            }
            if (_param.startDate.length < 12) {
                _param.startDate += ' 00:00:00';
            }
            // 截止日期未选择时，默认显示 开始日期+10年
            if (_param.endDate =='') {
                var year = parseInt(_param.startDate.substr(0,4));
                _param.endDate = _param.startDate.replace(year, year+10);
            } else if (_param.endDate.length < 12) {
                _param.endDate += ' 00:00:00';
            }
            // 判断结束时间和开始时间
            var _from = Date.parse(_param.startDate),
                _end = Date.parse(_param.endDate);
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
            nej.j._$haitaoDWR(
                'LogisticFeeBidBean',
                'update',
                [_param.id, _param.templateId, _param.templateName, _param.startDate, _param.endDate],
                function (_res) {
                    if (_res > 0 ) {
                        alert("修改成功");
                        location.reload();
                    } else if (_res == -2){
                        alert("修改失败：时间段冲突了啊.");
                    } else if (_res == -1) {
                        alert('修改失败了.');
                    }
                }
            );
        };
        /**
         * 点击发dwr删除报价单
         * @param _element
         * @private
         */
        _pro.__onDeleteClick = function(_element) {
            var _id = parseInt(_q(_element)._$attr('data-id'));

            var _delDialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">确认删除该报价单？</p>',
                hideOnok: true,
                mask: 'w-winmask',
                onok: function(){
                    nej.j._$haitaoDWR(
                        'LogisticFeeBidBean',
                        'delete',
                        [_id],
                        function (_res) {
                            if (_res) {
                                alert('删除成功');
                                location.reload();
                            } else {
                                alert('删除失败:' + _res);
                            }
                        }
                    )
                }
            });
            _delDialog._$show();
        };


        new _p._$$LogisticFeeBid();
    });