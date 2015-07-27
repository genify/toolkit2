<#-- 模拟数据，不用注释, 如果storageList 与 purchaseOrder 都不存在，则加载假数据 -->
<#-- 在新建采购单时，后端不会给purchaseOrder对象，这边默认给一个状态及purchaseOrder对象 -->
<#--<#if storageList??>-->
	<#assign po=purchaseOrder?default({"purchaseCount":0,"purchaseAmount":0,
	"supplierId":-9999999,
	"storageId": -9999999,
	"remark":"",
	"status": 1,
	"details":[],"logs":[]})/>
<#--</#if>-->
<#if !storageList?? && !purchaseOrder?? >
<#include "../fakedata/psinventory/create_fakedata.ftl">
</#if>
<#include "../wrapper/import.ftl">
<#if !purchaseOrder??>
	<#assign status=1/>
	<#assign statusText="审核驳回">
	<#assign currencyType=-1/>
<#else>
	<#assign status=po.status.intValue()/>
	<#if status==0>
		<#assign status=1/>
	</#if>
	<#assign statusText=po.status.toString()/>
	<#assign currencyType=po.currencyType.intValue()/>
</#if>

<@htmHead title="虚拟入库">
	<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/mimic_stockin.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
<div class="g-bdc">
<div class="m-contents">
	<div class="m-title-bar f-clearfix">
		<div class="m-po-ctrl f-fr">
			<span class="f-warn" id="po-alert"></span>
			<#if status==1>
			<input type="button" value="保存" class="w-btn w-btn-blue u-btn" id="saveBtn">
			<input type="button" value="提交采购单" class="w-btn w-btn-blue u-btn" id="submitBtn">
			</#if>
			<#if status==3>
			<#--<input type="button" value="取消采购单" class="w-btn w-btn-blue u-btn" id="cancelBtn">-->
			</#if>
			<#if status==6>
            <#--<input type="button" value="复制采购单" class="w-btn w-btn-blue u-btn" id="copyBtn" onclick="window.open('/backend/invoicing/order/create?copy_from_id=${(po.id)}')">-->
			</#if>
		</div>	
		<#if po.id??>
			<#assign poNumberPrefix="采购单号： "/>
		<#else>
			<#assign poNumberPrefix=""/>
		</#if>
		<#if copyOrder??>
        	<span class="u-page-title" data-ponumber="新建采购单">
				新建采购单
			</span>
		<#else>
        	<span class="u-page-title" data-ponumber="${(po.id)?default('新建采购单')}">
				${poNumberPrefix}${(po.id)?default('新建采购单')}
			</span>
		</#if>
	</div>
	<div class="m-poheader f-clearfix">
		<div class="f-col-4 f-row-1">
			<label>指定入库仓库:</label>
			<#if status==1>
			<select id="po-warehouse">
			    <#list storageList as st>
			    <#if st.storageId==po.storageId>
				<option value="${st.storageId}" selected>${st.storageName}</option>
				<#else>
				<option value="${st.storageId}" >${st.storageName}</option>
				</#if>
				</#list>
			</select>
			<#else>
			<label id="storageName">${po.storageName}</label>
			</#if>
		</div>
		<div class="f-col-4 f-row-1">
			<label>采货供应商</label>
			<#if status==1>
			<select id="po-vendor">
				<#list supplierList as sp>
				<#if sp.supplierId==po.supplierId>
				<option value="${sp.supplierId}" selected>${sp.supplierName}</option>
				<#else>
				<option value="${sp.supplierId}" >${sp.supplierName}</option>
				</#if>
				</#list>
			</select>
			<#else>
			<label>: ${po.supplierName}</label>
			</#if>
		</div>
		<#if status==1>
		<div class="f-col-4 f-row-1">
			<label class="f-required">
				预计入库时间
				<#if !po.expectedTime??>
					<#assign _expectedTime=""/>
				<#else>
					<#assign _expectedTime=po.expectedTime?number_to_datetime?string('yyyy-MM-dd') />
				</#if>
				<input type="text" value="${_expectedTime}" class="datepick" placeholder="点击选择时间"  id="po-expectedtime" readonly="true">
			</label>			
		</div>
		<#else>
		<div  class="f-col-4 f-row-1">
			<label>预计入库时间: ${po.expectedTime?number_to_date?string('yyyy-MM-dd')}</label>
		</div>
		</#if>		
		<#if status gt 1>
		<div class="f-col-2 f-row-1">
			<label>处理状态:</label>
			<#-- TODO ${po.status.intValue()}-->
			<label id="orderStatus">${po.status}</label>
		</div>	
		</#if>	
		<div class="f-col-4 f-row-1">
			<label class="f-required">币种</label>
			<#if status==1>
			<select id="po-currency">
				<#list currencyList as currency>
					<#if currency.currencyId == currencyType>
					<option value="${currency.currencyId}" selected>${currency.currencyName}</option>
					<#else>
					<option value="${currency.currencyId}">${currency.currencyName}</option>
					</#if>
				</#list>
			</select>
			<#else>
			<label id="currencyname">: ${po.getCurrencyName()!''}</label>
			</#if>
		</div>
		<#if status gt 4>
		<div class="f-col-4 f-row-1">
			<label>汇率</label>
			<label>: ${po.exchangeRate!''}</label>
			<#if status != 6>
			<a href="javascript:void(0);" id="edit-exchangerate">修改</a>
			</#if>
		</div>
		</#if>
		<div class="f-col-4 f-row-1">
			<label class="f-required">合同编号</label>
			<#if status==1>
			<input tyle="text" value="${po.contractNo!''}" id="po-contractno" />
			<#else>
			<label>: ${po.contractNo!''}</label>
			<#--<#if status != 6>-->
			<#--<a href="javascript:void(0);" id="edit-contractno">修改</a>-->
			<#--</#if>-->
			</#if>
		</div>
		<div class="f-col-8 f-row-2">
			
			<label>
				入库物流备注
				<#if status==1>
				<textarea class="logistics" placeholder="请填写入库配送的物流单号信息"  id="po-headermemo">${po.remark}</textarea>
				<#else>
				: ${po.remark?html}
				</#if>
			</label>
		</div>
		<div class="f-col-2 f-row-1">
			<label>采购件数:</label>
			<span id="goods-count" class="u-counter">${po.purchaseCount?c}</span>
		</div>
		<div class="f-col-2 f-row-1">
			<label>采购金额:</label>
			<span id="goods-amount" class="u-counter">${po.purchaseAmount?c}</span>
		</div>
	</div>
	<div class="m-polines">
		<table class="poline-tab w-table">
			<colgroup>
				<col width="6%" /> 
				<col width="12%" />
				<col width="8%" />
				<col width="12%" />
				<col width="10%" />
				<#-- <#if status==1>
				<col width="8%" />
				</#if> -->
				<col width="8%" />
				<col width="8%" />
				<col width="10%" />
				<col width="12%" />
				<#if status==1>
				<col width="6%" />	
				</#if>	
				<#if status gte 3>
				<col width="8%" />
				<col width="6%" />
				<col width="6%" />
				</#if>						
			</colgroup>
			<thead>
				<tr>
					<th>商品ID</th>
					<th>商品名称</th>
					<th>跨境方式</th>
					<th>条形码</th>
					<th>SKU规格</th>					
					<#-- <#if status==1>  
					<th>参考单价</th>
					</#if> -->
					<th>采购单价</th>
					<th>采购数量</th>
					<th>金额小计</th>
					<th>备注</th>
					<#if status==1>
					<th>操作</th>
					</#if>
					<#if status gte 3>
					<#--<th>已入库</th>-->
					<th>良品</th>
					<th>次品</th>
					</#if>
				</tr>
			</thead>
			<tbody>
				<#list po.details as line>
				<tr data-goodsid="${line.inventory.goodsId?c}" data-skuid="${line.skuId}">
					<td class="goodsid ma">${line.inventory.goodsId?c}</td>
					<td class="goodsname ma">${line.inventory.goodsName}</td>
					<td class="import-type ma">${line.inventory.importType}</td>
					<td class="barcode ma">${line.inventory.barcode}</td>
					<td class="skudesc ma">${line.inventory.skuDesc}</td>
					<#if status==1>
					<#-- <td class="refprice ma">${line.referUnitPrice?default("")}</td> -->
					<td class="poprice ma">
						<input type="text" class="poprice-i" value="${line.purchaseUnitPrice}">
					</td>
					<td class="poqty ma">
						<input type="text" class="poqty-i" value="${line.purchaseCount?c}">
					</td>
					<td class="lineamount ma"> ${(line.purchaseCount * line.purchaseUnitPrice)?c}
					</td>
					<td class="linememo ma">	
						<textarea class="linememo-i">${line.remark}</textarea>
					</td>		
					<td class="lineaction ma">
						<a class="action-delete" href="#">删除</a>
					</td>
					<#else>

					<td class="poprice ma">
						${line.purchaseUnitPrice}
					</td>
					<td class="poqty ma">
						${line.purchaseCount?c}
					</td>
					<td class="lineamount ma"> ${(line.purchaseCount * line.purchaseUnitPrice)?c}
					</td>
					<td class="linememo ma">	
						${line.remark?html}	
					</td>
					<#if status gte	3>
					<#--<td class="ma">${line.storedCount?c}</td>-->
					<td class="ma"><input type="text" class="poqty-i good-qty-i"></td>
					<td class="ma"><input type="text" class="poqty-i bad-qty-i"></td>
					</#if>	

					</#if>
				</tr>
				</#list>
			</tbody>
		</table>
	</div>
	<div class="m-line-ctrl">
        <input type="button" value="虚拟入库" class="w-btn w-btn-red u-btn" id="mimicBtn">
		<#if status==1>
		<input type="button" value="添加商品" class="w-btn w-btn-blue u-btn" id="addBtn">
		<#elseif status==2>
		<input type="button" value="审核通过" class="w-btn w-btn-blue u-btn" id="approveBtn">
		<input type="button" value="审核驳回" class="w-btn w-btn-blue u-btn" id="rejectBtn">
		<#elseif status==4>
		<#--<input type="button" value="入库确认" class="w-btn w-btn-blue u-btn" id="confirmBtn">-->
		<#--<input type="button" value="入库拒绝" class="w-btn w-btn-blue u-btn" id="refuseBtn">-->
		</#if>
	</div>
	<div class="m-action-history">
		<h5 class="title">操作记录</h5>
		<div class="logs">
		<#list po.logs as log>
		<p class="detail">${log.operatorName?default("null")?html} 于 ${log.time?number_to_datetime?string("yyyy-MM-dd HH:mm:ss")} ${log.action}；${log.remark?? ?string("备注：","")}${log.remark?default("")?html}</p>
		</#list>
		</div>
	</div>	
