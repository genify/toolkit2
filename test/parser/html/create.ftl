<#-- 模拟数据，不用注释, 如果storageList 与 purchaseOrder 都不存在，则加载假数据 -->
<#-- 在新建采购单时，后端不会给purchaseOrder对象，这边默认给一个状态及purchaseOrder对象 -->
<#if storageList??>
    <#assign po=purchaseOrder?default({"purchaseCount":0,"purchaseAmount":0,"invoiceCount":0,"invoiceAmount":0,
    "supplierId":-9999999,
    "storageId": -9999999,
    "remark":"",
    "status": 1,
    "details":[],"logs":[]})/>
    </#if>
    <#if !storageList?? && !purchaseOrder?? >
        <#include "../fakedata/psinventory/create_fakedata.ftl">
    </#if>
    <#include "/common/macro.ftl">
    <#if !purchaseOrder??>
        <#assign status=1/>
        <#assign statusText="审核驳回">
        <#assign currencyType=-1/>
        <#assign purchaseWayType=-1/>
    <#else>
        <#-- status: 编辑中(0),审核驳回(1),待审核(2),待入库(3),入库待确认(4),已入库(5),已取消(6),拒绝入库(7) -->
        <#assign status=po.status.intValue()/>
    <#if status==0||status==-1>
        <#assign status=1/>
    </#if>
    <#assign statusText=po.status.toString()/>
    <#assign currencyType=po.currencyType.intValue()/>
    <#assign purchaseWayType=po.purchaseWay.intValue()/>
    <#assign tallyAuditStatus=po.tallyAuditStatus!-999/>
    <#assign stages=po.stages![]/>
