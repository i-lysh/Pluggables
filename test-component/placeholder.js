"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;

    var placeHolder = function ($scope, $element, controlService) {

        //const _this = this;
        this.getItems = () => {
            var items = [{
                text: "Test Button",  // Button name
                key: "placeholderTestButton",  // Button id (unique)
                icon: "fa fa-angle-double-up",  // Button icon
                content: {
                    moduleName: "placeholderTestButtonTemplate",
                    controlName: "placeholderTestButtonTemplate"
                }
            }];

            return items;
        };

        this.isEnabled = (itemKey) => {
            return true;
        };

        this.onClick = () => {
            var orders = $scope.viewStats.get_selected_orders();

            const self = this;

            const macroService = new Services.PrintService(self);
            console.log(new macroService);

            if (orders.length < 1) {
                alert('Please select at least one order');
                return;
            }
            
            var ids = [];
            for (var i = 0; i < orders.length; i++)
            {
                var id = orders[i].id;
                ids.push(id);
            }
            
            alert(ids.length);
            console.log(ids);
        };

       
    };
      

    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
