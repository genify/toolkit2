<#-- Created by hale on 16/06/2015. -->
<#-- 订单列表页面：/backend/relateRecord -->

<#include "../../wrapper/import.ftl">
<@htmHead title="供货管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/relateRecord/relate.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div id="databox"></div>
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
    var importTypeList = ${stringify(importTypeList)},
        storages       = ${stringify(storages)};
</script>
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/relateRecord/relate.js"></script>
</body>
</html>