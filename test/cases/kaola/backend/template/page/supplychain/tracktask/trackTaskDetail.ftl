<#-- Created by hale on 23/06/2015. -->
<#-- 跟单详情页：/backend/supplychain/tracktask/detail -->

<#include "../../wrapper/import.ftl">
<@htmHead title="跟单任务详情">
    <link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/tracktask/detail.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div id="tabview"></div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<!-- @DEFINE -->
<script type="text/javascript">
    var auditId = ${auditId!""},
        auditNo = '${auditNo!""}',
        auditStatus4Detail = ${auditStatus4Detail!""},
        auditLogs = JSON.parse('${auditLogs}'),
        hasAllRelated = '${hasAllRelated?c}';
</script>
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/tracktask/detail.js"></script>
</body>
</html>