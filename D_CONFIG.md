# 配置说明

每行第一个非空字符为“#”则表示该行为注释
* 配置参数使用 KEY = VALUE 格式
* 配置参数为路径的，如果是相对路径则必须以“./”、“../”开始
* 配置参数中如无特殊说明使用的相对路径均相对于DIR_WEBROOT的路径
* 配置参数名称忽略大小写，即cfg_dir_webroot等价于CFG_DIR_WEBROOT

# 参数说明

## DIR_WEBROOT
必须

WEB根路径，如果是相对路径则相对于当前配置文件路径(即release.conf文件所在目录)

## DIR_SOURCE
可选

项目HTML文件根路径，如果是使用服务器端模板的项目可以不用配置此目录，直接配置DIR_SOURCE_TP即可

## DIR_OUTPUT
可选

打包HTML文件输出路径，默认为DIR_WEBROOT配置信息

## DIR_OUTPUT_STATIC
可选

静态文件输出目录，默认为DIR_OUTPUT配置信息，如果该配置目录不在DIR_WEBROOT配置的目录下，则自动调整为DIR_WEBROOT下以DIR_OUTPUT目录名命名的目录下，以确保所有静态资源对外可访问

## DIR_SOURCE_TP
可选

项目服务器端模板文件根路径，服务器端模板文件确保页面所需的CSS、JS文件的引用均出现在模板文件中

## DIR_OUTPUT_TP
可选

项目服务器端模板输出路径，默认为DIR_OUTPUT配置信息，如果没有配置DIR_SOURCE_TP则忽略此参数配置信息

## DIR_STATIC
可选（如果配置则必须确保路径存在）

静态资源路径，默认为DIR_WEBROOT下的res目录，如果静态资源的目录不是DIR_WEBROOT下的res且在html代码中引用了静态资源地址则需要配置此参数来调整html中静态资源的引用路径

## NEJ_DIR
可选

NEJ框架本地路径，此配置优先级高于自动识别

## NEJ_PLATFORM
可选

NEJ平台适配参数，等价于define.js?p=wk|td这里p参数的配置，优先级比p参数高，配置规则同p参数

## MANIFEST_OUTPUT
可选

HTML5离线应用配置文件输出路径，对于需要使用HTML5离线的应用可配置此文件路径输出manifest文件

## MANIFEST_TEMPLATE
可选

HTML5离线应用配置文件输出模板路径，纯文本文件，不配置使用默认模板；如果是相对路径则相对于当前配置文件路径(即.conf文件所在目录)；模板中使用的变量格式如下

```
#<VAR_NAME>
```

其中VAR_NAME为变量名，可用变量名如下：

| 标识       | 说明                     |
| ---------- | ------------------------ |
| VERSION    | 版本信息                 |
| CACHE_LIST | 缓存资源列表，换行符分隔 |

## MANIFEST_FILTER
可选

HTML5离线应用配置文件输出输出CACHE_LIST列表过滤正则表达式，确保可以通过new RegExp转换成正则

## DM_STATIC
可选

静态资源域名配置

* 如果没有配置，则项目的静态资源中相对路径的请求相对于页面路径
* 如果配置了"/"，则项目的静态资源中相对路径的请求相对于WEBROOT的路径
* 如果配置了域名，则项目的静态资源中相对路径的请求使用当前域名的绝对路径

默认静态资源请求域名，限定DIR_STATIC配置路径下资源、JS资源、CSS资源访问域

## DM_STATIC_CS
可选

外联样式请求域名，没有配置则使用DM_STATIC配置信息，规则同DM_STATIC

## DM_STATIC_JS
可选

外联脚本请求域名，没有配置则使用DM_STATIC配置信息，规则同DM_STATIC

## DM_STATIC_MR
可选

模块根路径配置，模块调度方案中模块文件所在的根路径，默认自动解析

## DM_STATIC_MF
可选

MANIFEST文件请求域名，没有配置则使用DM_STATIC配置信息

## OBF_LEVEL
可选

脚本混淆等级

| 等级 | 说明 |
| :--: | -- |
| 0    | 只做局部变量混淆 |
| 1    | 在0的基础上再混淆单个下划线(_)前缀的变量，如_xxx |
| 2    | 在1的基础上再混淆两个下划线(__)前缀的变量，如_xxx、__xxx |
| 3    | 在0的基础上再混淆所有下滑线前缀的变量，如_xxx、__xxx、_$xxx、_$$xxx |

默认混淆等级为3

## OBF_NAME_BAGS
可选

脚本混淆变量名称对照表文件路径，如果是相对路径则相对于当前配置文件路径，默认为release.conf文件同目录下的name.json文件

## OBF_SOURCE_MAP
可选

是否输出Source Map信息，如果设置为true则会在DIR_OUTPUT_STATIC配置的目录下输出源文件映射表以支持Chrome、Firefox的源码调试功能

## OBF_MAX_CS_INLINE_SIZE
可选

内联样式内容的最大长度（单位K），默认为50K，如超出该长度则将样式做为外联文件导入

## OBF_MAX_JS_INLINE_SIZE
可选

内联脚本内容的最大长度（单位K），默认为0K，即使用外联文件导入

## CORE_LIST_JS
可选

文件合并策略配置，core文件包含的脚本列表，配置的列表会自动做依赖分析
* 配置路径如果是相对路径则相对于当前配置文件路径
* 如果没有配置core文件列表则一个文件在2个以上（包含2个）文件中出现就会合并到core文件中

