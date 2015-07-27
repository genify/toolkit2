<#-- {退款统计-分账对账}:{/backend/stat/refund/getRefundList} -->
<#-- Created by zmm on 7/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="退款统计_财务对账">
<link rel="stylesheet" type="text/css" href="${css_root}module/trade/refund.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">退款数据列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform f-clearfix">
                            <div class="group f-fl">
                                <button id="exportBtn" class="w-btn w-btn-black">导出</button>

                                <label style="margin-left: 20px">退款合计:<b class="color-red">${totalAmount!0}</b>元</label>
                            </div>
                            <div class="group f-fr">
                                <label class="title">支付方式:</label>
                                <select name="paymethod">
                                    <option value="-1" <#if paymethod?int == -1>selected</#if>>全部</option>
                                    <option value="1" <#if paymethod?int == 1>selected</#if>>网易宝跨境</option>
                                    <option value="2" <#if paymethod?int == 2>selected</#if>>支付宝跨境</option>
                                    <option value="3" <#if paymethod?int == 3>selected</#if>>网易宝国内</option>
                                    <option value="4" <#if paymethod?int == 4>selected</#if>>支付宝国内</option>
                                    <option value="0" <#if paymethod?int == 0>selected</#if>>其他</option>
                                </select>

                                <label class="title">时间区间:</label>
                                <select name="year" class="wd100">
                                    <#list yearList as item>
                                    <option value="${item}" <#if year?int == item>selected</#if>>${item}</option>
                                    </#list>
                                </select>
                                <span>年&nbsp;&nbsp;</span>
                                <select name="month" class="wd100">
                                    <#list 1..12 as item>
                                        <option value="${item}" <#if month?int == item>selected</#if>>${item}</option>
                                    </#list>
                                </select>
                                <span>月&nbsp;&nbsp;</span>

                                <label class="title">订单编号:</label>
                                <input type="text" name="orderid" value="${orderId!''}" placeholder="输入订单编号"/>

                                <button id="searchBtn" class="w-btn w-btn-black" style="margin-left: 15px">搜索</button>
                            </div>
                        </div>
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>售后服务单号</th>
                                <th>订单编号</th>
                                <th>商品名称</th>
                                <th>退货数量</th>
                                <th>退款金额</th>
                                <th>支付方式</th>
                                <th>退款账户</th>
                                <th>退款类型</th>
                                <th>退回运费</th>
                                <th>退款时间</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#if (refundViewList![])?size gt 0>
                                <#list refundViewList as item>
                                <#if item.goodsNameAndNumList?has_content && item.goodsNameAndNumList?size != 0>
                                    <#assign rowspan = item.goodsNameAndNumList?size />
                                    <#list item.goodsNameAndNumList as sku>
                                    <#if sku_index == 0>
                                        <tr>
                                            <td rowspan="${rowspan}">${item.outId!''}</td>
                                            <td rowspan="${rowspan}">${item.orderOutId!''}</td>
                                            <td>${sku.name!''}</td>
                                            <td>${sku.count!''}</td>
                                            <td rowspan="${rowspan}">${item.goodsFee!''}</td>
                                            <td rowspan="${rowspan}">
                                                <#assign itrade=(item.payMethod!0)?int />
                                                <#if itrade==1>网易宝跨境
                                                <#elseif itrade==2>支付宝跨境
                                                <#elseif itrade==3>网易宝国内
                                                <#elseif itrade==4>支付宝国内
                                                <#elseif itrade==0>其他</#if>
                                            </td>
                                            <td rowspan="${rowspan}">${item.accountOut!''}</td>
                                            <td rowspan="${rowspan}">
                                                <#assign ifrom=(item.from!0)?int />
                                                <#if ifrom==1>交易失败自动退款
                                                <#elseif ifrom==2>已关单支付成功自动退款
                                                <#elseif ifrom==0>售后退款</#if>
                                            </td>
                                            <td rowspan="${rowspan}">${item.expressFee!''}</td>
                                            <td rowspan="${rowspan}">${item.transferTime?number_to_date?string('yyyy-MM-dd HH:mm:ss')}</td>
                                        </tr>
                                    <#else>
                                        <tr>
                                            <td>${sku.name!''}</td>
                                            <td>${sku.count!''}</td>
                                        </tr>
                                    </#if>
                                    </#list>
                                <#else>
                                    <#assign rowspan = 1 />
                                    <tr>
                                        <td rowspan="${rowspan}">${item.outId!''}</td>
                                        <td rowspan="${rowspan}">${item.orderOutId!''}</td>
                                        <td>${item.goodsName!''}</td>
                                        <td>${item.goodsNum!''}</td>
                                        <td rowspan="${rowspan}">${item.goodsFee!''}</td>
                                        <td rowspan="${rowspan}">
                                            <#assign itrade=(item.payMethod!0)?int />
                                            <#if itrade==1>网易宝跨境
                                            <#elseif itrade==2>支付宝跨境
                                            <#elseif itrade==3>网易宝国内
                                            <#elseif itrade==4>支付宝国内
                                            <#elseif itrade==0>其他</#if>
                                        </td>
                                        <td rowspan="${rowspan}">${item.accountOut!''}</td>
                                        <td rowspan="${rowspan}">
                                            <#assign ifrom=(item.from!0)?int />
                                            <#if ifrom==1>交易失败自动退款
                                            <#elseif ifrom==2>已关单支付成功自动退款
                                            <#elseif ifrom==0>售后退款</#if>
                                        </td>
                                        <td rowspan="${rowspan}">${item.expressFee!''}</td>
                                        <td rowspan="${rowspan}">${item.transferTime?number_to_date?string('yyyy-MM-dd HH:mm:ss')}</td>
                                    </tr>
                                </#if>
                                </#list>
                            <#else>
                            <tr><td colspan=10>当前数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                        <@lpager2 totalSize=counts limit=limit offset=offset url="/backend/stat/refund/getRefundList?paymethod=${paymethod!''}&year=${year!''}&month=${month!''}&orderId=${orderId!''}" />
                    </div>
                </div>
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script type="text/javascript">
    NEJ.define([
        'pro/widget/module',
        '{lib}util/chain/chainable.js',
        '{pro}widget/window/warningWin.js'
    ],function(_sys,_q,_win){
        _q('#exportBtn')._$on('click', function(){
            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在导出结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            window.location.href = "/backend/stat/refund/getRefundList?export=true&year="
                    + _q('select[name="year"]')._$val()
                    + "&month=" + _q('select[name="month"]')._$val()
                    + "&orderId=" + _q('input[name="orderid"]')._$val()
                    + "&paymethod=" + _q('select[name="paymethod"]')._$val();
        });
        _q('#searchBtn')._$on('click', function(){
            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在查询结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            window.location.href = "/backend/stat/refund/getRefundList?year="
                    + _q('select[name="year"]')._$val()
                    + "&month=" + _q('select[name="month"]')._$val()
                    + "&orderId=" + _q('input[name="orderid"]')._$val()
                    + "&paymethod=" + _q('select[name="paymethod"]')._$val();
        });
    });
</script>
</body>
</html>

