/**
 * 用户个人密码修改
 * Created by zmm on 28/11/14.
 */
NEJ.define('{pro}module/security/userEdit.js',[
    '{lib}base/element.js',
    '{lib}base/event.js',
    'pro/widget/module'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$UserEdit = NEJ.C();
    _pro = _p._$$UserEdit._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();
        nej.v._$addEvent('J-submit', 'click', this.__onResetPassword._$bind(this));
    };

    _pro.__onResetPassword = function() {
        var _cnt = nej.e._$get('J-password').value;
        var _errorEle = nej.e._$get('J-errorInfo');
        if (_cnt == '') {
            _errorEle.innerHTML = '输个新密码吧。';
            nej.e._$delClassName(_errorEle, 'f-hide');
        } else {
            nej.e._$addClassName(_errorEle, 'f-hide');
            nej.j._$haitaoDWR(
                'BackendSecurityBean',
                'resetPassword',
                [_cnt],
                function(_res) {
                    debugger;
                    if (_res == 1) {
                        alert("修改成功");
                        location.reload();
                    } else {
                        alert("修改失败：" + _res);
                    }
                }
            );
        }
    }

    new _p._$$UserEdit();
});
