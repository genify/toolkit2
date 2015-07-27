<#-- {活动配置项}:{/backend/ini/index} -->
<#-- Created by zmm on 3/3/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="活动配置查询">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">查询活动配置项</h2>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group">
                            <label class="title">系统参数名称:</label>
                            <input type="text" name="iniKey" class="wd200" value="${iniKey!''}"/>

                            <label class="title">配置显示名称:</label>
                            <input type="text" name="iniNameCn" class="wd200" value="${iniNameCn!''}"/>
                        </div>
                        <div class="group">
                            <label class="title">值:</label>
                            <input type="text" name="iniValue" class="wd200" value="${iniValue!''}"/>

                            <label class="title">描述:</label>
                            <input type="text" name="iniDesc" class="wd200" value="${iniDesc!''}"/>
                        </div>
                        <div class="group-col1">
                            <button name="searchBtn" class="w-btn w-btn-black">查询</button>
                        </div>
                    </div>
                </div>
                <div class="m-databox" style="margin-top: 20px; border: 0 none;box-shadow: 0 0 0 ">
                    <button name="addNew" class="w-btn w-btn-blue">新增Ini配置</button>
                    <#if (ipList![])?size gt 0>
                        <button name="refreshIP" class="w-btn w-btn-white" style="margin-left: 50px">刷新IP配置</button>
                        <select name="ipList" >
                            <option value="${join(ipList![], ',')}">all</option>
                            <#list ipList as item>
                            <option value="${item}">${item}</option>
                            </#list>
                        </select>
                        <span class="color-red" style="margin-left: 10px">ini配置需要刷新对应机器后，才能生效。</span>
                    </#if>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">活动配置参数数据列表</h2>
                    </div>
                    <div class="detail">
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>配置参数名称</th>
                                <th>配置显示名称</th>
                                <th>配置项的值</th>
                                <th>配置项描述</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#if (iniList![])?size gt 0>
                                <#list iniList as item>
                                <tr>
                                    <td class="cmax1">${item.iniKey!''}</td>
                                    <td class="cmax1">${item.iniNameCn!''}</td>
                                    <td class="cmax1">${item.iniValue!''}</td>
                                    <td class="cmax1">${item.iniDesc!''}</td>
                                    <td class="cmin3">
                                        <button type="button" data-key="${item.iniKey}" data-nameCn="${item.iniNameCn!''}" data-value="${item.iniValue}" data-desc="${(item.iniDesc!'')?html}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</button>
                                        <button type="button" data-key="${item.iniKey}" class="w-btn w-btn-red icf-minus zdelbtn">删除</button>
                                    </td>
                                </tr>
                                </#list>
                            <#else>
                            <tr><td colspan=9>数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                    <@lpager2 totalSize=counts limit=limit offset=offset url="/backend/ini/list?iniKey=${iniKey!''}&iniNameCn=${iniNameCn}&iniValue=${iniValue}&iniDesc=${iniDesc}" />
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
<script src="/backend/src/js/module/ini/ini.js"></script>
</body>
</html>