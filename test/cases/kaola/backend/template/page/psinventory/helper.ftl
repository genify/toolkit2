<#include "../wrapper/import.ftl">
<@htmHead title="进销存-便民窗口">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css" xmlns="http://www.w3.org/1999/html">
<#--<link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">-->
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <p>根据『gorder_id』查『order_id』</p>
                <input id="gorder_id" placeholder="gorder_id" size="50">
                <input id="get_order_id" type="button" value="查询">
                <input id="order_id" placeholder="order_id" size="50">
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/info_query.js"></script>
</body>
</html>
