<#-- Created by zmm on 21/11/14. -->
<#-- 订单列表页面：/orderExtMaintain -->

<#include "../wrapper/import.ftl">
<@htmHead title="订单管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
<style type="text/css">.detail .w-btn{margin:4px 10px 4px 0;}</style>
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">查询订单</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                            <div class="group">
                                <label class="title">进口类型:</label>
                                <select class="ztag">
                                <#list importTypeList as importType>
                                    <option value="${importType.index}">${importType.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">申报口岸:</label>
                                <select class="ztag">
                                <#list declPortList as declPort>
                                    <option value="${declPort.index}">${declPort.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">支付状态:</label>
                                <select class="ztag">
                                <#list paymentStateList as paymentState>
                                    <option value="${paymentState.index}">${paymentState.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">审核状态:</label>
                                <select class="ztag">
                                <#list verifyStateList as verifyState>
                                    <option value="${verifyState.index}">${verifyState.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">嫌疑类型:</label>
                                <select class="ztag">
                                <#list suspectedTypeList as suspectedType>
                                    <option value="${suspectedType.index}">${suspectedType.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">订单编号:</label>
                                <input type="text" value="" id="orderid"/>
                                <label class="title" style="min-width: 90px">收货姓名:</label>
                                <input type="text" value="" id="username" class="wd100"/>
                                <label class="title" style="min-width: 90px">电话号码:</label>
                                <input type="text" value="" id="phone" style="width:150px;"/>
                                <label class="title" style="min-width: 90px">收货地址:</label>
                                <input type="text" value="" id="purchaserAddress" style="width:150px;"/>
                                <label class="title" style="min-width: 90px">主要货物:</label>
                                <input type="text" value="" id="mainGoodsName" style="width:150px;"/>
                            </div>
                        </div>
                        <button id="btn" class="w-btn w-btn-black btag">搜索</button>
                        <button id="passverify" class="w-btn w-btn-black btag">审核通过</button>
                        <button id="failedverify" class="w-btn w-btn-black btag" style="float:right;">审核不通过</button>
                        <button id="closeOrder" class="w-btn w-btn-black btag" style="float:right;">关闭订单</button>
                     </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">订单列表</h2>
                    </div>
                    <div class="detail">
                        <table id="J-orderTable" class="w-datatable">
                            <colgroup>
                                <col width="15%">
                                <col width="8%">
                                <col width="12%">
                                <col width="10%">
                                <col width="auto">
                                <col width="10%">
                                <col width="10%">
                                <col width="10%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th class="cmax1"><label><input type="checkbox" id="checkAll" />订单id</label></th>
                                <th>收货姓名</th>
                                <th>支付时间</th>
                                <th class="cmax2">跨境方式</th>
                                <th>主要货物名称</th>
                                <th class="cmax2">审核状态</th>
                                <th class="cmax2">嫌疑类型</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody id="box"></tbody>
                        </table>
                        <div id="pager"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/orderext/orderRestrictedList.js"></script>
</body>
</html>