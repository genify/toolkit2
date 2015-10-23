# 工具简介

本工具提供了项目前端代码的优化输出和自动化发布功能，本工具的主要特性有：
* 通过配置控制打包输出，降低了对原有系统的侵入性
* 支持使用html注释标记来控制打包输出，增加了打包的灵活性
* 支持非NEJ项目智能识别，并优化输出结果
* 支持采用[NEJ依赖管理系统](https://github.com/genify/nej/blob/master/doc/DEPENDENCY.md)的项目，并分离NEJ依赖系统
* 支持[NEJ平台适配系统](https://github.com/genify/nej/blob/master/doc/PLATFORM.md)，并按平台配置选择性输出内容
* 支持SourceMap输出，增加测试环境可调试性

# 工具使用

## 环境配置
发布工具基于[nodejs](http://nodejs.org/)平台，因此需要使用者先安装nodejs环境，[nodejs](http://nodejs.org/)在各平台下的安装配置请参阅官方说明。

注：打包工具从1.0.0版本之后，需要nodejs在0.12.x以上的版本

## 使用说明
1.  执行以下命令安装打包工具，如果已安装打包工具可忽略此步骤

    ```bash
    npm install nej –g
    ```

    如果已安装过打包工具，则可以使用以下命令更新打包工具至最新版本

    ```bash
    npm update nej –g
    ```
    
2.  执行以下命令初始化打包配置文件，命令后面可输入配置文件输出路径，默认输出在当前目录，此时会在指定目录或者当前目录生成一个release.conf文件用来配置打包选项

    ```bash
    nej init
    ```

    ```bash
    nej init /path/to/deploy/dir/
    ```
    
3.  按照项目的实际情况修改配置文件release.conf，具体参数见手册配置参数章节
4.  执行以下命令打包项目，如果release.conf文件在当前目录也可不指定

    ```bash
    nej build
    ```

    ```bash
    nej build /path/to/release.conf
    ```

## 参考手册

支持指令说明见[wiki](./doc/Manual/COMMAND.md)

打包标记说明见[wiki](./doc/Manual/TAG.md)

配置参数说明见[wiki](./doc/Manual/CONFIG.md)

# 常见问题

## Q1

Q：如何在非NEJ项目中使用打包工具？

A：

1. 使用nej init生成配置文件
2. 修改配置参数，[参数说明](./doc/Manual/CONFIG.md)
3. 使用nej build打包

如果需要指定打完包后的样式/脚本插入位置，则可以在页面中增加打包标记，[标记说明](./doc/Manual/TAG.md)

```html
<html>
  <head>

    ...

    <!-- 在要打包后插入样式的位置加入style标记 -->

    <!-- @style -->
    <link href="/src/css/a.css" .../>

    ...

  </head>
  <body>

    ...

    <!-- 在要打包后插入脚本的位置加入script标记 -->
    <!-- script标记增加nodep为true的配置参数 -->

    <!-- @script {nodep:true} -->
    <script src="/src/js/a.js"></script>
    <script src="/src/js/b.js"></script>
    <script src="/src/js/c.js"></script>
    <script src="/src/js/d.js"></script>
    <script src="/src/js/e.js"></script>

    ...

  </body>
</html>
```


## Q2

Q：服务器模版项目中如何使用打包工具？

以freemarker为例，其他模版类似

原先core脚本配置文件core.js.ftl

```html
<#macro coreJS>
<script src="/src/js/a.js"></script>
<script src="/src/js/b.js"></script>
<script src="/src/js/c.js"></script>
<script src="/src/js/d.js"></script>
<script src="/src/js/e.js"></script>
<script src="/src/js/f.js"></script>
</#macro>
```

原先页面入口模版page.ftl

```html
<@coreJS/>
<script src="/src/js/pg/a.js"></script>
<script src="/src/js/pg/b.js"></script>
<script src="/src/js/pg/c.js"></script>
```

A：采用打包标记配合打包配置方式来实现

在core.js.ftl文件中增加script标记，这样打完包后的core.js会插入在指定位置

```html
<#macro coreJS>

<!-- @script {nodep:true} -->

<script src="/src/js/a.js"></script>
<script src="/src/js/b.js"></script>
<script src="/src/js/c.js"></script>
<script src="/src/js/d.js"></script>
<script src="/src/js/e.js"></script>
<script src="/src/js/f.js"></script>
</#macro>
```

在page.ftl文件中增加script标记，这样打完包后除core.js里的文件外的其他文件会插入在指定位置，注意这里script配置core参数为false禁止二次插入core.js文件，因为coreJS的ftl宏里面已经插入了core.js文件

```html
<@coreJS/>

<!-- @script {nodep:true,core:false} -->

<script src="/src/js/pg/a.js"></script>
<script src="/src/js/pg/b.js"></script>
<script src="/src/js/pg/c.js"></script>
```

在打包配置文件中打开CORE_LIST_JS配置参数，并将core.js.ftl中的js文件列表配置在该参数中

```js
CORE_LIST_JS = ['/src/js/a.js','/src/js/b.js','/src/js/c.js','/src/js/d.js','/src/js/e.js','/src/js/f.js']
```

最后执行打包命令即可


## Q3

Q：如何在使用RequireJS加载器的项目中使用打包工具？

A：可以按照以下步骤对RequireJS项目做打包输出

1. 页面合适位置增加style标记
2. 对页面外链脚本增加noparse标记

    ```html
    <!-- @noparse -->
    <script data-main="scripts/main" src="scripts/require.js"></script>
    <!-- /@noparse -->
    ```

3. 配置打包参数X_NOPARSE_FLAG为2，不对内联脚本做任何解析

    ```js
    X_NOPARSE_FLAG = 2
    ```

4. 使用RequireJS的打包工具r.js对项目进行打包输出
5. 针对输出结果配置打包参数，包括输入输出配置等
6. 执行打包命令对样式和静态资源等内容做优化输出


## Q4

Q：如何在代码中植入调试信息

A：编码时使用DEBUG标识区分开发调试代码片段

```javascript

var a = 'aaaaa';

if (DEBUG){
    
    // 这里的代码片段在打包发布时会自动删除
    console.log('info for test');
    
}

// TODO something

```

# 版本历史

## 1.2.7   (2015-10-23)

* 增加X_AUTO_EXLINK_SCRIPT配置参数支持脚本中静态资源路径解析

## 1.2.6   (2015-10-12)

* 修正标签解析时属性“=”前后带空格的异常
* 调整全局变量配置的优先级

## 1.2.5   (2015-09-23)

* 修改脚本默认混淆级别为0
* noparse标签内的静态资源解析
* 模块版本输出时过滤模板文件

## 1.2.4   (2015-09-18)

* 修正代码中#<uispace>打包异常

## 1.2.3   (2015-09-15)

* 修正样式中部分静态资源路径未调整异常

## 1.2.2   (2015-09-08)

* NEJ模块内联模板不使用WRP_INLINE_SOURCE配置包装
* 输入目录存在包含关系给出警告提示
* 增加FILE_EXCLUDE配置参数支持
* 修正插件解析的html文件被作为输入文件时的异常
* 修正模板内联脚本出现包装结束节点的异常
* 修正标签属性为空的情况下输出异常

## 1.1.8   (2015-08-28)

* 增加页面压缩配置参数支持 CPRS_FLAG/CPRS_KEEP_COMMENT
* 修正标签换行异常

## 1.1.6   (2015-08-26)

* 修正NEJ模板中静态资源加版本号异常
* 修正样式背景图静态志愿

## 1.1.4   (2015-08-11)

* 移除NEI构建工具相关内容

## 1.1.3   (2015-08-04)

* 调整webapp项目输出结构
* 增加puer配置输出

## 1.1.1   (2015-07-31)

* 调整NEJ define.js替换规则
* 增加npmignore文件忽略安装测试用例
* 支持nej export指令
* 支持NEJ模块单独导出

## 1.0.8   (2015-07-30)

* 支持NEJ源码二次包装
* 修正mac下路径多次补全问题
* 修正define.js路径上配置信息读取异常

## 1.0.5   (2015-07-27)

* 支持老版本针对Opera的Patcher
* 修正define依赖列表中带版本号无法识别路径问题
* 样式解析异常时采用字符串匹配方式调整资源路径

## 1.0.3   (2015-07-24)

* 修正函数参数、返回结果识别
* 修正发布过程出现error错误没有退出流程
* 构建工具对接NEI平台接口

## 1.0.0   (2015-07-21)

* 工具整体重构
* 增加HTML标签解析
* 精简/合并配置参数

## 0.5.6   (2015-04-17)

* NAME_SUFFIX支持版本配置标记[VERSION]

## 0.5.4   (2015-03-25)

* 修正对象属性带引号时变量被混淆问题，如{"_abc":"aaa"} 这里_abc不混淆

## 0.5.3   (2015-03-13)

* 支持RegularJS预解析脚本识别配置NEJ_REGULAR

## 0.5.2   (2015-01-19)

* 增加X_KEEP_COMMENT配置参数支持
* regularjs容错
* 回退regularjs版本至 0.2.13
* 调整静态资源解析策略

## 0.4.9   (2014-12-26)

* 增加OBF_DROP_CONSOLE配置参数支持
    
## 0.4.8   (2014-12-16)

* 修正非全平台下打包输出异常

## 0.4.7   (2014-11-16)

* 增加日志级别设置参数X_LOGGER_LEVEL

## 0.4.6   (2014-11-14)

* 修正页面独立解析时I$函数缺失bug
    
## 0.4.5   (2014-11-11)

* 增加nej指令输出帮助信息

## 0.4.4   (2014-10-30)

* MODULE标记不存在模块时的错误日志输出
* 支持X_SCRIPT_WRAPPER配置

## 0.3.9   (2014-10-28)

* 支持智能样式/脚本插入点识别，页面可以不加style/script标记
* 支持json格式配置文件

## 0.3.8   (2014-10-24)

* 支持json!插件形式注入
* 支持regular!插件形式注入
* 支持regular预解析
* 支持define返回类实例
* 修正单页面模块路径使用location.config.root配置
* 修正define依赖执行函数为空时异常

## 0.3.2   (2014-10-17)

* 修正在X_NOPARSE_FLAG忽略内联脚本时不能正确处理VERSION标记的bug

## 0.3.0   (2014-09-18)

* 增加输入子目录过滤配置DIR_SOURCE_SUB/DIR_SOURCE_TP_SUB
* 调整模块VERSION的处理逻辑
    
## 0.2.9   (2014-09-17)

* 增加nej-minimage图片压缩时日志输出

## 0.2.8   (2014-09-17)

* 分离nej-minimage依赖，提示用户使用npm install安装

## 0.2.7   (2014-09-10)

* 修正远程NEJ库地址{platform}解析异常问题

## 0.2.6   (2014-08-28)

* 修正老版本NEJ平台识别参数

## 0.2.5   (2014-08-25)

* 支持非名字空间对象返回结果的注入

## 0.2.4   (2014-08-21)

* 路径支持省略{}标识变量，省略.js后缀，如{pro}a/a.js等价于pro/a/a
* 支持文本资源依赖载入，如text!./a.css，载入css文件
* 支持依赖注入
* 修正base64地址背景图片输出时缺少引号问题
* 增加nej-doc指令
    
## 0.2.3   (2014-08-11)

* 支持nej-patch输出平台适配文件模版

## 0.2.2   (2014-08-05)

* 修正已有name.json时混淆生成的变量名重复
* 支持define依赖注入结果输出

## 0.2.1   (2014-08-05)

* 增加图片压缩配置参数支持 OPT_IMAGE_FLAG/OPT_IMAGE_QUALITY

## 0.2.0   (2014-07-30)

* 修正配置了NAME_SUFFIX后core文件没带后缀问题

## 0.1.9   (2014-07-24)

* 发布错误重新发布

## 0.1.8   (2014-07-24)

* nej-init模版增加release.bat输出
* 增加OBF_COMPATIBLE配置参数支持
* 修正混淆时name.json中配置的变量重复生成问题

## 0.1.7   (2014-07-16)

* 修正带#的静态资源路径解析
* 修正Mac OS安装异常，bin下文件格式转为unix格式
