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
    <!-- @STYLE {name:'core.css',inline:true} -->
    ```

* 所有打包标记在项目打包完成后删除，因此在最终输出的html文件中不会有任何标记

# 标记指令

## NOCOMPRESS

是否需要结束：可选

支持配置参数：无

此标记用以表明从当前位置开始到标记结束位置之间的html代码打包时无需压缩，如没有结束标记则此效果延续到文件结束位置，嵌套情况下此标记仅允许嵌套在TEMPLATE标记中，具体使用范例如下所示：

* 全文无需压缩在文件起始位置加标记
* 部分内容压缩需指定不压缩的内容

## STYLE

是否需要结束：无

支持配置参数：


 参数 | 类型 | 说明 |
 -- | -- | -- |
 core | Boolean | core.css文件插入形式，true - 强行插入core.css；false - 禁止插入core.css； 不设置 - 自动解析【默认】|
 inline | Boolean | 是否强行内联core样式，默认外联 |


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

## TEMPLATE

是否需要结束：必须

支持配置参数：无

此标记用以表明从当前位置至结束标记之前的内容中存在资源模板信息，打包针对模板会做优化处理包括：
* 外联样式文件（类型为css的模板）做内联处理
* 外联嵌套模板文件（类型为html的模板）做内联处理
* 外联脚本文件（类型为js的模板）按照指定标记做内联或者外联处理

因此仅需要在引入资源模板是加此标记即可，具体使用范例如下所示：

```html
<div style="display:none;" id="template-box">
  <textarea name="txt" id="txt-0">
      text content
  </textarea>
  <textarea name="jst" id="jst-0">
      jst content
  </textarea>
  <textarea name="ntp" id="ntp-0">
      ntp content
  </textarea>
  <!-- @TEMPLATE -->
  <textarea name="css">
      css code
  </textarea>
  <textarea name="js">
      js code
  </textarea>
  <textarea name="css" data-src="./css/component/left.css"></textarea>
  <textarea name="js" data-src="./javascript/component/left.js"></textarea>
  <textarea name="html" data-src="./html/component/left.html"></textarea>
  <!-- /@TEMPLATE -->
</div>
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

## NOPARSE

是否需要结束：必须

支持配置参数：无

此标记用以表明从当前位置至结束标记之前的内容不需要做任何处理

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

## IGNORE

是否需要结束：必须

支持配置参数：

| 参数 | 类型 | 说明 |
| -- | -- | -- |
| mode | String | 忽略模式，可选test/online/develop |

此标记用以表明从当前位置至结束标记之前的内容在打完包后删除，mode配置忽略的条件，多个值使用“|”分隔，当打包工具中的X_RELEASE_MODE配置值出现在mode的值中时即忽略此标记间的内容，模式说明

| 模式 | 说明 |
| -- | -- |
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
```

## DEFINE

是否需要结束：无

支持配置参数：

| 参数   | 类型    | 描述 |
| --     | --      | -- |
| nodep  | Boolean | 是否没有使用依赖系统，true - 没有使用依赖系统，后续脚本为源码；false - 使用依赖系统，后续脚本为define.js|
| core   | Boolean | core.js文件插入形式，true - 强行插入core.js；false - 禁止插入core.js； 不设置 - 自动解析【默认】 |
| inline | Boolean | 是否强行内联core脚本，默认外联 |

此标记用以表明后续的脚本标签为依赖系统定义文件路径，对于该文件打包工作做以下处理：
* 最终输出文件不再引入此文件
* 从该脚本路径解析出框架所在路径
* define.js路径支持平台参数配置，所带参数详细说明见平台参数章节

使用依赖系统，后续第一个外联脚本为define.js：

```html
<!-- @DEFINE -->
<script src="/path/to/lib/define.js"></script>
```

没有使用依赖系统，后续脚本作为源码，此标记仅用来表示打包后脚本插入位置：

```html
<!-- @DEFINE {nodep:true} -->
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
<!-- @DEFINE {core:true} -->
<#include "/core/js.ftl">
<script src="/js/page.js"></script>
```

## MANIFEST

是否需要结束：无

支持配置参数：无

此标记用以表面后续的<html>标签需要插入manifest文件

```html
<!-- @MANIFEST -->
<html>
  <head>
    <meta charset="utf-8"/>
...
```
