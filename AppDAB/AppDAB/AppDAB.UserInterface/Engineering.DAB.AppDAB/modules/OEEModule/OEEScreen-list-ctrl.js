(function () {
    'use strict';
    angular.module('Engineering.DAB.AppDAB.OEEModule').config(ListScreenRouteConfig);

    ListScreenController.$inject = ['Engineering.DAB.AppDAB.OEEModule.OEEScreen.service', '$state', '$stateParams', '$rootScope', '$scope', 'common.base', 'common.services.logger.service'];
    function ListScreenController(dataService, $state, $stateParams, $rootScope, $scope, base, loggerService) {
        var self = this;
        var logger, rootstate, messageservice, backendService;

        activate();

        // Initialization function
        function activate() {
            logger = loggerService.getModuleLogger('Engineering.DAB.AppDAB.OEEModule.OEEScreen');

            init();
            //initGridOptions();
            //initGridData();
        }

        function init() {
            logger.logDebug('Initializing controller.......');

            rootstate = 'home.Engineering_DAB_AppDAB_OEEModule_OEEScreen';
            messageservice = base.widgets.messageOverlay.service;
            backendService = base.services.runtime.backendService;

            //Initialize Model Data
            self.selectedItem = null;
            self.isButtonVisible = false;
            self.viewerOptions = {};
            self.viewerData = [];

            //Expose Model Methods
            self.addButtonHandler = addButtonHandler;
            self.editButtonHandler = editButtonHandler;
            self.selectButtonHandler = selectButtonHandler;
            self.deleteButtonHandler = deleteButtonHandler;
            self.getOEE = getOEE;
            self.getPI = getPI;
            loadProd("", "");
            loadOEE("", "");
        }

        function initGridOptions() {
            self.viewerOptions = {
                containerID: 'itemlist',
                selectionMode: 'single',
                viewOptions: 'gl',

                // TODO: Put here the properties of the entity managed by the service
                quickSearchOptions: { enabled: true, field: 'Id' },
                sortInfo: {
                    field: 'Id',
                    direction: 'asc'
                },
                image: 'fa-cube',
                tileConfig: {
                    titleField: 'Id'
                },
                gridConfig: {
                    // TODO: Put here the properties of the entity managed by the service
                    columnDefs: [
                      { field: 'Id', displayName: 'Id' }
                    ]
                },
                onSelectionChangeCallback: onGridItemSelectionChanged
            }
        }

        function initGridData() {
            dataService.getAll().then(function (data) {
                if ((data) && (data.succeeded)) {
                    self.viewerData = data.value;
                } else {
                    self.viewerData = [];
                }
            }, backendService.backendError);
        }

        function addButtonHandler(clickedCommand) {
            $state.go(rootstate + '.add');
        }

        function editButtonHandler(clickedCommand) {
            // TODO: Put here the properties of the entity managed by the service
            $state.go(rootstate + '.edit', { id: self.selectedItem.Id, selectedItem: self.selectedItem });
        }

        function selectButtonHandler(clickedCommand) {
            // TODO: Put here the properties of the entity managed by the service
            $state.go(rootstate + '.select', { id: self.selectedItem.Id, selectedItem: self.selectedItem });
        }

        function deleteButtonHandler(clickedCommand) {
            var title = "Delete";
            // TODO: Put here the properties of the entity managed by the service
            var text = "Do you want to delete '" + self.selectedItem.Id + "'?";

            backendService.confirm(text, function () {
                dataService.delete(self.selectedItem).then(function () {
                    $state.go(rootstate, {}, { reload: true });
                }, backendService.backendError);
            }, title);
        }

        function onGridItemSelectionChanged(items, item) {
            if (item && item.selected == true) {
                self.selectedItem = item;
                setButtonsVisibility(true);
            } else {
                self.selectedItem = null;
                setButtonsVisibility(false);
            }
        }

        // Internal function to make item-specific buttons visible
        function setButtonsVisibility(visible) {
            self.isButtonVisible = visible;
        }

        function getOEE(successCallback) {
            var params = { WorkArea: '100.DM1.D103' };
            execute('GetOEEEfficiency', params).then(
                function (result) {
                    var labels = [];
                    var oee = [];
                    var le = [];
                    for (var l = result.data.LE.length - 1; l >= 0; l--)
                    {
                        labels.push(result.data.LE[l].Label);
                        le.push(result.data.LE[l].Val);
                    }
                    
                    for (var o = result.data.OEE.length - 1; o >= 0; o--) {
                        oee.push(result.data.OEE[o].Val);
                    }
                    successCallback(labels, oee, le);
                }
                );
        }

        function getPI(successCallback) {
            var params = { WorkArea: '100.DM1.D103' };
            execute('GetProductionData', params).then(
                function (result) {
                    var labels = [];
                    var producedOrders = [];
                    var producedPieces = [];

                    for (var l = result.data.ProducedOrders.length-1; l >= 0; l--) {
                        labels.push(result.data.ProducedOrders[l].Label);
                        producedOrders.push(result.data.ProducedOrders[l].Val);
                    }

                    for (var o = result.data.ProducedPieces.length - 1; o >= 0; o--) {
                        producedPieces.push(result.data.ProducedPieces[o].Val);
                    }
                    successCallback(labels, producedOrders, producedPieces);
                }
                );
        }

        function execute(name, params) {
            var commandModel = {};
            commandModel.appName = 'AppDAB';

            commandModel.commandName = name;
            commandModel.params = params;
            //return commonBase.services.runtime.backendService.invoke(commandModel).then(
            return backendService.invoke(commandModel).then(
                function (result) {
                    if (result.data && result.data.WarningMessage) {
                        //var title = uadmGlobalization.translate('sit.u4dm.warning');
                        //var text = result.data.WarningMessage;
                        //uiSvc.overlay.showMessage(title, text);
                    }
                    return result;
                });
        }

        function createConfig(details, labels) {
            return {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: details.label,
                        steppedLine: details.steppedLine,
                        data: details.data,
                        backgroundColor: details.backgroundColor,
                        borderColor: details.borderColor,
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            display: true,

                            //scaleLabel: {
                            //    display: true,
                            //    labelString: 'Day'
                            //}
                        }],
                        yAxes: [{
                            display: true,
                            //scaleLabel: {
                            //    display: true,
                            //    labelString: 'Value'
                            //}
                        }]
                    }
                }
            };
        }
        function loadProd(labelProd, dataProd) {
            //var xhttp = new XMLHttpRequest();
            var container = document.querySelector('.tabcontent');
            var containerJET = document.querySelector('.containerPRODJET');
            var containerM100 = document.querySelector('.containerPRODM100');
            var containerM80 = document.querySelector('.containerPRODM80');
            //self.getPI

            self.getPI(function (labels, producedOrders, producedPieces) {
                var steppedLineSettingsJET = [
                {
                    steppedLine: false,
                    label: 'Pezzi Prodotti',           //'Produced pieces'
                    //color: window.chartColors.yellow,
                    data: producedPieces,
                    backgroundColor: window.chartColors.orange,
                    borderColor: window.chartColors.orange
                }, {
                    steppedLine: false,
                    label: 'Ordini Completati',          //'Completed Orders'
                    //color: window.chartColors.blue,
                    data: producedOrders,
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red
                }];

                var steppedLineSettingsM100 = [
                    {
                        steppedLine: false,
                        label: 'Pezzi Prodotti',           //'Produced pieces'
                        color: window.chartColors.yellow,
                        //data: dataProd,
                        data: [],
                        backgroundColor: window.chartColors.blue,
                        borderColor: window.chartColors.blue
                    }, {
                        steppedLine: false,
                        label: 'Ordini Completati',          //'Completed Orders'
                        color: window.chartColors.blue,
                        data: [],
                        backgroundColor: window.chartColors.grey,
                        borderColor: window.chartColors.grey
                    }];

                var steppedLineSettingsM80 = [
                {
                    steppedLine: false,
                    label: 'Pezzi Prodotti',           //'Produced pieces'
                    color: window.chartColors.yellow,
                    data: [],
                    backgroundColor: window.chartColors.yellow,
                    borderColor: window.chartColors.yellow
                }, {
                    steppedLine: false,
                    label: 'Ordini Completati',          //'Completed Orders'
                    color: window.chartColors.blue,
                    data: [],
                    backgroundColor: window.chartColors.purple,
                    borderColor: window.chartColors.purple
                }];

                steppedLineSettingsJET.forEach(function (details) {
                    var div = document.createElement('div');
                    div.classList.add('chart-containerPRODJET');

                    var canvas = document.createElement('canvas');
                    div.appendChild(canvas);
                    containerJET.appendChild(div);

                    var ctx = canvas.getContext('2d');
                    var config = createConfig(details, labels);
                    new Chart(ctx, config);
                });
                steppedLineSettingsM100.forEach(function (details) {
                    var div = document.createElement('div');
                    div.classList.add('chart-containerPRODM100');

                    var canvas = document.createElement('canvas');
                    div.appendChild(canvas);
                    containerM100.appendChild(div);

                    var ctx = canvas.getContext('2d');
                    var config = createConfig(details, labels);
                    new Chart(ctx, config);
                });
                steppedLineSettingsM80.forEach(function (details) {
                    var div = document.createElement('div');
                    div.classList.add('chart-containerPRODM80');

                    var canvas = document.createElement('canvas');
                    div.appendChild(canvas);
                    containerM80.appendChild(div);

                    var ctx = canvas.getContext('2d');
                    var config = createConfig(details, labels);
                    new Chart(ctx, config);
                });

            });



        };

        function createConfigOEE(details, labels) {
            //create labels from yesterday 10 working day back
            //var labelDays = lastTenCompletedWorkingDay();
            return {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: details.label,
                        steppedLine: details.steppedLine,
                        data: details.data,
                        backgroundColor: details.backgroundColor,
                        borderColor: details.borderColor,
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            display: true,
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                min: 0,
                                max: 100,
                                //stepSize: 10,
                            }
                        }]
                    },
                    annotation: {
                        annotations: [{
                            type: 'line',
                            drawTime: 'afterDatasetsDraw',
                            id: 'strip-line-1',
                            mode: 'horizontal',
                            scaleID: 'y-axis-0',
                            value: 85,
                            borderColor: 'red',
                            borderWidth: 3
                        }]
                    }
                }
            };
        }

        function loadOEE(label, data) {
            var container = document.querySelector('.containerOEE');
            var containerJET = document.querySelector('.containerOEEJET');
            var containerM100 = document.querySelector('.containerOEEM100');
            var containerM80 = document.querySelector('.containerOEEM80');

            self.getOEE(function (labels, oee, le) {
                var steppedLineSettingsJET = [{
                    steppedLine: false,
                    label: 'OEE',
                    data: oee,
                    backgroundColor: window.chartColors.orange,
                    borderColor: window.chartColors.orange
                }, {
                    steppedLine: false,
                    label: 'LE',
                    data: le,
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red
                }];
                var steppedLineSettingsM100 = [{
                    steppedLine: false,
                    label: 'OEE',
                    data: [],
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue
                }, {
                    steppedLine: false,
                    label: 'LE',
                    data: [],
                    backgroundColor: window.chartColors.grey,
                    borderColor: window.chartColors.grey
                }];
                var steppedLineSettingsM80 = [{
                    steppedLine: false,
                    label: 'OEE',
                    data: [],
                    backgroundColor: window.chartColors.yellow,
                    borderColor: window.chartColors.yellow
                }, {
                    steppedLine: false,
                    label: 'LE',
                    data: [],
                    backgroundColor: window.chartColors.purple,
                    borderColor: window.chartColors.purple
                }];

                steppedLineSettingsJET.forEach(function (details) {
                    var div = document.createElement('div');
                    div.classList.add('chart-containerOEEJET');

                    var canvas = document.createElement('canvas');
                    div.appendChild(canvas);
                    containerJET.appendChild(div);

                    var ctx = canvas.getContext('2d');
                    var config = createConfigOEE(details, labels);
                    new Chart(ctx, config);
                });
                steppedLineSettingsM100.forEach(function (details) {
                    var div = document.createElement('div');
                    div.classList.add('chart-containerOEEM100');

                    var canvas = document.createElement('canvas');
                    div.appendChild(canvas);
                    containerM100.appendChild(div);

                    var ctx = canvas.getContext('2d');
                    var config = createConfigOEE(details, labels);
                    new Chart(ctx, config);
                });
                steppedLineSettingsM80.forEach(function (details) {
                    var div = document.createElement('div');
                    div.classList.add('chart-containerOEEM80');

                    var canvas = document.createElement('canvas');
                    div.appendChild(canvas);
                    containerM80.appendChild(div);

                    var ctx = canvas.getContext('2d');
                    var config = createConfigOEE(details, labels);
                    new Chart(ctx, config);
                });

                tablinks = document.getElementsByClassName("active");

            });


        };

    }

    ListScreenRouteConfig.$inject = ['$stateProvider'];
    function ListScreenRouteConfig($stateProvider) {
        var moduleStateName = 'home.Engineering_DAB_AppDAB_OEEModule';
        var moduleStateUrl = 'Engineering.DAB_AppDAB_OEEModule';
        var moduleFolder = 'Engineering.DAB.AppDAB/modules/OEEModule';

        var state = {
            name: moduleStateName + '_OEEScreen',
            url: '/' + moduleStateUrl + '_OEEScreen',
            views: {
                'Canvas@': {
                    templateUrl: moduleFolder + '/OEEScreen-list.html',
                    controller: ListScreenController,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'OEEScreen'
            }
        };
        $stateProvider.state(state);
    }
}());
