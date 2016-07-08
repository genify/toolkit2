# 精灵图合并说明

nej build 指令会根据样式中用到的图片和 release.conf 的配置来识别需要精灵图合并的图片，并根据一定的策略进行图片合并，同时调整样式中CSS引入图片的地址和位置

nej build 指令支持两种形式的精灵图片识别

* 图片地址加精灵标记
* 配置文件 release.conf 中配置 OPT_IMAGE_SPRITE 参数

两种方式可单独使用，也可混合使用，精灵图片的输出在没有配置 OPT_IMAGE_SPRITE 参数的情况下输出到 DIR_STATIC 参数配置的目录下

**注： nej build 指令目前只支持png格式的图片做精灵图合并**

## 精灵标记

可以在引用到精灵图片的样式中添加 "sprite!" 标记来标识图片进行精灵图合并，注意这里的关键字 "sprite!" 区分大小写，如下代码所示

```css
.a{background:url(/path/to/a.png?sprite!) no-repeat;}
.b{background-image:url(/path/to/a.png?sprite!) no-repeat;}
```

在精灵标记之后可以指定此图片合并后输出的图片名称，如下代码所示

```css
.a1{background:url(/path/to/a1.png?sprite!a) no-repeat;}
.a2{background-image:url(/path/to/a2.png?sprite!a) no-repeat;}

.b1{background:url(/path/to/b1.png?sprite!b) no-repeat;}
.b2{background-image:url(/path/to/b2.png?sprite!b) no-repeat;}
```

这里 a1.png 和 a2.png 两张图片合并到 a.png 图片输出，b1.png 和 b2.png 两张图片合并到 b.png 图片输出，如果加了精灵标记而未指明输出图片文件名称，则均合并到 sprite.png 图片中

## 精灵配置

此方式通过配置 release.conf 文件中的精灵参数 OPT_IMAGE_SPRITE 来指定样式文件中使用此目录下的图片均做精灵图合并，合并规则以精灵参数 OPT_IMAGE_SPRITE 为根目录，所有第一级子目录合并成目录同名精灵图片输出，比如精灵参数 OPT_IMAGE_SPRITE 的配置如下所示

```
OPT_IMAGE_SPRITE = ./sprite/
```

文件的目录结构如下图所示

```
res
 |- sprite
      |- a
      |  |- a1.png
      |  |- a2.png
      |  |- a3.png
      |
      |- b
      |  |- b1.png
      |  |- b2.png
      |  |- b3.png
      |
      |- c
      |  |- c1.png
      |  |- c2.png 
      |
      |- d1.png
      |- d2.png
```

在样式文件中用到背景图如下所示

```css
.a1{background:url(/res/sprite/a/a1.png) no-repeat;}
.a2{background:url(/res/sprite/a/a2.png) no-repeat;}

.b1{background:url(/res/sprite/b/b1.png) no-repeat;}
.b2{background:url(/res/sprite/b/b2.png) no-repeat;}

.c1{background-image:url(/res/sprite/d1.png);}
.c2{background-image:url(/res/sprite/d2.png);}
```

这里因为样式中没有用到 a3.png、b3.png、c/*.png 因此这些图片不会被合并，所以最终输出的图片为

```
res
 |- sprite
      |- a_84f7637dee4101e4a292fd952ae09e19.png
      |- b_4cf3eaccef35debcbf81aa64623c86c3.png
      |- sprite_c5ee32ccd6639bc03ed7b8648ed93045.png
```

这里 a_xxxx.png 文件是合并了 a1.png 和 a2.png 的精灵图，同理 b_xxx.png 是合并了 b1.png 和 b2.png 的精灵，sprite_xxx.png 是合并了 d1.png 和 d2.png 的精灵图

输出的样式类似如下所示

```css
.a1 {
    background: url(http://b4.bst.126.net/res/sprite/a_84f7637dee4101e4a292fd952ae09e19.png) -0px -0px no-repeat;
}
.a2 {
    background: url(http://b4.bst.126.net/res/sprite/a_84f7637dee4101e4a292fd952ae09e19.png) -1024px -0px no-repeat;
}
.b1 {
    background: url(http://b4.bst.126.net/res/sprite/b_4cf3eaccef35debcbf81aa64623c86c3.png) -0px -0px no-repeat;
}
.b2 {
    background: url(http://b4.bst.126.net/res/sprite/b_4cf3eaccef35debcbf81aa64623c86c3.png) -512px -0px no-repeat;
}
.c1 {
    background-image: url(http://b4.bst.126.net/res/sprite/sprite_c5ee32ccd6639bc03ed7b8648ed93045.png);
    background-position: -0px -0px;
}
.c2 {
    background-image: url(http://b4.bst.126.net/res/sprite/sprite_c5ee32ccd6639bc03ed7b8648ed93045.png);
    background-position: -1024px -0px;
}
```