</div>
</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<#-- 商品选择清单模板 -->
<#noparse>
<textarea class="f-hide" name="jst" id="jst-itemlist">
	<div>
		<label>商品名称</label>
		<input type="text" style="width:120px;" class="pname" />
		<label>商品ID</label>
		<input type="text" style="width:120px;" class="pid" />
		<input type="button" value="搜索" class="w-btn w-btn-blue" onclick="haitao.g.filterProducts(event)">
	</div>
	<ul class="itemlist">
	{list items as item}
		<li class="itementry" data-goodsid="${item.goodsId}">
			<label class="item name" >
			    <input type="checkbox" value="1">(${item.importType|escape})${item.goodsName|escape}
			</label>
		{list item.skuList as sku}
			<label class="item sku">
			    <input type="checkbox" data-skuid="${sku.skuId}">${sku.skuDesc|escape}【${sku.skuCode}】
			</label>
		{/list}			
		</li>
	{/list}
	</ul>
</textarea>
</#noparse>
<#noparse>
<textarea class="f-hide" name="jst" id="jst-ullist">
	{list items as item}
		<li class="itementry" data-goodsid="${item.goodsId}">
			<label class="item name" >
			    <input type="checkbox" value="1">(${item.importType|escape})${item.goodsName|escape}
			</label>
		{list item.skuList as sku}
			<label class="item sku">
			    <input type="checkbox" data-skuid="${sku.skuId}">${sku.skuDesc|escape}【${sku.skuCode}】
			</label>
		{/list}			
		</li>
	{/list}
