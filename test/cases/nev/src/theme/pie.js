define([
  '{pro}/theme/extractthemetemplate.js'
  ],
  function(extractThemeTemplates){
    var propItems = ["colors", "marks", "background", "title", "legend"];
    var VEItems = ["baseSelector", "background", "title", "legend"];
    var preprocessMapItems = [];

    console.log("pie chart______________________________________");
    console.log(extractThemeTemplates("pie", propItems, VEItems, preprocessMapItems));

    return extractThemeTemplates("pie", propItems, VEItems, preprocessMapItems);
  }
);