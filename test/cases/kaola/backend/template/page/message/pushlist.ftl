<#include "../wrapper/import.ftl">
<@htmHead title="推送消息管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/message/pushlist.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">消息管理列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform f-clearfix">
                            <div class="group ztag">
                                <label class="title" style="min-width:inherit;">消息ID:</label>
                                <input type="text" name="id" value="<#if id!=-1 >${id}</#if>" class="wd100"/>

                                <label class="title">客户端:</label>
                                <select name="client" class="wd100">
                                    <option value="">全部</option>
                                    <option value="ios" <#if client=='ios'>selected</#if>>ios</option>
                                    <option value="android" <#if client=='android'>selected</#if>>android</option>
                                </select>

                                <label class="title">版本:</label>
                                <select name="version" class="wd100">
                                    <option value="">ALL</option>
                                </select>

                                <label class="title">渠道:</label>
                                <select name="channal" class="wd100">
                                    <option value="">ALL</option>
                                </select>
                            </div>

                            <div class="group">
                                <input name="minPushTime" type="text" class="ztag" placeholder="开始日期" readonly="readonly" value="<#if minPushTime!=-1>${minPushTime?number_to_date?string('yyyy-MM-dd')}</#if>" />
                                <i>——</i>
                                <input name="maxPushTime" type="text" class="ztag" placeholder="结束日期" readonly="readonly" value="<#if maxPushTime!=-1>${maxPushTime?number_to_date?string('yyyy-MM-dd')}</#if>" />

                                <button id="searchBtn" class="w-btn w-btn-black ztag" style="margin-left: 15px">搜索</button>
                            </div>

                            <div class="group">
                                <button class="w-btn w-btn-black ztag" style="margin-right: 15px">新建推送消息</button>
                                <button class="w-btn w-btn-black ztag" style="margin-right: 15px">启用</button>
                                <button class="w-btn w-btn-black ztag" style="margin-right: 15px">禁用</button>
                                <button class="w-btn w-btn-black ztag" style="margin-right: 15px">删除</button>
                            </div>
                        </div>
                        <table class="w-datatable">
                            <colgroup>
                                <col width="6%"><col width="9%"><col width="9%"><col width="9%"><col width="9%"><col width="9%"><col width="5%"><col width="5%"><col width="5%"><col width="5%"><col width="7%"><col width="7%"><col width="5%"><col width="6%"><col width="5%">
                            </colgroup>
                            <thead>
                            <tr>
                                <th><label for="checkAll"><input id="checkAll" type="checkbox"></label>消息ID</th>
                                <th>推送标题</th>
                                <th>推送内容</th>
                                <th>SPring文案</th>
                                <th>推送链接</th>
                                <th>推送时间</th>
                                <th>客户端</th>
                                <th>版本</th>
                                <th>渠道</th>
                                <th>地区</th>
                                <th>推送成功数</th>
                                <th>接受成功数</th>
                                <th>打开数</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#if (messagePushList![])?size gt 0>
                                <#list messagePushList as item>
                                <#assign statetext = ''>
                                <#switch item.states>
                                    <#case 1><#assign statetext = '待发送'><#break>
                                    <#case 2><#assign statetext = '发送成功'><#break>
                                    <#case 3><#assign statetext = '发送失败'><#break>
                                    <#case 4><#assign statetext = '被禁止'><#break>
                                    <#case 5><#assign statetext = '过期无效'><#break>
                                </#switch>
                                <tr>
                                    <td><label><input class="checkbox" type="checkbox" data-id="${item.id!''}"></label>${item.id!''}</td>
                                    <td>${item.title!''}</td>
                                    <td>${item.content!''}</td>
                                    <td>${item.showContent!''}</td>
                                    <td>${item.url!''}</td>
                                    <td>${item.pushTime?number_to_date?string('yyyy-MM-dd HH:mm:ss')}</td>
                                    <td><#if item.allClient == ''>ALL<#else>${item.allClient!'ALL'}</#if></td>
                                    <td><#if item.allVersion == ''>ALL<#else>${item.allVersion!'ALL'}</#if></td>
                                    <td><#if item.allChannal == ''>ALL<#else>${item.allChannal!'ALL'}</#if></td>
                                    <td>${item.channal!'ALL'}</td>
                                    <td><#if item.succPushNum < 0>--<#else>${item.succPushNum!''}</#if></td>
                                    <td><#if item.succReceiveNum < 0>--<#else>${item.succReceiveNum!''}</#if></td>
                                    <td><#if item.openNum <= 0>--<#else>${item.openNum!''}</#if></td>
                                    <td>${statetext}</td>
                                    <td><#if item.states == 2 || item.states == 5><a href="#" onclick="haitao.g.look(event)" data-id="${item.id!''}" data-id="${item.id!''}">查看</a><#else><a href="#" onclick="haitao.g.edit(event)" data-id="${item.id!''}" data-title="${item.title!''}" data-content="${item.content!''}" data-url="${item.url}" data-pushTime="${item.pushTime}" data-validTime="${item.validTime}" data-allClient="${item.allClient!''}" data-allVersion="${item.allVersion!''}" data-allChannal="${item.allChannal}" data-allArea="${item.allArea!''}" data-iconImg="${item.iconImg!''}" data-testAccount="${item.testAccount!''}" data-userAccount="${item.userAccount!''}" data-showContent="${item.showContent!''}">编辑</a></#if></td>
                                </tr>
                                </#list>
                            <#else>
                            <tr><td colspan=14>当前数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                        <@lpager2 totalSize=counts limit=limit offset=offset url="/backend/message/push/list?id=${id!''}&client=${client!''}&version=${version!''}&channal=${channal!''}&minPushTime=${minPushTime!''}&maxPushTime=${maxPushTime!''}&limit=${limit}" />
                    </div>
                </div>
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<div class="m-layer ztag">
    <div class="title">新建推送消息</div>
    <div class="content ztag">
        <div>
            <div class="group" style="position:relative;">
                <label class="intext">推送链接:</label>
                <input class="cntag" name="url" type="text" placeholder="推送链接" style="width:526px;" mold="url" canempty="1" />
                <div style="position:absolute;top:0;left:610px;">
                    <img class="ztag f-hide" width="80" style="float:left;" />
                    <label class="m-sep j-flag w-btn w-btn-blue ztag">上传图片(240*240)</label>
                    <input type="hidden" name="iconImg" class="ztag cntag" canempty="1" />
                </div>
                <#-- <label class="intext">(以http://www.kaola.com开头)</label> -->
            </div>
            <#-- <div class="group">
                <label class="intext">目标类型:</label>
                <select name="desType" class="wd100 cntag">
                    <option value="1">商品详情页</option>
                    <option value="2">活动页</option>
                </select>
            </div>
            <div class="group">
                <label class="intext">目标ID:</label>
                <input class="cntag" name="desId" type="text" placeholder="推送链接" style="width:526px;"/>
            </div> -->
            <div class="group">
                <label class="intext"><span class="f-red">*</span>消息标题:</label>
                <input class="cntag" name="title" type="text" style="width:526px;" />
                <#-- <label class="intext">(和消息内容必须填写其中一项)</label> -->
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>消息内容:</label>
                <textarea class="cntag" name="content" style="width:726px;height:80px;padding:10px;" ></textarea>
            </div>
            <div class="group">
                <label class="intext">spring版显示文案:</label>
                <textarea class="cntag" name="showContent" placeholder="最多35字符" style="width:726px;height:80px;padding:10px;" maxlength="35" canempty="1" ></textarea>
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>发送时间:</label>
                <input class="cntag ztag" name="pushTime" type="text" placeholder="点击选择时间" style="width:180px;" readonly="readonly" mold="time" />
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>有效时长:</label>
                <input class="cntag" name="validTime" type="text" style="width:180px;" mold="number" maxNum="604800" />
                <label class="intext">（秒）最长不能超过7天</label>
                <label class="intext mleft25">测试账号</label>
                <input class="cntag" name="testAccount" type="text" placeholder="test@163.com" canempty="1" />
            </div>
            <hr />
            <div class="group options">
                <label class="intext">客户端:</label>
                <select name="allClient" class="wd100 cntag" canempty="1" >
                    <option value="">ALL</option>
                    <option value="ios">ios</option>
                    <option value="android">android</option>
                </select>

                <label class="intext">版本:</label>
                <select name="allVersion" class="wd100 cntag" canempty="1" >
                    <option value="">ALL</option>
                </select>

                <label class="intext">渠道:</label>
                <select name="allChannal" class="wd100 cntag" canempty="1" >
                    <option value="">ALL</option>
                </select>

                <label class="intext">地区:</label>
                <select class="wd100 cntag" canempty="1" >
                    <option value="">ALL</option>
                </select>
            </div>
            <hr />
            <div class="group">
                <label class="intext">指定邮箱账号:</label>
                <input name="userAccount" class="cntag" type="text" style="width:726px;" canempty="1" />
            </div>
        </div>
    </div>
    <div class="controls">
        <span class="f-warn alert-text"></span>
        <input type="button" value="确定" class="w-btn w-btn-blue ok ztag" />
        <input type="button" value="取消" class="w-btn w-btn-blue cc ztag" />
    </div>
