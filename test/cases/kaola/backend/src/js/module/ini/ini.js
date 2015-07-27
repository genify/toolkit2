/**
 * {活动配置项}
 * Created by zmm on 3/3/15.
 */

NEJ.define([
    'pro/widget/module',
    'pro/base/request',
    'pro/base/config',
    '{lib}util/chain/chainable.js',
    '{pro}widget/window/warningWin.js'
],
    function(_sys, _request, _config, _q, _warnWin) {
        var _p = NEJ.P('haitao.bm'),
            _pro;
        _p._$$HaitaoIni = NEJ.C();
        _pro = _p._$$HaitaoIni._$extend(haitao.bw._$$MModule);

        /**
         * 初始化，绑定button事件
         * @private
         */
        _pro.__init = function () {
            this.__super();

            var _this = this;
            _q('button[name="addNew"]')._$on('click', function(){
                _this.__onAddNewClick();
            });
            _q('button[name="searchBtn"]')._$on('click', function(){
                _this.__onSearchClick();
            });
            _q('.w-datatable button.zupbtn')._$on('click', function(){
                _this.__onUpdateClick(_q(this));
            });
            _q('.w-datatable button.zdelbtn')._$on('click', function(){
                _this.__onDeleteClick(_q(this));
            });
            _q('button[name="refreshIP"]')._$on('click', function(){
               _this.__onRefreshClick();
            });
        };

        /**
         * 点击查询
         * @private
         */
        _pro.__onSearchClick = function() {
            var _url = this.__getParam();
            window.location.href = _url;
        };

        /**
         * 点击新增
         * @private
         */
        _pro.__onAddNewClick = function () {
            this.__updateIni(true, null);
        };

        /**
         * 点击修改
         * @param _element
         * @private
         */
        _pro.__onUpdateClick = function (_element) {
            var _obj = {
                iniKey: _element._$attr('data-key'),
                iniNameCn: _element._$attr('data-nameCn'),
                iniValue: _element._$attr('data-value'),
                iniDesc: _element._$attr('data-desc')
            };
            this.__updateIni(false, _obj);
        };

        _pro.__updateIni = function(_isNew, _obj) {
            var _initKey = _isNew ? "" : _obj.iniKey||'',
                _iniNameCn = _isNew ? "" : _obj.iniNameCn||'',
                _iniValue = _isNew ? "" : _obj.iniValue||'',
                _iniDesc = _isNew ? "" : _obj.iniDesc||'';
            var _html = '<div class="ini-dialog m-databox w-dataform" style="border: 0 none;box-shadow: 0 0 0; margin-right: 20px;">\
                            <p class="group">\
                                <label class="title" >系统参数名称:</label>\
                                <input type="text" class="wd200" name="iniKey" value="'+ _initKey+'" '+ (_isNew?' ': 'disabled') +'/>\
                            </p>\
                            <p class="group">\
                                <label class="title">配置显示名称:</label>\
                                <input type="text" class="wd200" name="iniNameCn" value="'+ _iniNameCn+'"/>\
                            </p>\
                            <p class="group">\
                                <label class="title">系统参数值:</label>\
                                <input type="text" class="wd200" name="iniValue" value="'+ _iniValue+'"/>\
                            </p>\
                            <p class="group">\
                                <label class="title">描述:</label>\
                                <textarea name="iniDesc" >'+ _iniDesc +'</textarea>\
                            </p>\
                            <p class="errorInfo"></p>\
                        </div>';

            var _delDialog = haitao.bw._$$WarningWindow._$allocate({
                title: _isNew ? "新增活动配置" : "修改活动配置" ,
                parent: document.body,
                content: _html,
                hideOnok: false,
                mask: 'w-winmask',
                onok: function(){

                    var _url = _config.URLPERFIX + (_isNew ? '/backend/ini/add': '/backend/ini/update' ),
                        _param = {
                            iniKey: _q('.ini-dialog input[name="iniKey"]')._$val(),
                            iniNameCn: _q('.ini-dialog input[name="iniNameCn"]')._$val(),
                            iniValue: _q('.ini-dialog input[name="iniValue"]')._$val(),
                            iniDesc: _q('.ini-dialog textarea[name="iniDesc"]')._$val()
                        };
                    if (_param.iniKey == '') {
                        _q('.ni-dialog .errorInfo')._$html('系统参数名称不能为空');
                        return;
                    }
                    if (_param.iniValue == '') {
                        _q('.ni-dialog .errorInfo')._$html('系统参数值不能为空');
                        return;
                    }

                    _request(_url,{
                        data: _param,
                        onload: function(_json){
                            if (_json.code == 200) {
                                alert("操作成功");
                                location.reload();
                            } else {
                                alert(_json.msg || '操作失败');
                            }
                        }
                    });
                }
            });
            _delDialog._$show();
        };

        /**
         * 点击删除
         * @param _element
         * @private
         */
        _pro.__onDeleteClick = function(_element) {
            var _iniKey = _q(_element)._$attr('data-key');
            var _delDialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">确认删除该配置？</p>',
                hideOnok: true,
                mask: 'w-winmask',
                onok: function(){
                    _request(_config.URLPERFIX+'/backend/ini/delete',{
                        data: {iniKey:_iniKey},
                        onload: function(_json){
                            if (_json.code == 200) {
                                alert("删除成功");
                                location.reload();

                            } else {
                                alert(_json.msg);
                            }
                        }
                    });
                }
            });
            _delDialog._$show();
        };

        /**
         * 获取 url地址
         * @param isExport  是否导出数据
         * @returns {string}
         * @private
         */
        _pro.__getParam = function () {
            var _key = _q('input[name="iniKey"]')._$val(),
                _name = _q('input[name="iniNameCn"]')._$val(),
                _value = _q('input[name="iniValue"]')._$val(),
                _desc = _q('input[name="iniDesc"]')._$val();

            var _str = "/backend/ini/list"
                + "?iniKey=" + _key
                + "&iniNameCn=" + _name
                + "&iniValue=" + _value
                + "&iniDesc=" + _desc;

            return _str;
        };

        /**
         * 执行刷新操作
         * @private
         */
        _pro.__onRefreshClick = function() {
            var _ip = _q('select[name="ipList"]')._$val(),
                _param = {
                    key: 'haitaoIni',
                    ipList: _ip
                };

            _request(_config.URLPERFIX+'/backend/refresh/execute',{
                data: _param,
                onload: function(_json){
                    alert('刷新操作：'+ _json.code +'\n' +_json.body.retList.join(' \n'));
                }
            });
        };

        new _p._$$HaitaoIni();
    });