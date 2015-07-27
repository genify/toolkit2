<#macro auditList list=[]>
<table class="w-datatable w-supplychangtbl">
  <thead>
    <tr>
        <th>商品ID</th>
        <th width="120px">商品名称</th>
        <th>跨境方式</th>
        <th>条形码</th>
        <th width="140px">SKU</th>
        <th>采购数量</th>
        <th>单价成本</th>
        <th>金额小计</th>
        <th>国际+转关</th>
        <th>快递</th>
        <th>仓内运营</th>
        <th>总成本</th>
        <th>竞品价格</th>
        <th>毛利率</th>
    </tr>
  </thead>
  <#local importType = {'0':'直邮','1':'保税','2':'海淘'}/>
  <tbody>
	  <#list list as item>
	    <tr>
	      <td><#if item.isNew==1>新品<#else>${item.goodsId}</#if></td>
	      <td title=${item.goodsName}>${item.goodsName}</td>
	      <td>${importType[item.importType?string]}</td>
	      <td>${item.barcode}</td>
	      <td><#if item.isNew==1>默认<#else>${item.skuDesc}</#if></td>
	      <td>${item.purchaseCount}</td>
	      <td>${item.unitPrice}</td>
	      <td>${item.purchaseCount*item.unitPrice}</td>
	      <td>${item.internationalTransit}</td>
	      <td>${item.deliveryFee}</td>
	      <td>${item.operationFee}</td>
	      <td>${item.costSum}</td>
	      <td>${item.competitionPrice}</td>
	      <td>${item.grossProfit*100}%</if></td>
	    </tr>
	  </#list>
  </tbody>
  </table>
</#macro>

<#macro auditLogs logList>
	<#if logList?size!=0>
	<div class="m-log">
    	操作日志：
    	<#list logList as log>
    		<#if log.opTime??>
    			<li>${log.account}(${log.accountName}) 于 ${log.opTime?number_to_datetime?string("yyyy-MM-dd hh:mm")} ${log.opLog} <#if log.remark??&&log.remark!=''>备注：${log.remark}</#if></li>
    		</#if>
    	</#list>
    </div>
    </#if>
</#macro>
<#--
1,"编辑中"  
2,"经理审核中"
3,"经理驳回"
4,"总监审核中"
5,"总监驳回"
6,"总裁审核中"
7,"总裁驳回"
8,"合同待制定"   
9,"跟单中"  修改付款记录 
10,"跟单完成"  修改付款记录 
11,"已取消"   
-1,"已删除"
-->
<#assign statusMap ={"1":"编辑中",
"2":"经理审核中",
"3":"经理驳回",
"4":"总监审核中",
"5":"总监驳回",
"6":"总裁审核中",
"7":"总裁驳回",
"8":"合同待制定",   
"9":"跟单中",
"10":"跟单完成",
"11":"已取消",   
"-1":"已删除"} />

<#function isEditStatus auditStatus>
  <#if auditStatus==1||auditStatus==3||auditStatus==5||auditStatus==7||auditStatus==11>
  <#return true>
  <#else>
   <#return false>
  </#if>
</#function>
<#function isAuditStatus auditStatus>
  <#if auditStatus==2||auditStatus==4||auditStatus==6||auditStatus==9||auditStatus==10>
  <#return true>
  <#else>
   <#return false>
  </#if>
</#function>
