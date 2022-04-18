"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;
    const TemplateName = "Passport";

    var wind = require('core/Window');

    var placeHolder = function ($scope, $element, controlService) {
        var win = new wind({
            moduleName: "Test",
            windowName: "Test",
            title:
              "Test window",
            closeOnEscape: false,
            closeOnBackDrop: false,
            data: {},
            width: "680px",
            height: "905px",
            ngScope: $scope,
          });
    
          win.open();
        //const _this = this;
       
       
    };
    
    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
