<#-- Created by hale on 18/06/2015. -->
<#-- 商品备案计划详情页：/backend/relateRecord/showRecordDetail -->

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
<#--                     ${stringify(sku)} -->
                    <dl class="detail f-clearfix">
                        <dt>商品名称：</dt>
                        <dd class="large">${sku.goodsName!''}</dd>
                        <br/>

                        <dt>商品条码：</dt>
                        <dd><a href="javascript:;" title="${sku.barcode!''}">${sku.barcode!''}</a></dd>
                        <dt>入库仓库：</dt>
                        <dd><a href="javascript:;" title="${sku.storageName!''}">${sku.storageName!''}</a></dd>

                        <dt>跨境方式：</dt>
                        <#assign importTypes=["直邮","保税","海淘"] />
                        <#if sku.importType?is_number>
                        <dd>${importTypes[sku.importType]}</dd>
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
                        <dd>${sku.expirationDate!''}</dd>
                        <dt>申报净重：</dt>
                        <dd>${sku.weight!''}</dd>
                        <dt>商品尺寸：</dt>
                        <dd>${sku.goodsSize!''}</dd>
                        <dt>型号：</dt>
                        <dd>${sku.goodsModel!''}</dd>
                        <br />

                        <dt>使用电压：</dt> 
                        <dd>${sku.goodsVoltage!''}</dd>
                        <dt>配件附件：</dt>
                        <dd><a href="javascript:;"title="${sku.goodsAccessory!''}">${sku.goodsAccessory!''}</a></dd>
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
                        <dd class="large">${sku.ingredient!''}</dd>
                        <br />

                        <dt>商品材质：</dt>
                        <dd class="large">${sku.goodsMaterial!''}</dd>
                        <br/>

                        <dt>参考链接：</dt>
                        <#if sku.referenceLink?contains("http")>
                            <#assign referenceLink = sku.referenceLink />
                        <#else>
                           <#assign referenceLink = "//" + sku.referenceLink/>
                        </#if>
                        <dd class="large"><a href="${referenceLink!''}" class="link" target="_blank">${sku.referenceLink!''}</a></dd>
                        <br/>

                        <#if sku.isRecorded == 0 >
                            <a href="javascript:;" class="btn w-btn w-btn-white" id="recordGoods">完成备案</a>
                        </#if>
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
<#--                         <#else>
                        <a href="javascript:;" class="btn w-btn w-btn-white" id="relateGoods">关联商品</a>-->
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
<script>
    var id         = '${sku.id}',
        isRelated  = '${sku.isRelated!false}',
        isRecorded = '${sku.isRecorded!false}';
</script>
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/relateRecord/recordDetail.js"></script>
</body>
</html>