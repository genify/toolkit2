define(
  [
    "{pro}/libs/colorbox.js"
  ],
  function(colorbox)
  {
    var kind = colorbox.selector.kind;
    var id = colorbox.selector.id;

    var commonMap = {
      baseSelector:null,
      
      background:{
        baseSelector:id('chartBackground'),
        style:true
      },
      title: {
        baseSelector:kind('title'),
        background:{
          baseSelector:kind('background'),
          style:true
        },
        texts:{
          baseSelector:kind('text'),
          style:true,
          excludeStyleProps:{contents:true}
        },
      },
      legend:{
        baseSelector:kind('legend'),
        text:{
          baseSelector:kind('text'),
          style:true
        }
      }
    };

    // Cartesian chart
    var axisMap = {
      caption:{
        baseSelector:kind('caption'),
        style:true,
        excludeStyleProps:{text:true, align:true, orient:true, spaceToLabel:true}
      },
      grid:{
        baseSelector:kind('grids').then(kind('grid')),
        style:true,
        excludeStyleProps:{hidden:true}
      },
      label:{
        baseSelector:kind('labels').then(kind('label')),
        style:true,
        excludeStyleProps:{text:true, format:true, condition:true, tryAdaptLabel:true, adapter:true, adaptLabel: true}
      },
      tick:{
        baseSelector:kind('ticks').then(kind('tick')),
        style:true,
        excludeStyleProps:{tickNumber:true}
      },
      line:{
        baseSelector:kind('line'),
        style:true
      }
    };

    var seriesMap = {
      line:{
        componentStyle: {
          baseSelector: true,
          line:{
            baseSelector:kind('lines').then(kind('line')),
            style:true
          },
          point:{
            baseSelector:kind('points').then(kind('point')),
            style:true
          },
          text:{
            baseSelector:kind("text"), 
            style:true,
            excludeStyleProps: {hidden: true}
          }
        }
      }, 
      area:{
        componentStyle:{
          baseSelector: true,
          zone:{
            baseSelector:kind('zone'),
            style:true
          },
          line:{
            baseSelector:kind('lines').then(kind('line')),
            style:true
          },
          point:{
            baseSelector:kind('points').then(kind('point')),
            style:true
          },
          text:{
            baseSelector:kind("text"), 
            style:true,
            excludeStyleProps: {hidden: true}
          }
        }
      },
      bar:{
        componentStyle :{
          baseSelector: true,
          bar :{
            baseSelector:kind('bars').then(kind('bar')),
            style:true
          },
          text:{
            baseSelector:kind("text"), 
            style:true,
            excludeStyleProps: {hidden: true}
          }
        }
      },
      scatter:{
        componentStyle: {
          baseSelector: true,
          scatter: {
            baseSelector:kind('scatters').then(kind('scatter')),
            style:true
          },
          text:{
            baseSelector:kind('text'),
            style:true,
            excludeStyleProps: {hidden: true}
          }
        }            
      }
    };

    // radar chart
    var radarGridMap = {
      baseSelector:id('grids').then(kind('grid')),
      style: true,
      excludeStyleProps: {style: true}
    };
    var radarThetaAxisMap = {
      label: {
        baseSelector:id('labels').then(kind('label')),
        style:true,
        excludeStyleProps: {format: true}
      }
    };
    var radarRhoAxisMap = {
      tickLabel:{
        baseSelector:id('ticks').then(kind('tick')),
        style:true,
        excludeStyleProps: {format: true}
      },
      spoke:{
        baseSelector:id('spokes').then(kind('spoke')),
        style:true
      }
    };
    var radarSeriesMap = {
      line:{
        componentStyle: {
          baseSelector: id('serieses').then(kind('series')),
          line:{
            baseSelector:true,
            style:true
          },
          point:{
            baseSelector:kind('item'),
            style:true
          },
          text:{
            baseSelector:kind("text"), 
            style:true,
            excludeStyleProps: {hidden: true}
          }
        }
      }, 
      area:{
        componentStyle:{
          baseSelector: id('serieses').then(kind('series')),
          zone:{
            baseSelector:kind('area'),
            style:true
          },
          line:{
            baseSelector:true,
            style:true
          },
          point:{
            baseSelector:kind("item"),
            style:true
          },
          text:{
            baseSelector:kind("text"), 
            style:true,
            excludeStyleProps: {hidden: true}
          }
        }
      }
    };

    var radarOptionMap = {
      radarGridMap : radarGridMap,
      radarThetaAxisMap : radarThetaAxisMap,
      radarRhoAxisMap : radarRhoAxisMap,
      radarSeriesMap : radarSeriesMap
    };

    return {
      commonMap: commonMap,
      axisMap : axisMap,
      seriesMap: seriesMap,
      radarOptionMap: radarOptionMap
    }
  }
);



    