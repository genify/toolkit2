<#-- 分账对账 订单销售统计:{/backend/stat/order/sale} -->
<#-- Created by zmm on 22/12/14. -->
<#compress>
<#include "../wrapper/import.ftl">
<@htmHead title="订单销售_分账对账">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main m-sticOrderSale">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">订单销售查询</h2>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group">
                            <label class="title">支付方式:</label>
                            <select name="paymethod">
                                <option value="-1">全部</option>
                                <option value="1">网易宝跨境</option>
                                <option value="2">支付宝跨境</option>
                                <option value="3">网易宝国内</option>
                                <option value="4">支付宝国内</option>
                                <option value="0">其他</option>
                            </select>

                            <label class="title">订单状态:</label>
                            <select name="state">
                                <option value="0">全部</option>
                                <option value="1">待发货</option>
                                <option value="2">已发货</option>
                                <option value="3">交易完成</option>
                                <option value="4">交易失败</option>
                            </select>

                            <label class="title">是否退款:</label>
                            <select name="refund">
                                <option value="0">全部</option>
                                <option value="1">是</option>
                                <option value="2">否</option>
                            </select>

                            <label class="title">跨境方式:</label>
                            <select name="import">
                                <option value="-1">全部</option>
                                <option value="0">直邮</option>
                                <option value="1">保税</option>
                                <option value="2">海淘</option>
                            </select>
                        </div>
                        <div class="group">
                            <label class="title">物流公司:</label>
                            <select name="logistic">
                                <option value="0">全部</option>
                            <#list logistics![] as item>
                                <option value="${item.logisticsId}">${item.logisCompanyName}</option>
                            </#list>
                            </select>

                            <label class="title">发货仓库:</label>
                            <select name="storage">
                                <option value="0">全部</option>
                            <#list storages![] as item>
                                <option value="${item.warehouseId}">${item.warehouseName}</option>
                            </#list>
                            </select>
                        </div>
                        <div class="group">
                            <label class="title">订单编号:</label>
                            <input type="text" placeholder="输订单编号" name="order" value="${order!""}"/>

                            <select name="timetype" style="margin-left: 30px">
                                <option value="1">支付时间</option>
                                <option value="2">发货时间</option>
                                <option value="3">分账时间</option>
                                <option value="4">交易完成时间</option>
                            </select>
                            &nbsp;
                            <input type="text" id="J-starttime" class="date wd100" readonly="readonly" value="${starttime!""}" placeholder="开始日期"/>
                            &nbsp;-
                            <input type="text" id="J-endtime" class="date wd100" readonly="readonly" value="${endtime!""}" placeholder="结束日期"/>
                        </div>
                        <div class="group-col1">
                            <button name="searchBtn" class="w-btn w-btn-black">查询</button>
                            <button name="exportBtn" class="w-btn w-btn-black">导出</button>
                        </div>
                    </div>
                </div>

                <div id="j-databox"></div>
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/statistics/orderSale.js"></script>
</body>
</html>
</#compress>