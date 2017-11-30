# 标记说明

项目页面的入口文件及模块的模板文件中可以通过指定的标记对内容进行打包配置，打包标记基于html的注释标记扩展，因此不会影响到页面的实际呈现

# 标记格式

打包工具支持的标记格式如下所示

```html
<!-- @TAGNAME PARAMETERS-->
    HTML CONTENT HERE
<!-- /@TAGNAME -->
```

* 标记以“<!--”开始，以”-->”结束，一个标记在一行内完成，一行仅允许包含一个标记内容或空格
* 标记为大写单词，并以“@”为前缀，如”@STYLE”
* 成对出现的标记必须使用结束标记，结束标记为开始标记的“@”符号前加“/”，如”/@TEMPLATE”作为“@TEMPLATE”的结束标记
* 标记支持的配置参数为JS对象，紧跟标记名称后，并以空格分隔，具体标记支持的参数见各标记说明，范例如

    ```html
    <!-- @STYLE {core:false,inline:true} -->
    ```

* 所有打包标记在项目打包完成后删除，因此在最终输出的html文件中不会有任何标记

# 标记指令

| 标记名称 | 功能描述 |
| :--- | :--- |
| [NOCOMPRESS](#nocompress) | 指定无压缩的内容块 |
| [STYLE](#style) | 指定输出样式在页面的插入位置 |
| [SCRIPT](#script) | 指定输出脚本在页面的插入位置 |
| [MODULE](#module) | 标记NEJ单页模块预内联模块 |
| [VERSION](#version) | 指定NEJ单页模块版本信息输出位置 |
| [TEMPLATE](#template) | 指定NEJ单页模块的模板插入位置 |
| [NOPARSE](#noparse) | 标记不做资源解析的代码块 |
| [IGNORE](#ignore) | 标记输出忽略的代码块 |
| [MERGE](#merge) | 标记需要做脚本合并的代码块 |
| [MANIFEST](#manifest) | 标记当前页面是否需要输出AppCache使用的manifest配置文件 |

## NOCOMPRESS

是否需要结束：可选

支持配置参数：无

此标记用以表明从当前位置开始到标记结束位置之间的html代码打包时无需压缩，如没有结束标记则此效果延续到文件结束位置，嵌套情况下此标记仅允许嵌套在TEMPLATE标记中，具体使用范例如下所示：

* 全文无需压缩在文件起始位置加标记
* 部分内容压缩需指定不压缩的内容

## STYLE

是否需要结束：无

支持配置参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| core | Boolean | core.css文件插入形式，true - 强行插入core.css；false - 禁止插入core.css； 不设置 - 自动解析【默认】|

此标记用以表明当前位置插入打包后的样式文件，具体使用范例如下所示：

```html
<!-- @STYLE -->
<link href="../css/base.css" >
<link href="../css/reset.css" >
```

项目自己定义了core文件列表，并通过服务器端模版引入各个页面时，可以增加core参数配置

```html
<!-- @STYLE {core:true} -->
<#include "/core/css.ftl">
<link href="../css/page.css" >
```

## SCRIPT

是否需要结束：无

支持配置参数：

| 参数   | 类型    | 描述 |
| ---  | ---   | --- |
| nodep  | Boolean | 是否没有使用依赖系统，true - 没有使用依赖系统，后续脚本为源码；false - 使用依赖系统，后续脚本为define.js|
| core   | Boolean | core.js文件插入形式，true - 强行插入core.js；false - 禁止插入core.js； 不设置 - 自动解析【默认】 |

此标记用以表明后续的脚本标签为依赖系统定义文件路径，对于该文件打包工作做以下处理：
* 最终输出文件不再引入此文件
* 从该脚本路径解析出框架所在路径
* define.js路径支持平台参数配置，所带参数详细说明见平台参数章节

使用依赖系统，后续第一个外联脚本为define.js：

```html
<!-- @SCRIPT -->
<script src="/path/to/lib/define.js"></script>
```

没有使用依赖系统，后续脚本作为源码，此标记仅用来表示打包后脚本插入位置：

```html
<!-- @SCRIPT {nodep:true} -->
<script src="jquery.js"></script>
<script src="jquery-ui-0.js"></script>
<script src="jquery-ui-1.js"></script>
<script src="jquery-ui-2.js"></script>
<script>
    // your code
</script>
```

项目自己定义了core文件列表，并使用服务器端模版引入页面时可以使用core参数配置；当core显式的设置为false时当前文件的脚本将独立解析，不参与core脚本的合并策略

```html
<!-- @SCRIPT {core:true} -->
<#include "/core/js.ftl">
<script src="/js/page.js"></script>
```

## MODULE

是否需要结束：必须

支持配置参数：无

此标记用以表明从当前位置至结束标记之前的内容中存在模块资源，最终打包时一个模块资源会形成一个模版集合，在模块调度时直接动态解析这些模版而不会发请求加载相关资源

注：此标记内的内容为外联的html类型模版，且符合模块调度器方案中的模块规范，此标记必须出现在DEFINE标记所在的页面，否则将被忽略

```html
<!-- @MODULE -->
<textarea name="html" data-src="./index/a.html"></textarea>
<textarea name="html" data-src="./index/a.a0.html"></textarea>
<textarea name="html" data-src="./index/a.a1.html"></textarea>
<textarea name="html" data-src="./index/a.a2.html"></textarea>
<!-- /@MODULE -->
```

## VERSION

是否需要结束：无

支持配置参数：无

此标记用以表明当前位置插入模块版本信息，后续脚本内仅允许出现模块的版本配置信息，否则打包后内容将丢失，如果项目没有使用NEJ的模块调度模型则可以忽略此标记

具体使用范例如下所示：

```html
<!-- @VERSION -->
<script>location.config={root:'./'};</script>
```

## TEMPLATE

是否需要结束：可选

支持配置参数：无

此标记用以表明页面模板插入位置，默认情况下模板的识别及插入位置由工具自动识别

* 如果页面只有一批模板集合此标记可以不加
* 如果页面有多个模板集合在每个集合之前加入此标记表明后续模板识别处理后的插入位置

打包针对外链模板会做优化处理包括：

* 外联样式文件（类型为css的模板）做内联处理
* 外联嵌套模板文件（类型为html的模板）做内联处理
* 外联脚本文件（类型为js的模板）按照指定标记做内联或者外联处理

因此仅需要在引入资源模板是加此标记即可，具体使用范例如下所示：

```html
<div style="display:none;" id="template-box">
  <!-- @TEMPLATE -->
  <textarea name="txt" id="txt-0">
      text content
  </textarea>
  <textarea name="jst" id="jst-0">
      jst content
  </textarea>
  <textarea name="ntp" id="ntp-0">
      ntp content
  </textarea>
  <textarea name="css">
      css code
  </textarea>
  <textarea name="js">
      js code
  </textarea>
  <textarea name="css" data-src="./css/component/left.css"></textarea>
  <textarea name="js" data-src="./javascript/component/left.js"></textarea>
  <textarea name="html" data-src="./html/component/left.html"></textarea>
</div>
```

## NOPARSE

是否需要结束：必须

支持配置参数：无

此标记用以表明从当前位置至结束标记之前的内容不做样式、脚本、模板的解析，但是对于内部引用的静态资源还是会根据配置做相关域名、版本的处理

具体使用范例如下所示：

```html
<!-- @NOPARSE -->
<script>
    window.UD = {
          id:${user.id},
          name:${user.name}
    };
</script>
<!-- /@NOPARSE -->
```

假如代码如下所示：

```html
<!-- @NOPARSE -->
<img src="../../res/image/loading.gif" alt="" class="test">
<script src="../../res/a.js" type="text/javascript"></script>
<link href="../../res/a.css" rel="stylesheet" type="text/css"/>
<script>
  location.portrait1 = '/res/image/sprite.png';
</script>
<!-- /@NOPARSE -->
```

如果使用以下配置

```
VERSION_STATIC = true
DM_STATIC = //a.b.com/
```

则输出以下结果

```html
<img src="//a.b.com/res/image/loading.gif?3f0b16dacaef33fff435210012f4bd9e" alt class="test">
<script src="//a.b.com/res/a.js?135116294dd6ac43f150ca9c2db4a19d" type="text/javascript"></script>
<link href="//a.b.com/res/a.css?a9917ca995d613ec05f321b6d32e2c00" rel="stylesheet" type="text/css"/>
<script>
  location.portrait1 = '/res/image/sprite.png';
</script>
```

## IGNORE

是否需要结束：必须

支持配置参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mode | String | 忽略模式，可选test/online/develop |

此标记用以表明从当前位置至结束标记之前的内容在打完包后删除，mode配置忽略的条件，多个值使用“|”分隔，当打包工具中的X_RELEASE_MODE配置值出现在mode的值中时即忽略此标记间的内容，支持模式名称之前加“!”取反，模式说明

| 模式 | 说明 |
| --- | --- |
| test | 测试版本 |
| online | 上线版本，默认值 |
| develop | 开发版本 |

具体使用范例如下图所示：

``` html
<!-- @IGNORE -->
<script src="../javascript/config/develop.js"></script>
<!-- /@IGNORE -->
```

``` html
<!-- @IGNORE {mode:'online'} -->
<script src="../javascript/config/develop.js"></script>
<!-- /@IGNORE -->
```

``` html
<!-- @IGNORE {mode:'online|test'} -->
<script src="../javascript/config/develop.js"></script>
<!-- /@IGNORE -->

<!-- 如果只使用online、test、develop模式，则以上模式等价于以下模式 -->

<!-- @IGNORE {mode:'!develop'} -->
<script src="../javascript/config/develop.js"></script>
<!-- /@IGNORE -->
```

## MERGE

是否需要结束：必须

支持配置参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | String | 输出文件名称，默认自动生成，注意自己配置时避免多个MERGE输出同样的名称，此参数不要带后缀 |
| minify | Boolean | 是否对脚本做压缩，默认不做压缩 |

此标记用以表明在此标记开始和结束之间的样式/脚本合并成一个文件输出，样式/脚本的内联外联、文件版本等的控制同页面脚本的配置，输出样式/脚本插入到 MERGE 起始标记位置

针对样式的合并

```html
<!-- @MERGE -->
<link href="/path/to/css/a.css" rel="stylesheet" type="text/css"/>
<link href="/path/to/css/b.css" rel="stylesheet" type="text/css"/>
<link href="/path/to/css/c.css" rel="stylesheet" type="text/css"/>
<!-- /@MERGE -->
```

打包后的代码输出可能如下所示

```html
<link href="/path/to/output/xxx.css?234123ewfdsfdsf" rel="stylesheet" type="text/css"/>
```

针对脚本的合并

```html
<!-- @MERGE -->
<script src="/path/to/lib/a.js"></script>
<script src="/path/to/lib/b.js"></script>
<script src="/path/to/lib/c.js"></script>
<script src="/path/to/lib/d.js"></script>
<script src="/path/to/lib/e.js"></script>
<!-- /@MERGE -->
```

打包后的代码输出可能如下所示

```html
<script src="/path/to/output/xxx.js?234123ewfdsfdsf"></script>
```

针对样式、脚本混合合并

```html
<!-- @MERGE -->
<link href="/path/to/css/a.css" rel="stylesheet" type="text/css"/>
<link href="/path/to/css/b.css" rel="stylesheet" type="text/css"/>
<link href="/path/to/css/c.css" rel="stylesheet" type="text/css"/>

<script src="/path/to/lib/a.js"></script>
<script src="/path/to/lib/b.js"></script>
<script src="/path/to/lib/c.js"></script>
<script src="/path/to/lib/d.js"></script>
<script src="/path/to/lib/e.js"></script>
<!-- /@MERGE -->
```

打包后的代码输出可能如下所示

```html
<link href="/path/to/output/xxx.css?234123ewfdsfdsf" rel="stylesheet" type="text/css"/>
<script src="/path/to/output/xxx.js?234123ewfdsfdsf"></script>
```

如果需要自己指定MERGE后的文件名称则可以使用以下方式

```html
<!-- @MERGE {name:'3rd',minify:true} -->
<script src="/path/to/lib/a.js"></script>
<script src="/path/to/lib/b.js"></script>
<script src="/path/to/lib/c.js"></script>
<script src="/path/to/lib/d.js"></script>
<script src="/path/to/lib/e.js"></script>
<!-- /@MERGE -->
```

打包后的代码输出可能如下所示

```html
<script src="/path/to/output/3rd.js?234123ewfdsfdsf"></script>
```

## MANIFEST

是否需要结束：无

支持配置参数：无

此标记用以表明后续的<html>标签需要插入manifest文件

```html
<!-- @MANIFEST -->
<html>
  <head>
    <meta charset="utf-8"/>
...
```
