<!-- table 1-->
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">出库单号:${(stockOutRecord.id)!""}&nbsp;&nbsp;&nbsp;&nbsp;相关单号:${(stockOutRecord.relatedId)!""}</font>
</div>
<br/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">出库仓库:${(stockOutRecord.storageName)!""}&nbsp;&nbsp;&nbsp;&nbsp;出库时间:${
    (stockOutTime)!""}&nbsp;&nbsp;&nbsp;&nbsp;出库原因:${(stockOutCause)!""}</font>
</div>
<br/>
<#if (stockOutDetails?exists && stockOutDetails?size != 0) >
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品ID
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            商品名称
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            条形码
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            出库数量
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            良品
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            次品
        </th>
    </tr>
    <#list stockOutDetails as stockOutDetail >
        <#assign tableTrBackground = "#c3dde0">
        <#if (stockOutDetail_index % 2 ==0) >
            <#assign tableTrBackground = "#d4e3e5">
        </#if>
        <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
            onmouseout="this.style.backgroundColor='#d4e3e5';">
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                <#if (stockOutDetail.inventory)?exists>
                    ${(stockOutDetail.inventory.goodsId)!""}
                </#if>
            </td>
            <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                <#if (stockOutDetail.inventory)?exists>
                     ${(stockOutDetail.inventory.goodsName)!""}
                </#if>
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                <#if (stockOutDetail.inventory)?exists>
                    ${(stockOutDetail.inventory.barcode)!""}
                </#if>
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(stockOutDetail.count)!"0"}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(stockOutDetail.goodCount)!"0"}
            </td>
            <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                ${(stockOutDetail.badCount)!"0"}
            </td>
        </tr>
    </#list>
</table>
<br/>
</#if>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;"><font
        style="font-weight: bold">请登录系统进行确认:</font><a href="http://ms.kaola.com/backend/login">haitao后台</a>
</div>