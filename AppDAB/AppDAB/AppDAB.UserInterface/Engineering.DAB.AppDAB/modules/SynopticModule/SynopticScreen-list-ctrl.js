(function () {
    'use strict';
    angular.module('Engineering.DAB.AppDAB.SynopticModule').config(ListScreenRouteConfig);

    ListScreenController.$inject = ['Engineering.DAB.AppDAB.SynopticModule.SynopticScreen.service', '$state', '$stateParams', '$rootScope', '$scope', 'common.base', 'common.services.logger.service'];
    function ListScreenController(dataService, $state, $stateParams, $rootScope, $scope, base, loggerService) {
        var self = this;
        var logger, rootstate, messageservice, backendService;

        activate();

        // Initialization function
        function activate() {
            logger = loggerService.getModuleLogger('Engineering.DAB.AppDAB.SynopticModule.SynopticScreen');

            init();
//            initGridOptions();
//            initGridData();
        }

        function init() {
            logger.logDebug('Initializing controller.......');

            rootstate = 'home.Engineering_DAB_AppDAB_SynopticModule_SynopticScreen';
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

            myRefresh();
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
    }

    ListScreenRouteConfig.$inject = ['$stateProvider'];
    function ListScreenRouteConfig($stateProvider) {
        var moduleStateName = 'home.Engineering_DAB_AppDAB_SynopticModule';
        var moduleStateUrl = 'Engineering.DAB_AppDAB_SynopticModule';
        var moduleFolder = 'Engineering.DAB.AppDAB/modules/SynopticModule';

        var state = {
            name: moduleStateName + '_SynopticScreen',
            url: '/' + moduleStateUrl + '_SynopticScreen',
            views: {
                'Canvas@': {
                    templateUrl: moduleFolder + '/SynopticScreen-list.html',
                    controller: ListScreenController,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'SynopticScreen'
            }
        };
        $stateProvider.state(state);
    }
}());


//*********************************************************************
// From DataManager.js
//
function drawLineChart(URL_ANDON_GET_DATA, onComplete) {

    if (!URL_ANDON_GET_DATA)
        URL_ANDON_GET_DATA = "http://localhost/WebserviceAndon/Andon/Andon/GetOEEvalues";

    // Add a helper to format timestamp data
    Date.prototype.formatMMDDYYYY = function () {
        return (this.getMonth() + 1) +
            "/" + this.getDate() +
            "/" + this.getFullYear();
    }

    //$.ajax({
    //    //url: "http://localhost:25412/Andon/Andon/GetOEEvalues",
    //    url: URL_ANDON_GET_DATA,
    //    //url: "WebserviceAndon/GetOEEvalues",
    //    type: 'POST',
    //    dataType: 'json',
    //    timeout: 30000,
    //    cache: false
    //}).done(function (results) {

    //    // Split timestamp and data into separate arrays
    //    /*
    //            var labels = [], data = [];
    //            results["packets"].forEach(function (packet) {
    //                labels.push(new Date(packet.timestamp).formatMMDDYYYY());
    //                data.push(parseFloat(packet.payloadString));
    //            });

    //            loadProd(labelProd, dataProd);
    //            loadOEE(labelOEE, dataOEE);
    //    */
    loadProd("", "");
    loadOEE("", "");

    //    $("#gigietto").html(results.ProductionLineId);
    //    ANDON.SetData()
    //    onComplete();

    //})
    //.error(function (err) {

    //    MyTrace(1, "ERR:" + JSON.stringify(err))

    //    try {
    //        xhr.abort();
    //    }
    //    catch (e) { }
    //    ANDON.timestampAjax = ANDON.getTime();
    //    ANDON.webServiceStatus = 0;
    //    $("#ANDON_WS_STATUS").css("background-color", "red");
    //});
}

function refreshSynoptic(URL_SYNOPTIC_GET_DATA, onComplete) {
    if (!URL_SYNOPTIC_GET_DATA)
        URL_SYNOPTIC_GET_DATA = "http://localhost/WebserviceAndon/Andon/Andon/GetSynopticvalues";

    $.ajax({
        url: URL_SYNOPTIC_GET_DATA,
        //url: "WebserviceAndon/GetOEEvalues",
        type: 'POST',
        dataType: 'json',
        timeout: 30000,
        cache: false
    }).done(function (results) {

        $("#btnJET").html(results.LineName);

        onComplete();

    })
    //.error(function (err) {

    //    MyTrace(1, "ERR:" + JSON.stringify(err))

    //    try {
    //        xhr.abort();
    //    }
    //    catch (e) { }
    //    ANDON.timestampAjax = ANDON.getTime();
    //    ANDON.webServiceStatus = 0;
    //    $("#ANDON_WS_STATUS").css("background-color", "red");
    //});
}

//*********************************************************************
// From Synoptic.js
//
jQuery(window).ready(function () {
    var modalTriggerBts = $('a[data-type="cd-modal-trigger"]'),
        coverLayer = $('#mainContent');

    modalTriggerBts.each(function () {
        initModal($(this));
    });

    function initModal(modalTrigger) {
        var modalTriggerId = modalTrigger.attr('id'),
            modal = $('.cd-modal[data-modal="' + modalTriggerId + '"]');
        svgCoverLayer = modal.children('.cd-svg-bg'),
        //paths = svgCoverLayer.find('path'),
        //pathsArray = [];
        //store Snap objects
        //pathsArray[0] = Snap('#' + paths.eq(0).attr('id')),
        //    pathsArray[1] = Snap('#' + paths.eq(1).attr('id')),
        //    pathsArray[2] = Snap('#' + paths.eq(2).attr('id'));

        //store path 'd' attribute values	
        //var pathSteps = [];
        //pathSteps[0] = svgCoverLayer.data('step1');
        //pathSteps[1] = svgCoverLayer.data('step2');
        //pathSteps[2] = svgCoverLayer.data('step3');
        //pathSteps[3] = svgCoverLayer.data('step4');
        //pathSteps[4] = svgCoverLayer.data('step5');
        //pathSteps[5] = svgCoverLayer.data('step6');

        //open modal window
    modalTrigger.on('click', function (event) {
        event.preventDefault();
        modal.addClass('modal-is-visible');
        coverLayer.addClass('modal-is-visible');
        //animateModal(pathsArray, pathSteps, duration, 'open');
    });

        //close modal window
        modal.on('click', '.modal-close', function (event) {
            event.preventDefault();
            modal.removeClass('modal-is-visible');
            coverLayer.removeClass('modal-is-visible');
            //animateModal(pathsArray, pathSteps, duration, 'close');
        });
    }

    myScale();
    //    myRefresh();      //moved in function init()

});

function myRefresh() {
    //refreshSynoptic(function () { setTimeout("myRefresh()", 1000) });

    jQuery("#btnJET").html("<div><b>Linea JET</b><br />OPR: 10<br />LE: 100<br /></div>");
    jQuery("#btnM80").html("<div><b>Linea M80</b><br />OPR: 10<br />LE: 100<br /></div>");
    jQuery("#btnM100").html("<div><b>Linea M100</b><br />OPR: 10<br />LE: 100<br /></div>");

    $("#btnM100").remove("buttonStyle");
    $("#btnM100").addClass("buttonAlarmsStyle");


    $("#qtaImpostata").innerHTML = "<text>cambio testo</text>";
}

function myScale() {
    if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
        var wWin = window.innerWidth;
        var hWin = window.innerHeight;

        $("#svgSynoptic").width(wWin - 32);
        $("#svgSynoptic").height(hWin - 32);
        $("#bgSynoptic").width(wWin - 32);
        $("#bgSynoptic").height(hWin - 32);
    }
}
