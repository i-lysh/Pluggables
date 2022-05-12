"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");
    const moment = require('moment');
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
            
        $http({
            method: "GET",
            url: "https://localhost:44322/task/connect"
        }).then(function(data){console.log(data)});

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
            console.log(moment());

var row = angular.element('.legacy-windows-container');
                row[0].innerHTML = `<div class="lwControlBackDrop"> </div>
        <div class="lwControl dynamic" style="left: 289px; top: 84px;">
            <div class="content">
                <content id="pluggableForm">
<input id="daterangepicker"/>
                </content>
            </div>
        </div>`;
                row = angular.element('#daterangepicker');
                var $div = $(row[0]);
                    $div.daterangepicker({
                alwaysShowCalendars: true,
                showDate: true,
                opens: 'left',
                maxDate: "0",
                autoApply: true,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, function (from, to) {
                // if (($scope.dateFilter.fromDate === null || $scope.dateFilter.fromDate.toISOString() !== from.toISOString()) || ($scope.dateFilter.toDate === null || $scope.dateFilter.toDate.toISOString() !== to.toISOString())) {
                //     $scope.dateFilter.fromDate = from;
                //     $scope.dateFilter.toDate = to;
                //     $scope.updateFilters();
                // }
                console.log("some function");
            });
                $div.trigger("click");
                // picker.style.display ="none";
            // $div.off("click.daterangepicker");
            // $div.on("show.daterangepicker", function () {
        //picker.container.appendTo($div);
        var closeBtn = document.createElement("Button");
        closeBtn.onclick = function () {
                var row = angular.element('.legacy-windows-container');
                row[0].innerHTML = "";
                const picker = $div.data("daterangepicker");
                picker.remove();
                return;
        }; 
        closeBtn.innerHTML = "Close";

        var doBtn = document.createElement("Button");
        doBtn.onclick = function () {
                // const self = this;
                
            // const orderService = new Services.OrdersService(self);
            //     console.log(orderService);
        }; 
        doBtn.innerHTML = "Create reports";
        var content = document.getElementById("pluggableForm");
                
                
        content.append(closeBtn);
        content.append(doBtn);


            // const picker = $div.data("daterangepicker");
            // $div.off("click.daterangepicker");
            // $div.on("show.daterangepicker", function () {
            //     picker.container.appendTo($div);
            //     $(document).off('.daterangepicker');
            //     $(window).off('.daterangepicker');

            //     picker.hide = function () {
            //         if (!this.endDate) {
            //             this.startDate = this.oldStartDate.clone();
            //             this.endDate = this.oldEndDate.clone();
            //         }

            //         if ((!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)) || this.startDate.format('LL') === this.endDate.format('LL'))
            //             this.callback(this.startDate, this.endDate, this.chosenLabel);

            //         this.updateCalendars();
            //         this.updateElement();
            //     };
            // });

            // picker.show();
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
