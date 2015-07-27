<#include "../wrapper/import.ftl">
<@htmHead title="订单推送限制">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">设置数据关联</h2>
                    </div>
                    <div class="detail w-dataform">
                        <p class="group-col1 color-red">Note：可以根据订单号/仓库ID/SKU控制订单是否推送至第三方WMS</p>
                        <div class="group">
                            <label class="title wd170">按照订单号限制:</label>
                            <input id="orderId" type="text" placeholder="orderId" data-type="1"/>
                            <button class="w-btn w-btn-blue addWMSBlack">添加</button>
                        </div>
                        <div class="group">
                            <label class="title wd170">按照仓库ID限制:</label>
                                <input id="storageId" type="text" placeholder="storageId" data-type="2"/>
                            <button class="w-btn w-btn-blue addWMSBlack">添加</button>
                        </div>
                        <div class="group">
                            <label class="title wd170">按照SKU限制:</label>
                            <input id="skuId" type="text" placeholder="skuId" data-type="3"/>
                            <input id="threshold" type="text" placeholder="threshold" data-type="3" value="0"/>
                            <input id="J-starttime" class="date wd150" readonly="readonly" value="0"
                                   placeholder="生效日期" style="display:none"/>
                            <button class="w-btn w-btn-blue addWMSBlack">添加</button>
                            <button class="w-btn w-btn-blue updateThreshold">更新SKU阈值</button>
                        </div>
                        <div class="group">
                            <label class="title wd170">按照SKU限制批量添加:</label>
                            <input id="skuIdList" type="text" placeholder="skuIdList" data-type="4"/>
                            <input id="threshold4List" type="text" placeholder="threshold4List" data-type="4" value="0"/>
                            <input id="J-starttime4skuIdList" class="date wd150" readonly="readonly" value="0"
                                   placeholder="生效日期" style="display:none"/>
                            <button class="w-btn w-btn-blue addWMSBlack">添加</button>
                        </div>
                        <div class="group">
                            <label class="title wd170">按照SKU批量删除:</label>
                            <input id="skuIdList4Delete" type="text" placeholder="skuIdList4Delete" data-type="4"/>
                            <button class="w-btn w-btn-blue batchDeleteSKUBalckList">批量删除黑名单</button>
                        </div>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">订单推送关联列表</h2>
                    </div>
                    <div class="detail">
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>类型</th>
                                <th>关联号</th>
                                <th>关联对象</th>
                                <th>黑名单阈值</th>
                                <#--<th>生效时间</th>-->
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#if fail??>
                                <tr><td colspan="5">${(errMsg)!"未知异常"}</td></tr>
                            </#if>
                            <#if (recordList![])?size == 0>
                                <tr><td colspan="5">暂无数据吖！</td></tr>
                            <#else>
                                <#list recordList as record>
                                <tr>
                                    <td>${record.type}</td>
                                    <td class="cmax1">${(record.relatedId)!""}</td>
                                    <td class="cmax1">${(record.relatedObject)!""}</td>
                                    <td class="cmax1">${(record.thresholdValueStr)!""}</td>
                                    <#--<td class="cmax1">${(record.takeEffectTime)!""}</td>-->
                                    <td class="cmax1">${(record.createTime)!""}</td>
                                    <td>
                                        <button class="w-btn w-btn-red zdelete" data-id="${record.id}">删除</button>
                                    </td>
                                </tr>
                                </#list>
                            </#if>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<@htmFoot />

<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script type="text/javascript">
    NEJ.define([
        'pro/widget/module',
        '{lib}util/chain/chainable.js',
        '{pro}widget/window/warningWin.js',
        '{pro}widget/calendar/calendar.js',
    ],function(){
        nej.$('.zdelete')._$on('click', function(){
            var _element = nej.$(this);
            var _delDialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">确认删除该记录咩？</p>',
                hideOnok: true,
                mask: 'w-winmask',
                onok: function(){
                    window.open("/backend/orderPushBlackList?action=delete&id=" + _element._$attr('data-id'), '_self');
                }
            });
            _delDialog._$show();
        });

        nej.$('.batchDeleteSKUBalckList')._$on('click', function(){
            var skuIdList4Delete =  nej.$('#skuIdList4Delete')._$val();
            var _delDialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">确认批量删除记录咩？</p>',
                hideOnok: true,
                mask: 'w-winmask',
                onok: function(){
                    window.open("/backend/orderPushBlackList?action=batchDelete&skuIdList=" + skuIdList4Delete, '_self');
                }
            });
            _delDialog._$show();
        });

        nej.$('.updateThreshold')._$on('click', function() {
            var threshold = nej.$('#threshold')._$val();
            var skuId = nej.$('#skuId')._$val();
            window.open("/backend/orderPushBlackList?action=update&type=3&relatedId="
            + skuId + "&threshold=" + threshold, '_self') ;
            return;
        });

        nej.$('.addWMSBlack')._$on('click', function() {
            var _ele = nej.$(this)._$siblings('input[type="text"]');

            if (_ele._$attr('data-type') == 3) {
                var dateNode = nej.$('#J-starttime')._$val();
                dateNode = dateNode.replace(/-/g,"/");
                var time =  (new Date(dateNode)).getTime();
                var threshold = nej.$('#threshold')._$val();
                var skuId = nej.$('#skuId')._$val();
                window.open("/backend/orderPushBlackList?action=add&type=" + _ele._$attr('data-type') + "&relatedId="
                + skuId + "&threshold=" + threshold + "&takeEffectTime=" + time, '_self') ;
                return;
            }else if(_ele._$attr('data-type') == 4){
                var dateNode = nej.$('#J-starttime4skuIdList')._$val();
                dateNode = dateNode.replace(/-/g,"/");
                var time =  (new Date(dateNode)).getTime();
                var skuIdList = nej.$('#skuIdList')._$val();
                var threshold4List = nej.$('#threshold4List')._$val();
                window.open("/backend/orderPushBlackList?action=add&type=" + _ele._$attr('data-type') + "&relatedId="
                + skuIdList + "&threshold=" + threshold4List + "&takeEffectTime=" + time, '_self') ;
                return;
            }

            window.open("/backend/orderPushBlackList?action=add&type=" + _ele._$attr('data-type') + "&relatedId=" + _ele._$val(), '_self');
        });
        nej.$('#J-starttime')._$on('click', function(_event) {
            var _ele = nej.$(this)[0];
            var _calendar = haitao.bw._$$Calendar._$allocate({});
            _calendar._$showCalendar(_event, _ele, true);
        })

        nej.$('#J-starttime4skuIdList')._$on('click', function(_event) {
            var _ele = nej.$(this)[0];
            var _calendar = haitao.bw._$$Calendar._$allocate({});
            _calendar._$showCalendar(_event, _ele, true);
        })

    });

</script>
</body>
</html>

