# 系统构建工具功能说明

工程构建工具作为网易自动化量产工程体系中核心的组成之一，主要用于构建项目结构，自动生成页面、模块、组件等，整合前后端规范生成初始代码，完成项目发布时的资源优化

工程构建工具主要提供以下一些功能及特性支持：

* 支持运行于主流系统之上，如windows，linux，mac os等
* 提供命令行及资源管理器右键和主流编辑器插件支持，如eclipse，sublime等（二期、讨论需要支持的编辑器）
* 生成符合规范的工程结构、初始代码
* 生成符合规范的页面、模块、组件结构及初始代码
* 根据配置信息生成测试数据
* 前端代码、资源优化输出
* 支持NEI平台集成

## 命令行功能

构建工具一期提供命令行输入指令形式的功能支持

### nej

显示工具使用的帮助说明

执行指令

```batch
nej
```

输出提示内容

```
  可选参数
  -v, --version      显示版本信息
  -h, --help         显示帮助信息
  
  可用命令
  new                生成工程、页面、模块、组件及初始代码
  test               运行当前项目下的所有测试用例
  init               初始化发布配置信息
  build              打包发布
```

### nej new

生成工程、页面、模块、组件及初始代码

执行指令

```batch
nej new
```

输出提示内容

```
  可选参数
  -h, --help         显示帮助信息
  -t, --type         自动生成的类型，支持webapp/page/module/widget/mock/test
  -o, --output       输出目录，默认为当前目录
  -i, --nei          NEI平台中项目的ID
  -u, --user         NEI平台用户名，如果用-i指定了项目ID则需提供用户名密码
  -p, --password     NEI平台密码，如果用-i指定了项目ID则需提供用户名密码
```

### nej test

运行当前项目下的所有测试用例

执行指令

```batch
nej test
```

输出提示内容

```
  可选参数
  -h, --help         显示帮助信息
  -i, --input        输入目录，默认为当前目录
```

### nej init

初始化发布配置信息

执行指令

```batch
nej init
```

输出提示内容

```
  可选参数
  -h, --help         显示帮助信息
  -i, --input        输入目录，默认为当前目录
```

### nej build

打包发布

执行指令

```batch
nej build
```

输出提示内容

```
  可选参数
  -h, --help         显示帮助信息
  -c, --config       配置文件路径
```

## 代码优化

### 样式、脚本合并

样式合并，根据可配置策略提供样式合并，可提取core样式
脚本合并，根据可配置策略提供脚本合并，可提取core脚本

### 图片压缩、合并

图片压缩，根据优化规则压缩图片，去除图片冗余信息
图片合并，根据一定策略将图片做spring合并

## 附录

### 工程结构规范

工程结构中我们定义了服务器端模板、前端实现的结构规范，构建工具按照此规范输出

``` 
  deploy
     |- release.conf
  template
     |- common
          |- macro.ftl
          |- config.ftl
     |- index
          |- mock.ftl
          |- index.ftl
  webapp
     |- res
     |- src
         |- css
             |- base.css
             |- page
                 |- index.css
         |- html
         |- javascript
                |- lib
                |- widget
                |- page
                    |- index.js
```








