<!-- @NOCOMPRESS -->
<#escape x as x?html>
<@compress>
<!DOCTYPE html>
<html>
  <head>
    <#include "./mock.ftl"/>
    <#include "../../wrap/3g.common.ftl">
    <title>${title!"品购页"}</title>
    <@meta/>
    <link rel="shortcut icon" href="http://shared.ydstatic.com/images/favicon.ico" type="image/x-icon"/>
    <!-- test nej template -->
    <link rel="nej" type="nej/css" href="/src/css/page/schedule.css">
    <link rel="nej" type="nej/javascript" href="/src/js/page/schedule.js">
    <link rel="nej" type="nej/html" href="/src/js/page/schedule.html">
    
    <@css/>
    <!-- @STYLE {core:false,inline:true} -->
    <link rel="stylesheet" type="text/css" href="/src/css/page/schedule.css">
    <style>
        .a{color:#aaa;}
        .b{background:#bbb;}
    </style>
    <style type="nej/css">
        .aa{color:#aaa;}
        .bb{background:#bbb;}
    </style>
    <style type="template/css">
        .aa{color:#aaa;}
        .bb{background:#bbb;}
    </style>
    <script>
      <#assign nowTime = .now?long>
      <#assign endTime = (schedule.endTime)!0>
      <#assign startTime = (schedule.startTime)!0>
      window.config = {
          brandId:${(schedule.brandId)!"0"},
          scheduleId:${(schedule.id)!"0"},
          leftTime:${endTime-nowTime},
          noprice:${(startTime>nowTime)?string("true","false")}
      };
    </script>
  </head>
  <body id="schedule-netease-com" class="p-schedule">
    <@topbar title=title!"品购页"/>
    
    <div class="m-pocat j-category" id="category-box">
      <div class="ttl">
        <span class="t">筛选</span>
        <span class="c m-pobg" data-action="close">&nbsp;</span>
      </div>
      <div class="mit j-it" data-value="">全部</div>
      <#if category??&&category?size&gt;0>
        <#list category as x>
        <div class="mit j-it" data-value="${x.id}">${x.name}</div>
        </#list>
      </#if>
    </div>
    
    <@module>
      <div class="m-pobanner m-img">
        <img class="u-loading-1" src="/res/3g/images/blank.gif"  data-src="${banner}"/>
        <div class="follow ${followed?string("j-follow","")}" id="follow-box">
          <i class="m-pobg i">&nbsp;</i>
          <span>${followed?string("取消关注","关注品牌")}</span>
        </div>
      </div>
    </@module>
    
    <@module>
      <#if startTime&gt;nowTime>
      <div class="m-poact">
        <span class="c">${startTime?number_to_datetime?string("MM月dd日hh点")}开售</span>
      </div>
      <#else>
      <div class="m-poact f-cb">
        <#if activities??&&activities?size&gt;0>
        <div class="x a ${(activities?size&gt;1)?string("j-show","")}" id="activity-box">
          <span class="t">${activities}</span>
          <i class="m-pobg i">&nbsp;</i>
        </div>
        <div class="m-pohd" id="activity-box-list">
          <span class="w">&nbsp;</span>
          <#list activities as x>
          <p>${x}</p>
          </#list>
        </div>
        </#if>
        <div class="x b">
          <i class="m-pobg i">&nbsp;</i>
          <span id="count-down-box">0天0时0分0秒后结束</span>
        </div>
      </div>
      </#if>
    </@module>
    
    <@module>
      <div class="m-potab" id="type-box">
        <div class="it j-it a" data-value="0">推荐</div>
        <div class="it j-it b j-toggle" data-value="1" data-toggled="true">价格<i class="m-pobg i">&nbsp;</i></div>
        <div class="it j-it c" data-value="3">折扣<i class="m-pobg i">&nbsp;</i></div>
        <div class="it j-it d" data-value="0">筛选<i class="m-pobg i">&nbsp;</i></div>
      </div>
    </@module>
    
    <@module>
      <div class="m-pobox f-cb" id="product-box"></div>
    </@module>
    
    <@footer/>
    
    <@template>
      <#noparse>
      <!-- @TEMPLATE -->
      
      <!-- test nej template -->
      <textarea name="css" data-src="./a.css"></textarea>
      <textarea name="js" data-src="./a.js"></textarea>
      <textarea name="html" data-src="./a.html"></textarea>
      
      <textarea name="txt" id="product-loading">
        <div class="loading">加载中...</div>
      </textarea>
      <textarea name="jst" id="product-list">
        {list beg..end as y}
          {var x=xlist[y]}
          <div class="m-poprd {if noprice}j-nobg{/if}">
            <a class="body" href="/detail?id=${x.id}">
              <div class="img m-img">
                <img class="u-loading-1" src="/res/3g/images/blank.gif" data-src="${x.listShowPicList[0]}"/>
                {if isSoldout(x.skuList)}
                <div class="so">&nbsp;</div>
                {/if}
              </div>
              <div class="x ln0">${x.productName||'商品名称'}</div>
              {var sale = x.salePrice}
              {var market = x.marketPrice}
              {if noprice}
              <div class="x ln1">
                <span class="zg">专柜价</span>
                <span class="mp">&yen;${Math.floor(market)}</span>
              </div>
              {else}
              <div class="x ln1">
                <span class="sp">&yen;<em>${Math.floor(sale)}</em></span>
                <span class="mp">&yen;${Math.floor(market)}</span>
                <span class="zk">${(sale*10/market)|toFixed:1}折</span>
              </div>
              {/if}
            </a>
          </div>
        {/list}
      </textarea>
      <!-- @MODULE -->
      <textarea name="html" data-src="./a.html"></textarea>
      <textarea name="html" data-src="./b.html"></textarea>
      <textarea name="html" data-src="./c.html"></textarea>
      <!-- /@MODULE -->
      </#noparse>
    </@template>
    <!-- @SCRIPT -->
    <script src="${jslib}define.js?${jscnf}"></script>
    <script src="${jspro}page/schedule/schedule.js"></script>
  </body>
</html>
</@compress>
</#escape>