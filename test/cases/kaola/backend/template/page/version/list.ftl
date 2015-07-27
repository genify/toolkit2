<#-- Created by yqj on 27/01/2015. -->
<#-- 订单列表页面：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="版本管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/version/list.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">查询订单</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<#if !channals??>
                        		<#assign channals="All、豌豆荚、官网"/>
                        	</#if>
                        	<#if !clientTypeList??||clientTypeList?size=0>
                        		<#assign clientTypeList= [{"value":2,"text":"安卓"},{"value":1,"text":"IOS"}]/>
                        	</#if>
                        	<#assign channelsList = channals?split("、")>
                            <@searchForm filters=[
                            	[{"label":"客户端","type":"SELECT","name":"type","values":clientTypeList},
                            	{"label":"版本号","type":"TEXT","name":"versionName"},
                            	{"label":"渠道","type":"SELECT","name":"channal"},
                            	{"label":"开始时间","type":"DATE","name":"startDate","values":channals},
                            	{"label":"-","type":"LABEL"},
                            	{"label":"结束时间","type":"DATE","name":"endDate","values":channals},
                            	{"type":"BUTTON","name":"submit","value":"查询"}]
                            ]/>
                        </div>
                        <div id="list"></div>
                     </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/version/list.js"></script>
</body>
</html>