JavaScript Core文件列表配置文件
* 如果指定路径则表示配置文件地址，如./core.js.json
* 如果指定列表则表示文件列表，必须在一行内完成，如["{lib}util/ajax/xdr.js",...]

## CORE_LIST_CS
可选

CSS Core文件列表配置文件，规则同CORE_LIST_JS
* 如果指定路径则表示配置文件地址，如./core.css.json
* 如果指定列表则表示文件列表，必须在一行内完成，如["/src/css/reset.css",...]

## CORE_MASK_JS
可选

Core文件屏蔽的脚本列表，在Core文件解析完成后根据此配置列表删除Core中出现的文件，注意：
* 该配置列表不做文件依赖分析
* 该配置列表中配置的文件不应该被其他文件依赖
* 配置路径如果是相对路径则相对于当前配置文件路径

JavaScript Core文件屏蔽列表配置同CORE_LIST_JS
* 如果指定路径则表示配置文件地址，如./mask.js.json
* 如果指定列表则表示文件列表，必须在一行内完成，如["{lib}util/ajax/xdr.js",...]

## CORE_MASK_CS
可选

Core文件屏蔽的样式列表，在Core文件解析完成后根据此配置列表删除Core中出现的文件，配置路径如果是相对路径则相对于当前配置文件路径

CSS Core文件屏蔽列表配置同CORE_LIST_CS
* 如果指定路径则表示配置文件地址，如./mask.css.txt
* 如果指定列表则表示文件列表，必须在一行内完成，如["{lib}util/ajax/xdr.js",...]

## ALIAS_START_TAG
可选

别名开始标记，默认为 ${
路径别名配置，页面引入的脚本或者样式可以使用服务器端模板标记，如

```js
<script src="${config_lib_root}define.js"></script>
```

## ALIAS_END_TAG
可选

别名结束标记，默认为 }

## ALIAS_DICTIONARY
可选

别名配置表，如

```
{"nej":"D:/nej/src","config_lib_root":"{lib}"}
```

## NAME_SUFFIX
可选

输出文件名后缀，配置了后缀的情况下对所有输出文件的请求都不会带版本号，默认带版本号

## FILE_SUFFIX
可选

输入文件后缀匹配规则（主要是DIR_SOURCE和DIR_SOURCE_TP配置的输入目录下的文件），多个后缀用“|”分隔，忽略大小写，默认分析指定目录下的所有文件，复杂过滤器可使用FILE_FILTER正则匹配过滤

## FILE_FILTER
可选

输入文件路径匹配规则（主要是DIR_SOURCE和DIR_SOURCE_TP配置的输入目录下的文件），满足以下要求：

* 正则表达式，忽略大小写
* 确保可以通过new RegExp转换成正则
* 规则用来检验要处理的文件，默认处理所有文件

## FILE_CHARSET
可选

输入输出文件编码，默认为utf-8

注意：项目必须保证所有文件的编码一致，如css/js/ftl等文件的编码一致

## RAND_VERSION
可选

输出文件版本号使用随机算法
* 默认输出文件版本号根据内容计算，如果文件内容不变版本不变
* 此参数设置为true时每次打包生成的版本号都不一样，常用于线上服务器更新失败时强制变更版本信息

## STATIC_VERSION
可选

输出文件中的静态资源地址【DIR_STATIC配置目录下的资源文件】是否自动带上版本信息，默认情况下不自动带上版本信息。另外以下几种情况的资源也不会自动带上版本信息：

* 资源地址指定了版本信息，如/res/logo.png?v=1
* 资源地址非本地文件，如http://a.b.com/logo.png

## X_NOCOMPRESS
可选

输出文件不做压缩，效果等价于在页面头部增加NOCOMPRESS标记，默认根据页面标记处理，此优先级高于页面标记NOCOMPRESS

## X_NOPARSE_FLAG
可选

输出文件中不做解析的内容设置，效果等价于设置NOPARSE标记，默认根据页面标记处理，此优先级高于页面配置标记NOPARSE，允许配置以下值：

| 标记 | 说明 |
| :--: | -- |
| 0    | 根据页面标记处理 |
| 1    | 不处理内联样式，如style标签之间的内容 |
| 2    | 不处理内联脚本，如script标签之间的内容 |
| 3    | 不处理内联样式和脚本，即1和2的情况都不处理 |

## X_NOCORE_STYLE
可选

每个页面样式单独分析处理，不再根据合并策略生成core文件，打开此开关将忽略CORE_LIST_CS中的文件列表配置

## X_NOCORE_SCRIPT
可选

每个页面脚本单独分析处理，不再根据合并策略生成core文件，打开此开关将忽略CORE_LIST_JS中的文件列表配置

## X_RELEASE_MODE
可选

发布模式，可以使用以下三种模式，主要用于控制IGNORE标记的处理，默认为online模式

| 模式    | 说明 |
| --      | -- |
| test    | 测试模式 |
| online  | 线上模式，默认模式 |
| develop | 开发模式 |


## X_AUTO_EXLINK_PATH
可选

发布后使用绝对路径调整外链地址，主要处理页面中同时符合以下条件的外链地址：

* 地址指向的内容为DIR_SOURCE配置下的内容
* html中使用src="[LINK]"或者href="[LINK]"形式引入的地址

## X_AUTO_EXLINK_PREFIX
可选

如果X_AUTO_EXLINK_PATH配置为true则可以通过此配置增加前缀标识来强行替换带该标识的路径，带标识路径规则为[X_AUTO_EXLINK_PREFIX]="[LINK]"，多个前缀标识用|分隔，注：存在单页面多模块调度的系统这里切勿配置data-src
