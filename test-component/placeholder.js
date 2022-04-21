"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");
    const moment = require('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js');
    var docDefinition;
    const TemplateName = "Passport";
    //const Window = require("core/Window");

    var placeHolder = function ($scope, $element, controlService) {
        // var input = document.createElement() 
        // document.getElementsByClassName("")[0].append();
        // console.log();
        // console.log($scope);
        //const _this = this;
        //var row = angular.element(document.getElementsByClassName("navigation-item tight"));
        // var row = angular.element('lw-extension-directive');
        // var element = row[0];
        // //console.log(row[2]);

        // var container = document.getElementsByClassName("legacy-windows-container");
        // container.innerHTML = `
        // <div class="lwControlBackDrop"> </div>
        // <div class="lwControl dynamic" style="left: 289px; top: 84px;">
        //     <div class="content">
        //         <content>
        //         </content>
        //     </div>
        // </div>`;
            
        this.getItems = () => {
            var items = [{
                text: "Print Labels",  // Button name
                key: "placeholderPrintLabelsButton",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderPrintLabelsButtonTemplate",
                    controlName: "placeholderPrintLabelsButtonTemplate"
                }
            }];

            return items;
        };

        this.isEnabled = (itemKey) => {
            return true;
        };

        this.onClick = () => {
            this.isEnabled = () => false;

            var orders = $scope.viewStats.get_selected_orders();

            const self = this;

            const orderService = new Services.OrdersService(self);
            const printService = new Services.PrintService(self);

            if (orders.length < 1) {
                alert('Please select at least one order');
                this.isEnabled = () => true;
                return;
            }

            var ids = [];
            for (var i = 0; i < orders.length; i++)
            {
                var id = orders[i].id;
                ids.push(id);
            }
            
            let pages = ids.length % 200>0 ? parseInt(ids.length/200)+1 : parseInt(ids.length/200);
            // var file;
            let items = [];
            let promises = [];
            for(let i = 0; i<pages; i++)
            {
                let p = new Promise((resolved, rejected) => {
                    orderService.GetOrdersById(ids.filter((o, ind) => ind >= i*200 && ind < (i+1)*200), (data) => {
                        if(data.error != null){
                            console.log(data.error);
                            resolved();
                        }
        
                        let orders = [];
                        orders = data.result;
                        
                        // var items = orders.flatMap(x => x.Items);
                        // var items = [];
                        orders.forEach(order => {
                            order.Items.forEach(item => {
                                let index = items.findIndex(i => i.StockItemId == item.StockItemId);
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
                        resolved();
                    })
                });

                promises.push(p);
            }
            
            Promise.all(promises).then(() => {
                items.sort((a,b) =>{
                    return a.BinRack.localeCompare(b.BinRack, 'en', { numeric: true });
                });
                
                printService.GetTemplateList("Stock Item Labels", (data) =>{
                    if(data.error)
                    {
                        this.isEnabled = () => true;
                        console.log(data.error);
                        return;
                    }

                    var templates = data.result;

                    var template = templates.find(t => t.TemplateName == TemplateName);

                    printService.CreatePDFfromJobForceTemplateWithQuantities(
                        "Stock Item Labels", 
                        items.map(i => {return {"Key":i.StockItemId, "Value":i.Quantity}}), 
                        template? template.pkTemplateRowId : null, 
                        [
                            {"Key":"IdType","Value":"StockId"},
                        // {"Key":"LocationId", "Value":"00000000-0000-0000-0000-000000000000"}
                        ], 
                        null,
                        (res) =>{
                        this.isEnabled = () => true;
                        if(res.error)
                        {
                            console.log(res.error);
                            return;
                        }

                        // var result = res.result;
                        
                        // printService.OpenPrintDialog(result.URL);
                    })
                })
            })
        };

       
    };
    
    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
