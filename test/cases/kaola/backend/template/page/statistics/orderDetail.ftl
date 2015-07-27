<#-- Created by wjf on 27/01/2015. -->
<#-- 订单明细表：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="订单明细表">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/orderdetail.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
	<div class="g-bd">
		<div class="g-bdc">
			<div class="m-main">
				<div class="m-databox">
					<div class="head f-clearfix">
                        <h2 class="icf-keyboard">订单明细查询</h2>
                    </div>
                    <div class="detail">
              	        <div id="searchbox" class="w-dataform f-clearfix">
                      		<form id="searchForm">
                      			<div class="f-rowgroup f-rowgroup-10">
                      				<div class="col">
                      					<label>跨境方式：</label>
                      					<select name="importType">
                                            <option value="">全部</option>
                      						<#list importTypeList as item>
                      							<option value="${item.index}">${item.value}</option>
                      						</#list>
                      					</select>
                      				</div>
                      				<div class="col">
                      					<label>发货仓库：</label>
                      					<select name="storageId">
                                            <option value="">全部</option>
                      						<#list warehouseList as item>
                      							<option value="${item.warehouseId}">${item.warehouseName}</option>
                      						</#list>
                      					</select>
                      				</div>
                      				<div class="col">
                      					<label>物流公司：</label>
                      					<select name="logisticCompanyId">
                                            <option value="">全部</option>
                      						<#list logisticCompanyList as item>
                      							<option value="${item.logisticsId}">${item.logisCompanyName}</option>
                      						</#list>
                      					</select>
                      				</div>
                                    <div class="col">
                                        <label>目标省份：</label>
                                        <select name="tProv">
                                            <option value="">全部</option>
                                            <option value="北京市">北京市</option>
                                            <option value="天津市">天津市</option>
                                            <option value="河北省">河北省</option>
                                            <option value="山西省">山西省</option>
                                            <option value="内蒙古自治区">内蒙古自治区</option>
                                            <option value="辽宁省">辽宁省</option>
                                            <option value="吉林省">吉林省</option>
                                            <option value="黑龙江省">黑龙江省</option>
                                            <option value="上海市">上海市</option>
                                            <option value="江苏省">江苏省</option>
                                            <option value="浙江省">浙江省</option>
                                            <option value="安徽省">安徽省</option>
                                            <option value="福建省">福建省</option>
                                            <option value="江西省">江西省</option>
                                            <option value="山东省">山东省</option>
                                            <option value="河南省">河南省</option>
                                            <option value="湖北省">湖北省</option>
                                            <option value="湖南省">湖南省</option>
                                            <option value="广东省">广东省</option>
                                            <option value="广西壮族自治区">广西壮族自治区</option>
                                            <option value="海南省">海南省</option>
                                            <option value="重庆市">重庆市</option>
                                            <option value="四川省">四川省</option>
                                            <option value="贵州省">贵州省</option>
                                            <option value="云南省">云南省</option>
                                            <option value="西藏自治区">西藏自治区</option>
                                            <option value="陕西省">陕西省</option>
                                            <option value="甘肃省">甘肃省</option>
                                            <option value="青海省">青海省</option>
                                            <option value="宁夏回族自治区">宁夏回族自治区</option>
                                            <option value="新疆维吾尔自治区">新疆维吾尔自治区</option>
                                            <option value="香港特别行政区">香港特别行政区</option>
                                            <option value="海外">海外</option>
                                        </select>
                                    </div>
                      				<div class="col">
                      					<label>发货状态：</label>
                      					<select name="handoverState">
                      						<option value="">全部</option>
                      						<option value="1">已发货</option>
                      						<option value="0">未发货</option>
                      					</select>
                      				</div>
                                </div>
                                <div class="f-rowgroup">
                      				<div class="col col-span2">
                      					<label>是否及时发货：</label>
                      					<select name="handoverTimely">
                      						<option value="">全部</option>
                      						<option value="1">是</option>
                      						<option value="0">否</option>
                      					</select>
                      				</div>
                      				<div class="col col-span2">
                      					<label>揽收状态：</label>
                      					<select name="pickupState">
                      						<option value="">全部</option>
                      						<option value="1">已揽收</option>
                      						<option value="0">未揽收</option>
                      					</select>
                      				</div>
                      				<div class="col col-span2">
                      					<label>是否及时揽收：</label>
                      					<select name="pickupTimely">
                      						<option value="">全部</option>
                      						<option value="1">是</option>
                      						<option value="0">否</option>
                      					</select>
                      				</div>
                      				<div class="col col-span2">
                      					<label>妥投状态：</label>
                      					<select name="deliveryState">
                      						<option value="">全部</option>
                      						<option value="1">已妥投</option>
                      						<option value="0">未妥投</option>
                      					</select>
                      				</div>
                      				<div class="col col-span2">
                      					<label>是否及时妥投：</label>
                      					<select name="deliveryTimely">
                      						<option value="">全部</option>
                      						<option value="1">是</option>
                      						<option value="0">否</option>
                      					</select>
                      				</div>
                      			</div>
                      			<div class="f-rowgroup">
                      				<div class="col">
                      					<select name="idType">
                      						<option value="order">订单编号</option>
                      						<option value="waybill">物流编号</option>
                      					</select>
                      					
                      				</div>
                      				<div class="col"><input type="text" class="" name="idValue"></div>
                      				<div class="col">&nbsp;</div>
                      				<div class="col col-span4">
                      					<select name="rangeField">
                      						<option value="pay">支付时间</option>
                                            <option value="push">推送时间</option>
                      						<option value="handover">发货时间</option>
                      					</select>
                						<div class="f-ib">
                						    <span class="m-date">
                								<input type="text" data-type="date" class="j-datepick" name="start" placeholder="开始时间">
                					        </span>
                  						</div> -
                					    <div class="f-ib">
                					        <span class="m-date">
                								<input type="text" data-type="date" class="j-datepick" name="end" placeholder="结束时间">
                							</span>
                						</div>
                      				</div>
                      				<div class="col col-span2">
                      					<button  name="submit" class="w-btn w-btn-black btag">查询</button>
                        				<button  name="exportData" class="w-btn w-btn-black btag">导出</button>
                      				</div>
                      			</div>
                      		</form>
              	        </div>
              	        <div id="list"></div>
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
<script src="/backend/src/js/module/statistics/orderdetail.js"></script>
</body>
</html>