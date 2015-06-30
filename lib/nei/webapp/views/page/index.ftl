<@compress>
<!DOCTYPE html>
<html>
  <head>
    <!-- @IGNORE -->
    <#include "/mock/{{mock}}">
    <!-- /@IGNORE -->

    <#include "/wrap/config.ftl">
    <#include "/wrap/macro.ftl">

    <title>{{title}}</title>
    <meta charset="utf-8"/>
    <meta name="description" content="{{description}}"/>
    <meta name="keywords" content="{{description}}"/>

    <@css/>
    <link href="${csRoot}page/{{filename}}.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script>
        NEJ.define([
            'pro/page/{{filename}}'
        ],function(m){
            m._$$Module._$allocate();
        });
    </script>
  </body>
</html>
</@compress>