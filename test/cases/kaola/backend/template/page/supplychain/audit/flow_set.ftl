<#-- 审批流程设置页面-->
<#-- Created by yqj on 2015.0613. -->
<#-- 商品库存明细表：/backend/audit/flow/setup -->

<#include "../../wrapper/import.ftl">
<@htmHead title="审批流程设置页面">
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
                        	<li class="crt"><a href="/backend/audit/flow/setup">审批流程设置</a></li>
                        	<li><a href="/backend/relateRecord/listConfig">新品关联备案设置</a></li>
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
<#if managerLevel??>
var managerLevelList = ${stringify(managerLevel)};
<#else>
var managerLevelList = [];
</#if>
<#if directorLevel??>
var directorLevelList = ${stringify(directorLevel)};
<#else>
var directorLevelList = [];
</#if>
<#if presidentLevel??>
var presidentLevelList = ${stringify(presidentLevel)};
<#else>
var presidentLevelList = [];
</#if>
var flowLevelList = ${stringify(flowLevel)};

</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/supplychain/audit/flow_set.js"></script>
</body>
</html>