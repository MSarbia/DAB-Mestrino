(function () {
    'use strict';

    var controllerName = 'completedOperationCtrl';

    angular.module('Siemens.SimaticIT.U4DM.AppU4DM').controller(controllerName, completedOperationCtrl);

    completedOperationCtrl.$inject = ['$q', '$state', '$stateParams', '$timeout', '$window', '$scope', 'u4dm.constants', 'u4dm.services'];

    function completedOperationCtrl($q, $state, $stateParams, $timeout, $window, $scope, u4dmConstants, u4dmSvc) {
        var vm = this;
        vm.completeOptions = {};
        var pgFields;
        init();

        function configureForProductionType(productionType) {
            switch(productionType) {
                case u4dmConstants.productionTypes.transferBatch:
                    var elems = [];
                    var materials = vm.completeParams.actualProducedMaterials;
                    if (materials[0]) {
                        elems.push({
                            PartialWorkedQuantity: materials[0].PartialWorkedQuantity,
                            ToBeSavedWorkedQuantity: materials[0].PartialWorkedQuantity,
                            Equipment: materials[0].Equipment ? materials[0].Equipment.Name : null,
                            EquipmentNId: materials[0].Equipment ? materials[0].Equipment.NId : null,
                            MaterialDefinition: materials[0].MaterialItem.MaterialDefinition
                        });
                        for (var i = 1; i < materials.length; i++) {
                            var elem = null;
                            if (materials[i].Equipment) {
                                elem = _.find(elems, function (val) {
                                    return val.EquipmentNId === materials[i].Equipment.NId
                                });
                            }
                            if (elem) {
                                elem.PartialWorkedQuantity += materials[i].PartialWorkedQuantity;
                                elem.ToBeSavedWorkedQuantity += materials[i].PartialWorkedQuantity;
                            }
                            else {
                                elems.push({
                                    PartialWorkedQuantity : materials[i].PartialWorkedQuantity,
                                    ToBeSavedWorkedQuantity: materials[i].PartialWorkedQuantity,
                                    Equipment: materials[i].Equipment ? materials[i].Equipment.Name: null,
                                    EquipmentNId: materials[i].Equipment ? materials[i].Equipment.NId: null,
                                    MaterialDefinition: materials[i].MaterialItem.MaterialDefinition
                                });
                            }
                        }
                        vm.transferBatch = elems;
                        if (vm.transferBatch.length === 1) {
                            vm.transferBatch[0].selected = true;
                        }
                        configureTransferBatchIcv(elems && elems.length > 0 ? elems[0].Equipment: false);
                    }
                    else {
                        loadMachines(vm.completeParams.equipmentList);
                        configureMachinesIcv(true);
                    }
                    
                    break;

                case u4dmConstants.productionTypes.serialized:
                    //TODO: update this to show ToBeProduced - The ActualProduced this user has already started.

                    var startedActual = _.filter(vm.completeParams.actualProducedMaterials, function (actual) {
                        return actual.PartialWorkedQuantity === 1 && actual.PausedQuantity === 0
                    });

                    if (startedActual && startedActual.length > 0) {
                        vm.serialNumbers = _.map(startedActual,
                            function (val) {
                                if (val.Equipment)
                                    val.MaterialItem.Equipment = val.Equipment;
                                return val.MaterialItem;
                            });

                        configureSerialNoIcv(vm.serialNumbers && vm.serialNumbers.length > 0 ? vm.serialNumbers[0].Equipment : false);
                    }
                    else {
                        loadMachines(vm.completeParams.equipmentList);
                        configureMachinesIcv(true);
                    }
                    break;

                case u4dmConstants.productionTypes.fullSerialized:
                case u4dmConstants.productionTypes.fullQuantity:
                    loadMachines(vm.completeParams.machinesForFull);
                    configureMachinesIcv(false);
                    break;
            }
        };

        function init() {
            // expose functions to markup
            vm.cancel = cancel;
            vm.save = save;

            vm.completeParams = u4dmSvc.data.cache.getValidatedCompleteParams();

            if (vm.completeParams) {
                // show qty input or sn list based on production type. for fullSerialized, just set all selected and don't show them.
                var productionType = vm.completeParams.productionType;

                //TODO: machine configuration
                configureForProductionType(productionType);
                
                vm.completeOptions.requestType = productionType;

                u4dmSvc.ui.sidePanel.setTitle('sit.u4dm.complete-operation-options');
                u4dmSvc.ui.sidePanel.open('e');
            } else {
                // if user refreshed page, no op selected in parent state, just return to it.
                cancel();
            }

            $timeout(function () {
                // trick ICV to resize after side panel open.  ICV uses jqLite to bind to 'resize', so this should work
                angular.element($window).trigger('resize');
            });
        }

        //HACK: used to bypass selected quantity validation problem
        function temporaryCheck(selectedItems) {
            var save = true;
            for (var i = 0; i < selectedItems.length; i++) {
                var item = selectedItems[i];
                save = item.ToBeSavedWorkedQuantity <= item.PartialWorkedQuantity && item.ToBeSavedWorkedQuantity >= 0;
                if (!save)
                    break;
            }
            return save;
        };

        /**
         * handler for save button
         */
        function save() {
            switch (vm.completeOptions.requestType) {
                case u4dmConstants.productionTypes.transferBatch:
                    if (vm.icvConfigBatch) {
                        if (temporaryCheck(vm.icvConfigBatch.getSelectedItems())) {
                            var machineAndQuantity = [];
                            vm.icvConfigBatch.getSelectedItems().forEach(function (item) {
                                machineAndQuantity.push({ equipment: item.EquipmentNId, quantity: item.ToBeSavedWorkedQuantity });
                            });
                            vm.completeOptions.machineAndQuantity = machineAndQuantity;
                        }
                        else { return; }
                    }
                    else {
                        var list = _.pluck(vm.icvConfigMachines.getSelectedItems(), "NId");
                        vm.completeOptions.equipmentList = list;
                    }
                    break;

                case u4dmConstants.productionTypes.serialized:
                    if (vm.icvConfigSerialNo) {
                        vm.completeOptions.selectedSNs = vm.icvConfigSerialNo.getSelectedItems();
                    }
                    else {
                        var list = _.pluck(vm.icvConfigMachines.getSelectedItems(), "NId");
                        vm.completeOptions.equipmentList = list;
                    }
                    break;

                case u4dmConstants.productionTypes.fullSerialized:
                case u4dmConstants.productionTypes.fullQuantity:
                    var list = _.pluck(vm.icvConfigMachines.getSelectedItems(), "NId");
                    vm.completeOptions.machinesForFull = list;
                    break;
            };
            
            u4dmSvc.messaging.post(u4dmConstants.events.COMPLETE_OPTIONS_SELECTED, vm.completeOptions);
            cancel();
        }

        /**
         * handler for cancel button
         */
        function cancel() {
            u4dmSvc.ui.sidePanel.close();
            $state.go('^');
        };

        function loadMachines(machineNIdList) {
            var deferred = $q.defer();
            var promises = [];
            vm.machines = [];

            machineNIdList.forEach(function (machineNId) {
                if (machineNId) {
                    promises.push(u4dmSvc.api.equipment.getAll("$filter=NId eq '" + machineNId + "'"));
                }
            });
            $q.all(promises).then(function (results) {
                results.forEach(function (result) {
                    //TODO: check error result or empty result
                    vm.machines.push(result.value[0]);
                });
            });
        }

        function configureMachinesIcv(singleSelection) {
            var options = u4dmSvc.icv.configureIcvByEntity(u4dmSvc.api.entities.Equipment.name, 'standard', null, null, 'item-list-machines');
            //options.filterBarOptions = '';
            options.sortInfo.field = 'Name';
            options.quickSearchOptions.field = 'Name';
            options.selectionMode = singleSelection ? 'single' : 'multi';
            //options.viewOptions = '';
            vm.icvConfigMachines = u4dmSvc.customizator.customizeICV(controllerName, options);
        }

        function configureSerialNoIcv(hasMachines) {
            var options = u4dmSvc.icv.configureIcvByEntity("ResumeActualSerialize", 'standard', null, null, 'item-list-serial');
            var index = _.findIndex(options.gridConfig.columnDefs, function (item) {
                return item.field === "Equipment.NId";
            });
            if (hasMachines) {
                options.viewMode = 'g';
            }
            else {
                options.gridConfig.columnDefs.splice(index, 1);
                options.viewMode = 'm';
            }
            
            options.enablePaging = false;
            options.filterBarOptions = 'q';
            options.selectionMode = 'single';
            options.viewOptions = '';

            vm.icvConfigSerialNo = u4dmSvc.customizator.customizeICV(controllerName, options);
        };

        function configureTransferBatchIcv(hasMachines) {
            var options = u4dmSvc.icv.configureIcvByEntity("ResumeActualTransferBatch", 'standard', null, null, 'item-list-serial');
            var index = _.findIndex(options.gridConfig.columnDefs, function (item) { return item.field === "Equipment"; });
            if(!hasMachines) options.gridConfig.columnDefs.splice(index, 1);

            options.viewMode = 'g';
            options.enablePaging = false;
            options.selectionMode = 'multi';
            options.filterBarOptions = 'q';
            options.viewOptions = '';

            vm.icvConfigBatch = u4dmSvc.customizator.customizeICV(controllerName, options);
        }

    }
})();