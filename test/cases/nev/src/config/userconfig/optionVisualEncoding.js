define(
  [
    "{pro}/libs/colorbox.js",
    "{pro}/config/userconfig/optionMap.js",
    "{pro}/theme/themetemplate.js",
  ],
  function(colorbox, map, convert)
  {
    var kind = colorbox.selector.kind;
    var id = colorbox.selector.id;

    // cartesian chart map
    var vsCommonMap = map.commonMap;
    var vsSeriesMap = map.seriesMap;
    var vsAxisMap = map.axisMap;

    // radar chart map
    var radarOptionMap = map.radarOptionMap;

    var convertCommon = convert.convertObjToVisualEncoding;

    /**
     * 解析background、title、legend中的属性值。
     * @param  commonObj {object}。
     * @method module:theme/userConfig#parseCommon
     * @return {VisualEncoding} 
     */
    function parseCommon(commonObj)
    {      
      var visualEncodings = [];        
      convertCommon(visualEncodings, vsCommonMap, commonObj, null, []);
      return visualEncodings;
    }

    /**
     * 解析Cartesian chart轴中的属性值。
     * @param  axises {array}。
     * @method module:theme/userConfig#parseAxises
     * @return {VisualEncoding} 
     */
    function parseAxises(axises){
      var visualEncodings = [];
      for (var i = 0; i < axises.length; i++) {
        var baseSelector = id(axises[i].id);
        var encodings = [];

        convertCommon(encodings, vsAxisMap, axises[i], null, []);
        for(var vary = 0; vary<encodings.length; ++vary)
        {
          encodings[vary].selector = baseSelector.then(encodings[vary].selector);
        } 
        visualEncodings = visualEncodings.concat(encodings);
      };
      return visualEncodings; 
    }

    /**
     * 解析Cartesian chart series中的属性值。
     * @param  series {array}。
     * @method module:theme/userConfig#parseSeries
     * @return {VisualEncoding} 
     */
    function parseSeries(series){
      var visualEncodings = [];
      for (var i = 0; i < series.length; i++) {
        var baseSelector = id(series[i].id);
        var encodings = [];

        convertCommon(encodings, vsSeriesMap[series[i].type], series[i], null, []);
        for(var vary = 0; vary<encodings.length; ++vary)
        {
          encodings[vary].selector = baseSelector.then(encodings[vary].selector);
        } 
        visualEncodings = visualEncodings.concat(encodings);
      };
      return visualEncodings; 
    }

    /**
     * 解析Cartesian chart option中用户自定义的属性值。
     * @param  option {object}。
     * @method module:theme/userConfig#parseOption
     * @return {VisualEncoding} 
     */
    function parseCartesianOption(option){
      var vsCommon = parseCommon(option);
      var vsXAxis = parseAxises(option.xAxises);
      var vsYAxis = parseAxises(option.yAxises);
      var vsSeries = parseSeries(option.series);
      var visualEncodings = [];
      visualEncodings = visualEncodings.concat(vsCommon)
                            .concat(vsXAxis).concat(vsYAxis).concat(vsSeries);
      return visualEncodings;
    }

    function parsePieOption(option){
      var visualEncodings = [];
      return visualEncodings;
    }

    /**
     * 解析Radar chart series中的属性值。
     * @param  series {array}。
     * @method module:theme/userConfig#parseRadarSeries
     * @return {VisualEncoding} 
     */
    function parseRadarSeries(series, radarSeriesMap){
      var visualEncodings = [];
      for (var i = 0; i < series.length; i++) {
        var encodings = [];
        // radar series中不指定type，默认是sreies的type是 area的。
        if (! series[i].type) {
          series[i].type = 'area';
          convertCommon(encodings, radarSeriesMap[series[i].type], series[i], null, []);
        }
        else{
          convertCommon(encodings, radarSeriesMap[series[i].type], series[i], null, []);
        }
        visualEncodings = visualEncodings.concat(encodings);      
      };
      return visualEncodings;
    }
    /**
     * 解析Radar chart 除了series中的属性值。
     * @param  series {array}。
     * @method module:theme/userConfig#parseRadarSeries
     * @return {VisualEncoding} 
     */
    function parseRadarComponent(radarComponent, radarMap){
      var visualEncodings = [];
      convertCommon(visualEncodings, radarMap, radarComponent, null, []);
      return visualEncodings;
    }
    /**
     * 解析Radar option中的属性值。
     * @param  series {array}。
     * @method module:theme/userConfig#parseRadarSeries
     * @return {VisualEncoding} 
     */
    function parseRadarOption(option){
      var vsSeries = parseRadarSeries(option.series, radarOptionMap.radarSeriesMap);
      var vsGrid = parseRadarComponent(option.grid, radarOptionMap.radarGridMap);
      var vsThetaAxis = parseRadarComponent(option.thetaAxis, radarOptionMap.radarThetaAxisMap);
      var vsRhoAxis = parseRadarComponent(option.rhoAxis, radarOptionMap.radarRhoAxisMap);
      var vsCommon = parseCommon(option);

      var visualEncodings = [];
      visualEncodings = visualEncodings.concat(vsSeries).concat(vsGrid)
                            .concat(vsThetaAxis).concat(vsRhoAxis).concat(vsCommon);
      return visualEncodings;
    }  

    return {
      parseCartesianOption: parseCartesianOption,
      parseRadarOption: parseRadarOption,
      parsePieOption : parsePieOption
    }
  });