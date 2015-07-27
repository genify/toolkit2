<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

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
                	<#assign auditOrder = auditDetailDto.outAuditOrderDto />
                    <div class="head head-1 f-clearfix m-actionbar">
                        <h2 class="icf-pencil">审批单号：${auditOrder.auditNo}</h2>
                        <div class="f-fr raction">
                        	<#if isEditStatus(auditOrder.auditStatus)>
                        	<#if role!="admin">
                        		 <button  name="submit" class="w-btn w-btn-black btag" id="copy">复制</button>
                        	</#if>
	                        <button  name="submit" class="w-btn w-btn-black btag" id="save">保存</button>
	        				<button  name="adddata"class="w-btn w-btn-black btag" id="submit">提交审批单</button>
	        				</#if>
        				</div>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<form id="searchForm">
                        		<div class="f-rowgroup">
                        			<#--
                        			<#assign warehouseList=[{"warehouseName":"和达网仓","warehouseId":12},{"warehouseName":"宁波保税","warehouseId":13}]>
                        			<#assign supplierList=[{"name":"美国供应商","supplierId":12},{"name":"日本供应商","supplierId":13}]>
                        			<#assign currencyTypeList=[{"value":"美元","index":1},{"value":"欧元","index":2}]>
                        			<#assign purchaseTypeList=[{"value":"CIF/CNF","index":1},{"value":"FOB","index":2},{"value":"EXW","index":3}]>
                        			<#assign transportTypeList=[{"value":"海运","index":1},{"value":"空运","index":2},{"value":"陆运","index":3}]>
                        			<#assign portList=[{"value":"上海","index":1},{"value":"杭州","index":2},{"value":"宁波","index":3},{"value":"郑州","index":3}]>
                        			warehouse type 0 为保税,1为直邮
                        			-->
                        			
                        			<div class="col col-span2">
                        				计划入库仓库<select name="warehouseId" id="warehouse" style="width:140px">
                        							<#list warehouseList as item>
                        							<option data-type=${item.type} value="${item.warehouseId}" <#if auditOrder??&&auditOrder.warehouseId==item.warehouseId>selected="selected"</#if>>${item.warehouseName}</option>
                        							</#list>
                        						</select>
                        			</div>
                        			<div class="col col-span2">
                        				采货供应商
                        				<span class="supplybox">
                        				<input type="text" placeholder="搜索供应商" value=${auditOrder.supplierName} class="supplieript" id="supplieript"/>
                        				</span>
                        				<select name="supplierId" class="supply">
	                        				<#list supplierList as item>
	                        				<option value="${item.index}" <#if auditOrder??&&auditOrder.supplierId==item.index>selected="selected"</#if> data-pinyin="${item.pinyin!''}">${item.value}</option>
	                        				</#list>
                        				</select>
                        			</div>
                        			<div class="col col-span2">
                        				采购币种
                        				<select name="currencyType">
	                        				<#list currencyTypeList as item>
	                        				<option value="${item.index}" <#if auditOrder??&&auditOrder.currencyType==item.index>selected="selected"</#if> data-rate=${(item.rate)!''}>${item.value}</option>
	                        				</#list>
                        				</select>
                        			</div>
                        			<div class="col col-span2">
                        				采购方式
                        				<select name="purchaseType">
	                        				<#list purchaseTypeList as item>
	                        				<option value="${item.index}"  <#if auditOrder??&&auditOrder.purchaseType==item.index>selected="selected"</#if>>${item.value}</option>
	                        				</#list>
                        				</select>
                        			</div>
                        			<div class="col col-span2">
                        				<span class="m-important">*</span>竞价对象
                        				<input type="text" name="competitor" value="${(auditOrder.competitor)!'部价'}" data-required="true">
                        			</div>
                        		</div>
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">
                        				<span class="m-important">*</span>预计到港日期
                        				<span class="w-datepick">
                        					<input type="text" name="expectArrivalDay" class="j-datepick" data-type="date" data-required="true" value=${auditOrder.expectArrivalDay?number_to_datetime?string("yyyy-MM-dd")}>
                        				</span>
                        			</div>
                        			<div class="col col-span2">
                        				<span class="m-important">*</span>预计入库日期
                        				<span class="w-datepick">
                        					<input type="text" name="expectInstockDay"  class="j-datepick" data-type="date"  data-required="true" value=${auditOrder.expectInstockDay?number_to_datetime?string("yyyy-MM-dd")}>
                        				</span>
                        			</div>
                        			<div class="col col-span2">
                        				运输方式
                        				<select name="transportType">
                        					<#list transportTypeList as item>
                        						<option value="${item.index}" <#if auditOrder??&&auditOrder.transportType==item.index>selected="selected"</#if>>${item.value}</option>
                        					</#list>
                        				</select>
                        			</div>
                        			<div class="col col-span2">
                        				运抵港口
                        				<select name="arrivalPort">
                        					<#list portList as item>
                        						<option value="${item.index}" <#if auditOrder??&&auditOrder.arrivalPort==item.index>selected="selected"</#if>>${item.value}</option>
                        					</#list>
                        				</select>
                        			</div>
                        		</div>
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">
                        				预计到货柜数
                        				<input type="text" name="expectCabinetCount"  value="${(auditOrder.expectCabinetCount)!''}"/>
                        			</div>
                        			<div class="col col-span2">
                        				<span class="f-vtm">采购总金额</span>
                        				<span id="totalAmount"></span>
                        			</div>
                        			<div class="col col-span2">
                        				<span class="f-vtm">采购总数量</span>
                        				<span id="totalAccount"></span>
                        			</div>
                        			<input type="hidden" name="auditId" value=${(auditOrder.id)!''}>
                        			<button name="submit" class="f-dn"/></button>
                        		</div>
                        	</form>
                        </div>
                        <div id="list"></div>
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
	<#if auditDetailDto??>
		var auditGoodsList = ${stringify(auditDetailDto.outAuditGoodsDtoList)};
		var auditOrder = ${stringify(auditDetailDto.outAuditOrderDto)}
	<#else>
		var auditGoodsList = [];
		var auditOrder = {};
	</#if>
	var role = '${role}';
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/supplychain/audit/auditEdit.js"></script>
</body>
</html>