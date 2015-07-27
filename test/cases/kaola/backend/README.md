###目录规范
1. **NEJ及NEJ内置模块** 从NEJ的公用资源站点(http://fed.hz.netease.com/git/nej2/src/define.js)直接引用；
1.1 `template/lib/micro.ftl` 中的`htmFoot` 宏已经默认包含了对NEJ define.js 的引用，如ftl文件中已经添加了htmFoot宏，则不需再单独添加。
2. 公用css, js 直接放在backend/src/css, backend/src/js 目录下，第三方组件放到css/widget, js/widget 目录下；
2.1 **css**目录下的`base.css`及`core.css` 在macro.ftl中的htmHead会默认引用,如果ftl中设置了clean = true, 则不引入core.css (base.css必须引入)
3. 新建功能点在css/module, js/module 目录下建立单独文件夹；
4. ftl 放到 backend/template 目录下：
4.1 公用ftl请放到 template/lib目录；
4.2 配置文件放到template/cnf目录；
4.3 假数据（fakedata）放到 template/page/fakedata目录；
4.4 新建功能点ftl，在template下新建目录；
5. 公用的图片及flash资源，放到backend/rsc/img, backend/rsc/swf 下，为单独功能服务的资源，分别在此2目录下新建功能目录；

以下以新建product功能为例：
>+`rsc/img/`**product** / foo.jpg
>+`src/css/`**product** / foo.css, bar.css
>+`src/js/`**product** / foo.js, bar.js
>+`template/page/`**product** / foo.ftl, bar.ftl...
>+`template/page/fakedata/`**product** / foo_fakedata.ftl

###部分文件说明：
template/cnf/direct.ftl ：设定了多个变量，便于常用资源引用：
- `lib_root` : NEJ资源地址
- `pro_root`： js文件根目录（backend/src/js）
- `css_root`： css文件根目录（backend/src/css）
- `js_root`：与`pro_root`相同，为 js文件根目录（backend/src/js）

template/page/index.ftl： MS首页