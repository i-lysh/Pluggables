"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;
    const TemplateName = "Pick List Template";
    const TemplateType = "Pick List";
    const ApplicationName = "580_Test_Pluggable";
    const MacroName = "580_Test_Macro";

    var placeHolder = function ($scope, $element, controlService, openOrdersService) {

        //const _this = this;
        this.getItems = () => {
            var items = [{
                text: "Print Pick Lists",  // Button name
                key: "placeholderPrintPickListsButton",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderPrintPickListsButtonTemplate",
                    controlName: "placeholderPrintPickListsButtonTemplate"
                }
            }];

            return items;
        };

        this.isEnabled = (itemKey) => {
            return true;
        };

        this.onClick = () => {
            console.log(openOrdersService);
            var orders = $scope.viewStats.get_selected_orders();
            var locationId = $scope.viewStats.LocationId;
            const self = this;
            // console.log(openOrdersService);
            // const orderService = new Services.OrdersService(self);
            const printService = new Services.PrintService(self);
            const macroService = new Services.MacroService(self);
            // console.log(printService);
            if (orders.length < 1) {
                alert('Please select at least one order');
                return;
            }
            // console.log(orders);
            var ids = [];
            for (var i = 0; i < orders.length; i++)
            {
                var id = orders[i].id;
                ids.push(id);
            }

            var obj = {
                applicationName: ApplicationName,  
                macroName: MacroName, 
                orderIds: ids,
                templateType: TemplateType,
                templateName: TemplateName};
            macroService.Run(obj, (data) => {
                if(data.result && data.result.IsError)
                {
                    console.log(data.result.ErrorString);
                    return;
                }
                printService.OpenPrintDialog(data.result.URL);
            })
        };

       
    };
    
    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
