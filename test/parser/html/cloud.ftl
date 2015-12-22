<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>网易蜂巢</title>
  <meta name="keywords" content="网易,网易蜂巢,云计算,NCE,RDS,Paas,Docker"/>
  <meta name="description" content="网易蜂巢(CloudComb)是采用Docker容器化技术的云计算平台，既有应用引擎带来的简单高效（构建、部署和运维功能），同时又有云计算IaaS服务的灵活性，全部采用SSD存储，给用户极速体验，是网易多年互联网技术积累的体现。"/>
  <!-- <meta name="viewport" content="width=device-width, initial-scale=1"/> -->
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- @STYLE {core:false} -->
  <link rel="stylesheet" type="text/css" href="/src/css/index.css">
</head>
<body>
  <#assign navcrt="index"/>
  <#include "./header.ftl">

  <div class="g-full" id="banner">
    <div class="m-banner">
      <div class="g-wrap wrap">
        <h1>为开发者打造的DOCKER容器云</h1>
        <div class="h1">
          <img src="/res/images/index/index-h1.png">
          <h2>全SSD助力极速开发云端应用</h2>
        </div>
        
        <div class="act">
          <div class="des"></div>
          <a class="btn" href="#">立即领取</a>
        </div>
      </div>
    </div>
    <div class="m-info">
      <div class="g-wrap wrap">
        <div class="lgwrap lgwrap-left"><span class="lg lg-dk"></span></div>
        <div class="txt"><p>基于自研IaaS基础设施，提供一键式应用发布，<br>真正实现开发自助运维。</p></div>
        <div class="lgwrap lgwrap-right"><span class="lg lg-kn"></span></div>
      </div>
    </div>
  </div>

  <div class="m-ctnr j-slide">
    <div class="g-wrap">
      <div class="txt">
        <h2>容器 — “软件集装箱”</h2>
        <p>选择您需要的Docker容器镜像，指定操作系统和软件环境，数秒内便能完成容器创建，和虚拟主机一样灵活使用没有限制。</p>
      </div>
      <div class="pic"><img src="/res/images/ctnr.png" alt=""></div>
    </div>
  </div>

  <div class="m-devops j-slide">
    <div class="g-wrap">
      <div class="pic"><img src="/res/images/devops.png" alt=""></div>
      <div class="txt">
        <h2>自助运维 (DevOps)</h2>
        <p>   支持持续集成、不停服回滚发布，开发人员可轻松在WEB界面完成    构建、发布、扩缩容等运维任务。 </p>
      </div>
    </div>
  </div>

  <div class="m-ssd  j-slide">
    <div class="g-wrap">
      <div class="txt">
        <h2>基础设施</h2>
        <p>   与自研IaaS平台深度结合，运行于拥有多线BGP网络的五星级机房，    所有服务器配置高性能SSD存储。 </p>
      </div>
      <div class="pic"><img src="/res/images/ssd.png" alt=""></div>
    </div>
  </div>

  <div class="m-balns j-slide">
    <div class="g-wrap">
      <div class="pic"><img src="/res/images/balns.png" alt=""></div>
      <div class="txt">
        <h2>负载均衡</h2>
        <p>   每个应用独享负载均衡服务，动态分配流量，流量分发时不中断 对外用户服务，保障业务可用性。 </p>
      </div>
    </div>
  </div>

  <div class="m-rds j-slide">
    <div class="g-wrap">
      <div class="txt">
        <h2>关系型数据库（RDS）</h2>
        <p>   基于网易自研MySQL分支版本InnoSQL，提供业界领先托管式关系数据库服务，保证99.95%服务可用性与99.9999%数据可靠性。</p>
      </div>
      <div class="pic"><img src="/res/images/rds.png" alt=""></div>
    </div>
  </div>

  <div class="m-cpro">
    <div class="g-wrap">
      <div class="txt">
        <h2 class="f-fs30 f-fc3">应用产品</h2>
      </div>
      <div class="apps">
        <div class="item">
          <div class="wrap">
            <div class="cir">
              <i class="i-icon i-icon-1"></i>
            </div>
            <p>易信</p>
          </div>          
        </div>
        <div class="item">
          <div class="wrap">
            <div class="cir">
              <i class="i-icon i-icon-2"></i>
            </div>
            <p>网易云音乐</p>
          </div>
        </div>
        <div class="item">
          <div class="wrap">
            <div class="cir">
              <i class="i-icon i-icon-3"></i>
            </div>
            <p>网易云课堂</p>
          </div>
        </div>
        <div class="item">
          <div class="wrap">
            <div class="cir">
              <i class="i-icon i-icon-4"></i>
            </div>
            <p>顺丰</p>
          </div>
        </div>
        <div class="item">
          <div class="wrap">
            <div class="cir">
              <i class="i-icon i-icon-5"></i>
            </div>
            <p>中信信托</p>
          </div>
        </div>
        <div class="item">
          <div class="wrap">
            <div class="cir">
              <i class="i-icon i-icon-6"></i>
            </div>
            <p>浙大网新</p>
          </div>
        </div>
      </div>
      <a href="#" class="apply-btn">立即注册</a>
    </div>
  </div>

  <#include "./footer.ftl">
  
<!-- @NOPARSE -->
<script src="/res/lib/regular.min.js"></script>
<!-- /@NOPARSE -->

<!-- @SCRIPT {core:false} -->
<script src="/src/javascript/lib/nej/src/define.js?pro=/src/javascript/"></script>
<script src="/src/javascript/page/index.js">
<#include "./analytic.ftl">
</body>
</html>