</textarea>
</#noparse>
<#noparse>
<textarea class="f-hide" name="jst" id="jst-new-poline">
	{list lines as line}
	<tr data-goodsid="${line.goodsId}" data-skuid="${line.skuId}">
		<td class="goodsid ma">${line.goodsId}</td>
		<td class="goodsname ma">${line.goodsName|escape}</td>
		<td class="import-type ma">${line.importType|escape}</td>
		<td class="barcode ma">${line.barcode|escape}</td>
		<td class="skudesc ma">${line.skuDesc|escape}</td>
		<td class="poprice ma">
			<input type="text" class="poprice-i">
		</td>
		<td class="poqty ma">
			<input type="text" class="poqty-i">
		</td>
		<td class="lineamount ma">
		</td>
		<td class="linememo ma">
			<textarea class="linememo-i"><&#47textarea>			
		</td>		
		<td class="lineaction ma">
			<a class="action-delete" href="#">删除</a>
		</td>
	</tr>
	{/list}
</textarea>
<textarea  class="f-hide" name="jst" id="jst-approve">
	<div class="simple-content">
		确定要审核：<span class="f-hightlight">${poNumber}</span> 这笔采购单吗？		
	</div>
</textarea>
<textarea  class="f-hide" name="jst" id="jst-submit">
	<div class="simple-content">
		确定要提交：<span class="f-hightlight">${poNumber}</span> 这笔采购单吗？		
	</div>
</textarea>
<textarea  class="f-hide" name="jst" id="jst-confirm">
	<div class="confirm-content">
		<span class="confirm-text">确定要对：<span class="f-hightlight">${poNumber} </span>这笔采购单进行入库确认？</span>
		<p>确认后库存会更新到前台</p>
		<div style="margin-bottom:10px;">
		<label class="f-required">汇率
			<input class="confirm-exchange"}/>
		</label>
		</div>
		<label class="f-required">备注
			<textarea class="confirm-memo"><&#47textarea>
		</label>
	</div>
</textarea>
<textarea  class="f-hide" name="jst" id="jst-refuse">
	<div class="confirm-content">
		<span class="confirm-text">确定要对：<span class="f-hightlight">${poNumber} </span>这笔采购单进行入库拒绝？</span>
		<br>
		<label class="f-required">备注
			<textarea class="confirm-memo"><&#47textarea>
		</label>
	</div>
</textarea>
</#noparse>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/mimic_stockin.js"></script>
</body>
</html>
