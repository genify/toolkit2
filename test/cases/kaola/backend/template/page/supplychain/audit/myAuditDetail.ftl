<#-- Created by yqj on 27/01/2015. -->
<#-- 审批单的只读状态，管理员可以提交和驳回审核 -->

<#include "../../wrapper/import.ftl">
<#include "audit_inc.ftl">
<@htmHead title="审批单详情">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/supplychain/supplychain.css">
</@htmHead>
<@topHeader />
<#if !role??>
	<#assign role="user">
</#if>
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <#if auditDetailDto??>
                    <div class="head head-1 f-clearfix m-actionbar">
                        <h2 class="icf-pencil">审批单号：${auditDetailDto.outAuditOrderDto.auditNo!''}</h2>
                        <div class="f-fr raction">
                        	<#if isAuditStatus(auditDetailDto.outAuditOrderDto.auditStatus)&&role!="admin"> <#--经理审核中 总监审核中 总裁审核中 跟单中-->
                        	<button  name="submit" class="w-btn w-btn-black btag" id="copy">复制</button>
	        				<#elseif auditDetailDto.outAuditOrderDto.auditStatus==8>  <#--合同待制定 -->
	        				<#if role!="admin">
	        				<button  name="submit" class="w-btn w-btn-black btag" id="copy">复制</button>
	        				</#if>
	        				<button  name="submit" class="w-btn w-btn-black btag" id="cancel">取消审批</button>
	        				<button  name="submit" class="w-btn w-btn-black btag" id="completeContract">合同制定完毕</button>
	        				</#if>
        				</div>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<form id="searchForm">
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">
                        				计划入库仓库:${(auditDetailDto.outAuditOrderDto.warehouseName)!''}
                        			</div>
                        			<div class="col col-span2">
                        				采货供应商:${auditDetailDto.outAuditOrderDto.supplierName!''}
                        			</div>
                        			<div class="col col-span2">
                        				采购币种:${auditDetailDto.outAuditOrderDto.currencyName!''}
                        			</div>
                        			<div class="col col-span2">
                        				采购方式:${auditDetailDto.outAuditOrderDto.purchaseName!''}
                        			</div>
                        			<div class="col col-span2">
                        				竞价对象:${(auditDetailDto.outAuditOrderDto.competitor)!''}
                        			</div>
                        		</div>
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">
                        				预计到港日期:<span class="j-date">${auditDetailDto.outAuditOrderDto.expectArrivalDay?number_to_datetime?string("yyyy-MM-dd")}</span> <#if auditDetailDto.outAuditOrderDto.auditStatus==9&&(role!'user')!='admin'><a href="javascript:void(0);" id="arrivalDay" data-date="${auditDetailDto.outAuditOrderDto.expectArrivalDay?number_to_datetime?string("yyyy-MM-dd")}">修改</a></#if>
                        			</div>
                        			<div class="col col-span2">
                        				预计入库日期:<span class="j-date">${auditDetailDto.outAuditOrderDto.expectInstockDay?number_to_datetime?string("yyyy-MM-dd")}</span> <#if auditDetailDto.outAuditOrderDto.auditStatus==9&&(role!'user')!='admin'><a href="javascript:void(0);" id="instockDay" data-date="${auditDetailDto.outAuditOrderDto.expectInstockDay?number_to_datetime?string("yyyy-MM-dd")}">修改</a></#if>
                        			</div>
                        			<div class="col col-span2">
                        				运输方式:${auditDetailDto.outAuditOrderDto.transportName!''}
                        			</div>
                        			<div class="col col-span2">
                        				运抵港口:${auditDetailDto.outAuditOrderDto.arrivalPortName!''}
                        			</div>
                        		</div>
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">
                        				预计到货柜数:${(auditDetailDto.outAuditOrderDto.expectCabinetCount)!''}
                        			</div>
                        			<div class="col col-span2">
                        				<span class="f-vtm">采购总金额</span>
                        				<span id="totalAmount"></span>
                        			</div>
                        			<div class="col col-span2">
                        				<span class="f-vtm">采购总数量</span>
                        				<span id="totalAccount"></span>
                        			</div>
                        			<div class="col col-span2">
                        				<span class="f-vtm">审批单状态: </span>
                        				<span>${statusMap[auditDetailDto.outAuditOrderDto.auditStatus?string]}</span>
                        			</div>
                        		</div>
                        	</form>
                        </div>
                        <div id="list">
                        	<@auditList list=auditDetailDto.outAuditGoodsDtoList />
                        </div>
                        <#if role=="admin"&&
                        (auditDetailDto.outAuditOrderDto.auditStatus==2||
                        auditDetailDto.outAuditOrderDto.auditStatus==4||
                        auditDetailDto.outAuditOrderDto.auditStatus==6)>
                        <div class="m-auditbar f-tac">
                        	<button class="w-btn w-btn-black btag" id="reject">审核驳回</button>
                        	<button class="w-btn w-btn-black btag" id="pass">审核通过</button>
                        </div>
                        </#if>
                        <#if (auditDetailDto.outAuditOrderDto.auditStatus==9||auditDetailDto.outAuditOrderDto.auditStatus==10)&&(auditDetailDto.trackTasks)??><#--跟单中 跟单完成-->
						    <#if auditDetailDto.trackTasks?size!=0>
                        	<div id="tracktask">
                        		<div>跟单任务</div>
                        		<#list auditDetailDto.trackTasks as item>
                        		<div class="m-tracktaskbox">
                        		<table class="m-tracktasktbl">
                        			<tbody>
									<tr>
										<td rowspan=2><span class="lbl">采购单:</span><a class="link" href="/backend/invoicing/order?id=${item.purchaseOrderId}">${item.purchaseOrderId}</a></td>
										<td><span class="lbl">是否起运:</span><span class="col">${item.beginTransportState}</span></td>
										<td><span class="lbl">是否到港:</span><span class="col">${item.arrivalPortState}</span></td>
										<td><span class="lbl">是否到仓:</span><span class="col">${item.arrivalWarehouseState}</span></td>
										<td><span class="lbl">是否理货:</span><span class="col">${item.tallyState}</span></td>
										<td><span class="lbl">入库仓库:</span><span class="col">${item.storageName!''}</span></td>
										<td><span class="lbl">采购数量:</span><span class="col">${item.purchaseOrder.purchaseCount}</span></td>
										<td><span class="lbl">采购单状态:</span><span class="col"><#if item.purchaseOrder??>${item.purchaseOrder.status}</#if></span></td>
									</tr>
									<tr>
										<td><span class="lbl">起运日期:</span><span class="col"><#if item.beginTransportTime??>${item.beginTransportTime?number_to_datetime?string('yyyy-MM-dd')}</#if></span></td>
										<td><span class="lbl">到港日期:</span><span class="col"><#if item.arrivalPortTime??>${item.arrivalPortTime?number_to_datetime?string('yyyy-MM-dd')}</#if></span></td>
										<td><span class="lbl">到库日期:</span><span class="col"><#if item.arrivalWarehouseTime??>${item.arrivalWarehouseTime?number_to_datetime?string('yyyy-MM-dd')}</#if></span></td>
										<td><span class="lbl">理货日期:</span><span class="col"><#if item.tallyTime??>${item.tallyTime?number_to_datetime?string('yyyy-MM-dd')}</#if></span></td>
										<td><span class="lbl">运输方式:</span><span class="col">${item.transportWay}</span></td>
										<td><span class="lbl">采购金额(${item.purchaseOrder.currencyType}):</span><span class="col">${item.purchaseOrder.purchaseAmount}</span></td>
										<td><span class="lbl">入库时间:</span><span class="col"><#if item.storeInTime??>${item.storeInTime?number_to_datetime?string('yyyy-MM-dd')}</#if></span></td>
									</tr>
									<tr>
										<td colspan=8><span>附件：</span><#list item.attachments as attachment><a target="_blank" href="${attachment.attachmentUrl}">${attachment.attachmentName}</a></#list></td>
									</tr>
									</tbody>
                        		</table>
                    		</div>
                		</#list>
                    	</div>
                    	</#if>
                    </#if>
                    <#if (auditDetailDto.outAuditOrderDto.auditStatus==8||auditDetailDto.outAuditOrderDto.auditStatus==9||auditDetailDto.outAuditOrderDto.auditStatus==10)>  <#--修改付款记录 -->
                    	<div id="trackaudit"></div>
                    </#if>
                    <#if auditDetailDto.outAuditOrderDto.auditStatus==8||auditDetailDto.outAuditOrderDto.auditStatus==9||auditDetailDto.outAuditOrderDto.auditStatus==10||auditDetailDto.outAuditOrderDto.auditStatus==8><#--合同订制-->
                    	<div id="contract"></div>
                    </#if>
                    <@auditLogs logList = auditDetailDto.auditLogs![] />
                 </div>
                 <#else>
                    审批单已删除^_^
                 </#if>
            </div>
        </div>
    </div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<@htmFoot />

<script>
	var isEdit = <#if auditDetailDto??>true<#else>false</#if>;
	<#if auditDetailDto??>
		var auditGoodsList = ${stringify(auditDetailDto.outAuditGoodsDtoList)};
	<#else>
		var auditGoodsList = [];
	</#if>
	<#if auditDetailDto??>
	var auditOrder = ${stringify(auditDetailDto.outAuditOrderDto)}
	var currencyTypeList = ${stringify(currencyTypeList)};
	<#if auditDetailDto.contractList??>
	var contractList = ${stringify(auditDetailDto.contractList)};
	<#else>
	var contractList =[];
	</#if>
	<#if auditDetailDto.payList??>
	var payRecordList = ${stringify(auditDetailDto.payList)};
	<#else>
	var payRecordList = [];
	</#if>
	</#if>
	var role = '${role}';
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/supplychain/audit/myAuditDetail.js"></script>
</body>
</html>