<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">请登录系统查看:</font><a href="http://ms.kaola.com/backend/login">haitao后台</a>
</div>
<br/>
<!-- table 1-->
<#if (pendingStockInPurchaseList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">待入库的采购单一共${(pendingStockInPurchaseList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (pendingStockInPurchaseList?exists && pendingStockInPurchaseList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            合同号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            预计入库时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
    </tr>
    <#list pendingStockInPurchaseList as pendingStockInPurchase >
        <#assign tableTrBackground = "#d4e3e5">
        <#if (pendingStockInPurchase_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(pendingStockInPurchase.no)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(pendingStockInPurchase.contractNo)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(pendingStockInPurchase.time)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(pendingStockInPurchase.storageName)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(pendingStockInPurchase.goodsNames)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<!-- table 2-->
<#if (contentPendingConfirmList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">待入库确认的采购单一共${(contentPendingConfirmList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (contentPendingConfirmList?exists && contentPendingConfirmList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            合同号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
    </tr>
    <#list contentPendingConfirmList as contentPendingConfirm>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (contentPendingConfirm_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingConfirm.no)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingConfirm.contractNo)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingConfirm.time)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingConfirm.storageName)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingConfirm.goodsNames)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<!-- table 3-->
<#if (contentPendingPickList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">未审核的提货出库单数量一共${(contentPendingPickList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (contentPendingPickList?exists && contentPendingPickList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
    </tr>

    <#list contentPendingPickList as contentPendingPick>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (contentPendingPick_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingPick.no)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingPick.time)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingPick.storageName)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingPick.goodsNames)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<!-- table 4-->
<#if (contentPendingProfitList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">未审核的盘盈入库单数量一共${(contentPendingProfitList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (contentPendingProfitList?exists && contentPendingProfitList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
    </tr>
    <#list contentPendingProfitList as contentPendingProfit>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (contentPendingProfit_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingProfit.no)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingProfit.time)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingProfit.storageName)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingProfit.goodsNames)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<!-- table 5-->
<#if (contentPendingLossList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">未审核的盘亏出库单数量一共${(contentPendingLossList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (contentPendingLossList?exists && contentPendingLossList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
    </tr>
    <#list contentPendingLossList as contentPendingLoss>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (contentPendingLoss_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingLoss.no)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingLoss.time)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingLoss.storageName)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentPendingLoss.goodsNames)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<!-- table 6-->
<#if (contentExceptionList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">仓库中处于异常状态的订单数量一共${(contentExceptionList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (contentExceptionList?exists && contentExceptionList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            订单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            收货姓名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            异常类型
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名称
        </th>
    </tr>
    <#list contentExceptionList as contentException>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (contentException_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentException.orderNo)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentException.receiverName)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentException.exceptionType)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentException.storageName)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<!-- table 13-->
<#if (gooodInventoryList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">仓库良品库存和后台良品库存不一致的sku一共${(gooodInventoryList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (gooodInventoryList?exists && gooodInventoryList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            料号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            后台良品数量
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库良品数量
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名称
        </th>
    </tr>
    <#list gooodInventoryList as gooodInventory>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (gooodInventory_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(gooodInventory.productId)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(gooodInventory.productName)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(gooodInventory.productSkuCode)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(gooodInventory.backendGoodNum)!"0"}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(gooodInventory.storageGoodNum)!"0"}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(gooodInventory.storageName)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<!-- table 7-->
<#if (contentInventoryList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">仓库次品库存和后台次品库存不一致的sku一共${(contentInventoryList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (contentInventoryList?exists && contentInventoryList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            料号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            后台次品数量
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库次品数量
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名称
        </th>
    </tr>
    <#list contentInventoryList as contentInventory>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (contentInventory_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentInventory.productId)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentInventory.productName)!""}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentInventory.productSkuCode)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentInventory.backendBadNum)!"0"}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentInventory.storageBadNum)!"0"}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(contentInventory.storageName)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<!-- table 8-->
