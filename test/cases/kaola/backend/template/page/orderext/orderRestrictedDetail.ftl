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
                        <h2 class="icf-pencil">订单信息</h2>
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
                                        <input type="text" name="paymentId" value="${(orderExt.paymentId)!''}" disabled />
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
                                    <div class="group"  >
                                        <label class="title">订单总金额:</label>
                                        <input type="text" name="orderTotalAmount" value="${(orderExt.orderTotalAmount)!''}" data-int="true"  disabled />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">订单货款:</label>
                                        <input type="text" name="orderGoodsAmount" value="${(orderExt.orderGoodsAmount)!''}" data-int="true"  disabled />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">订单税款:</label>
                                        <input type="text" name="orderTaxAmount" value="${(orderExt.orderTaxAmount)!''}" data-int="true" disabled />
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
                                    </div>
                                </div>
                                <div class="fbox">
                                    <div class="group">
                                        <label class="title">运单号:</label>
                                        <input class="ztag" type="text" name="billno" value="${(orderExt.billno)!''}" disabled  />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">购买人id:</label>
                                        <input class="ztag" type="text" name="purchaserId" value="${(orderExt.purchaserId?html)!''}" disabled />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">购买人姓名:</label>
                                        <input class="ztag" type="text" name="purchaserName" value="${(orderExt.purchaserName?html)!''}" disabled />
                                    </div>
                                    <div class="group"  >
                                        <label class="title">购买人联系方式:</label>
                                        <input class="ztag" type="text" name="purchaserTel" value="${(orderExt.purchaserTel?html)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">购买人地址:</label>
                                        <textarea class="ztag" type="text" name="purchaserAddress" disabled>${(orderExt.purchaserAddress?html)!''}</textarea>
                                    </div>
                                    <div class="group"  >
                                        <label class="title">商品总件数:</label>
                                        <input type="text" name="totalCount" value="${(orderExt.totalCount)!''}" data-int="true" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">主要货物名称:</label>
                                        <input class="ztag" type="text" name="mainGoodsName" value="${(orderExt.mainGoodsName)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">毛重:</label>
                                        <input class="ztag" type="text" name="grossWeight" value="${(orderExt.grossWeight)!''}" disabled />
                                    </div>
                                    <div class="group">
                                        <label class="title">净重:</label>
                                        <input class="ztag" type="text" name="netWeight" value="${(orderExt.netWeight)!''}" disabled />
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
                        </form>
                    </div>
                </div>
                <#assign logisticInfo = orderExt.logisticInfo/>
                <div id="J-logisticBox" class="m-databox f-clearfix">
                    <div class="head">
                        <h2 class="icf-pencil">物流信息</h2>
                    </div>
                    <div class="detail">
                        <form id="J-logisticForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">收件人姓名:</label>
                                <input class="ltag" type="text" name="consigneeName" value="${(logisticInfo.consigneeName?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">收件人联系方式:</label>
                                <input class="ltag" type="text" name="consigneeTel" value="${(logisticInfo.consigneeTel?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">收件人地址:</label>
                                <input class="ltag" type="text" name="consigneeAddress" value="${(logisticInfo.consigneeAddress?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">收件人邮编:</label>
                                <input class="ltag" type="text" name="consigneeZipcode" value="${(logisticInfo.consigneeZipcode?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">寄件人姓名:</label>
                                <input class="ltag" type="text" name="scustName" value="${(logisticInfo.scustName?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">寄件人联系方式:</label>
                                <input class="ltag" type="text" name="scustTel" value="${(logisticInfo.scustTel?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">寄件人地址:</label>
                                <input class="ltag" type="text" name="scustAddress" value="${(logisticInfo.scustAddress?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">寄件重量:</label>
                                <input class="ltag" type="text" name="weight" value="${(logisticInfo.weight)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">到件省:</label>
                                <input class="ltag" type="text" name="tcustProvince" value="${(logisticInfo.tcustProvince?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">到件市:</label>
                                <input class="ltag" type="text" name="tcustCity" value="${(logisticInfo.tcustCity?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">到件县:</label>
                                <input class="ltag" type="text" name="tcustCounty" value="${(logisticInfo.tcustCounty?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">物流企业编码:</label>
                                <input class="ltag" type="text" name="logisCompanyCode" value="${(logisticInfo.logisCompanyCode)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">物流企业名称:</label>
                                <input class="ltag" type="text" name="logisCompanyName" value="${(logisticInfo.logisCompanyName)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">内件信息:</label>
                                <input class="ltag" type="text" name="cargoDesc" value="${(logisticInfo.cargoDesc?html)!''}" disabled />
                            </div>
                            <div class="group">
                                <label class="title">EMS大客户唯一标识:</label>
                                <input class="ltag" type="text" name="bigAccountDataId" value="${(logisticInfo.bigAccountDataId)!''}" disabled />
                            </div>
                        </form>
                    </div>
                </div>
                <#assign goodsInfoSnapshot = orderExt.goodsInfoSnapshot/>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-pencil">商品信息</h2>
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
                                    <input type="text" name="goodsName" value="${(goodInfo.goodsName)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">行邮税号:</label>
                                    <input type="text" name="codeTs" value="${(goodInfo.codeTs)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">原产地:</label>
                                    <input type="text" name="originCountry" value="${(goodInfo.originCountry)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">申报单位:</label>
                                    <input type="text" name="declareGoodsUnit" value="${(goodInfo.declareGoodsUnit)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">规格型号:</label>
                                    <input type="text" name="goodsModel" value="${(goodInfo.goodsModel)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">商品货号:</label>
                                    <input type="text" name="goodsItemNo" value="${(goodInfo.goodsItemNo)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">商品单价:</label>
                                    <input type="text" name="unitPrice" value="${(goodInfo.unitPrice)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">申报数量:</label>
                                    <input type="text" name="declareGoodsCount" value="${(goodInfo.declareGoodsCount)!''}" data-int="true" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">第一单位:</label>
                                    <input type="text" name="firstUnit" value="${(goodInfo.firstUnit)!''}" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">第一数量:</label>
                                    <input type="text" name="firstCount" value="${(goodInfo.firstCount)!''}" data-int="true" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">第二单位:</label>
                                    <input type="text" name="secondUnit" value="${(goodInfo.secondUnit)!''}" disabled/>
                                </div>
                                <div class="group">
                                    <label class="title">第二数量:</label>
                                    <input type="text" name="secondCount" value="${(goodInfo.secondCount)!''}" data-int="true" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">订单中商品的实际数量:</label>
                                    <input type="text" name="count" value="${(goodInfo.count)!''}" data-int="true" disabled />
                                </div>
                                <div class="group">
                                    <label class="title">商品重量:</label>
                                    <input type="text" name="weight" value="${(goodInfo.weight)!''}" data-int="true" disabled />
                                </div>
                            </fieldset>
                            </#list>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
</body>
</html>