</#if>
<#include "../../common/import.ftl">
<@htmHead title="新建采购单">
    <@css/>
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/create.css">
</@htmHead>
<@topHeader />
<div class="g-body">
    <@leftMenu />
	<div class="g-main">
        <div class="m-contents">
            <div class="m-title-bar f-clearfix">
                <div class="m-po-ctrl f-fr">
                    <span class="f-warn" id="po-alert"></span>
                    <#if status==1>
                        <#if fromTrackTask??>
                            <a value="取消" class="w-btn w-btn-blue u-btn" id="cancelPageBtn">取消</a>
                        </#if>
                        <input type="button" value="保存" class="w-btn w-btn-blue u-btn" id="saveBtn">
                        <#if !fromTrackTask??>
                            <input type="button" value="提交采购单" class="w-btn w-btn-blue u-btn" id="submitBtn">
                        </#if>
                    </#if>
                    <#if status==3>
                        <input type="button" value="重推采购单" class="w-btn w-btn-blue u-btn" id="repushBtn">
                        <input type="button" value="取消采购单" class="w-btn w-btn-blue u-btn" id="cancelBtn">
                    </#if>
                    <#if status==5 && (!po.financeCheckState?? || po.financeCheckState.intValue()==0)>
                        <input type="button" value="财务核对" class="w-btn w-btn-blue u-btn" id="financeCheckBtn">
                    </#if>
                    <#if status==6>
                        <input type="button" value="复制采购单" class="w-btn w-btn-blue u-btn" id="copyBtn" onclick="window.open('/backend/invoicing/order/create?copy_from_id=${(po.id)}')">
                    </#if>
                    <#if status==7>
                        <input type="button" value="复制采购单" class="w-btn w-btn-blue u-btn" id="copyBtn" onclick="window.open('/backend/invoicing/order/create?copy_from_id=${(po.id)}')">
                    </#if>
                </div>
                <#if po.id??>
                    <#assign poNumberPrefix="采购单号： "/>
                <#else>
                    <#assign poNumberPrefix=""/>
                </#if>
                <#if copyOrder??>
                    <span class="u-page-title" data-ponumber="新建采购单">
                        新建采购单
                    </span>
                <#else>
                    <span class="u-page-title" data-ponumber="${(po.id)?default('新建采购单')}">
                        ${poNumberPrefix}${(po.id)?default('新建采购单')}
                    </span>
                </#if>
            </div>
            <form class="m-poheader f-clearfix" id="searchForm">
                <div class="f-col-4 f-row-1">
                    <label class="term">指定入库仓库</label>
                    <#if status==1>
                        <#if fromTrackTask??>
                            <select id="po-warehouse">
                                <#list storageList as st>
                                    <#if st.storageId==warehouseId4Audit>
                                        <option value="${st.storageId}" selected data-type=${st.storageType}>${st.storageName}</option>
                                    <#else>
                                        <option value="${st.storageId}"  data-type=${st.storageType}>${st.storageName}</option>
                                    </#if>
                                </#list>
                            </select>
                        <#else>
                        <select id="po-warehouse">
                            <#list storageList as st>
                                <#if st.storageId==po.storageId>
                                    <option value="${st.storageId}" selected  data-type=${st.storageType}>${st.storageName}</option>
                                <#else>
                                    <option value="${st.storageId}"  data-type=${st.storageType}>${st.storageName}</option>
                                </#if>
                            </#list>
                        </select>
                        </#if>
                    <#else>
                    :${po.storageName}
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term">采货供应商</label>
                    <#if status==1>
                        <#if fromTrackTask??>
                            <#assign diffSupplierIdValue = supplierId4Audit>
                        <#else>
                            <#assign diffSupplierIdValue = po.supplierId>
                        </#if>
                        <#list supplierList as sp>
                            <#if sp.supplierId == diffSupplierIdValue>
                                <#assign supplierName = sp.supplierName>
                            </#if>
                        </#list>
                        <span class="supplybox">
                            <input id="J_supplierName" data-selectName="supplierSelect" type="text" name="supplierName"
                                   placeholder="搜索供应商" class="supplieript j-suggest" value="${supplierName!''}"/>
                        </span>
                        <select class="supply" style="display:none" name="supplierSelect" id="po-vendor">
                            <#list supplierList as sp>
                                    <option value="${sp.supplierId}"
                                            <#if sp.supplierId == diffSupplierIdValue><#t>
                                                selected<#t>
                                            </#if><#t>
                                    >${sp.supplierName}</option>
                            </#list>
                        </select>
                    <#else>
                        :${po.supplierName}
                    </#if>
                </div>
                <#if status!=1>
                    <div class="f-col-4 f-row-1">
                        <label class="term">供应商等级</label>
                        <label id="supplierLevel">: </label>
                    </div>
                    <div class="f-col-4 f-row-1">
                        <label class="term">供应商欠款</label>
                        <label id="supplierDebt" class="s-fc-6">获取中...</label>
                    </div>
                </#if>
                <#if status==1>
                <div class="f-col-4 f-row-1">
                    <label class="f-required term">
                        预计入库时间
                    </label>
                    <#if !fromTrackTask??>
                        <#if !po.expectedTime??>
                            <#assign _expectedTime=""/>
                        <#else>
                            <#assign _expectedTime=po.expectedTime?number_to_datetime?string('yyyy-MM-dd') />
                        </#if>
                    <#else>
                        <#assign _expectedTime=expectInstockDay4Audit?number_to_datetime?string('yyyy-MM-dd') />
                    </#if>
                    <input type="text" value="${_expectedTime}" class="datepick" placeholder="点击选择时间"  id="po-expectedtime" readonly="true">
                </div>
                <#else>
                    <div  class="f-col-4 f-row-1">
                        <label class="term">预计入库时间</label>
                        : ${po.expectedTime?number_to_date?string('yyyy-MM-dd')}
                    </div>
                </#if>
                <#if status gt 1>
                    <div class="f-col-4 f-row-1">
                        <label class="term">处理状态</label>
                        <#-- TODO ${po.status.intValue()}-->
                        <label>: ${po.status}</label>
                    </div>
                </#if>
                <div class="f-col-4 f-row-1">
                    <label class="f-required term">币种</label>
                    <#if status==1>
                        <#if !fromTrackTask??>
                            <select id="po-currency">
                                <#list currencyList as currency>
                                    <#if currency.currencyId == currencyType>
                                        <option value="${currency.currencyId}" selected>${currency.currencyName}</option>
                                    <#else>
                                        <option value="${currency.currencyId}">${currency.currencyName}</option>
                                    </#if>
                                </#list>
                            </select>
                        <#else>
                            <select id="po-currency" disabled="disabled">
                                <#list currencyList as currency>
                                    <#if currency.currencyId == currencyType4Audit>
                                        <option value="${currency.currencyId}" selected>${currency.currencyName}</option>
                                    <#else>
                                        <option value="${currency.currencyId}">${currency.currencyName}</option>
                                    </#if>
                                </#list>
                            </select>
                    </#if>
                    <#else>
                        <label id="currencyname">: ${po.getCurrencyName()!''}</label>
                        <#if status != 6>
                            <a href="javascript:void(0);" id="J_edit-currencyname" data-currencyName="${po.getCurrencyName()!''}">修改</a>
                        </#if>
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="f-required term">审批单号</label>
                    <#if status==1>
                        <#if fromTrackTask??>
                            ${contractNo4Audit!''}
                            <input type="hidden" value="${contractNo4Audit!''}" id="po-contractno" />
                        <#else>
                            <input type="text" value="${po.contractNo!''}" id="po-contractno" />
                        </#if>
                    <#else>
                        <label>: ${po.contractNo!''}</label>
                        <#if status != 6>
                            <a href="javascript:void(0);" id="edit-contractno">修改</a>
                        </#if>
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term">合同金额</label>
                    ${auditAmount!''} ${currency!''}
                </div>
                <#if !po.id?? || fromTrackTask??>
                    <#--这直接取仓库第一个值对应的跨境方式-->
                    <#assign importType = storageList[0].importType>
                    <#if fromTrackTask??>
                        <#assign storageId = warehouseId4Audit>
                    <#else>
                        <#assign storageId = po.storageId>
                    </#if>
                    <#list storageList as item>
                        <#if item.storageId == storageId>
                            <#assign importType = item.importType>
                        </#if>
                    </#list>
                </#if>
                <div id="J_documentaryNum_box">
                    <div class="<#if status == 1>f-col-8<#else>f-col-4</#if> f-row-1">
                        <label class="<#if status == 1>f-required</#if> term">国际物流单</label>
                        <#if status gt 1>：</#if>
                        <#assign documentaryNum = (po.documentaryNum!'')?string>
                        <#assign ladingNumber = (po.ladingNumber!'')?string>
                        <#--保税模式-->
                        <#assign noDocumentaryNum = (!po.id?? && importType != 1) ||
                                                    (
                                                        po.id?? && !po.documentaryNum?? ||
                                                        (po.documentaryNum?? && po.documentaryNum?string == '')
                                                    )>
                        <#if status == 1>
                            <span class="J_hasDocumentaryNum_box">
                                <input value="0" type="radio" class="J_LogisticsOrder_radio J_noRadio"<#t>
                                    <#if noDocumentaryNum || (po.id?? && documentaryNum == '')> checked </#if><#t>
                                       <#t>name="isHasLogisticsOrder">
                                无
                                <input value="1" type="radio" class="J_LogisticsOrder_radio J_hasRadio"<#t>
                                    <#if !noDocumentaryNum || (po.id?? && documentaryNum?? && documentaryNum != '')> checked </#if><#t>
                                       <#t>name="isHasLogisticsOrder">
                                有
                            </span>
                        <#else>
                            <#if documentaryNum == ''>
                                无
                            </#if>
                        </#if>

                        <#macro hasOrderTpl documentaryNum = '' status = 1>
                            <#if documentaryNum != '' || status = 1>
                                <span class="J_documentaryNumText">${documentaryNum!''}</span>
                                <#if status == 1>
                                    <input type="hidden" class="J_documentaryNum" value="${documentaryNum!''}">
                                    <a href="javascript:;" class="J_logisticsOrder_btn <#if documentaryNum??>hasNo</#if>">
                                        <#if documentaryNum != ''>
                                            修改
                                        <#else>
                                            添加
                                        </#if>
                                    </a>
                                </#if>
                            </#if>
                        </#macro>
                        <span id="J_hasOrderBox">
                            <#if !noDocumentaryNum>
                                <@hasOrderTpl documentaryNum=documentaryNum status=status/>
                            </#if>
                        </span>
                    </div>
                    <div class="<#if status == 1>f-col-8<#else>f-col-4</#if> f-row-1">
                        <label class="<#if status == 1>f-required</#if> term">提单号码</label>
                        <#if status gt 1>：</#if>
                        <#--后端老数据空为' '-->
                        <#if ladingNumber == ' '>
                            <#assign ladingNumber = ''/>
                        </#if>
                        <#assign ladingNumberArr = ladingNumber?split("/")>
                        <#assign mainOrder = ladingNumberArr[0]!''>
                        <#assign subOrder = ladingNumberArr[1]!''>
                        <#if status == 1>
                            <span id="J_ladingNumber_radio_box">
                                <#if po.id?? || !noDocumentaryNum>
                                    <@ladingNumberAllTpl ladingNumber=ladingNumber mainOrder=mainOrder subOrder=subOrder status=status noDocumentaryNum=noDocumentaryNum/>
                                <#else>
                                    --
                                </#if>
                            </span>
                        <#else>
                            <#if ladingNumber != ''>
                                ${mainOrder}<#t>
                                <#if subOrder != ''>/</#if><#t>
                                ${subOrder}<#t>
                            <#else>
                                无
                            </#if>
                        </#if>
                        <#macro ladingNumberTextTpl mainOrder='' subOrder=''>
                            <input class="J_main_order" type="text"
                                   value="${mainOrder!''}"
                                   placeholder="请输入主要单号（MBL）">/
                            <input class="J_sub_order" type="text"
                                   value="${subOrder!''}"
                                   placeholder="请输入分单号（HBL）">
                        </#macro>
                        <#macro ladingNumberTpl mainOrder = '' subOrder=''  status = 1 hasTpl=false>
                            <#if po.id??>
                                <#if mainOrder != '' || subOrder != '' || hasTpl>
                                    <@ladingNumberTextTpl mainOrder=mainOrder subOrder=subOrder/>
                                </#if>
                            <#elseif status = 1>
                                <@ladingNumberTextTpl/>
                            </#if>
                        </#macro>
                        <#macro ladingNumberAllTpl ladingNumber='' mainOrder='' subOrder='' status = 1 noDocumentaryNum=true>
                            <input value="0" type="radio" class="J_ladingNumber_radio"
                                   <#if po.id?? && ladingNumber == ''> checked </#if><#t>
                                   name="isHasLadingNumberOrder">
                            无
                            <input value="1" type="radio" class="J_ladingNumber_radio hasLadingNumber"
                                   <#if (po.id?? && ladingNumber != '' ) || (!po.id?? && !noDocumentaryNum)> checked </#if><#t>
                                   name="isHasLadingNumberOrder">
                            有
                            <span id="J_ladingNumberBox">
                                <@ladingNumberTpl mainOrder=mainOrder subOrder=subOrder status=status/>
                            </span>
                        </#macro>
                        <#if status == 1>
                            <textarea id="J_hasOrderTpl" style="display: none">
                                <@hasOrderTpl/>
                            </textarea>
                            <textarea id="J_ladingNumberBoxTpl" style="display: none">
                                <@ladingNumberTpl hasTpl=true/>
                            </textarea>
                            <textarea id="J_ladingNumberAllTpl" style="display: none">
                                <@ladingNumberAllTpl noDocumentaryNum=false/>
                            </textarea>
                        </#if>
                    </div>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="f-required term">采购方式</label>
                    <#if status==1>
                        <select id="po-purchaseway">
                            <#list purchaseWayList as purchaseWay>
                                <#if purchaseWay?? && purchaseWay.purchaseWayId == purchaseWayType>
                                    <option value="${purchaseWay.purchaseWayId}" selected="selected">${purchaseWay.purchaseWayName}</option>
                                <#elseif fromTrackTask?? && purchaseWay.purchaseWayId == purchaseWay4Audit>
                                    <option value="${purchaseWay.purchaseWayId}" selected="selected">${purchaseWay.purchaseWayName}</option>
                                <#else>
                                    <option value="${purchaseWay.purchaseWayId}">${purchaseWay.purchaseWayName}</option>
                                </#if>
                            </#list>
                        </select>
                    <#else>
                        <label>: ${po.getPurchaseWayName()!''}</label>
                        <#if status==2 || status==3 || status==5 >
                            <a href="javascript:void(0);" id="J_edit-purchaseway" data-purchaseWayName="${po.getPurchaseWayName()!''}">修改</a>
                        </#if>
                    </#if>
                </div>
                <#if status gt 4>
                    <div class="f-col-4 f-row-1">
                        <label class="term">汇率</label>
                        <label>: ${po.exchangeRate!''}</label>
                        <#if status != 6>
                            <a href="javascript:void(0);" id="edit-exchangerate">修改</a>
                        </#if>
                    </div>
                </#if>
                <div class="f-col-4 f-row-1">
                    <label class="f-required term">运输方式</label>
                    <#if status==1>
                          <select id="po-transport">
                              <#list transportList![] as transport>
                                  <#if transport.index == settedTransportType>
                                      <option value="${transport.index}" selected>${transport.value}</option>
                                  <#else>
                                      <option value="${transport.index}">${transport.value}</option>
                                  </#if>
                              </#list>
                          </select>
                    <#else>
                        <label>: ${po.transportTypeName!''}</label>
                        <#if status==2 || status==3 || status==5 >
                            <a href="javascript:void(0);" id="J_edit-transportname" data-transportName="${po.transportTypeName!''}">修改</a>
                        </#if>
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term">起运港</label>
                    <#if status == 1>
                        <span class="supplybox">
                            <input type="text" name="departPort" placeholder="起运港"  class="supplieript j-suggest" data-selectName="departPortSelect" id="po-departport" value="${po.departPort!''}"/>
                        </span>
                        <select name="departPortSelect" class="supply" style="display:none">
                            <#list declarationPortList as item>
                            <option value="${item}" data-pinyin="${item}" <#if po.departPort?? && po.departPort == item>selected</#if>>${item}</option>
                            </#list>
                        </select>
                    <#else>
                        ${po.departPort!''}
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term">目的港</label>
                    <#if status == 1>
                        <span class="supplybox">
                            <input type="text" name="destPort" placeholder="目的港"  class="supplieript j-suggest" data-selectName="destPortSelect" id="po-destport" value="${po.destPort!''}"/>
                        </span>
                        <select name="destPortSelect" class="supply" style="display:none">
                            <#list declarationPortList as item>
                            <option value="${item}" data-pinyin="${item}" <#if po.destPort?? && po.destPort == item>selected</#if>>${item}</option>
                            </#list>
                        </select>
                    <#else>
                        ${po.destPort!''}
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term">批次</label>
                    <#if status==1>
                        <input type="text" value="${arrivalBatchNo!''}" id="po-arrivalbatchno" />
                    <#else>
                        <label>: ${arrivalBatchNo!''}</label>
                    </#if>
                </div>
                <#if status==5>
                <div class="f-col-4 f-row-1">
                    <label class="term">财务核对</label>
                    <span class="u-counter">${po.financeCheckState}</span>
                </div>
                </#if>
                <div class="f-col-4 f-row-1">
                    <label class="term">采购件数</label>
                    <#if fromTrackTask?? && auditDetailGoodsList??>
                        <#assign auditPurchaseCount=0/>
                        <#list auditDetailGoodsList as line>
                            <#assign auditPurchaseCount = auditPurchaseCount + line.purchaseCount />
                        </#list>
                        <span id="goods-count" class="u-counter">${auditPurchaseCount?c}</span>
                    <#else>
                        <span id="goods-count" class="u-counter">${po.purchaseCount?c}</span>
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term" style="width: 120px;">采购总金额(不含税)</label>
                    <#if fromTrackTask?? && auditDetailGoodsList??>
                        <#assign auditPurchaseAmount=0/>
                        <#list auditDetailGoodsList as line>
                            <#assign auditPurchaseAmount = auditPurchaseAmount + line.purchaseCount * line.unitPrice />
                        </#list>
                        <span id="goods-amount" class="u-counter">${auditPurchaseAmount?c}</span>
                    <#else>
                        <span id="goods-amount" class="u-counter">${po.purchaseAmount?c}</span>
                    </#if>
                </div>
                <div class="f-col-4 f-row-1">
                    <label class="term" style="width: 120px;">采购总金额(含税)</label>
                    <span id="j-goods-amount-tax" class="u-counter">${po.purchaseAmountWithTax!0}</span>
                </div>

                <#if status gte 3>
                <div class="m-instoreinfo">
                    <#if status==3 || status==4 || status==5 || status==6 || status==7>
                    <div>
                        <div class="f-col-4 f-row-1">
                            <label class="term">实际入库数量</label>
                            <span class="u-counter">${po.totalStorageCount?c}</span>
                        </div>
                        <div class="f-col-4 f-row-1">
                            <label class="term">实际入库金额</label>
                            <span class="u-counter">${po.totalStorageAmount?c}</span>
                        </div>
                        <#if status == 4 || status == 5 || status == 7>
                        <!-- 入库待确认、已入库、拒绝入库状态采购单详情页新增入库统计信息 -->
                        <div class="f-col-4 f-row-1">
                            <label class="term">
                                到货率
                            </label>
                            :${(po.arrivalPlanRate)!''}
                        </div>
                        </#if>
                    </div>
                    </#if>


                    <#if status == 4 || status == 5 || status == 7>
                    <!-- 入库待确认、已入库、拒绝入库状态采购单详情页新增入库统计信息 -->
                        <div class="f-col-4 f-row-1">
                            <label class="term">
                                良品数量
                            </label>
                            :${(po.totalStorageGoodsCount)!''}
                        </div>
                        <div class="f-col-4 f-row-1">
                            <label class="term">
                                良品货值
                            </label>
                            :${(po.totalStorageGoodsAmount)!''}
                        </div>
                        <div class="f-col-4 f-row-1">
                            <label class="term">次品率</label>:
                            <#assign goodCount=0/>
                            <#assign badCount=0/>
                            <#assign badPercent=0/>
                            <#assign totalCount=0/>
                            <#if fromTrackTask??>
                                <#list auditDetailGoodsList as line>
                                    <#assign goodCount = goodCount + line.goodCount />
                                    <#assign badCount = badCount + line.badCount />
                                </#list>
                                <#assign totalCount = badCount + goodCount />
                                <#if totalCount gt 0>
                                    <#assign badPercent = (badCount*100)/totalCount />
                                </#if>
                            ${badPercent?string["0.00"]}%
                            <#else>
                                <#list po.details as line>
                                    <#assign goodCount = goodCount + line.goodCount />
                                    <#assign badCount = badCount + line.badCount />
                                </#list>
                                <#assign totalCount = badCount + goodCount />
                                <#if totalCount gt 0>
                                    <#assign badPercent = (badCount*100)/totalCount />
                                </#if>
                            ${badPercent?string["0.00"]}%
                            </#if>
                        </div>
                    </#if>
                </div>
            </#if>

            <#if status==1>
                <div class="f-col-8 f-row-2">
                    <label class="term">
                        入库物流备注
                    </label>
                    <textarea class="logistics" placeholder="请填写入库配送的物流单号信息"  id="po-headermemo">${po.remark}</textarea>
                </div>
            </#if>
            <#if status gt 1>
                <div>
                    <div class="f-col-8 f-row-2">
                        <label class="term">
                            入库物流备注
                        </label>
                        : ${po.remark?html}
                    </div>
                </div>
            </#if>
            <#if po.id??>
                <div class="f-col-4 f-row-1">
                    <label class="term">货物状态</label>
                    <span>
                        ：
                        <#if documentaryNum == ''>
                            ${po.trackTaskStatus!''}
                        <#else>
                            ${po.goodsStatus!''}
                        </#if>
                    </span>
                </div>
            </#if>
            </form>
            <div class="m-variousfees" id="variousfeesbox"></div>
            <div class="m-polines">
                <table class="poline-tab w-table">
                    <colgroup>
                        <col width="6%" />
                        <col width="12%" />
                        <col width="8%" />
                        <col width="12%" />
                    <#-- 增加料号显示 -->
                        <col width="12%" />
                        <col width="12%" />
                        <col width="10%" />

                        <col width="8%" />
                        <col width="8%" />
                    <#-- <#if status==1>
                    <col width="8%" />
                    </#if> -->
                        <col width="8%" />
                        <col width="8%" />
                        <col width="8%" />
                        <col width="8%" />
                        <col width="8%" />
                        <col width="8%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="12%" />
                    <#if status==1>
                        <col width="6%" />
                    </#if>
                    <#if status gte 3>
                        <col width="8%" />
                        <col width="6%" />
                        <col width="6%" />
                        <col width="6%" />
                    </#if>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>商品ID</th>
                        <th>商品名称</th>
                        <th>跨境方式</th>
                    <#-- 增加料号显示 -->
                        <th>料号</th>
                        <th>SKU条码</th>
                        <th>SKU规格</th>

                        <th>是否白名单商品</th>
                        <th>是否受限</th>
                    <#-- <#if status==1>
                    <th>参考单价</th>
                    </#if> -->
                        <th>审批单单价（含税）</th>
                         <th>审批单单价（不含税）</th>
                        <th>审批单数量</th>
                        <th>采购单价（含税）</th>
                        <th>采购单价（不含税）</th>
                        <th>采购数量</th>
                        <th>采购金额小计(含税)</th>
                        <th>采购金额小计(不含税)</th>
                        <th>备注</th>
                    <#if status==1>
                        <th>操作</th>
                    </#if>
                    <#if status gte 3>
                        <th>已入库</th>
                        <th>良品</th>
                        <th>次品</th>
                        <th>差异数量</th>
                    </#if>
                    </tr>
                    </thead>
                    <tbody id="proList">
                    <#if fromTrackTask?? && auditDetailGoodsList??>
                        <#list auditDetailGoodsList as line>
                        <#assign firstchange2 = (line.unitPriceWithTax!0) + (line.unitPrice!0)  />
                        <tr data-goodsid="${line.goodsId?c}" data-isnew="${line.isNew!''}" data-skuid="${line.skuId}" data-firstchange="${firstchange2}">
                            <td class="goodsid ma">${line.goodsId?c}</td>
                            <td class="goodsname ma">${line.goodsName!''}</td>
                            <td class="import-type ma">${line.importTypeStr!''}</td>
                        <#-- 增加料号显示 -->
                            <td class="barcode ma">${line.productSkuCode!''}</td>
                            <td class="barcode ma">${line.skuBarcode!''}</td>
                            <td class="skudesc ma">${line.skuDesc!''}</td>

                            <td class="ma">${(line.blankStatus!"")}</td>
                            <td class="ma">${(line.restrict!"")}</td>
                        <#-- 审批单单价(含税)-->
                            <td class="ma">
                                <span class="invoiceprice-i invoiceUnitPriceWithTax" >${line.invoiceUnitPriceWithTax!''}</span>
                            <#--<input type="text" class="invoiceprice-i" value="${line.invoiceUnitPrice!''}">-->
                            </td>
                        <#-- 审批单单价（不含税）-->
                            <td class="ma">
                                <span class="invoiceprice-i invoiceUnitPrice" >${line.invoiceUnitPrice!''}</span>
                            <#--<input type="text" class="invoiceprice-i" value="${line.invoiceUnitPrice!''}">-->
                            </td>
                        <#-- 审批单数量-->
                            <td class="ma">
                                <span class="invoicecount-i">${line.invoiceCount!''}</span>
                            <#--<input type="text" class="invoicecount-i" value="${line.invoiceCount!''}">-->
                            </td>
                        <#-- 采购单价（含税）-->
                            <td class="poprice ma">
                                <input type="text" class="poprice-i purchasePriceWithTax"  data-fromtrack="true" data-originvalue="${(line.unitPriceWithTax)!''}"  data-avg="${line.referUnitPrice!0}" data-rate="${line.taxRate!''}" value="${(line.unitPriceWithTax)!''}">
                            </td>
                        <#-- 采购单价（不含税）-->
                            <td class="poprice ma">
                                <input type="text" class="poprice-i purchasePrice"  data-fromtrack="true" data-originvalue="${(line.unitPrice)!''}"  data-avg="${line.referUnitPrice!0}" data-rate="${line.taxRate!''}" value="${(line.unitPrice)!''}">
                            </td>
                            <#--采购数量-->
                            <td class="poqty ma">
                                <input type="text" class="poqty-i" value="${(line.purchaseCount)!''}" >
                            </td>
                            <#--金额小计含税-->
                            <td class="lineamounttax ma">
                                <#if (line.purchaseCount)?? && (line.purchaseUnitPriceWithTax)??>
                                ${(line.purchaseCount * line.purchaseUnitPriceWithTax )?c}
                                <#else>
                                    0
                                </#if>
                            </td>
                            <#--金额小计不含税-->
                            <td class="lineamount ma">
                                <#if (line.purchaseCount)?? && (line.unitPrice)??>
                                ${(line.purchaseCount * line.unitPrice)?c}
                                <#else>
                                    0
                                </#if>
                            </td>
                            <td class="linememo ma">
                                <textarea class="linememo-i">${line.remark!''}</textarea>
                            </td>
                            <td class="lineaction ma">
                                <a class="action-delete" href="#">删除</a>
                            </td>
                        </tr>
                        </#list>
                    <#else>
                        <#list po.details as line>
                         <#assign firstchange1 = (line.purchaseUnitPriceWithTax!0) + (line.purchaseUnitPrice!0) />
                        <tr data-goodsid="<#if line.inventory??>${line.inventory.goodsId!''}</#if>" data-skuid="${line.skuId}" data-firstchange="${firstchange1}">
                            <td class="goodsid ma"><#if line.inventory??>${line.inventory.goodsId!''}</#if></td>
                            <td class="goodsname ma"><#if line.inventory??>${line.inventory.goodsName!''}</#if></td>
                            <td class="import-type ma"><#if line.inventory??>${line.inventory.importType!''}</#if></td>
                        <#-- 增加料号显示 -->
                            <td class="barcode ma"><#if line.inventory??>${line.inventory.productSkuCode!''}</#if></td>
                            <td class="barcode ma"><#if line.inventory??>${line.inventory.skuBarcode!''}</#if></td>
                            <td class="skudesc ma"><#if line.inventory??>${line.inventory.skuDesc!''}</#if></td>
                            <td class="ma">${(line.blankStatus!"")}</td>
                            <td class="ma">${(line.restrict!"")}</td>

                            <#if status==1>
                            <#-- 审批单单含税-->
                                <td class="ma">
                                    <span class="invoiceprice-i invoiceUnitPriceWithTax">${line.invoiceUnitPriceWithTax!''}</span>
                                <#--<input type="text" class="invoiceprice-i" value="${line.invoiceUnitPrice!''}">-->
                                </td>
                            <#-- 审批单单不含税-->
                                <td class="ma">
                                    <span class="invoiceprice-i invoiceUnitPrice">${line.invoiceUnitPrice!''}</span>
                                <#--<input type="text" class="invoiceprice-i" value="${line.invoiceUnitPrice!''}">-->
                                </td>
                            <#-- 审批单数量-->
                                <td class="ma">
                                    <span class="invoicecount-i">${line.invoiceCount!''}</span>
                                <#--<input type="text" class="invoicecount-i" value="${line.invoiceCount!''}">-->
                                </td>
                            <#-- <td class="refprice ma">${line.referUnitPrice?default("")}</td> -->
                                <#-- 采购单价（含税）-->
                                <td class="poprice ma">
                                    <input type="text" class="poprice-i purchasePriceWithTax"
                                           <#if line.invoiceUnitPriceWithTax??>
                                               data-fromtrack="true"
                                               data-originvalue="${line.invoiceUnitPriceWithTax!''}"
                                           </#if>
                                           data-avg="${line.referUnitPrice!0}" data-rate="${line.taxRate!''}" value="${(line.purchaseUnitPriceWithTax)!''}">
                                     <#--<input type="text" class="poprice-i" data-avg="${line.referUnitPrice!0}" value="${(line.purchaseUnitPrice)!''}">-->
                                </td>
                             <#-- 采购单价（不含税）-->
                                <td class="poprice ma">
                                    <input type="text" class="poprice-i purchasePrice"
                                            <#if line.invoiceUnitPrice??>
                                               data-fromtrack="true"
                                               data-originvalue="${line.invoiceUnitPrice!''}"
                                            </#if>
                                           data-avg="${line.referUnitPrice!0}" data-rate="${line.taxRate!''}"  value="${(line.purchaseUnitPrice)!''}">
                                </td>
                                <td class="poqty ma">
                                    <input type="text" class="poqty-i" value="${(line.purchaseCount)!''}">
                                </td>
                                <td class="lineamounttax ma">
                                ${(line.purchaseCount!0) * (line.purchaseUnitPriceWithTax !0)}
                                </td>
                                <td class="lineamount ma">
                                   ${(line.purchaseCount!0) * (line.purchaseUnitPrice!0)}
                                </td>
                                <td class="linememo ma">
                                    <textarea class="linememo-i">${line.remark}</textarea>
                                </td>
                                <td class="lineaction ma">
                                    <a class="action-delete" href="#">删除</a>
                                </td>
                            <#else>
                            <#-- 审批单单价-->
                                <td class="ma">
                                ${line.invoiceUnitPriceWithTax!''}
                                </td>
                                <td class="ma">
                                ${line.invoiceUnitPrice!''}
                                </td>
                            <#-- 审批单数量-->
                                <td class="ma">
                                ${line.invoiceCount!''}
                                </td>
                                <td class="poprice purchasePriceWithTax ma">
                                ${(line.purchaseUnitPriceWithTax)!0} <#if status==5><a href="javascript:void(0)"   class="j-updateup"   data-rate="${line.taxRate!''}" data-orginprice="${(line.purchaseUnitPriceWithTax)!0}"   data-price="${(line.purchaseUnitPrice)!0}" data-orderid="${(po.id)!''}"  data-skuid="${(line.skuId)!''}">修改</a></#if>
                                </td>
                                <td class="poprice purchasePrice ma">
                                ${(line.purchaseUnitPrice)!0}<#if status==5><a href="javascript:void(0)" class="j-updateup" data-rate="${line.taxRate!''}"  data-orginprice="${(line.purchaseUnitPriceWithTax)!0}"   data-price="${(line.purchaseUnitPrice)!0}" data-orderid="${(po.id)!''}"  data-skuid="${(line.skuId)!''}">修改</a></#if>
                                </td>
                                <td class="poqty ma">
                                ${(line.purchaseCount)!''}
                                </td>
                                <#--金额小计含税-->
                                <td class="lineamounttax ma">
                                    <#if (line.purchaseCount)?? && (line.purchaseUnitPriceWithTax)??>
                                    ${(line.purchaseCount * line.purchaseUnitPriceWithTax )?c}
                                    <#else>
                                        0
                                    </#if>
                                </td>
                                <td class="lineamount ma">${(line.purchaseCount * (line.purchaseUnitPrice!0))?c}
                                </td>

                                <td class="linememo ma">
                                    ${line.remark?html}
                                </td>
                                <#if status gte 3>
                                    <td class="ma">${line.storedCount?c}</td>
                                    <td class="ma">${line.goodCount?c}</td>
                                    <td class="ma">${line.badCount?c}</td>
                                    <td class="ma">${(line.storedCount-line.purchaseCount)?c}</td>
                                </#if>
                            </#if>
                        </tr>
                        </#list>
                    </#if>
                    </tbody>
                </table>
            </div>
            <div class="m-line-ctrl">
            <#if status==1>
                <input type="button" value="清空列表" class="w-btn w-btn-blue u-btn" id="clearBtn">
                <input type="button" value="添加商品" class="w-btn w-btn-blue u-btn" id="addBtn">
                <input type="button" value="导入商品" class="w-btn w-btn-blue u-btn" id="importBtn">
            <#elseif status==2>
                <input type="button" value="审核通过" class="w-btn w-btn-blue u-btn" id="approveBtn">
                <input type="button" value="审核驳回" class="w-btn w-btn-blue u-btn" id="rejectBtn">
            <#elseif status==4>
                <input type="button" value="入库确认" class="w-btn w-btn-blue u-btn" id="confirmBtn">
                <input type="button" value="入库拒绝" class="w-btn w-btn-blue u-btn" id="refuseBtn">
            </#if>
            <#if status gte 4>
                <#if needShowExport?? && needShowExport == 1>
                    <input type="button" value="导出入库批次明细" class="w-btn w-btn-blue u-btn" id="exportBatchInfoBtn" />
                </#if>
                <#if expMessage??>
                    <span class="color-red">${expMessage!""}</span>
                </#if>
            </#if>
            </div>
            <#if tallyAuditStatus?? && (tallyAuditStatus == 0 || tallyAuditStatus == 1 || tallyAuditStatus == 2)>
            <a class="w-btn w-btn-blue" href="/backend/invoicing/order/tallyreport?id=${po.id}" target="_blank">查看理货报告（${['待审核', '已审核', '已驳回'][tallyAuditStatus]}）</a>
            </#if>
            <!-- 效期文件上传模块 -->
            <div id="expiryModule"></div>
            <!-- 箱单发票上传模板 -->
            <div id="packingAndInvoice"></div>

            <#if po?? && po.taskAttachments?has_content>
            <div class="m-box">
                <h5 class="s-fs-16 s-fw-bold">附件</h5>
                <#list po.taskAttachments as atm>
                <a href="${atm.attachmentUrl}" target="_blank">${atm.attachmentName}</a>&emsp;
                </#list>
            </div>
            </#if>
            <div>
            <h5 class="u-attach-title">
              仓库处理到货状态
            </h5>
            <ul class="m-timeline">
              <#list stages![] as stage>
              <li>
                <div class="u-timestamp">
                  <#if stage.time??>
                  <span>${stage.time?number_to_date}<span>
                  <#else>
                  <span>TBD<span>
                  </#if>
                </div>
                <div class="u-status">
                  <h4>${stage.stage}</h4>
                </div>
              </li>
              </#list>
             </ul>
            </div>
            <div class="m-action-history">
                <h5 class="title">操作记录</h5>
                <div class="logs">
                <#list po.logs as log>
                    <p class="detail">${log.operatorName?default("null")?html} 于 ${log.time?number_to_datetime?string("yyyy-MM-dd HH:mm:ss")} ${log.action}<#if !log.feesOperationInfo??>；</#if>${log.remark?? ?string("备注：","")}${log.remark?default("")?html}</p>
                </#list>
                </div>
            </div>
        </div>
    </div>