<#if (longTimeNotHandleList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">长时间未处理的订单一共${(longTimeNotHandleList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (longTimeNotHandleList?exists && longTimeNotHandleList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            订单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            支付状态
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            支付时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            审核状态
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            网仓中状态
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            是否在黑名单
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库名称
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            购买人姓名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            购买人电话
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            主要商品
        </th>
    </tr>
    <#list longTimeNotHandleList as longTimeNotHandleOrder>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (longTimeNotHandleOrder_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${longTimeNotHandleOrder.orderNo}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${longTimeNotHandleOrder.paymentStateStr}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${longTimeNotHandleOrder.time}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${longTimeNotHandleOrder.verifyStateStr}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${longTimeNotHandleOrder.stockStateStr}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(longTimeNotHandleOrder.inBlackListStr)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(longTimeNotHandleOrder.storageName)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(longTimeNotHandleOrder.purchaseName)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(longTimeNotHandleOrder.purchaseTel)!""}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${(longTimeNotHandleOrder.mainGoodsName)!""}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<!-- table 9-->
<#if (overSoldSKUList?exists) >

<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">仓库库存可用数小于0的SKU一共${(overSoldSKUList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (overSoldSKUList?exists && overSoldSKUList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            SKU ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            前台库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            后台库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库可用数
        </th>
    </tr>
    <#list overSoldSKUList as overSoldSKU>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (overSoldSKU_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${overSoldSKU.productName}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${overSoldSKU.skuID}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
            ${overSoldSKU.countInMM}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${overSoldSKU.storageCount}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${overSoldSKU.countInStock}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${overSoldSKU.goodAvailabeInStock}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<!-- table 10-->
<#if (mayBeOverSoldOfSkuList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">前台库存大于仓库可用数的SKU一共${(mayBeOverSoldOfSkuList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (mayBeOverSoldOfSkuList?exists && mayBeOverSoldOfSkuList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            SKU ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            前台库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            后台库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库可用数
        </th>
    </tr>
    <#list mayBeOverSoldOfSkuList as mayBeOverSoldOfSku>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (mayBeOverSoldOfSku_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${mayBeOverSoldOfSku.productName}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${mayBeOverSoldOfSku.skuID}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
            ${mayBeOverSoldOfSku.countInMM}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${mayBeOverSoldOfSku.storageCount}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${mayBeOverSoldOfSku.countInStock}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${mayBeOverSoldOfSku.goodAvailabeInStock}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<!-- table 11-->
<#if (blackListSkuList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">黑名单里面的SKU一共${(blackListSkuList?size)!"0"}个: </font>
</div>
<br/>
</#if>
<#if (blackListSkuList?exists && blackListSkuList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            SKU ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            前台库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            后台库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库库存数
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            仓库可用数
        </th>
    </tr>
    <#list blackListSkuList as blackListSku>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (blackListSku_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${blackListSku.productName}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${blackListSku.skuID}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
            ${blackListSku.countInMM}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${blackListSku.storageCount}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${blackListSku.countInStock}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${blackListSku.goodAvailabeInStock}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<!-- table 12-->
<#if (ordersInBlackList?exists) >
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">黑名单里面的ORDER一共${orderCount!"0"}个: </font>
</div>
<br/>
</#if>
<#if (ordersInBlackList?exists && ordersInBlackList?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            订单号
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            购买人
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            支付时间
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            SKU ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            数量
        </th>
    </tr>
    <#list ordersInBlackList as orderInfo>
        <#assign tableTrBackground = "#d4e3e5">
        <#if (orderInfo_index % 2 ==0) >
            <#assign tableTrBackground = "#c3dde0">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${orderInfo.orderNo}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${orderInfo.purchaseName}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
            ${orderInfo.time}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${orderInfo.skuID}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${orderInfo.productName}
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
            ${orderInfo.counts}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>

<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <br/>
    <font style="font-weight: bold">请各位负责同学及时发现和处理异常情况，技术问题请联系:</font><br/>
    <font style="font-weight: bold">陈侃：chenkan@corp.netease.com</font><br/>
    <font style="font-weight: bold">于红征：hzyuhongzheng@corp.netease.com</font><br/>
    <font style="font-weight: bold">进销存Wiki:</font><a href="http://doc.hz.netease.com/pages/viewpage.action?pageId=42560727">http://doc.hz.netease.com/pages/viewpage.action?pageId=42560727</a>
</div>