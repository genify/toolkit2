<#-- Created by zmm on 21/11/14. -->
<#-- 订单列表页面：/orderExtMaintain -->

<#include "../wrapper/import.ftl">
<@htmHead title="订单管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">

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
                                <label class="title">支付企业:</label>
                                <select class="ztag">
                                <#list payMethodList as payMethod>
                                    <option value="${payMethod.index}">${payMethod.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">获取单号状态:</label>
                                <select class="ztag">
                                <#list billnoList as billno>
                                    <option value="${billno.index}">${billno.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">订单推送:</label>
                                <select class="ztag">
                                <#list orderPACStateList as orderPACState>
                                    <option value="${orderPACState.index}">${orderPACState.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">运单推送:</label>
                                <select class="ztag">
                                <#list waybillPACStateList as waybillPACState>
                                    <option value="${waybillPACState.index}">${waybillPACState.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">申报单:</label>
                                <select class="ztag">
                                <#list goodsDeclareStateList as goodsDeclareState>
                                    <option value="${goodsDeclareState.index}">${goodsDeclareState.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">仓库状态:</label>
                                <select class="ztag">
                                <#list stockStateList as stockState>
                                    <option value="${stockState.index}">${stockState.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">出关状态:</label>
                                <select class="ztag">
                                <#list outStateList as outState>
                                    <option value="${outState.index}">${outState.value}</option>
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
                                <label class="title" style="min-width: 90px">仓库:</label>
                                <select class="ztag">
                                <#list storageList as storage>
                                    <option value="${storage.index}">${storage.value}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">支付时间:</label>
                                <span><input id="starttime" type="text" value="" class="wd100" placeholder="开始时间"/>00:00</span>
                                &nbsp;-&nbsp;
                                <span><input id="endtime" type="text" value="" class="wd100" placeholder="结束时间"/>00:00</span>
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
                            </div>
                        </div>
                        <button id="btn" class="w-btn w-btn-black btag">搜索</button>
                     </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">订单列表</h2>
                    </div>
                    <div class="detail">
                        <table id="J-orderTable" class="w-datatable">
                            <thead>
                            <tr>
                                <th class="cmax1"><label><input type="checkbox" id="checkAll" />订单id</label></th>
                                <th>收货姓名</th>
                                <th>运单号</th>
                                <th>支付时间</th>
                                <th>仓库</th>
                                <th class="cmax2">类型</th>
                                <th class="cmax2">订单流</th>
                                <th class="cmax2">运单流</th>
                                <th class="cmax2">申报单</th>
                                <th class="cmax2">仓库状态</th>
                                <th class="cmax2">出关状态</th>
                                <th class="cmax2">审核状态</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody id="box"></tbody>
                        </table>
                        <div id="pager"></div>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-key">批量推送</h2>
                    </div>
                    <div class="detail">
                        <div>
                            <button id="batchcheck" class="w-btn w-btn-black">批量查询申报状态</button>
                            <button id="batchgetbillno" class="w-btn w-btn-black">批量获取运单号</button>
                            <button id="batchsendorder" class="w-btn w-btn-black">批量推送订单</button>
                            <button id="batchsendwaybill" class="w-btn w-btn-black">批量推送运单</button>
                            <button id="batchsenddeclare" class="w-btn w-btn-black">批量推送申报单</button>
                            <button id="batchsendtowc" class="w-btn w-btn-black">批量推送订单到仓库</button>
                            <button id="batchsetimported" class="w-btn w-btn-black">批量设置订单为已出关</button>
                        </div>
                    </div>
                    <div class="head">
                        <h2 class="icf-refresh">批量重置状态</h2>
                    </div>
                    <div class="detail">
                        <div>
                            <button id="batchresetorder" class="w-btn w-btn-black">批量重置订单推送</button>
                            <button id="batchresetwaybill" class="w-btn w-btn-black">批量重置运单推送</button>
                            <button id="batchresetdeclare" class="w-btn w-btn-black">批量重置申报单推送</button>
                            <button id="batchresetbillnoacq" class="w-btn w-btn-black">批量重置获取运单号</button>
                        </div>
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
<script src="/backend/src/js/module/orderext/orderList.js"></script>
</body>
</html>