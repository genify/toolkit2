<@compress>
<!DOCTYPE html>
<html>
  <head>
    <!-- @IGNORE -->
    <#include "/mock/{{mock}}.ftl">
    <!-- /@IGNORE -->

    <#include "/wrap/config.ftl">
    <#include "/wrap/macro.ftl">

    <title>{{name}}</title>
    <meta charset="utf-8"/>

    <@css/>
    <link href="${csRoot}page/{{filename}}.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}"></script>
    <script src="${jsRoot}page/{{filename}}.js"></script>
  </body>
</html>
</@compress>
