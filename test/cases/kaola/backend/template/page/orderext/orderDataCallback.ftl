<#-- 查询订单推送报文与回执:{/backend/orderExtMaintain/orderCallback?orderId=} -->
<#-- 查询运单推送报文与回执:{/backend/orderExtMaintain/waybillCallback?orderId=} -->
<#-- 查询支付确认单推送报文与回执:{/backend/orderExtMaintain/payConfirmCallback?orderId=} -->
<#-- 查询申报单推送报文与回执:{/backend/orderExtMaintain/goodsDeclareCallback?orderId=} -->
<#-- Created by zmm on 6/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="${cbType}报文与回执">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div id="docContent" class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">${cbType} 同步回执</h2>
                    </div>
                    <div class="detail">
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th class="cmax1">订单号</th>
                                <th>业务编号</th>
                                <th>接收时间</th>
                                <th>处理结果</th>
                                <th>请求报文</th>
                                <th>响应报文</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#list syncCallbacks![] as item>
                                <tr>
                                    <td>${item.id!''}</td>
                                    <td>${item.orderId!''}</td>
                                    <td>${item.businessNo!''}</td>
                                    <td>${item.receiveTime?number_to_date?string("yyyy-MM-dd HH:mm:ss")}</td>
                                    <td>${item.stateString!''}</td>
                                    <td>
                                        <button class="w-btn w-btn-white ztag">详情</button>
                                        <div class="f-hide"><textarea class="xmlarea">${item.requestXml!''}</textarea></div>
                                    </td>
                                    <td>
                                        <button class="w-btn w-btn-white ztag">详情</button>
                                        <div class="f-hide"><textarea class="xmlarea">${item.callbackXml!''}</textarea></div>
                                    </td>
                                </tr>
                            </#list>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">${cbType} 异步回执</h2>
                    </div>
                    <div class="detail">
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th class="cmax1">订单号</th>
                                <th>业务编号</th>
                                <th>电子口岸处理时间</th>
                                <th>接收时间</th>
                                <th>处理结果</th>
                                <th>解析验证状态</th>
                                <th>响应报文</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#list asyncCallbacks![] as item>
                                <tr>
                                    <td>${item.id!''}</td>
                                    <td>${item.orderId!''}</td>
                                    <td>${item.businessNo!''}</td>
                                    <td>${item.noticeTime?number_to_date?string("yyyy-MM-dd HH:mm:ss")}</td>
                                    <td>${item.receiveTime?number_to_date?string("yyyy-MM-dd HH:mm:ss")}</td>
                                    <td>${item.stateString!''}</td>
                                    <td>${item.verifyStateString!''}</td>
                                    <td>
                                        <button class="w-btn w-btn-white ztag">详情</button>
                                        <div class="f-hide"><textarea class="xmlarea">${item.callbackXml!''}</textarea></div>
                                    </td>
                                </tr>
                            </#list>
                            </tbody>
                        </table>
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
        '{pro}widget/window/warningWin.js',
    ],function(_s){
        var _elements = nej.e._$getByClassName('docContent','ztag');
        nej.u._$forEach(_elements, function (_element) {
            nej.v._$addEvent(_element, 'click', function(_event){
                var _content = nej.e._$getSibling(_event.target);
                var _delDialog = haitao.bw._$$WarningWindow._$allocate({
                    parent: document.body,
                    content: _content.innerHTML,
                    onlyclosebtn: true,
                    mask: 'w-winmask'
                });
                _delDialog._$show();
            })

        }, this);

    });
</script>
</body>
</html>