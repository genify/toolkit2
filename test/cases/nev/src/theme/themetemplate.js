define([
  '{pro}/libs/colortraits.js',
  '{pro}/tools/utils.js',
  '{pro}/libs/colorbox.js',
  '{pro}/visualencoder/visualencoder.js',
  '{pro}/tools/utils.js'
  ],
  function(colortraits, utils, colorbox, visualEncoder, mTypeHelper){
    var Klass = colortraits.Klass;
    var kind = colorbox.selector.kind;
    var id = colorbox.selector.id;

    var shallowCopy = function(newObj, oldObj)
    {
      for(var key in oldObj)
      {
        newObj[key] = oldObj[key];
      }

      return newObj;
    }

    var changesToObj = function(rules)
    {
      var changeObj = {}, ruleObj;

      if(rules.length <2)
        return changeObj;

      for(var i = 0; i < rules.length; ++i)
      {
        var rule = rules[i];
        ruleObj = changeObj;
        for(var j = 0; j < rule.length-2; ++j)
        {
          var name = rule[j];
          if(ruleObj[name] == null)
          {
            ruleObj[name] = {};
          }
          ruleObj = ruleObj[name];
        }
        ruleObj[rule[rule.length - 2]] = rule[rule.length -1];
      }

      return changeObj;
    }

    var ThemeTemplate = Klass.extend({
      /**
       * 修改 theme 中某些属性。
       * @param  changes {array/object} 更新属性的 rules数组或者 Properties 集合。
       * @method module:theme/Theme#update
       * @return {Theme} this。
       */
      update:function(changes)
      {
        var klass = this.Klass;
        var colors = klass.colors;
        var marks = klass.marks;

        if(mTypeHelper.isArray(changes))
        {
          changes = changesToObj(changes);
        }

        var needPreProcess = false;
        if(changes.colors)
        {
          colors =changes.colors;
          needPreProcess = true;
        }
        if(changes.marks)
        {
          marks = changes.marks;
          needPreProcess = true;
        }
        if(needPreProcess && klass.propPreprocessMap)
        {
          changes = preprocessChanges(changes, klass.propPreprocessMap, marks, colors);
        }
        var changeEncodings =  parseThemeProps(changes, klass.visualEncodingMap);
        var newThemeEncodings = [klass.themeEncodings.length];
        for(var i = 0; i < klass.themeEncodings.length; ++i)
        {
          newThemeEncodings[i] = {};
          for(var name in klass.themeEncodings[i])
          {
            newThemeEncodings[i][name] = klass.themeEncodings[i][name];
          } 
        }
        updateThemeEncodings(newThemeEncodings, changeEncodings);

        this.setvisualEncodings(newThemeEncodings);
      },
      /**
       * 将 theme 中的样式应用到 chart 上。
       * @param  chartSelection {Selection} 需要应用 theme 的 chart root Selection。
       * @method module:theme/Theme#apply
       * @return {Theme} this。
       */
      apply:function(chartSelection)
      {
        visualEncoder.apply(chartSelection, this.visualEncodings());
      },
      /**
       * 获取 theme 中 ruleSelector 所对应的属性值。
       * @param  ruleSelector {array}。
       * @method module:theme/Theme#getProperty
       * @return {Theme} this。
       */
      getProperty:function(ruleSelector)
      {
        if(ruleSelector.length < 2)
          return;

        var visualEncodings = this.visualEncodings();
        var selProp = ruleSelector[length-1];
        var findVE;
        var bFind = false;

        for(var j = 0; j < visualEncodings.length; ++j)
        {
          var veRuleSelector = visualEncodings[j].ruleSelector;

          if(veRuleSelector.length < ruleSelector.length)
            continue;

          bFind = true;
          for(var i = 0; i < ruleSelector.length -1; ++i)
          {
            if(uleSelector[i] != veRuleSelector[k])
            {
              bFind = false;
              break;
            }
          }

          if(bFind)
          {
            break;
          }
        }
        if(bFind)
          return 
      }
    });

    function convertObjToVisualEncoding(visualEncodings, visualEncodingMap, propObj, baseSelector, baseRuleSelector)
    {
      var selector = visualEncodingMap.baseSelector?visualEncodingMap.baseSelector:null;

      if(baseSelector)
      {
        if(selector && mTypeHelper.isBoolean(selector))
          selector = baseSelector;
        else if(selector)
        {
          selector = baseSelector.then(selector);
        }
        else
          selector = baseSelector;
      }
      else
      {
        if(selector && mTypeHelper.isBoolean(selector))
          selector = null;
      }

      var extractStyle = visualEncodingMap.style;
      var excludeStyleProps = visualEncodingMap.excludeStyleProps;
      var hasStyle = false;
      var style = {};

      //extract deep style value
      for(var name in propObj)
      {
        if(extractStyle && !(excludeStyleProps && excludeStyleProps[name] === true))
        {
          hasStyle = true;
          style[name] = propObj[name];
        }
        if(visualEncodingMap[name] && visualEncodingMap[name].baseSelector)
        {
          convertObjToVisualEncoding(visualEncodings, visualEncodingMap[name], propObj[name], selector, baseRuleSelector.concat([name]));
        }
      }
      if(hasStyle)
      {
        var vsEncoding = {selector:selector, ruleSelector:baseRuleSelector};
        if(style.mark)
        {
          vsEncoding.mark = style.mark;
          if(style.style)
          {
            vsEncoding.style = style.style;
          }
          else
          {
            delete style["mark"];
            vsEncoding.style = style;
          }
        }
        else
          vsEncoding.style = style;
        
        visualEncodings.push(vsEncoding);
      }
    }

    function parseThemeProps(defaultThemeProps, visualEncodingMap)
    {
      var visualEncodings = [];
      convertObjToVisualEncoding(visualEncodings, visualEncodingMap, defaultThemeProps, null, []);

      return visualEncodings;
    }

    function updateThemeEncodings(themeEncodings, changeEncodings)
    {
      var changeRuleSelector, encodingRuleSelector;

      for(var i = 0; i < changeEncodings.length; ++i)
      {
        changeRuleSelector = changeEncodings[i].ruleSelector;
        
        //find the corresponding themeEncoding
        for(var j = 0; j < themeEncodings.length; ++j)
        {
          encodingRuleSelector = themeEncodings[j].ruleSelector;
          if(encodingRuleSelector.length == changeRuleSelector.length)
          {
            var equalSelector = true;
            for(var k = 0; k < encodingRuleSelector.length; ++k)
            {
              if(encodingRuleSelector[k] != changeRuleSelector[k])
              {
                equalSelector = false;
                break;
              }
            }
            if(equalSelector)
            {
              //clone style and update
              var style = shallowCopy({}, themeEncodings[j].style);
              for(var name in changeEncodings[i].style)
              {
                style[name] = changeEncodings[i].style[name];
              }
              themeEncodings[j].style = style;

              if(changeEncodings[i].mark)
              {
                themeEncodings[j].mark = changeEncodings[i].mark;
              }

              break;
            }
          }
        }
      }
    }

    //
    function preprocessChanges(changes, propPreprocessMap, marks, colors)
    {
      var newChanges = shallowCopy({}, changes);
      var changeObj = newChanges;
      var oldObj;
      for(var i = 0; i < propPreprocessMap.length; ++i)
      {
        var ruleSelector = propPreprocessMap[i].ruleSelector;
        var processStyle = propPreprocessMap[i].style;
        
        changeObj = newChanges;
        for(var j = 0; j < ruleSelector.length; ++j)
        {
          var name = ruleSelector[j];
          if(changeObj[name] == null)
          {
            changeObj[name] = {};
            oldObj = changeObj[name];
          }
          else
          {
            oldObj = changeObj[name];
            changeObj[name] = shallowCopy({}, changeObj[name]);
          }
          changeObj = changeObj[name];
        }
        for(var name in processStyle)
        {
          changeObj[name] = processStyle[name](marks, colors, oldObj);
        }
      }

      return newChanges;
    }

    var createThemeTemplate = function(themeEncodings, visualEncodingMap, propPreprocessMap, colors, marks)
    {
      var ThemeTemplateEx = ThemeTemplate.extend({
          initialize:function() {
            this._t.setvisualEncodings(themeEncodings);
          }

        }, ["visualEncodings"]);

      ThemeTemplateEx.themeEncodings = themeEncodings;
      ThemeTemplateEx.visualEncodingMap = visualEncodingMap;
      ThemeTemplateEx.propPreprocessMap = propPreprocessMap;
      ThemeTemplateEx.colors = colors;
      ThemeTemplateEx.marks = marks;

      ThemeTemplateEx.clone = function (changes, propPreprocessMap)
      {
        var colors = this.colors;
        var marks = this.marks;

        var needPreProcess = false;
        if(changes.colors)
        {
          colors =changes.colors;
          needPreProcess = true;
        }
        if(changes.marks)
        {
          marks = changes.marks;
          needPreProcess = true;
        }
        if(propPreprocessMap == null)
          propPreprocessMap = this.propPreprocessMap;

        var newThemeEncodings = [this.themeEncodings.length];
        for(var i = 0; i < this.themeEncodings.length; ++i)
        {
          newThemeEncodings[i] = {};
          for(var name in this.themeEncodings[i])
          {
            newThemeEncodings[i][name] = this.themeEncodings[i][name];
          }            
        }
        
        var newChanges = changes;
        if(needPreProcess && propPreprocessMap)
        {
          newChanges = preprocessChanges(changes, propPreprocessMap, marks, colors);
        }
        var changeEncodings =  parseThemeProps(newChanges, this.visualEncodingMap);
        //clone themeEncodings
        updateThemeEncodings(newThemeEncodings, changeEncodings);

        return createThemeTemplate(newThemeEncodings, this.visualEncodingMap, this.propPreprocessMap, colors, marks);
      }

      return ThemeTemplateEx;
    }

    function generateThemeTemplate(themeProp, visualEncodingMap, propPreprocessMap)
    {
      var themeEncodings = parseThemeProps(themeProp, visualEncodingMap);
      var colors = themeProp.colors;
      var marks = themeProp.marks;

      return createThemeTemplate(themeEncodings, visualEncodingMap, propPreprocessMap, colors, marks);
    }

    return {
      generateThemeTemplate:generateThemeTemplate,
      convertObjToVisualEncoding:convertObjToVisualEncoding
    }
  }
);