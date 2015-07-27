<#-- Created by zmm on 12/11/14. -->
<#-- 首页：/index -->

<#include "wrapper/import.ftl">
<@htmHead title="首页" >
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="w-alertinfo">
                    左边选个模块吧。
                    ${(backend_userSecurityData.user.name)!""}
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/index.js"></script>
</body>
</html>