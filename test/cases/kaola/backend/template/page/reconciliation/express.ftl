<#include "../wrapper/import.ftl">
<@htmHead title="快递对账_对账分账">
    <link rel="stylesheet" type="text/css" href="${css_root}module/reconciliation/reconciliation.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
            	<div class="left">
	                <div class="m-databox">
	                    <div class="head f-clearfix">
	                        <h2 class="icf-keyboard">导入账单</h2>
	                    </div>
	                    <div class="detail w-dataform">
	                        <div class="group">
	                        	<button class="w-btn w-btn-black ztag">导入数据</button>
	                    		<button class="w-btn w-btn-black ztag">删除</button>
	                            <label class="title">处理状态:</label>
	                            <select name="state" class="ztag">
	                            	<option value="0">全部</option>
	                            	<option value="2">已处理</option>
	                            	<option value="1">未处理</option>
	                            </select>
	                        </div>
	                    </div>
	                </div>

	                <div class="m-databox">
	                    <div class="detail">
	                        <table class="w-datatable">
	                        	<colgroup>
									<col width="20%">
									<col width="20%">
									<col width="20%">
									<col width="40%">
								</colgroup>
	                            <thead>
	                                <tr>
	                                    <th>快递公司</th>
	                                    <th>处理状态</th>
	                                    <th>操作人</th>
	                                    <th>导入时间</th>
	                                </tr>
	                            </thead>
	                            <tbody class="ztag">
	                            </tbody>
	                        </table>
	                    </div>
	                    <div class="m-fixPag f-cb">
							<div id="bkpager" class="pager ztag"></div>
						</div>
	                </div>
                </div>
                <div class="right">
	                <div class="m-databox">
	                    <div class="head f-clearfix">
	                        <h2 class="icf-keyboard cur ztag">导入详情</h2>
	                        <h2 class="icf-keyboard ztag">导入日志</h2>
	                    </div>
	                    <div class="detail w-dataform ztag">
	                        <div class="group">
	                        	<button class="w-btn w-btn-black ztag">处理该批次</button>
	                    		<a class="ztag w-btn w-btn-black" href="#" target="_blank">导出</a>
	                    		<button class="w-btn w-btn-black ztag">刷新</button>
	                            <label class="title">匹配状态:</label>
	                            <select name="state" class="ztag">
	                            	<option value="0">全部</option>
	                            	<option value="2">已匹配</option>
	                            	<option value="3">已处理</option>
	                            	<option value="1">未匹配</option>
	                            </select>
	                        </div>
	                    </div>
	                </div>

	                <div class="m-databox ztag">
	                    <div class="detail">
	                        <table class="w-datatable">
	                        	<colgroup>
                                    <col width="14%">
                                    <col width="14%">
                                    <col width="9%">
                                    <col width="9%">
                                    <col width="9%">
                                    <col width="9%">
                                    <col width="9%">
                                    <col width="9%">
                                    <col width="9%">
                                    <col width="9%">
								</colgroup>
	                            <thead>
	                                <tr>
	                                    <th>订单编号</th>
	                                    <th>快递单号</th>
	                                    <th>运费</th>
	                                    <th>导入运费</th>
	                                    <th>运费差额</th>
	                                    <th>包裹重量</th>
                                        <th>包裹毛重</th>
	                                    <th>导入重量</th>
	                                    <th>重量差额</th>
	                                    <th>匹配状态</th>
	                                </tr>
	                            </thead>
	                            <tbody class="ztag">
	                            </tbody>
	                        </table>
	                    </div>
	                    <div class="m-fixPag f-cb">
							<div id="bkpager" class="pager ztag"></div>
						</div>
	                </div>

	                <div class="detail w-dataform ztag" style="display:none;">
                        <div class="group" style="display:none;">
                    		<button class="w-btn w-btn-black">刷新</button>
                        </div>

                        <div class="log">
                        	<p>导入日志tab列出导入的日志，说明如下：</p>
                        	<p class="ztag"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<script>
	_logistics = [];
	<#list logistics as logistic>
	_logistics.push({'id':${logistic.logisticsId!-1}, 'name':'${logistic.logisCompanyName!''}'})
	</#list>
	var _config = {total : ${total!0}, handledTotal: ${handledTotal!0}, notHandledTotal: ${notHandledTotal!0}, logistics:_logistics};
</script>

<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/reconciliation/express.js"></script>
</body>
</html>