<#include "../wrapper/import.ftl">
<@htmHead title="进销存-核对SKU库存功能">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css" xmlns="http://www.w3.org/1999/html">
<link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-upside f-cb">
                <p>
                    <span class="f-mr40">商品名称:${(goodsName)!""}</span>
                    <span class="f-mr40">SKU ID:${(skuId)!""}</span>
                </p>
            </div>

            <div class="m-content w-table">
                <p class="details">
                    <span class="f-mr40">良品总数：${(totalGoodCount)!"0"}</span>
                    <span class="f-mr40">次品总数：${(totalBadCount)!"0"}</span>
                </p>
                <table width="600" style="table-layout: fixed">
                    <thead>
                    <tr>
                        <th title="类型">类型</th>
                        <th title="单号">单号</th>
                        <th title="良品数">良品数</th>
                        <th title="次品数">次品数</th>
                        <th title="成本">成本</th>
                        <th title="入库时间">入库时间</th>
                        <th title="销售状态">销售状态</th>
                    </tr>
                    </thead>
                    <tbody class="list hasborder" style="border: 1px solid #bbb;">
                    <#if (purchaseOrders?exists && purchaseOrders?size != 0) >
						<#assign currentGoodsNumber=0/>	
						<#assign soldFlag = 0 />
                        <#list purchaseOrders as purchaseOrder >
							<#assign currentGoodsNumber = currentGoodsNumber + purchaseOrder.goodsNumber />
							<#assign purchaseOrderCost = purchaseOrder.cost * purchaseOrder.exchangeRate>
                            <tr>
                                <td title="类型">${(purchaseOrder.type)!""}</td>
                                <td title="单号">${(purchaseOrder.number)!""}</td>
                                <td title="良品数">${(purchaseOrder.goodsNumber)!"0"}</td>
                                <td title="次品数">${(purchaseOrder.badNumber)!"0"}</td>
								<td title="成本">${(purchaseOrderCost)!""}</td>
								<td title="入库时间">${(purchaseOrder.createTime?string("yyyy-MM-dd HH:mm:ss"))}</td>																								
								<#if currentGoodsNumber lte totalSaleGoodCount>
								<td title="销售状态">已售完</td>
								<#elseif currentGoodsNumber gt totalSaleGoodCount && soldFlag = 0>
								<td title="销售状态">正在销售</td>
								<#assign soldFlag = 1 />
								<#else>
								<td title="销售状态"></td>
								</#if>																
                            </tr>
                        </#list>
                    </#if>

                    <#if (profitList?exists && profitList?size != 0) >
                        <#list profitList as profit >
                        <tr>
                            <td title="类型">${(profit.type)!""}</td>
                            <td title="单号">${(profit.number)!""}</td>
                            <td title="良品数">${(profit.goodsNumber)!"0"}</td>
                            <td title="次品数">${(profit.badNumber)!"0"}</td>
                            <td title="成本"></td>
							<td title="入库时间"></td>
							<td title="销售状态"></td>
                        </tr>
                        </#list>
                    </#if>

                    <#if (lossList?exists && lossList?size != 0) >
                        <#list lossList as loss >
                        <tr>
                            <td title="类型">${(loss.type)!""}</td>
                            <td title="单号">${(loss.number)!""}</td>
                            <td title="良品数">${(loss.goodsNumber)!"0"}</td>
                            <td title="次品数">${(loss.badNumber)!"0"}</td>
							<td title="成本"></td>
							<td title="入库时间"></td>
							<td title="销售状态"></td>
                        </tr>
                        </#list>
                    </#if>

                    <#if (pickList?exists && pickList?size != 0) >
                        <#list pickList as pick >
                        <tr>
                            <td title="类型">${(pick.type)!""}</td>
                            <td title="单号">${(pick.number)!""}</td>
                            <td title="良品数">${(pick.goodsNumber)!"0"}</td>
                            <td title="次品数">${(pick.badNumber)!"0"}</td>
							<td title="成本"></td>
							<td title="入库时间"></td>
							<td title="销售状态"></td>
                        </tr>
                        </#list>
                    </#if>
                    <#if (totalSaleGoodCount?exists && totalSaleGoodCount != 0) >
                        <tr>
                            <td title="类型">销售</td>
                            <td title="单号"></td>
                            <td title="良品数">${(totalSaleGoodCount)!"0"}</td>
                            <td title="次品数"></td>
							<td title="成本"></td>
							<td title="入库时间"></td>
							<td title="销售状态"></td>
                        </tr>
                    </#if>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
</body>
</html>