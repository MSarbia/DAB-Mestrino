(function () {
    'use strict';
    var controllerName = 'ncSupervisor_ncChangeAccept_Ctrl';
    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.NCSupervisor')
    .controller(controllerName, [
                                      '$q',
                                      '$scope',
                                      '$state',
                                      '$stateParams',
                                      'u4dm.constants',
                                      'u4dm.services',
                                      'ncSupervisor_Svc',
                                       ncChangeAcceptCtrl
    ]);

    function ncChangeAcceptCtrl(
    $q,
    $scope,
    $state,
    $stateParams,
    u4dmConstants,
    u4dmSvc,
    ncsupervisorsvc) {

        var vm                = this;
        var propGridMgr       = new u4dmSvc.propertyGridSvc($scope, this, 'edit');
        var propGridFields    = {};
        var propMapper        = {};
        var currentNCChange   = null;
        var currentItem       = {};
        var sequenceRange     = { minVal: null, maxVal: null }; 
        var icon              = u4dmSvc.icons.icon;
        vm.validInputs        = false;
        vm.operationsInStatus = [];
        vm.operations         = [];
        vm.dataCollections    = [];
        vm.materialsTBC       = [];
        vm.dependencies       = [];
        vm.dependecyTypes     = [];
        vm.steps              = [];
        vm.machinesTBU        = [];
        vm.operationsProcess  = [];

        vm.isDCDtoSN = false;
        vm.dcdToSN = [];

        vm.OperationName = u4dmSvc.globalization.translate("sit.u4dm.operation-name");
        vm.OperationNewName = u4dmSvc.globalization.translate("sit.u4dm.new-operation-name");
        vm.Machine = u4dmSvc.globalization.translate("sit.u4dm.machine");
        vm.Description = u4dmSvc.globalization.translate("sit.u4dm.description");

        vm.atLeastOneChecked = function () {
            return vm.operationsInStatus.filter(function (op) { return op.toRepeat; }).length > 0;
        };

        var sidePanelManager = u4dmSvc.ui.sidePanel;

        function setEventHandlers() {
            u4dmSvc.messaging.subscribe($scope, 'sit-property-grid.validity-changed', function (event, params) {
                vm.validInputs = params.validity;
            });
        }

        function loadConfKeys() {
            return ncsupervisorsvc.getConfKeyRefNumber().then(function (confKey) {
                vm.RefNumberMandatory = confKey.value[0].Val.toLowerCase() === "true";
            });
        }

        function refreshPropertyGrid() {
            getPropertyGridValues();
            configurePropertyGrid();
        }

        function getStandardPropertyGridValues(obj) {
            var values = obj;

            values.operationName     = propGridFields.opName.value;
            values.notes             = propGridFields.notes.value;
            values.depType           = propGridFields.depType.value;
            values.machine           = propGridFields.machine.value;
            values.material          = propGridFields.material.value;
            values.materialTBC       = propGridFields.materialTBC.value;
            values.operation         = propGridFields.operation.value;
            values.operationFrom     = propGridFields.operationFrom.value;
            values.operationTo       = propGridFields.operationTo.value;
            values.dataCollection    = propGridFields.dataCollection.value;
            values.quantity          = propGridFields.quantity.value;
            values.machineTBU        = propGridFields.machineTBU.value;
            values.materialSpec      = propGridFields.materialSpec.value;
            values.step              = propGridFields.step.value;
            values.refNumber         = propGridFields.refNumber.value;
            values.operationProcess  = propGridFields.operationsProcess.value;
            values.operationSequence = propGridFields.opSequence.value;
            values.description       = propGridFields.description.value;
        }

        function getPropertyGridValues() {
            vm.propertyGridConfig.getValues(currentItem, getStandardPropertyGridValues);
        }

        function configurePropertyGrid() {
            propGridMgr.clear();
            propGridFields = {};

            propGridFields.refNumber = propGridMgr.createTextProperty({
                id: 'refNumber',
                labelKey: 'sit.u4dm.ref-number',
                value: currentItem.refNumber,
                required: vm.RefNumberMandatory
            });

            propGridFields.opName = propGridMgr.createTextProperty({
                id: 'opName',
                labelKey: 'sit.u4dm.operation-name',
                value: currentItem.operationName,
                required: currentNCChange.ChangeType.Id != u4dmConstants.changeTypesIds.ADD_PROCESS_OPERATION
            });

            propGridFields.opSequence = propGridMgr.createNumericProperty({
                id: 'opSequence',
                labelKey: 'sit.u4dm.sequence',
                value: currentItem.operationSequence,
                required: currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.ADD_PROCESS_OPERATION,
                minVal: sequenceRange.minVal,
                maxVal: sequenceRange.maxVal
            });

            propGridFields.notes = propGridMgr.createTextAreaProperty({
                id: 'notes',
                labelKey: 'sit.u4dm.notes',
                value: currentItem.notes
            });

            propGridFields.changingDep = propGridMgr.createTextProperty({
                id: 'changingDep',
                labelKey: 'sit.u4dm.dependency',
                value: currentItem.changingDep,
                readOnly: true,
                required: true
            });

            propGridFields.depType = propGridMgr.createComboBoxProperty({
                id: 'depType',
                labelKey: 'sit.u4dm.dependency-type',
                value: currentItem.depType,
            //    value: vm.currentItem.UOM ? vm.currentItem.UOM : vm.defaultUoM,
                dataSource: vm.dependecyTypes,
                displayProperty: 'localizedName',
                valueProperty: 'NId',
            });

            propGridFields.machine = propGridMgr.createEntityPickerProperty({
                id: 'machine',
                labelKey: 'sit.u4dm.machine',
                value: currentItem.machine,
                dataSource: { getAll: loadPlants },
                displayProperty: 'Name',
                required: true,
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EPServer(u4dmSvc.api.entityList.Equipment, loadPlants)
            });

            propGridFields.materialSpec = propGridMgr.createEntityPickerProperty({
                id: 'materialSpec',
                labelKey: 'sit.u4dm.material-specification-type',
                value: currentItem.materialSpec,
                dataSource: vm.materialSpecTypes,
                displayProperty: 'NId',
                required: true
            });

            propGridFields.step = propGridMgr.createEntityPickerProperty({
                id: 'step',
                labelKey: 'sit.u4dm.step',
                value: currentItem.step,
                dataSource: vm.steps,
                displayProperty: 'Name',
                invisible: vm.currentOperation == null,
                onChange: stepSelected,
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.Step)
            });

            function stepSelected() {
                if (currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.ADD_DATA_COLLECTION) {
                    propGridFields.materialTBC.value = null;
                    refreshPropertyGrid();
                }
            }

            propGridFields.material = propGridMgr.createEntityPickerProperty({
                id: 'material',
                labelKey: 'sit.u4dm.material',
                value: currentItem.material,
                dataSource: { getAll: loadMaterials, searchField: 'Name' },
                displayProperty: 'NameRevision',
                required: true,
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EPServer(u4dmSvc.api.entityList.MaterialDefinition, loadMaterials)

            });

            propGridFields.materialTBC = propGridMgr.createEntityPickerProperty({
                id: 'materialTBC',
                labelKey: 'sit.u4dm.material-to-be-consumed',
                value: currentItem.materialTBC,
                invisible: vm.currentOperation == null,
                dataSource: vm.materialsTBC,
                displayProperty: 'NameRevision',
                required: currentNCChange.ChangeType.Id != u4dmConstants.changeTypesIds.ADD_DATA_COLLECTION,
                onChange: materialSelected
            });

            function materialSelected() {
                if (currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.ADD_DATA_COLLECTION) {
                    propGridFields.step.value = null;
                    refreshPropertyGrid();
                }
            }

            propGridFields.operation = propGridMgr.createEntityPickerProperty({
                id: 'operations',
                labelKey: currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.REPEAT_OPERATION ? 'sit.u4dm.ncSupervisor.property-grid.operation-after-repeat' : 'sit.u4dm.operation',
                value: currentItem.operation,
                required: true,
                dataSource: vm.operations,
                displayProperty: 'Label',
                onChange: operationSelected,
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.Operation)
            });

            function operationSelected(oldVal, newVal) {
                vm.currentOperation = newVal;
                switch (currentNCChange.ChangeType.Id) {
                    case u4dmConstants.changeTypesIds.ADD_OPERATION:
                    case u4dmConstants.changeTypesIds.ADD_PART:
                    case u4dmConstants.changeTypesIds.REMOVE_PART:
                    case u4dmConstants.changeTypesIds.REPLACE_PART:
                    case u4dmConstants.changeTypesIds.CHANGE_PART_QTY:
                    case u4dmConstants.changeTypesIds.CHANGE_WORKPLACE:
                        $q.all([loadToBeUsedMachines(), loadMaterialTBC()]).then(
                        function () {
                            refreshPropertyGrid();
                        });
                    case u4dmConstants.changeTypesIds.ADD_PROCESS_OPERATION:
                        setMinAndMaxRangeForSequence(vm.currentOperation, vm.operations);
                        refreshPropertyGrid();
                    case u4dmConstants.changeTypesIds.ADD_DCD_TO_SN:
                        loadSerialNumber().then(function () {
                            vm.icvConfig.selectAll(false);
                            vm.icvConfig.dataUpdated();
                        });
                };
            };
            propGridFields.operationFrom = propGridMgr.createEntityPickerProperty({
                id: 'operationFrom',
                labelKey: 'sit.u4dm.ncSupervisor.property-grid.operation-from',
                value: currentItem.operationFrom,
                required: true,
                dataSource: vm.operations,
                displayProperty: 'NameSequence',
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.Operation)
           
            });

            propGridFields.operationTo = propGridMgr.createEntityPickerProperty({
                id: 'operationTo',
                labelKey: 'sit.u4dm.ncSupervisor.property-grid.operation-to',
                value: currentItem.operationTo,
                required: true,
                dataSource: vm.operations,
                displayProperty: 'NameSequence',
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.Operation)
            
            });

            propGridFields.processes = propGridMgr.createEntityPickerProperty({
                id: 'processes',
                labelKey: 'sit.u4dm.process',
                value: currentItem.process,
                dataSource: vm.processes,
                displayProperty: 'NameAndRevision',
                required: true,
                onChange: processSelected,
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.Process)
            });

            propGridFields.operationsProcess = propGridMgr.createEntityPickerProperty({
                id: 'operationsProcess',
                labelKey: 'sit.u4dm.operation',
                value: currentItem.operationProcess,
                required: true,
                dataSource: vm.operationsProcess,
                displayProperty: 'NId',
                pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.Operation)
            });

            function processSelected() {
                currentItem.process = propGridFields.processes.value;
                vm.currentProcess = propGridFields.processes.value;
                $q.all([loadProcessOperations(vm.currentProcess.Id)]).then(
                    function () {
                        refreshPropertyGrid();
                    });
            };

   

            propGridFields.dataCollection = propGridMgr.createEntityPickerProperty({
                    id: 'dataColl',
                    labelKey: 'sit.u4dm.data-collections',
                    value: currentItem.datCollection,
                    required: true,
                    dataSource: vm.dataCollections,
                    displayProperty: 'Name',
                    pickerOptions: u4dmSvc.icv.configureIcvByEntity4EP(u4dmSvc.api.entityList.DCDTask)
            });

            propGridFields.quantity = propGridMgr.createNumericProperty({
                    id: 'quantity',
                    labelKey: 'sit.u4dm.quantity',
                    value: currentItem.quantity,
                    required: true
            });

            propGridFields.depToRemove = propGridMgr.createTextProperty({
                    id: 'depToRemove',
                    labelKey: 'sit.u4dm.ncSupervisor.accept.dependency-to-remove',
                    value: currentItem.depToRemove,
                    readOnly: true
            });

            propGridFields.description = propGridMgr.createTextAreaProperty({
                id: 'description',
                labelKey: 'sit.u4dm.description',
                value: currentItem.description
            });

            propGridFields.machineTBU = propGridMgr.createEntityPickerProperty({
                    id: 'machineTBU',
                    labelKey: 'sit.u4dm.machine-to-be-used',
                    invisible: vm.currentOperation == null,
                    value: currentItem.machineTBU,
                    required: vm.machinesTBU && vm.machinesTBU.length > 0,
                    dataSource: vm.machinesTBU,
                    displayProperty: 'Label'
            });

            propGridMgr.data = propMapper[currentNCChange.ChangeType.Id].propConfig();
            propGridMgr.getValues = getStandardPropertyGridValues;

            vm.propertyGridConfig = u4dmSvc.customizator.customizePropertyGrid(controllerName, propGridMgr, currentItem);
        }

        function refreshPropertyGrid() {
            getPropertyGridValues();
            configurePropertyGrid();
        }

        function configureICV() {
            var options = u4dmSvc.icv.configureIcvByEntity(u4dmSvc.api.entityList.ActualProducedMaterial, 'standard', /*serverPagingHandler,*/ null, null, 'workorder-list');

            options.viewMode = 'm';
            options.selectionMode = 'multi';

            vm.icvConfig = u4dmSvc.customizator.customizeICV(controllerName, options);
        }

        function configPropMapper() {
            // Add operation
            var addOperation = propMapper[u4dmConstants.changeTypesIds.ADD_OPERATION] = {};
            addOperation.propConfig = function () {
                propGridFields.operation.label = u4dmSvc.globalization.translate('sit.u4dm.ncSupervisor.property-grid.insert-after-operation');
                return [
                    propGridFields.opName,
                    propGridFields.description,
                    propGridFields.operation,
                    propGridFields.opSequence,
                    propGridFields.depType,
                    propGridFields.machine,
                    propGridFields.refNumber,
                    propGridFields.notes
                ];
            };
            addOperation.dataConfig = function () {
                return [
                    loadDependencyTypes(),
                    loadOperations([u4dmConstants.workOrderOperationStatuses.OPEN,
                                    u4dmConstants.workOrderOperationStatuses.PARTIAL,
                                    u4dmConstants.workOrderOperationStatuses.FUTURE_HOLD,
                                    u4dmConstants.workOrderOperationStatuses.COMPLETE], true)
                ];
            };
            addOperation.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptAddOperation(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Remove operation
            var removeOperation = propMapper[u4dmConstants.changeTypesIds.REMOVE_OPERATIONS] = {};
            removeOperation.propConfig = function () {
                return [
                    propGridFields.operation,
                    propGridFields.notes,
                    propGridFields.refNumber
                ];
            };
            removeOperation.dataConfig = function () {
                return [loadOperationsInStatus([u4dmConstants.workOrderOperationStatuses.OPEN])];
            };
            removeOperation.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptRemoveOperation(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Repeat operation
            var repeatOperation = propMapper[u4dmConstants.changeTypesIds.REPEAT_OPERATION] = {};
            repeatOperation.propConfig = function () {
                return [
                    propGridFields.operation,
                    propGridFields.notes,
                    propGridFields.refNumber
                ];
            };
            repeatOperation.dataConfig = function () {
                return [
                    loadOperations(null, true),
                    loadOperationsInStatus([u4dmConstants.workOrderOperationStatuses.COMPLETE], true),
                    loadPlants()
                ];
            };
            repeatOperation.accept = function () {
                getPropertyGridValues();
                var data = {};
                data.WorkOrderId = currentNCChange.WorkOrderOperation.WorkOrder.Id;
                data.AfterWorkorderOperationId = currentItem.operation.Id;
                data.NonConformanceNId = currentNCChange.NonConformance.NId;
                data.RefNumber = currentItem.refNumber;
                data.CloseNotes = currentItem.notes;
                data.ChangeDetails = [];

                var toRepeat = vm.operationsInStatus.filter(function (op) { return op.toRepeat });

                toRepeat.forEach(function (op) {
                    data.ChangeDetails.push({
                        WorkOrderOperationId: op.Id,
                        WorkOrderOperationNId: op.NId,
                        WorkOrderOperationName: op.Name,
                        NewWorkOrderOperationNId: op.NewName,
                        NewDescription: op.NewDescription,
                        EquipmentId: op.selectedEq ? op.selectedEq.Id : null
                    })
                })

                ncsupervisorsvc.acceptRepeatOperation(data).then(function (result) {
                    sendAccepted();
                });
            };

            // Add data collection
            var addDCD = propMapper[u4dmConstants.changeTypesIds.ADD_DATA_COLLECTION] = {};
            addDCD.propConfig = function () {
                return [
                   propGridFields.operation,
                   //propGridFields.materialTBC,
                   propGridFields.step,
                   propGridFields.dataCollection,
                   propGridFields.notes,
                   propGridFields.refNumber
                ];
            };
            addDCD.dataConfig = function () {
                return [
                    loadOperations(null, true),
                    loadDataCollections()
                ];
            };
            addDCD.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptAddDataCollections(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Add part
            var addMaterial = propMapper[u4dmConstants.changeTypesIds.ADD_PART] = {};
            //DABCUSTOM set properties to show data as a CHANGE QTY
			addMaterial.propConfig = function () {
                return [
                  propGridFields.operation,
                  propGridFields.materialTBC,
                  propGridFields.quantity,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
			
            addMaterial.dataConfig = function () {
                return [
                    loadOperationsInStatus([u4dmConstants.workOrderOperationStatuses.OPEN,
                                            u4dmConstants.workOrderOperationStatuses.PARTIAL],
                                            null),
                    loadMaterialSpecificationTypes()];
            };
			//DABCUSTOM set properties to call Accept command as CHANGE QTY
            addMaterial.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptChangeMaterialQty(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Remove part
            var removeMaterial = propMapper[u4dmConstants.changeTypesIds.REMOVE_PART] = {};
            removeMaterial.propConfig = function () {
                return [
                  propGridFields.operation,
                  propGridFields.materialTBC,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
            removeMaterial.dataConfig = function () {
                return [loadOperationsInStatus([u4dmConstants.workOrderOperationStatuses.OPEN,
                                                u4dmConstants.workOrderOperationStatuses.PARTIAL],
                                                null)];
            };
            removeMaterial.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptRemoveMaterial(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Replace part
            var replaceMaterial = propMapper[u4dmConstants.changeTypesIds.REPLACE_PART] = {}
            replaceMaterial.propConfig = function () {
                return [
                  propGridFields.operation,
                  propGridFields.materialTBC,
                  propGridFields.material,
                  propGridFields.quantity,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
            replaceMaterial.dataConfig = function () {
                return [
                    loadOperationsInStatus([u4dmConstants.workOrderOperationStatuses.OPEN,
                                            u4dmConstants.workOrderOperationStatuses.PARTIAL],
                                            null)
                ];
            };
            replaceMaterial.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptReplaceMaterial(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Change part quantity
            var changeMaterialQty = propMapper[u4dmConstants.changeTypesIds.CHANGE_PART_QTY] = {}
            changeMaterialQty.propConfig = function () {
                return [
                  propGridFields.operation,
                  propGridFields.materialTBC,
                  propGridFields.quantity,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
            changeMaterialQty.dataConfig = function () {
                return [loadOperationsInStatus([u4dmConstants.workOrderOperationStatuses.OPEN,
                                                u4dmConstants.workOrderOperationStatuses.PARTIAL],
                                                null)];
            };
            changeMaterialQty.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptChangeMaterialQty(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Delete dependency
            var removeDeps = propMapper[u4dmConstants.changeTypesIds.DELETE_DEPENDENCY] = {}
            removeDeps.propConfig = function () {
                return [
                  propGridFields.depToRemove,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
            removeDeps.dataConfig = function () {
                return [ loadDependencyTypes() ];
            };
            removeDeps.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptRemoveDeps(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Change routing
            var changeDeps = propMapper[u4dmConstants.changeTypesIds.CHANGE_ROUTING] = {}
            changeDeps.propConfig = function () {
                return [
                    propGridFields.changingDep,
                    propGridFields.operationFrom,
                    propGridFields.operationTo,
                    propGridFields.depType,
                    propGridFields.notes,
                    propGridFields.refNumber
                ];
            };
            changeDeps.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptChangeDeps(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Add process operation
            var addProcessOp = propMapper[u4dmConstants.changeTypesIds.ADD_PROCESS_OPERATION] = {}
            addProcessOp.propConfig = function () {
                propGridFields.operation.label = u4dmSvc.globalization.translate('sit.u4dm.ncSupervisor.property-grid.insert-after-operation');
                return [
                  propGridFields.opName,
                  propGridFields.operation,
                  propGridFields.opSequence,
                  propGridFields.depType,
                  propGridFields.processes,
                  propGridFields.operationsProcess,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
            addProcessOp.dataConfig = function () {
                return [
                    loadOperations([u4dmConstants.workOrderOperationStatuses.OPEN,
                                    u4dmConstants.workOrderOperationStatuses.PARTIAL,
                                    u4dmConstants.workOrderOperationStatuses.FUTURE_HOLD], false),
                    loadProcesses(),
                    loadDependencyTypes()
                ];
            };
            addProcessOp.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptChangeAddProcessOperation(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Change workplace
            var changeWorkplace = propMapper[u4dmConstants.changeTypesIds.CHANGE_WORKPLACE] = {}
            changeWorkplace.propConfig = function () {
                return [
                  propGridFields.operation,
                  propGridFields.machineTBU,
                  propGridFields.machine,
                  propGridFields.notes,
                  propGridFields.refNumber
                ];
            };
            changeWorkplace.dataConfig = function () {
                return [
                    loadOperationsInStatus([
                        u4dmConstants.workOrderOperationStatuses.OPEN, 
                        u4dmConstants.workOrderOperationStatuses.FUTURE_HOLD,
                        u4dmConstants.workOrderOperationStatuses.PARTIAL
                    ]),
                    loadPlants()
                ];
            };
            changeWorkplace.accept = function () {
                getPropertyGridValues();
                ncsupervisorsvc.acceptChangeWorkplace(currentItem).then(function (result) {
                    sendAccepted();
                });
            };

            // Add DCD to SN
            var addDCDToSN = propMapper[u4dmConstants.changeTypesIds.ADD_DCD_TO_SN] = {};
            addDCDToSN.propConfig = function () {
                return [
                    propGridFields.operation,
                    propGridFields.dataCollection,
                    propGridFields.refNumber,
                    propGridFields.notes
                ];
            };
            addDCDToSN.dataConfig = function () {
                return [
                    loadOperationsInStatus([
                         u4dmConstants.workOrderOperationStatuses.ABORTED,
                         u4dmConstants.workOrderOperationStatuses.ACTIVE,
                         u4dmConstants.workOrderOperationStatuses.DELETED,
                         u4dmConstants.workOrderOperationStatuses.FUTURE_HOLD,
                         u4dmConstants.workOrderOperationStatuses.NOT_EXECUTED,
                         u4dmConstants.workOrderOperationStatuses.OPEN,
                         u4dmConstants.workOrderOperationStatuses.PARTIAL,
                         u4dmConstants.workOrderOperationStatuses.QUEUE
                    ]),
                    loadDataCollections()
                ];
            };
            addDCDToSN.accept = function () {
                getPropertyGridValues();
                currentItem.dcdSN = [];

                var mats = vm.icvConfig.getSelectedItems();
                if (mats.length > 0) {
                    currentItem.dcdSN = _.map(mats, function (item) {
                        return item.MaterialItem_Id;
                    });
                }


                ncsupervisorsvc.acceptAddDataCollections(currentItem).then(function (result) {
                    sendAccepted();
                });
            };
        }

        function sendAccepted() {
            u4dmSvc.messaging.post(u4dmConstants.events.NC_CHANGE_ACCEPTED);
            $state.go('^', {}, { reload: true });
        }

        function configureGraph() {
            var graphNodes = [];
            var graphEdges = [];
            var operations = [];

            function getOperationById(id) {
                var retVal = null;
                operations.some(function (s) {
                    if (s.Id === id) {
                        retVal = s;
                        return true;
                    }
                });
                return retVal;
            }

            function addOperation(operation) {
                if (!getOperationById(operation.Id)) {
                    operations.push(operation);
                }
            }

            vm.dependencies.forEach(function (operationDenedency) {
                addOperation(operationDenedency.To);
                addOperation(operationDenedency.From);
                var edge = {
                    id: operationDenedency.Id,
                    name: operationDenedency.DependencyType,
                    description: '',
                    from: operationDenedency.From.Id,
                    to: operationDenedency.To.Id,
                    data: {}
                };
                graphEdges.push(edge);
            });

            operations.forEach(function (operation) {
                var node = {
                    id: operation.Id,
                    name: operation.NameSequence,
                    description: operation.Description,
                    icon: icon.fa + ' ' + icon.operationDesc,
                    data: {},
                    style: u4dmSvc.ui.configuration.graph.getStyle(operation)
                };
                graphNodes.push(node);
            });

            var graph = {
                data: {
                    nodes: graphNodes,
                    edges: graphEdges
                },
                options: {
                    autoRefresh: false,
                    layout: 'horizontal',
                    zooming: true,
                    nodeSize: u4dmSvc.ui.configuration.graph.defaultOptions.nodeSize,
                    selectedNodeStyle: u4dmSvc.ui.configuration.graph.defaultOptions.selectedNodeStyle,
                    selectedEdgeStyle: u4dmSvc.ui.configuration.graph.defaultOptions.selectedEdgeStyle,
                    nodeStyle: u4dmSvc.ui.configuration.graph.defaultOptions.nodeStyle,
                    edgeStyle: u4dmSvc.ui.configuration.graph.defaultOptions.edgeStyle,
                    onEdgeSelectCallback: function (selected) {
                        var deps = vm.dependencies.filter(function (dep) {
                            return dep.Id == selected.originalEdgeId;
                        });

                        currentItem.changingDep = deps[0];
                        var depLabel = 'From: ' + currentItem.changingDep.From.Name + ' To: ' + currentItem.changingDep.To.Name;

                        var type = vm.dependecyTypes.filter(function (dt) { return dt.NId == currentItem.changingDep.DependencyType })[0]
                        propGridFields.depType.value = type;

                        propGridFields.changingDep.value = depLabel;

                        propGridFields.depToRemove.value = depLabel;

                        propGridFields.operationFrom.value = vm.operations.filter(function (op) { return op.Id == currentItem.changingDep.From_Id })[0];
                        propGridFields.operationTo.value = vm.operations.filter(function (op) { return op.Id == currentItem.changingDep.To_Id })[0];
                    },
                    onBeforeRenderCallback: function (node) {
                        if (node.data != undefined && node.data.status != undefined && node.data.status == "current") {
                            if (node.style != undefined && node.style["background-color"] != undefined)
                                node.style["background-color"] = "red";
                            if (node.style != undefined && node.style["stroke"] != undefined)
                                node.style["stroke"] = "#FF824D";
                        }
                    }
                }
            };

            vm.graph = graph;
        }

        vm.cancel = function () {
            sidePanelManager.close();
            $state.go('^');
        };

        vm.accept = function () {
            getPropertyGridValues();
            propMapper[currentNCChange.ChangeType.Id].accept();
        };

        function init() {
            loadConfKeys();
            getNCChange();
            sidePanelManager.open('e');
            setEventHandlers();
            configPropMapper();
            configureICV();
        }

        function getNCChange() {
            ncsupervisorsvc.getChangeFromNC($state.params.id).then(
                     function (result) {
                         currentNCChange = result;
                         currentItem.change = currentNCChange;

                         sidePanelManager.setTitleManually(u4dmSvc.globalization.translate('sit.u4dm.ncSupervisor.view-title.nc-change-accept') + ' (' + currentNCChange.ChangeType.Name + ')');
                        
                         vm.isDCDtoSN = currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.ADD_DCD_TO_SN;
                        
                         if (currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.DELETE_DEPENDENCY ||
                             currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.CHANGE_ROUTING) {
                            $q.all([loadOperations(null, true), loadDependencyTypes()]).then(
                               function () {
                                   loadDeps().then(function () {
                                       if (vm.dependencies.length > 0) {
                                           configureGraph();
                                           configurePropertyGrid();
                                           vm.showGraph = true;
                                       } else {
                                           u4dmSvc.ui.overlay.showMessage('common.error', 'sit.u4dm.ncSupervisor.messages.no-deps');
                                       }
                                   });
                               }
                           );
                         }
                         else {
                             var calls = propMapper[currentNCChange.ChangeType.Id].dataConfig();
                             $q.all(calls).then(
                                 function () {
                                     $q.all([loadToBeUsedMachines(), loadMaterialTBC(), loadSteps()]).then(
                                        function () {
                                            if (currentNCChange.ChangeType.Id == u4dmConstants.changeTypesIds.REPEAT_OPERATION) {
                                                vm.repeatOperation = true;
                                                configurePropertyGrid();
                                            } else if(currentNCChange.ChangeType.Id === u4dmConstants.changeTypesIds.ADD_DCD_TO_SN) {
                                                loadSerialNumber();
                                                configurePropertyGrid();
                                                vm.repeatOperation = false;
                                            } else {
                                                configurePropertyGrid();
                                                vm.repeatOperation = false;
                                            }

                                            vm.showGraph = false;
                                        }
                                     );
                                 }
                             );
                         }
                     });
        }

        function loadDependencyTypes() {
            return u4dmSvc.data.static.getDependencyTypes().then(
                function (result) {
                    vm.dependecyTypes = result.value;
                    currentItem.depType = vm.dependecyTypes[0];
                },
                u4dmSvc.ui.overlay.showBackendError
            );
        };

        function loadPlants(options) {
            var unit = u4dmSvc.constants.equipmentLevels.UNIT;
            options = options || '';

            var query = [
                "&$expand=MachineDefinitionId",
                "&$filter=LevelId eq ", unit,
                " and (MachineDefinitionId/Parent eq 'UNIT' or MachineDefinitionId/Parent eq '')",
                " and Plant eq '", currentNCChange.WorkOrderOperation.WorkOrder.Enterprise, "'"
            ].join('');

            options += query;
            var com = u4dmSvc.utility.combineFilters(options);
            
            

            return ncsupervisorsvc.getPlants(com.$resultquery).then(function(result){
                vm.plants = result.value;
                return result;
            });
        }

        function loadMaterialSpecificationTypes() {
            return ncsupervisorsvc.getMaterialSpecficationTypes().then(function (data) {
                vm.materialSpecTypes = data.value;
            }, u4dmSvc.ui.overlay.showBackendError);
        }

        function loadMaterials(options) {
            return ncsupervisorsvc.getMaterialDefinitions(options).then(function (data) {
                u4dmSvc.humanizer.material.humanizeList(data.value);
                return data;
            });
        }

        function loadMaterialTBC() {
            if (vm.currentOperation) {
                return ncsupervisorsvc.getOperationMaterials(vm.currentOperation.Id).then(function (data) {
                    vm.materialsTBC = data.value;
                    vm.materialsTBC.forEach(function (m) {
                        u4dmSvc.humanizer.material.humanize(m.MaterialDefinition);
                        m.NameRevision = m.MaterialDefinition.NameRevision;
                    });
                }, u4dmSvc.ui.overlay.showBackendError);
            }
        }

        function loadOperationsInStatus(statusList, ro) {
            
			//DABCUSTOM Get the ToBeConsumed of the first WOOP of the WorkOrder
            var options = '$filter=WorkOrder_Id eq ' + currentNCChange.WorkOrderOperation.WorkOrder.Id + ' and not Predecessors/any()';
            
            return ncsupervisorsvc.getOperations(options).then(function (data) {
                if (ro) {
                    vm.operationsInStatus = data.value;
                } else {
                    vm.operations = data.value;
                }

                vm.currentOperation = vm.operations.filter(function (op) {
                    return op.Id == currentNCChange.WorkOrderOperation_Id
                })[0];
                currentItem.operation = vm.currentOperation;
                setOperationLabel();
            }, u4dmSvc.ui.overlay.showBackendError);
        }

        function setMinAndMaxRangeForSequence(operationSelected, operations) {
            sequenceRange.minVal = operationSelected.Sequence + 1;
            var opList = _.sortBy(operations, function (op) { return op.Sequence; });
            var maxSeq = _.find(opList, function(op) {return op.Sequence > operationSelected.Sequence});
            sequenceRange.maxVal = maxSeq ? maxSeq.Sequence - 1 : null;
            currentItem.operationSequence = sequenceRange.minVal;
        };

        function loadOperations(statusList, select) {
            //TODO: add list of status on filter
            var options = '$filter=WorkOrder_Id eq ' + currentNCChange.WorkOrderOperation.WorkOrder.Id;
            if (statusList) {
                options += ' and (Status eq \'' + statusList[0]+ '\'';
                for (var key = 1; key < statusList.length - 1; key++)
                    options += ' or Status eq \'' + statusList[key] + '\'';
                options += ')';
            }
            return ncsupervisorsvc.getOperations(options).then(function (data) {
                vm.operations = data.value;
                u4dmSvc.humanizer.operation.humanizeList(vm.operations);
                if (select)
                    vm.currentOperation = vm.operations.filter(function (op) {
                        return op.Id == currentNCChange.WorkOrderOperation_Id
            })[0];
            currentItem.operation = vm.currentOperation;
                setOperationLabel();
                }, u4dmSvc.ui.overlay.showBackendError);
        }

        function loadProcesses() {
            return ncsupervisorsvc.getProcesses('$filter=Operations/any()').then(function (data) {
                vm.processes = data.value;
                u4dmSvc.humanizer.process.humanizeList(vm.processes);
            }, u4dmSvc.ui.overlay.showBackendError);
        };

        function loadProcessOperations(id) {
            return ncsupervisorsvc.getOperationsFromProcess(id).then(function (data) {
                vm.operationsProcess = data.value;
            }, u4dmSvc.ui.overlay.showBackendError);
        };

        function setOperationLabel() {
            vm.operations.forEach(function (op) { op.Label = op.Name + ' (' + op.Sequence + ')'; })
        }

        function loadDataCollections() {
            return ncsupervisorsvc.getDataCollectionTasks().then(function (data) {
                vm.dataCollections = data.value;
            }, u4dmSvc.ui.overlay.showBackendError);
        }

        function loadDeps() {
            if (vm.currentOperation) {
                return ncsupervisorsvc.getOrderOperationsDependencies(vm.currentOperation.WorkOrder_Id).then(function (data) {
                    vm.dependencies = data.value;
                    vm.dependencies.forEach(function (dep) {
                        u4dmSvc.humanizer.operation.humanize(dep.From);
                        u4dmSvc.humanizer.operation.humanize(dep.To);
                    });
                    
                }, u4dmSvc.ui.overlay.showBackendError);
            }
        }

        function loadSteps() {
            if (vm.currentOperation) {
                return ncsupervisorsvc.getOperationSteps(vm.currentOperation.Id).then(function (data) {
                    vm.steps = data.value;
                }, u4dmSvc.ui.overlay.showBackendError);
            }
        }

        function loadToBeUsedMachines() {
            if (vm.currentOperation) {
                return ncsupervisorsvc.getOperationToBeUsedMachines(vm.currentOperation.Id).then(function (data) {
                    var defs = [];

                    var machines = _.map(data.value, function (item) {
                        if (item.Machine) {
                            item.Label = item.Machine.Name;
                            return item;
                        } else if (item.MachineDefinition && item.MachineDefinition.Machines) {
                            defs = defs.concat(_.map(item.MachineDefinition.Machines, function (md) {
                                md.Label = md.Name;
                                return md;
                            }));
                        }
                    });

                    vm.machinesTBU = _.filter(machines.concat(defs), function (item) {
                        return item !== null && item !== undefined;
                    });

                }, u4dmSvc.ui.overlay.showBackendError);
            }
        }

        function loadSerialNumber(options) {
            if (vm.currentOperation) {
                console.log('### WorkOrderOperationId: %o', vm.currentOperation.Id);
            
                return $q.all([loadActualProducedMaterials(options), loadToBeProducedMaterials(options)]).then(function (result) {
                    var mats = [];
                    if (result[0].value) {
                        mats = mats.concat(result[0].value);
                    }

                    if (result[1].value) {
                        mats = mats.concat(result[1].value);
                    }

                    vm.dcdToSN = mats;

                    return result;
                }, u4dmSvc.ui.overlay.showBackendError);
            }
        }
        
        function loadActualProducedMaterials(options) {
            options = options || '';
            var filter = [
                       '&$expand=MaterialItem',
                       '&$filter=WorkOrderOperation_Id eq ', vm.currentOperation.Id,
                       ' and CompletedQuantity ne 0 and NotWorkedQuantity ne 0'
            ].join('');

            var com = u4dmSvc.utility.combineFilters(options + filter);

            return ncsupervisorsvc.getAllActualProducedMaterial(com.$resultquery).then(function (data) {
                data.value = _.map(data.value, function (item) {
                    item.Label = item.MaterialItem.SerialNumberCode;
                    return item;
                });
                return data;
            }, u4dmSvc.ui.overlay.showBackendError);
        }

        function loadToBeProducedMaterials(options) {
            options = options || '';
            var filter = [
                       '&$expand=MaterialItem',
                       '&$filter=WorkOrderOperation_Id eq ', vm.currentOperation.Id
            ].join('');

            var com = u4dmSvc.utility.combineFilters(options + filter);

            return ncsupervisorsvc.getAllToBeProducedMaterial(com.$resultquery).then(function (data) {
                data.value = _.map(data.value, function (item) {
                    item.Label = item.MaterialItem.SerialNumberCode;
                    return item;
                });
                return data;
            }, u4dmSvc.ui.overlay.showBackendError);
        }

        init();
    }

    mod.config(['$stateProvider', 'u4dm.constants', 'u4dm.stateAliasProvider', configFunction]);
    function configFunction($stateProvider, u4dmConstants, stateAliasProvider) {
        var folder = u4dmConstants.folderPath.ncSupervisor;

        var state = {
            name: u4dmConstants.states.NC_CHANGE_ACCEPT,
            url: '/accept/:id',
            views: {
                'property-area-container@': {
                    templateUrl: folder + '/nc-change-accept.html',
                    controller: controllerName,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'sit.u4dm.ncSupervisor.view-title.nc-change-accept'
            },
            params: {
                type: '0'
            }
        };

        $stateProvider.state(state);
        stateAliasProvider.register(state);

        var editState = stateAliasProvider.createFrom(
                       u4dmConstants.states.NC_CHANGE_ACCEPT,
                       u4dmConstants.states.NC_CHANGE_SELECT_DETAILS_ACCEPT,
                       '/acceptfromdetails/:id');
        $stateProvider.state(editState);
    }
}());