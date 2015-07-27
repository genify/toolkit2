<#-- 新品关联备案设置 -->
<#-- Created by yqj on 2015.0613. -->
<#-- 商品库存明细表：/backend/relateRecord/listConfig -->

<#include "../wrapper/import.ftl">
<@htmHead title="新品关联备案设置">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/supplychain/supplychain.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/relateRecord/config.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head head-1 f-cb m-actionbar">
                        <ul class="m-tab f-cb">
                        	<li><a href="/backend/audit/flow/setup">审批流程设置</a></li>
                        	<li class="crt"><a href="/backend/relateRecord/listConfig">新品关联备案设置</a></li>
                        </ul>
                    </div>
                    <div id="configbox">
                        
                     </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<@htmFoot />

<script>
var warehouseList = ${stringify(warehouseList)};
<#--先关联后备案  先备安后关联  无需关联-->
var relateRecordConfigsList = ${stringify(relateRecordConfigs)};
var recordRelateConfigsList = ${stringify(recordRelateConfigs)};
var onlyRelateConfigsList = ${stringify(onlyRelateConfigs)};

</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/relateRecord/config.js"></script>
</body>
</html>