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
