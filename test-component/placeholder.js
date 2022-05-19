"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");
    const moment = require('moment');
    var docDefinition;
    //const Window = require("core/Window");

    var placeHolder = function ($scope, $element, $http,sessionManagerService, controlService) {

         
        this.getItems = () => {
            var items = [{
                text: "Create reports",  // Button name
                key: "placeholderCreateReportsButton",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderCreateReportsButtonTemplate",
                    controlName: "placeholderCreateReportsButtonTemplate"
                }
            }];

            return items;
        };

        this.isEnabled = (itemKey) => {
            return true;
        };

        this.onClick = () => {
            console.log(sessionManagerService);
        const self = this;
        const importService = new Services.ImportExportService(self);
        //this.isEnabled = () => false;

        importService.getDropboxAccounts(data => {
            var accounts = data.result;
            
            var n = [];
            accounts.forEach(d => n.push(`<option value="${d.Token}">${d.Name}</option>`));

            var row = angular.element('.legacy-windows-container');
            
            row[0].innerHTML = `
            <div class="lwControlBackDrop"> </div>
            <div class="lwControl dynamic" style="left: 289px; top: 84px;">
                <div class="content">
                    <content id="pluggableForm">
                    <p>Date range:</p>
                        <input id="daterangepicker"/>
                        <br/><br/>
                    <p>Dropbox folder:</p>
                        <input id="fileDestination"/>
                        <br/><br/>
                    <p>Dropbox account</p>
                        <select id="accountSelect">
                            ${n.join("\n")};
                        </select>
                        <br/>
                        <br/>
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
            });

            // $div.trigger("click");
            $('.daterangepicker').hide();

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
                var token = $('#accountSelect')[0].options[$('#accountSelect')[0].selectedIndex].value;
                var folder = $('#fileDestination')[0].value;
                if(folder && !folder.startsWith('/'))
                {
                    folder = '/'+folder;
                }
                if(folder && folder.endsWith('/'))
                {
                    folder = folder.slice(0,folder.length-1);
                }
                var startDate = $('#daterangepicker').data('daterangepicker').startDate.toISOString();
                var endDate = $('#daterangepicker').data('daterangepicker').endDate.toISOString();

                var button = angular.element(this)[0];
                button.disabled = true;

                    //return;


                 // $('#placeholderPrintLabelsButton').isEnabled = false;
            fetch("https://localhost:44322/task/readAndCreate?"+new URLSearchParams({accessToken: token, folder: folder, datefrom: startDate, dateto: endDate}), {mode: 'no-cors'})
                .then(d => {
                     
                    var row = angular.element('.legacy-windows-container');
                    row[0].innerHTML = "";
                    const picker = $div.data("daterangepicker");
                    picker.remove();

                    alert('Reports were created');

                    console.log(d);
                }).catch(err => { 
                    button.disabled = false;
                                console.log(err);
                                alert('Can not create reports');
                                });

                // const self = this;
                //var list = ('#accountSelect')

            // const orderService = new Services.OrdersService(self);
            //     console.log(orderService);
            }; 
            doBtn.innerHTML = "Create reports";
            var content = document.getElementById("pluggableForm");
                
                
            content.append(closeBtn);
            content.append(doBtn);


        });

        };

       
    };
    
    placeholderManager.register("OpenOrders_OrderControlButtons", placeHolder);

});
