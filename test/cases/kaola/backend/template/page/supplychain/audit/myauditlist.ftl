<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/myAuditList/list -->

<#include "../../wrapper/import.ftl">
<@htmHead title="我的审批单">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/supplychain/supplychain.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head head-1 f-cb m-actionbar">
                    	<#if _urldisplay_object.displayLinkUrl('/backend/myAudit/create')><a href="/backend/myAudit/create" class="w-btn w-btn-black btag f-fr" target="_blank"><span class="icf-plus">&nbsp;</span>新建审批单</a></#if>
                        <ul class="m-tab f-cb">
                        	<li class="<#if (RequestParameters['type']!'1')=='1'>crt</#if>"><a href="/backend/myAuditList/list?type=1">待处理任务(${pendingCount!''})</a></li>
                        	<li class="<#if (RequestParameters['type']!'1')=='2'>crt</#if>"><a href="/backend/myAuditList/list?type=2">未完结审批单(${uncompleteCount!''})</a></li>
                        	<li><a href="/backend/myAuditList/completedlist">已完结审批单</a></li>
                        </ul>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<form id="searchForm">
                        		<div class="f-rowgroup">
                        			<div class="col col-span2"><button id="refresh" class="w-btn w-btn-black btag">刷新</button></div>
                        			<div class="col col-span2">&nbsp;
                        			</div>
                        			<div class="col col-span3">审批单状态：
                        				<select name="auditStatus">
                        				<option value="">全部</option>
                        				<#if (RequestParameters['type']!'1')=='1'>
                        					<#list pendingStatusList as item>
                        						<option value="${item.status!''}">${item.name}</option>
                        					</#list>
                        				<#else>
                        					<#list uncompleteStatusList as item>
                        					<option value="${item.status!''}">${item.name}</option>
                        					</#list>
                        				</#if>
                        				</select>
                        			</div>
                        			<div class="col col-span3">
                        				审批单号： <input type="text" placeholder="输入审批单号搜索" name="auditNo"/>
                        				<input type="hidden" name="type" value="${RequestParameters['type']!'1'}" />
                        				<button  name="submit" class="w-btn w-btn-black btag">搜索</button>
                        			</div>
                        		</div>
                        	</form>
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
<script>
<#if (RequestParameters['type']!'1')=='2'> <#--已完结-->
	var type=2;
<#else>
	var type=1;
</#if>
var role ='user';
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/supplychain/audit/myauditlist.js"></script>
</body>
</html>