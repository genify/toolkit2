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
