/*
* ------------------------------------------
* 单轴图表
* @version 0.0.1
* @author jw(hzzhangjw@corp.netease.com)
* ------------------------------------------
*/


/** @module chart */


define(['./axischart.js',
        '{pro}/libs/colorbox.js',
        '{pro}/libs/colortraits.js',
        '{pro}/tools/utils.js',
        '{pro}/config/axislabelpolicy.js',
        '{pro}/layouter/axislayouter.js',
        '{pro}/scenebuilder/axis.js',
        '{pro}/config/chart.js',
        '{pro}/tools/assert.js',
        '{pro}/visualencoder/visualencoder.js',
        '{pro}/interactencoder/interactencoder.js',
        '{pro}/postprocessor/postprocessor.js',
        '{pro}/scale/linear.js',
        '{pro}/scale/ordinal.js'
        ],function(
            mAxisChart,
            mColorbox,
            mColortraits,
            mTypeHelper,
            mAxisLabelPolicy,
            mLayoutAxis,
            mSceneBuilderAxis,
            mConfigChart,
            mAssert,
            mVisualEncoder,
            mInteractEncoder,
            mPostProcessor,
            mScaleLinear,
            mScaleOrdinal
            ){

    var isArray         = mTypeHelper.isArray;
    var ContainerSprite = mColorbox.ContainerSprite;
    var labelPolicy     = mAxisLabelPolicy;
    var PRIVATE         = mColortraits.PRIVATE;
    var config          = mConfigChart.cartesianchart;

     /**
       * 直角坐标系图表
       * @class module:chart/singleaxischart.SingleAxisChart
       * @extends module:chart/axischart
       * @param option {Object} 用户配置信息 
       * @description
       * option
       */
    var CartesianChart = mAxisChart.extend({
      initialize:function(option){
        this.execProto("initialize",option);
        
      },


      /**
       * 用户配置信息预处理
       * @private
       * @method module:chart/singleaxischart.SingleAxisChart#_preprocess
       * @param  option {Object}  用户配置信息
       */
      _preprocess:function(option){
        this.execProto("_preprocess",option);

        var info = this.information();
        info.axisInfo = {};
        info.seriesInfos  = [];
        this._t.__buildAxisInfo(option.axis);
        this._t.__buildSeriesInfos(this._chartHelper().getArrayValue(option.series,"series"),info.seriesInfos);    

      },
      /**
       * 构建轴信息
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#__buildAxisesInfo
       * @param  axisDesc {Object}  用户配置的轴信息
       */
      __buildAxisInfo:function(axisDesc){
        var info = this.information();
        mAssert(typeof(axisDesc) === "object", "axis info must provide.");
        info.axisInfo = this._calculateAxisInfo(axisDesc,axisDesc.orient !== "vertical");

      },
      
      /**
       * 构建单个series信息
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#__buildSeriesInfo
       * @param  seriesDesc {Object}  用户配置的单个轴信息
       */
      __buildSeriesInfo:function(seriesDesc){
        var info = {};
        info.type = seriesDesc.type;
        info.id = seriesDesc.id;
        info.field = seriesDesc.field;
        info.space = seriesDesc.space ? seriesDesc.space : mConfigChart.singleAxisChart.space

        if(typeof(info.field) === "string"){
          this._axisFieldAdd1(this.information().axisInfo,info.field);
        }

        info.smooth = seriesDesc.smooth ? seriesDesc.smooth : 0;
        info.hidden = false;
        info.size = seriesDesc.size;

        //缓存住从factory中取出的visualEncoding
        info.defaultVisualEncoding = this._chartHelper().creatorMap[seriesDesc.type].defaultVisualEncoding(info);
        info.defaultInteractEncoding = this._chartHelper().creatorMap[seriesDesc.type].defaultInteractEncoding;
        
        info.name = seriesDesc.name ? seriesDesc.name : "series"+(this.information().legend.items.length === 0 ? 0 : this.information().legend.items.length);
        return info;
      },
      /**
       * 构建series信息
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#__buildSeriesInfos
       * @param  seriesDescs {Object}  用户配置的series信息数组
       * @param  infos {Array}  内部存储series信息数组
       */
      __buildSeriesInfos:function(seriesDescs,infos){
        var information = this.information();

        for (var i = 0; i < seriesDescs.length; i++) {
          var info = this._t.__buildSeriesInfo(seriesDescs[i]);
          infos.push(info); 
          information.legend.items.push({name:info.name,type:info.type});
        };
      },
      /**
       * 信息合法性检测
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#_informationCheck
       */
      _informationCheck:function(){
        var information = this.information();
        var uuids = {};
        // (1)axis合法性检
        this._axisInfoCheck(information.axisInfo,uuids,0);
        // (2)series合法性检测
        this._t.__seriesInfoCheck(information.seriesInfos,uuids);
      },
      /**
       * 所有series信息合法性检测。
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#__seriesInfoCheck
       * @param {Array} seriesInfos series信息数组。
       * @param {Object} uuids 已被占用的id们。
       */
      __seriesInfoCheck:function(seriesInfos,uuids){
        for (var i = 0; i < seriesInfos.length; i++) {
          var info = seriesInfos[i];
          //id的唯一性（包括轴id）
          if(info.id){
            mAssert(!uuids[info.id],"axis "+ i+" id has exist --->"+info.id);
            uuids[info.id] = true;
          }
          //是否指定field
          mAssert(typeof(seriesInfos[i].field) === "string","Series "+i+" must be given xField.");
          // 轴是否存在，field是否存在--->已经在构建信息时保证；series类型是否支持
          mAssert(this._chartHelper().creatorMap[seriesInfos[i].type],"unsupported chart type:"+seriesInfos[i].type);

        };
      },
      
      
      /**
       * 构建场景树
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#_build
       */
      _build:function(){
        this.execProto("_build");
        var information = this.information();
        var axisInfo = information.axisInfo;
        var seriesInfos = information.seriesInfos;

        //初步构建场景树
        var rootNode = information.root;
        // this._t.setroot(rootNode);
        var axisNode = ContainerSprite.create();
        axisNode.setDynamicProperty("id","axis");
        information.axisNode = axisNode;
        var seriesNode = ContainerSprite.create();
        seriesNode.setDynamicProperty("id","series");
        information.seriesNode = seriesNode;
        
        rootNode.addChild(axisNode);
        rootNode.addChild(seriesNode);

        //axis
        var rootAxis = this._buildAxis(axisInfo);
        !axisInfo.hidden && information.axisNode.addChild(rootAxis);


        //seires
        for (var i = 0; i < seriesInfos.length; i++) {
          this._t.__buildSeries(seriesInfos[i]);
        };

      },
      /**
       * 构建series场景树，并添加到图表场景树上。
       * @private
       * @method module:chart/singleaxischart.SingleAxisChart#__buildSeries
       * @param {Object} seriesInfo series信息
       */
      __buildSeries:function(seriesInfo){        

        var information = this.information();
        var data      = this._getDataArrayByField(seriesInfo.field);
        var axisInfo  = information.axisInfo;
        var seriesNode = information.seriesNode;
        var creator    = this._chartHelper().creatorMap[seriesInfo.type];
        var lo; 
        if(axisInfo.isXAxis){
          lo = creator.layout.create().xAxis(axisInfo.layout).xData(data);
        }else{
          lo = creator.layout.create().yAxis(axisInfo.layout).yData(data);
        }      

        if(seriesInfo.size && lo.size &&this._dataFieldExist(seriesInfo.size)){
          lo.size(this._getDataArrayByField(seriesInfo.size));
        }

        sb = creator.sceneBuilder.create(lo.exec(),creator.getBuildParam(seriesInfo));
        rootA = sb.root();
        seriesNode.addChild(rootA); 

        var value = information.data;
        //给scenebuilder设置数据
        sb.setValue({value:value,//全局数据
                  axisfields:[seriesInfo.field]//轴维度信息
                });               

        //为根节点设置id和kind
        seriesInfo.id && rootA.setDynamicProperty("id",seriesInfo.id);
        rootA.setDynamicProperty("kind",creator.kind);
        
        //保存信息
        seriesInfo.layout = lo;
        seriesInfo.sceneBuilder = sb;

      },
      /**
       * 更新series场景树
       * @private
       * @method module:chart/singleaxischart.SingleAxisChart#__updateSeries
       * @param {Object} seriesInfo series信息
       */
      __updateSeries:function(seriesInfo){
        var data     = this._getDataArrayByField(seriesInfo.field);
        var creator   = this._chartHelper().creatorMap[seriesInfo.type]; 
        var lo;
        var axisInfo = this.information().axisInfo;
        if(axisInfo.isXAxis){
          lo = seriesInfo.layout.xAxis(axisInfo.layout).xData(data);
        }else{
          lo = seriesInfo.layout.yAxis(axisInfo.layout).yData(data);
        }      
        seriesInfo.sceneBuilder.setlayoutData(lo.exec());
        seriesInfo.sceneBuilder.build();
      },
      /**
       * 应用样式信息
       * @private
       * @method module:chart/singleaxischart.SingleAxisChart#_applyVisualEncoding
       */
      _applyVisualEncoding:function(){
        this.execProto("_applyVisualEncoding");
        var information = this.information();
        //重刷默认样式和用户样式
        this._applyDefaultVisualEncodings([information.axisInfo]);
        this._applyDefaultVisualEncodings(information.seriesInfos);

        mVisualEncoder.apply(information.root,information.visualEncoding);
      },
      /**
       * 应用交互信息
       * @private
       * @method module:chart/singleaxischart.SingleAxisChart#_applyInteractEncoding
       */
      _applyInteractEncoding:function(){
        this.execProto("_applyInteractEncoding");
        var information = this.information();

        //重刷默认交互和用户交互
        this._applyDefaultInteractEncodings([information.axisInfo]);
        this._applyDefaultInteractEncodings(information.seriesInfos);
        mInteractEncoder.apply(information.root,information.interactEncoding);
      },
       /**
       * 应用后续处理
       * @private
       * @method module:chart/singleaxischart.SingleAxisChart#_applyPostProcess
       */
      _applyPostProcess:function(){
        this.execProto("_applyPostProcess");
        var labelprocesser = mPostProcessor.try([labelPolicy.lineFeed, labelPolicy.labelRotate, labelPolicy.labelSevered]);
        labelprocesser(this.root());
        this._t.__adjustAxis(this.information().axisInfo);
        this._t.__adjustSeries();
      },
      /**
       * 调整轴在与轴正交方向的偏移量。
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#__adjustAxis
       * @param  info {Object}  轴信息
       */
      __adjustAxis:function(info){//调整轴的offset
        var isX = info.isXAxis;
        var root = info.sceneBuilder.root();
        var type = typeof(info.offset);
        switch(type){
          case "undefined":
            var bbox = info.sceneBuilder.root().treeBbox();
            isX ? root.sety(info.labelRange[1] > 0 ? this.information().area.height - bbox.height - 20 : bbox.height) : root.setx(info.labelRange[1] < 0 ? bbox.width : 0);
            break;
          case "number":
            isX ? root.sety(info.offset) : root.setx(info.offset);
            break;
          default:
            throw "illegal offset ---> "+info.offset; 
        }
      },
      /**
       * 调整series之间的间距。
       * @private 
       * @method module:chart/singleaxischart.SingleAxisChart#__adjustSeries
       */
      __adjustSeries:function(){
        var information = this.information();
        var posX = information.axisInfo.sceneBuilder.root().x();
        var posY = information.axisInfo.sceneBuilder.root().y();
        var isXAxis = information.axisInfo.isXAxis;
        for (var i = 0; i < information.seriesInfos.length; i++) {
          var si = information.seriesInfos[i];
          var root = si.sceneBuilder.root();
          isXAxis ? root.move(root.x(),posY - si.space) : root.moveBy(posX + si.space,root.y());
          isXAxis ? (posY = posY - si.space) :  (posX = posX + si.space) 
        };

      },
      /**
       * 添加一个series项
       * @method module:chart/singleaxischart.SingleAxisChart#appendSeries
       * @param  seriesObject {Object}  用户配置series信息
       */
      appendSeries:function(seriesObject){
        var information = this.information();

        var info = this._t.__buildSeriesInfo(seriesObject);
        information.seriesInfos.push(info)
        this._informationCheck();

        //重建相应的轴
        this._updateAxis(information.axisInfo);
        this.addLegend(info.name,info.type);

        this._t.__buildSeries(info);
        for (var i = 0; i < information.seriesInfos.length; i++) {
          this._t.__updateSeries(information.seriesInfos[i]);
        };

        this._applyVisualEncoding();
        this._applyInteractEncoding();       
        this._applyPostProcess();

      },

      /**
       * 删除一个series项
       * @method module:chart/singleaxischart.SingleAxisChart#removeSeries
       * @param  indexorid {number | string}  Series的索引或者id字符串
       */
      removeSeries:function(indexorid){
        var information = this.information();
        var toRemove;
        var sis = information.seriesInfos;
        var index;
        if(typeof(indexorid) === "number" && indexorid < sis.length){
            toRemove = sis[indexorid];
            index = indexorid;
        }else if(typeof(indexorid) === "string"){
            for (var i = 0; i < sis.length; i++) {
                if(sis[i].sceneBuilder && sis[i].sceneBuilder.root().dynamicProperty("id") === indexorid){
                    toRemove = sis[i];
                    index = i;
                    break;
                }
            };
        }

        if(toRemove){
          information.seriesNode.removeChild(toRemove.sceneBuilder.root());
          sis.splice(index,1);
          this.removeLegend(index);
          var info = toRemove;

          //重建相应的轴
          if(!this._axisFieldSub1(information.axisInfo,info.field)){
            this._calculateAxisDataDomain(info.axisInfo)
            this._updateAxis(info.axisInfo);
          };

          for (var i = 0; i < information.seriesInfos.length; i++) {
            this._t.__updateSeries(information.seriesInfos[i]);
          };
          this._applyVisualEncoding();
          this._applyInteractEncoding();       
          this._applyPostProcess();
        }
      },
      /**
       * 刷新图表
       * @method module:chart/singleaxischart.SingleAxisChart#update
       */
      update:function(){
        var information = this.information();
        var seriesInfos  = information.seriesInfos;
        this._updateAxis(information.axisInfo);
        for (var i = 0; i < seriesInfos.length; i++) {
            this._t.__updateSeries(seriesInfos[i]);
          };

        //需要放在最后  
        this.execProto("update");
      }      
      
    });
    return CartesianChart;
});