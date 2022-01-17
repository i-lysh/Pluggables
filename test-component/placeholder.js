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

            const orderService = new Services.OrdersService(self);
            const printService = new Services.PrintService(self);

            console.log(orderService);
            console.log(printService);
            console.log(Services);

            if (orders.length < 1) {
                alert('Please select at least one order');
                return;
            }
            console.log(orders);
            var ids = [];
            for (var i = 0; i < orders.length; i++)
            {
                var id = orders[i].id;
                ids.push(id);
            }
            
            alert(ids.length);
            console.log(ids);

            orderService.GetOrdersById(ids, (data) =>
            {
                if(data.error != null){
                    return;
                }
                var orders = [];
                orders = data.result;
                console.log(orders);

                var items = orders.flatMap(x => x.Items);
                console.log(items);
                items.sort((a,b) =>{
                    if ( a.BinRack < b.BinRack ){
                        return -1;
                      }
                      if ( a.BinRack > b.BinRack ){
                        return 1;
                      }
                      return 0;
                });
                
                printService.GetTemplateList("Stock Item Labels", (data) =>{
                    if(data.error)
                    {
                        return;
                    }
                    var templates = data.result;
                    console.log(templates);
                    //need template name
                    var template = templates.find(t => t.TemplateName == "New Stock Item Labels");
                    printService.CreatePDFfromJobForceTemplate("Stock Item Labels", items.map(i => {return i.StockItemId}), template.pkTemplateRowId, 
                    null, "PDF", (res) =>{
                        if(res.error)
                        {
                            return;
                        }
                        var result = res.result;
                        console.log(result);
                    })
                })
                // printService.CreatePDFfromJobForceTemplate("Stock Item Labels", items, )
            });
        };

       
    };
      

    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
