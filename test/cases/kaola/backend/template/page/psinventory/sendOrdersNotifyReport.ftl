<!-- table 1-->
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">未发货仓库信息报警摘要：</font><br/>
    <font style="font-weight: bold">1.和达仓库(下沙保税仓)</font>
</div>
<br/>
<#if wcOrderMap?exists>
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            支付时间（天）
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            订单数量（个）
        </th>
    </tr>
    <#list wcOrderMap?keys as wcOrderMapKey>
    <tr>
        <#assign wclist = .globals.wcOrderMap[wcOrderMapKey]>
        <#if wcOrderMap?exists>
            <#assign tableTrBackground = "#c3dde0">
            <#assign tableTrBackground = "#d4e3e5">
            <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
                onmouseout="this.style.backgroundColor='#d4e3e5';">
                <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${wcOrderMapKey !""}
                </td>
                <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${wclist?size !""}
                </td>
            </tr>
        </#if>
        </tr>
    </#list>
</table>
</#if>
<br/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">2.神马仓库(网易6号仓)</font>
</div>
<#if smOrderMap?exists>
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            支付时间（天）
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            订单数量（个）
        </th>
    </tr>
    <#list smOrderMap?keys as smOrderMapKey>
    <tr>
        <#assign smlist = .globals.smOrderMap[smOrderMapKey]>
        <#assign tableTrBackground = "#c3dde0">
        <#if smOrderMap?exists>
            <#assign tableTrBackground = "#d4e3e5">
            <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
                onmouseout="this.style.backgroundColor='#d4e3e5';">
                <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${smOrderMapKey !""}
                </td>
                <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${smlist?size !""}
                </td>
            </tr>
        <#--</#list>-->
        </#if>
        </tr>
    </#list>
</table>
</#if>
<br/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">3.中外运（美国洛杉矶仓库）</font>
</div>
<br/>
<#if zwyOrderMap?exists>
<table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
    <tr style="background-color:#d4e3e5;">
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            支付时间（天）
        </th>
        <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
            订单数量（个）
        </th>
    </tr>
    <#assign tableTrBackground = "#c3dde0">
    <#list zwyOrderMap?keys as zwyOrderMapKey>
    <tr>
        <#assign zwylist = .globals.zwyOrderMap[zwyOrderMapKey]>
        <#if zwyOrderMap?exists>
            <#assign tableTrBackground = "#d4e3e5">
            <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
                onmouseout="this.style.backgroundColor='#d4e3e5';">
                <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${zwyOrderMapKey !""}
                </td>
                <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                ${zwylist?size !""}
                </td>
            </tr>
        </#if>
        </tr>
    </#list>
</table>
</#if>
<br/>

<hr/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">保税仓库</font>
    <font style="font-weight: bold">${title_wc}</font>
</div>
<hr/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">和达仓库(下沙保税仓)一共${wcCount}个:</font>
</div>
<br/>
<#if wcOrderMap?exists>
    <#list wcOrderMap?keys as wcOrderMapKey>
    <tr>
        <#assign wclist = .globals.wcOrderMap[wcOrderMapKey]>
        <#if (wclist?exists && wclist?size != 0) >
            <div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
                <font style="font-weight: bold">
                    <td>支付时间：${wcOrderMapKey}</td>&nbsp;&nbsp;&nbsp;&nbsp;
                    <td>订单数量：${wclist?size}</td>
                </font>
            </div>
            <table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
                <tr style="background-color:#d4e3e5;">
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        订单号
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        库存状态
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        支付时间
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        购买人
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        主要商品名称
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        收货地址
                    </th>
                </tr>
                <#list wclist as wcOrder >
                    <#assign tableTrBackground = "#c3dde0">
                    <#if (wcOrder_index % 2 ==0) >
                        <#assign tableTrBackground = "#d4e3e5">
                    </#if>
                    <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
                        onmouseout="this.style.backgroundColor='#d4e3e5';">
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(wcOrder.orderNo)!""}
                        </td>
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(wcOrder.orderStatus)!""}
                        </td>
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(wcOrder.payTime)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(wcOrder.purchaserName)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(wcOrder.mainGoodsName)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(wcOrder.purchaseAddress)!""}
                        </td>
                    </tr>
                </#list>
            </table>
            <br><br>
        </#if>
    </tr>
    </#list>