</div>
<#--编辑推送消息-->
<div class="m-layer ztag">
    <div class="title">编辑推送消息</div>
    <div class="content ztag">
        <div>
            <div class="group" style="position:relative;">
                <label class="intext">推送链接:</label>
                <input class="edtag" name="url" type="text" placeholder="推送链接" style="width:526px;" mold="url" canempty="1" />
                <div style="position:absolute;top:0;left:610px;">
                    <img class="ztag f-hide" width="80" style="float:left;" />
                    <label class="m-sep j-flag w-btn w-btn-blue ztag">上传图片(240*240)</label>
                    <input type="hidden" name="iconImg" class="ztag edtag" canempty="1" />
                </div>
                <#-- <label class="intext">(以http://www.kaola.com开头)</label> -->
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>消息标题:</label>
                <input class="edtag" name="title" type="text" style="width:526px;" />
                <#-- <label class="intext">(和消息内容必须填写其中一项)</label> -->
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>消息内容:</label>
                <textarea class="edtag" name="content" style="width:726px;height:80px;padding:10px;" ></textarea>
            </div>
            <div class="group">
                <label class="intext">spring版显示文案:</label>
                <textarea class="edtag" name="showContent" placeholder="最多35字符" style="width:726px;height:80px;padding:10px;" maxlength="35" canempty="1" ></textarea>
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>发送时间:</label>
                <input class="edtag ztag" name="pushTime" type="text" placeholder="点击选择时间" style="width:180px;" readonly="readonly" mold="time" />
            </div>
            <div class="group">
                <label class="intext"><span class="f-red">*</span>有效时长:</label>
                <input class="edtag" name="validTime" type="text" style="width:180px;" mold="number" maxNum="604800" />
                <label class="intext">（秒）最长不能超过7天</label>
                <label class="intext mleft25">测试账号</label>
                <input class="edtag" name="testAccount" type="text" placeholder="test@163.com" canempty="1"/>
            </div>
            <hr />
            <div class="group options">
                <label class="intext">客户端:</label>
                <select name="allClient" class="wd100 edtag" canempty="1" >
                    <option value="">ALL</option>
                    <option value="ios">ios</option>
                    <option value="android">android</option>
                </select>

                <label class="intext">版本:</label>
                <select name="allVersion" class="wd100 edtag" canempty="1" >
                    <option value="">ALL</option>
                </select>

                <label class="intext">渠道:</label>
                <select name="allChannal" class="wd100 edtag" canempty="1" >
                    <option value="">ALL</option>
                </select>

                <label class="intext">地区:</label>
                <select class="wd100 edtag" canempty="1" >
                    <option value="">ALL</option>
                </select>
            </div>
            <hr />
            <div class="group">
                <label class="intext">指定邮箱账号:</label>
                <input name="userAccount" class="edtag" type="text" style="width:726px;" canempty="1" />
            </div>
            <input class="edtag" name="id" type="hidden" />
        </div>
    </div>
    <div class="controls">
        <span class="f-warn alert-text"></span>
        <input type="button" value="确定" class="w-btn w-btn-blue ok ztag" />
        <input type="button" value="取消" class="w-btn w-btn-blue cc ztag" />
    </div>
</div>
<div class="m-layer ztag">
    <div class="title">消息操作日志</div>
    <div class="content ztag" style="max-height:400px;overflow-y:scroll;"></div>
    <div class="controls">
        <span class="f-warn alert-text"></span>
        <input type="button" value="关闭" class="w-btn w-btn-blue ok ztag" />
    </div>
</div>
<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/message/pushlist.js"></script>
</body>
</html>

