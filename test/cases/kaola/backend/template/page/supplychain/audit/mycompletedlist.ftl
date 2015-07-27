<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/myAuditList/completedlist -->

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
                    	<#if  _urldisplay_object.displayLinkUrl('/backend/myAudit/create')><a href="/backend/myAudit/create" class="w-btn w-btn-black btag f-fr"  target="_blank"><span class="icf-plus">&nbsp;</span>新建审批单</a></#if>
                        <ul class="m-tab f-cb">
                        	<li><a href="/backend/myAuditList/list?type=1">待处理任务(${pendingCount!''})</a></li>
                        	<li><a href="/backend/myAuditList/list?type=2">未完结审批单(${uncompleteCount!''})</a></li>
                        	<li class="crt"><a href="/backend/myAuditList/completedlist">已完结审批单</a></li>
                        </ul>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<form id="searchForm">
                        		<div class="f-rowgroup">
                        			<div class="col"><button id="refresh" class="w-btn w-btn-black btag">刷新</button></div>
                        			<div class="col col-span2">
                        				新建时间：<input type="text" data-type="date" class="j-datepick" name="startTime">
                        			</div>
                        			<div class="col col-span2">
                        				到：<input type="text" data-type="date" class="j-datepick" name="endTime">
                        			</div>
                        			<div class="col col-span2">供应商：
                        				<select name="supplierId">
                        					<option value="">全部</option>
                        					<#list supplierDetailList as item>
                        						<option value="${item.status!''}">${item.name!''}</option>
                        					</#list>
                        				</select>
                        			</div>
                        			<div class="col col-span2">入库仓库：
                        				<select name="warehouseId">
                        					<option value="">全部</option>
                        					<#list warehouseList as item>
                        						<option value="${item.warehouseId!''}">${item.warehouseName!''}</option>
                        					</#list>
                        				</select>
                        			</div>
                    			</div>
                			<div class="f-rowgroup">
                				<div class="col col-span1">&nbsp;</div>
                    			<div class="col col-span4">
                    				审批单号： <input type="text" placeholder="输入审批单号搜索" name="auditNo"/>
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
var role ='user';
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/supplychain/audit/mycompletedlist.js"></script>
</body>
</html>