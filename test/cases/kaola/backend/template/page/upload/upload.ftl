<#-- 模拟数据，不用注释 -->
<div class="g-content clearfix">
    <div class="m-main">
        <div class="w-alertinfo">
        <#if url??><p>上传的文件路径为:${url!}</p></#if>
            <form action="/backend/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="fileData" required="true">
                <button type="submit">提交</button>
            </form>
        <#if url??><p><a href="/backend/upload">再上传</a></p></#if>
        </div>
    </div>
</div>