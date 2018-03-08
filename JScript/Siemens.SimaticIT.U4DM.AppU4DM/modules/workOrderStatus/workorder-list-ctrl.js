(function () {
    'use strict';
    var controllerName = 'workOrderStatus_workOrderList_Ctrl';
    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.workOrderStatus')
        .controller(controllerName, [
            '$state',
            '$scope',
            'u4dm.constants',
            'u4dm.services',
            'workOrderStatus_Svc',
            workOrderListController
        ]);

    function workOrderListController(
        $state,
        $scope,
        u4dmConstants,
        u4dmSvc,
        workOrderStatusSvc
    ) {
        var vm            = this;
        var icon          = u4dmSvc.icons.icon;
        var optimizer     = new u4dmSvc.data.PagerOptimizer(workOrderStatusSvc.getAll);
        var defaults      = u4dmSvc.ui.configuration.commandBar.defaultOptions;
        var selectedItems = null;
        var cmdBarButtons;

        init();

        function init() {
            configureWOIcv();
            configureCommandBar();
            setButtonsVisibility();
            setEventHandlers();
            setCreateCreateWorkOrderMenu();
        }

        function showDetails() {
            var params = {
                workOrderId: selectedItems[0].Id,
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);
            u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS, params);
        }

        function showDetailsCustomTile(params) {
            var params1 = {
                workOrderId: params.Id,
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(params);
            u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS, params1);
        }

        function openUndoScrapWorkOrder() {
            var params = {
                workOrderId: selectedItems[0].Id,
            }
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SCRAP_UNDO, params);
        }
        
        function setForScheduling() {
            var payload = {
                WorkOrderId: selectedItems[0].Id
            }

            u4dmSvc.api.workOrder.setForScheduling(payload).then(function () {
                u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-set-for-scheduling', 'common.success');
                vm.icvConfig.selectAll(false);
                vm.icvConfig.dataUpdated();
                 hideButtons();
            });
        }

        function abortOrder() {
            var title = 'sit.u4dm.abort';

            var text = 'sit.u4dm.workOrderStatus.messages.workorder-abort-confirm';

            u4dmSvc.ui.overlay.confirm(title, text, function () {
                workOrderStatusSvc.abortWorkOrder(selectedItems).
                                      then(function (result) {
                                          u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-aborted', 'common.success');
                                          vm.icvConfig.selectAll(false);
                                          vm.icvConfig.dataUpdated();
                                          hideButtons();
                                      }, u4dmSvc.ui.overlay.showBackendError);
            });
        }

        function split() {
            // only one must be selected for split button to be active
            var params = {
                workOrderId: selectedItems[0].Id
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);
            u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SPLIT, params);
        }

        function merge() {
            // only one must be selected for split button to be active
            var params = {
                workOrderId: selectedItems[0].Id
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);
            u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_MERGE, params);
        }

        function editOrder() {
            var params = {
                workOrderId: selectedItems[0].Id,
                mode: 'edit'
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);
            u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_SELECT_DETAILS_EDIT, params);

        }

        function holdOrder() {

            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);

            var selectViewState = u4dmSvc.views.configureFutureHoldSelectionState($state.current.name);
            $state.go(selectViewState, { icvWorkOrderOperationVisible: false, isFutureHold: false });
            u4dmSvc.ui.sidePanel.open('e');

        }
		
		function DABreleaseOrder() {

            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);

            var selectViewState = u4dmSvc.views.configureDABReleaseState($state.current.name);
            $state.go(selectViewState, { workOrderId: selectedItems[0].Id, workOrderNId: selectedItems[0].NId });
            u4dmSvc.ui.sidePanel.open('e');

        }
       
        function releaseOrder() {
            var title = 'sit.u4dm.release';

            var text = 'sit.u4dm.workOrderStatus.messages.workorder-release-confirm';

            u4dmSvc.ui.overlay.confirm(title, text, function () {
                workOrderStatusSvc.releaseWorkOrder(selectedItems[0]).
                                      then(function (result) {
                                          u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-released', 'common.success');
                                          vm.icvConfig.selectAll(false);
                                          vm.icvConfig.dataUpdated();
                                          hideButtons();
                                      }, u4dmSvc.ui.overlay.showBackendError);
            });
          
        }

        function asBuiltOrder() {
            var params = {
                workOrderId: selectedItems[0].Id,
            }
            u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);
            u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_AS_BUILT, params);
        }

        function deleteOrder() {
            var title = 'sit.u4dm.delete';

            var text = 'sit.u4dm.workOrderStatus.messages.workorder-deletion-confirm';

            u4dmSvc.ui.overlay.confirm(title, text, function () {

                workOrderStatusSvc.deleteWorkOrder(selectedItems[0]).
                                 then(function (result) {
                                     // Delete the WO Notification.

                                     workOrderStatusSvc.getAllWONotification('$filter=WorkOrderId eq ' + selectedItems[0].Id).then(function (woNotif) {
                                         
                                         if (woNotif.value.length > 0) workOrderStatusSvc.deleteWONotification([woNotif.value[0].Id]);
                                     });

                                     u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-deleted', 'common.success');
                                     vm.icvConfig.selectAll(false);
                                     vm.icvConfig.dataUpdated();
                                     hideButtons();
                                 }, u4dmSvc.ui.overlay.showBackendError);
            });
        }

        function addWorkOrderFromProcess() {
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_ADD, { mode: 'fromProcess' });
        }

        function addWorkOrderManually() {
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_ADD, { mode: 'manually' });
        }

        function addWorkOrderAsPlanned() {
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_ADD, { mode: 'asPlanned' });
        }

        function addWorkOrderHeader() {
            $state.go(u4dmConstants.states.WORKORDER_STATUS_WORKORDER_ADD, { mode: 'header' });
        }

        function setEventHandlers() {
            u4dmSvc.messaging.subscribe($scope, u4dmConstants.events.WORK_ORDER_CREATED, function () {
                u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-created', 'common.success');
                vm.icvConfig.selectAll(false);
                vm.icvConfig.dataUpdated();
                hideButtons();
            });
            u4dmSvc.messaging.subscribe($scope, u4dmConstants.events.WORK_ORDER_SPLIT, function () {
                u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-splitted', 'common.success');
                vm.icvConfig.selectAll(false);
                vm.icvConfig.dataUpdated();
                hideButtons();
            });
            
            u4dmSvc.messaging.subscribe($scope, u4dmConstants.events.FUTURE_HOLD_SELECTED, function (event, data) {


                if (data)

                    var wooId= u4dmSvc.data.cache.setSelectedWorkOrder(selectedItems[0]);
            
                    var hold = _.extend({}, { 'workOrder': selectedItems[0] }, { 'holdReasons': data.holdReasons }, { 'Comment': data.note });
             
                     workOrderStatusSvc.createHoldList(hold).then(
                        function (result) {
                            u4dmSvc.ui.notify.showInfo('sit.u4dm.holdMgt.hold-created', 'common.success');
                            vm.icvConfig.selectAll(false);
                            vm.icvConfig.dataUpdated();
                            hideButtons();
                           
                           
                        },   u4dmSvc.ui.overlay.showBackendError);
             
            });
        }

        function setCreateCreateWorkOrderMenu() {

            var menuButtons = {
                fromProcess: {
                    name: u4dmSvc.api.commandList.CreateWorkOrderFromProcess,
                    label: u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.create-menu.from-process'),
                    onClickCallback: function () {
                        u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
                        addWorkOrderFromProcess();
                    }
                },
                asPlanned: {
                    name: u4dmSvc.api.commandList.UADMCreateWorkOrdersFromAsPlannedBOP,
                    label: u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.create-menu.as-planned'),
                    onClickCallback: function () {
                        u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
                        addWorkOrderAsPlanned();
                    }
                },
                manually: {
                    name: u4dmSvc.api.commandList.CreateWorkOrder,
                    label: u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.create-menu.manually'),
                    onClickCallback: function () {
                        u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
                        addWorkOrderManually();
                    }
                },
                header: {
                    name: u4dmSvc.api.commandList.CreateWorkOrder,
                    label: u4dmSvc.globalization.translate('sit.u4dm.workOrderStatus.create-menu.header'),
                    onClickCallback: function () {
                        u4dmSvc.data.cache.setCurrentWorkOrders(vm.icvConfig.getCurrentData());
                        addWorkOrderHeader();
                    }
                }
        };

            var standardConfig = {
                image: icon.workOrderCreate,
                buttonText: 'Create',
                unauthorizedBehavior: defaults.unauthorizedBehavior,
                menuItems: [menuButtons.fromProcess,
                    menuButtons.manually,
                    menuButtons.asPlanned,
                    menuButtons.header
                ]
            };

            vm.addButtonConfig = u4dmSvc.customizator.customizeMenuButton(controllerName, standardConfig);
        }

        function configureWOIcv() {
            var options = u4dmSvc.icv.configureIcvByEntity(u4dmSvc.api.entityList.WorkOrder, 'standard', serverPagingHandler, selectionChanged, 'workorder-status-list',
                {
                    tileIcon: 'fa fa-share-square-o',
                    tileCallback: showDetailsCustomTile
                
                });

            vm.icvConfig = u4dmSvc.customizator.customizeICV(controllerName, options);          
        }

        function selectionChanged(selected, clickedItem) {
            if (selected && selected.length > 0) {
                selectedItems = selected;
            } else {
                selectedItems = null;
            }
            setButtonsVisibility();
        }

        function serverPagingHandler(optionsString) {
            return optimizer.promise(optionsString).then(function (result) {
                //u4dmSvc.humanizer.workOrder.humanizeList(result.value);
                result.value.forEach(function (val) {
                    //workOrderStatusSvc.humanizeWorkOrderData(val);
                    u4dmSvc.humanizer.workOrder.humanize(val);
                    u4dmSvc.humanizer.material.humanize(val.FinalMaterial);
                    //  TFS 47777 - Request to display an icon that there are active non conformance for the Work Order
                    val.WorkOrderOperations.forEach(function (woo) {
                        // set warning icon if WOO has any defects
                        if (woo.ActiveNonConformanceNr > 0) {
                            val.image = icon.workOrderOperationAlert;
                        }
                    });
                });
                return result;
            }, u4dmSvc.ui.overlay.showBackendError);
        }


        function configureCommandBar() {
            cmdBarButtons = {
                open: {
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.open'),
                    name: 'openOrder',
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.open'),
                    image: icon.workOrderOpen,
                    onClickCallback: showDetails
                },
                release: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    name: u4dmSvc.api.commandList.ReleaseOrder,
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    image: icon.workOrderVerify,
                    onClickCallback: releaseOrder
                },
                dabrelease: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    name: u4dmSvc.api.commandList.ReleaseOrder,
					visibility: false,
					tooltip: u4dmSvc.globalization.translate('sit.u4dm.release'),
                    image: icon.workOrderVerify,
                    onClickCallback: DABreleaseOrder
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
                delete: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    label: u4dmSvc.globalization.translate('sit.u4dm.delete'),
                    name: u4dmSvc.api.commandList.DeleteWorkOrder,
                    visibility: false,
                    tooltip: u4dmSvc.globalization.translate('sit.u4dm.delete'),
                    image: icon.workOrderDelete,
                    onClickCallback: deleteOrder
                },
                edit: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.EditWorkOrder,
                    image: icon.workOrderEdit,
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
                undoScrap: {
                    type: 'Command',
                    name: u4dmSvc.api.commandList.UADMRemoveWorkOrderScrap,
                    image: icon.undoScrapWorkOrder,
                    label: u4dmSvc.globalization.translate('sit.u4dm.undo-scrap'),
                    onClickCallback: openUndoScrapWorkOrder,
                    visibility: false
                },
                schedule: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.SetWorkOrderForScheduling,
                    image: icon.workOrderSet4Scheduling,
                    label: u4dmSvc.globalization.translate('sit.u4dm.set-ready-for-scheduling'),
                    onClickCallback: setForScheduling,
                    visibility: false
                },                
                merge: {
                    unauthorizedBehavior: defaults.unauthorizedBehavior,
                    type: 'Command',
                    name: u4dmSvc.api.commandList.MergeWorkOrderToProcess,
                    image: icon.workOrderMerge,
                    label: u4dmSvc.globalization.translate('sit.u4dm.merge'),
                    onClickCallback: merge,
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
                    cmdBarButtons.schedule,
                    cmdBarButtons.merge,
                    cmdBarButtons.split,
                    cmdBarButtons.release,
					cmdBarButtons.dabrelease,
                    cmdBarButtons.hold,
                    cmdBarButtons.undoScrap,
                    cmdBarButtons.edit,
                    cmdBarButtons.open,
                    cmdBarButtons.delete,
                    cmdBarButtons.abort,
                    cmdBarButtons.asbuilt
               
                ]
            };

            // support customizations
            vm.commandBarConfig = u4dmSvc.customizator.customizeCommandBar(controllerName, standardConfig);
        }

        function setButtonsVisibility() {           
            cmdBarButtons.edit.visibility = (selectedItems !== null && selectedItems.length == 1 && selectedItems[0].Status != u4dmConstants.workOrderStatuses.Aborted);

            cmdBarButtons.open.visibility = selectedItems !== null && selectedItems.length == 1;

            cmdBarButtons.undoScrap.visibility = selectedItems !== null && selectedItems[0].Status == u4dmConstants.workOrderStatuses.Scrap;

            cmdBarButtons.schedule.visibility = selectedItems !== null && selectedItems[0].Status == u4dmConstants.workOrderStatuses.Edit;

            cmdBarButtons.split.visibility = selectedItems !== null && selectedItems.length == 1;
            cmdBarButtons.split.visibility = cmdBarButtons.split.visibility && (selectedItems[0].InitialQuantity != 1);
            cmdBarButtons.split.visibility = cmdBarButtons.split.visibility && (selectedItems[0].Status == u4dmConstants.workOrderStatuses.New || selectedItems[0].Status == u4dmConstants.workOrderStatuses.Queue || selectedItems[0].Status == u4dmConstants.workOrderStatuses.Pause);
            cmdBarButtons.split.visibility = cmdBarButtons.split.visibility && (selectedItems[0].Status != u4dmConstants.workOrderStatuses.Pause || (selectedItems[0].Status == u4dmConstants.workOrderStatuses.Pause && (selectedItems[0].ProductionType.NId != u4dmConstants.productionTypes.transferBatch && selectedItems[0].ProductionType.NId != u4dmConstants.productionTypes.serialized)));

            cmdBarButtons.release.visibility = false;
            /*
            cmdBarButtons.release.visibility = selectedItems !== null && selectedItems.length == 1 && 
                (selectedItems[0].Status == u4dmConstants.workOrderStatuses.Edit || selectedItems[0].Status == u4dmConstants.workOrderStatuses.ReadyForScheduling);
            */

			cmdBarButtons.dabrelease.visibility = selectedItems !== null && selectedItems.length == 1 && 
                (selectedItems[0].Status == u4dmConstants.workOrderStatuses.Edit || selectedItems[0].Status == u4dmConstants.workOrderStatuses.ReadyForScheduling);	
				
            cmdBarButtons.delete.visibility = selectedItems !== null && selectedItems.length == 1 && (selectedItems[0].Status !== u4dmConstants.workOrderStatuses.Aborted && selectedItems[0].Status !== u4dmConstants.workOrderStatuses.Queue && selectedItems[0].Status !== u4dmConstants.workOrderStatuses.Active);

            cmdBarButtons.abort.visibility = selectedItems !== null && selectedItems.every(function (el) {
                return el.Status == u4dmConstants.workOrderStatuses.Edit ||
                       el.Status == u4dmConstants.workOrderStatuses.Queue ||
                       el.Status == u4dmConstants.workOrderStatuses.Pause ||
                       el.Status == u4dmConstants.workOrderStatuses.Pending ||
                       el.Status == u4dmConstants.workOrderStatuses.New
            });

            cmdBarButtons.merge.visibility = selectedItems !== null && selectedItems.length == 1 &&  (selectedItems[0].Status == u4dmConstants.workOrderStatuses.Pending && selectedItems[0].WorkOrderOperations.length == 0);
            //TEMP FOR DEBUG 
            //cmdBarButtons.merge.visibility = true;

            cmdBarButtons.asbuilt.visibility = selectedItems !== null && selectedItems.length == 1;

            // hold visibility : only the status of Wo is not Abort,Complete, Verified, Active, Scrap
            cmdBarButtons.hold.visibility = selectedItems !== null && selectedItems.length == 1 && selectedItems.every(function (el) {
              return    el.Status != u4dmConstants.workOrderStatuses.Aborted &&
                        el.Status != u4dmConstants.workOrderStatuses.Complete &&
                        el.Status != u4dmConstants.workOrderStatuses.Verified &&
                        el.Status != u4dmConstants.workOrderStatuses.Active &&
                        el.Status != u4dmConstants.workOrderStatuses.Scrap &&
                        el.Status != u4dmConstants.workOrderStatuses.Edit
            });


              
        }

        function hideButtons() {
            cmdBarButtons.edit.visibility = false;
            cmdBarButtons.open.visibility = false;
            cmdBarButtons.release.visibility = false;
			cmdBarButtons.dabrelease.visibility = false;
            cmdBarButtons.delete.visibility = false;
            cmdBarButtons.abort.visibility = false;
            cmdBarButtons.split.visibility = false;
            cmdBarButtons.schedule.visibility = false;
            cmdBarButtons.merge.visibility = false;
        }
    }

    mod.config(['$stateProvider', 'u4dm.constants', configFunction]);

    function configFunction($stateProvider, u4dmConstants) {
        var folder = u4dmConstants.folderPath.workOrderStatus;

        var state = {
            name: u4dmConstants.states.WORKORDER_STATUS_WORKORDER,
            url: '/workOrderStatus',
            views: {
                'Canvas@': {
                    templateUrl: folder + '/workorder-list.html',
                    controller: controllerName,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'sit.u4dm.workOrderStatus.view-title.workorder',
                help: u4dmConstants.help.workOrderStatus
            }
        };

        $stateProvider.state(state);

    }
}());