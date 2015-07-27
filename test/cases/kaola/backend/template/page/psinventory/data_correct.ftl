<#include "../wrapper/import.ftl">
<@htmHead title="DataCorrectPage">
<style>
    .w-dataform{margin:20px 0 0 50px;}
    .w-dataform .item{width:1200px;margin:10px;}
    .w-dataform button{float:right;}
</style>
</@htmHead>

<b>NOTES</b><br>
isGood - 是否良品<br>
wmsId - iscs / sinotrans / dcits / nb_eport<br>
stockId - 咨询chenkan@corp.netease.com<br>
ownerId - 163<br>
apiUrl - eg. http://223.252.220.85:8181/callback/wms<br>

<div class="w-dataform">
    <div class="item f-clearfix">
        <span>单个SKU盘盈</span>
        <input type="text" placeholder="skuId"/>
        <input type="text" placeholder="qty"/>
        <input type="text" placeholder="isGood[true/false]"/>
        <input type="text" placeholder="wmsId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="ownerId"/>
        <input type="text" placeholder="apiUrl"/>
        <button class="w-btn w-btn-blue">盘盈</button>
    </div>
    <div class="item f-clearfix">
        <span>单个SKU盘亏</span>
        <input type="text" placeholder="skuId"/>
        <input type="text" placeholder="qty"/>
        <input type="text" placeholder="isGood[true/false]"/>
        <input type="text" placeholder="wmsId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="ownerId"/>
        <input type="text" placeholder="apiUrl"/>
        <button class="w-btn w-btn-blue">盘亏</button>
    </div>
    <div class="item f-clearfix">
        <span>单个SKU提货</span>
        <input type="text" placeholder="skuId"/>
        <input type="text" placeholder="qty"/>
        <input type="text" placeholder="isGood[true/false]"/>
        <input type="text" placeholder="wmsId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="ownerId"/>
        <input type="text" placeholder="apiUrl"/>
        <button class="w-btn w-btn-blue">提货</button>
    </div>
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/data_correct.js"></script>