</#if>
<br/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">神马仓库(网易6号仓)一共${smCount}个:</font>
</div>
<br/>
<#if smOrderMap?exists>
    <#list smOrderMap?keys as smOrderMapKey>
    <tr>
        <#assign smlist = .globals.smOrderMap[smOrderMapKey]>
        <#if (smlist?exists && smlist?size != 0) >
            <div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
                <font style="font-weight: bold">
                    <td>支付时间：${smOrderMapKey}</td>&nbsp;&nbsp;&nbsp;&nbsp;
                    <td>订单数量：${smlist?size}</td>
                </font>
            </div>
            <table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
                <tr style="background-color:#d4e3e5;">
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        订单号
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        库存状态
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        支付时间
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        购买人
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        主要商品名称
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        收货地址
                    </th>
                </tr>
                </tr>
                <#list smlist as smOrder >
                    <#assign tableTrBackground = "#c3dde0">
                    <#if (smOrder_index % 2 ==0) >
                        <#assign tableTrBackground = "#d4e3e5">
                    </#if>
                    <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
                        onmouseout="this.style.backgroundColor='#d4e3e5';">
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(smOrder.orderNo)!""}
                        </td>
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(smOrder.orderStatus)!""}
                        </td>
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(smOrder.payTime)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(smOrder.purchaserName)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(smOrder.mainGoodsName)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(smOrder.purchaseAddress)!""}
                        </td>
                    </tr>
                </#list>
            </table>
            <br><br>
        </#if>
    </tr>
    </#list>
</#if>
<hr/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">直邮仓库</font>
    <font style="font-weight: bold">${title_zy}</font>
</div>
<br/>
<div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
    <font style="font-weight: bold">中外运（美国洛杉矶仓库）一共${zwyCount}个:</font>
</div>
<br/>
<#if zwyOrderMap?exists>
    <#list zwyOrderMap?keys as zwyOrderMapKey>
    <tr>
        <#assign zwylist = .globals.zwyOrderMap[zwyOrderMapKey]>
        <#if (zwylist?exists && zwylist?size != 0) >
            <div style="font-family:verdana,arial,sans-serif,bold;font-size:15px;color:black;">
                <font style="font-weight: bold">
                    <td>支付时间：${zwyOrderMapKey}</td>&nbsp;&nbsp;&nbsp;&nbsp;
                    <td>订单数量：${zwylist?size}</td>
                </font>
            </div>
            <table style="font-family:verdana,arial,sans-serif;font-size:11px;color:#333333;border-color:#999999;border-collapse: collapse;border-width:1px">
                <tr style="background-color:#d4e3e5;">
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        订单号
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        库存状态
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        支付时间
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        购买人
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        主要商品名称
                    </th>
                    <th style="background-color:#c3dde0;border-width:1px; padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        收货地址
                    </th>
                </tr>
                </tr>
                <#list zwylist as zwyOrder >
                    <#assign tableTrBackground = "#c3dde0">
                    <#if (zwyOrder_index % 2 ==0) >
                        <#assign tableTrBackground = "#d4e3e5">
                    </#if>
                    <tr style="background-color:${tableTrBackground};" onmouseover="this.style.backgroundColor='#ffff66';"
                        onmouseout="this.style.backgroundColor='#d4e3e5';">
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(zwyOrder.orderNo)!""}
                        </td>
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(zwyOrder.orderStatus)!""}
                        </td>
                        <td style="border-width: 1px;padding:8px;border-style: solid;border-color: #a9c6c9;">
                        ${(zwyOrder.payTime)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(zwyOrder.purchaserName)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(zwyOrder.mainGoodsName)!""}
                        </td>
                        <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #a9c6c9;">
                        ${(zwyOrder.purchaseAddress)!""}
                        </td>
                    </tr>
                </#list>
            </table>
            <br><br>
        </#if>
    </tr>
    </#list>
</#if>
