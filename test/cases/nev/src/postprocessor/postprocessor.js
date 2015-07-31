/*
 * ------------------------------------------
 * 图表的后期处理
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module postprocessor */
define(['{pro}/libs/colorbox.js',
        '{pro}/tools/assert.js'],
      function(
        mColorbox,
        mAssert){

        var selection = mColorbox.selection;

        var nodeKindMap = {
          line: "line",
          bar: "bar",
          area: "line",
          pie: "pie",
          scatter: "scatter"
        }
        /**
         * 后期处理的命名空间.
         */
        var postProcessor = {
          /**
           * 提交轴文本的后期约束布局处理   
           * @function postProcessor.try        
           * @param {Array}  processors - 轴文本约束布局的处理方式
           * @return  {Function} processor - 返回一个处理函数，这个处理函数的参数为axis的根节点，内部会选择axis的label节点，然后按照输入的strategies策略适配axis的label。
           */
          try: function(param){
            return function(root) {
              for(var i = 0, len = param.length; i < len; ++i){
                if(param[i].condition(root)){
                  param[i].postProcessor(root);
                  return root;
                }
              }
              param[0].postProcessor(root);
              return root;
            };
          },
          /**
           * 调整legend的颜色和series一样 
           * @function  postProcessor.adjustLegend         
           * @param {OBject}  legendroot -图例的根节点
           * @param {Array}  seriesinfos -series
           * @return  {Void}
           */
          adjustLegend: function(legendSelection, info) {
            if(info === undefined) return;
            var data;

            var frameSelection = legendSelection.selectAll(function(actor, index){
                                                            return actor.dynamicProperty("kind") == "frame";
                                                          });
            frameSelection.each(function(actor, index) {
                                  data = actor.dynamicProperty("data");

                                  var textActor = actor.children()[0];
                                  var fillStyle = textActor.fillStyle();
                                  if(textActor.vsFillStyle == null)
                                  {
                                    textActor.vsFillStyle = fillStyle;
                                  }
                                  else
                                  {
                                    if(fillStyle.r != textActor.vsFillStyle.r)
                                      textActor.vsFillStyle = fillStyle;
                                  }
                                  var hiddenColor = {r: fillStyle.r, g: fillStyle.g, b: fillStyle.b, a:0.3};
                                  textActor.setfillStyle(info[data.name].hidden ?  hiddenColor : textActor.vsFillStyle);

                                  actor.setfillStyle(info[data.name].hidden ?  hiddenColor : info[data.name].color);
                                });
           }
        }

        return postProcessor;
});