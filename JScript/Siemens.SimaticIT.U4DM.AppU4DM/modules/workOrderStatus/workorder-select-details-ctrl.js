(function () {
    'use strict';
    var controllerName = 'workOrderStatus_workOrdeSelectDetails_Ctrl';
    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.workOrderStatus')
        .controller(controllerName, [
            '$q',
            '$state',
            '$scope',
            'u4dm.constants',
            'u4dm.services',
            'workOrderStatus_Svc',
            workOrdeSelectDetailsController
        ]);

    function workOrdeSelectDetailsController(
        $q,
        $state,
        $scope,
        u4dmConstants,
        u4dmSvc,
        workOrderStatusSvc
    ) {
        var vm = this;
        var icon = u4dmSvc.icons.icon;
        var propGridMgr = new u4dmSvc.propertyGridSvc($scope, this, $state.params.mode);

        var propGridFields = {};
        var cmdBarButtons;
        var timeSvc = u4dmSvc.time;

        vm.currentItem = {}
        vm.currentItem.GenerateDisabled = true;
        vm.currentItem.BatchInvisible = true;
        vm.currentItem.QuantityInvisible = true;

        vm.productionTypeList = [];

        init();
        function init() {
            vm.editMode = $state.params.mode === 'edit';
            vm.save = updateWorkorder;
            vm.cancel = cancel;
            vm.recordValid = true;

            configureCommandBar();
            loadProductionTypes().then(function(data) {;
                setCurrentWorkOrder();
                setEventHandlers();
            });
        }

        function setEventHandlers() {
            u4dmSvc.messaging.subscribe($scope, u4dmConstants.events.MATERIAL_DEFINITION_CREATED, function () {
                getPropertyGridValues();
                vm.currentWorkOrder.FinalMaterial = u4dmSvc.data.cache.popNewMaterialDefinitionObj();
                configurePropertyGrid();
            });

            u4dmSvc.messaging.subscribe($scope, 'DABReleaseOrder', function () {
                setCurrentWorkOrder(true);
            });

            u4dmSvc.messaging.subscribe($scope, u4dmConstants.events.FUTURE_HOLD_SELECTED, function (event, data) {


                if (data)

                var hold = _.extend({}, { 'workOrder': vm.currentWorkOrder }, { 'holdReasons': data.holdReasons }, { 'Comment': data.note });

                workOrderStatusSvc.createHoldList(hold).then(
                   function (result) {
                       u4dmSvc.ui.notify.showInfo('sit.u4dm.holdMgt.hold-created', 'common.success');
                       
                       setCurrentWorkOrder();
                     
                      


                   }, u4dmSvc.ui.overlay.showBackendError);

            });
        }

        function releaseSelectedOrder() {
            var title = 'sit.u4dm.release';

            var text = 'sit.u4dm.workOrderStatus.messages.workorder-release-confirm';

            u4dmSvc.ui.overlay.confirm(title, text, function () {
                workOrderStatusSvc.releaseWorkOrder(vm.currentWorkOrder).
                                      then(function (result) {
                                          u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-released', 'common.success');
                                          setCurrentWorkOrder(true);
                                      }, u4dmSvc.ui.overlay.showBackendError);
            });
        }

        function dabreleaseSelectedOrder() {

            u4dmSvc.data.cache.setSelectedWorkOrder(vm.currentWorkOrder);

            var selectViewState = u4dmSvc.views.configureDABReleaseState($state.current.name);
            $state.go(selectViewState, { workOrderId: vm.currentWorkOrder.Id, workOrderNId: vm.currentWorkOrder.NId });
            u4dmSvc.ui.sidePanel.open('e');

        }

        function setForScheduling() {
            var payload = {
                WorkOrderId: vm.currentWorkOrder.Id
            }

            u4dmSvc.api.workOrder.setForScheduling(payload).then(function () {
                u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-set-for-scheduling', 'common.success');
                setCurrentWorkOrder(true);
            });
        }

        function deleteSelectedOrder() {
            var title = u4dmSvc.globalization.translate('sit.u4dm.delete');

            var text = u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.messages.workorder-deletion-confirm');

            u4dmSvc.ui.overlay.confirm(title, text, function () {
                workOrderStatusSvc.deleteWorkOrder(vm.currentWorkOrder).
                                 then(function (result) {
                                     u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-deleted', 'common.success');

                                     $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER);
                                 }, u4dmSvc.ui.overlay.showBackendError);
            });
        }

        function editOrder() {
            var params = {
                workOrderId: vm.currentWorkOrder.Id,
                mode: 'edit'
            }
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS_EDIT, params);
        }

        function split() {
            var params = {
                workOrderId: vm.currentWorkOrder.Id
            }
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS_SPLIT, params);
        }

        function asBuiltOrder() {
            var params = {
                workOrderId: vm.currentWorkOrder.Id
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(vm.currentWorkOrder);
            
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_AS_BUILT_DETAILS, params);
        }

        function holdOrder() {

            var selectViewState = u4dmSvc.views.configureFutureHoldSelectionState($state.current.name);
            $state.go(selectViewState, { icvWorkOrderOperationVisible: false, isFutureHold: false });
            u4dmSvc.ui.sidePanel.open('e');

        }
        function abortOrder() {
            var title = 'sit.u4dm.abort';

            var text = 'sit.u4dm.workOrderStatus.messages.workorder-abort-confirm';

            var workOrders = [];
            workOrders.push(vm.currentWorkOrder);

            u4dmSvc.ui.overlay.confirm(title, text, function () {
                workOrderStatusSvc.abortWorkOrder(workOrders).
                                      then(function (result) {
                                          setCurrentWorkOrder();
                                          hideButtons();
                                          u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-aborted', 'common.success');
                                      }, u4dmSvc.ui.overlay.showBackendError);
            });
        }

        function configureCommandBar() {
            var defaults = u4dmSvc.ui.configuration.commandBar.defaultOptions;
            cmdBarButtons = {
                delete: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.delete'),
                    name: u4dmSvc.api.commandList.DeleteWorkOrder,
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.delete'),
                    image: icon.workOrderDelete,
                    onClickCallback: deleteSelectedOrder
                },
                release: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    name: u4dmSvc.api.commandList.ReleaseOrder,
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    image: icon.workOrderVerify,
                    onClickCallback: releaseSelectedOrder
                },
                dabrelease: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    name: u4dmSvc.api.commandList.ReleaseOrder,
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    image: icon.workOrderVerify,
                    onClickCallback: dabreleaseSelectedOrder
                },
                asbuilt: {
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.as-built'),
                    name: 'asBuiltOrder',
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.as-built'),
                    image: icon.workOrderAsBuilt,
                    onClickCallback: asBuiltOrder
                },
                edit: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.EditWorkOrder,
                    image: icon.workOrderEdit,
                    visibility: false,
                    label: u4dmSvc.globalization.translate('sit.u4dm.edit'),
                    onClickCallback: editOrder
                },
                abort: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.UADMAbortWorkOrder,
                    image: icon.workOrderClose,
                    label: u4dmSvc.globalization.translate('sit.u4dm.abort'),
                    onClickCallback: abortOrder,
                    visibility: false
                },
                split: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.UADMSplitWorkOrder,
                    image: icon.workOrderSplit,
                    label: u4dmSvc.globalization.translate('sit.u4dm.split'),
                    onClickCallback: split,
                    visibility: false
                },
                schedule: {
                    type: 'Command',
                    name: u4dmSvc.api.commandList.SetWorkOrderForScheduling,
                    image: icon.workOrderSet4Scheduling,
                    label: u4dmSvc.globalization.translate('sit.u4dm.set-ready-for-scheduling'),
                    onClickCallback: setForScheduling,
                    visibility: false
                },
                hold: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.UADMSetWorkOrderHoldList,
                    image: icon.holdIcon,
                    label: u4dmSvc.globalization.translate('sit.u4dm.hold'),
                    onClickCallback: holdOrder,
                    visibility: false
                }

            };

            var standardConfig = {
                barType: 'Action',
                bar: [
                    cmdBarButtons.edit,
                    cmdBarButtons.schedule,
                    cmdBarButtons.split,
                    cmdBarButtons.release,
                    cmdBarButtons.dabrelease,
                    cmdBarButtons.hold,
                    cmdBarButtons.delete,
                    cmdBarButtons.abort,
                    cmdBarButtons.asbuilt
                  

                ]
            };

            vm.commandBarConfig = u4dmSvc.customizator.customizeCommandBar(controllerName, standardConfig);
        }

        function setButtonsVisibility() {
            var editable = vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Edit || vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.ReadyForScheduling;

            cmdBarButtons.delete.visibility = !vm.editMode;
            cmdBarButtons.release.visibility = false;
            cmdBarButtons.dabrelease.visibility = !vm.editMode && editable;
            cmdBarButtons.edit.visibility = !vm.editMode && vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Aborted;
            cmdBarButtons.schedule.visibility = !vm.editMode && vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Edit;

            cmdBarButtons.split.visibility = !vm.editMode;
            cmdBarButtons.split.visibility = cmdBarButtons.split.visibility && (vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.New || vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Queue || vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Pause);
            cmdBarButtons.split.visibility = cmdBarButtons.split.visibility && (vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Pause || (vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Pause && (vm.currentWorkOrder.ProductionType.NId != u4dmConstants.productionTypes.transferBatch && vm.currentWorkOrder.ProductionType.NId != u4dmConstants.productionTypes.serialized)));

            cmdBarButtons.abort.visibility = !vm.editMode && vm.currentWorkOrder !== null && (
                                 vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Edit ||
                                 vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Queue ||
                                 vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Pause ||
                                 vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.Pending ||
                                 vm.currentWorkOrder.Status == u4dmConstants.workOrderStatuses.New);

            cmdBarButtons.asbuilt.visibility = !vm.editMode && vm.currentWorkOrder !== null;
            
            // hold visibility : only the status of Wo is not Abort,Complete, Verified, Active, Scrap

            cmdBarButtons.hold.visibility = !vm.editMode && (vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Aborted &&
                vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Complete &&
                vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Verified && 
                vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Active &&
                vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Scrap &&
                vm.currentWorkOrder.Status != u4dmConstants.workOrderStatuses.Edit
                    
            );


              
        }

        function hideButtons() {
            cmdBarButtons.edit.visibility = false;
            cmdBarButtons.schedule.visibility = false;
            cmdBarButtons.split.visibility = false;
            cmdBarButtons.release.visibility = false;
            cmdBarButtons.dabrelease.visibility = false;
            cmdBarButtons.delete.visibility = false;
            cmdBarButtons.abort.visibility = false;
            cmdBarButtons.asbuilt.visibility = false;
        }

        function setCurrentWorkOrder(notify) {
            vm.currentWorkOrder = null;
            workOrderStatusSvc.getById($state.params.workOrderId).then(
                function (result) {
                    vm.currentWorkOrder = result.value[0];
                    u4dmSvc.humanizer.workOrder.humanize(vm.currentWorkOrder);
                    if (vm.currentWorkOrder.FinalMaterial) {
                        u4dmSvc.humanizer.material.humanize(vm.currentWorkOrder.FinalMaterial);
                        vm.currentItem.QuantityInvisible = false;

                        if (vm.currentWorkOrder.ProductionType) {
                            if (isBatchIdVisible(vm.currentWorkOrder.ProductionType.NId)) {
                                vm.currentItem.BatchInvisible = false;
                                vm.currentItem.GenerateDisabled = false;
                            }
                        }
                    }

                    configurePropertyGrid();
                    setButtonsVisibility();
                    if (notify)
                        u4dmSvc.messaging.post(u4dmConstants.events.WORK_ORDER_RELEASED, vm.currentWorkOrder);
                }
            );
        }

        function createMaterialDefinition() {
            getPropertyGridValues();
            u4dmSvc.data.cache.setPartiallyAddedOrder(vm.currentItem);
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS_EDIT_MATERIAL_DEFINITION_ADD, {
                blockOpen: true
            });
            u4dmSvc.ui.sidePanel.open('e');
        }

        ///////CLICKS
        function updateWorkorder() {
            getPropertyGridValues();
            workOrderStatusSvc.updateWorkOrder(vm.currentWorkOrder).then(function () {
                u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-updated', 'common.success');
                u4dmSvc.messaging.post(u4dmConstants.events.WORK_ORDER_EDITED);
                $state.go('^', { mode: 'view' });
            });
        }

        function cancel() {
            $state.go('^', { mode: 'view' });
        }

        function editOrder() {
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS_EDIT, { mode: 'edit' });
        }

        ///ENTITY PICKER SELECTION CHANGE
        function finalMaterialSelectionChanged(oldVal, newVal) {
            propGridFields.batchId.value = '';
            if (newVal && newVal.SerialNumberProfile !== null) {
                var prodType = (propGridFields.productionType.value) ? propGridFields.productionType.value.NId : null;
                if(newVal.SerialNumberProfile === true && !isSerialized(prodType)) {
                    propGridFields.productionType.value = {
                      Id: 0, NId: "-"
                    };
                }
                else if (newVal.SerialNumberProfile === false && isSerialized(prodType)) {
                    propGridFields.productionType.value = {
                        Id: 0, NId: "-"
                    };
                }
            }
            
            getPropertyGridValues();
            configurePropertyGrid();
        }

        function isSerialized(prodType) {
            return (prodType === u4dmConstants.productionTypes.serialized || prodType === u4dmConstants.productionTypes.fullSerialized);
        }

        /// PRODUCTION TYPE COMBO SELECTION CHANGE
        function productionTypeSelectionChanged(oldVal, newVal) {
            if(newVal !== null) {
                getPropertyGridValues();
                configurePropertyGrid();
            }
        }

        /////// ENTITIES GETTERS
        function loadMaterialDefinitions(options) {
            return workOrderStatusSvc.getMaterialDefinitions(options).then(function (data) {
                u4dmSvc.humanizer.material.humanizeList(data.value);
                return data;
            });
        }

        function getProductionTypes() {
            if (!vm.currentWorkOrder.FinalMaterial || vm.currentWorkOrder.FinalMaterial.SerialNumberProfile === null) {
                return vm.productionTypeList;
            }
            else {
                var values = [];
                values.push({
                    Id: 0,
                    NId: "-"
                });
                vm.productionTypeList.forEach(function (value) {
                    if (vm.currentWorkOrder.FinalMaterial.SerialNumberProfile == false) {
                        if (value.NId === u4dmConstants.productionTypes.fullQuantity || value.NId === u4dmConstants.productionTypes.transferBatch) {
                            values.push(value);
                        }
                    }
                    else {
                        
                        if (value.NId != '-' ) {
                            values.push(value);
                        }
                    }
                });
                return values;
            }
        }

        function loadProductionTypes() {
            return workOrderStatusSvc.getAllProductionType().then(function (data) {
                var types = [];
                var values = [];
                $.each(data.value, function (index, value) {
                    if ($.inArray(value.NId, types) === -1) {
                        types.push(value.NId);
                            values.push(value);
                    }
                });

                vm.productionTypeList = values.filter(function (el) { return el.Id != 3; });
                vm.productionTypeList.unshift({
                    Id: 0,
                    NId: "-"
                });
            }, u4dmSvc.ui.overlay.showBackendError);
        }

        //////// ID GENERATORS
        function generateBatchId() {
            getPropertyGridValues();
            if (vm.currentWorkOrder.FinalMaterial == null) {
                var title = 'sit.u4dm.warning';
                var text = 'sit.u4dm.no-material-material-definition-selected';
                u4dmSvc.ui.overlay.showMessage(title, text);
                return;
            }

            var mdNId = vm.currentWorkOrder.FinalMaterialNId;
            var mdId = vm.currentWorkOrder.FinalMaterial_Id;
            var plant;
            if (vm.currentWorkOrder.Plant)
                plant = vm.currentWorkOrder.Plant;

            workOrderStatusSvc.generateBatchId(mdId, mdNId, plant).then(function (response) {
                if (!response) {
                    raiseGenerateError();
                    return;
            }

                if (response.data)
                    propGridFields.batchId.widget[0].value = response.data.MaterialBatchId;
            });
        }

            function isBatchIdVisible(NId) {
            return NId == u4dmConstants.productionTypes.fullQuantity || NId == u4dmConstants.productionTypes.transferBatch;
        }

            function raiseGenerateError() {
            var title = 'sit.u4dm.warning';
            var text = 'sit.u4dm.no-template-associated-to-material-definition';
            u4dmSvc.ui.overlay.showMessage(title, text);
        }

            //////PROPERTY GRID
            function configurePropertyGrid() {
            propGridMgr.clear();

            propGridFields.nid = propGridMgr.createTextProperty({
                    id: 'nId',
                    labelKey: 'sit.u4dm.nid',
                    value: vm.currentWorkOrder.NId,
                    required: vm.editMode
            });

            propGridFields.name = propGridMgr.createTextProperty({
                    id: 'name',
                    labelKey: 'sit.u4dm.name',
                    value: vm.currentWorkOrder.Name
            });

            propGridFields.batchId = propGridMgr.createTextPropertyWithButton({
                    id: 'batchId',
                    labelKey: 'sit.u4dm.batch-id',
                    value: getBatchId(),
                    invisible: vm.currentItem.BatchInvisible, //!vm.editMode ? false :  
                    checkSpecialChars: true,
                    onClick: generateBatchId,
                    buttonDisabled: vm.currentItem.GenerateDisabled,
                    buttonText: "Generate",
                    required: true
            });

            function getBatchId() {
                if (vm.currentWorkOrder.ProducedMaterialItems && vm.currentWorkOrder.ProducedMaterialItems.length > 0) {
                    return vm.currentWorkOrder.ProducedMaterialItems[0].MaterialItem.BatchId;
                }
            }

            propGridFields.notes = propGridMgr.createTextAreaProperty({
                    id: 'notes',
                    labelKey: 'sit.u4dm.notes',
                    value: vm.currentWorkOrder.Notes
            });

            propGridFields.status = propGridMgr.createTextProperty({
                    id: 'status',
                    labelKey: 'sit.u4dm.status',
                    value: vm.currentWorkOrder.Status
            });

            propGridFields.actualStartTime = propGridMgr.createDateTimePickerProperty({
                id: 'actualStartTime',
                labelKey: 'sit.u4dm.actual-start-time',
                value: vm.currentWorkOrder.ActualStartTime_DateTime,
                validationCallback: actualStartDateValidation
            });

            propGridFields.actualEndTime = propGridMgr.createDateTimePickerProperty({
                id: 'actualEndTime',
                labelKey: 'sit.u4dm.actual-end-time',
                value: vm.currentWorkOrder.ActualEndTime_DateTime,
                validationCallback: actualEndDateValidation
            });

            propGridFields.estStartTime = propGridMgr.createDateTimePickerProperty({
                id: 'estStartTime',
                labelKey: 'sit.u4dm.estimated-start-time',
                value: vm.currentWorkOrder.EstimatedStartTime_DateTime,
                validationCallback: estStartDateValidation
            });

            propGridFields.estEndTime = propGridMgr.createDateTimePickerProperty({
                id: 'estEndTime',
                labelKey: 'sit.u4dm.estimated-end-time',
                value: vm.currentWorkOrder.EstimatedEndTime_DateTime,
                validationCallback: estEndDateValidation
            });

            propGridFields.dueDate = propGridMgr.createDateTimePickerProperty({
                    id: 'dueDate',
                    labelKey: 'sit.u4dm.due-date',
                    value: vm.currentWorkOrder.DueDate_DateTime
            });

            propGridFields.creationDate = propGridMgr.createTextProperty({
                    id: 'creationDate',
                    labelKey: 'sit.u4dm.create-date',
                    value: vm.currentWorkOrder.CreationDate_DateTime
            });

            propGridFields.isInScheduling = propGridMgr.createCheckboxProperty({
                    id: 'isInScheduling',
                    labelKey: 'sit.u4dm.is-in-scheduling',
                    options: [
                        {
                                labelKey: '',
                                checked: vm.currentWorkOrder.IsUnderScheduling,
                    }
            ]
            });

            propGridFields.initialQuantity = propGridMgr.createNumericProperty({
                    id: 'initialQuantity',
                    labelKey: 'sit.u4dm.initial-quantity',
                    value: vm.currentWorkOrder.InitialQuantity,
                    invisible: !vm.editMode ? false : vm.currentItem.QuantityInvisible,
                    required: (vm.currentWorkOrder.FinalMaterial != null),
                    minVal: 1
            });

            propGridFields.producedQuantity = propGridMgr.createTextProperty({
                    id: 'producedQuantity',
                    labelKey: 'sit.u4dm.produced-quantity',
                    value: vm.currentWorkOrder.ProducedQuantity
            });

            propGridFields.reworkedQuantity = propGridMgr.createTextProperty({
                    id: 'reworkedQuantity',
                    labelKey: 'sit.u4dm.reworked-quantity',
                    value: vm.currentWorkOrder.ReworkedQuantity
            });

            propGridFields.scrappedQuantity = propGridMgr.createTextProperty({
                    id: 'scrappedQuantity',
                    labelKey: 'sit.u4dm.scrapped-quantity',
                    value: vm.currentWorkOrder.ScrappedQuantity
            });

            propGridFields.plant = propGridMgr.createTextProperty({
                    id: 'woPlant',
                    labelKey: 'sit.u4dm.plant',
                    value: vm.currentWorkOrder.Plant
            });

            propGridFields.finalMaterial = propGridMgr.createEntityPickerPropertyWithButton({
                    id: 'finalMaterial',
                    labelKey: 'sit.u4dm.final-material',
                    value: vm.currentWorkOrder.FinalMaterial,
                    dataSource: { getAll: loadMaterialDefinitions, searchField: 'Name' },
                    displayProperty: 'NameRevision',
                    onClick: createMaterialDefinition,
                    buttonIcon: 'fa-plus',
                    onChange: finalMaterialSelectionChanged,
                    pickerOptions: u4dmSvc.icv.configureIcvByEntity4EPServer(u4dmSvc.api.entityList.MaterialDefinition, loadMaterialDefinitions)
            });

            propGridFields.productionType = propGridMgr.createComboBoxProperty(
            {
                    id: 'productionType',
                    labelKey: 'sit.u4dm.production-type',
                    value: (vm.currentWorkOrder.ProductionType) ? vm.currentWorkOrder.ProductionType : vm.productionTypeList[0],
                    invisible: !vm.currentWorkOrder.FinalMaterial,
                    dataSource: getProductionTypes(),
                    displayProperty: "NId",
                    valueProperty: "NId",
                    onChange: productionTypeSelectionChanged
            });

            propGridFields.processName = propGridMgr.createTextProperty({
                    id: 'processName',
                    labelKey: 'sit.u4dm.process',
                    value: vm.currentWorkOrder.ProcessNId
            });

            propGridFields.processRevision = propGridMgr.createTextProperty({
                    id: 'processRevision',
                    labelKey: 'sit.u4dm.process-revision',
                    value: vm.currentWorkOrder.ProcessRevision
            });

            propGridFields.erpOrder = propGridMgr.createTextProperty({
                    id: 'erpOrder',
                    labelKey: 'sit.u4dm.erp-order',
                    value: vm.currentWorkOrder.ERPOrder
            });

            propGridFields.priority = propGridMgr.createNumericProperty({
                    id: 'priority',
                    labelKey: 'sit.u4dm.priority',
                    value: vm.currentWorkOrder.Priority,
                    minVal: 0
            });

            propGridFields.parentBatch = propGridMgr.createTextProperty({
                    id: 'parentBatch',
                    labelKey: 'sit.u4dm.parent-batch',
                    value: vm.currentWorkOrder.ParentBatch
            });

            propGridFields.sequence = propGridMgr.createTextProperty({
                    id: 'sequence',
                    labelKey: 'sit.u4dm.sequence',
                    value: vm.currentWorkOrder.Sequence
            });

            propGridFields.actualId = propGridMgr.createTextProperty({
                    id: 'actualId',
                    labelKey: 'sit.u4dm.nid',
                    value: vm.currentWorkOrder.Id
            });

            var roPropFields = [
                    propGridFields.nid,
                    propGridFields.name,
                    propGridFields.productionType,
                    propGridFields.status,
                    propGridFields.finalMaterial,
                    propGridFields.plant,
                    propGridFields.estStartTime,
                    propGridFields.estEndTime,
                    propGridFields.actualStartTime,
                    propGridFields.actualEndTime,
                    propGridFields.creationDate,
                    propGridFields.dueDate,
                    propGridFields.isInScheduling,
                    propGridFields.initialQuantity,
                    propGridFields.producedQuantity,
                    propGridFields.reworkedQuantity,
                    propGridFields.scrappedQuantity,
                    propGridFields.processName,
                    propGridFields.processRevision,
                    propGridFields.erpOrder,
                    propGridFields.parentBatch,
                    propGridFields.batchId,
                    propGridFields.priority,
                    propGridFields.sequence,
                    propGridFields.notes
            ];

            var editPropFieldsEditStatus = [
                propGridFields.name,
                propGridFields.parentBatch,
                propGridFields.finalMaterial,
                propGridFields.productionType,
                propGridFields.erpOrder,
                propGridFields.priority,
                propGridFields.initialQuantity,
                propGridFields.batchId,
                propGridFields.actualStartTime,
                propGridFields.actualEndTime,
                propGridFields.estStartTime,
                propGridFields.estEndTime,
                propGridFields.dueDate,
                propGridFields.notes
            ];

            var editPropFieldsOtherStatuses = [
                propGridFields.dueDate,
                propGridFields.estStartTime,
                propGridFields.estEndTime,
                propGridFields.actualStartTime,
                propGridFields.actualEndTime,
                propGridFields.parentBatch
            ];

            propGridMgr.getValues = getStandardPropertyGridValues;

            if (vm.editMode) {
                propGridMgr.data = u4dmConstants.workOrderStatuses.Edit == vm.currentWorkOrder.Status || u4dmConstants.workOrderStatuses.Pending == vm.currentWorkOrder.Status ? editPropFieldsEditStatus : editPropFieldsOtherStatuses;
            } else {
                propGridMgr.data = roPropFields;
            }

            vm.propertyGrid = u4dmSvc.customizator.customizePropertyGrid(controllerName, propGridMgr, vm.currentWorkOrder);
        }

            function getPropertyGridValues() {
                // pass the standard method in case custom override wants to use it
                vm.propertyGrid.getValues(vm.currentWorkOrder, getStandardPropertyGridValues);
            }

            function getStandardPropertyGridValues(obj) {
                var retVal = obj;

                vm.currentItem.GenerateDisabled = true;
                vm.currentItem.BatchInvisible = true;

                retVal.Name = propGridFields.name.value;
                retVal.ParentBatch = propGridFields.parentBatch.value;

                var actStartTime = propGridFields.actualStartTime.value;
                var actEndTime = propGridFields.actualEndTime.value;
                var estStartTime = propGridFields.estStartTime.value;
                var estEndTime = propGridFields.estEndTime.value;
                var dueDate = propGridFields.dueDate.value;

                if (actStartTime)
                    retVal.ActualStartTime_DateTime = actStartTime;

                if (actEndTime)
                    retVal.ActualEndTime_DateTime = actEndTime;

                if (estStartTime)
                    retVal.EstimatedStartTime_DateTime = estStartTime;

                if (estEndTime)
                    retVal.EstimatedEndTime_DateTime = estEndTime;

                if (dueDate)
                    retVal.DueDate_DateTime = dueDate;

                retVal.ERPOrder = propGridFields.erpOrder.value;
                retVal.Priority = propGridFields.priority.value;
                retVal.InitialQuantity = propGridFields.initialQuantity.value;
                retVal.Notes = propGridFields.notes.value;

                var producedMaterialItems = vm.currentWorkOrder.ProducedMaterialItems;
                if (producedMaterialItems && producedMaterialItems.length > 0) {
                    producedMaterialItems[0].MaterialItem.BatchId = propGridFields.batchId.value;
                }
                retVal.batchId = propGridFields.batchId.value;

                var finalMaterial = propGridFields.finalMaterial.value;

                if (finalMaterial || finalMaterial == "") {
                    retVal.FinalMaterial = finalMaterial;
                    retVal.FinalMaterialNId = finalMaterial.NId;
                    retVal.FinalMaterial_Id = finalMaterial.Id;
                    vm.currentItem.QuantityInvisible = false;

                    if (finalMaterial.SerialNumberProfile === false) {
                        vm.currentItem.BatchInvisible = false;
                        vm.currentItem.GenerateDisabled = false;
                    }
                }

                var prodType = null;
                if (!propGridFields.productionType.invisible)
                    prodType = propGridFields.productionType.value;

                if (prodType) {
                    retVal.ProductionType = prodType;
                    var hideBatch = isSerialized(prodType.NId);
                    vm.currentItem.BatchInvisible = hideBatch;
                    vm.currentItem.GenerateDisabled = hideBatch;
                    if (hideBatch)
                        retVal.batchId = null;
                }
            }

            function actualStartDateValidation(date) {
            var ed = propGridFields.actualEndTime.value;

            if (ed !== null && date >= ed) {
                propGridFields.actualStartTime.setValidationMessage(u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.messages.workorder-act-start-date-error'));
                propGridFields.actualEndTime.setValidity(false);
                return false;
            } else {
                propGridFields.actualEndTime.setValidity(true);
            }

            return true;
        }

            function actualEndDateValidation(date) {
            var sd = propGridFields.actualStartTime.value;

            if (sd !== null && date <= sd) {
                propGridFields.actualEndTime.setValidationMessage(u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.messages.workorder-est-end-date-error-3'));
                propGridFields.actualStartTime.setValidity(false);
                return false;
            } else {
                propGridFields.actualStartTime.setValidity(true);
            }

            return true;
        }

            function estStartDateValidation(date) {
            var ed = propGridFields.estEndTime.value;

            if (ed !== null && date >= ed) {
                propGridFields.estStartTime.setValidationMessage(u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.messages.workorder-est-start-date-error-3'));
                propGridFields.estEndTime.setValidity(false);
                return false;
            } else {
                propGridFields.estEndTime.setValidity(true);
            }

            return true;
        }

            function estEndDateValidation(date) {
            var sd = propGridFields.estStartTime.value;

            if (sd !== null && date <= sd) {
                propGridFields.estEndTime.setValidationMessage(u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.messages.workorder-est-end-date-error-3'));
                propGridFields.estStartTime.setValidity(false);
                return false;
            } else {
                propGridFields.estStartTime.setValidity(true);
            }

            return true;
        }

        u4dmSvc.utility.callback.registerCallback($state.current.name, onIcvSelectionChanging, true);

            function onIcvSelectionChanging() {
            var deferred = $q.defer();
            if (vm.editMode && vm.recordDirty) {
                u4dmSvc.ui.overlay.prompt(
                    'sit.u4dm.confirm-save',
                    'sit.u4dm.workOrderStatus.messages.workorder-pompt-update',
                    function () {
                        updateWorkorder();
                        deferred.resolve(true);
                },     //yes
                    function () {
                        deferred.resolve(true);
                },        //no
                    function () {
                        deferred.resolve(false);
                }        //cancel
                );
            } else {
                deferred.resolve(true);
            }
            return deferred.promise;
        }
    }

    mod.config(['$stateProvider', 'u4dm.constants', 'u4dm.stateAliasProvider', configFunction]);

    function configFunction($stateProvider, u4dmConstants, aliasProvider) {
        var folder = u4dmConstants.folderPath.workOrderStatus;

        var state = {
            name: u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS,
            url: '/details/:mode',
            views: {
                'workOrder.select': {
                    templateUrl: folder + '/workorder-select-details.html',
                    controller: controllerName,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'sit.u4dm.workOrderStatus.view-title.workorder-select'
            },
            params: {
                mode: 'view'
            }
        };

        $stateProvider.state(state);
        aliasProvider.register(state);

        var editWorkOrderDetailsAlias = aliasProvider.createFrom(
                   u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS,
                   u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS_EDIT);
        editWorkOrderDetailsAlias.data.title = 'sit.u4dm.workOrderStatus.view-title.workorder-edit';
        $stateProvider.state(editWorkOrderDetailsAlias);
    }
})();