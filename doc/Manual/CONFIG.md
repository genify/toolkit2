# 配置说明

每行第一个非空字符为“#”则表示该行为注释
* 配置参数使用 KEY = VALUE 格式
* 配置参数如没有特别说明则表示可选配置项
* 配置参数为路径的，如果是相对路径则必须以“./”、“../”开始
* 配置参数中如无特殊说明使用的相对路径均相对于 [DIR_WEBROOT](#dir_webroot) 的路径
* 配置参数名称忽略大小写，即cfg_dir_webroot等价于CFG_DIR_WEBROOT

# 配置分类

可配置的参数主要分为以下几部分：

* [路径配置](#路径配置) ： 主要配置项目的输入输出目录信息
* [文件过滤](#文件过滤) ： 文件过滤信息配置
* [别名配置](#别名配置) ： 对于使用服务器端模板的项目，资源路径上的变量配置
* [合并策略](#合并策略) ： 样式、脚本合并规则配置
* [NEJ配置](#nej配置)  ： 使用NEJ的项目控制NEJ输出选项的配置
* [混淆压缩](#混淆压缩) ： 脚本混淆压缩规则配置
* [版本配置](#版本配置) ： 样式、脚本资源版本控制输出形式配置
* [域名配置](#域名配置) ： 静态资源使用的CDN域名配置
* [图片优化](#图片优化) ： 主要用于配置图片优化参数
* [离线配置](#离线配置) ： HTML5离线应用Manifest文件输出配置
* [模板封装](#模板封装) ： NEJ模板输出配置
* [页面压缩](#页面压缩) ： 页面文件如HTML、服务器模板文件等的压缩配置
* [扩展配置](#扩展配置) ： 其他支持项配置

## 路径配置

这部分配置主要用于配置发布项目的输入输出目录信息，这里需要注意的是必须配置至少一个输入路径，即 [DIR_SOURCE](#dir_source) 或者 [DIR_SOURCE_TP](#dir_source_tp) 至少配置一项

### DIR_WEBROOT

**必须配置，如配置目录不存在则不再继续后续发布流程**

WEB根路径，与项目WEB服务器配置的根路径一致，如果是相对路径则相对于当前配置文件路径(即release.conf文件所在目录)

```
DIR_WEBROOT = ../webapp/
```

### DIR_SOURCE

项目HTML文件根路径，如果是使用服务器端模板的项目可以不用配置此目录，直接配置 [DIR_SOURCE_TP](#dir_source_tp) 即可

```
DIR_SOURCE = ./src/html/
```

### DIR_SOURCE_SUB

输入HTML文件子目录配置，多个目录用逗号或者分号分隔，如果是相对路径则相对于 [DIR_SOURCE](#dir_source) 配置

```
DIR_SOURCE_SUB = ./a/,./b/,./c/
```

此参数主要用于配置 多个系统集成在一个工程中的情况，如某个工程中集成了三个系统，而这三个系统的各自实现分别为sys-a，sys-b，sys-c，其中common为三个系统共用部分

```
webapp
  |- src
      |- html
          |- common
          |- sys-a
          |- sys-b
          |- sys-c
```

这里针对三个系统的发布配置可分别为：

release.sys-a.conf

```
DIR_SOURCE = ./src/html/
DIR_SOURCE_SUB = ./common/,./sys-a/
```

release.sys-b.conf

```
DIR_SOURCE = ./src/html/
DIR_SOURCE_SUB = ./common/,./sys-b/
```

release.sys-c.conf

```
DIR_SOURCE = ./src/html/
DIR_SOURCE_SUB = ./common/,./sys-c/
```

### DIR_OUTPUT

HTML文件输出路径，默认为 [DIR_WEBROOT](#dir_webroot) 配置的路径，如果配置的路径不存在则会自动为其创建此输出目录 

配置的目录如不在 [DIR_WEBROOT](#dir_webroot) 目录下则在发布过程会有警告信息

```
DIR_OUTPUT = ./pub/
```

### DIR_OUTPUT_STATIC

静态文件（样式、脚本）输出目录，默认为 [DIR_OUTPUT](#dir_output) 配置的路径，如果配置的路径不存在则会自动为其创建此输出目录 

配置的目录如不在 [DIR_WEBROOT](#dir_webroot) 目录下则在发布过程会有警告信息

```
DIR_OUTPUT_STATIC = ./r/
```

### DIR_SOURCE_TP

项目服务器端模板文件根路径，与项目容器配置的模板根路径一致

如果模板文件中所需的样式、脚本文件的引用均以&lt;style&gt;，&lt;link&gt;，&lt;script&gt; 标签形式出现在模板文件中的，发布工具可自动识别，无需进行额外的配置

```
DIR_SOURCE_TP = ./template/
```

### DIR_SOURCE_TP_SUB

输入服务器端模板文件子目录配置，多个目录用逗号或者分号分隔，如果是相对路径相对于 [DIR_SOURCE_TP](#dir_source_tp) 配置，其功能等同于 [DIR_SOURCE_SUB](#dir_source_sub) 的配置

```
DIR_SOURCE = ./a/,./b/,./c/
```

### DIR_OUTPUT_TP

项目服务器端模板输出路径，默认为 [DIR_OUTPUT](#dir_output) 配置信息，如果配置的路径不存在则会自动为其创建此输出目录

```
DIR_OUTPUT_TP = ./tpl/
```

### DIR_STATIC

项目中使用的静态资源路径，默认为 [DIR_WEBROOT](#dir_webroot) 下的res目录，此参数主要用于识别样式中引入的资源、页面src、href中引入的资源路径，主要用于以下两个方面

* 发布后页面输出路径变化时调整这些资源引用的相对路径
* 在打开 [VERSION_STATIC](#version_static) 开关时增加静态资源的版本信息

```
DIR_STATIC = ./res/
```

## 文件过滤

这部分配置主要用于配置待处理文件的过滤信息

### FILE_CHARSET

输入输出文件编码，默认为utf-8，注项目必须保证所有文件的编码一致，如样式、脚本、模板等文件的编码一致

```
FILE_CHARSET = gbk
```

### FILE_FILTER

输入文件通过路径筛选要处理的文件，说明如下：

* 正则表达式，忽略大小写
* 确保可以通过new RegExp转换成正则
* 规则用来检验要处理的文件路径，默认处理所有文件，忽略以“.”起始的目录和文件
* 如以下范例规则表示只处理以ftl、html为后缀的文件

```
FILE_FILTER = \.(ftl|html)$
```

### FILE_EXCLUDE

输入文件通过路径排除规则过滤掉不要处理的文件，说明如下：

* 正则表达式，忽略大小写
* 确保可以通过new RegExp转换成正则
* 规则用来检验不要处理的文件路径，默认不排除文件
* 如以下范例规则表示不处理以js、mcss、css为后缀的文件

```
FILE_EXCLUDE = \.(js|mcss|css)$
```

## 别名配置

这部分主要针对服务器端模板中在引入资源时使用了变量的情况，如以下freemarker模板中引入脚本时使用了config_lib_root、nej_config的模板变量

```html
<script src="${config_lib_root}define.js${nej_config}"></script>
```

此时可以通过这部分的配置来处理发布过程对资源的识别

### ALIAS_MATCH

别名匹配规则，可以通过new RegExp转换成正则表达式，这里需要注意的是使用正则时需要将变量名捕获，如针上面的freemarker模板的变量，可以用以下规则进行匹配

```
ALIAS_MATCH = \$\{(.*?)\}
```

### ALIAS_DICTIONARY

别名配置信息，通过 [ALIAS_MATCH](#alias_match) 匹配到的变量可以通过以下配置的别名配置表中的值进行替换，以补全成完整的路径信息

注意这里配置的JSON对象需要在一行内完成，不允许换行

```
ALIAS_DICTIONARY = {"nej_config":"?pro=../js/","config_lib_root":"/src/javascript/lib/nej/"}
```

通过以上的配置信息，范例中的脚本路径可以被识别为 /src/javascript/lib/nej/define.js?pro=../js/ 路径进行分析

## 合并策略

这部分主要用于对样式、脚本使用的合并策略的配置

资源合并的总原则为：

每个页面最多引入2个样式或者脚本资源，其中一个为CORE文件，另一个文件为页面相关资源内容

* CORE文件：主要包含频繁使用的资源内容
* 页面资源文件：主要包含当前页面使用的，出去CORE中内容后剩余的资源内容

目前提供的合并策略包括：

* 固定CORE列表，可以通过配置CORE文件列表来确定CORE文件的内容，其他各页面剩余的资源均作为页面资源内容
* 频率控制，可以通过配置文件使用频率来自动识别CORE文件的内容，其他各页面剩余的资源均作为页面资源内容
* 屏蔽CORE文件，以上两种方式生成的CORE列表都可以通过配置屏蔽文件列表从CORE中过滤掉从而得到最终的CORE文件的内容，其他各页面剩余的资源均作为页面资源内容

注意：这部分配置内容如涉及相对路径则相对于当前配置文件（即release.conf所在目录）路径

### CORE_MERGE_FLAG

CORE文件识别策略配置，可以配置的值如下：

* 0 - 自动处理，默认为此方式
* 1 - 每个页面样式单独处理，不再参与CORE文件的合并
* 2 - 每个页面脚本单独处理，不再参与CORE文件的合并
* 3 - 每个页面样式、脚本均单独处理，不再参与CORE文件的合并

```
CORE_MERGE_FLAG = 0
```

### CORE_NOPARSE_FLAG

输出文件中不做解析的内容设置，默认根据页面标记处理，此优先级高于页面配置标记 @NOPARSE，此配置可使用的值：

* 0 - 根据页面标记处理，默认使用此方式
* 1 - 不处理内联样式，如&lt;style&gt;&lt;/style&gt;之间的内容
* 2 - 不处理内联脚本，如&lt;script&gt;&lt;/script&gt;之间的内容
* 3 - 不处理内联样式和脚本，即1和2的情况都不处理

```
CORE_NOPARSE_FLAG = 0
```

### CORE_IGNORE_ENTRY

页面脚本识别时是否屏蔽所有入口文件（即直接在页面以script标签形式引入的脚本）

默认入口文件参与CORE文件合并解析，当多个页面同时引用同一个入口文件时可以设置此参数为true

```
CORE_IGNORE_ENTRY = true
```

### CORE_LIST_JS

脚本CORE文件列表配置文件，配置列表会自动做依赖分析，可以配置JSON对象或者独立配置文件路径

* 指定路径则表示配置文件地址，如 ./core.js.json
* 指定列表则表示文件列表，必须在一行内完成，如 ["util/ajax/xdr",...]

```
CORE_LIST_JS = ./core.js.json
```

### CORE_MASK_JS

脚本CORE屏蔽文件列表，即此列表中配置的文件均不会出现在CORE文件中，此配置列表不做依赖分析，因此此配置列表中的文件不应该被其他文件依赖，如独立的第三方库、页面入口等，其配置形式同 [CORE_LIST_JS](#core_list_js) ，可以配置JSON对象或者独立配置文件路径

```
CORE_MASK_JS = ./mask.js.json
```

### CORE_FREQUENCY_JS

自动合并CORE文件时，提取脚本文件出现频率大于等于此配置值的文件，默认为2，此配置值必须大于等于2，比如此配置为3则表示当文件出现在3个以上页面中时会将此文件放入CORE文件中

```
CORE_FREQUENCY_JS = 2
```

### CORE_LIST_CS

样式CORE文件列表配置文件，具体配置同 [CORE_LIST_JS](#core_list_js)

```
CORE_LIST_CS = ["/src/css/reset.css","/src/css/base.css"]
```

### CORE_MASK_CS

样式CORE屏蔽文件列表，具体配置同 [CORE_MASK_JS](#core_mask_js)

### CORE_FREQUENCY_CS

自动样式CORE文件时，提取文件的频率控制，具体配置同 [CORE_FREQUENCY_JS](#core_frequency_js)

## NEJ配置

这部分主要针对使用NEJ的项目，可以通过配置以下信息做扩展

### NEJ_PLATFORM

NEJ平台适配参数，等价于define.js?p=wk|td这里p的配置，优先级比p参数高，配置规则同p

```
NEJ_PLATFORM = wk|td-1
```

### NEJ_DIR

NEJ框架本地路径，没有配置情况下会尝试识别lib/nej目录，如果是规范的目录结构可以不用配置此参数，工具自动识别，工具自动识别的路径为： [DIR_WEBROOT]/src/javascript/lib/nej/或者[DIR_WEBROOT]/src/javascript/lib/nej/src/

注意：线上产品自动部署时为防止网络问题导致发布失败尽量将此路径配置成本地路径

```
NEJ_DIR = http://nej.netease.com/nej/src/
```

### NEJ_REGULAR

REGULAR预解析执行文件路径，没有配置情况下会尝试识别lib/regularjs/目录，如果是规范的目录结构可以不用配置此参数，工具自动识别，工具自动识别的路径为： [DIR_WEBROOT]/src/javascript/lib/regularjs/dist/regular.js

```
NEJ_REGULAR = ./src/javascript/lib/regular/regular.js
```

### NEJ_PROCESSOR

预处理器支持文件，相对路径相对于配置文件（release.conf）所在目录路径

系统默认内置以下预处理指令：

* text      纯文本内容
* json      JSON对象
* regular   Regular模板预处理
* rgl       同regular

```
NEJ_PROCESSOR = ./proc.js
```

比如在项目代码中使用abc的插件

```javascript
NEJ.define([
    'abc!/path/to/a.xx'
],function(xx){
    
    // TODO something

});
```

如果想在发布的时候对abc的内容做预处理的话，可以在proc.js文件中实现abc的预处理接口

```javascript
module.exports = {

    abc:function(event){
        // event.file       预处理解析的内容所在的文件
        // event.content    预处理解析的内容

        // TODO something

        return 'content after process';
    }

};
```

### NEJ_INJECTOR

导出的依赖注入管理函数名称，默认为I$

```
NEJ_INJECTOR = I$
```

### NEJ_MODULE_ROOT

NEJ单页模块系统中模块根路径配置，默认自动解析

```
NEJ_MODULE_ROOT = /
```

### NEJ_MODULE_VERSION

模块文件的版本模式，支持配置的值如下所示

* 0 - 使用查询参数的版本【默认配置】，如 index.html?12343423432
* 1 - 使用路径版本，比如 index.html 的模块生成 index_13432233243.html 的打包文件

```
NEJ_MODULE_VERSION = 1
```

## 混淆压缩

这部分主要用来配置脚本压缩混淆时所做的一些扩展

### OBF_LEVEL

脚本混淆等级，可以使用以下值：

* 0 - 只混淆所有局部变量
* 1 - 在0的基础上增加单个下划线(_)前缀的变量，如_xxx
* 2 - 在1的基础上增加两个下划线(__)前缀的变量，如_xxx、__xxx
* 3 - 在0的基础上增加所有下滑线前缀的变量【默认配置】，如_xxx、__xxx、_$xxx、_$$xxx

```
OBF_LEVEL = 0
```

### OBF_NAME_BAGS

脚本混淆变量名称对照表文件路径，相对路径相对于配置文件（release.conf）所在目录路径，脚本压缩完成后新生成的名称对照表会替换原有的内容

```
OBF_NAME_BAGS  = ./names.json
```

### OBF_COMPATIBLE

是否采用NEJ兼容模式输出结果，即在全局上注册nej名字空间，默认为true，注意：

* 非兼容模式下只能使用依赖注入的形式获取依赖文件输出的对象
* 兼容模式下支持非兼容模式外还支持使用名字空间作为依赖对象获取方式

```
OBF_COMPATIBLE = true
```

### OBF_DROP_CONSOLE

是否去除源码中console相关的代码

```
OBF_DROP_CONSOLE = true
```

### OBF_GLOBAL_VAR

发布时全局变量配置值，脚本输出时代码中的这些变量直接使用此配置的值替换，配合 IGNORE 发布标记可以切换开发和发布等不同环境下的值，这里配置的JSON对象必须在一行内完成

```
OBF_GLOBAL_VAR = {"ONLINE":true,"OTHER_VALUE":123}
```

使用方式如在页面中有这样一段代码

```html
<!-- @IGNORE -->
<script>window.ONLINE = false;</script>
<!-- /@IGNORE -->

<script>
    if (!ONLINE){
        // for development
    }
</script>
```

那么根据上面配置的 OBF_GLOBAL_VAR 设置 ONLINE 为 true 时，发布输出的结果为

```
<script>if (false){ ... }</script>
```

### OBF_SOURCE_MAP

是否导出Source Map配置，默认情况或者未配置的情况下不输出Source Map信息

```
OBF_SOURCE_MAP = false
```

### OBF_MAX_CS_INLINE_SIZE

内联样式内容的最大长度（单位K），默认为50K，如超出该长度则将样式做为外联文件导入

```
OBF_MAX_CS_INLINE_SIZE = 0
```

### OBF_MAX_JS_INLINE_SIZE

内联脚本内容的最大长度（单位K），默认为0K，即使用外联文件导入

```
OBF_MAX_JS_INLINE_SIZE = 0
```

### OBF_CORE_INLINE_FLAG

CORE文件内联规则配置，整体控制CORE文件的内联，优先级高于页面SCRIPT标记中的inline配置，可配置值：

* 0 - 自动处理，根据页面SCRIPT标记配置的inline参数决定，默认外联
* 1 - 所有页面的样式CORE文件内联
* 2 - 所有页面的脚本CORE文件内联
* 3 - 所有页面的样式和脚本CORE文件内联

```
OBF_CORE_INLINE_FLAG = 3
```

## 版本配置

这部分主要用来配置静态资源的版本信息

### VERSION_STATIC

静态资源是否自动带版本号，打开此开关则静态资源即 [DIR_STATIC](#dir_static) 配置的目录下的所有资源文件的使用均自动带上版本信息（包括样式中使用的静态资源、页面中使用的静态资源），如果资源使用时自带版本信息，如url(/path/to/a.png?v=1234)则不再生成版本信息

```
VERSION_STATIC = true
```

### VERSION_STATIC_MODE

静态资源版本号生成规则，默认自动模式，配置说明如下：

* 0 - 自动模式，根据文件内容生成，版本号通过地址的查询串携带，如/a.png?9e107d9d372bb6826bd81d3542a419d6
* 1 - 随机模式，每次生成随机版本信息，不重复，版本号通过地址的查询串携带，如/a.png?123456
* \* - 固定模式，配置字符串作为文件名后缀，地址的查询串中不再携带版本信息，如配置为v1,则生成的文件文件名后追加此配置值，生成文件名如a_v1.png

固定模式配置中可以使用以下变量来表示内建值，如果出现以下变量，则不再追加原文件名

* [RAND]     - 替代随机版本号，如[FILENAME]_[RAND]则生成文件a_9865734934.png
* [VERSION]  - 替代文件的MD5值，如v2_[VERSION]则生成文件为v2_9e107d9d372bb6826bd81d3542a419d6.png
* [FILENAME] - 替代文件名，系统自动生成的唯一文件名标识，如[FILENAME]_v2则生成文件a_v2.png

```
VERSION_STATIC_MODE = [FILENAME]_[VERSION]
```

### VERSION_MODE

样式、脚本版本号生成规则配置，默认自动模式，配置说明如下：

* 0 - 自动模式，根据文件内容生成，版本号通过地址的查询串携带，如/a.js?9e107d9d372bb6826bd81d3542a419d6
* 1 - 随机模式，每次生成随机版本信息，不重复，版本号通过地址的查询串携带，如/a.js?123456
* \* - 固定模式，配置字符串作为文件名后缀，地址的查询串中不再携带版本信息，如配置为v1,则生成的文件文件名后追加此配置值，生成文件名如a_v1.js

固定模式配置中可以使用以下变量来表示内建值，如果出现以下变量，则不再追加原文件名

* [RAND]     - 替代随机版本号，如[FILENAME]_[RAND]则生成文件a_9865734934.js
* [VERSION]  - 替代文件的MD5值，如v2_[VERSION]则生成文件为v2_9e107d9d372bb6826bd81d3542a419d6.js
* [FILENAME] - 替代文件名，系统自动生成的唯一文件名标识，如[FILENAME]_v2则生成文件a_v2.js

```
VERSION_MODE = [FILENAME]_[VERSION]
```

## 域名配置

这部分主要用来配置静态资源使用的CDN域名，域名配置遵循以下规则：

* 多个域名随机的方式，用逗号分隔各个域名，使用时为每个资源从列表中随机一个域名
* 如果没有配置，则项目的静态资源中相对路径的请求相对于页面路径
* 如果配置了"/"，则项目的静态资源中相对路径的请求相对于WEBROOT的路径
* 如果配置了域名，则项目的静态资源中相对路径的请求使用当前域名的绝对路径

### DM_STATIC

默认静态资源请求域名，限定 [DIR_STATIC](#dir_static) 配置路径下资源、脚本资源、样式资源访问域

```
DM_STATIC = b1.bst.126.net
```

### DM_STATIC_RS

静态资源域名，如图片、Flash等，没有配置则使用 [DM_STATIC](#dm_static) 配置信息

```
DM_STATIC_RS = b4.bst.126.net,b5.bst.126.net
```

### DM_STATIC_CS

外联样式请求域名，没有配置则使用 [DM_STATIC](#dm_static) 配置信息

```
DM_STATIC_CS = b1.bst.126.net
```

### DM_STATIC_JS

外联脚本请求域名，没有配置则使用 [DM_STATIC](#dm_static) 配置信息

```
DM_STATIC_JS = b2.bst.126.net
```

## 图片优化

这部分主要用于配置图片优化参数，打开此部分优化开关需要先安装 nej-minimage 工具，安装方式如下

```
npm install nej-minimage -g
```

如果之前已安装则可以通过以下方式更新到最新版本

```
npm update nej-minimage -g
```

### OPT_IMAGE_FLAG

图片优化开关，打开此开关则 [DIR_STATIC](#dir_static) 下的图片会做优化压缩，替换原文件

```
OPT_IMAGE_FLAG = true
```

### OPT_IMAGE_QUALITY

图片输出质量 1-100

```
OPT_IMAGE_QUALITY = 100
```

### OPT_IMAGE_BASE64

内嵌的静态资源文件使用BASE64地址的大小配置，单位为 K，当静态资源文件大小小于这里配置的值的时候采用BASE64内联到宿主文件中，默认为 0，即不使用BASE64地址，如果配置 100 ，则表示小于100K的静态资源均使用BASE64路径

```
OPT_IMAGE_BASE64  = 100
```

### OPT_IMAGE_SPRITE

图片做精灵图合并的路径,即项目的样式中使用到该路径下的图片资源会先做合并再使用，相对路径相对于DIR_STATIC配置的路径，如果没有配置此参数则不会做精灵图合并

```
OPT_IMAGE_SPRITE  = ./sprite/
```

### OPT_IMAGE_SPRITE_OPTIONS

图片合并相关参数，JSON字符串，可配置参数如下所示，支持的参数

* layout 图片布局方式，默认 binary-tree，可选布局方式 top-down,left-right,diagonal,alt-diagonal,binary-tree，具体算法效果见 https://github.com/twolfson/layout
* margin 图片之间的间隙，默认为 4px
* prefix 输出精灵图文件名前缀，默认为空，不带前缀

```
OPT_IMAGE_SPRITE_OPTIONS = {"layout":"left-right","margin":4,"sprite":"spt_"}
```

## 离线配置

这部分主要用于配置HTML5中离线应用的manifest文件的输出

### MANIFEST_ROOT

页面请求Manifest文件路径配置，没有配置则使用相对路径，否则使用相对于 [DIR_WEBROOT](#dir_webroot) 的路径

```
MANIFEST_ROOT = /
```

### MANIFEST_OUTPUT

manifest输出路径，默认在 [DIR_WEBROOT](#dir_webroot) 下输出 cache.manifest 文件

```
MANIFEST_OUTPUT = ./cache.manifest
```

### MANIFEST_TEMPLATE

输出的manifest文件模板，纯文本文件，不配置则使用默认模板

如果是相对路径则相对于当前配置文件路径(即release.conf文件所在目录)

模板中使用的变量格式为  #&lt;VAR_NAME&gt;，其中VAR_NAME为变量名，可用变量名如下：

* VERSION       - 版本信息
* CACHE_LIST    - 缓存资源列表，换行符分隔

```
MANIFEST_TEMPLATE = ./cache.manifest.tpl
```

默认的模板内容为

```
CACHE MANIFEST
#VERSION = #<VERSION>

CACHE:
#<CACHE_LIST>

NETWORK:
*

FALLBACK

```

### MANIFEST_FILTER

输出CACHE_LIST列表过滤器，符合配置条件的文件从列表中过滤掉，不做输出

```
MANIFEST_FILTER = \.html$
```

## 模板封装

这部分主要用来配置页面中内联的代码封装的形式，以及NEJ模板的封装形式

### WRP_INLINE_SOURCE

内联资源防止服务器模板规则干扰使用的封装标签，%s表示内联的代码，以下情况下使用该标记包装插入内容

* 使用@TEMPLATE标记的内容，其中%s为要插入的TEMPLATE内容
* 使用@MODULE标记的内容，其中%s为要插入的MODULE内容
* 内敛脚本插入时使用此标签包起来，%s表示页面要插入的脚本

```
WRP_INLINE_SOURCE = <#noparse>%s</#noparse>
```

### WRP_SCRIPT_SOURCE

包装脚本源码，所有输出脚本均用此结构包装，其中 %s 表示要输出的源码

注：除非你知道自己在做什么，否则不要修改此配置

比如我们最终输出的代码类似这种

```javascript
var a = function(b){console.log(b)},c = function(d){alert(d)}; ...
```

如果配置了以下参数

```
WRP_SCRIPT_SOURCE = (function(){%s})();
```

则最终输出的代码为

```javascript
(function(){var a = function(b){console.log(b)},c = function(d){alert(d)}; ...})();
```

### WRP_INLINE_CS

内联样式模板输出规则，%s表示内联的样式代码

```
WRP_INLINE_CS = <textarea name="css">%s</textarea>
```

### WRP_EXLINE_CS

外联样式模板输出规则，%s表示外联的样式路径，带版本信息

```
WRP_EXLINE_CS = <textarea name="css" data-src="%s"></textarea>
```

### WRP_INLINE_JS

内联脚本模板输出规则，%s表示内联的脚本代码

```
WRP_INLINE_JS = <textarea name="js">%s</textarea>
```

### WRP_EXLINE_JS

外联脚本模板输出规则，%s表示外联的脚本路径，带版本信息

```
WRP_EXLINE_JS = <textarea name="js" data-src="%s"></textarea>
```

### WRP_INLINE_TP

其他内联模板输出规则，%s依次表示模板ID、模板类型、模板内容

```
WRP_INLINE_TP = <textarea id="%s" name="%s">%s</textarea>
```

## 页面压缩

这部分主要用于页面文件，如HTML文件、服务器端模板文件（freemarker、velocity等）的压缩输出配置

### CPRS_FLAG

输出文件压缩配置，可用的值说明如下，默认为 0

* 0 - 根据页面标记处理，除带@NOCOMPRESS标记的内容，其余内容均去除行首尾空格
* 1 - 所有页面不压缩，保留原有的首尾空格，此优先级高于页面标记@NOCOMPRESS
* 2 - 所有页面压缩成一行，去除每行首尾空格和回车换行符，忽略页面@NOCOMPRESS标记

```
CPRS_FLAG = 0
```

### CPRS_KEEP_COMMENT

是否保留HTML代码中的注释，默认删除所有页面结构中的注释

```
CPRS_KEEP_COMMENT = true
```

## 扩展配置

这部分主要用于说明其他一些未归类的扩展配置

### X_AUTO_EXLINK_PATH

发布后使用绝对路径调整外链地址，主要处理页面中同时符合以下条件的外链地址

* 地址指向的内容为 [DIR_SOURCE](#dir_source) 配置下的内容
* html中使用src="[LINK]"或者href="[LINK]"形式引入指向 [DIR_SOURCE](#dir_source) 下的地址

注意：DIR_SOURCE_TP配置目录下的文件解析时自动打开此开关调整指向 [DIR_SOURCE](#dir_source) 下的src和href

```
X_AUTO_EXLINK_PATH = true
```

### X_AUTO_EXLINK_PREFIX

如果 [X_AUTO_EXLINK_PATH](#x_auto_exlink_path) 配置为true则可以通过此配置增加前缀标识来强行替换带该标识的路径，带标识路径规则为[X_AUTO_EXLINK_PREFIX]="[LINK]"，多个前缀标识用|分隔

注意：使用NEJ单页面多模块调度的系统这里切勿配置data-src

```
X_AUTO_EXLINK_PREFIX = data-href|data-html-root
```

### X_AUTO_EXLINK_SCRIPT

发布后使用绝对路径调整脚本文件中的地址，检查符合以下条件的地址

* 字符串中相对于[DIR_WEBROOT](#dir_webroot)的静态资源

```
X_AUTO_EXLINK_SCRIPT = true
```

### X_AUTO_EXLINK_SCRIPT_EXTENSION

在打开 X_AUTO_EXLINK_SCRIPT 开关之后，可以使用以下配置参数做扩展信息的配置，已支持配置信息如下

* checkDIR - 是否处理符合条件的目录，默认为 false

```
X_AUTO_EXLINK_SCRIPT_EXTENSION = {"checkDIR":true}
```

### X_RELEASE_MODE

发布模式，主要用于控制IGNORE标记的处理，IGNORE标记配置的模式匹配到这里配置的模式则相应的代码在打包时会被过滤掉，系统内置以下三种模式，也可以使用自定义模式，模式不区分大小写

* test        测试模式
* online      线上模式，默认模式
* develop     开发模式

```
X_RELEASE_MODE = online
```

### X_LOGGER_LEVEL

日志输出模式，可用值：

* DEBUG   - 输出DEBUG/INFO/WARN/ERROR级别的日志
* INFO    - 输出INFO/WARN/ERROR级别的日志
* WARN    - 输出WARN/ERROR级别的日志
* ERROR   - 输出ERROR级别的日志
* ALL     - 输出所有日志
* OFF     - 关闭日志输出