<#-- Created by lzf on 16/05/2015. -->
<#include "../wrapper/import.ftl">
<@htmHead title="物流时效设置">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/logisticRule.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">揽收时效管理</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="f-rowgroup">
                        	<button name="addrule" data-addtype=0 class="w-btn w-btn-black f-fr j-addbtn">新 增</button>
                        </div>
                        <div id="list1"></div>
                     </div>
                </div>
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">妥投时效管理</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="f-rowgroup">
                        	<button name="addlogistic" data-addtype=1 class="w-btn w-btn-black f-fr j-addbtn">新 增</button>
                        </div>
                        <div id="list2"></div>
                     </div>
                </div>
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">物流预警收件人管理</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="f-rowgroup">
                        	<button name="addmail" data-addtype=2 class="w-btn w-btn-black f-fr j-addbtn">新 增</button>
                        </div>
                        <div id="list3"></div>
                     </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<@htmFoot />

<!-- @NOPARSE -->
<script>
    var companyList = ${stringify(companys![])};
    var companyMap = {};
    for(var i=0,l=companyList.length;i<l;i++){
        companyMap[companyList[i].logisticsId] = companyList[i].logisCompanyName;
    }
</script>
<!-- /@NOPARSE -->

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/statistics/logisticRule.js"></script>
</body>
</html>