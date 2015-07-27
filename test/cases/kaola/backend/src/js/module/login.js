/**
 * 后台管理 登陆页面
 * Created by zmm on 12/11/14.
 */

NEJ.define('{pro}module/login.js', [
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/event.js',
    '{pro}base/extend.js',
    'pro/widget/module'
], function(_e, _v, _t, _ext, _sys) {

    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro,                     // class prototype
        _succUrl = '/backend/index';

    _p._$$Login = NEJ.C();
    _pro = _p._$$Login._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function() {
        this.__super();
        _v._$addEvent('password', 'keypress', this.__onEnter._$bind(this));
        _v._$addEvent('submit','click', this.__onLogin._$bind(this));
        _v._$addEvent('captchaImg', 'click', this.__refreshCaptcha._$bind(this));
    };
    /**
     * 点击验证码图片刷新
     * @private
     */
    _pro.__refreshCaptcha = function() {
        var _captchaEle = _e._$get('captcha');
        var _ele = _e._$get('captchaImg');
        var _url = '/backend/captcha.jpg?width=110&height=40';
        _url += '&t=' + Math.random();
        _e._$attr(_ele, 'src', _url);
        _captchaEle.value = '';
        _captchaEle.focus();
    };
    /**
     * 在密码框 回车事件
     * @param _event
     * @private
     */
    _pro.__onEnter = function(_event) {
        if (_event&&_event.keyCode==13) this.__onLogin();
    };
    /**
     * 登录事件，验证用户名 密码
     * @private
     */
    _pro.__onLogin = function() {
        var _nameEle = _e._$get('username');
        var _pswEle = _e._$get('password');
        var _captchaEle = _e._$get('captcha');
        if (_nameEle.value.trim().length == 0) {
            _nameEle.value = '';
            _nameEle.focus();
            return;
        } else if (_pswEle.value.length == 0) {
            _pswEle.focus();
            return;
        } if (_captchaEle.value.trim().length == 0) {
            _captchaEle.value = '';
            _captchaEle.focus();
            return;
        }

        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'login',
            [_nameEle.value.trim() ,_pswEle.value, _captchaEle.value, false, false],
            this.__cbLogin._$bind(this)
        );
    };
    /**
     * 登录dwr请求回调
     * @param _type -2：用户名不存在，-3，-4：密码验证失败。正常返回UserID
     * @private
     */
    _pro.__cbLogin = function(_type) {
        if (_type > 0) {
            location.href = _succUrl;
        } else {
            if(_type == -1){
                alert("请求数据不完整");
            }else if(_type == -2){
                alert("用户名不存在");
            }else if(_type == -4){
                alert("用户名或密码错误");
            }else if(_type == -5) {
                alert("账号被禁用，请联系管理员");
            }else if(_type == -6) {
                alert("验证码输入错误呀，再试试");
            }else{
                alert("系统错误，请联系管理员");
            }
            if (_type == -2) {
                _e._$get('username').value = '';
                _e._$get('password').value = '';
                _e._$get('username').focus();
            } else if (_type == -6 || _type == -4) {
                this.__refreshCaptcha();
            } else {
                _e._$get('password').value = '';
                _e._$get('password').focus();
            }
        }
    };

    new _p._$$Login();
});