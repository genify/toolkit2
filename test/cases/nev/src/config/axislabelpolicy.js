/*
 * ------------------------------------------
 * 轴文本自动布局策略
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config */
define(['{pro}/libs/colorbox.js'],
  function(mColorbox) {
    var axisLabelPolicy = {};
    var selection = mColorbox.selection;



    /**
     * 轴文本的自动换行约束布局
     */


    axisLabelPolicy.lineFeed = {

      conditionResult: null,

      type: 'lineFeed',
      /**
       * 判断自动换行约束布局能否使轴文本显示
       * @function axislabelpolicy.lineFeed.condition
       * @param {root}  axis的根节点
       * @return  {boolean} true为满足，false为不满足
       */
      condition: function(maxlabel, judge, configuredMaxLineNum) {
        var width = judge.width;
        var height = Math.abs(judge.height);
        var isOK = false;
        maxlabel.setmaxWidth(Infinity);
        var singleLineTextHeight = maxlabel.height();
        configuredMaxLineNum = configuredMaxLineNum === undefined ? 1 : configuredMaxLineNum;
        maxlabel.setmaxWidth(width);
        maxlabel.setmaxHeight(height);
        var originTexts = maxlabel.dynamicProperty("originTexts");
        maxlabel.settext(originTexts);
        var textArray = maxlabel.splitTexts();
        var textLinesNum = textArray.length;
        var actualLineNum = Math.min(textLinesNum, configuredMaxLineNum);
        var showtext = textArray.slice(0, actualLineNum).join('');
        if (showtext === originTexts) {
          isOK = true;
        } else {
          isOK = false;
        }
        maxlabel.setmaxWidth(Infinity);
        maxlabel.setmaxHeight(Infinity);
        this.conditionResult = {
          isOK: isOK,
          actualLineNum: actualLineNum,
          singleLineTextHeight: singleLineTextHeight
        };
        return this.conditionResult;
      },
      /**
       * 轴文本的自动换行处理
       * @function axislabelpolicy.lineFeed.adaptLabel
       * @param {root}  axis的根节点
       * @return  {Void} 
       */
      adaptLabel: function(labelSelection, maxlabel, judge, configuredMaxLineNum) {
        var actualLineNum;
        var singleLineTextHeight;
        var width = judge.width;
        var height = Math.abs(judge.height);
        this.conditionResult = this.condition(maxlabel, judge, configuredMaxLineNum);
        actualLineNum = this.conditionResult.actualLineNum;
        singleLineTextHeight = this.conditionResult.singleLineTextHeight;
        labelSelection.each(function(actor, index) {
          actor.setmaxWidth(width);
          actor.setmaxHeight(Infinity);
          var originTexts = actor.dynamicProperty("originTexts");
          actor.settext(originTexts);
          splitTexts = actor.splitTexts();
          var textLinesNum = splitTexts.length;
          var newText;
          if (textLinesNum <= actualLineNum) {
            newText = actor.text();
          } else {
            newText = splitTexts.slice(0, actualLineNum);
            newText = newText.join('');
            textLen = newText.length;
            newText = newText.slice(0, textLen -1) + "...";

          }
          actor.settext(newText);
          actor.setmaxHeight(actualLineNum * singleLineTextHeight+1);//



        })
      }
    };


    axisLabelPolicy.labelRotate = {

      conditionResult: null,

      type: 'labelRotate',
      /**
       * 判断轴文本旋转约束布局能否使轴文本显示
       * @function axislabelpolicy.labelRotate.condition
       * @param {root}  axis的根节点
       * @return  {boolean} true为满足，false为不满足
       */
      condition: function(maxlabel, judge, configuredMaxLineNum) {
        var isOK;
        var width = judge.rotationWidth === undefined ? judge.width : judge.rotationWidth;
        var height = judge.rotationHeight === undefined ? judge.height : judge.rotationHeight;
        var singleLineTextHeight = maxlabel.height();
        var t = height/width;
        var maxTextsPixelLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) - 2 * singleLineTextHeight * t / (Math.pow(t, 2) + 1);
        configuredMaxLineNum = configuredMaxLineNum === undefined ? 1 : configuredMaxLineNum;
        var originTexts = maxlabel.dynamicProperty("originTexts");
        maxlabel.settext(originTexts);
        maxlabel.setmaxWidth(maxTextsPixelLength);
        maxlabel.setrotation(-Math.atan(height / width));
        var actualWidth = maxlabel.width();
        var actualHeight = maxlabel.height();
        var t = actualHeight / actualWidth;
        var actualTextsPixelLength = Math.sqrt(Math.pow(actualWidth, 2) + Math.pow(actualHeight, 2)) - 2 * singleLineTextHeight * t / (Math.pow(t, 2) + 1);
        var textArray = maxlabel.splitTexts();
        var textLinesNum = textArray.length;
        if (textLinesNum <= configuredMaxLineNum) {
          isOK = true;
        } else {
          isOK = false;
        }
        var actualLineNum = Math.min(textLinesNum, configuredMaxLineNum);
        maxlabel.setrotation(0);
        maxlabel.setmaxWidth(Infinity);
        maxlabel.setmaxHeight(Infinity);
        this.conditionResult = {
          isOK: isOK,
          actualLineNum: actualLineNum,
          singleLineTextHeight: singleLineTextHeight,
          maxTextsPixelLength: maxTextsPixelLength
        };
        return this.conditionResult;
      },
      /**
       * 轴文本的旋转处理
       * @function axislabelpolicy.labelRotate.adaptLabel
       * @param {root}  axis的根节点
       * @return  {Void} 
       */
      adaptLabel: function(labelSelection, maxlabel, judge, configuredMaxLineNum) {
        var width = judge.rotationWidth === undefined ? judge.width : judge.rotationWidth;
        var height = judge.rotationHeight === undefined ? judge.height : judge.rotationHeight;
        this.condition(maxlabel, judge, configuredMaxLineNum);
        var actualLineNum = this.conditionResult.actualLineNum;
        var maxTextsPixelLength =this.conditionResult.maxTextsPixelLength; 
        labelSelection.each(function(actor) {
          var originTexts = actor.dynamicProperty("originTexts");
          actor.settext(originTexts);
          actor.setmaxWidth(maxTextsPixelLength);
          actor.setrotation(-Math.atan(height / width));
          var textArray = actor.splitTexts();
          var textLinesNum = textArray.length;
          var textlines = Math.min(textLinesNum, actualLineNum);
          var showtext = textArray.slice(0, textlines);
          showtext = showtext.join('');
          if (originTexts != showtext) {
            showtext = showtext.slice(0, showtext.length - 2);
            showtext = showtext + "..";
            actor.settext(showtext);
          }
        });
      }
    };


    return [axisLabelPolicy];
  });