"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;
    const TemplateName = "Test";

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
            console.log(self);
            const orderService = new Services.OrdersService(self);
            const printService = new Services.PrintService(self);

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
            

            orderService.GetOrdersById(ids, (data) =>
            {
                if(data.error != null){
                    return;
                }
                var orders = [];
                orders = data.result;
                console.log(orders);

                var items = orders.flatMap(x => x.Items);
                
                items.sort((a,b) =>{
                    if ( a.BinRack < b.BinRack ){
                        return -1;
                      }
                      if ( a.BinRack > b.BinRack ){
                        return 1;
                      }
                      return 0;
                });
                console.log(items);
                
                printService.GetTemplateList("Stock Item Labels", (data) =>{
                    if(data.error)
                    {
                        return;
                    }
                    var templates = data.result;
                    console.log(templates);
                    //need template name
                    var template = templates.find(t => t.TemplateName == TemplateName);
                    printService.CreatePDFfromJobForceTemplate("Stock Item Labels", items.map(i => {return i.StockItemId}), template.pkTemplateRowId, 
                    [{"Key":"IdType","Value":"StockId"},
                    // {"Key":"LocationId", "Value":"00000000-0000-0000-0000-000000000000"}
                    ], null, (res) =>{
                        if(res.error)
                        {
                            return;
                        }
                        var result = res.result;
                        console.log(result);
                        printService.OpenPrintDialog(result.URL);
                    })
                })
                // printService.CreatePDFfromJobForceTemplate("Stock Item Labels", items, )
            });
        };

       
    };
      

    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
