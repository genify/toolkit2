/**
 * 批量导入资源模块
 * Created by zmm on 28/11/14.
 */
NEJ.define('{pro}module/security/resourceImport.js',[
    '{lib}base/element.js',
    '{lib}base/event.js',
    'pro/widget/module'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$ResourceImport = NEJ.C();
    _pro = _p._$$ResourceImport._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();
        nej.v._$addEvent('J-submit', 'click', this.__onImportResource._$bind(this));
    };

    _pro.__onImportResource = function() {
        var _cnt = nej.e._$get('J-detail').value;
        var _errorEle = nej.e._$get('J-errorInfo');
        if (_cnt == '') {
            _errorEle.innerHTML = '输入点什么吧。';
            nej.e._$delClassName(_errorEle, 'f-hide');
        } else {
            nej.e._$addClassName(_errorEle, 'f-hide');
            nej.j._$haitaoDWR(
                'BackendSecurityBean',
                'importResourceList',
                [_cnt],
                function(_res) {
                    debugger;
                    if (_res == 1) {
                        alert("添加成功");
                        location.reload();
                    } else {
                        alert("添加失败：" + _res);
                    }
                }
            );
        }
    }

    new _p._$$ResourceImport();
});
