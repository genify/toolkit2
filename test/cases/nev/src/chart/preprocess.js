/*
 * ------------------------------------------
 * 数据预处理工具
 * @version 0.0.2
 * @author wanggaige(hzwanggaige@corp.netease.com)
 * ------------------------------------------
 */
define(['./charthelper.js',
  '{pro}/tools/point.js',
  '{pro}/tools/assert.js',
  '{pro}/tools/utils.js',
  '{pro}/config/chart.js',
  '{pro}/tools/area.js',
  '{pro}/tooltip/chooser/imprecisechooseone.js',
  '{pro}/tooltip/chooser/imprecisechoosemore.js',
  '{pro}/tooltip/chooser/precisetooltip.js',
  '{pro}/scale/ordinal.js',
  './dataFilter.js',
  '{pro}/scale/linear.js'

], function(
  mChartHelper,
  mPoint,
  mAssert,
  mTypeHelper,
  mConfig,
  mArea,
  mImPreciseChooseOne,
  mImPreciseChoosemore,
  mPreciseTooltip,
  mScaleOrdinal,
  mDataFilter,
  mScaleLinear
) {
  var isArray = mTypeHelper.isArray;
  var isObject = mTypeHelper.isObject;
  var cartesianConfig = mConfig.cartesianchart;
  var pieConfig = mConfig.piechart;

  var ID = 0;

  function generateUniqueID() {
    ID += 1;
    return ("ID" + ID);
  }
  // /**
  //  * 轴使用到的数据维度名称的引用数加一
  //  * private
  //  * @method module:chart/preprocess#axisFieldAdd1
  //  * @param info {Object} 轴信息
  //  * @param fieldName {String} 数据维度名称
  //  * @return {Number} 数据维度名称当前的引用数
  //  */
  // function  axisFieldAdd1(info, fieldName)
  // {
  //   info.fields[fieldName] ? ++info.fields[fieldName] : (info.fields[fieldName] = 1);
  //   return info.fields[fieldName];
  // }
  // *
  //  * 轴使用到的数据维度名称的引用数减一
  //  * private
  //  * @method module:chart/preprocess#axisFieldSub1
  //  * @param info {Object} 轴信息
  //  * @param fieldName {String} 数据维度名称
  //  * @return {Number} 数据维度名称当前的引用数

  // function  axisFieldSub1(info,fieldName){
  //   info.fields[fieldName] && info.fields[fieldName]--;
  //   !(info.fields[fieldName]) && delete info.fields[fieldName];;
  //   return info.fields[fieldName];
  // }

  function createAxisScale(axisInfo, range) {
    var scale;
    var max = axisInfo.dataDomainMax;
    var min = axisInfo.dataDomainMin;
    if (axisInfo.isCategory) {
      var ids = []; //表示类目索引
      var category = []; //表示类目数组
      for (var i = 0; i < axisInfo.data.length; i++) {
        ids.push(axisInfo.data[i].id);
        category.push(axisInfo.data[i].data);
      };
      scale = mScaleOrdinal.create().domain(category).ids(ids);
    } else {
      var emptyFlag = true;
      for (var i in axisInfo.fields) {
        emptyFlag = false;
        break;
      }
      if (emptyFlag) {
        scale = mScaleLinear.create().domain([]);
      } else {
        scale = mScaleLinear.create().domain([min, max]);
      }

    }
    //设置tickCount
    if (axisInfo.tickCount != -1) {
      scale.ticksCount(axisInfo.tickCount);
    } else {
      var ticksNum = Math.ceil(range * axisInfo.tickDensity / 100);
      scale.ticksCount(ticksNum);
    }

    axisInfo.scale = scale;
  }

  var preProcess = {

    /**
     * 根据用户提供option.size得到用户设置区域
     * @method module:chart/preprocess.preProcess#preProcessSize
     * @param size {Object} 用户提供的size信息
     * @return {Object} 得到区域
     */
    preProcessSize: function(size) {
      return size ? mArea(size.width, size.height) : mConfig.chart.size;
    },
    /**
     * 根据用户提供option.data得到用户设置区域
     * @method module:chart/preprocess.preProcess#preProcessData
     * @param data {Object} 用户提供的data信息
     * @return {Object} 将用户提供的data信息转化成系统要求的形式
     */
    preProcessData: function(data) {
      var isRelationData = isArray(data);
      mAssert((isRelationData || isObject(data)) || (!data), 'Illegal data type in user option.');
      return mChartHelper.constructData(data ? (isRelationData ? data : mChartHelper.dataConvert(data)) : []);
    },
    /**
     * 根据用户提供option.title构建title信息
     * @method module:chart/preprocess.preProcess#preProcessTitle
     * @param titleOption {Object} 用户提供的title信息
     * @return {Object} 返回构建的title信息
     */
    preProcessTitle: function(titleOption) {
      var defaultTitle = mConfig.title;
      var title;
      if (titleOption)
        title = {
          hidden: titleOption.hidden ? titleOption.hidden : defaultTitle.hidden,
          x: titleOption.x ? titleOption.x : defaultTitle.x,
          y: titleOption.y ? titleOption.y : defaultTitle.y,
          texts:(titleOption.texts && titleOption.texts.contents) ? titleOption.texts.contents : defaultTitle.texts,
          id: titleOption.id ? titleOption.id : generateUniqueID(),
        };
      else
        title = {
          hidden: true,
          id: generateUniqueID(),
          texts: []
        };
      //   titleOption.id = title.id;
      return title;
    },
    /**
     * 根据用户提供option.legend构建legend信息
     * @method module:chart/preprocess.preProcess#preProcessLegend
     * @param legendOption {Object} 用户提供的legend信息
     * @param items  {Array} 图例信息
     * @return {Object} 得到构建的legend信息
     */
    preProcessLegend: function(legendOption, items, chartLegend) {
      var defaultLegend = mConfig.legend;
      var legend;
      if (legendOption)
        legend = {
          hidden: legendOption.hidden ? legendOption.hidden : defaultLegend.hidden,
          x: legendOption.x ? legendOption.x : defaultLegend.x,
          y: legendOption.y ? legendOption.y : defaultLegend.y,
          orient: legendOption.orient ? legendOption.orient : defaultLegend.orient,
          items: items ? items : [],
          id: legendOption.id ? legendOption.id : generateUniqueID()
        };
      else
        legend = {
          hidden: chartLegend ? chartLegend.hidden : defaultLegend.hidden,
          x: defaultLegend.x,
          y: defaultLegend.y,
          orient: defaultLegend.orient,
          items: items ? items : [],
          id: generateUniqueID()
        };
      if (legendOption && legendOption.items) {
        for (var i = 0; i < legendOption.items.length; i++) {
          legend.push(legendOption.items[i]);
        }
      }
      // legendOption.id = legend.id;
      if (legend.hidden)
        legend.items = [];
      return legend;
    },
    /**
     * 根据配置信息生成格式统一的轴信息
     * @method module:chart/preprocess.preProcess#preProcessAxis
     * @param axisOption {Object} 轴配置信息
     * @param isHorizontal {Boolean} 是否是水平轴
     * @param preAxisInfo {Object} 前边一根轴的配置信息,如果是第一根轴,则是undefined
     */
    preProcessAxis: function(axisOption, isHorizontal, preAxisInfo, isFirstAxis) {
      //fields 存儲了 fieldName的引用計數
      var axisInfo = {
        fields: {}
      };
      var position = preAxisInfo ? cartesianConfig.position(isHorizontal, preAxisInfo.position) : (axisOption.position ? axisOption.position : cartesianConfig.position(isHorizontal));
      var caption = {};
      if (axisOption.caption) {
        caption.text = axisOption.caption.text ? axisOption.caption.text : cartesianConfig.caption.text;
        caption.align = axisOption.caption.align ? axisOption.caption.align : cartesianConfig.caption.align;
        caption.orient = isHorizontal ? "horizontal" : axisOption.caption.orient == "horizontal" ? "horizontal" : "vertical";
        caption.rotation = cartesianConfig.caption.rotation(isHorizontal, axisOption.caption.orient);
        caption.spaceToLabel = axisOption.caption.spaceToLabel ? axisOption.caption.spaceToLabel : cartesianConfig.caption.spaceToLabel;
      } else {
        caption.text = cartesianConfig.caption.text;
        caption.align = cartesianConfig.caption.align;
        caption.rotation = cartesianConfig.caption.rotation(isHorizontal);
        caption.spaceToLabel = cartesianConfig.caption.spaceToLabel;
      }

      var labelOption = {adapter:adapter};
      //保存信息
      if (axisOption.label) {
        var adapter = axisOption.label.adapter===undefined? cartesianConfig.axisLabelAdapter: axisOption.label.adapter;
        
        if(axisOption.label.condition!==undefined){labelOption.condition = axisOption.label.condition;};
        if(axisOption.label.adaptLabel!==undefined){labelOption.adaptLabel = axisOption.label.adaptLabel;};
          axisInfo.format = axisOption.label.format ? axisOption.label.format : function(v){return v;};
        }
        else
          axisInfo.format = function(v){return v;};

      axisInfo.labelOption = labelOption;
      axisInfo.isXAxis = isHorizontal;
      axisInfo.offset = axisOption.offset === undefined ? 0 : axisOption.offset;
      axisInfo.id = (axisOption.id !== undefined) ? axisOption.id : generateUniqueID();
      axisOption.id = axisInfo.id;
      axisInfo.hidden = axisOption.hidden === undefined ? cartesianConfig.axisHidden(isHorizontal) : axisOption.hidden;
      axisInfo.domainMin = axisOption.domainMin;
      axisInfo.domainMax = axisOption.domainMax;
      axisInfo.dataDomainMin = axisOption.domainMin;
      axisInfo.dataDomainMax = axisOption.domainMax;
      axisInfo.format = axisOption.format ? axisOption.format : function(v) {
        return v;
      };
      axisInfo.grid = axisOption.grid === undefined ? cartesianConfig.grid(isHorizontal, isFirstAxis) : axisOption.grid;
      axisInfo.caption = caption;
      axisInfo.position = position;
      //设置tick数或者tick密度
      if(axisOption.tick && isArray(axisOption.tick.tickNumber) && axisOption.tick.tickNumber.length >=2){
          var tick = axisOption.tick.tickNumber;
          if(tick[0]=='count' && (typeof(tick[1])==='number') && tick[1]>0 ){
            axisInfo.tickCount = Math.ceil(tick[1]);
            axisInfo.tickDensity = isHorizontal ? cartesianConfig.tickDensityX : cartesianConfig.tickDensityY;
          }
          else if(tick[0]=='density' && (typeof(tick[1]) === 'number' && tick[1]>0)){
            axisInfo.tickCount = -1;
            axisInfo.tickDensity = tick[1];
          }
          else{
            axisInfo.tickCount = -1;
            axisInfo.tickDensity = isHorizontal ? cartesianConfig.tickDensityX : cartesianConfig.tickDensityY;
          }
        }
        //否则，用户tick格式不符合要求，那么就需要使用默认配置
        else{
          axisInfo.tickCount = -1;
          //axisInfo.tickDensity = cartesianConfig.tickDensity;
          axisInfo.tickDensity = isHorizontal ? cartesianConfig.tickDensityX : cartesianConfig.tickDensityY;
        }
        //scale
        //缓存住从factory中取出的visualEncoding
        axisInfo.defaultInteractEncoding = mChartHelper.axisIE;
  
        return axisInfo;
      },
      /**
       * 构建轴信息
       * @method module:chart/preprocess.preProcess#preProcessAxises
       * @param axisOption {Object} 轴配置信息
       * @param isHorizontal {Boolean} 是否是水平轴
       * @param preAxisInfo {Object} 前边一根轴的配置信息,如果是第一根轴,则是undefined
       * @return {Array} 返回轴信息
       */
      preProcessAxises:function(axisesOption, isHorizontal)
      {
        mAssert(typeof(axisesOption) === "object", "axis info must provide.");
        var axisInfo, preAxisInfo, axisInfos = [];
        if(!isArray(axisesOption))
        { //单根轴
          axisInfo = this.preProcessAxis(axisesOption,isHorizontal, preAxisInfo,true);
          axisInfos.push(axisInfo);
        }
        else
        {               //多根轴
          for(var i = 0; i < axisesOption.length; i++)
          {
            axisInfo = this.preProcessAxis(axisesOption[i],isHorizontal, preAxisInfo,!i);
            preAxisInfo = axisInfo;
            axisInfos.push(axisInfo);
          };
        }

      return axisInfos;
    },
    /**
     * 根据id获取轴信息
     * @method module:chart/preprocess.preProcess#getAxisInfoById
     * @param {Array} ais 轴信息数组
     * @param {String | Number} id 轴的id或者是索引
     * @return 轴信息
     */
    getAxisInfoById: function(ais, id) {
      //根据id(string || Number)获取轴的信息
      var ai;
      if (typeof(id) === 'number' && id >= 0 && id < ais.length) {
        ai = ais[id];
      } else if (typeof(id) === 'string') {
        for (var i = 0; i < ais.length; i++) {
          if (ais[i].id === id) {
            ai = ais[i];
          }
        };
      }
      mAssert(ai, 'can not find axis: ' + id);
      return ai;
    },
    /**
     * 根据field获取数据信息
     * @method module:chart/preprocess.preProcess#getDataArrayByField
     * @param {String} fieldName field信息
     * @param {Array} data  数据信息
     * @return 返回field对应的data数组
     */
    getDataArrayByField: function(fieldName, data) {
      var result = [];
      if (data[0] === undefined) return result;
      //data[0][fieldName] may be zero
      //mAssert(data[0][fieldName]!== undefined, fieldName+" in data don't exist.");
      for (var i = 0; i < data.length; i++) {
        result.push({});
        result[i].id = data[i].id;
        result[i].data = data[i].data[fieldName];
        //result.push(data[i][fieldName]);
      };
      return result;
    },
    getMaxMinOfData: function(data) {
      var result = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].data !== null && data[i].data !== undefined) {
          result.push(data[i].data);
        }
      };
      var max = Math.max.apply(null, result);
      var min = Math.min.apply(null, result);
      return {
        max: max,
        min: min
      };
    },
    getMaxMinOfDataInHash: function(data) {
      var result = [];
      for (var i in data) {
        if (data[i] !== null && data[i] !== undefined) {
          result.push(data[i]);
        }
      };
      var max = Math.max.apply(null, result);
      var min = Math.min.apply(null, result);
      return {
        max: max,
        min: min
      };
    },
    /**
     * 构建单个series信息
     * @method module:chart/preprocess#calculateSeriesInfo
     * @param seriesinfo {Object} 用户配置的单个series信息
     * @return padding {Number} 用户配置的同一个tick处多个bar之间的间距百分比
     */
    calculateSeriesInfo: function(legendOption, serieOption, padding, graphInfo, index, data) {
      var info = {};
      var newData;
      info.seriesIndex = index;
      info.type = serieOption.type;
      if (info.type === 'bar') {
        info.stackBar = serieOption.stackBar === undefined ? cartesianConfig.stackBar : serieOption.stackBar;
      }
      info.id = (serieOption.id !== undefined) ? serieOption.id : generateUniqueID();
      serieOption.id = info.id;

      // label开关,hidden为false时，则开关打开，label为true。
      info.label = (serieOption.componentStyle && serieOption.componentStyle.text && (!serieOption.componentStyle.text.hidden))? true: false;

      if (info.type === 'area' || info.type === 'line') {
        info.nullType = serieOption.nullType === undefined ? "broken" : serieOption.nullType;
      }
      var compose = {};
      if (info.type === 'bar' || info.type === 'area') {
        if (serieOption.compose) {
          if (serieOption.compose[0] === 'stack') {
            compose.type = 'stack';
            compose.groupId = serieOption.compose[1] === undefined ? generateUniqueID() : serieOption.compose[1];
          } else if (serieOption.compose[0] === 'overlap') {
            compose.type = 'overlap';
            compose.groupId = serieOption.compose[1] === undefined ? generateUniqueID() : serieOption.compose[1];
          } else {
            compose.type = null;
            compose.groupId = serieOption.compose[1] === undefined ? generateUniqueID() : serieOption.compose[1];
          }
        } else {
          compose.type = null;
          compose.groupId = generateUniqueID();
        };
      } else {
        compose.type = null;
        compose.groupId = generateUniqueID();
      }
      info.compose = compose;
      var predicateArray = [];
      var filtedData;
      var sFilter = serieOption.filter;
      if (sFilter) {
        for (var ii = 0; ii < sFilter.length; ii++) {
          predicateArray.push(sFilter[ii]);
        }
        filtedData = mDataFilter.globalFilter(data, predicateArray);
      } else {
        filtedData = data;
      }

      info.padding = padding === undefined ? cartesianConfig.padding : padding;
      info.xField = serieOption.xField;
      info.yField = serieOption.yField;
      var xID = serieOption.xAxis ? serieOption.xAxis : 0;
      var yID = serieOption.yAxis ? serieOption.yAxis : 0;
      info.xAxisInfo = this.getAxisInfoById(graphInfo.xAxisesInfos, xID);
      info.yAxisInfo = this.getAxisInfoById(graphInfo.yAxisesInfos, yID);
      info.xID = info.xAxisInfo.id;
      info.yID = info.yAxisInfo.id;
      info.hidden = serieOption.hidden ? serieOption.hidden : false;
      if (!info.hidden) {
        if (typeof(info.xField) === "string") {
          this.axisFieldAdd1(info.xAxisInfo, info.xField, info.id);
        }

        if (typeof(info.yField) === "string") {
          this.axisFieldAdd1(info.yAxisInfo, info.yField, info.id);
        }
      }

      info.smooth = serieOption.smooth ? serieOption.smooth : false;

      // if (serieOption.hidden) {
      //   mDataFilter.setSwitchState(info.id, true, info.predicateArray);
      // } else {
      //   mDataFilter.setSwitchState(info.id, false, info.predicateArray);
      // }
      // newData = mDataFilter.filter(data, info.predicateArray);
      var newData, predicateArray;
      if (legendOption.category !== undefined) {
        predicateArray = this.findSameIdInRules(info.id, legendOption);
        newData = mDataFilter.filter(filtedData, predicateArray);
      } else {
        newData = filtedData;
      }
      if (serieOption.size !== undefined) {
        if (typeof(serieOption.size) === "string") {
          info.size = this.getDataArrayByField(serieOption.size, newData);
        }
      }


      //   info.size = serieOption.size;
      var yDataMax = Math.max.apply(null, this.getDataArrayByField(info.yField, newData));
      var yDataMin = Math.min.apply(null, this.getDataArrayByField(info.yField, newData));
      var xDataMax = Math.max.apply(null, this.getDataArrayByField(info.xField, newData));
      var xDataMin = Math.min.apply(null, this.getDataArrayByField(info.xField, newData));



      //缓存住从factory中取出的visualEncoding
      mAssert(mChartHelper.creatorMap[serieOption.type], 'unsupported chart type: ' + info.type);
      //info.defaultVisualEncoding = mChartHelper.creatorMap[serieOption.type].defaultVisualEncoding(info);
      info.defaultInteractEncoding = mChartHelper.creatorMap[serieOption.type].defaultInteractEncoding;
      info.name = serieOption.name ? serieOption.name : "series" + index;
      info.monotonicAxis = this.isMonotonic(info, newData);
      info.monotonicAxis = this.isMonotonic(info, newData);
      //需要保存主轴的一个最大并集
      info.monotonicDataArray = this.getDataArrayByField((info.monotonicAxis !== "Y" ? info.xField : info.yField), data);

      var xData = this.getDataArrayByField(info.xField, newData);
      var yData = this.getDataArrayByField(info.yField, newData);
      var dataResult = this.filterData(xData, yData, info.monotonicAxis);

      info.xData = dataResult.xData;
      info.yData = dataResult.yData;


      if (info.type === "area" || info.type === "line") {
        var validData = this.__calcuNullPointsInfo(info.xData, info.yData);
        info.xDataWithoutNull = validData[0];
        info.yDataWithoutNull = validData[1];
        info.brokenLinesIndex = validData[2];
        info.normalLinesIndex = validData[3];

        info.validPointsIndex = validData[4];

      }

      //info.scaleIndex = dataResult.scaleIndex;
      var xExtreme = this.getMaxMinOfData(info.xData);
      var yExtreme = this.getMaxMinOfData(info.yData);

      info.xDataMin = isNaN(xExtreme.min) ? 0 : xExtreme.min;
      info.xDataMax = isNaN(xExtreme.max) ? 1 : xExtreme.max;
      info.yDataMin = isNaN(yExtreme.min) ? 0 : yExtreme.min;
      info.yDataMax = isNaN(yExtreme.max) ? 1 : yExtreme.max;


      return info;
    },

    __calcuNullPointsInfo: function(xData, yData) {
      //确定null值的个数以及分布情况
      var validPointsIndex = [];
      var validPointsId = [];
      var validDataPoints = [];
      var newXData = [];
      var newYData = [];
      for (var i = 0; i < xData.length; i++) {
        if (!(xData[i].data == null || yData[i].data == null)) {
          validPointsId.push(xData[i].id);
          validPointsIndex.push(i);
          newXData.push(xData[i]);
          newYData.push(yData[i]);
        }
      }
      //统计折断区的段数及位置
      var brokenLinesIndex = [];
      var normalLinesIndex = [];
      var preIndex = validPointsIndex[0];
      for (var i = 1; i < validPointsIndex.length; i++) {
        if ((preIndex + 1) === validPointsIndex[i]) {
          normalLinesIndex.push(preIndex);
        }
        preIndex = validPointsIndex[i];
      }
      // console.log("broken",brokenLinesIndex);
      // console.log("normal",normalLinesIndex);
      //  console.log(validPointsIndex)
      return [newXData, newYData, brokenLinesIndex, normalLinesIndex, validPointsIndex];


    },
    /**
     * 根据自定义轴的信息筛选数据，先去除定义域轴的undefined和null的情况,然后根据值域轴的undefined去除数据，同时构造scale的domain的索引数组
     * 这里是为了给类目轴通过索引找到值域像素做准备
     * @method module:chart/preprocess#filterData
     * @param xData {Array} 
     * @param yData {Array} 
     * @param monotonicAxis {String} 判断定义域轴 
     * @return  {Number}
     * @Example
       month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
       sale : [100,undefined,70,90,60,120,180,100,220,250,null,100],
       这里输出的scaleIndex=[0,2,3,4,5,6,7,8,9,10,11]
     */
    filterData: function(xData, yData, monotonicAxis) {
      var xResult = [],
        yResult = [];
      //筛选去定义域轴中值为undefined和null的情况，值域轴值为undefined的情况
      if (monotonicAxis === "X") {
        for (var i = 0; i < xData.length; i++) {
          if (xData[i].data === null || xData[i].data === undefined || yData[i].data === undefined)
            continue;
          //  console.log(xData[i].data);
          xResult.push(xData[i]);
          yResult.push(yData[i]);
        };
      } else if (monotonicAxis === "Y") {
        for (var i = 0; i < yData.length; i++) {
          if (yData[i].data === null || yData[i].data === undefined || xData[i].data === undefined)
            continue;
          xResult.push(xData[i]);
          yResult.push(yData[i]);
        };
      } else {
        for (var i = 0; i < yData.length; i++) {
          if (yData[i].data === undefined || xData[i].data === undefined || yData[i].data === null || xData[i].data === null)
            continue;
          xResult.push(xData[i]);
          yResult.push(yData[i]);
        };
      }
      return {
        xData: xResult,
        yData: yResult
      };


    },
    isMonotonic: function(seriesInfo, data) {
      var monotonicAxis;
      // var xData     = seriesInfo.xData;
      //  var yData     = seriesInfo.yData;
      var xData = this.getDataArrayByField(seriesInfo.xField, data);
      var yData = this.getDataArrayByField(seriesInfo.yField, data);
      // console.log('xData:', xData);
      // console.log('yData:', yData);
      var isXAxisMonotonic = this.isCategoryField(seriesInfo.xField, data);
      if (isXAxisMonotonic) {
        monotonicAxis = "X";
      } else {
        var isYAxisMonotonic = this.isCategoryField(seriesInfo.yField, data);
        if (isYAxisMonotonic) {
          monotonicAxis = "Y";
        } else {
          isXAxisMonotonic = this.__isMonotonic(xData);
          if (isXAxisMonotonic) {
            monotonicAxis = "X";
          } else {
            isYAxisMonotonic = this.__isMonotonic(yData);
            if (isYAxisMonotonic) {
              monotonicAxis = "Y";
            } else {
              monotonicAxis = "none";
            }
          }
        }
      }
      return monotonicAxis;
    },
    //两个轴都不是类目轴的时候需要判断类目轴的情况，这里要考虑数组中值为null的情况
    __isMonotonic: function(data) {
      if (typeof(data) === "number" || data.length === 1) {
        return true;
      }
      if (data.length === 0) {
        return false
      }
      var result = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].data !== null && data[i].data !== undefined) {
          result.push(data[i].data);
        }
      };
      var isIncrease = result[1] > result[0];
      if (isIncrease) {
        for (var i = 1; i < result.length - 1; i++) {
          if (result[i] < result[i + 1]) {
            continue;
          } else {
            return false;
          }
        }
      } else {
        for (var i = 1; i < data.length - 1; i++) {
          if (result[i] > result[i + 1]) {
            continue;
          } else {
            return false;
          }
        }
      }
      return true;

    },
    /**
     * 从series配置信息中一致化bar图的padding
     * @method module:chart/preprocess#getUniformPadding
     * @param seriesOption {Object} series配置信息
     * @return padding {Number}
     */
    getUniformPadding: function(seriesInfos) {
      var padding;
      for (var i = 0; i < seriesInfos.length; i++) {
        var seriesInfo = seriesInfos[i];
        if (seriesInfo.type != 'bar' || seriesInfo.padding === undefined)
          continue;
        else {
          if (padding === undefined)
            padding = seriesInfo.padding;
          else
            padding = Math.min(padding, seriesInfo.padding);
        }
      };
      return padding;
    },
    preProcessSeriesInfos: function(legendOption, seriesOption, graphInfo, data) {
      var sortedOption = [];
      var areaOption = [];
      var seriesInfos = [];
      var padding = this.getUniformPadding(seriesOption);
      var seriesObj = {};
      var barseries = [];
      for (var i = 0; i < seriesOption.length; i++) { //计算seriesInfo信息
        var info = this.calculateSeriesInfo(legendOption, seriesOption[i], padding, graphInfo, i, data);
        seriesInfos.push(info);
      };

      for (var i = 0; i < seriesInfos.length; i++) { //按照groupId分组
        var seriesInfo = seriesInfos[i];
        if (seriesInfo.hidden) continue;
        var groupId = seriesInfo.compose.groupId;
        if (!seriesObj[groupId]) {
          seriesObj[groupId] = [];
        }
        seriesObj[groupId].push(seriesInfo);
      };

      //计算累加值
      //由于异构的数据，可能同一堆栈的数据长度可能不一致
      function getMaxLen(arr, isX) {
        var len = -Infinity;
        var indexOfMax = 0;
        for (var i = 0; i < arr.length; i++) {
          if (isX) {
            if (len < arr[i].yData.length) {
              indexOfMax = i;
              len = arr[i].yData.length;
            }
          } else {
            if (len < arr[i].xData.length) {
              indexOfMax = i;
              len = arr[i].xData.length;
            }
          }
        };
        return indexOfMax;
      };
      for (var groupId in seriesObj) {
        var seriesArray = seriesObj[groupId];
        var dataMinValue = Infinity;
        var dataMaxValue = -Infinity;
        for (var j = 0; j < seriesArray.length; j++) {
          if (seriesArray[j].xData.length == 0 || seriesArray[j].yData.length == 0) {
            continue;
          } else {
            var isX = seriesArray[j].monotonicAxis !== "Y";
          }
        }

        var indexOfMax = getMaxLen(seriesArray, isX);
        var accValue = {};
        var maxLenSeriesData = isX ? seriesArray[indexOfMax].yData : seriesArray[indexOfMax].xData;
        for (var temp = 0; temp < maxLenSeriesData.length; temp++) {
          accValue[maxLenSeriesData[temp].id] = null;
        }
        for (var i = 0; i < seriesArray.length; i++) {
          var seriesInfo = seriesArray[i];
          var bottomDataArray = new Array(maxLenSeriesData.length);
          var topDataArray = new Array(maxLenSeriesData.length);
          var dataArray = isX ? seriesInfo.yData : seriesInfo.xData;
          for (var j = 0; j < dataArray.length; j++) {
            bottomDataArray[j] = {
              data: accValue[dataArray[j].id],
              id: dataArray[j].id
            };
            //    if( dataArray[j].data !== null ){
            accValue[dataArray[j].id] = accValue[dataArray[j].id] + dataArray[j].data;
            //   }
            topDataArray[j] = {
              data: accValue[dataArray[j].id],
              id: dataArray[j].id
            };
          }
          var compareMinMax = this.getMaxMinOfDataInHash(accValue);
          // console.log(accValue);
          dataMinValue = Math.min(dataMinValue, compareMinMax.min);
          dataMaxValue = Math.max(dataMaxValue, compareMinMax.max);
          // console.log('===========',dataMaxValue);
          seriesInfo.bottomDataArray = bottomDataArray;
          seriesInfo.topDataArray = topDataArray;
        }

        if (seriesArray.length > 1)
          seriesArray.map(function(seriesInfo) {
            if (isX) {
              seriesInfo.yDataMax = dataMaxValue
              seriesInfo.yDataMin = dataMinValue;
            } else {
              seriesInfo.xDataMax = dataMaxValue;
              seriesInfo.xDataMin = dataMinValue;
            }
            seriesInfo.accValue = accValue;
          })
      }

      return seriesInfos;
    },


    extremeValueOfArray: function(array) {
      var max = -Infinity,
        min = Infinity;
      if (typeof(array) === "number" || typeof(array) === "string") {
        array = [array];
      }
      if (isArray(array) && typeof(array[0]) === "number") {
        for (var i = 0; i < array.length; i++) {
          max = max < array[i] ? array[i] : max;
          min = min > array[i] ? array[i] : min;
        }
      } else if (isArray(array) && typeof(array[0]) === "string") {
        min = 0;
        max = 1;
      } else {
        //throw "illegal input type";
        return [0, 1];
      }
      return [min, max];
    },

    preProcessCartesian: function(option, data) {
      var info = {};
        // info.data = this.preProcessData(option.data);
      //var data = this.preProcessData(option.data);

      info.xAxisesInfos = this.preProcessAxises(option.xAxises, true); //创建x轴信息
      info.yAxisesInfos = this.preProcessAxises(option.yAxises, false); //创建y轴信息

      var seriesOption = mChartHelper.getArrayValue(option.series, "series");

      option.legend = option.legend || {};

      info.seriesInfos = this.preProcessSeriesInfos(option.legend, seriesOption, info, data);

      var tooltipKlass;
      if (info.seriesInfos.some(function(seriesInfo) {
          return seriesInfo.type == "scatter";
        })) {
        tooltipKlass = mPreciseTooltip;
      } else
        tooltipKlass = mImPreciseChooseOne;

      info.tooltip = this.preProcessTooltip(option.tooltip, tooltipKlass);
      info.area = this.preProcessSize(option.size);

      //todo::: axisInfo 中应该建立好 scale，不该拖到场景构建时

      this.cartesianInformationCheck(info, data);

      for (var i = 0; i < info.xAxisesInfos.length; ++i) {
        createAxisScale(info.xAxisesInfos[i], info.area.width);
      }
      for (i = 0; i < info.yAxisesInfos.length; ++i) {
        createAxisScale(info.yAxisesInfos[i], info.area.height);
      }


      return info
      //this._t.__buildSeriesInfos(this._chartHelper().getArrayValue(option.series,"series"),info.seriesInfos);      
    },

    /**
     * 对tooltip的信息进行预处理。
     * @public
     * @method module:chart/preprocess.Preprocess#preProcessTooltip
     * @param {Object} tooltipOption 用户配置的tooltip字段
     * @param {Class} trigger tooltip的触发类型
     * @return {Object} tooltipInfo 经过处理的tooltip信息
     * @example
     * tooltip允许用户通过自定义的format函数来制定tooltip的提示框内容，以及交互效果,format示例：
     * var format= function(resultArray,newNodes,oldNodes){               
     *    for(i = 0, length = oldNodes.length; i< length; i++) {
     *      var actor = oldNodes[i].exact;
     *        actor.setshadowColor(undefined);
     *        actor.setshadowBlur(0);
     *      }
     *     for(i = 0, length = newNodes.length; i< length; i++) {
     *       var actor = newNodes[i].exact;
     *       actor.setshadowColor({r: 100, g: 100, b: 100});
     *       actor.setshadowBlur(20);
     *     }
     *      var tooltipContent=[];
     *      var result=[];
     *      resultArray.map(function(resultA){
     *        var xContent=resultA.xFieldName+": "+resultA.xValue;
     *        var yContent= (resultA.seriesName? resultA.seriesName: resultA.yFieldName) +": "+resultA.yValue;
     *        result.push(xContent);
     *        result.push(yContent);
     *      })
     *      tooltipContent = tooltipContent.concat(result); 
     *      return tooltipContent;
     *    }
     */
    preProcessTooltip: function(tooltipOption, tooltipKlass) {
      var defaultTooltip = mConfig.tooltip;
      var tooltip;
      if (tooltipOption) {
        tooltip = {
          hidden: tooltipOption.hidden !== undefined ? tooltipOption.hidden : defaultTooltip.hidden,
          format: tooltipOption.format,
          tooltipKlass: tooltipKlass
        }
      } else
        tooltip = {
          hidden: defaultTooltip.hidden,
          format: defaultTooltip.format,
          tooltipKlass: tooltipKlass
        }

      return tooltip;
    },
    /**
     * 根据数据维度属性以及用户配置计算轴的定义域
     * @method module:chart/preprocess#calculateAxisDataDomain
     * @param  info {Object}  轴信息
     * @param  seriesInfos{Array} series信息
     * @param {Array} data 用户配置的data数据
     */
    calculateAxisDataDomain: function(info, seriesInfos, data) {
      info.dataDomainMax = -Infinity;
      info.dataDomainMin = Infinity;
      var dmax = -Infinity;
      var dmin = Infinity;
      for (var fn in info.fields) {
        for (var i = 0; i < info.fields[fn].length; i++) {
          var id = info.fields[fn][i];
          var isX = info.isXAxis;
          var seriesInfo = this.getAxisInfoById(seriesInfos, id);

          if (seriesInfo.hidden) continue;
          dmax = Math.max(dmax, (isX ? seriesInfo.xDataMax : seriesInfo.yDataMax));
          dmin = Math.min(dmin, (isX ? seriesInfo.xDataMin : seriesInfo.yDataMin));
        }
        if (info.domainMax === undefined) {
          info.dataDomainMax = (dmax > info.dataDomainMax) ? dmax : info.dataDomainMax;
        } else {
          info.dataDomainMax = info.domainMax;
        }
        if (info.domainMin === undefined) {
          info.dataDomainMin = (dmin < info.dataDomainMin) ? dmin : info.dataDomainMin;
        } else {
          info.dataDomainMin = info.domainMin;
        }
      }
    },
    /**
     * 根据数据维度名称判断数据是否是类目。
     * @method module:chart/preprocess#isCategoryField
     * @param {String} fieldName 数据维度名称
     * @param {Array} data 用户配置的data数据
     * @return {Boolean} true:类目;false:数值
     */
    isCategoryField: function(fieldName, data) {
      if (data[0] === undefined) return undefined;
      if (!data[0]) {
        return false;
      }
      //由于数据异构，所以可能存在undefined和null的字段
      var isString = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i]["data"][fieldName] === undefined)
          continue;
        if (data[i]["data"][fieldName] === null)
          continue;
        if (typeof(data[i]["data"][fieldName]) === "string") {
          isString = true;
          break;
        }
      };
      return isString;
    },
    axisFieldAdd1: function(info, fieldName, id) {
      if (!info.fields[fieldName]) {
        info.fields[fieldName] = [];
      }
      info.fields[fieldName].push(id);
      //   info.fields[fieldName] ? ++info.fields[fieldName] : (info.fields[fieldName] = 1);
      return info.fields[fieldName];
    },

    axisFieldSub1: function(info, fieldName, id) {
      var seriesIdArray = info.fields[fieldName];
      if (seriesIdArray) {
        var index = seriesIdArray.indexOf(id);
        var seriesIdLength = seriesIdArray.length;
        seriesIdArray = seriesIdArray.slice(0, index).concat(seriesIdArray.slice(index + 1, seriesIdLength));
      }
      if (seriesIdArray.length == 0) {
        delete info.fields[fieldName];
      }
      // console.log("--",info.fields[fieldName])
      return info.fields[fieldName];
    },
    /**
     * 轴信息合法性检查
     * @method module:chart/preprocess#axisInfoCheck
     * @param  axisInfo {Object}  轴信息
     * @param  uuids {Object}  已使用id
     * @param  axisInfo {Number | String}  轴索引
     * @param  data {Array} 用户配置的data数据
     */
    axisInfoCheck: function(axisInfo, seriesInfos, uuids, id, data) {
      var info = axisInfo;
      //id唯一性检查
      if (info.id) {
        mAssert(!uuids[info.id], "axis " + id + " id has exist - - - > " + info.id);
        uuids[info.id] = true;
      }
      var isX = info.isXAxis;
      //field是否存在,且类目轴不允许指定多个field
      var fieldNum = 0;
      var isCategory;
      for (var fn in info.fields) {
        if (fieldNum > 0) {
          mAssert(!this.isCategoryField(fn, data), (isX ? "XAxis---> " : "YAxis---> ") + (isCategory ? "Categoty axis cannot have multi-fields --->" + fn : "Cannot merge categoty field with number axis --->" + fn));
        } else {
          isCategory = this.isCategoryField(fn, data);
        }
        fieldNum++;
      }
      info.domainMin && mAssert(typeof(info.domainMin) === "number", "domainMin must be number.");
      info.domainMax && mAssert(typeof(info.domainMax) === "number", "domainMax must be number.");
      if (isCategory && info.scale && info.isCategory != isCategory) {
        info.scale = mScaleOrdinal.create();
      }
      //为轴信息添加类目信息
      info.isCategory = isCategory;
      if (isCategory) {
        for (var field in info.fields) {
          var cateData = this.getDataArrayByField(field, data);
          info.data = [];
          for (var j = 0; j < cateData.length; j++) {
            if (cateData[j].data === undefined) continue;
            if (cateData[j].data === null) continue;
            info.data.push(cateData[j]);
          };
        }
      }
      //为数值轴添加domain信息
      if (!isCategory && !(info.domainMax !== undefined && info.domainMin !== undefined)) {
        this.calculateAxisDataDomain(info, seriesInfos, data);
      }
    },
    /**
     * axis中的offset的id和value的合法性检查
     * @method module:chart/preprocess#checkOffsetInfo
     * @param  graphInfo {Array}  graph信息
     * id可能是string或者索引值，这两种情况都需要检查
     * value 为string值，要检查对应id轴是否出现对应类目
     */
    checkOffsetInfo: function(data, axisesInfos1, axisesInfos2) {
      var lengthX = axisesInfos1.length;
      //var xAxisesInfos = graphInfo.xAxisesInfos;
      var lengthY = axisesInfos2.length;
      //var yAxisesInfos = graphInfo.yAxisesInfos;

      for (var i = 0; i < lengthX; i++) {
        var axisInfo = axisesInfos1[i];
        var offset = axisInfo.offset;
        var index;
        if (offset === 0)
          continue;
        if (typeof(offset) == 'object') {
          //检查id
          if (typeof(offset.which) === 'string') {
            //看y轴是否存在对应id
            var find = false;
            for (var j = 0; j < lengthY; j++) {
              if (axisesInfos2[j].offset.which === offset.which) {
                find = true;
                index = j;
                break;
              }
            };
            mAssert(find, 'the which ' + offset.which + " doesn't exist in axises.");
          }
          if (typeof(offset.which) === 'number') {
            mAssert(offset.which < lengthY, 'the which ' + offset.which + " does'n exist in axises.");
            //offsetAxis = yAxisesInfos[offset.id];
            //console.log(graphInfo.yAxisesInfos[offset.id]);
            index = offset.which;
          }

          //检查value
          if (typeof(offset.value) === 'string') {
            //var data = offsetAxis.data;
            var find = false;
            var fieldsEmpty = true;
            for (var x in axisesInfos2[index].fields) {
              var dataset = this.getDataArrayByField(x, data);
              //console.log(dataset);
              fieldsEmpty = false;
              for (var k = 0; k < dataset.length; k++) {
                if (dataset[k].data == offset.value) {
                  find = true;
                  break;
                }
              };
              if (find)
                break;
            }
            if (fieldsEmpty) return;
            mAssert(find, "can't find the value: " + offset.value + " of the id:" + offset.which);
          }
        }
      };
    },
    axisesInfoCheck: function(graphInfo, uuids, data) {
      var lengthX = graphInfo.xAxisesInfos.length;
      var lengthY = graphInfo.yAxisesInfos.length;
      var seriesInfos = graphInfo.seriesInfos;
      for (var i = 0; i < lengthX; i++) {
        var axisInfo = graphInfo.xAxisesInfos[i];
        this.axisInfoCheck(axisInfo, seriesInfos, uuids, axisInfo.id || i, data);
      };
      for (var i = 0; i < lengthY; i++) {
        var axisInfo = graphInfo.yAxisesInfos[i];
        this.axisInfoCheck(axisInfo, seriesInfos, uuids, axisInfo.id || i, data);
      };
      //检查x轴的offset
      this.checkOffsetInfo(data, graphInfo.xAxisesInfos, graphInfo.yAxisesInfos);
      //检查y轴的offset
      this.checkOffsetInfo(data, graphInfo.yAxisesInfos, graphInfo.xAxisesInfos);

    },
    /**
     * 所有series信息合法性检查
     * @method module:chart/preprocess#seriesInfoCheck
     * @param  axisInfo {Array}  series信息数组
     * @param  uuids {Object}  已使用id
     */
    seriesInfoCheck: function(seriesInfos, uuids) {
      for (var i = 0; i < seriesInfos.length; i++) {
        var info = seriesInfos[i];
        //id唯一性检查(包括轴的id，已经存进uuids)
        if (info.id) {
          mAssert(!uuids[info.id], "axis " + i + " id has exist - - - > " + info.id);
          uuids[info.id] = true;
        }
        //是否指定xField,yField
        mAssert(typeof(info.xField) === 'string', 'series ' + i + " must be given xField.");
        mAssert(typeof(info.yField) === 'string', 'series ' + i + " must be given yField.");
        //series类型是否支持放到calculateSeriesInfo中赋值visualEncoding中处理
      };
    },
    //informationCheck 信息合法性检查及补全缺失信息
    cartesianInformationCheck: function(graphInfo, data) {
      var uuids = {};
      //axis合法性检查
      this.axisesInfoCheck(graphInfo, uuids, data);
      //this.axisesInfoCheck(graphInfo.yAxisesInfos, uuids, graphInfo.data);
      //series合法性检查
      this.seriesInfoCheck(graphInfo.seriesInfos, uuids);
    },

    /**
     * 
     * ------------------------------------piechart数据处理与检查------------------------------------- 
     *
     */


    /**
     * 用户配置信息预处理
     * @method module:chart/preprocess#preProcessPie
     * @param  option {Object}  用户配置信息
     */
    preProcessPie: function(option, data) {
      var info = {};
      var seriesInfos = [];
      //info.data = this.preProcessData(option.data);
      var seriesInfo = {};
      seriesInfo.type = 'pie';
      //seriesInfo.center         = option.center ? option.center : [option.area.width/2, option.area.height/2];
      seriesInfo.center = option.center ? option.center : [option.size.width / 2, option.size.height / 2];
      seriesInfo.rose = option.rose ? true : pieConfig.rose;
      seriesInfo.value = option.value;
      seriesInfo.valueData = this.getDataArrayByField(seriesInfo.value, data);
      seriesInfo.annotation = option.annotation;
      seriesInfo.annotationData = this.getDataArrayByField(seriesInfo.annotation, data);
      seriesInfo.annotationLead = option.annotationLead ? option.annotationLead : pieConfig.annotationLead;
      seriesInfo.radius = option.radius ? (typeof(option.radius) === 'number' ? [0, option.radius] : option.radius) : pieConfig.radius;
      seriesInfo.angle = option.angle ? (typeof(option.angle) === 'number' ? [-90, option.angle - 90] : [option.angle[0] - 90, option.angle[1] - 90]) : pieConfig.angle;
      //缓存住从factory中获取的样式和交互
      //seriesInfo.defaultVisualEncoding = mChartHelper.creatorMap['pie'].defaultVisualEncoding(seriesInfo);
      seriesInfo.defaultInteractEncoding = mChartHelper.creatorMap['pie'].defaultInteractEncoding;
      seriesInfo.name = option.name ? option.name : 'series0';
      var names = this.getDataArrayByField(seriesInfo.annotation, data);
      seriesInfos.push(seriesInfo);
      info.seriesInfos = seriesInfos;
      info.tooltip = this.preProcessTooltip(option.tooltip, mPreciseTooltip);
      info.legend = {
        hidden: true
      };
      return info;
    },
    /**
     * 信息合法性检测
     * @method module:chart/preprocess#PieInformationCheck
     * @param graphInfo {object} 预处理之后的信息
     */
    pieInformationCheck: function(graphInfo) {
      for (var i = 0; i < graphInfo.seriesInfos.length; i++) {
        var seriesInfo = graphInfo.seriesInfos[i];
        var angle = seriesInfo.angle;
        mAssert(typeof(seriesInfo.value) === "string", "value must be provided and must be string.");
        mAssert(mChartHelper.isPositiveArrayWith2Elements(seriesInfo.radius), "radius illegal.");
        mAssert(angle[1] - angle[0] <= 360, "span of angle must under 360.");
        mAssert(angle[1] >= angle[0], "there are some problems about angle in option.");
        //mAssert(mChartHelper.isPositiveArrayWith2Elements(seriesInfo.angle),"angle illegal.");
      };

    },
    findSameIdInRules: function(id, legendOption) {
      var predicateArray = [];
      var itemInfo = legendOption.itemInfo;
      for (var k in itemInfo) {
        //if(itemInfo[k].hidden) continue;
        if (!itemInfo[k].filter.isOpen) continue;
        var relatedSeries = itemInfo[k].relatedSeries
        for (var i = 0; i < relatedSeries.length; i++) {
          if (id === relatedSeries[i]) {
            predicateArray.push(itemInfo[k].filter);
            break;
          }
        };
      }
      return predicateArray;
    },
    calculatePieSeries: function(series, data, legendName, legendOption,nameFlag) {

      var annotation = series.annotation;
      var seriesInfo = {};
      seriesInfo.type = 'pie';
      seriesInfo.id = (series.id != undefined) ? series.id : generateUniqueID();
      series.id = seriesInfo.id;
      seriesInfo.hidden = series.hidden === undefined ? pieConfig.hidden : series.hidden;
      seriesInfo.rose = series.rose === undefined ? pieConfig.rose : series.rose;
      seriesInfo.value = series.value;
      seriesInfo.name = series.name === undefined ? legendName : series.name;
      seriesInfo.position = annotation.position === undefined ? pieConfig.annotation.position : annotation.position;
      //seriesInfo.valueData = this.getDataArrayByField(seriesInfo.value, data);
      seriesInfo.annotation = annotation.annotation;
      seriesInfo.annotationHidden = annotation.hidden === undefined ? pieConfig.annotation.hidden : annotation.hidden;
      //seriesInfo.annotationData = this.getDataArrayByField(seriesInfo.annotation,data);
      seriesInfo.annotationLead = annotation.annotationLead ? annotation.annotationLead : pieConfig.annotation.annotationLead;
      seriesInfo.angle = series.angle ? (typeof(series.angle) === 'number' ? [-90, series.angle - 90] : [series.angle[0] - 90, series.angle[1] - 90]) : pieConfig.angle;

      var newData, predicateArray;
      if (legendOption !== undefined && legendOption.category !== undefined) {
        predicateArray = this.findSameIdInRules(seriesInfo.id, legendOption);
        newData = mDataFilter.filter(data, predicateArray);
      } else {
        newData = data;
      }
      var valueData = this.getDataArrayByField(series.value, newData);
      var annotationData = this.getDataArrayByField(annotation.annotation, newData);
      seriesInfo.valueData = [];
      seriesInfo.annotationData = [];
      var sum = 0;
      for (var i = 0; i < valueData.length; i++) {
        if (valueData[i].data !== null && valueData[i].data !== undefined && annotationData[i].data !== null && annotationData[i].data !== undefined) {
          seriesInfo.valueData.push(valueData[i]);
          sum += valueData[i].data;
          //seriesInfo.annotationData.push(annotationData[i]);
          if(nameFlag[annotationData[i].data] !== undefined){
            //seriesInfo.colorId = nameFlag[annotationData[i].data];
            annotationData[i].colorId = nameFlag[annotationData[i].data]
          }
          else{
            var index = nameFlag["flag_Index"];
            nameFlag["flag_Index"] = nameFlag["flag_Index"]+1;
            nameFlag[annotationData[i].data] = index;
            annotationData[i].colorId = index;
          }
          seriesInfo.annotationData.push(annotationData[i]);
        };
      };
      for (var i = 0; i < seriesInfo.valueData.length; i++) {
        seriesInfo.valueData[i].ratio = seriesInfo.valueData[i].data / sum;
      };
      //缓存住从factory中获取的样式和交互
      //seriesInfo.defaultVisualEncoding = mChartHelper.creatorMap['pie'].defaultVisualEncoding(seriesInfo);
      seriesInfo.defaultInteractEncoding = mChartHelper.creatorMap['pie'].defaultInteractEncoding;

      return seriesInfo;
    },
    preprocessPieInfo: function(option, data) {
      var info = {};
      var nameFlag = {"flag_Index":0}; 
      if(option.colorNameFlag === undefined){
        nameFlag = {"flag_Index":0};
      }     
      else{
        nameFlag = option.colorNameFlag;
      }
      //var data = this.preProcessData(option.data);
      info.data = data;
      info.area = this.preProcessSize(option.size);
      info.tooltip = this.preProcessTooltip(option.tooltip, mPreciseTooltip);
      info.rWeight = option.rWeight === undefined ? -1 : option.rWeight;
      info.gap = option.gap === undefined ? 0 : option.gap;
        //info.radius = option.radius === undefined ? -1 : option.radius;
      info.innerRadius = option.innerRadius === undefined ? -1 : option.innerRadius;
      info.outerRadius = option.outerRadius === undefined ? -1 : option.outerRadius;
      info.center = option.center === undefined ? -1 : option.center;
      //info.padding = option.padding === undefined ? 0.2 : (typeof(option.padding)=='number' ? option.padding : 0.2);
      info.type = "pie";
      if (option.emphasis) {
        var emphasis = {};
        emphasis.radius = option.emphasis.radius ==null? info.innerRadius: option.emphasis.radius;
        emphasis.align = option.emphasis.align == null ? "center": option.emphasis.align;
        emphasis.texts = option.emphasis.texts == null ? [] : option.emphasis.texts;
        emphasis.format = option.emphasis.format == null ? undefined : option.emphasis.format;
        emphasis.initColor = option.emphasis.initColor == null ? {
          r: 0,
          b: 0,
          g: 0
        } : option.emphasis.initColor;
        emphasis.isFilled = option.emphasis.isFilled == null ? false: option.emphasis.isFilled;
        emphasis.isAutoWrapped = option.emphasis.isFilled == null ? false: option.emphasis.isAutoWrapped;
        info.emphasis = emphasis;
      }
      info.seriesInfos = [];
      for (var i = 0, len = option.series.length; i < len; i++) {
        var seriesInfo = option.series[i];
        var result = this.calculatePieSeries(seriesInfo, data, "series" + i, option.legend,nameFlag);
        info.seriesInfos.push(result);
      };
      if(option.colorNameFlag === undefined)
        option.colorNameFlag = nameFlag;
      this.pieChartInfoCheck(info);
      return info;
    },
    pieChartInfoCheck: function(info) {

      //检查rWeight,没有的话就给赋值[1,1,1,...],有的话检查是否够用，否则用最小值填充
      var rWeight = info.rWeight;
      var seriesInfos = info.seriesInfos;
      var len = seriesInfos.length;
      var idCheck = {};
      mAssert(rWeight == -1 || isArray(rWeight), "The format of the rWeight: " + rWeight + " is illegal.");
      if (rWeight === -1) {
        var weight = [];
        for (var i = 0; i < len; i++) {
          weight[i] = 1;
        };
        info.rWeight = weight;
      } else if (isArray(rWeight) && rWeight.length < len) {
        var min = Math.min.apply(null, rWeight);
        for (var i = rWeight.length; i < len; i++) {
          info.rWeight[i] = min;
        };
      }
      var min = Math.min.apply(null, info.rWeight);
      mAssert(min > 0, "The element in the rWeight must be greater than 0");
      //检查gap
      mAssert(typeof(info.gap) === "number" && info.gap >= 0, "The gap is wrong.");
      //检查半径
        mAssert(typeof(info.innerRadius) === "number" && typeof(info.outerRadius) === "number","The radius is illegal.");
      //检查center值
      mAssert((typeof(info.center) === "number" && info.center === -1) || mChartHelper.isPositiveArrayWith2Elements(info.center), "The center is  illegal")
      for (var i = 0; i < len; i++) {
        //检查每个series的angle值
        var angle = seriesInfos[i].angle;
        mAssert(angle[1] - angle[0] <= 360, "span of angle must under 360.");
        mAssert(angle[1] >= angle[0], "there are some problems about angle in option.");
        //mAssert(angle[0] >= -360 && angle[0] <= 360,"The start angle must be in [-360,360]")
        //检查id的唯一性
        mAssert(idCheck[seriesInfos[i].id] === undefined, "id illegal.");
        idCheck[seriesInfos[i].id] = 1;
      };
    }
  };
  return preProcess;
});