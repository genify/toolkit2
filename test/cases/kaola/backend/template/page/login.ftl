<#-- Created by zmm on 12/11/14. -->
<#-- 登陆页面：/login -->

<#include "wrapper/import.ftl">
<@htmHead title="登录">
    <link rel="stylesheet" type="text/css" href="${css_root}iconfont.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/login.css">
</@htmHead>
<form id="login" onsubmit="return false;">
    <h1>全球购后台登录</h1>
    <fieldset id="inputs">
        <div class="item">
            <label for="username" class="icf-user"></label>
            <input id="username" type="text" placeholder="用户名" autofocus required>
        </div>
        <div class="item">
            <label for="password" class="icf-key"></label>
            <input id="password" type="password" placeholder="密码" required>
        </div>
        <#if (isOnline!false) >
            <div>
                <label>验证码：</label>
                <input id="captcha" type="text" required>
                <img id="captchaImg" src="/backend/captcha.jpg?width=110&height=40" title="点击刷新">
            </div>
        <#else>
            <input id="captcha" type="hidden" value="test">
        </#if>

    </fieldset>

    <fieldset id="actions">
        <input type="button" id="submit" value="登录">
    </fieldset>
    <p class="icf-pointer">(登录如有问题请联系 魏GG)</p>
</form>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/login.js"></script>
</body>
</html>