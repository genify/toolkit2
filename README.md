# 工具简介

本工具提供了项目前端代码的优化输出和自动化发布功能，本工具的主要特性有：
* 采用html注释来标记打包指令，降低了对原有系统的侵入性
* 支持采用[NEJ依赖系统](https://github.com/NetEaseWD/NEJ/blob/master/doc/manual/dependency.docx)的项目，并分离NEJ依赖系统
* 支持[NEJ平台适配策略](https://github.com/NetEaseWD/NEJ/blob/master/doc/manual/platform.docx)，并按平台配置选择性输出内容
* 支持非NEJ项目通过增加打包指令来输出内容
* 支持SourceMap输出，增加测试环境可调试性

# 工具使用

## 环境配置
发布工具基于[nodejs](http://nodejs.org/)平台，因此需要使用者先安装nodejs环境，[nodejs](http://nodejs.org/)在各平台下的安装配置请参阅官方说明。

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
    nej-init
    ```

    ```bash
    nej-init /path/to/deploy/dir/
    ```
    
3.  按照项目的实际情况修改配置文件release.conf，具体参数见手册配置参数章节
4.  执行以下命令打包项目，如果release.conf文件在当前目录也可不指定

    ```bash
    nej-build
    ```

    ```bash
    nej-build /path/to/release.conf
    ```

## 使用手册
工具详细的使用手册见[doc/manual.docx](https://github.com/genify/publish/blob/master/doc/manual.docx)

打包标记说明见[wiki](https://github.com/genify/toolkit/wiki/%E6%89%93%E5%8C%85%E6%A0%87%E8%AE%B0%E8%AF%B4%E6%98%8E)

配置参数说明见[wiki](https://github.com/genify/toolkit/wiki/%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)

# 工具演示

安装完工具后按照以下步骤演示DEMO

1. 执行以下命令生成demo结构

    ```
    nej-demo
    ```
    
    ```
    nej-demo /path/to/demo/
    ```
    
    生成的目录结构类似
    
    ```
    demo
      | -- deploy
      | -- webapp
              | -- res
              | -- src
                    |- css
                    |- html
                    |- javascript
    ```

2. 进入deploy目录

    ```
    cd deploy
    ```

3. 执行以下命令初始化打包配置文件

    ```
    nej-init
    ```
    
    初始生成的配置文件包括
    
    ```
    deploy
      | -- cache.manifest.tpl
      | -- release.conf
    ```

4. 根据实际项目情况修改release.conf和cache.manifest.tpl文件，相关配置信息参阅工具使用手册[doc/manual.docx](https://github.com/genify/publish/blob/master/doc/manual.docx)，本demo生成的配置可直接使用

5. 执行以下命令打包发布demo项目的前端代码

    ```
    nej-build
    ```

# 指令说明

## nej-init

初始化配置文件，可以指定配置文件的输出目录，默认在当前目录输出配置文件

    ```bash
    nej-init
    ```

    ```bash
    nej-init /path/to/deploy/dir/
    ```

## nej-build

根据配置文件打包项目，可以指定配置文件路径，默认在当前目录下寻找release.conf配置文件

    ```bash
    nej-build
    ```

    ```bash
    nej-build /path/to/release.conf
    ```

## nej-patch

根据控件规范生成平台适配文件模版，可以指定适配文件的名称和路径，默认当前路径下的platform/hack

以下指令在当前目录下查找platform目录，没有则新建platform目录，然后在platform目录下生成hack.js和hack.patch.js

    ```bash
    nej-patch
    ```

生成的结果

    ```
    dir
     |-- platform
            | -- hack.js
            | -- hack.patch.js
    ```

以下指令在当前目录下查找platform目录，没有则新建platform目录，然后在platform目录下生成test.js和test.patch.js

    ```bash
    nej-patch test
    ```
    
生成的结果

    ```
    dir
     |-- platform
            | -- test.js
            | -- test.patch.js
    ```

以下指令在/path/to/patch/目录下查找platform目录，没有则新建platform目录，然后在platform目录下生成test.js和test.patch.js

    ```bash
    nej-patch test /path/to/patch/
    ```

生成的结果

    ```
    /path/to/patch/
         |-- platform
                | -- test.js
                | -- test.patch.js
    ```

## nej-demo

生成内置测试案例，可用于实验打包的各项配置及输出功能


# 常见问题解答


## Q1

Q：如何在非NEJ项目中使用打包工具？

A：在页面中增加打包标记

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
