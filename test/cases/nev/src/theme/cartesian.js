define([
  '{pro}/theme/extractthemetemplate.js'
  ],
  function(extractThemeTemplates){
    var propItems = ["colors", "marks", "background", "title", "legend"];
    var VEItems = ["baseSelector", "background", "title", "legend"];
    var preprocessMapItems = [];

    return extractThemeTemplates("cartesian", propItems, VEItems, preprocessMapItems);
  }
);