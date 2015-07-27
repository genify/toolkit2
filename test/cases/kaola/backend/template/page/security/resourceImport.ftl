<#-- 批量导入资源 /backend/security/resource/import -->
<#-- Created by zmm on 28/11/14. -->

<#include "../wrapper/import.ftl">
<@htmHead title="资源批量导入">
<link rel="stylesheet" type="text/css" href="${css_root}module/security/manage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox importbox">
                    <div class="head">
                        <h2 class="js-head icf-pencil">批量导入资源</h2>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group">
                            <textarea id="J-detail" type="text" placeholder="输入点什么把..."></textarea>
                        </div>
                        <div class="group">
                            <p id="J-errorInfo" class="errorInfo icf-bug f-hide"></p>
                            <button id="J-submit" class="w-btn w-btn-black">&nbsp;导入&nbsp;</button>
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
    <script src="/backend/src/js/module/security/resourceImport.js"></script>
</body>
</html>