<@compress>
<!DOCTYPE html>
<html>
  <head>
    <!-- @IGNORE -->
    <#include "/mock/{{mock}}.ftl">
    <!-- /@IGNORE -->

    <#include "/common/config.ftl">
    <#include "/common/macro.ftl">

    <title>{{name}}</title>
    <meta charset="utf-8"/>

    <@css/>
    <link href="${csRoot}page/{{filename}}.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>

    <!-- Page Content Here -->

    <script src="${nejRoot}define.js"></script>
    <script src="${jsRoot}page/{{filename}}.js"></script>
  </body>
</html>
</@compress>