</div>
<@htmFoot />
<#-- 商品选择清单模板 -->
<div style="display:none">
    <#noparse>
    <textarea class="f-hide" name="jst" id="jst-itemlist">
        <div>
            <label>搜索</label>
            <input type="text" placeholder="可按照商品名称、料号、条形码和后台ID搜索" style="width:300px;" class="psearch" />
            <input type="button" value="搜索" class="w-btn w-btn-blue" onclick="haitao.g.filterProducts(event)">
        </div>
        <ul class="itemlist" id="treebox"></ul>
    </textarea>
    <textarea class="f-hide" name="jst" id="jst-treelist">
        {list items as item}
        <li class="itementry" data-goodsid="${item.goodsId}">
            <label class="item name" >
                <input type="checkbox" value="1">(${item.importType|escape})${item.goodsName|escape}
            </label>
            {list item.skuList as sku}
            <label class="item sku">
                <input type="checkbox" data-skuid="${sku.skuId}">${sku.skuDesc|escape}【${sku.skuCode}】
            </label>
            {/list}
        </li>
        {/list}
    </textarea>
    </#noparse>
    <#noparse>
    <textarea class="f-hide" name="jst" id="jst-ullist">
        {list items as item}
        <li class="itementry" data-goodsid="${item.goodsId}">
            <label class="item name" >
                <input type="checkbox" value="1">(${item.importType|escape})${item.goodsName|escape}
            </label>
            {list item.skuList as sku}
            <label class="item sku">
                <input type="checkbox" data-skuid="${sku.skuId}">${sku.skuDesc|escape}【${sku.skuCode}】
            </label>
            {/list}
        </li>
        {/list}
    </textarea>
    </#noparse>
    <#noparse>
    <textarea class="f-hide" name="jst" id="jst-new-poline">
    {list lines as line}
    <tr data-goodsid="${line.goodsId}" data-skuid="${line.skuId}"  data-firstchange="${line.firstchange}" >
        <td class="goodsid ma">${line.goodsId}</td>
        <td class="goodsname ma">${line.goodsName|escape}</td>
        <td class="import-type ma">${line.importType|escape}</td>
        <#-- 增加料号显示 -->
        <td class="barcode ma">${line.productSkuCode|escape}</td>
        <td class="barcode ma">${line.skuBarcode|escape}</td>
        <td class="skudesc ma">${line.skuDesc|escape}</td>

        <td class="ma">${(line.blankStatus || '')}</td>
        <td class="ma">${(line.restrict || '')}</td>
        <#-- 审批单单价-->
        <td class="ma">
            <span class="invoiceprice-i invoiceUnitPriceWithTax">${line.invoiceUnitPriceWithTax || ''}</span>
        </td>
        <td class="ma">
            <span class="invoiceprice-i invoiceUnitPrice">${line.invoiceUnitPrice || ''}</span>
        </td>
        <#-- 审批单数量-->
        <td class="ma">
            <span class="invoicecount-i">${line.invoiceCount || ''}</span>
        </td>
        <#-- 采购单价-->
        <td class="poprice ma">
            <input type="text" class="poprice-i purchasePriceWithTax"
                   {if line.invoiceUnitPriceWithTax}
                       data-fromtrack="true"
                       data-originvalue="${line.invoiceUnitPriceWithTax}"
                   {/if}
            data-avg="${line.referUnitPrice}" data-rate="${line.taxRate}" value="${line.purchasePriceWithTax}">
        </td>
         <td class="poprice ma">
            <input type="text" class="poprice-i purchasePrice"
                   {if line.invoiceUnitPrice}
                       data-fromtrack="true"
                       data-originvalue="${line.invoiceUnitPrice}"
                   {/if}
             data-avg="${line.referUnitPrice}" data-rate="${line.taxRate}"  value="${line.purchasePrice}">
        </td>
        <#-- 采购数量-->
        <td class="poqty ma">
            <input type="text" class="poqty-i" value="${line.purchaseCount}">
        </td>
        <#--小计含税-->
        <td class="lineamounttax ma">
            {if line.purchaseCount * line.purchaseUnitPriceWithTax  }
            {var amount = (line.purchaseCount * line.purchaseUnitPriceWithTax ).toFixed(2)}
            ${amount}
            {/if}
        </td>
        <td class="lineamount ma">
            {if line.purchaseCount * line.purchasePrice }
            {var amount = (line.purchaseCount * line.purchasePrice).toFixed(2)}
            ${amount}
            {/if}
        </td>
        <td class="linememo ma">
            <textarea class="linememo-i">${line.remark}<&#47textarea>
        </td>
        <td class="lineaction ma">
            <a class="action-delete" href="#">删除</a>
        </td>
    </tr>
    {/list}
    </textarea>
    <textarea  class="f-hide" name="jst" id="jst-approve">
        <div class="simple-content">
            确定要审核：<span class="f-hightlight">${poNumber}</span> 这笔采购单吗？
        </div>
    </textarea>
    <textarea  class="f-hide" name="jst" id="jst-submit">
        <div class="simple-content">
            确定要提交：<span class="f-hightlight">${poNumber}</span> 这笔采购单吗？
        </div>
    </textarea>
    <textarea  class="f-hide" name="jst" id="jst-confirm">
        <div class="confirm-content">
            <span class="confirm-text">确定要对：<span class="f-hightlight">${poNumber} </span>这笔采购单进行入库确认？</span>
            <p>确认后库存会更新到前台</p>
            <div style="margin-bottom:10px;">
                <label class="f-required">汇率
                    <input class="confirm-exchange" value="${exchangeRate}"/>
                </label>
                {if !exchangeRate}<span class="u-info-tip">财务还未录入相应的汇率，请跟财务确认</span>{/if}
            </div>
            <div class="f-required">
            是否最后一批审批单：
            <input type="radio" name="last-audit" value="false" checked> 否
            <input type="radio" name="last-audit" value="true"> 是(自动终止采购单对应的审批单)
            </div>
            <label class="f-required">备注
                <textarea class="confirm-memo"><&#47textarea>
            </label>
        </div>
    </textarea>
    <textarea  class="f-hide" name="jst" id="jst-refuse">
        <div class="confirm-content">
            <span class="confirm-text">确定要对：<span class="f-hightlight">${poNumber} </span>这笔采购单进行入库拒绝？</span>
            <br>
            <label class="f-required">备注
                <textarea class="confirm-memo"><&#47textarea>
            </label>
        </div>
    </textarea>
    <textarea  class="f-hide" name="jst" id="jst-finance">
        <div class="confirm-content">
            <span class="confirm-text">确定要对：<span class="f-hightlight">${poNumber} </span>这笔采购单进行财务核对吗？</span>
            <br>
            <span>核对后表示该采购单财务已审核确认</span>
            <label class="f-required">备注
                <textarea class="confirm-memo"><&#47textarea>
            </label>
        </div>
    </textarea>
    </#noparse>
