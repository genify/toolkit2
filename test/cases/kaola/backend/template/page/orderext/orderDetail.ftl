<#-- Created by zmm on 21/11/14. -->
<#-- 订单详情编辑页面：/orderExtMaintain?orderId=xxx -->

<#include "../wrapper/import.ftl">
<@htmHead title="订单详细页">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
    <style>
		.w-dataform{margin:20px 0 0 50px;}
		.w-dataform .item{width:400px;height:40px;margin:10px;line-height:40px;}
		.w-dataform button{float:right;}
	</style>
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-pencil">订单操作</h2>
                    </div>
                    <div class="w-dataform">
                        <div class="item">
                            <span>向电子口岸推送订单</span>
                            <button class="w-btn w-btn-blue">推送订单</button>
                        </div>
                        <div class="item">
                            <span>向电子口岸推送运单</span>
                            <button class="w-btn w-btn-blue">推送运单</button>
                        </div>
                        <div class="item">
                            <span>推送/查询申报单</span>
                            <button class="w-btn w-btn-blue">推送/查询申报单</button>
                        </div>
                        <div class="item">
                            <span>查询行邮税</span>
                            <button class="w-btn w-btn-blue">查询行邮税</button>
                        </div>
                        <div class="item">
                            <span>查询支付流推送时间</span>
                            <button class="w-btn w-btn-blue">查询支付流推送时间</button>
                        </div>
                        <div class="item">
                            <span>通知电子口岸关闭订单</span>
                            <button class="w-btn w-btn-blue">电子口岸关闭订单</button>
                        </div>
                        <div class="item">
                            <span>从EMS获取物流单号</span>
                            <button class="w-btn w-btn-blue">获取物流单号</button>
                        </div>
                        <div class="item">
                            <span>查询物流轨迹（中外运除外）</span>
                            <button class="w-btn w-btn-blue">查询物流轨迹</button>
                        </div>
                        <div class="item">
                            <span>向仓库/中外运推送订单</span>
                            <button class="w-btn w-btn-blue">仓库订单</button>
                        </div>
                        <div class="item">
                            <span>向仓库下达发货指令</span>
                            <button class="w-btn w-btn-blue">仓库发货</button>
                        </div>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-pencil">申报状态</h2>
                    </div>
                    <div class="w-dataform">
                        <div class="item">
                            <button id="checkDeclareState" class="w-btn w-btn-blue" style="float:left;">查询申报状态</button>
                        </div>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-pencil">编辑订单信息</h2>
                    </div>
                    <div class="detail">
                        <form id="J-orderForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">订单id:</label>
                                <input type="text" name="orderId" value="${(orderExt.orderId)!''}" disabled />
                            </div>
                            <fieldset class="f-clearfix">
                                <legend>订单与支付信息</legend>
                                <div class="fbox">
                                    <div class="group">
                                        <label class="title">支付id:</label>
                                        <input class="ztag" type="text" name="paymentId" value="${(orderExt.paymentId)!''}" />
                                    </div>
                                    <div class="group">
                                        <label class="title">订单支付状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="paymentStateValue" value=0 <#if (orderExt.paymentState)?? && orderExt.paymentState.intValue()==0>checked</#if> />&nbsp;未支付</label>
                                        <label><input class="zradio ztag" type="radio" name="paymentStateValue" value=1 <#if (orderExt.paymentState)?? && orderExt.paymentState.intValue()==1>checked</#if> />&nbsp;已支付</label>
                                        <label><input class="zradio ztag" type="radio" name="paymentStateValue" value=2 <#if (orderExt.paymentState)?? && orderExt.paymentState.intValue()==2>checked</#if> />&nbsp;交易失败</label>
                                        <label><input class="zradio ztag" type="radio" name="paymentStateValue" value=3 <#if (orderExt.paymentState)?? && orderExt.paymentState.intValue()==3>checked</#if> />&nbsp;已退款</label>
                                        <label><input class="zradio ztag" type="radio" name="paymentStateValue" value=-1 <#if (orderExt.paymentState)?? && orderExt.paymentState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                    <div class="group"  >
                                        <label class="title">支付时间:</label>
                                        <input type="hidden" name="payTime" value="${(orderExt.payTime)!''}" data-int="true" disabled/>
                                        <input type="text" value="<#if (orderExt.payTime)??>${((orderExt.payTime)?number_to_datetime)?string('yyyy-MM-dd HH:mm:ss')}</#if>" disabled/>
                                    </div>
                                    <div class="group">
                                        <label class="title">订单总金额:</label>
                                        <input class="ztag" type="text" name="orderTotalAmount" value="${(orderExt.orderTotalAmount)!''}" data-int="true" />
                                    </div>
                                    <div class="group">
                                        <label class="title">订单货款:</label>
                                        <input class="ztag" type="text" name="orderGoodsAmount" value="${(orderExt.orderGoodsAmount)!''}" data-int="true" />
                                    </div>
                                    <div class="group">
                                        <label class="title">订单税款:</label>
                                        <input class="ztag" type="text" name="orderTaxAmount" value="${(orderExt.orderTaxAmount)!''}" data-int="true" />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">成交币制:</label>
                                        <input type="text" name="currCode" value="${(orderExt.currCode)!''}" disabled />
                                    </div>

                                    <div class="group">
                                        <label class="title">进口类型:</label>
                                        <label><input class="zradio ztag" type="radio" name="importTypeValue" value=0 <#if (orderExt.importType)?? && orderExt.importType.intValue()==0>checked</#if> />&nbsp;直邮</label>
                                        <label><input class="zradio ztag" type="radio" name="importTypeValue" value=1 <#if (orderExt.importType)?? && orderExt.importType.intValue()==1>checked</#if> />&nbsp;保税</label>
                                        <label><input class="zradio ztag" type="radio" name="importTypeValue" value=2 <#if (orderExt.importType)?? && orderExt.importType.intValue()==2>checked</#if> />&nbsp;海淘</label>
                                        <label><input class="zradio ztag" type="radio" name="importTypeValue" value=3 <#if (orderExt.importType)?? && orderExt.importType.intValue()==3>checked</#if> />&nbsp;国内售卖</label>
                                    </div>
                                </div>
                                <div class="fbox">
                                    <div class="group">
                                        <label class="title">运单号:</label>
                                        <input class="ztag" type="text" name="billno" value="${(orderExt.billno)!''}"  />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">购买人id:</label>
                                        <input class="ztag" type="text" name="purchaserId" value="${(orderExt.purchaserId?html)!''}" />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">购买人姓名:</label>
                                        <input class="ztag" type="text" name="purchaserName" value="${(orderExt.purchaserName?html)!''}" />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">购买人联系方式:</label>
                                        <input class="ztag" type="text" name="purchaserTel" value="${(orderExt.purchaserTel?html)!''}" />
                                    </div>
                                    <div class="group">
                                        <label class="title">购买人地址:</label>
                                        <textarea class="ztag" type="text" name="purchaserAddress">${(orderExt.purchaserAddress?html)!''}</textarea>
                                    </div>
                                    <div class="group"  >
                                        <label class="title">商品总件数:</label>
                                        <input type="text" name="totalCount" value="${(orderExt.totalCount)!''}" data-int="true" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">主要货物名称:</label>
                                        <input class="ztag" type="text" name="mainGoodsName" value="${(orderExt.mainGoodsName)!''}"  />
                                    </div>
                                    <div class="group">
                                        <label class="title">毛重:</label>
                                        <input class="ztag" type="text" name="grossWeight" value="${(orderExt.grossWeight)!''}"  />
                                    </div>
                                    <div class="group">
                                        <label class="title">净重:</label>
                                        <input class="ztag" type="text" name="netWeight" value="${(orderExt.netWeight)!''}"  />
                                    </div>
                                    <div class="group" style="display:none">
                                        <label class="title">包装种类:</label>
                                        <input type="text" name="warpType" value="${(orderExt.warpType)!''}" disabled />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">打印物流面单备注:</label>
                                        <input type="text" name="remark" value="${(orderExt.remark)!''}" disabled />
                                    </div>

                                </div>
                            </fieldset>
                            <fieldset class="f-clearfix">
                                <legend>各推送状态</legend>
                                <div class="fbox">
                                    <div class="group">
                                        <label class="title">订单推送状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="orderPacStateValue" value=0 <#if (orderExt.orderPacState)?? && orderExt.orderPacState.intValue()==0>checked</#if> />&nbsp;未推送</label>
                                        <label><input class="zradio ztag" type="radio" name="orderPacStateValue" value=1 <#if (orderExt.orderPacState)?? && orderExt.orderPacState.intValue()==1>checked</#if> />&nbsp;已推送</label>
                                        <label><input class="zradio ztag" type="radio" name="orderPacStateValue" value=-1 <#if (orderExt.orderPacState)?? && orderExt.orderPacState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">申报单推送状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="goodsDeclareStateValue" value=0 <#if (orderExt.goodsDeclareState)?? && orderExt.goodsDeclareState.intValue()==0>checked</#if> />&nbsp;未推送</label>
                                        <label><input class="zradio ztag" type="radio" name="goodsDeclareStateValue" value=1 <#if (orderExt.goodsDeclareState)?? && orderExt.goodsDeclareState.intValue()==1>checked</#if> />&nbsp;已推送</label>
                                        <label><input class="zradio ztag" type="radio" name="goodsDeclareStateValue" value=-1 <#if (orderExt.goodsDeclareState)?? && orderExt.goodsDeclareState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">运单推送状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="waybillPacStateValue" value=0 <#if (orderExt.waybillPacState)?? && orderExt.waybillPacState.intValue()==0>checked</#if> />&nbsp;未推送</label>
                                        <label><input class="zradio ztag" type="radio" name="waybillPacStateValue" value=1 <#if (orderExt.waybillPacState)?? && orderExt.waybillPacState.intValue()==1>checked</#if> />&nbsp;已推送</label>
                                        <label><input class="zradio ztag" type="radio" name="waybillPacStateValue" value=-1 <#if (orderExt.waybillPacState)?? && orderExt.waybillPacState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">支付确认推送状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="payConfirmSendStateValue" value=0 <#if (orderExt.payConfirmSendState)?? && orderExt.payConfirmSendState.intValue()==0>checked</#if> />&nbsp;未推送</label>
                                        <label><input class="zradio ztag" type="radio" name="payConfirmSendStateValue" value=1 <#if (orderExt.payConfirmSendState)?? && orderExt.payConfirmSendState.intValue()==1>checked</#if> />&nbsp;已推送</label>
                                        <label><input class="zradio ztag" type="radio" name="payConfirmSendStateValue" value=-1 <#if (orderExt.payConfirmSendState)?? && orderExt.payConfirmSendState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">包裹出关状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="outStateValue" value=0 <#if (orderExt.outState)?? && orderExt.outState.intValue()==0>checked</#if> />&nbsp;未出关</label>
                                        <label><input class="zradio ztag" type="radio" name="outStateValue" value=1 <#if (orderExt.outState)?? && orderExt.outState.intValue()==1>checked</#if> />&nbsp;已出关</label>
                                        <label><input class="zradio ztag" type="radio" name="outStateValue" value=2 <#if (orderExt.outState)?? && orderExt.outState.intValue()==2>checked</#if> />&nbsp;已关闭</label>
                                        <label><input class="zradio ztag" type="radio" name="outStateValue" value=-1 <#if (orderExt.outState)?? && orderExt.outState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">审核状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=0 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==0>checked</#if> />&nbsp;未审核</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=1 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==1>checked</#if> />&nbsp;反垃圾通过</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=2 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==2>checked</#if> />&nbsp;审核不通过</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=3 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==3>checked</#if> />&nbsp;待人工审核</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=4 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==4>checked</#if> />&nbsp;待自动交易失败</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=5 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==5>checked</#if> />&nbsp;自动交易失败完成</label>
                                        <label><input class="zradio ztag" type="radio" name="verifyStateValue" value=6 <#if (orderExt.verifyState)?? && orderExt.verifyState.intValue()==6>checked</#if> />&nbsp;海淘通过</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">仓库状态:</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=0 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==0>checked</#if> />&nbsp;未推送</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=1 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==1>checked</#if> />&nbsp;已推送</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=2 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==2>checked</#if> />&nbsp;发货</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=3 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==3>checked</#if> />&nbsp;打单</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=4 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==4>checked</#if> />&nbsp;分拣</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=5 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==5>checked</#if> />&nbsp;打包</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=6 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==6>checked</#if> />&nbsp;出库</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=7 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==7>checked</#if> />&nbsp;库存不足</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=8 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==8>checked</#if> />&nbsp;取消发货</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=9 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==9>checked</#if> />&nbsp;海关扣留</label>
                                        <label><input class="zradio ztag" type="radio" name="stockStateValue" value=-1 <#if (orderExt.stockState)?? && orderExt.stockState.intValue()==-1>checked</#if> />&nbsp;异常</label>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset class="f-clearfix">
                                <legend>口岸与仓库信息</legend>
                                <div class="fbox">
                                    <div class="group">
                                        <label class="title">仓库名称:</label>
                                        <input type="text" name="storageName" value="${(orderExt.storageName)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">进出口岸代码:</label>
                                        <input class="ztag" type="text" name="iePort" value="${(orderExt.iePort)!''}"  />
                                    </div>
                                    <div class="group">
                                        <label class="title">指运港（抵运港）:</label>
                                        <input class="ztag" type="text" name="destinationPort" value="${(orderExt.destinationPort)!''}"  />
                                    </div>

                                    <div class="group">
                                        <label class="title">运输方式代码:</label>
                                        <input class="ztag" type="text" name="trafMode" value="${(orderExt.trafMode)!''}"  />
                                    </div>
                                    <div class="group">
                                        <label class="title">电商企业代码:</label>
                                        <input type="text" name="eCommerceCode" value="${(orderExt.eCommerceCode)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">电商企业名称:</label>
                                        <input type="text" name="eCommerceName" value="${(orderExt.eCommerceName)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">贸易国别（起运地）:</label>
                                        <input class="ztag" type="text" name="tradeCountry" value="${(orderExt.tradeCountry)!''}"  />
                                    </div>
                                    <div class="group">
                                        <label class="title">申报口岸代码:</label>
                                        <input class="ztag" type="text" name="declPort" value="${(orderExt.declPort)!''}"  />
                                    </div>
                                    <div class="group">
                                        <label class="title">码头/货场代码:</label>
                                        <input class="ztag" type="text" name="customsField" value="${(orderExt.customsField)!''}"  />
                                    </div>
                                </div>
                                <div class="fbox">
                                    <div class="group"  >
                                        <label class="title">进口日期:</label>
                                        <input class="ztag" type="hidden" name="importDate" value="${(orderExt.importDate)!''}" data-int="true" disabled />
                                        <input id="setdate" type="text" value="<#if (orderExt.importDate)??>${((orderExt.importDate)?number_to_datetime)?string('yyyy-MM-dd')}</#if>" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">支付公司编码:</label>
                                        <input class="ztag" type="text" name="payCompanyCode" value="${(orderExt.payCompanyCode)!''}" />
                                    </div>
                                    <div class="group">
                                        <label class="title">申报单位编码:</label>
                                        <input type="text" name="declareCompanyCode" value="${(orderExt.declareCompanyCode)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">申报单位名称:</label>
                                        <input type="text" name="declareCompanyName" value="${(orderExt.declareCompanyName)!''}" disabled />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">申报单位类别:</label>
                                        <label><input disabled class="zradio" type="radio" name="declareCompanyType" value=0 <#if (orderExt.declareCompanyType)?? && orderExt.declareCompanyType.intValue()==0>checked</#if> />&nbsp;电商企业</label>
                                        <label><input disabled class="zradio" type="radio" name="declareCompanyType" value=1 <#if (orderExt.declareCompanyType)?? && orderExt.declareCompanyType.intValue()==1>checked</#if> />&nbsp;物流企业</label>
                                        <label><input disabled class="zradio" type="radio" name="declareCompanyType" value=2 <#if (orderExt.declareCompanyType)?? && orderExt.declareCompanyType.intValue()==2>checked</#if> />&nbsp;第三方</label>
                                    </div>
                                    <div class="group">
                                        <label class="title">发件人国别:</label>
                                        <input class="ztag" type="text" name="senderCountry" value="${(orderExt.senderCountry)!''}"  />
                                        <span class="tip">商品原产地</span>
                                    </div>
                                    <div class="group">
                                        <label class="title">发件人名称:</label>
                                        <input type="text" name="senderName" value="${(orderExt.senderName?html)!''}" disabled />
                                        <span class="tip">与电商企业名称相同</span>
                                    </div>

                                    <div class="group">
                                        <label class="title">个人申报单预录入号:</label>
                                        <input type="text" name="goodsDeclareId" value="${(orderExt.goodsDeclareId)!''}" disabled />
                                        <span class="tip">4位电商编号+14位企业流水</span>
                                    </div>

                                    <div class="group"  >
                                        <label class="title">区内企业编码:</label>
                                        <input type="text" name="internalAreaCompanyNo" value="${(orderExt.internalAreaCompanyNo)!''}" disabled />
                                        <span class="tip">保税进口必填，填仓储企业编码</span>
                                    </div>
                                    <div class="group"  >
                                        <label class="title">区内企业名称:</label>
                                        <input type="text" name="internalAreaCompanyName" value="${(orderExt.internalAreaCompanyName)!''}"   disabled />
                                        <span class="tip">保税进口必填，填仓储企业名称</span>
                                    </div>
                                    <div class="group">
                                        <label class="title">申请单代码:</label>
                                        <input class="ztag" type="text" name="applicationFormNo" value="${(orderExt.applicationFormNo)!''}" />
                                        <span class="tip">保税进口必填，指仓储企业申请的分送集报申请单编号</span>
                                    </div>
                                </div>
                            </fieldset>

                            <div class="group" style="display:none">
                                <label class="title">创建时间:</label>
                                <input type="hidden" name="createTime" value="${(orderExt.createTime)!''}" data-int="true" />
                                <input type="text" value="<#if (orderExt.createTime)??>${((orderExt.createTime)?number_to_datetime)?string('yyyy-MM-dd HH:mm:ss')}</#if>" disabled />
                            </div>
                            <div class="group" style="display:none">
                                <label class="title">更新时间:</label>
                                <input type="hidden" name="updateTime" value="${(orderExt.updateTime)!''}" data-int="true" />
                                <input type="text" value="<#if (orderExt.updateTime)??>${((orderExt.updateTime)?number_to_datetime)?string('yyyy-MM-dd HH:mm:ss')}</#if>" disabled/>
                            </div>
                            <div class="group-col1 f-clearfix">
                                <button name="updatebutton" class="w-btn w-btn-black btag">确认修改</button>
                                <button name="cancleupbutton" class="w-btn w-btn-white">取消修改</button>
                            </div>
                        </form>
                    </div>
                </div>
                <#assign logisticInfo = orderExt.logisticInfo/>
                <div id="J-logisticBox" class="m-databox f-clearfix">
                    <div class="head">
                        <h2 class="icf-pencil">编辑物流信息</h2>
                    </div>
                    <div class="detail">
                        <form id="J-logisticForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">收件人姓名:</label>
                                <input class="ltag" type="text" name="consigneeName" value="${(logisticInfo.consigneeName?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">收件人联系方式:</label>
                                <input class="ltag" type="text" name="consigneeTel" value="${(logisticInfo.consigneeTel?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">收件人地址:</label>
                                <input class="ltag" type="text" name="consigneeAddress" value="${(logisticInfo.consigneeAddress?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">收件人邮编:</label>
                                <input class="ltag" type="text" name="consigneeZipcode" value="${(logisticInfo.consigneeZipcode?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">寄件人姓名:</label>
                                <input class="ltag" type="text" name="scustName" value="${(logisticInfo.scustName?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">寄件人联系方式:</label>
                                <input class="ltag" type="text" name="scustTel" value="${(logisticInfo.scustTel?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">寄件人地址:</label>
                                <input class="ltag" type="text" name="scustAddress" value="${(logisticInfo.scustAddress?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">寄件重量:</label>
                                <input class="ltag" type="text" name="weight" value="${(logisticInfo.weight)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">到件省:</label>
                                <input class="ltag" type="text" name="tcustProvince" value="${(logisticInfo.tcustProvince?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">到件市:</label>
                                <input class="ltag" type="text" name="tcustCity" value="${(logisticInfo.tcustCity?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">到件县:</label>
                                <input class="ltag" type="text" name="tcustCounty" value="${(logisticInfo.tcustCounty?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">物流企业编码:</label>
                                <input class="ltag" type="text" name="logisCompanyCode" value="${(logisticInfo.logisCompanyCode)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">物流企业名称:</label>
                                <input class="ltag" type="text" name="logisCompanyName" value="${(logisticInfo.logisCompanyName)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">内件信息:</label>
                                <input class="ltag" type="text" name="cargoDesc" value="${(logisticInfo.cargoDesc?html)!''}" />
                            </div>
                            <div class="group">
                                <label class="title">EMS大客户唯一标识:</label>
                                <input class="ltag" type="text" name="bigAccountDataId" value="${(logisticInfo.bigAccountDataId)!''}" />
                            </div>
                            <div class="group-col1 f-clearfix">
                                <button name="updatebutton" class="w-btn w-btn-black btag">确认修改</button>
                                <button name="cancleupbutton" class="w-btn w-btn-white">取消修改</button>
                            </div>
                        </form>
                    </div>
                </div>
                <#assign goodsInfoSnapshot = orderExt.goodsInfoSnapshot/>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-pencil">编辑商品信息</h2>
                    </div>
                    <div class="detail f-clearfix">
                        <form id="J-goodsForm" class="w-dataform" onsubmit="return false;">
                            <#list goodsInfoSnapshot as goodInfo>
                            <fieldset class="gtag" data-id="${goodInfo.id!0}">
                            	<div class="group">
                                	<label class="title">商品序号:</label>
                                    <input type="text" name="goodsOrder" value="${(goodInfo.goodsOrder)!''}" data-int="true" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">商品名:</label>
                                    <input type="text" name="goodsName" value="${(goodInfo.goodsName)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">行邮税号:</label>
                                    <input type="text" name="codeTs" value="${(goodInfo.codeTs)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">原产地:</label>
                                    <input type="text" name="originCountry" value="${(goodInfo.originCountry)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">申报单位:</label>
                                    <input type="text" name="declareGoodsUnit" value="${(goodInfo.declareGoodsUnit)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">规格型号:</label>
                                    <input type="text" name="goodsModel" value="${(goodInfo.goodsModel)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">商品货号:</label>
                                    <input type="text" name="goodsItemNo" value="${(goodInfo.goodsItemNo)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">商品单价:</label>
                                    <input type="text" name="unitPrice" value="${(goodInfo.unitPrice)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">申报数量:</label>
                                    <input type="text" name="declareGoodsCount" value="${(goodInfo.declareGoodsCount)!''}" data-int="true" />
                                </div>
                                <div class="group">
                                    <label class="title">第一单位:</label>
                                    <input type="text" name="firstUnit" value="${(goodInfo.firstUnit)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">第一数量:</label>
                                    <input type="text" name="firstCount" value="${(goodInfo.firstCount)!''}" data-int="true" />
                                </div>
                                <div class="group">
                                    <label class="title">第二单位:</label>
                                    <input type="text" name="secondUnit" value="${(goodInfo.secondUnit)!''}" />
                                </div>
                                <div class="group">
                                    <label class="title">第二数量:</label>
                                    <input type="text" name="secondCount" value="${(goodInfo.secondCount)!''}" data-int="true" />
                                </div>
                                <div class="group">
                                    <label class="title">订单中商品的实际数量:</label>
                                    <input type="text" name="count" value="${(goodInfo.count)!''}" data-int="true" />
                                </div>
                                <div class="group">
                                    <label class="title">商品重量:</label>
                                    <input type="text" name="weight" value="${(goodInfo.weight)!''}" data-int="true" />
                                </div>
                            </fieldset>
                            </#list>
                            <div class="group-col1 f-clearfix">
                                <button name="updatebutton" class="w-btn w-btn-black btag">确认修改</button>
                                <button name="cancleupbutton" class="w-btn w-btn-white">取消修改</button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-pencil">生成推送信息</h2>
                    </div>
                    <div class="detail f-clearfix">
                    	<div class="group">
                            <button class="w-btn w-btn-blue sdtag">生成订单报文</button>
							<button class="w-btn w-btn-blue sdtag">生成物流报文</button>
							<button class="w-btn w-btn-blue sdtag">生成推送/查询申报单报文</button>
							<textarea class="sdtag" style="display:block;margin-top:20px;width:400px;height:150px;"></textarea>
							<button class="w-btn w-btn-blue sdtag" style="display:block;margin-top:20px;">发送报文</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<!-- @NOPARSE -->
<script>
    var _config = {id:'${(orderExt.orderId)!0}', orderId:'${(orderExt.orderId)!''}', logisticId:'${logisticInfo.id!0}'};
</script>
<!-- /@NOPARSE -->
<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/orderext/orderDetail.js"></script>
</body>
</html>
