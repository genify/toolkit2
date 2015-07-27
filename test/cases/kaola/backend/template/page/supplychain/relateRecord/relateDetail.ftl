<#-- Created by hale on 18/06/2015. -->
<#-- 订单列表页面：/backend/relateRecord -->

<#include "../../wrapper/import.ftl">
<@htmHead title="供货管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/relateRecord/detail.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-zoomout">
                            查看详情
                        </h2>
                    </div>
                    <dl class="detail f-clearfix">
                        <dt>商品名称：</dt>
                        <dd class="large">${sku.goodsName!''}</dd>
                        <br/>

                        <dt>商品条码：</dt>
                        <dd><a href="javascript:;" title="${sku.barcode!''}">${sku.barcode!''}</a></dd>
                        <dt>入库仓库：</dt>
                        <dd>${sku.storageName!''}</dd>

                        <dt>跨境方式：</dt>
                        <#assign importTypes=["直邮","保税","海淘"] />
                        <#if sku.importType?is_number>
                        <dd><a href="javascript:;" title="${importTypes[sku.importType]}">${importTypes[sku.importType]}</a></dd>
                        <#else>
                        <dd>全部</dd>
                        </#if>

                        <dt>商品品牌：</dt>
                        <dd><a href="javascript:;" title="${sku.brandName!''}">${sku.brandName!''}</a></dd> 
                        <br/>
                        
                        <dt>商品规格：</dt>
                        <dd><a href="javascript:;" title="${sku.goodsUnit!''}">${sku.goodsUnit!''}</a></dd>
                        <dt>类目用途：</dt>
                        <dd><a href="javascript:;" title="${sku.category!''}">${sku.category!''}</a></dd>
                        <dt>原产国/采购国：</dt>
                        <dd><a href="javascript:;" title="${sku.originCountry!''} / ${sku.purchasingCountry!''}">${sku.originCountry!''} / ${sku.purchasingCountry!''}</a></dd>
                        <dt>生产企业：</dt>
                        <dd><a href="javascript:;" title="${sku.productionEnterprise!''}">${sku.productionEnterprise!''}</a></dd>
                        <br/>                    
    
                        <dt>保质期：</dt>
                        <dd><a href="javascript:;" title="${sku.expirationDate!''}">${sku.expirationDate!''}</a></dd>
                        <dt>申报净重：</dt>
                        <dd><a href="javascript:;" title="${sku.weight!''}">${sku.weight!''}</a></dd>
                        <dt>商品尺寸：</dt>
                        <dd><a href="javascript:;" title="${sku.goodsSize!''}">${sku.goodsSize!''}</a></dd>
                        <dt>型号：</dt>
                        <dd><a href="javascript:;" title="${sku.goodsModel!''}">${sku.goodsModel!''}</a></dd>
                        <br />

                        <dt>使用电压：</dt> 
                        <dd><a href="javascript:;" title="${sku.goodsVoltage!''}">${sku.goodsVoltage!''}</a></dd>
                        <dt>配件附件：</dt>
                        <dd><a href="javascript:;" title="${sku.goodsAccessory!''}">${sku.goodsAccessory!''}</a></dd>
                        <dt>备案料号：</dt>
                        <dd><a href="javascript:;" title="${sku.productSkuCode!''}">${sku.productSkuCode!''}</a></dd>
                        <br />

                        <dt>是否多SKU：</dt>
                        <#assign isMultiSku=["是","否"] />
                        <dd>${isMultiSku[sku.isMultiSku]}</dd>
                        <dt>SKU备注：</dt>
                        <dd><a href="javascript:;" title="${sku.skuDesc!''}">${sku.skuDesc!''}</a></dd>
                        <br />

                        <dt>成分说明：</dt>
                        <dd class="large"><a href="javascript:;" title="${sku.ingredient!''}">${sku.ingredient!''}</a></dd>
                        <br />

                        <dt>商品材质：</dt>
                        <dd class="large"><a href="javascript:;" title="${sku.goodsMaterial!''}">${sku.goodsMaterial!''}</a></dd>
                        <br/>

                        <dt>参考链接：</dt>
                        <#if sku.referenceLink?contains("http")>
                            <#assign referenceLink = sku.referenceLink />
                        <#else>
                           <#assign referenceLink = "//" + sku.referenceLink/>
                        </#if>
                        <dd class="large"><a class="link" href="${referenceLink!''}" target="_blank">${sku.referenceLink!''}</a></dd>
                        <br/>

                        <#if sku.isRelated == 1>
                        <h3 class="subtitle">关联商品</h3>
                        <dt>商品名称：</dt>
                        <dd class="large">${sku.mmGoodsName!''}</dd>
                        <br />
                        <dt>SKU：</dt>
                        <dd class="large">${sku.mmSkuDesc!''}</dd>
                        <br />
                        <dt>商品料号</dt>
                        <dd class="large">${sku.mmProductSkuCode!''}</dd>
                        <#else>
                        <a href="javascript:;" class="btn w-btn w-btn-white" id="relateGoods">关联商品</a>
                        </#if>

                        <p class="logs">
                            操作日志<br/>
                            <#list logs![] as log>
                                ${log.operatorName}(${log.personalName}) 于 ${log.time?number_to_date?string('yyyy-MM-dd HH:mm:ss')}&nbsp; ${log.remark!''}<br/>
                            </#list>
                        </p>
                    </dl>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
    <div id="dialog"></div>
</div>

<@htmFoot />
<!-- @DEFINE -->
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/relateRecord/detail.js"></script>
</body>
</html>