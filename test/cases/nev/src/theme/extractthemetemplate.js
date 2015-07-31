define([
  '{pro}/theme/themetemplate.js',
  '{pro}/theme/config.js',
  '{pro}/libs/colorbox.js'
  ],
  function(themeTemplate, config, colorbox){
    function extractChartInfo(normalProps, chartFieldStr, commonExtractItems)
    {
      if(normalProps == null)
        return;
      
      var chartInfo = {};

      for(var i = 0; i < commonExtractItems.length; ++i)
      {
        var name = commonExtractItems[i];
        if(normalProps[name])
          chartInfo[name] = normalProps[name];
      }

      var chartField = normalProps[chartFieldStr];
      if(chartField)
      {
        for(var name in chartField)
        {
          chartInfo[name] = chartField[name];
        }
      }

      return chartInfo;
    }

    function extractThemeTemplates(chartFieldStr, propItems, VEItems, preprocessMapItems)
    {
      var themeTemplates = {};
      var themeProps = config.themeProps;

      var defProps = extractChartInfo(themeProps.default.props, chartFieldStr, propItems);
      var VEMap = extractChartInfo(config.visualEncodingMap, chartFieldStr, VEItems);
      var preprocessMap = themeProps.default.preprocessMap[chartFieldStr];
      
      var defThemeTemplate = themeTemplate.generateThemeTemplate(defProps, VEMap, preprocessMap);
      themeTemplates.default = defThemeTemplate;

      for(var name in themeProps)
      {
        if(name == "default")
          continue;

        var nameProps = extractChartInfo(themeProps[name].props, chartFieldStr, propItems);
        var namePreprocessMap = extractChartInfo(themeProps[name].preprocessMap, chartFieldStr, []);

        themeTemplates[name] = defThemeTemplate.clone(nameProps, namePreprocessMap);
      }

      return themeTemplates;   
    }

    return extractThemeTemplates;
  }
);