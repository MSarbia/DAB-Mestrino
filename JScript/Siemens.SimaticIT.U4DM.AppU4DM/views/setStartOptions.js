(function () {
    'use strict';

    var controllerName = 'setStartOptionsCtrl';

    angular.module('Siemens.SimaticIT.U4DM.AppU4DM').controller(controllerName, setStartOptionsCtrl);

    setStartOptionsCtrl.$inject = ['$window', '$state', '$scope', '$timeout', 'u4dm.constants', 'u4dm.services', 'u4dm.services.runtime'];

    function setStartOptionsCtrl($window, $state, $scope, $timeout, u4dmConstants, u4dmSvc, u4dmRuntimeSvc) {

        var vm = this;
        vm.startOptions = {};
        var pgFields;
        var skipMode;
        var productionType = null;

        var mediumTileTemplate = '<div data-internal-type=\"wideItemTile\" class=\"tile\">' +
                                    '<div class=\"wide wide-item {{itemTileCtrl.selectClass}}\" ng-style=\"{\'color\': itemTileCtrl.color, \'background-color\': itemTileCtrl.bgColor}\">' +
                                        '<div class=\"wide-select\" ng-show=\"itemTileCtrl.showSelectCheck()\"></div>' +
                                        '<div ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-corner-triangle\" data-internal-type=\"selection-triangle\"></div>' +
                                        '<span ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-select-img fa fa-check fa-inverse fa-lg\" data-internal-type=\"selection-check\"></span>' +
                                        '<div class=\"wide-item-left-col\" data-internal-type=\"left-column\">' +
                                            '<div class=\"image-container-40x40\" data-internal-type=\"image-container\">' +
                                                '<div class=\"image-vcenter-32x32\" data-internal-type=\"image-vcenter\">' +
                                                   '<span ng-if=\"itemTileCtrl.tileContent.image\" class=\"fa {{itemTileCtrl.tileContent.image}} fa-2x\"></span>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class=\"wide-item-text\" data-internal-type=\"text-container\">' +
                                            '<div class=\"wide-item-title\" data-internal-type=\"title\"><strong>{{itemTileCtrl.displayTitle}}</strong></div>' +
                                            '<div class=\"{{itemTileCtrl.descriptionClass}}\" title="{{itemTileCtrl.descriptionTooltip}}" data-internal-type=\"description\">{{itemTileCtrl.displayDescription}}</div>' +
                                            '<div class=\"wide-item-properties\" data-internal-type=\"properties\">' +
                                                '<div ng-if=\"itemTileCtrl.displayProp1\" class=\"wide-item-property\"><span>{{itemTileCtrl.displayProp1.name}}</span><span>{{PROP1_VALUE}}</span></div>' +
                                                '<div ng-if=\"itemTileCtrl.displayProp2\" class=\"wide-item-property\"><span>{{itemTileCtrl.displayProp2.name}}</span><span>{{PROP2_VALUE}}</span></div>' +
                                                '<div ng-if=\"itemTileCtrl.displayProp3\" class=\"wide-item-property\"><span>{{itemTileCtrl.displayProp3.name}}</span><span>{{PROP3_VALUE}}</span></div>' +
                                                '<div align=\"right\" style=\"margin-top:3px\">' +
                                                    '<div ng-if=\"itemTileCtrl.tileContent.Locked\" style=\"display:table;width:auto\" class=\"fa fa-lock fa-2x\"></div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
        
        var largeTileTemplate = '<div data-internal-type=\"largeItemTile\" class=\"tile\" title=\"{{itemTileCtrl.displayTooltip}}\">' +
                                    '<div class=\'large large-item {{itemTileCtrl.selectClass}}\' ng-style=\"{\'color\': itemTileCtrl.color, \'background-color\': itemTileCtrl.bgColor}\">' +
                                        '<div class=\"large-select\" ng-show=\"itemTileCtrl.showSelectCheck()\"></div>' +
                                        '<div ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-corner-triangle\" data-internal-type=\"selection-triangle\"></div>' +
                                        '<span ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-select-img fa fa-check fa-lg fa-inverse\" data-internal-type=\"selection-check\"></span>' +
                                        '<div class=\"large-item-image-container-86x86\" data-internal-type=\"image-container\">' +
                                            '<div class=\"large-item-image-vcenter-62x62\" data-internal-type=\"image-vcenter\">' +
                                                '<div ng-if=\"itemTileCtrl.tileContent.image && !itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-4x {{itemTileCtrl.tileContent.image}}\"></div>' +
                                                '<div ng-if=\"itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-4x\" ng-bind-html=\"itemTileCtrl.tileContent.imageTemplate\"></div>' +
                                            '</div>' +
                                            '<span ng-if=\"itemTileCtrl.tileContent.contentStatus ===\'editing\'\" class=\"bottom-left-status-img fa fa-certificate fa-lg\" />' +
                                            '<span ng-if=\"itemTileCtrl.tileContent.contentStatus ===\'warning\'\" class=\"bottom-left-status-img fa fa-warning fa-lg\" />' +
                                        '</div>' +
                                        '<div class=\"large-item-title-container\">' +
                                            '<div class=\"item-title-vcenter\" data-internal-type=\"title\">{{itemTileCtrl.displayTitle}}</div>' +
                                        '</div>' +
                                        '<div class=\"large-item-text-container\" data-internal-type=\"text-container\">' +
                                            '<div class=\"large-item-description\" data-internal-type=\"description\">{{itemTileCtrl.displayDescription}}</div>' +
                                            '<div class=\"large-item-properties\" data-internal-type=\"properties\">' +
                                                '<div ng-if=\"itemTileCtrl.displayProp1\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp1.name}}</span><span>{{PROP1_VALUE}}</span></div>' +
                                                '<div ng-if=\"itemTileCtrl.displayProp2\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp2.name}}</span><span>{{PROP2_VALUE}}</span></div>' +
                                                '<div ng-if=\"itemTileCtrl.displayProp3\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp3.name}}</span><span>{{PROP3_VALUE}}</span></div>' +
                                                '<div align=\"right\" style=\"margin-top:3px\">' +
                                                    '<div ng-if=\"itemTileCtrl.tileContent.Locked\" style=\"display:table;width:auto\" class=\"fa fa-lock fa-4x\"></div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';


        init();
        function init() {
            // expose functions to markup
            vm.cancel = cancel;
            vm.save = save;

            vm.machineTitle = u4dmSvc.globalization.translate('sit.u4dm.opLanding.start.machines');

            skipMode = $state.params.type === "skip";

            if (getValidatedStartParams()) {

                if (!skipMode) {
                    setMachineSelectionList();
                    configureMachineIcv();
                }

                setQuantityOrMachineSelectionList();

                vm.startOptions.requestType = vm.startParams.productionType;
                vm.startOptions.skip = skipMode;
                setButtonVisible();
                u4dmSvc.ui.sidePanel.setTitle(skipMode ? 'sit.u4dm.skip-operation' : 'sit.u4dm.start-operation');
                u4dmSvc.ui.sidePanel.open('e');
            } else {
                // if user refreshed page, no op selected in parent state, just return to it.
                cancel();
            }

            setEventHandlers();

            $timeout(function () {
                // trick ICV to resize after side panel open.  ICV uses jqLite to bind to 'resize', so this should work
                angular.element($window).trigger('resize');
            });
        }

        /**
         * gets the start params from the cache
         */
        function getValidatedStartParams() {
            vm.startParams = u4dmSvc.data.cache.getValidatedStartParams();
            return vm.startParams;
        }

        /**
         * Configure and show the Machine select list, or set the selected machine, if there is only one.
         */
        function setMachineSelectionList(serialNumSelectedList) {
            if (vm.startParams.commonToBeUsedMachines.length > 0) {

                vm.startParams.commonToBeUsedMachines.some(function (m) {
                    if (m.Preferred) {
                        m.image = 'fa-star';
                        m.selected = true;
                        vm.startOptions.selectedMachine = m;
                        return true;
                    }
                });
                //it's necessary to remove from list of machines the machines already used for selected serialized
                if (serialNumSelectedList && serialNumSelectedList.length > 0) {
                    var machines = [];
                    var enableFilter = false;

                    serialNumSelectedList.forEach(function (value) {
                        var used = _.filter(vm.startParams.actualProducedMaterials, function (mat) {
                            return mat.MaterialItem.SerialNumberCode === value.SerialNumberCode
                        });
                        var list = _.pluck(used, 'Equipment_Id');
                        if (list.length > 0) {
                            enableFilter = true;
                            if (machines.length === 0)
                                machines = list;
                            else
                                machines = _.intersection(machines, list);
                        }
                    });
                    if (enableFilter)
                        vm.machines = _.filter(vm.startParams.commonToBeUsedMachines, function (value) { return _.contains(machines, value.Id) });
                    else
                        vm.machines = vm.startParams.commonToBeUsedMachines;
                    if (vm.startOptions.selectedMachine
                        && !_.contains(vm.machines, vm.startOptions.selectedMachine)) {
                        vm.startOptions.selectedMachine.selected = false;
                        vm.startOptions.selectedMachine = null;
                    }
                    //}
                }
                else {
                    vm.machines = vm.startParams.commonToBeUsedMachines;
                    //configureMachineIcv();
                }
            } else if (vm.startParams.commonToBeUsedMachines.length === 1) {
                vm.startOptions.selectedMachine = vm.startParams.commonToBeUsedMachines[0];
            }
        }

        /**
         * configure and show either the Quanty input or the Machine select list
         */
        function setQuantityOrMachineSelectionList() {
            productionType = vm.startParams.productionType;
            if (productionType === u4dmConstants.productionTypes.transferBatch) {

                vm.transferBatch = true;
                vm.maxQuantity = vm.startParams.toBeProducedMaterials.length > 0 ? vm.startParams.toBeProducedMaterials[0].Quantity : 0;
                vm.remainsSelectableQuantity = vm.maxQuantity !== 0;
                configurePropertyGrid()

            } else if (productionType === u4dmConstants.productionTypes.serialized) {
                vm.serialNumbers = _.map(vm.startParams.toBeProducedMaterials, function (val) { return val.MaterialItem; });
                configureSerialNoIcv();
                var user = u4dmSvc.security.getCurrentUser().unique_name.toUpperCase();

                //if (vm.startParams.status === u4dmConstants.workOrderOperationStatuses.PARTIAL) {// check status of work order operation
                var list = [];
                vm.startParams.actualProducedMaterials.forEach(function (item) { if (item.UserId.toUpperCase() === user && item.PartialWorkedQuantity === 0) list.push(item) });
                vm.pausedSerialNumbers = _.map(list, function (val) { return val.MaterialItem; });
                //    configureSerialPausedIcv();
                //}
            }
        }


        /**
         * handler for save button
         */
        function save() {
            if (vm.startOptions.requestType == u4dmConstants.productionTypes.transferBatch) {
                vm.startOptions.quantity = pgFields.quantity.value ? pgFields.quantity.value : 0;
            }
            u4dmSvc.messaging.post(u4dmConstants.events.START_OPTIONS_SELECTED, vm.startOptions);
            cancel();
        }

        /**
         * handler for cancel button
         */
        function cancel() {
            u4dmSvc.ui.sidePanel.close();
            $state.go('^');
        };

        function setEventHandlers() {
            $scope.$on('sit-property-grid.validity-changed', function (event, params) {
                $timeout(setButtonVisible, 0);
                //setButtonVisible();
            });
        }

        function configurePropertyGrid() {
            //TODO: probably need a complex widget here that shows max/min allowed entries.
            //      should also limit the numeric input to those values.
            pgFields = {
                quantity: {
                    id: 'quantity',
                    label: u4dmSvc.globalization.translate('sit.u4dm.quantity'),
                    value: 0,
                    read_only: vm.maxQuantity === 0 ? "true" : "false",
                    widget: "sit-numeric",
                    validation: { required: vm.maxQuantity === 0 ? false : true, min: 0, max: vm.maxQuantity }
                },
                max: {
                    id: 'max',
                    label: u4dmSvc.globalization.translate('sit.u4dm.max-quantity'),
                    value: vm.maxQuantity,
                    read_only: "true",
                    widget: "sit-text",
                    validation: { required: false }
                }
            };

            var propertyGridConfig = {
                id: 'quantityPropertyGrid',
                layout: 'Vertical',
                type: 'Fluid',
                columns: 1,
                mode: 'edit',
                data: [
                    pgFields.quantity,
                    pgFields.max
                ]
            };
            vm.propertyGridConfig = propertyGridConfig;
        }

        function configureMachineIcv() {
            var options = u4dmSvc.icv.configureIcvByEntity(u4dmSvc.api.entities.Equipment.name, 's', null, selectionChanged, 'item-list-machines');
            //options.filterBarOptions = '';
            options.selectionMode = 'single';
            options.mediumTileTemplate = mediumTileTemplate;
            options.largeTileTemplate = largeTileTemplate;
            //options.viewOptions = '';
            vm.icvConfigMachine = u4dmSvc.customizator.customizeICV(controllerName, options);
        };

        function configureSerialNoIcv() {
            var options = u4dmSvc.icv.configureIcvByEntity("OnlySerialMaterialItem", 's', null, selectionChangedSerialized, 'item-list-serial');
            options.filterBarOptions = '';
            options.viewOptions = '';
            options.selectionMode = 'single';
            vm.icvConfigSerialNo = u4dmSvc.customizator.customizeICV(controllerName, options);
        };

        //function configureSerialPausedIcv() {
        //    var options = u4dmSvc.icv.configureIcvByEntity("OnlySerialMaterialItem", 's', null, null, 'item-list-paused-serial');
        //    options.filterBarOptions = '';
        //    options.viewOptions = '';
        //    options.selectionMode = 'none';
        //    vm.icvConfigSerialNoPaused = u4dmSvc.customizator.customizeICV(controllerName, options);
        //};

        function selectionChanged(selectedItems, clickedItem) {
            // for single selection, only one will ever be selected. 
            vm.startOptions.selectedMachine = clickedItem.selected ? clickedItem : null;
            setButtonVisible();
        }

        function selectionChangedSerialized(selectedItems, clickedItem) {
            // selectedItems is never null. just may be empty
            vm.startOptions.selectedSNs = selectedItems;

            setMachineSelectionList(selectedItems);
            setButtonVisible();
        }

        function setButtonVisible() {
            var selCount = vm.startOptions.selectedSNs ? vm.startOptions.selectedSNs.length : 0;
            var fromPausedToStart = vm.startParams.status === u4dmConstants.workOrderOperationStatuses.PARTIAL
                || (vm.pausedSerialNumbers && vm.pausedSerialNumbers.length > 0);
            var snOK = !vm.serialNumbers || selCount > 0;
            var qtyOK = !vm.transferBatch || vm.maxQuantity === 0 || pgFields.quantity.value >= 0;

            if (fromPausedToStart && productionType === u4dmConstants.productionTypes.serialized) {  // the operation is paused 
                vm.showSave = true;
                return;
            }

            if (snOK && qtyOK) { // start some quantity or some serials
                vm.showSave = true;
                return;
            }

            if (vm.serialNumbers) { //not complete serial configuration (machine selected and no serial, or no machine selected and some serials)
                vm.showSave = selCount === 0;
            }
            else { //not complete new quantity configuration (machine selected and no quantity, or no machine selected and some quantity)
                vm.showSave = !vm.transferBatch || (vm.transferBatch && pgFields.quantity.value && pgFields.quantity.value !== '');
            }
        }
    }

})();