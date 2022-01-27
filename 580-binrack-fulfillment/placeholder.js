"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;
    const TemplateName = "Label Template";

    var placeHolder = function ($scope, $element, controlService) {

        //const _this = this;
        this.getItems = () => {
            var items = [{
                text: "Print Labels 2",  // Button name
                key: "placeholderPrintLabels2Button",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderPrintLabelsButton2Template",
                    controlName: "placeholderPrintLabelsButton2Template"
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
            console.log(orderService);
            orderService.getOpenOrders(ids.length, 1, 
                {
                    BooleanFields: [
                        {Value: true, FieldCode: 108}
                    ],
                    ListFields: ids.map(id =>  { return {Value: id, Type: 'Is', FieldCode: 2 }})
                },[],null,'',(data) =>{
                    console.log(data);
                }
            )
            // orderService.GetOrdersById(ids, (data) =>
            // {
            //     if(data.error != null){
            //         return;
            //     }

            //     var orders = [];
            //     orders = data.result;

            //     // // var items = orders.flatMap(x => x.Items);
            //     // var items = [];
            //     // orders.forEach(order => {
            //     //     order.Items.forEach(item => {
            //     //         var index = items.findIndex(i => i.StockItemId == item.StockItemId);
            //     //         if( index < 0)
            //     //         {
            //     //             items.push({StockItemId: item.StockItemId, Quantity: item.Quantity, BinRack: item.BinRack});
            //     //         }
            //     //         else
            //     //         {
            //     //             items[index].Quantity+=item.Quantity;
            //     //         }
            //     //     })
            //     // });
                
            //     // items.sort((a,b) =>{
            //     //     return a.BinRack.localeCompare(b.BinRack, 'en', { numeric: true });
            //     // });
                
            //     // printService.GetTemplateList("Stock Item Labels", (data) =>{
            //     //     if(data.error)
            //     //     {
            //     //         return;
            //     //     }

            //     //     var templates = data.result;

            //     //     var template = templates.find(t => t.TemplateName == TemplateName);

            //     //     printService.CreatePDFfromJobForceTemplateWithQuantities(
            //     //         "Stock Item Labels", 
            //     //         items.map(i => {return {"Key":i.StockItemId, "Value":i.Quantity}}), 
            //     //         template.pkTemplateRowId, 
            //     //         [
            //     //             {"Key":"IdType","Value":"StockId"},
            //     //         // {"Key":"LocationId", "Value":"00000000-0000-0000-0000-000000000000"}
            //     //         ], 
            //     //         null,
            //     //         (res) =>{
            //     //         if(res.error)
            //     //         {
            //     //             return;
            //     //         }

            //     //         // var result = res.result;
                        
            //     //         // printService.OpenPrintDialog(result.URL);
            //     //     })
            //     // })
            // });
        };

       
    };
    
    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
