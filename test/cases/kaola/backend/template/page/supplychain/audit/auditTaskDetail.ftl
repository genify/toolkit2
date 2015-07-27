<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/auditTask/detail/{id} -->

<#include "../../wrapper/import.ftl">
<#include "audit_inc.ftl">
<@htmHead title="新建审批单">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/supplychain/supplychain.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head head-1 f-clearfix m-actionbar">
                        <h2 class="icf-pencil">审批单号：${auditDetailDto.outAuditOrderDto.auditNo!''}</h2>
                        <div class="f-fr raction">
                        	<#if isAuditStatus(auditDetailDto.outAuditOrderDto.auditStatus)&&role!'user'=='admin'> <#--经理审核中 总监审核中 总裁审核中 跟单中 且只有管理员才有复制功能-->
                        	<button  name="submit" class="w-btn w-btn-black btag" id="copy">复制</button>
	        				<#elseif auditDetailDto.outAuditOrderDto.auditStatus==8>  <#--合同待制定 -->
	        				<button  name="submit" class="w-btn w-btn-black btag" id="copy">复制</button>
	        				<button  name="submit" class="w-btn w-btn-black btag" id="cancel">取消审批</button>
	        				<button  name="submit" class="w-btn w-btn-black btag" id="copy">合同制定完毕</button>
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
                        				预计到港日期:${auditDetailDto.outAuditOrderDto.expectArrivalDay?number_to_datetime?string("yyyy-MM-dd")}
                        			</div>
                        			<div class="col col-span2">
                        				预计入库日期:${auditDetailDto.outAuditOrderDto.expectInstockDay?number_to_datetime?string("yyyy-MM-dd")}
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
                       
                        <div class="m-auditbar f-tac">
                        	<button class="w-btn w-btn-black btag" id="reject">审核驳回</button>
                        	<button class="w-btn w-btn-black btag" id="pass">审核通过</button>
                        </div>
                        <@auditLogs logList = auditDetailDto.auditLogs![] />
                     </div>
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
	var auditOrder = ${stringify(auditDetailDto.outAuditOrderDto)}
	var contractList =[];
	var payRecordList =[];
	<#if !role??>
		<#assign role="user">
	</#if>
	var role = '${role}';
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/supplychain/audit/auditTaskDetail.js"></script>
</body>
</html>