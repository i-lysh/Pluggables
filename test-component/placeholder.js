"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;
    const TemplateName = "Passport";

    var placeHolder = function ($scope, $element, controlService) {

        //const _this = this;
        this.getItems = () => {
            var items = [{
                text: "TEST Print Labels",  // Button name
                key: "placeholderTESTPrintLabelsButton",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderTESTPrintLabelsButtonTemplate",
                    controlName: "placeholderTESTPrintLabelsButtonTemplate"
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
            
            var pages = ids.length % 200>0 ? parseInt(ids.length/200) : parseInt(ids.length/200)+1;
            // var file;
            var items = [];
            for(var i = 0; i<pages; i++)
            {
                
                var data = await orderService.GetOrdersById(ids.filter((o, ind) => ind >= i*200 && ind < (i+1)*200), (data) => {
                    if(data.error != null){
                        return;
                    }
    
                    var orders = [];
                    orders = data.result;
    
                    // var items = orders.flatMap(x => x.Items);
                    // var items = [];
                    orders.forEach(order => {
                        order.Items.forEach(item => {
                            var index = items.findIndex(i => i.StockItemId == item.StockItemId);
                            if( index < 0)
                            {
                                items.push({StockItemId: item.StockItemId, Quantity: item.Quantity, BinRack: item.BinRack});
                            }
                            else
                            {
                                items[index].Quantity+=item.Quantity;
                            }
                        })
                    });
                });
                console.log(data);
            }
            console.log(items);

            // orderService.GetOrdersById(ids, (data) =>
            // {
            //     if(data.error != null){
            //         return;
            //     }

            //     var orders = [];
            //     orders = data.result;

            //     // var items = orders.flatMap(x => x.Items);
            //     var items = [];
            //     orders.forEach(order => {
            //         order.Items.forEach(item => {
            //             var index = items.findIndex(i => i.StockItemId == item.StockItemId);
            //             if( index < 0)
            //             {
            //                 items.push({StockItemId: item.StockItemId, Quantity: item.Quantity, BinRack: item.BinRack});
            //             }
            //             else
            //             {
            //                 items[index].Quantity+=item.Quantity;
            //             }
            //         })
            //     });
                
            //     items.sort((a,b) =>{
            //         return a.BinRack.localeCompare(b.BinRack, 'en', { numeric: true });
            //     });
                
            //     printService.GetTemplateList("Stock Item Labels", (data) =>{
            //         if(data.error)
            //         {
            //             return;
            //         }

            //         var templates = data.result;

            //         var template = templates.find(t => t.TemplateName == TemplateName);

            //         printService.CreatePDFfromJobForceTemplateWithQuantities(
            //             "Stock Item Labels", 
            //             items.map(i => {return {"Key":i.StockItemId, "Value":i.Quantity}}), 
            //             template? template.pkTemplateRowId : null, 
            //             [
            //                 {"Key":"IdType","Value":"StockId"},
            //             // {"Key":"LocationId", "Value":"00000000-0000-0000-0000-000000000000"}
            //             ], 
            //             null,
            //             (res) =>{
            //             if(res.error)
            //             {
            //                 return;
            //             }

            //             // var result = res.result;
                        
            //             // printService.OpenPrintDialog(result.URL);
            //         })
            //     })
            // });
        };

       
    };
    
    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
