(function () {
    'use strict';

    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.services.api');

    var serviceName = 'uadm.services.api.workorder';

    mod.factory(serviceName, [
           'uadm.services.api.entities.definition',
           'uadm.services.api.commands.definition',
           'uadm.services.api.workorder.operation',
           'uadm.services.api.workorder.history',
           'uadm.services.api.workorder.hold',
           'uadm.services.api.workorder.futurehold',
           'uadm.services.api.workorder.holdreason',
           'uadm.services.api.workorder.notification',
           'uadm.services.humanizer',

            WorkOrderService
    ]);

    function WorkOrderService(entities, commands, operation, history, hold, futurehold, holdreason, notification, humanizer) {

        function getAll(options) {
            return entities.WorkOrder.getAll(serviceName, options);
        };

        function getAllProductionType(options) {
            return entities.ProductionType.getAll(serviceName, options);
        };



        function getAllProducedMaterialItem(options) {
            return entities.ProducedMaterialItem.getAll(serviceName, options);
        };

        function deleteWorkOrder(data) {
            return commands.DeleteWorkOrder.call(serviceName, data);
        };

        function release(data) {
            return commands.ReleaseOrder.call(serviceName, data);
        };

        //DABCUSTOM new Release command
        function dabrelease(data) {
            return commands.DABReleaseOrder.call(serviceName, data);
        };

        function createFromProcess(data) {
            return commands.CreateWorkOrderFromProcess.call(serviceName, data);
        };

        function createManually(data) {
            return commands.CreateWorkOrder.call(serviceName, data);
        };

        function createAsPlanned(data) {
            return commands.UADMCreateWorkOrdersFromAsPlannedBOP.call(serviceName, data);
        };

        function createHeader(data) {
            return commands.CreateWorkOrderHeader.call(serviceName, data);
        };

        function split(data) {            
            return commands.UADMSplitWorkOrder.call(serviceName, data);
        };

        function abort(data) {
            return commands.UADMAbortWorkOrder.call(serviceName, data);
        };

        function edit(data) {
            return commands.EditWorkOrder.call(serviceName, data);
        };

        function assignMaterialItems(data) {
            return commands.AssignProducedMaterialItems.call(serviceName, data);
        };

        function disassignMaterialItems(data) {
            return commands.UADMDisAssignProducedMaterialitems.call(serviceName, data);
        };

        function generateAndAssignMaterialItems(data) {
            return commands.UADMCreateAndAssignProducedMaterialItems.call(serviceName, data);
        };

        function reserveMaterialItems(data) {
            return commands.ReserveMaterialItems.call(serviceName, data);
        };

        function undoScrapWorkOrder(data) {
            return commands.UADMRemoveWorkOrderScrap.call(serviceName, data);
        };

        function verify(data) {
            return commands.UADMVerifyWorkOrder.call(serviceName, data);
        };

        function unverify(data) {
            return commands.UADMUnVerifyWorkOrder.call(serviceName, data);
        };

        function getAsBuilt(options) {
            return entities.AsBuilt.getAll(serviceName, options);
        }

        function exportGenealogy(data) {
            return commands.UADMExportGenealogy.call(serviceName, data);
        }

        function GetMaterialItemListForVerifyWorkOrder() {
            return commands.GetMaterialItemListForVerifyWorkOrder.call(serviceName, {});
        }

        function setForScheduling(data) {
            return commands.SetWorkOrderForScheduling.call(serviceName, data);
        }

        function mergeWorkOrderToProcess(data) {
            return commands.MergeWorkOrderToProcess.call(serviceName, data);
        }

        function loadInspectionData(data) {
            return commands.LoadInspectionData.call(serviceName, data);
        }

        return {
            getAll: getAll,
            getAllProductionType: getAllProductionType,
            getAllProducedMaterialItem: getAllProducedMaterialItem,
            deleteWorkOrder: deleteWorkOrder,
            release: release,
            dabrelease: dabrelease,
            createFromProcess: createFromProcess,
            createManually: createManually,
            createAsPlanned: createAsPlanned,
            createHeader: createHeader,
            split: split,
            abort: abort,
            edit: edit,
            assignMaterialItems: assignMaterialItems,
            generateAndAssignMaterialItems: generateAndAssignMaterialItems,
            disassignMaterialItems: disassignMaterialItems,
            reserveMaterialItems: reserveMaterialItems,
            operation: operation,
            undoScrapWorkOrder: undoScrapWorkOrder,
            history: history,
            hold: hold,
            futurehold: futurehold,
            holdreason: holdreason,
            verify: verify,
            unverify: unverify,
            asBuilt: {
                getAll: getAsBuilt
            },
            exportGenealogy: exportGenealogy,
            notification: notification,
            GetMaterialItemListForVerifyWorkOrder: GetMaterialItemListForVerifyWorkOrder,
            setForScheduling: setForScheduling,
            mergeWorkOrderToProcess: mergeWorkOrderToProcess,
            loadInspectionData: loadInspectionData
        }
    }
})();