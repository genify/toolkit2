<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="补货周期设置">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/stockUpPeriod.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">商品备货周期管理</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<form id="searchForm">
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">&nbsp;</div>
                        			<div class="col col-span2">&nbsp;
                        			</div>
                        			<div class="col col-span2">&nbsp;
                        			</div>
                        			<div class="col col-span4">
                        				<select name="type">
                        					<option value="1">商品ID</option>
                        					<option value="2">料号</option>
                        				</select>
                        				<input type="text" placeholder="输入商品ID或料号查询" name="searchvalue"/>
                        				<button  name="submit" class="w-btn w-btn-black btag">查询</button>
                        				<button  name="adddata"class="w-btn w-btn-black btag">新增</button>
                        			</div>
                        		</div>
                        	</form>
                        </div>
                        <div id="list"></div>
                        <div>
                        <div class="col col-span2">&nbsp;</div>
                        			<div class="col col-span2">&nbsp;
                        			</div>
                        			<div class="col col-span2">&nbsp;
                        			</div>
                        			<div class="col col-span2">&nbsp;
                        			</div>
                        			<div class="col">&nbsp;
                        			</div>
                        			<div class="col">
                        				<button id="addmail" class="w-btn w-btn-black btag">新增</button>
                        			</div>
                        </div>
                        <div id="list1"></div>
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
<script src="/backend/src/js/module/statistics/stockUpPeriod.js"></script>
</body>
</html>