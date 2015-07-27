<#-- 用户个人密码修改 /security/user/edit -->
<#-- Created by zmm on 28/11/14. -->

<#include "../wrapper/import.ftl">
<@htmHead title="密码修改">
<link rel="stylesheet" type="text/css" href="${css_root}module/security/manage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox resetpsw">
                    <div class="head">
                        <h2 class="js-head icf-pencil">密码修改</h2>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group">
                            <label class="title">新密码：</label>
                            <input id="J-password" type="text" placeholder="输入新密码" required/>
                        </div>
                        <div class="group-col1">
                            <p id="J-errorInfo" class="errorInfo icf-bug f-hide"></p>
                            <button id="J-submit" class="w-btn w-btn-black">&nbsp;确认修改&nbsp;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/security/userEdit.js"></script>
</body>
</html>