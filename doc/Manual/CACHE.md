# 配置说明

此文件主要说明 cache.json 文件中可配置的参数信息，在 nej build 时如果配置了 Web Cache Server 相关的配置（即 WCS_ 为前缀的参数），则此文件自动生成

## api

此参数主要用来配置 Web Cache 服务器用来接收静态资源包的上传接口

```javascript
{
	"api" : "http://a.b.com/upload"
}
```

## domains

在使用 [nej toolkit](https://github.com/NEYouFan/nej-toolkit) 打包时配置的静态资源域名信息，也可以是项目页面中静态资源可能出现的域名，多个域名用逗号分隔

```javascript
{
	"domains" : "b4.bst.126.net,b5.bst.126.net,b1.bst.126.net/pub/,b2.bst.126.net"
}
```

## webRoot

项目的 WEB 服务根目录的绝对路径，这个目录必须同WEB服务器实际使用的目录保持一致

```javascript
{
	"webRoot" : "E:/workspace/project/webapp/"
}
```

## resRoot

需要通过 Web Cache 服务器管理的静态资源搜索路径列表，多个路径用逗号分隔，每个路径必须是绝对路径

```javascript
{
	"resRoot" : "E:/workspace/project/webapp/res/,E:/workspace/project/webapp/pub/s/"
}
```

## fileInclude

需要通过 Web Cache 服务器管理的静态资源匹配规则，可以是字符串的正则表达式，如果是js文件做为配置文件，则可以是正则表达式、匹配函数

字符串的正则表达式
```javascript
{
	"fileInclude" : "\\.(js|css|html)$"
}
```

正则表达式
```javascript
module.exports = {
	fileInclude : /\.(js|css|html)$/i
};
```

匹配函数
```javascript
module.exports = {
	fileInclude : function(file){
		return file.indexOf('/ab/a/d')>=0;
	}
};
```

## fileExclude

不需要通过 Web Cache 服务器管理的静态资源匹配规则，可以是字符串的正则表达式，如果是js文件做为配置文件，则可以是正则表达式、匹配函数

字符串的正则表达式
```javascript
{
	"fileExclude" : "\\.(js|css|html)$"
}
```

正则表达式
```javascript
module.exports = {
	fileExclude : /\.(js|css|html)$/i
};
```

匹配函数
```javascript
module.exports = {
	fileExclude : function(file){
		return file.indexOf('/ab/a/d')>=0;
	}
};
```

注： 如果文件同时满足fileExclude（不需要缓存）和fileInclude（需要缓存），则优先使用fileExclude（不需要缓存）规则进行排除

## extension

Web Cache 资源包上传时其他扩展字段配置，支持参数如下表所示

| 名称 | 描述 |
| :--- | :--- |
| version    | 协议版本，默认为 0.1 |
| platform   | 资源包支持平台，多个平台用“&”分隔，默认 ios&android |
| diffCount  | 本资源包上传之后，服务端与历史版本做diff的个数，最小0，最大10，默认0。如果个数超过服务端所拥有历史资源包个数，则使用实际历史资源包个数。如果不需要增量更新，则不需要传该字段 |
| resVersion | 资源包版本号，如果上传没有带该字段，服务器会为资源包自动生成一个版本号，如果上传时带了该字段，则使用该字段的值 |

```javascript
{
	"extension" : {
	    "version": "0.2.1",
	    "diffCount": 5
	}
}
```