</div>
<#-- Regualr模板 -->
<div id="template" style="display:none">
    <textarea id="variousfees">
    {#list dataAry as data}
        {#if state > 1}
            <div class="row f-clearfix">
            <label class="tit">{data.text}</label>
            <div class="block">
                <label>有无情况：</label>
                <span>{data.StateName}</span>
            </div>
            {#if data.State==1}
            <div class="block">
                <label>币种：</label>
                <span>{data.CurrencyTypeName}</span>
            </div>
            <div class="block">
                <label>汇率：</label>
                <span>{data.ExchangeRate}</span>
            </div>
            <div class="block">
                <label>支付金额：</label>
                <span>{data.PaymentAmount}</span>
            </div>
            <div class="block">
                <label>国际物流订单：</label>
                {#if data.OrderNum != '--'}
                <a href="{data.OrderUrl}" target="_blank">{data.OrderNum}</a>
                {#else}--
                {/if}
            </div>
            <div class="block">
                <label>状态：</label>
                <span>{data.OrderStatus}</span>
            </div>
            {/if}
            {#if state != 7 && (data_index >= 2 || feeEdit)}
            <div class="modify" on-click={this.modify(data, data_index)}>修改</div>
            {/if}
        </div>
        {#else}
            <div class="row f-clearfix">
            <label class="tit">{data.text}</label>
            <div class="block">
                <label>有无情况</label>
                <select r-model="{data.State}" >
                <#list feesStateList as feesState>
                    <option value="${feesState.feesStateId}">${feesState.feesStateName}</option>
                </#list>
                </select>
            </div>
            {#if data.State==1}
            <div class="block">
                <label>币种</label>
                <select on-mouseup={this.checkItem(data, data_index)} r-model="{data.CurrencyType}"{#if data.currencyError} class="f-alert"{/if}>
            <#list currencyList as currency>
                <option value="${currency.currencyId}">${currency.currencyName}</option>
            </#list>
                </select>
            </div>
            <div class="block">
                <label>汇率</label>
                <input on-blur={this.checkItem(data, data_index)} type="text" placeholder="兑人民币汇率" r-model="{data.ExchangeRate}"{#if data.exchangeError} class="f-alert"{/if} />
            </div>
            <div class="block">
                <label>支付金额</label>
                <input on-blur={this.checkItem(data, data_index)} type="text" r-model={data.PaymentAmount}{#if data.paymentError} class="f-alert"{/if} />
            </div>
            {/if}
            <div class="block">
                <label>国际物流订单：</label>
                {#if data.orderNum}
                <a href="data.OrderUrl" target="_blank">{data.OrderNum}</a>
                {#else}--
                {/if}
            </div>
            <div class="block">
                <label>状态：</label>
                <span>{data.OrderStatus}</span>
            </div>
        </div>
        {/if}
    {/list}
    </textarea>
    <textarea id="feesChange">
        <div class="m-feeslayer f-clearfix">
            <div class="block">
                <label>有无情况</label>
                <select r-model="{feesData.State}" >
                    <#list feesStateList as feesState>
                        <option value="${feesState.feesStateId}">${feesState.feesStateName}</option>
                    </#list>
                </select>
            </div>
            <div class="block">
                <label>币种</label>
                <select r-model="{feesData.CurrencyType}"{#if feesData.State==0} disabled{/if}>
                    <#list currencyList as currency>
                        <option value="${currency.currencyId}">${currency.currencyName}</option>
                    </#list>
                </select>
            </div>
            <div class="block">
                <label>汇率</label>
                <input type="text" placeholder="兑人民币汇率" r-model="{feesData.ExchangeRate}"{#if feesData.State==0} disabled{/if} />
            </div>
            <div class="block">
                <label>支付金额</label>
                <input type="text" r-model={feesData.PaymentAmount}{#if feesData.State==0} disabled{/if} />
            </div>
        </div>
    </textarea>
</div>

<!-- @NOPARSE -->
<script type="text/javascript">
    var variousfeesData = {
        dataAry : [{text:"国际费用",index:0,pre:'internationalFees',State:1},{text:"转关费用",index:1,pre:'transitCosts',State:1},{text:"佣金费用",index:2,pre:'commissionCharges',State:1}]
    };
    var currencyList = ${stringify(currencyList![])};
    var transportList = ${stringify(transportList![])};
    var purchaseWayList = ${stringify(purchaseWayList![])};
    variousfeesData.state = <#if !purchaseOrder??>-1<#else>${po.status.intValue()}</#if>;
    <#assign prelist=["internationalFees","transitCosts","commissionCharges"] />
    <#if !!purchaseOrder??>
        <#list prelist as pre>
        variousfeesData.dataAry[${pre_index}].State = ${purchaseOrder[pre+"State"].intValue()?default(1)};
        variousfeesData.dataAry[${pre_index}].StateName = '${purchaseOrder[pre+"State"]?default("有费用")}';
        variousfeesData.dataAry[${pre_index}].CurrencyType = ${purchaseOrder[pre+"CurrencyType"].intValue()?default(-1)};
        variousfeesData.dataAry[${pre_index}].CurrencyTypeName = '${purchaseOrder[pre+"CurrencyType"]?default("未指定")}';
        variousfeesData.dataAry[${pre_index}].ExchangeRate = ${purchaseOrder[pre+"ExchangeRate"]?default("''")};
        variousfeesData.dataAry[${pre_index}].PaymentAmount = ${purchaseOrder[pre+"PaymentAmount"]?default("''")};
        variousfeesData.dataAry[${pre_index}].MaintenanceStatus = ${purchaseOrder[pre+"MaintenanceStatus"].intValue()?default(-1)};
        variousfeesData.dataAry[${pre_index}].MaintenanceStatusName = '${purchaseOrder[pre+"MaintenanceStatus"]?default("未维护")}';
        variousfeesData.dataAry[${pre_index}].OrderNum = '${purchaseOrder[pre+"OrderNum"]?default("--")}';
        variousfeesData.dataAry[${pre_index}].OrderUrl = '${purchaseOrder[pre+"OrderUrl"]?default("javascript:;")}';
        variousfeesData.dataAry[${pre_index}].OrderStatus = '${purchaseOrder[pre+"OrderStatus"]?default("--")}';
        </#list>
    </#if>
    var auditId = ${auditId!0},
            poId    = "${(po.id)!''}",
            fromTrackTask = ${(fromTrackTask!false)?c},
            exchangeRate = '${exchange_rate!''}',
            purchaseOrderStatus= '${status}';
    if ( exchangeRate == '' || isNaN(exchangeRate) ) {
        exchangeRate = '';
    } else {
        exchangeRate = exchangeRate;
    }
    <#if status==1>
        <#if fromTrackTask??>
        var contractno = '${contractNo4Audit!""}';
        <#else>
        var contractno = '${po.contractNo!""}';
        </#if>
    <#else>
    var contractno = '${po.contractNo!""}';
    </#if>
    var supplierGradeList={<#list supplierGradeList as item>${item.index}:'${item.value!""}',</#list>};
    <#if status!=1>
    var supplierId=${po.supplierId};
    </#if>
    <#if !po?? || !(po.id)?? || po.id == 0>
    window.createmode = true;

    window.expiryattachments = [];
    <#else>
    window.purchaseOrderAttachments = [];
        <#if po.attachments?has_content>
            <#list po.attachments as attachment>
            window.purchaseOrderAttachments.push({
                id:${(attachment.id)!''},
                relatedId:${(attachment.relatedId)!''},
                attachmentName:'${(attachment.attachmentName)!''}',
                attachmentUrl:'${(attachment.attachmentUrl)!''}',
                typeValue:${(attachment.typeValue)!''}
            });
            </#list>
        </#if>
    </#if>
    <#if feeEdit??>
    var feeEdit = ${feeEdit?c};
    </#if>
    var declarationPortList = ${stringify(declarationPortList![])};
</script>
<!-- /@NOPARSE -->

<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="${js_root}/module/psinventory/create.js"></script>
</body>
</html>
