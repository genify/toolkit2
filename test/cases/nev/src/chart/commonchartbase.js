/*
* ------------------------------------------
* 有title、legend的图表虚基类
* @version 0.0.2
* @author humin(hzhumin@corp.netease.com)
* ------------------------------------------
*/
/** @module chart */
define(['{pro}/libs/colorbox.js',
        '{pro}/chart/chartbase.js',
        '{pro}/visualencoder/visualencoder.js',
        '{pro}/interactencoder/interactencoder.js',
        './charthelper.js',
        '{pro}/tools/utils.js',
        '{pro}/tools/assert.js',
        '{pro}/chart/preprocess.js',
        '{pro}/scenebuilder/title.js',
        '{pro}/scenebuilder/legend.js',
        '{pro}/layouter/titlelayouter.js',
        '{pro}/layouter/legendlayouter.js',
        '{pro}/layouter/sequenlayouter.js',
        '{pro}/postprocessor/postprocessor.js',
        '{pro}/config/visualencoding/skin.js',
        './dataFilter.js',  
        '{pro}/libs/colortraits.js'
        ],

        function(
          mColorbox,
          mChartBase,
          mVisualEncoder,
          mInteractEncoder,
          mChartHelper,
          mTypeHelper,
          mAssert,
          mPreProcess,
          mTitleSceneBuilder,
          mLegendSceneBuilder,
          mTitleLayouter,
          mLegendLayouter,
          mSequenLayouter,
          mPostProcessor,
          mSkin,
          mDataFilter,
          mColortraits
          ){

    var ContainerSprite = mColorbox.ContainerSprite;
    var Rect = mColorbox.Rect;
    var isArray = mTypeHelper.isArray;
    var isObject = mTypeHelper.isObject;
    var EventStreamTrait = mColorbox.EventStreamTrait;
    var selection = mColorbox.selection;
    var PRIVATE = mColortraits.PRIVATE;

    var progress = function(phase, state)
    {
      return {phase :phase, state:state};
    }

    var shallowCopy = function(newObj, oldObj)
    {
      for(var key in oldObj)
      {
        newObj[key] = oldObj[key];
      }

      return newObj;
    }

    /**
     * 有title、legend的图表虚基类,用于此类图表的派生,它不能实例化图表。
     * 该类中规定了此类图表创建的基本流程、api及派生类需要实现的api等。
     * @class module:chart/commonchartbase.CommonChartBase
     * @extends module:chart/basechart
     **/
    var CommonChartBase = mChartBase.extend({
      initialize:function(option)
      {
        this.subTraits(0).__init();
        this.createEventStream("chartprogress");
        this._t.setoption(shallowCopy({}, option));

        if(option.observer)
          this.subscribe('chartprogress', option.observer);

        this.notify('chartprogress', progress('create', 'start'));

        var rootNode = ContainerSprite.create();
        this._t.setroot(rootNode);
        var rootSelection = selection.select(this._t.root());
        this._t.setrootSelection(rootSelection);
        
        //here should add a background rect node;
        var chartBkNode = Rect.create()
        .setx(0)
        .sety(0)
        .setwidth(500)
        .setheight(600)
        .setz(-100)
        .setDynamicProperty('id', 'chartBackground');

        rootNode.addChild(chartBkNode);

        this._t.settitleLayouter(mTitleLayouter.create());
        this._t.setlegendLayouter(mLegendLayouter.create());
        this._t.__useTheme("black");

        this._t.__preProcess(option);
        chartBkNode.setwidth(this._t.information().area.width);
        chartBkNode.setheight(this._t.information().area.height);
        this.updateInfo();
        console.log('====option====',option);
        this.notify('chartprogress', progress('create', 'end'));
      },

      //------------------------------- private functions start ------------------------------------//
      /**
       * 预处理数据
       * @method module:chart/commonchartbase.CommonChartBase#__preProcess
       */
      __preProcess:function(option)
      {
        this.notify('chartprogress', progress('preProcess', 'start'));
        var info = {}

        info.area = mPreProcess.preProcessSize(option.size);
        var data = mPreProcess.preProcessData(option.data);
        this.setdata(data);
        info.visualEncoding = mChartHelper.getArrayValue(option.visualEncoding, 'visualEncoding');
        info.interactEncoding = mChartHelper.getArrayValue(option.interactEncoding, 'interactEncoding');
        info.title = mPreProcess.preProcessTitle(option.title);
        info.graph = this._preProcessG(option, data);

        //_getLegendItems 函数的调用依赖于 _preProcessG 函数执行完成。
        info.legend = mPreProcess.preProcessLegend(option.legend, this._getLegendItems(info.graph,option), info.graph.legend);

        this._t.setinformation(info);
        this._t.setoption(option);
        console.log(info);
        this.notify('chartprogress', progress('preProcess', 'end'));
      },
      /**
       * 创建图表场景
       * @method module:chart/commonchartbase.CommonChartBase#__buildTitle
       */
      __buildScene:function()
      {
        this.notify('chartprogress', progress('buildScene', 'start'));

        var rootSelection = this._t.rootSelection();
        var information = this._t.information();
        
        //title
        mTitleSceneBuilder(rootSelection, information.title.texts);
        information.title.sceneSelection = rootSelection.select(function(actor){
          return actor.dynamicProperty("kind") === "title";
        });
        mLegendSceneBuilder(rootSelection, information.legend.items, this);
        information.legend.sceneSelection = rootSelection.select(function(actor){
          return actor.dynamicProperty("kind") === "legend";
        });
        this._buildG(rootSelection, information.graph, this.data());

        this.notify('chartprogress', progress('buildScene', 'end'));
      }, 
      __applyVisualEncoding:function()
      {
        this.notify('chartprogress', progress('applyVE', 'start'));

        this._t.theme().apply(this._t.rootSelection());

        // 应用用户自定义style
        var information = this.information();
        if(information.graph.optionVEs)
          mVisualEncoder.apply(this._t.rootSelection(), information.graph.optionVEs);

        this.notify('chartprogress', progress('applyVE', 'end'));
      },
      __applyInteractEncoding:function()
      {
        this.notify('chartprogress', progress('applyIE', 'start'));

        var information = this.information();

        mInteractEncoder.apply(information.title.sceneSelection, mChartHelper.titleIE);

        mInteractEncoder.apply(information.legend.sceneSelection,mChartHelper.legendIE);

        this._applyGDefaultInteractEncoding(this._t.rootSelection(), information.graph);

        //user interactencoding
        mInteractEncoder.apply(this._t.rootSelection(), information.interactEncoding);

        this.notify('chartprogress', progress('applyIE', 'end'));
      },
      __layout:function()
      {
        this.notify('chartprogress', progress('layout', 'start'));

        var info = this.information();
        var area = info.area;
        var res = {remainingSpace:area};
        if(!info.title.hidden)
         res = mTitleLayouter.create().layout(info.title, info.area, info.title.sceneSelection);
        if(!info.legend.hidden)
         res = mLegendLayouter.create().layout(info.legend, res.remainingSpace, info.legend.sceneSelection);

        this._layoutG(this._t.rootSelection(), info.graph, res.remainingSpace);

        this.notify('chartprogress', progress('layout', 'end'));

        return this;
      },
      __postProcess:function()
      {
        this.notify('chartprogress', progress('postProcess', 'start'));

        var info = this.information();
        var option = this._t.option();
        if (!info.legend.hidden) {
          mPostProcessor.adjustLegend(info.legend.sceneSelection, this._getSeriesInfo(this._t.rootSelection(), option, info.graph));
        };

        this._postProcessG(this._t.rootSelection(), info.graph);

        this.notify('chartprogress', progress('postProcess', 'end'));
      },

      __useTheme:function(theme)
      {
        var ThemeTemplate;

        if(mTypeHelper.isString(theme))
          ThemeTemplate = this._getThemeTemplate(theme);
        else
          ThemeTemplate = theme;

        this._t.setThemeTemplate(ThemeTemplate);
        this._t.settheme(ThemeTemplate.create());
      },

      //------------------------------- private functions end   ------------------------------------//


      //------------------------------- protect functions start ------------------------------------//
      /**
       * graph数据预处理
       * @param  option {Object} 整个图表的option。
       * @return {object} 处理好后的graph信息。
       * @method module:chart/commonchartbase#_preProcessG
       */
      _preProcessG:function(option)
      {
        throw "can not call CommonChartBase fun: _preProcessG!";
      }, 
      /**
       * 构建graph场景
       * @method module:chart/commonchartbase#_buildG
       * @param  rootSelection {Object} 构建graph场景所操作的selection。
       * @param  grahInfo {Object} graph信息。
       * @return {boolean} 场景是否构建成功。
       */
      _buildG:function(rootSelection, grahInfo)
      {
        throw "can not call CommonChartBase fun: _buildG!";
      },
      /**
       * 应用graph默认样式。
       * @method module:chart/commonchartbase#_applyGDefaultVisualEncoding
       * @param  rootSelection {Object} 构建graph场景所在的 rootSelection。
       * @param  grahInfo {Object} graph信息。
       */
      _applyGDefaultVisualEncoding:function(rootSelection, graphInfo)
      {
        throw "can not call CommonChartBase fun: _applyGDefaultVisualEncoding!";
      },
      /**
       * 应用graph默认交互。
       * @param  rootSelection {Object} graph场景所在的 rootSelection。
       * @param  grahInfo {Object} graph信息。
       * @method module:chart/commonchartbase#_applyGDefaultInteractEncoding
       */
      _applyGDefaultInteractEncoding:function(rootSelection, graphInfo)
      {
        throw "can not call CommonChartBase fun: _applyGDefaultInteractEncoding!";
      },
      /**
       * 布局graph。
       * @param  rootSelection {Object} graph场景所在的 rootSelection。
       * @param  grahInfo {Object} graph信息。
       * @param  remainingSpace {Area} graph约束布局区域。
       * @method module:chart/commonchartbase#_layoutG
       */
      _layoutG:function(rootSelection, graphInfo, remainingSpace)
      {
        throw "can not call CommonChartBase fun: _layoutG!";
      },
      /**
       * 获取legend信息列表。
       * @method module:chart/commonchartbase#_getLegendItems
       * @return {array} legend信息列表,每项信息必须包含name, type等。
       */
      _getLegendItems:function(graphInfo)
      {
        throw "can not call CommonChartBase fun: _getLegendItems!";
      },
      /**
       * 获取series信息。
       * @param  rootSelection {Object} graph场景所在的 rootSelection。
       * @param  grahInfo {Object} graph信息。
       * @method module:chart/commonchartbase#_getLegendItems
       * @return {object} 以series name为索引的信息，信息中必须包含series的hidden状态及color值。
       */
      _getSeriesInfo:function(rootSelection, graphInfo)
      {
        throw "can not call CommonChartBase fun: _getSeriesInfo!";
      },
      /**
       * 图例被点击时，graph需要做出对应的交互操作。
       * @param rootSelection {Object} graph场景所在的 rootSelection。
       * @param graphInfo{object} graph数据
       * @param legendName{string} 被点击的图例名称
       * @param option{Object} 整个图表的option
       * @method module:chart/commonchartbase#_legendClicked
       */
      _legendClicked:function(rootSelection, cartesianInfo, legendName, option)
      {
        throw "can not call CommonChartBase fun: _legendClicked!";
      },

      /**
       * graph的场景、布局都做好后，可能需要做属性依赖等；可重载此函数。
       * @param graphInfo{object}graph数据
       * @method module:chart/commonchartbase#_legendClicked
       */
      _postProcessG:function(rootSelection, graphInfo)
      {

      },

      /**
       * 为某图表应用某一主题。图表不一样，对应的默认主题及主题map表都不一样，因此需要具体图表各自实现。
       * @param theme{string/ThemeTemplate}
       * @method module:chart/commonchartbase#_useTheme
       */
      _getThemeTemplate:function(themeString)
      {
      },

      //------------------------------- protect functions end  ------------------------------------//

      //------------------------------- public functions start ------------------------------------//
      useTheme:function(theme)
      {
        this._t.__useTheme(theme);
        this.updateInfo();              
      },

      updateTheme:function(changes)
      {
        this._t.theme().update(changes);
        this.updateInfo();        
      },

      useThemeWith:function(chart)
      {
        this._t.__useTheme(chart.ThemeTemplate())
        this.updateInfo();
      },
      /**
       * 获取图表场景树的根节点。
       * @method module:chart/chartbase.CommonChartBase#root
       * @return  {ContainerSprite}  图表场景树的根节点
       */
      root:function()
      {
        return this._t.root();
      },
      /**
       * 更新图表数据 option 中的某一项,图表显示会刷新.
       * @public
       * @method module:chart/commonchartbase.CommonChartBase#update
       * @param  optionKey {String}  option名称。
       * @param  value {Object}  option值。
       */
      update:function(optionKey, value)
      {
        if(typeof(optionKey)==="string")
        {
          this._t.option()[optionKey] = value;
        }
        else
        {
          for(var key in optionKey)
          {
            this._t.option()[key] = optionKey[key];            
          }
        }
        this._t.__preProcess(this._t.option());
        this.updateInfo();
      },
      /**
       * 更新图表的数据，图表显示会刷新。
       * @public
       * @method module:chart/commonchartbase.CommonChartBase#updateData
       * @param  data {Array | Object}  按行的数据或按列的数据。
       */
      updateData:function(data)
      {
        this.update('data', data);
      },
      /**
       * 更新图表的size, 图表显示会刷新。
       * @public
       * @method module:chart/commonchartbase.CommonChartBase#updateSize
       * @param  size {Object}。
       */
      updateSize:function(size)
      {
        this.update('size', size);
      },

      /**
       * 更新图表的标题，图表显示会刷新。
       * @public
       * @method module:chart/commonchartbase.CommonChartBase#updateTitle
       * @param  value {Object}。
       */
       updateTitle: function(value)
       {
        this.update('title', value);
       },
      /**
       * 设置图表样式
       * @public
       * @method module:chart/commonchartbase.CommonChartBase#applyVisualEncoding
       * @param ve {Array} 用户定义的visualEncoding
       */
      applyVisualEncoding:function(ve)
      {
        mVisualEncoder.apply(this._t.rootSelection(), ve);
      },
      /**
       * 设置图表交互
       * @public
       * @method module:chart/commonchartbase.CommonChartBase#applyInteractEncoding
       * @param ie {Array} 用户定义的interactEncoding
       */
      applyInteractEncoding:function(ie)
      {
        mInteractEncoder.apply(this._t.rootSelection(), ie);
      },
      /**
       * 隐藏或显示名字为name的series。
       * @public
       * @param {String} name 图例的名称
       * @method module:chart/commonchartbase.CommonChartBase#hideOrShowSeries
       */
      hideOrShowSeries:function(data)
      {
        this._legendClicked(this._t.rootSelection(), this.information().graph, data, this._t.option());
      },

      /**
       * preprocess中的info有更新，必须调用此函数将场景、layout都重新更新一遍。
       * @method module:chart/commonchartbase.CommonChartBase#updateInfo
       */
      updateInfo:function()
      {
        mSkin.restoreStyleIndex();
        this._t.__buildScene();
        this._t.__applyVisualEncoding();
        this._t.__applyInteractEncoding();
        this._t.__layout();
        this._t.__postProcess();
      }
      //------------------------------- public functions end  ------------------------------------//
    }, ["information","data", PRIVATE("titleLayouter"), PRIVATE("legendLayouter"), PRIVATE('root'), PRIVATE('rootSelection'), PRIVATE('option'), "ThemeTemplate", PRIVATE("theme")], [EventStreamTrait]);

    return CommonChartBase;
    });
