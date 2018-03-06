(function () {
    'use strict';

    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.services.runtime');

    var serviceName = 'u4dm.services.runtime';

    mod.factory(serviceName, [
        '$q',
        'common.widgets.filter.service',
        'common.services.authentication',
        'u4dm.constants',
        'u4dm.services',
        'u4dm.services.runtime.utils',
        'u4dm.services.runtime.material',
        'u4dm.services.runtime.dcd',
        'u4dm.services.runtime.wooperations',
        'u4dm.services.runtime.qms',
        'common.base',
        u4dmRuntimeService
    ]).config(['uadm.services.api.commandsProvider', 'u4dm.services.api.commandListProvider', configFunction]);

    var moduleName = 'Siemens.SimaticIT.U4DM.AppU4DM.operatorLanding';
    var screenName = 'home.UADM_operatorLanding_operatorLanding';

    function configFunction(commandsProvider, commandListProvider) {
        commandListProvider.addCommands(moduleName, screenName,
           [
              commandsProvider.Commands.UADMStartWOStep,
              commandsProvider.Commands.UADMUseTool,
              commandsProvider.Commands.UADMStartOperation,
              commandsProvider.Commands.UADMSkipWOOperationFullQty,
              commandsProvider.Commands.UADMSkipWOOperationSerialized,
              commandsProvider.Commands.UADMSkipWOOperationTransferBatch,
              commandsProvider.Commands.UADMPauseWorkOrderOperationMultiMachineList,
              commandsProvider.Commands.UADMPauseWorkOrderOperationList,
              commandsProvider.Commands.UADMManageToBeConsumedMaterialDisassemble,
              commandsProvider.Commands.UADMGetActiveUserListOnWorkOrderOperation,
              commandsProvider.Commands.UADMDisassembleMaterialItem,
              commandsProvider.Commands.UADMCreateTravellingWork,
              commandsProvider.Commands.UADMConsumeMaterialItemList,
              commandsProvider.Commands.UADMCompleteOperation,
              commandsProvider.Commands.UADMCompleteWOOperationFullQtyMultiMachineList,
              commandsProvider.Commands.UADMCompleteWOOperationSerializedList,
              commandsProvider.Commands.UADMCompleteWOOperationTransferBatchList,
              commandsProvider.Commands.UADMCompleteWOOperationTransferBatchMultiMachineList,
              commandsProvider.Commands.UADMCompleteWOStepList,
              commandsProvider.Commands.UADMStartWOOperationSerializedList,
              commandsProvider.Commands.UADMStartWOOperationTransferBatchList,
              commandsProvider.Commands.UADMTransferAMData,
              commandsProvider.Commands.UADMSaveDocumentForPreview,
              commandsProvider.Commands.UADMSaveDCDRuntimeTaskValues,
              commandsProvider.Commands.UADMAutoTransferAMData,
              commandsProvider.Commands.CompleteWOStepList,
              commandsProvider.Commands.DNCPreviewDNCItem,
              commandsProvider.Commands.DNCTransferDNCItems,
              commandsProvider.Commands.SkipWOOperationFullQty,
              commandsProvider.Commands.SkipWOOperationSerialized,
              commandsProvider.Commands.SkipWOOperationTransferBatch,
              commandsProvider.Commands.UADMCreateSnagAndNoteList,
              commandsProvider.Commands.UADMConfirmSnagAndNoteList,
              commandsProvider.Commands.UADMCreateNonConformance,
              commandsProvider.Commands.UADMCreateChangeNonConformance,
              commandsProvider.Commands.UADMCreateDocument,
              commandsProvider.Commands.GetExecutionContext,
              commandsProvider.Commands.CreateDCDRuntimeTasks,
              commandsProvider.Commands.CreateToBeUsedDocuments
           ]);

    }

    function u4dmRuntimeService(
        $q,
        filterSvc,
        authenticationSvc,
        u4dmConstants,
        u4dmSvc,
        runtimeUtilsSvc,
        runtimeMaterialSvc,
        runtimeDCDSvc,
        wooperations,
        runtimeQMSSvc,
        commonBase
        ) {
        var cacheProperties = [
            'ValidatedStartParams',
            'ValidatedCompleteParams',
            'ValidatedPauseParams',
            'ValidatedSkipParams',
            'CurrentWorkOrderOperation',
            'CurrentWorkOrderStep',
            'CurrentDoc',
            'PartiallyAddedDefect',
            'CurrentSelectedDefectTypes',
            {
                name: 'CurrentNonConformances',
                entity: 'NonConformance',
                keyField: 'Id',
                odataOptions: '$select=Id,NId,Equipment,MaterialDefinition,DefectNId, DefectCode, DefectName,NonConformanceLifecycle,ToolDefinition,WorkOrder,WorkOrderOperation,EndDate,Notes,SerialNumber,Severity,StartDate,Status,Type,MaterialItem&$expand=Defects($expand=DefectType)'
            }
        ];
        u4dmSvc.data.cache.addPropertyAccessors(cacheProperties);


        function customize(fncName, callback) {
            return u4dmSvc.customizator.customizeServiceMethod(serviceName, fncName, callback);
        }

        return {
            'getWorkOrderOperations': wooperations.getWorkOrderOperations,
            'getWorkOrderOperationDetails': wooperations.getWorkOrderOperationDetails,

            'getCachedWorkOrderOperation': getCachedWorkOrderOperation,
            'getCachedWorkOrderStep': getCachedWorkOrderStep,

            'getWorkOrderOperationsByOrderId': getWorkOrderOperationsByOrderId,
            'getWorkOrderWithDependencies': getWorkOrderWithDependencies,

            'getWorkOrderSteps': wooperations.steps.getWorkOrderSteps,
            'getWorkOrderStepDetails': wooperations.steps.getWorkOrderStepDetails,

            'getMaterialDefinitionDocuments': getMaterialDefinitionDocuments,
            'getMaterialDefinitionDocumentsList': getMaterialDefinitionDocumentsList,

            'startWorkOrderOperations': startWorkOrderOperations,
            'pauseWorkOrderOperations': pauseWorkOrderOperations,
            'skipWorkOrderOperation': skipWorkOrderOperation,
            'getPauseReasons': getPauseReasons,
            'getSkipReasons': getSkipReasons,
            'completeWorkOrderOperations': completeWorkOrderOperations,
            'createTravellingWork': createTravellingWork,
            'completeSteps': completeSteps,
            'actualUsedTools': actualUsedTools,

            //material assembly
            'getConsumendMaterialForOperation': getConsumendMaterialForOperation,
            'setUADMConsumeMaterialItem': setUADMConsumeMaterialItem,
            'consumeMaterialItems': consumeMaterialItems,
            'disassembleTbcm': disassembleTbcm,
            'getAllActualProducedMaterialByOp': getAllActualProducedMaterialByOp,
            'getToBeProducedMaterials': getToBeProducedMaterials,

            'getPartProgramForMachines': getPartProgramForMachines,

            //non-conformance
            'getAllDefectGroups': getAllDefectGroups,
            'getAllGroupNamesByIds': getAllGroupNamesByIds,
            'getSubGroupsByDefectGroupId': getSubGroupsByDefectGroupId,
            'getDefectTypesByGroupId': getDefectTypesByGroupId,
            'getNonConformanceByWorkOrderOperationId': getNonConformanceByWorkOrderOperationId,
            'getNonConformanceHistoryById': getNonConformanceHistoryById,
            'getNonConformanceHistoryByIds': getNonConformanceHistoryByIds,
            'getNonConformanceStatus': getNonConformanceStatus,
            'createNonConformance': createNonConformance,
            'nonConformanceSeverityOptions': nonConformanceSeverityOptions,
            'nonConformanceTransition': nonConformanceTransition,
            'updateUADMSentenceNonConformance': updateUADMSentenceNonConformance,

            //DCDs
            'getRuntimeDCDs': getRuntimeDCDs,
            'getRuntimeDcdTask': runtimeDCDSvc.getRuntimeDcdTask,
            'saveDCDRuntimeTaskValues': saveDCDRuntimeTaskValues,
            'getUseDCDWidgetConfigKey': getUseDCDWidgetConfigKey,
            'getAllowOORSaveConfigKey': getAllowOORSaveConfigKey,
            'getEnableAutoSaveConfigKey': getEnableAutoSaveConfigKey,
            'loadDcdOnDemand': runtimeDCDSvc.loadDcdOnDemand,
            'createDcdRuntimeTask': runtimeDCDSvc.createDcdRuntimeTask,
            'getRuntimeDcdFromDCDIds': runtimeDCDSvc.getRuntimeDcdFromDCDIds,
            //Change-Type
            'getChangeType': getChangeType,
            'saveChangeRequest': saveChangeRequest,
            'previewDNC': previewDNC,

            // Start/Complete Operations
            'getToBeUsedMaterials': getToBeUsedMaterials,
            'validateMultiOperationStart': validateMultiOperationStart,
            'validateMultiOperationPause': validateMultiOperationPause,
            'validateMultiOperationSkip': validateMultiOperationSkip,
            'getToBeAndActualProducedMaterials': getToBeAndActualProducedMaterials,
            'validateMultiOperationComplete': validateMultiOperationComplete,
            'getAutomaticRedirectToDetails': getAutomaticRedirectToDetails,

            'getWorkOrderOperationAmFactor': getWorkOrderOperationAmFactor,

            //3D management
            'autoTransferPrintJobFileToMachine': autoTransferPrintJobFileToMachine,
            'transferPrintJobFileToMachine': transferPrintJobFileToMachine,
            'transferDNCList': transferDNCList,
            'get3DPrinterMachinesForCurrentUser': get3DPrinterMachinesForCurrentUser,
            'getActualPrintJobFiles': getActualPrintJobFiles,
            'getPrintJobFiles': getPrintJobFiles,
            'getPrintJobFilesHistory': getPrintJobFilesHistory,
            'linkMachineToPrintJobFileList': linkMachineToPrintJobFileList,
            'unlinkMachineFromPrintJobFileList': unlinkMachineFromPrintJobFileList,
            'getPluginAndExternalMachine': getPluginAndExternalMachine,
            'getPartProgramHistory': getPartProgramHistory,

            'getToBeUsedSubstrates': getToBeUsedSubstrates,
            'getActualUsedSubstrates': getActualUsedSubstrates,
            'getToolsForToolDefinition': getToolsForToolDefinition,
            'getSubsForToolDefinition': getSubsForToolDefinition,
            'useSubstrate': useSubstrate,

            'getActiveUsedMachineFromMachineId': wooperations.getActiveUsedMachineFromMachineId,

            'getActualProducedMaterialForWO': getActualProducedMaterialForWO,
            'skipWorkOrderOperation2': skipWorkOrderOperation2,

            'loadDNC': loadDNC,
            'loadDNCRoot': loadDNCRoot,
            'loadDNCChildren': loadDNCChildren,

            'getPreKitValidationKey': getPreKitValidationKey,
            'isUserAssignedToSomeOperations': isUserAssignedToSomeOperations,

            //material management
            'consumePrekitMaterials': runtimeMaterialSvc.consumePrekitMaterials,
            'getMaterialToBePrekit': runtimeMaterialSvc.getMaterialToBePrekit,
            'getBatchActualProducedMaterials': runtimeMaterialSvc.getBatchActualProducedMaterials,
            'getSerialsActualProducedMaterials': runtimeMaterialSvc.getSerialsActualProducedMaterials,
            'buildProducedMaterialItems': runtimeMaterialSvc.buildProducedMaterialItems,
            'getAllToBeProducedMaterials': runtimeMaterialSvc.getToBeProducedMaterials,
            'getSerialNumberForMachineSerialized': getSerialNumberForMachineSerialized,
            'getSerialNumberForMachineFullSerialized': getSerialNumberForMachineFullSerialized,
            'getSerialNumberForMachineFullQuantity': getSerialNumberForMachineFullQuantity,
            'getSerialNumberForMachineTransferBatch': getSerialNumberForMachineTransferBatch,


            'qms': runtimeQMSSvc

        };

        function getPreKitValidationKey() {
            return customize('getPreKitValidationKey', function () {
                return u4dmSvc.api.configKeys.getAll('$filter=NId eq \'prekitValidationNeeded\'');
            })();
        }

        function loadDNCRoot(machineId, machineDefinitionId) {
            return customize('loadDNCRoot', function (machineId, machineDefinitionId) {
                var options = [
                    '$filter=Parent_Id eq null',
                    ' and DNCItemMachineMaterialAssociationList/any(list: list/MachineToDNC/Equipment_Id eq ', machineId,
                    ' or list/MachineToDNC/Equipment_Id eq ', machineDefinitionId,
                    ')&$expand=DNCItemMachineMaterialAssociationList($expand=MachineToDNC($select=DNCMachine))'
                ].join('');
                return u4dmSvc.api.equipment.dnc.getAllDNCItem(options);
            })(machineId, machineDefinitionId);
        };

        function loadDNC(machineId, machineDefinitionId, dncId) {
            return customize('loadDNC', function (machineId, machineDefinitionId, dncId) {
                var options = [''];
                if (dncId) {
                    options.push("$filter=DNCId eq '", dncId,
                        "'&$expand=DNCItemMachineMaterialAssociationList($expand=MachineToDNC($select=DNCMachine);$select=MachineToDNC,MaterialDefinition_Id)");
                } else {
                    options.push('$filter=DNCItemMachineMaterialAssociationList/any(list: list/MachineToDNC/Equipment_Id eq ', machineId,
                        ' or list/MachineToDNC/Equipment_Id eq ', machineDefinitionId,
                        ')&$expand=DNCItemMachineMaterialAssociationList($expand=MachineToDNC($select=DNCMachine);$select=MachineToDNC,MaterialDefinition_Id)');
                }

                return u4dmSvc.api.equipment.dnc.getAllDNCItem(options.join(''));
            })(machineId, machineDefinitionId, dncId);
        };

        function loadDNCChildren(dncParentId) {
            return customize('loadDNCChildren', function (dncParentId) {
                return u4dmSvc.api.equipment.dnc.getAllDNCItem('$filter=Parent_Id eq ' + dncParentId);
            })(dncParentId);
        }

        function unlinkMachineFromPrintJobFileList(pjfList) {
            return customize('unlinkMachineFromPrintJobFileList', function (pjfList) {
                var payload = {
                    ActualUsedMachinePJFList: []
                };
                pjfList.forEach(function (pjf) {
                    payload.ActualUsedMachinePJFList.push(pjf.ActualUsedMachinePjfId);
                });
                return u4dmSvc.api.workOrder.operation.machine.unlinkActualUsedMachineFromPjf(payload);
            })(pjfList);
        };

        function linkMachineToPrintJobFileList(machineId, pjfList) {
            return customize('linkMachineToPrintJobFileList', function (machineId, pjfList) {
                var payload = {
                    ActualUsedMachine: machineId,
                    PrintJobFileList: []
                };
                pjfList.forEach(function (pjf) {
                    payload.PrintJobFileList.push({
                        PrintJobFileId: pjf.Id,
                        // definition of Template: TODO: at this moment this flag is ignored, but it's necessary to check see RunTimeOnly, ProductSerialNumberManagement and TestsBarSerialNumberManagement
                        //if RunTimeOnly == true ==> IsSource == false; but if RunTimeOnly == false ??
                        IsSource: false
                    });
                });
                return u4dmSvc.api.workOrder.operation.machine.linkActualUsedMachineToPjf(payload);
            })(machineId, pjfList);
        };

        function getWorkOrderOperationAmFactor(workOpTypeId) {
            return customize('getWorkOrderOperationAmFactor', function (workOpTypeId) {
                var options = '$filter=Id eq ' + workOpTypeId + '&$select=AM';
                return u4dmSvc.data.getAll('WorkOperationType', options);
            })(workOpTypeId);
        }

        function getPluginAndExternalMachine(machine) {
            return customize('getPluginAndExternalMachine', function (machine) {
                var options = [
                    '$filter=Machine_Id eq ', machine.Id,
                    ' or PrinterType_Id eq ', machine.MachineDefinitionId_Id
                ].join('');
                return u4dmSvc.api.workOrder.operation.machine.getMachineToAM(options);
            })(machine);
        }

        function getPrintJobFiles(woType, quantity, materialDefinition, machine) {
            return customize('getPrintJobFiles', function (woType, quantity, materialDefinition, machine) {
                var options = [
                    '$filter=PrintJobFileAssociation/any(pjfAssoc: (pjfAssoc/Quantity/Val ge ', quantity,
                    ' or pjfAssoc/Quantity/Val eq null)',
                    ' and (pjfAssoc/MaterialDefinition_Id eq ', materialDefinition,
                    ' or pjfAssoc/MaterialDefinition_Id eq null)',
                    ')',
                    ' and ((PrinterList/any(m: m/Machine_Id eq ', machine.Id,
                    ' or m/MachineDefinition_Id eq ', machine.MachineDefinitionId_Id, '))',
                    ' or (PrinterList/all(m: m eq null)))'
                ].join('');

                return u4dmSvc.api.am.pjf.getAll(options);
            })(woType, quantity, materialDefinition, machine);
        };

        function getSerialNumberForMachineFullQuantity(workOrderOperationId, all) {
            return customize('getSerialNumberForMachineFullQuantity', function (workOrderOperationId, all) {
                var options = [
                '$select=BatchId,PartialWorkedQuantity,EquipmentName,UserId',
                '&$filter=WorkOrderOperation eq ', workOrderOperationId,
                ' and PartialWorkedQuantity ge 0'
                ];

                if (!all) {
                    options.push('&$top=1');
                }

                return u4dmSvc.api.workOrder.operation.material.getAllActiveActualProducedMaterial(options.join(''));
            })(workOrderOperationId, all);
        }

        function getSerialNumberForMachineFullSerialized(workOrderOperationId, all) {
            return customize('getSerialNumberForMachineFullSerialized', function (workOrderOperationId, all) {
                var options = [
                '$select=SerialNumberCode,EquipmentName,UserId',
                '&$filter=WorkOrderOperation eq ', workOrderOperationId,
                ' and PartialWorkedQuantity ge 0'
                ];

                if (!all) {
                    options.push('&$top=1');
                }

                return u4dmSvc.api.workOrder.operation.material.getAllActiveActualProducedMaterial(options.join(''));
            })(workOrderOperationId, all);
        }

        function getSerialNumberForMachineTransferBatch(workOrderOperationId, all) {
            return customize('getSerialNumberForMachineTransferBatch', function (workOrderOperationId, all) {
                var options = [
                '$select=BatchId,PartialWorkedQuantity,EquipmentName,UserId',
                '&$filter=WorkOrderOperation eq ', workOrderOperationId,
                ' and PartialWorkedQuantity ge 0'
                ];

                if (!all) {
                    options.push('&$top=1');
                }

                return u4dmSvc.api.workOrder.operation.material.getAllActualProducedMaterial(options.join(''));
            })(workOrderOperationId, all);
        }

        function getSerialNumberForMachineSerialized(workOrderOperationId, all) {
            return customize('getSerialNumberForMachineSerialized', function (workOrderOperationId, all) {
                var options = [
                '$select=SerialNumberCode,EquipmentName,UserId',
                '&$filter=WorkOrderOperation eq ', workOrderOperationId,
                ' and PartialWorkedQuantity ge 0'
                ];

                if (!all) {
                    options.push('&$top=1');
                }

                return u4dmSvc.api.workOrder.operation.material.getAllActualProducedMaterial(options.join(''));
            })(workOrderOperationId, all);
        }

        function getPartProgamHistorySerialized(workOrderOperationId, all) {
            return customize('getPrintJobFilesHistorySerialized', function (workOrderOperationId, all) {
                var options = [
                '$expand=MaterialItem,WorkOrderHistory($expand=Equipment)&$orderby=WorkOrderHistory/UserId,WorkOrderHistory/Date',
                '&$filter=WorkOrderHistory/WorkOrderOperation_Id eq ', workOrderOperationId,
                ' and WorkOrderHistory/Action/NId eq \'', u4dmConstants.workOrderHistoryActions.transferDNCItem, '\''
                ];

                if (!all) {
                    options.push('&$top=1');
                }

                return u4dmSvc.api.workOrder.history.getMaterialItems(options.join(''));
            })(workOrderOperationId, all);
        }

        function getPartProgramHistory(machineId, workOrderOperationId) {
            return customize('getPartProgramHistory', function (machineId, workOrderOperationId) {
                var options = [
                   '$expand=Action&$orderby=UserId,Date',
                   '&$filter=Equipment_Id eq ', machineId,
                   ' and WorkOrderOperation_Id eq ', workOrderOperationId,
                   ' and Action/NId eq \'', u4dmConstants.workOrderHistoryActions.transferDNCItem, '\''
                ];

                return u4dmSvc.api.workOrder.history.getAll(options.join(''));
            })(machineId, workOrderOperationId);
        }

        function getPrintJobFilesHistory(machineId, workOrderOperationId, printJobFileId) {
            return customize('getPrintJobFilesHistory', function (machineId, workOrderOperationId, printJobFileId) {
                var options = [
                '$expand=Action&$orderby=UserId,Date',
                '&$filter=Equipment_Id eq ', machineId,
                ' and WorkOrderOperation_Id eq ', workOrderOperationId,
                ' and (Action/NId eq \'', u4dmConstants.workOrderHistoryActions.transferPJFEnd,
                '\' or Action/NId eq \'', u4dmConstants.workOrderHistoryActions.transferPJFStart, '\')'
                ];
                if (printJobFileId) {
                    options.push(" and PrintJobFile eq '", printJobFileId, "'");
                }

                return u4dmSvc.api.workOrder.history.getAll(options.join(''));
            })(machineId, workOrderOperationId, printJobFileId);
        }

        function getToBeUsedSubstrates(machineId, wooId, woStepId, machineDefinitionId) {
            return customize('getToBeUsedSubstrates', function (machineId, wooId, woStepId, machineDefinitionId) {

                var substrateClassName = u4dmSvc.constants.AMConstants.SubstrateToolClass;

                var filterId = null;

                if (woStepId) {
                    filterId = ['WorkOrderStep_Id eq ', woStepId].join('');
                } else {
                    filterId = ['WorkOrderOperation_Id eq ', wooId].join('');;
                }

                var filter = [
                    '$expand=ToolDefinition($expand=ToolDefinitionCompatibleMachine)',
                    '&$filter=', filterId,
                    ' and ToolDefinition/ToolClassNId eq \'', substrateClassName, '\'',
                    " and (",
                        ' ToolDefinition/ToolDefinitionCompatibleMachine/any(compMachine: compMachine/Machine/Id eq ', machineId, ')',
                        ' or ToolDefinition/ToolDefinitionCompatibleMachine/any(compMachineDef: compMachineDef/MachineDefinition/Id eq ', machineDefinitionId, ')',
                        ' or ToolDefinition/ToolDefinitionCompatibleMachine/any(compMachineDef: compMachineDef/MachineDefinition/Id eq null)',
                        ' or not ToolDefinition/ToolDefinitionCompatibleMachine/any()',
                    ")"
                ];

                return u4dmSvc.api.workOrder.operation.tool.getAllToBeUsedTool(filter.join(''));
            })(machineId, wooId, woStepId, machineDefinitionId);
        }

        function getActualUsedSubstrates(wooId, stepId) {
            return customize('getActualUsedSubstrates', function (wooId, stepId) {

                var substrateClassName = u4dmSvc.constants.AMConstants.SubstrateToolClass;

                var filterId = null;

                if (stepId) {
                    filterId = ['WorkOrderStep_Id eq ', stepId].join('');
                } else {
                    filterId = ['WorkOrderOperation_Id eq ', wooId].join('');;
                }

                var filter = [
                    "$expand=ToolDefinition,Tool($expand=ToolCompatibleMachine)",
                    "&$filter=", filterId,
                    " and ToolDefinition/ToolClassNId eq '", substrateClassName, "'",
                    //" and (",
                    //    "Tool/ToolCompatibleMachine/any(ToolCompatibleMachine: ToolCompatibleMachine/Machine_Id eq ", machineId, ")",
                    //    ' or ToolDefinition/ToolDefinitionCompatibleMachine/any(compMachine: compMachine/Machine/Id eq ', machineId, ')',
                    //    ' or ToolDefinition/ToolDefinitionCompatibleMachine/any(compMachineDef: compMachineDef/MachineDefinition/Id eq ', machineDefinitionId, ')',
                    //    ' or ToolDefinition/ToolDefinitionCompatibleMachine/any(compMachineDef: compMachineDef/MachineDefinition/Id eq null)',
                    //    ' or not ToolDefinition/ToolDefinitionCompatibleMachine/any()',
                    //")"
                ];

                if (stepId) {
                    filter.push(" and WorkOrderStep_Id eq ", stepId);
                } else {
                    filter.push(' and WorkOrderOperation_Id eq ', wooId);
                }

                return u4dmSvc.api.workOrder.operation.step.tool.getAllActualUsedTool(filter.join(''));
            })(wooId, stepId);
        }

        function getToolsForToolDefinition(options, toolDefinitionId) {
            return customize('getToolsForToolDefinition', function (options, toolDefinitionId) {

                var filter = [
                '&$expand=ToolDefinition',
                '&$filter=',
                'ToolDefinition_Id eq ', toolDefinitionId
                ].join('');

                var q = u4dmSvc.utility.combineFilters(options + filter).$resultquery;


                return u4dmSvc.api.tool.toolMgt.getAll(q);
            })(options, toolDefinitionId);
        }

        function getSubsForToolDefinition(options, toolDefinitionId, equipmentId, machineDefinitionId) {  
            return customize('getSubsForToolDefinition', function (options, toolDefinitionId, equipmentId, machineDefinitionId) {
                var AMSubstrate = u4dmConstants.AMConstants.SubstrateToolClass;

                var filter = [
                    '&$expand=ToolDefinition',
                    '&$filter=',
                    'ToolDefinition/ToolClassNId eq \'', AMSubstrate, '\'',
                    ' and ToolDefinition_Id eq ', toolDefinitionId,
                    ' and Status ne \'', u4dmConstants.AMConstants.ToolStatus.Busy, '\'',
                    ' and Status ne \'', u4dmConstants.AMConstants.ToolStatus.Hold, '\'',
                    ' and (',
                        'ToolCompatibleMachine/any(compMachine: compMachine/Machine/Id eq ', equipmentId, ')',
                        ' or ToolCompatibleMachine/any(compMachine: compMachine/MachineDefinition/Id eq ', machineDefinitionId, ')',
                        ' or (ToolCompatibleMachine/any(compMachine: compMachine/MachineDefinition/Id eq null) and ToolCompatibleMachine/any(compMachine: compMachine/Machine/Id eq null))',
                        ' or not ToolCompatibleMachine/any()',
                    ')'
                ].join('');

                var q = u4dmSvc.utility.combineFilters(options + filter).$resultquery;

                return u4dmSvc.api.tool.toolMgt.getAll(q);
            })(options, toolDefinitionId, equipmentId, machineDefinitionId);
        }

        function useSubstrate(payload) {
            return customize('useSubstrate', function (payload) {
                function standardMethod() {
                    return u4dmSvc.api.tool.toolMgt.useTool(payload);
                }

                return customize('useSubstrate', standardMethod)(payload);
            })(payload);
        }

        function getWorkOrderOperationsByOrderId(workOrderId) {
            return customize('getWorkOrderOperationsByOrderId', function (workOrderId) {
                var entity = u4dmSvc.api.entityList.WorkOrderOperation;
                var options = [
                    "$filter=WorkOrder_Id eq " + workOrderId,
                    "&$orderby=Sequence"
                ].join('');
                return u4dmSvc.data.getAll(entity, options);
            })(workOrderId);
        }

        function getCachedWorkOrderOperation(wooId, refresh) {
            return customize('getCachedWorkOrderOperation', function (wooId, refresh) {
                var deferred = $q.defer();
                var woo = refresh ? null : u4dmSvc.data.cache.getCurrentWorkOrderOperation();

                if (woo && woo.Id === wooId) {
                    deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(woo));
                } else {
                    wooperations.getWorkOrderOperationDetails(wooId).then(function (result) {
                        u4dmSvc.data.cache.setCurrentWorkOrderOperation(result.value[0]);
                        deferred.resolve(result);
                    });
                }
                return deferred.promise;
            })(wooId, refresh);
        }

        function getCachedWorkOrderStep(stepId, refresh) {
            return customize('getCachedWorkOrderStep', function (stepId, refresh) {
                var deferred = $q.defer();
                var step = refresh ? null : u4dmSvc.data.cache.getCurrentWorkOrderStep();
                var woo;

                if (step && step.Id === stepId) {
                    deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(step));
                } else {
                    wooperations.steps.getWorkOrderSteps(null, stepId).then(function (result) {
                        deferred.resolve(result);
                    });
                }
                return deferred.promise;
            })(stepId, refresh);
        }

        function getRuntimeDCDs(taskId) {
            return customize('getRuntimeDCDs', function (taskId) {
                var entity = 'DCDRuntimeTask';
                var options = [
                    "$filter=Id eq '" + taskId + "'",
                    "&$expand=RuntimeDCDs($expand=DCD)"
                ].join('');

                return u4dmSvc.data.getAll(entity, options);
            })(taskId);
        }

        function getOperationRuntimeDCDTasks(id) {
            return customize('getOperationRuntimeDCDTasks', function (id) {
                var options = [
                    "$expand=MaterialItem&$filter=WorkOrderOperation eq ", id
                ].join('');

                return u4dmSvc.api.workOrder.operation.dcd.getAll(options);
            })(id);
        }

        function getUseDCDWidgetConfigKey() {
            return customize('getUseDCDWidgetConfigKey', function () {
                var entity = 'ConfigurationKey';
                var options = [
                    "$filter=NId eq 'useDataCollectionWidget'"
                ].join('');

                return u4dmSvc.data.getAll(entity, options);
            })();
        }

        function getAllowOORSaveConfigKey() {
            return customize('getAllowOORSaveConfigKey', function () {
                var entity = 'ConfigurationKey';
                var options = [
                    "$filter=NId eq 'allowOutOfRangeSave'"
                ].join('');

                return u4dmSvc.data.getAll(entity, options);
            })();
        } 

        function getEnableAutoSaveConfigKey() {
            return customize('getAllowOORSaveConfigKey', function () {
                var entity = 'ConfigurationKey';
                var options = [
                    "$filter=NId eq 'enableDCDAutoSave'"
                ].join('');

                return u4dmSvc.data.getAll(entity, options);
            })();
        }

        function getAutomaticRedirectToDetails() {
            return customize('getAutomaticRedirectToDetails', function () {
                var entity = 'ConfigurationKey';
                var options = [
                    "$filter=NId eq 'automaticRedirectToDetails'"
                ].join('');

                return u4dmSvc.data.getAll(entity, options);
            })();
        }

        function getWorkOrderWithDependencies(workOrderId) {
            return customize('getWorkOrderWithDependencies', function (workOrderId) {
                return getWorkOrder().then(
                    function (result) {
                        // then get the operation dependencies and attach them to the order.
                        return getWOOperationDependencies(result.value[0]);
                    }
                );

                function getWorkOrder() {
                    var entity = u4dmSvc.api.entityList.WorkOrder;
                    var options = [
                        "$filter=Id eq " + workOrderId,
                        "&$select=Process_Id,NId,Name",
                        "&$expand=WorkOrderOperations($expand=ActiveUserOnMachines)", //TODO: can I order inside the expand?
                    ].join('');
                    return u4dmSvc.data.getAll(entity, options);
                }

                function getWOOperationDependencies(workOrder) {
                    workOrder.WorkOrderOperations.sort(function (op1, op2) { return op1.Sequence - op2.Sequence; });
                    var deferred = $q.defer();
                    var error;
                    var dependencies = [];
                    var promises = [];
                    workOrder.WorkOrderOperations.forEach(function (op) {
                        promises.push(getDependencies(op.Id));
                    });
                    $q.all(promises).then(
                        function () {
                            if (error) {
                                deferred.reject(error);
                            } else {
                                // TODO - if possible we should be smart about querying rather than post-processing
                                var uniqueDependencies = _.uniq(dependencies, function (dependency) { return dependency.Id; });
                                workOrder.WorkOrderOperationDependencies = uniqueDependencies;
                                deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(workOrder));
                            }
                        }
                    );

                    function getDependencies(wooId) {
                        var entity = u4dmSvc.api.entityList.WorkOOperationDependency;
                        var options = '$filter=From_Id eq ' + wooId + ' or To_Id eq ' + wooId;
                        return u4dmSvc.data.getAll(entity, options).then(
                            function (result) {
                                result.value.forEach(function (dependency) {
                                    dependencies.push(dependency);
                                });
                            },
                            function (reason) {
                                error = reason;
                            }
                        );
                    }
                    return deferred.promise;
                }
            })(workOrderId);
        }


        function startWorkOrderOperations(workOrderOperations, validatedStartParams, qualityInspectionStatus) {
            return customize('startWorkOrderOperations', function (workOrderOperations, validatedStartParams, qualityInspectionStatus) {
                var equipmentNId = '';
                var equipmentName = '';
                if (validatedStartParams.selectedMachine) {
                    equipmentNId = validatedStartParams.selectedMachine.NId;
                    equipmentName = validatedStartParams.selectedMachine.Name;
                } else if (qualityInspectionStatus && qualityInspectionStatus.Machine) {
                    equipmentNId = qualityInspectionStatus.Machine ? qualityInspectionStatus.Machine.NId : '';
                    equipmentName = qualityInspectionStatus.Machine ? qualityInspectionStatus.Machine.Name : '';
                }

                if (validatedStartParams.productionType === u4dmConstants.productionTypes.fullQuantity ||
                    validatedStartParams.productionType === u4dmConstants.productionTypes.fullSerialized) {
                    // both the "full" production types use the same method
                    // we don't have to specify quantity or the list of produced items because the backend knows it is all of them.
                    return startFullOperations();
                } else if (validatedStartParams.productionType === u4dmConstants.productionTypes.transferBatch) {
                    return startTransferBatchOperations();
                } else {
                    return startSerializedOperations();
                }

                function startFullOperations() {
                    var params = [];

                    // start parameters (can be possible to start more than one operation)
                    workOrderOperations.forEach(function (woo) {
                        params.push({
                            NId: woo.NId,
                            Id: woo.Id,
                            EquipmentNId: equipmentNId,
                            EquipmentName: equipmentName
                        });
                    });
                    var payload = {
                        UADMStartOperationParameters: params
                    };

                    return u4dmSvc.api.workOrder.operation.startFullList(payload);
                }

                function startTransferBatchOperations() {
                    var params = [];

                    // populate array of start parameters
                    workOrderOperations.forEach(function (woo) {
                        var qty = !validatedStartParams.transferBatchQuantity || validatedStartParams.transferBatchQuantity == 0 ? -1 : validatedStartParams.transferBatchQuantity; // Note: use -1 when qty=0 to avoid payload malformed!
                        if (qualityInspectionStatus) {
                            qty = parseInt(qualityInspectionStatus.BatchNo);
                            qualityInspectionStatus = _.omit(qualityInspectionStatus, "BatchNo");
                            qualityInspectionStatus = _.omit(qualityInspectionStatus, "Machine");
                        }
                        var obj = {
                            NId: woo.NId,
                            Id: woo.Id,
                            EquipmentNId: equipmentNId,
                            EquipmentName: equipmentName,
                            NotWorkedQuantity: validatedStartParams.notWorkedQuantity == 0 ? -1 : validatedStartParams.notWorkedQuantity, // Note: use -1 when qty=0 to avoid payload malformed!
                            Quantity: qty
                        };

                        if (qualityInspectionStatus && validatedStartParams.selectedSNs) {
                            obj.MaterialItem = {
                                NId: validatedStartParams.selectedSNs[0].NId,
                                SerialNumber: validatedStartParams.selectedSNs[0].BatchId,
                                MaterialDefinitionNId: woo.WorkOrder.FinalMaterial.NId,
                                QualityInspectionStatus: qualityInspectionStatus
                            };
                        }

                        params.push(obj);
                    });

                    var payload = { StartTransferBatchParameterTypeList: params };
                    return u4dmSvc.api.workOrder.operation.startTransferBatchList(payload);
                }

                function startSerializedOperations() {
                    var user = u4dmSvc.security.getCurrentUser().unique_name;
                    var startParams = {
                        StartWOOperationSerializedParameterTypeList: []
                    };

                    var toBeProducedMaterials = [];
                    if (validatedStartParams.selectedSNs) {
                        validatedStartParams.selectedSNs.forEach(function (matl) {
                           
                            var obj = {
                                NId: matl.NId,
                                SerialNumber: matl.SerialNumberCode,
                                MaterialDefinitionNId: matl.MaterialDefinition.NId
                            };
                            if (qualityInspectionStatus) {
                                qualityInspectionStatus = _.omit(qualityInspectionStatus, "BatchNo");
                                qualityInspectionStatus = _.omit(qualityInspectionStatus, "Machine");
                                obj.QualityInspectionStatus = qualityInspectionStatus;
                            }
                            
                            toBeProducedMaterials.push(obj);
                        });
                    }

                    // populate array of start parameters (only a workorderoperation can be started)
                    workOrderOperations.forEach(function (woo) {
                        //only if woo actual is partial
                        //if (woo.Status === u4dmConstants.workOrderOperationStatuses.PARTIAL) {
                        //    woo.ActualProducedMaterials.forEach(function (material) {
                        //        var mat = _.find(toBeProducedMaterials, function (mat) {
                        //            return mat.NId === material.MaterialItem.NId
                        //        });
                        //        if (material.UserId === user && !mat) {
                        //            toBeProducedMaterials.push({
                        //                NId: material.MaterialItem.NId,
                        //                SerialNumber: material.MaterialItem.SerialNumberCode,
                        //                MaterialDefinitionNId: material.MaterialItem.MaterialDefinition.NId
                        //            });
                        //        }
                        //    });
                        //}

                        startParams.StartWOOperationSerializedParameterTypeList.push({
                            NId: woo.NId,
                            EquipmentNId: equipmentNId,
                            EquipmentName: equipmentName,
                            ToBeProducedMaterials: toBeProducedMaterials,
                            Id: woo.Id,
                            ElectronicSignatureId: "",
                        });
                    });
                    return u4dmSvc.api.workOrder.operation.startSerializedList(startParams);
                }
            })(workOrderOperations, validatedStartParams, qualityInspectionStatus);
        }

        function skipWorkOrderOperation(workOrderOperation, validatedStartParams) {
            return customize('skipWorkOrderOperation', function (workOrderOperation, validatedStartParams) {
                if (validatedStartParams.productionType === u4dmConstants.productionTypes.fullQuantity ||
                    validatedStartParams.productionType === u4dmConstants.productionTypes.fullSerialized) {
                    // both the "full" production types use the same method
                    return skipFullQuantityOperations();
                } else if (validatedStartParams.productionType === u4dmConstants.productionTypes.transferBatch) {
                    return skipTransferBatchOperations();
                } else {
                    return skipSerializedOperations();
                }

                function skipFullQuantityOperations() {
                    var command = 'SkipWOOperationFullQty';
                    var params = {
                        WorkOrderOperationId: workOrderOperation.Id,
                        WorkOrderOperationNId: workOrderOperation.NId
                    };
                    return u4dmSvc.data.execute(command, params);
                }

                function skipTransferBatchOperations() {
                    var command = 'SkipWOOperationTransferBatch';
                    var params = {
                        WorkOrderOperationId: workOrderOperation.Id,
                        WorkOrderOperationNId: workOrderOperation.NId,
                        Quantity: validatedStartParams.transferBatchQuantity
                    };
                    return u4dmSvc.data.execute(command, params);
                }

                function skipSerializedOperations() {
                    var command = 'SkipWOOperationSerialized';
                    var params = {
                        WorkOrderOperationId: workOrderOperation.Id,
                        WorkOrderOperationNId: workOrderOperation.NId,
                        MaterialItemIds: _.pluck(validatedStartParams.selectedSNs, 'Id')
                    };
                    return u4dmSvc.data.execute(command, params);
                }
            })(workOrderOperation, validatedStartParams);
        }

        function validateMultiOperationComplete(operationList) {
            return customize('validateMultiOperationComplete', function (operationList) {
                //TODO: may need to make the call to get ToBe and Actual outside this function
                var deferred = $q.defer();
                getToBeAndActualProducedMaterials(operationList).then(function () {
                    deferred.resolve(getCompleteParams());
                });

                return deferred.promise;

                function getCompleteParams() {
                    var canComplete = true;

                    var productionType = operationList[0].WorkOrder.ProductionType.NId;

                    function checkIfAllNotFull() {
                        var notFull = true;
                        operationList.forEach(function (woo) {
                            var productionType = woo.WorkOrder.ProductionType.NId;
                            if (productionType !== u4dmConstants.productionTypes.transferBatch
                                && productionType !== u4dmConstants.productionTypes.serialized)
                                notFull = false;
                        });
                        return notFull;
                    };

                    var completeOptionsRequired = checkIfAllNotFull();

                    //TODO: check if all are not full

                    var electronicSignatureRequired = operationList.some(function (op) {
                        return op.ElectronicSignatureComplete;
                    });
                    var error;
                    var actualProducedMaterials;
                    var user = u4dmSvc.security.getCurrentUser().unique_name.toUpperCase();
                    var completingZero = false;
                    var machines = [];
                    var equipmentList = [];

                    //require single selection for TransferBatch and serialized as we need to gather params for those.
                    if (completeOptionsRequired) {
                        if (operationList.length > 1) {
                            canComplete = false;
                            error = u4dmSvc.globalization.translate('sit.u4dm.error.complete-op.unsupported-production-type');
                        } else {
                            var woo = operationList[0];
                            var isUnactive = !_.find(woo.ActiveUserOnMachines, function (item) { return item.User.toUpperCase() === user });
                            actualProducedMaterials = _.filter(woo.ActualProducedMaterials, function (apm) {
                                //check if there are some machines with complete by different user (and complete by different user is yes) 
                                switch (woo.completeByDiffUser) {
                                    case "YES with standard behaviour":
                                        //check machines and partial worked quantity
                                        return apm.PartialWorkedQuantity > 0 &&
											((apm.Equipment && apm.Equipment.EnabledForCompleteByDifferentUser && isUnactive) || apm.UserId.toUpperCase() === user);
                                    case "YES":
                                        //check machines and partial worked quantity
                                        return apm.PartialWorkedQuantity > 0 &&
											((apm.Equipment && apm.Equipment.EnabledForCompleteByDifferentUser) || apm.UserId.toUpperCase() === user);
                                    default:
                                        return apm.UserId.toUpperCase() === user && apm.PartialWorkedQuantity > 0;
                                }
                                return null;
                            });
                            // handle case of user starting operation with "zero" count. 
                            // can hapen when user1 starts all of a TransferBatch or Serialized order. 
                            // then user2 goes to start same operation. we allow, but send a zero count in start call.
                            // must do the same on complete call. No need to show user complete options.
                            // just set a flag here so backend will be called with correct value.
                            if (!actualProducedMaterials || actualProducedMaterials.length === 0) {
                                completingZero = true;
                                completeOptionsRequired = false;
                                
                                var list = _.filter(woo.ActiveUserOnMachines, function (equip) {
                                    //check if there are some machines with complete by different user (and complete by different user is yes) 
                                    switch (woo.completeByDiffUser) {
                                        case "YES with standard behaviour":
                                            //check machines and partial worked quantity
                                            return (equip.Equipment && equip.Equipment.EnabledForCompleteByDifferentUser && isUnactive) || equip.User.toUpperCase() === user;
                                        case "YES":
                                            //check machines and partial worked quantity
                                            return (equip.Equipment && equip.Equipment.EnabledForCompleteByDifferentUser) || equip.User.toUpperCase() === user;
                                        default:
                                            return equip.Equipment && equip.User.toUpperCase() === user;
                                    }
                                });
                                _.each(list, function (item) { equipmentList.push(item.Equipment.NId)});
                                completeOptionsRequired = equipmentList.length > 1;
                            }
                            else {
                                if (operationList[0].WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.serialized 
                                    || operationList[0].WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.fullSerialized) {
                                    actualProducedMaterials = _.uniq(actualProducedMaterials, false, function (item) { return item.MaterialItem_Id });
                                }
                            }
                        }
                    }
                    else {
                        //all operations selected are full, then select machines can be used, if more than one machine completeOptionsRequired = true
                        var needMachines = false;

                        operationList.forEach(function (woo) {
                            if (canComplete && woo.ActiveUserOnMachines && woo.ActiveUserOnMachines.length > 0) {
                                needMachines = true;
                            }

                            if (canComplete && needMachines) {
                                // se non ho machines allora esco e non posso fare nulla
                                //altrimenti cerco lista machines
                                if (machines) {
                                    if (machines.length == 0) {
                                        woo.ActiveUserOnMachines.forEach(function (machine) {
                                            switch (operationList[0].completeByDiffUser) {
                                                case "YES":
                                                case "YES with standard behaviour":
                                                    //check machines and user
                                                    if (machine) {
                                                        if (machine.User.toUpperCase() === user) {
                                                            machines.push(machine.Equipment ? machine.Equipment.NId : null);
                                                        }
                                                        else if (machine.Equipment && machine.Equipment.EnabledForCompleteByDifferentUser) {
                                                            machines.push(machine.Equipment.NId);
                                                        }
                                                    }
                                                    else {
                                                        machines.push(null);
                                                    }
                                                    break;
                                                default:
                                                    if (machine.User.toUpperCase() === user) {
                                                        machines.push(machine.Equipment ? machine.Equipment.NId : null);
                                                    }
                                            }

                                        });
                                    }

                                    else if (woo.ActiveUserOnMachines.length > 0) {
                                        //controllo se nella lista delle machcine precedenti ne ho a comune, se si interseco, altrimenti invalido
                                        var tmp = [];
                                        woo.ActiveUserOnMachines.forEach(function (machine) {
                                            if (machine.User.toUpperCase() === user) tmp.push(machine.Equipment.NId);
                                        });
                                        var intersection = _.intersection(machines, tmp);
                                        if (intersection.length === 0) {
                                            canComplete = false;
                                            error = u4dmSvc.globalization.translate('sit.u4dm.error.complete-op.unsupported-production-type');
                                            machines = null;
                                        }
                                        else {
                                            machines = intersection;
                                        }
                                    }
                                }
                                else {
                                    canComplete = false;
                                    error = u4dmSvc.globalization.translate('sit.u4dm.error.complete-op.unsupported-production-type');
                                    machines = null;
                                }
                            }
                        });
                        if (canComplete) {
                            completeOptionsRequired = machines.length > 1;
                        }

                    }
                    //TODO: what else to do?

                    var completeParams = {
                        'actualProducedMaterials': actualProducedMaterials,
                        'canComplete': canComplete,
                        'machinesForFull': machines,
                        'completeOptionsRequired': completeOptionsRequired,
                        'electronicSignatureRequired': electronicSignatureRequired,
                        'error': error,
                        'productionType': productionType,
                        'completingZero': completingZero,
                        'equipmentList': equipmentList
                    }
                    return completeParams;
                }
            })(operationList);
        }

        function validateMultiOperationStart(operationList) {
            return customize('validateMultiOperationStart', function (operationList) {
                var deferred = $q.defer();

                operationList = operationList || [];
                var canStart;                       // true if if the operation list passes all validity checks
                var canSkip;                        // true if the user can skip the selected operations (currently only support skip when one selected)
                var status;                         // operation status, usefull in case of paused to start operations
                var commonToBeUsedMachines = [];    // machines that appear in all ToBeUsedMachine lists. show this list to the user for selecting a machine to use
                var electronicSignatureRequired;    // true if any of the operations have ES flag set for starting an operation
                var error;                          // localized error message
                //var backendError;                   // rejection object from a backend call
                var notWorkedQuantity;              // items not yet worked on. applies to transfer batch.
                var productionType;                 // fullQuantity, fullSerialized, etc.
                var isWorkOperationAM;              // true for AM work operation 
                var selectedMachine;                // if only one machine can be selected, it is set here
                var startOptionsRequired;           // true if we require input from the user before starting the op(select machine, choose sn, input qty)
                var inspectOptionsRequired;         //true if we require input from the user before inspect the op
                var toBeProducedMaterials;          // the list of material items that a user is allowed to start.
                var actualProducedMaterials;        // the list of material items thet user producing
                var fullProductionType;             // production type is either FullQuantity or FullSerialized
                var getMachineList;                 // just a flag used internally to indicate we need to get a list of the machines that can be used.
                var canInspect;                     // true if the operation need an ispection
                var inspectionOrderId;                 //if FS or FQ is the inspectionCode
                var inspectionFailed;
                var inspectionCompleted;
                var batchNo;

                if (operationList.length === 1) {
                    canStart = true;
                    
                    var woo = operationList[0];
                    batchNo = woo.quantities;
                    canInspect = woo.WaitingForQuality;

                    productionType = woo.WorkOrder.ProductionType.NId;
                    isWorkOperationAM = !!(woo.WorkOperationType.AM);
                    status = woo.Status;

                    switch (productionType) 
                    {
                        case u4dmConstants.productionTypes.serialized:
                            actualProducedMaterials = woo.ActualProducedMaterials;
                            toBeProducedMaterials = runtimeUtilsSvc.getSerializedMaterialsToStart(woo);
                            var subActual = _.filter(actualProducedMaterials,
                                function (mat) {
                                    return !(mat.CompletedQuantity || mat.ScrappedQuantity || mat.SentencedQuantity || mat.SplitQuantity)
                                });
                            getMachineList = (toBeProducedMaterials.length > 0 || subActual.length > 0) && woo.ToBeUsedMachines.length > 0; // avoid query for machines if we don't need to show user start option list.
                            break;

                        case u4dmConstants.productionTypes.transferBatch:
                            // will be one for transfer batch and it has quantity info on it.
                            toBeProducedMaterials = woo.ToBeProducedMaterials;
                            actualProducedMaterials = woo.ActualProducedMaterials;
                            getMachineList = canStart && woo.ToBeUsedMachines.length > 0; // avoid query when not necessary
                            break;

                        default: 
                            getMachineList = woo.ToBeUsedMachines.length > 0; // avoid query when not necessary
                    }
                    canSkip = canStart && woo.Optional;

                    // with multiple selected, verify production types and operation type are of the allowed type.
                    // must be one of the "full" types and all must be the same.
                    // also check that if any machines are specified, there must be at least one common machine
                }
                else if (productionTypesOK()) {

                    if (workOperationAmTypesOK()) {
                        if (allMachineListsEmpty()) {
                            canStart = true;
                        } else {
                            getMachineList = true;  // call needs to be async
                        }
                    }
                    else {
                        canStart = false;
                        //error set during check for AM operation type
                    }
                } else {
                    canStart = false;
                    //error set during check for production types
                }

                //if (canInspect)
                //{
                //    resolvePromise();
                //}

                if (getMachineList) {
                    //getMachinesForOperation
                    if (operationList.length > 1) {
                        getCommonMachinesList().then(function (result) {
                            commonToBeUsedMachines = result.value;
                            selectedMachine = commonToBeUsedMachines.length === 1 ? commonToBeUsedMachines[0] : null;
                            // if multiple operations and at least one has a ToBeUsedMachine list, then require there is a common machine
                            canStart = commonToBeUsedMachines.length > 0;
                            error = canStart ? '' : u4dmSvc.globalization.translate('sit.u4dm.error.start-op.no-common-machine');
                            resolvePromise();
                        }, function (reason) { deferred.reject(reason); });
                    } else {
                        runtimeUtilsSvc.getMachinesForOperation(operationList[0]).then(function (result) {
                            result.value.forEach(function (machine) {
                                if (machine.Plant === operationList[0].WorkOrder.Enterprise)
                                    commonToBeUsedMachines.push(machine);
                            });
                            //commonToBeUsedMachines = result.value;
                            selectedMachine = commonToBeUsedMachines.length === 1 ? commonToBeUsedMachines[0] : null;
                            resolvePromise();
                        }, function (reason) { deferred.reject(reason); });
                    }
                } else {
                    resolvePromise();
                }

                return deferred.promise;

                function resolvePromise() {
                    if (canInspect) {
                        electronicSignatureRequired = operationList.some(function (op) {
                            return op.ElectronicSignatureComplete;
                        });
                        inspectOptionsRequired = getInspectOptionsRequired();
                        productionType = operationList[0].WorkOrder.ProductionType.NId;
                        if (productionType === u4dmConstants.productionTypes.fullQuantity || productionType === u4dmConstants.productionTypes.fullSerialized) {
                            var inspData = operationList[0].WorkOrderOperationInspectionOrder[0];
                            inspectionOrderId = inspData.InspectionOrderId;
                            inspectionFailed = inspData.Failed;
                            inspectionCompleted = inspData.Completed;
                        }
                    }

                    if (canStart) {
                        // set es required if any of the ops require it
                        electronicSignatureRequired = operationList.some(function (op) {
                            return op.ElectronicSignatureStart;
                        });
                        startOptionsRequired = getStartOptionsRequired();
                        productionType = operationList[0].WorkOrder.ProductionType.NId;
                        notWorkedQuantity = productionType === u4dmConstants.productionTypes.transferBatch ? toBeProducedMaterials.length > 0 ? toBeProducedMaterials[0].Quantity : 0 : null;
                    }

                    var result = {
                        'canStart': canStart,
                        'canSkip': canSkip,
                        'canInspect': canInspect,
                        'status': status,
                        'commonToBeUsedMachines': commonToBeUsedMachines,
                        'electronicSignatureRequired': electronicSignatureRequired,
                        'error': error,
                        //'backendError': backendError,
                        'notWorkedQuantity': notWorkedQuantity,
                        'productionType': productionType,
                        'isWorkOperationAM': isWorkOperationAM,
                        'selectedMachine': selectedMachine,
                        'startOptionsRequired': startOptionsRequired,
                        'inspectOptionsRequired': inspectOptionsRequired,
                        'toBeProducedMaterials': toBeProducedMaterials,
                        'actualProducedMaterials': actualProducedMaterials,
                        'inspectionOrderId': inspectionOrderId,
                        'inspectionCompleted': inspectionCompleted,
                        'inspectionFailed': inspectionFailed,
                        'batchNo': batchNo
                    };
                    deferred.resolve(result);
                }

                // checks if user is trying to restart an op and we need to disallow
                function userCanStart(productionType) {
                    var canStart = true;
                    var user = u4dmSvc.security.getCurrentUser().unique_name;
                    var apmList;
                    var mostRecentApm;
                    if (productionType === u4dmConstants.productionTypes.transferBatch) {
                        // sort list by Id descending. want most recent first.
                        apmList = operationList[0].ActualProducedMaterials.sort(function (a, b) { return b.Id - a.Id; });
                        // first one found for this user represents their last action
                        mostRecentApm = _.find(apmList, function (apm) { return apm.UserId === user; });
                        // cannot start if they are active (partial qty > 0)
                        if (mostRecentApm && mostRecentApm.PartialWorkedQuantity > 0) {
                            canStart = false;
                        }
                    }
                    return canStart;
                }

                // all production types must be the same and type must be fullSerialized or fullQuantity
                function productionTypesOK() {
                    var productionTypeLocal = operationList[0].WorkOrder.ProductionType.NId;
                    if (!(productionTypeLocal === u4dmConstants.productionTypes.fullQuantity
                        || productionTypeLocal === u4dmConstants.productionTypes.fullSerialized)) {
                        error = u4dmSvc.globalization.translate('sit.u4dm.error.start-op.unsupported-production-type');
                        return false;
                    }

                    var allSame = operationList.every(function (op) {
                        return productionTypeLocal === op.WorkOrder.ProductionType.NId;
                    });

                    if (!allSame) {
                        error = u4dmSvc.globalization.translate('sit.u4dm.error.start-op.multiple-production-types');
                        return false;
                    }

                    return true;
                }

                // all work operation AM types must be the same
                function workOperationAmTypesOK() {
                    var isAmWorkOperationType = operationList[0].WorkOperationType.AM;

                    var allSame = operationList.every(function (op) {
                        return isAmWorkOperationType === op.WorkOperationType.AM;
                    });

                    if (!allSame) {
                        error = u4dmSvc.globalization.translate('sit.u4dm.error.start-op.multiple-operation-types');
                        return false;
                    }

                    return true;
                }

                //
                function allMachineListsEmpty() {
                    return operationList.every(function (op) {
                        return op.ToBeUsedMachines.length === 0;
                    });
                }

                // gets a list of the machines, determined from the machine specifications,
                // that are common to all work order operations selected.
                function getCommonMachinesList() {
                    var deferred = $q.defer();
                    var promises = [];
                    var machineLists = [];
                    var commonMachines;
                    var backendError;
                    operationList.every(function (woo) {
                        promises.push(runtimeUtilsSvc.getMachinesForOperation(woo).then(function (result) {
                            machineLists.push({
                                'woo': woo,
                                'machines': result.value
                            });
                        }, function (reason) { backendError = reason; }));
                    });
                    $q.all(promises).then(function (results) {
                        if (backendError) {
                            deferred.reject(backendError);
                        } else {
                            if (machineLists.length === 0) {
                                commonMachines = [];
                            }
                            else if (machineLists.length === 1) {
                                commonMachines = machineLists[0].machines;
                            } else {
                                commonMachines = getCommonMachines();
                            }
                            deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(commonMachines));
                        }
                    });
                    return deferred.promise;

                    function getCommonMachines() {
                        var compareList = machineLists[0].machines.slice(0);
                        var commonList = [];
                        var commonMachineIndexes = [];

                        for (var i = 0; i < compareList.length; i++) {
                            if (machineInAllLists(compareList[i].Id)) {
                                commonMachineIndexes.push(i);
                            }
                        }

                        commonMachineIndexes.forEach(function (idx) {
                            commonList.push(compareList[idx]);
                        });

                        return commonList; // an array of Equipment entities.

                        function machineInAllLists(machineId) {
                            return machineLists.every(function (mList) {
                                return _.find(mList.machines, function (m) { return m.Id === machineId; });
                            });
                        }
                    }
                }

                function getInspectOptionsRequired() {
                    var woo = operationList[0];

                    return woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.serialized ||
                           woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.transferBatch;
                }

                // returns true if we must show the start options view to the user.
                function getStartOptionsRequired() {
                    var woo = operationList[0];
                    var subActual = _.filter(actualProducedMaterials,
                            function (mat) {
                                return !(mat.CompletedQuantity || mat.ScrappedQuantity || mat.SentencedQuantity || mat.SplitQuantity)
                            });
                    // handle case of serialized order and user has already started all, but not completed.
                    // in this case the ToBeProduced list will be zero. they can start again, but we don't need any params
                    if (woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.serialized
                        && toBeProducedMaterials.length === 0 && subActual.length === 0) {
                        return false;
                    }

                    return commonToBeUsedMachines.length > 1 ||
                           woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.serialized ||
                           woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.transferBatch;
                }
            })(operationList);
        }


        function validateMultiOperationPause(operationList) {
            return customize('validateMultiOperationPause', function (operationList) {
                var deferred = $q.defer();

                deferred.resolve(getPauseParams());

                return deferred.promise;

                function getPauseParams() {
                    var canPause = true;

                    var productionType = operationList[0].WorkOrder.ProductionType.NId;
                    var pauseOptionsRequired = false;

                    var electronicSignatureRequired = operationList.some(function (op) {
                        return op.ElectronicSignaturePause;
                    });
                    var error;
                    var user = u4dmSvc.security.getCurrentUser().unique_name.toUpperCase();
                    var machines = [];

                    if (operationList.length > 1) {
                        canPause = false;
                        error = u4dmSvc.globalization.translate('sit.u4dm.error.complete-op.unsupported-production-type');
                    }
                    else {
                        var woo = operationList[0];
                        if (woo.ActiveUserOnMachines && woo.ActiveUserOnMachines.length > 0) {
                            woo.ActiveUserOnMachines.forEach(function (machine) {
                                if (machine.Equipment && machine.User.toUpperCase() === user) machines.push(machine.Equipment);
                        });
                        }
                        pauseOptionsRequired = machines.length > 0;
                    }

                    var pauseParams = {
                        'canPause': canPause,
                        'machines': machines,
                        'pauseOptionsRequired': pauseOptionsRequired,
                        'electronicSignatureRequired': electronicSignatureRequired,
                        'error': error,
                        'productionType': productionType
                    }

                    return pauseParams;
                };
            })(operationList);
        };

        function validateMultiOperationSkip(operationList) {
            return customize('validateMultiOperationSkip', function (operationList) {
                var deferred = $q.defer();

                deferred.resolve(getSkipParams());

                return deferred.promise;

                function getSkipParams() {
                    var canSkip = true;

                    var productionType = operationList[0].WorkOrder.ProductionType.NId;
                    var skipOptionsRequired = false;

                    var error;
                    var user = u4dmSvc.security.getCurrentUser().unique_name;

                    if (operationList.length > 1) {
                        canSkip = false;
                        error = u4dmSvc.globalization.translate('sit.u4dm.error.complete-op.unsupported-production-type');
                    }
                    else {
                        var woo = operationList[0];
                        skipOptionsRequired = false;
                    }

                    var skipParams = {
                        'workOrderId': operationList[0].WorkOrder_Id,
                        'workOperationId': operationList[0].Id,
                        'canSkip': canSkip,
                        'skipOptionsRequired': skipOptionsRequired,
                        'error': error,
                        'productionType': productionType
                    }

                    var prod = _.map(woo.WorkOrder.WorkOrderOperations, function (x) { if (x.ToBeProducedMaterials.length > 0) return x.ToBeProducedMaterials[0].Quantity; })
                    var count = 0;
                    for (var i = 0; i < prod.length; i++) {
                        if (prod[i] !== undefined) {
                            count += prod[i];
                        }
                    }

                    if (productionType === u4dmConstants.productionTypes.transferBatch && count > 0) {
                        skipParams.maxQuantityToSkipForTransferBatch = count;
                    }

                    return skipParams;
                };
            })(operationList);
        };

        function pauseWorkOrderOperations(workOrderOperations, reasonNId, machineList) {
            return customize('pauseWorkOrderOperations', function (workOrderOperations, reasonNId, machineList) {
                var pauseParams = {
                    PauseMultiMachineParameterTypeList: []
                };
                if (machineList)
                    machineList = _.pluck(machineList, "NId");
                else
                    machineList = [];
                //HACK: at the moment only woo can be selected, this is a fix for bug on ICV get selected items
                var woo = workOrderOperations[0];
                //workOrderOperations.forEach(function (woo) {
                    pauseParams.PauseMultiMachineParameterTypeList.push(
                        {
                            Id: woo.Id,
                            NId: woo.NId,
                            ReasonNId: reasonNId,
                            EquipmentNIdList: machineList
                        }
                    );
                //});

                return u4dmSvc.api.workOrder.operation.pauseMachineList(pauseParams);
            })(workOrderOperations, reasonNId, machineList);
        }

        function getPauseReasons(machines) {
            return customize('getPauseReasons', function (machines) {
                var options = ["$filter=Location eq ''"];
                if (machines) {
                    machines.forEach(function (machine) {
                        options.push("or Location eq '", machine.Parent, "'");
                    });
                }

                return u4dmSvc.data.getAll(u4dmSvc.api.entityList.PauseReason, options.join(''));
            })(machines);
        }

        function getSkipReasons(options) {
            return customize('getSkipReasons', function (options) {
                return u4dmSvc.api.workOrder.operation.getAllSkipReasons(options);
            })(options);
        }

        function getActualProducedMaterialForWO(orderId) {
            return customize('getActualProducedMaterialForWO', function (orderId) {
                var options = ["$filter=WorkOrderOperation/WorkOrder/Id eq ", orderId].join('');
                return u4dmSvc.api.workOrder.operation.material.getAllActualProducedMaterial(options);
            })(orderId);
        }

        function skipWorkOrderOperation2(workOrderOperation, skipParams, productionType) {
            return customize('skipWorkOrderOperation2', function (workOrderOperation, skipParams, productionType) {
                var payload = {
                    ReasonNId: skipParams.reason.NId
                };

                switch (productionType) {
                    case u4dmConstants.productionTypes.transferBatch:

                        payload.WorkOrderOperationId = workOrderOperation[0].Id,
                        payload.WorkOrderOperationNId = workOrderOperation[0].NId,
                        payload.Quantity = skipParams.quantity;

                        return skipWOOperationTransferBatch(payload);

                        break;

                    case u4dmConstants.productionTypes.serialized:

                        payload.WorkOrderOperationId = workOrderOperation[0].Id;
                        payload.WorkOrderOperationNId = workOrderOperation[0].NId;

                        var ids = _.map(skipParams.serialNumbers, function (item) {
                            return item.Id
                        });
                        payload.MaterialItemIds = ids;

                        return skipWOOperationSerialized(payload);

                        break;

                    case u4dmConstants.productionTypes.fullSerialized:
                    case u4dmConstants.productionTypes.fullQuantity:
                    default:
                        payload.WorkOrderOperationDetail = {
                            Id: workOrderOperation[0].Id,
                            NId: workOrderOperation[0].NId
                        };

                        return skipWOOperationFullQty(payload);
                        break;

                }
            })(workOrderOperation, skipParams, productionType);
        }

        function skipWOOperationFullQty(payload) {
            return customize('skipWOOperationFullQty', function (payload) {
                function standardMethod() {
                    return u4dmSvc.api.workOrder.operation.skipWOOperationFullQty(payload);
                }

                return customize('skipWOOperationFullQty', standardMethod)(payload);
            })(payload);
        }

        function skipWOOperationSerialized(payload) {
            return customize('skipWOOperationSerialized', function (payload) {
                function standardMethod() {
                    return u4dmSvc.api.workOrder.operation.skipWOOperationSerialized(payload);
                }

                return customize('skipWOOperationSerialized', standardMethod)(payload);
            })(payload);
        }

        function skipWOOperationTransferBatch(payload) {
            return customize('skipWOOperationTransferBatch', function (payload) {
                function standardMethod() {
                    return u4dmSvc.api.workOrder.operation.skipWOOperationTransferBatch(payload);
                }

                return customize('skipWOOperationTransferBatch', standardMethod)(payload);
            })(payload);
        }

        function completeWorkOrderOperations(workOrderOperations, validatedCompleteParams) {
            return customize('completeWorkOrderOperations', function (workOrderOperations, validatedCompleteParams) {
                //TODO: ensure that getToBeAndActualProducedMaterials has been called to get data we need.
                //      probably needs to happen before complete view opens to collect data.
                // assume we can only complete one production type at a time, but allow for multiple selected.
                var productionType = workOrderOperations[0].WorkOrder.ProductionType.NId;
                var currentUser = u4dmSvc.security.getCurrentUser().unique_name;

                if (productionType === u4dmConstants.productionTypes.fullQuantity || productionType === u4dmConstants.productionTypes.fullSerialized) {
                    return completeFull(validatedCompleteParams);
                } else if (productionType === u4dmConstants.productionTypes.serialized) {
                    return completeSerialized(validatedCompleteParams);
                } else {
                    return completeTransferBatch(validatedCompleteParams);
                }


                // completes FullQuantity and FullSerialized production types.
                function completeFull() {
                    var params = {
                        UADMCompleteOperationParameters: []
                    };
                    
                    var woo = workOrderOperations[0];
                    //TODO: figure out how to set machine
                    //if (woo.ToBeUsedMachines && woo.ToBeUsedMachines.length > 0) {
                    params.UADMCompleteOperationParameters.push(
                        {
                            //'ProducedQty': 1.0, //woo.TargetQuantity, TODO: does this value not matter for full quantity?
                            'NId': woo.NId,
                            //'ElectronicSignatureId': '',    // as of 17Nov16, can be ignored
                            'Id': woo.Id,
                            EquipmentNIdList: woo.ActualUsedMachines.length > 0 ? validatedCompleteParams.machinesForFull : [],
                            Note: ''
                        }
                    );

                    return u4dmSvc.api.workOrder.operation.completeFull(params);
                }

                // completes Serialized production type.
                function completeSerialized() {
                    // only support completing one operation at a time
                    var woo = workOrderOperations[0];

                    var paramList = [];
                    var params = {
                        CompleteSerializedWoOpParameterList: []
                    };

                    if (!validatedCompleteParams.completingZero) {
                        validatedCompleteParams.selectedSNs.forEach(function (item) {
                            var equip = paramList[item.Equipment ? item.Equipment.NId : ''];
                            if (equip) {
                                equip.push(item);
                            }
                            else {
                                paramList[item.Equipment ? item.Equipment.NId : ''] = [item];
                            }
                        });

                        params.CompleteSerializedWoOpParameterList.push({
                            Id: woo.Id,
                            NId: woo.NId,
                            Notes: '',
                            ActualProducedMaterials: [],
                            ElectronicSignatureId: ''    // as of 17Nov16, can be ignored
                        });
                        var paramMats = [];

                        _.keys(paramList).forEach(function (key) {
                            var materials = _.map(paramList[key], function (sn) {
                                return {
                                    NId: sn.NId,
                                    SerialNumber: sn.SerialNumberCode,
                                    MaterialDefinitionNId: sn.MaterialDefinition.NId,
                                    EquipmentNId: key
                                }
                            });
                            paramMats = paramMats.concat(materials);
                        });
                        params.CompleteSerializedWoOpParameterList[0].ActualProducedMaterials = paramMats;
                    }
                    else {
                        if (validatedCompleteParams.equipmentList.length > 0) {
                            _.each(validatedCompleteParams.equipmentList, function (equipNId) {
                                params.CompleteSerializedWoOpParameterList.push({
                                    Id: woo.Id,
                                    NId: woo.NId,
                                    Notes: '',
                                    ActualProducedMaterials: [],
                                    ElectronicSignatureId: '',    // as of 17Nov16, can be ignored
                                    EquipmentNId: equipNId
                                });
                            });
                        }
                        else {
                            params.CompleteSerializedWoOpParameterList.push({
                                Id: woo.Id,
                                NId: woo.NId,
                                Notes: '',
                                ActualProducedMaterials: [],
                                ElectronicSignatureId: '',    // as of 17Nov16, can be ignored
                                EquipmentNId: ''
                            });
                        }
                        
                    }

                    return u4dmSvc.api.workOrder.operation.completeSerialized(params);
                }

                // completes TransferBatch production type.
                function completeTransferBatch() {
                    // only support completing one TransferBatch at a time
                    var woo = workOrderOperations[0];
                    var apm;
                    if (!validatedCompleteParams.completingZero) {
                        apm = validatedCompleteParams.transferBatchMachineAndQuantity;
                    } else {
                        // we need a material, just ignore quantity from this apm.
                        apm = woo.ActualProducedMaterials[0];
                    }

                    if (apm && apm.length > 0 && !validatedCompleteParams.completingZero) {
                        return executeCompleteCall(apm);
                    } else {
                        return executeCompleteCall(null);
                    }

                    function executeCompleteCall(equipmentAndQuantity) {
                        var QuantityList = [];
                        if (validatedCompleteParams.completingZero) {
                            QuantityList.push({
                                'Quantity': 0,
                                'ScrapQuantity': 0,
                                'EquipmentNId': woo.ActiveUserOnMachines && (woo.ActiveUserOnMachines.length > 0 && woo.ActiveUserOnMachines[0].Equipment) ? woo.ActiveUserOnMachines[0].Equipment.NId : null
                            });
                        }
                        else {
                            if (equipmentAndQuantity)
                                equipmentAndQuantity.forEach(function (data) {
                                    QuantityList.push({
                                        'Quantity': data.quantity,
                                        'ScrapQuantity': 0,
                                        'EquipmentNId': data.equipment
                                    });
                                });
                        };
                        var params = {
                            CompleteTransferBatchParameterTypeList: [{
                                'Id': woo.Id,
                                'NId': woo.NId,
                                'ElectronicSignatureId': '',
                                'Notes': '',
                                'QuantityList': QuantityList
                            }]
                        };

                        return u4dmSvc.api.workOrder.operation.completeTransferBatch(params);
                    }
                }

                function getEquipmentById(id) {
                    var entity = u4dmSvc.api.entityList.Equipment;
                    var options = '$filter=Id eq ' + id;
                    return u4dmSvc.data.getAll(entity, options);
                }
            })(workOrderOperations, validatedCompleteParams);
        }

        function isUserAssignedToSomeOperations() {
            return customize('isUserAssignedToSomeOperations', function () {
                var deferred = $q.defer();
                var user = u4dmSvc.security.getCurrentUser().unique_name;
                var options = ["$top=1&$filter=UserId eq '",
                    user,
                    "' and WorkOrderOperation/Status ne '",
                    u4dmConstants.workOrderOperationStatuses.COMPLETE, 
                    "' and WorkOrderOperation/Status ne '",
                    u4dmConstants.workOrderOperationStatuses.NOT_EXECUTED,
                    "' and WorkOrderOperation/Status ne '",
                    u4dmConstants.workOrderOperationStatuses.ABORTED,
                    "' and WorkOrderOperation/Status ne '",
                    u4dmConstants.workOrderOperationStatuses.DELETED,
                    "'"
                ];

                u4dmSvc.api.workOrder.operation.getWorkOrderOperationUsers(options.join("")).then(function (result) {
                    deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(result.value.length > 0));
                }, function (reason) {
                    deferred.reject(reason);
                });

                return deferred.promise;
            })();
        }

        function getAllDefectGroups() {
            return customize('getAllDefectGroups', function () {
                var options = "$filter=not(ParentGroups/any())&$expand=DefectGroupSpecifications";
                return u4dmSvc.data.getAll('DefectGroup', options);
            })();
        }

        function getSubGroupsByDefectGroupId(groupId) {
            return customize('getSubGroupsByDefectGroupId', function (groupId) {
                var options = [
                    "$select=ChildGroups&$filter=(Id eq ",
                    groupId,
                    ")",
                    "&$expand=ChildGroups($select=Group;$expand=Group($expand=DefectGroupSpecifications))"
                ].join(' ');

                return u4dmSvc.data.getAll('DefectGroup', options).then(function (result) {
                    if (result.value && result.value.length > 0) {
                        result.value = _(result.value[0].ChildGroups).pluck('Group');
                    }
                    return result;
                });
            })(groupId);
        }

        function getDefectTypesByGroupId(groupId) {
            return customize('getDefectTypesByGroupId', function (groupId) {
                var options = [
                    "&$expand=DefectSpecifications&$select=*&$filter=Groups/any(group: group/Group_Id eq ",
                    groupId,
                    ")"
                ].join(' ');
                return u4dmSvc.data.getAll('DefectType', options);
            })(groupId);
        }

        function getNonConformanceByWorkOrderOperationId(wooId) {
            return customize('getNonConformanceByWorkOrderOperationId', function (wooId) {
                var options = "$filter=WorkOrderOperation_Id eq " + wooId + " and Defects/any()&$expand=Defects($expand=DefectType,NonConformance)";
                return u4dmSvc.data.getAll('NonConformance', options);
            })(wooId);
        }

        function getNonConformanceHistoryById(ncId) {
            return customize('getNonConformanceHistoryById', function (ncId) {
                var options = "$filter=NonConformance eq '" + ncId + "'&$expand=Resources,Attachments";
                return u4dmSvc.data.getAll('NonConformanceHistory', options);
            })(ncId);
        }

        function getNonConformanceHistoryByIds(ncIds) {
            return customize('getNonConformanceHistoryByIds', function (ncIds) {
                var filter = "";

                for (var i = 0; i < ncIds.length; i++) {
                    if (i == 0) {
                        filter += "&$filter=NonConformance eq '" + ncIds[i] + "'";
                    } else {
                        filter += " or NonConformance eq '" + ncIds[i] + "'";
                    }
                }

                var options = filter + "&$expand=Resources,Attachments";
                return u4dmSvc.data.getAll('NonConformanceHistory', options);
            })(ncIds);
        }

        function getNonConformanceStatus() {
            return customize('getNonConformanceStatus', function () {
                var options = [
                   "search=NonConformanceStatus",// todo: current status of non conformance ....// todo: current status of non conformance ....
                ].join(' ');
                return u4dmSvc.data.getAll('NonConformanceStatus', options);
            })();
        }

        function getAllGroupNamesByIds() {
            return customize('getAllGroupNamesByIds', function () {
                var options = "$select=Name,Id"
                return u4dmSvc.data.getAll('DefectGroup', options).then(function (data) {
                    if (data.value && data.value.length > 0) {
                        data.value = data.value.reduce(function (resultMap, group) {
                            resultMap[group.Id] = group.Name;
                            return resultMap;
                        }, {});
                    }
                    return data;
                });
            })();
        }

        function setUADMConsumeMaterialItem(toBeAssembledMaterialList) {
            return customize('setUADMConsumeMaterialItem', function (toBeAssembledMaterialList) {
                var completeParams = {
                    WorkOrderOperationId: toBeAssembledMaterialList.WorkOrderOperationId,
                    WorkOrderOperationNId: toBeAssembledMaterialList.WorkOrderOperationNId,
                    Notes: 'notes',
                    MaterialItemToConsumeList: [{
                        'TargetMaterialItem': toBeAssembledMaterialList.ToBeUsedMachines.TargetMaterialItem,
                        'ToBeConsumedMaterialItemList': []
                    }]
                };
                var command = 'UADMConsumeMaterialItemList';

                toBeAssembledMaterialList.ToBeUsedMachines.ToBeConsumedMaterialItemList.forEach(function (item) {
                    completeParams.MaterialItemToConsumeList[0].ToBeConsumedMaterialItemList.push(item);
                });

                return u4dmSvc.data.execute(command, completeParams);
            })(toBeAssembledMaterialList);
        }

        function consumeMaterialItems(consumeMaterialItemsParams) {
            return customize('consumeMaterialItems', function (consumeMaterialItemsParams) {
                var consumeParams = {
                    WorkOrderOperationId: consumeMaterialItemsParams.WorkOrderOperationId,
                    WorkOrderOperationNId: consumeMaterialItemsParams.WorkOrderOperationNId,
                    Notes: consumeMaterialItemsParams.Notes,
                    MaterialItemToConsumeList: [] // filled in below
                };
                // Build list of target material items and the items that are being assembled into them
                var haveItemsToConsume = consumeMaterialItemsParams.TargetMaterialItems.filter(function (tmi) {
                    return tmi.MaterialItemsToConsume && (tmi.MaterialItemsToConsume.length > 0);
                });

                consumeParams.MaterialItemToConsumeList = _.map(haveItemsToConsume, function (tmi) {
                    var mitc = {
                        TargetMaterialItem: {
                            NId: tmi.NId,
                            SerialNumber: tmi.SerialNumber,
                            MaterialDefinitionNId: tmi.MaterialDefinitionNId
                        }
                    };

                    mitc.ToBeConsumedMaterialItemList = tmi.MaterialItemsToConsume;

                    return mitc;
                });

                var deferred = $q.defer();
                if (consumeParams.MaterialItemToConsumeList.length > 0)
                    deferred.resolve(new u4dmSvc.api.workOrder.operation.material.consumeMaterialItemList(consumeParams));
                return deferred.promise;
            })(consumeMaterialItemsParams);
        }


        function disassembleTbcm(disassembleParams) {
            return customize('disassembleTbcm', function (disassembleParams) {
                var command = 'UADMManageToBeConsumedMaterialDisassemble';
                //var disassembleParams = {
                //    WorkOrderOperationId: wooId,
                //    ToBeConsumedMaterialId: tbcmId
                //};
                return u4dmSvc.data.execute(command, disassembleParams);
            })(disassembleParams);
        }

        function getToBeProducedMaterials(options, wooId) {

            return customize('getToBeProducedMaterials', function (options, wooId) {
                var q = '$top=25&$skip=0&$count=true' + [
                  "&$expand=MaterialItem($expand=MaterialDefinition)&$filter=WorkOrderOperation_Id eq " + wooId
                ].join('');
                return u4dmSvc.api.workOrder.operation.material.getAllToBeProducedMaterial(q);
            })(options, wooId);
        }

        function getAllActualProducedMaterialByOp(options, wooId) {
            return customize('getAllActualProducedMaterialByOp', function (options, wooId) {
                var q = '$top=25&$skip=0&$count=true' + [
                    "&$filter=WorkOrderOperation_Id eq " + wooId
                ].join('');
                return u4dmSvc.api.workOrder.operation.material.getAllActualProducedMaterial(q);
            })(options, wooId);
        }

        function getConsumendMaterialForOperation(wooId) {
            return customize('getConsumendMaterialForOperation', function (wooId) {
                var options = [
                    "$filter=WorkOrderOperation_Id eq " + wooId,
                    "&" + pom.odata.selectStandard,
                    "&$expand=MaterialDefinition,ActualConsumedMaterials",
                ].join('');
                return u4dmSvc.data.getAll(u4dmSvc.api.entityList.ToBeConsumedMaterial, '');
            })(wooId);
        }

        function saveDCDRuntimeTaskValues(taskId, parameterDataList) {
            return customize('saveDCDRuntimeTaskValues', function (taskId, parameterDataList) {
                var command = 'UADMSaveDCDRuntimeTaskValues';
                var completeParams = {
                    TaskId: taskId,
                    ParametersData: parameterDataList
                };

                var commandModel = {};
                commandModel.appName = u4dmConstants.appName;
                commandModel.commandName = command;
                commandModel.params = completeParams;
                return commonBase.services.runtime.commandService.invoke(commandModel);

                //return u4dmSvc.data.execute(command, completeParams);
            })(taskId, parameterDataList);
        }

        function createTravellingWork(param) {
            return customize('createTravellingWork', function (param) {
                //need to first get NId from Id, than call command
                var entity = u4dmSvc.api.entityList.WorkOrderOperation;
                var options = "$filter=Id eq " + param.WorkOrderOperationNId + " &$select=NId";


                return u4dmSvc.data.getAll(entity, options).then(function (result) {
                    var command = 'UADMCreateTravellingWork';
                    var CreateTravellingWorkParam = {
                        NId: param.NId,
                        WorkOrderOperationNId: result.value[0].NId,
                        Notes: param.Notes
                    };
                    return u4dmSvc.data.execute(command, CreateTravellingWorkParam);
                });
            })(param);
        }

        function completeSteps(steps) {
            return customize('completeSteps', function (steps) {
                var completeParams = {
                    WorkOrderStepListDetails: []
                };

                steps.forEach(function (step) {
                    completeParams.WorkOrderStepListDetails.push(
                        {
                            Id: step.Id,
                            NId: step.NId
                        }
                    );
                });

                return u4dmSvc.api.workOrder.operation.step.complete(completeParams);
            })(steps);
        }

        function transferPrintJobFileToMachine(pjf, externalMachine, wooId, machineId) {
            return customize('transferPrintJobFileToMachine', function (pjf, externalMachine, wooId, machineId) {
                var payload = {
                    PrintJobFileId: pjf.Id,
                    PrintJobFileExternalId: pjf.ExternalId,
                    MachineExternalId: externalMachine,
                    WorkOrderOperationId: wooId,
                    MachineId: machineId
                };

                return u4dmSvc.api.workOrder.operation.machine.transferAMData(payload);
            })(pjf, externalMachine, wooId, machineId);
        };

        function previewDNC(dncId) {
            return customize('previewDNC', function (dncId) {
                var payload = {
                    DNCId: dncId
                };

                return u4dmSvc.api.workOrder.operation.machine.dncPreview(payload);
            })(dncId);
        }

        function transferDNCList(wooId, machineId, dncList) {
            return customize('transferDNCList', function (wooId, machineId, dncList) {
                var dncMachine = dncList[0].DNCItemMachineMaterialAssociationList[0].MachineToDNC.DNCMachine;

                var payload = {
                    DNCMachine: dncMachine,
                    DNCIds: {
                        Values: []
                    },
                    WorkOrderOperationId: wooId,
                    MachineId: machineId
                };

                dncList.forEach(function (dnc) {
                    payload.DNCIds.Values.push(dnc.DNCId);
                });

                return u4dmSvc.api.workOrder.operation.machine.dncTransferDNCItems(payload);
            })(wooId, machineId, dncList);
        };

        function autoTransferPrintJobFileToMachine(wooId, machineId) {
            return customize('autoTransferPrintJobFileToMachine', function (wooId, machineId) {
                var payload = {
                    WorkOrderOperationId: wooId,
                    MachineId: machineId
                };

                return u4dmSvc.api.workOrder.operation.machine.autoTransferAMData(payload);
            })(wooId, machineId);
        };

        function createNonConformance(data) {
            return customize('createNonConformance', function (data) {
                var params = {
                    NonConformanceDetails: {

                        //NId: '', // will we ever need to set this?
                        WorkOrderNId: data.workOrderOperation.WorkOrder.NId,
                        WorkOrderOperationNId: data.workOrderOperation.NId,
                        //ToolNId: '', // where to get?
                        //SerialNumber: '', // skip for now but will probably need soon for serialized materials
                        //EquipmentNId: data.workOrderOperation.activeUsers.length > 0 ? data.workOrderOperation.activeUsers[0].equipmentId : '', // should be able to get...
                        //MaterialDefintionNId: '' //
                        Severity: data.nonConformance.severity.NId,
                        //HistoryId: '', // where to get?
                        //NonConformanceLifecycleNId: '', // where to get?
                        NonConformanceType: u4dmConstants.NCNotificationTypes.QUALITY,//'QUALITY', // where to get?
                        Notes: data.nonConformance.notes
                    },
                    NonConformanceHistoryDetails: {
                        //Id: '', // where to get?
                        Detections: data.nonConformanceHistory.Detections,
                        //Resources: []
                        Attachments: data.nonConformanceHistory.attachments,
                        Notes: data.nonConformance.notes,
                        //UserId: data.workOrderOperation.activeUsers.length > 0 ? data.workOrderOperation.activeUsers[0].id : ''
                        UserId: u4dmSvc.security.getCurrentUser().unique_name
                    },
                    DefectsDetails: _.map(data.defectTypes, function (dt) {
                        return { DefectNId: dt.NId, GroupPath: dt.path, Notes: data.nonConformance.notes };
                    })
                }

                if (data.nonConformance.nId) params.NonConformanceDetails.NId = data.nonConformance.nId;

                return u4dmSvc.data.execute('UADMCreateNonConformance', params);
            })(data);
        }

        function nonConformanceSeverityOptions() {
            return customize('nonConformanceSeverityOptions', function () {
                var entity = u4dmSvc.api.entityList.NonConformanceSeverity;
                var options = '$select=Id,NId,Name,Description,Value';
                return u4dmSvc.data.getAll(entity, options);
            })();
        }

        function actualUsedTools(wooId, wosId) {
            return customize('actualUsedTools', function (wooId, wosId) {
                var substrateClassName = u4dmSvc.constants.AMConstants.SubstrateToolClass;
                var identifier = wooId ? "WorkOrderOperation_Id eq " + wooId : "WorkOrderStep_Id eq " + wosId;

                var options = [
                    '$select=UsedTimes,Id,ToolDefinition_Id,WorkOrderOperation_Id,WorkOrderStep_Id,Tool_Id&$expand=Tool,ToolDefinition',
                    "&$filter=", identifier,
                    " and ToolDefinition/ToolClassNId ne '", substrateClassName, "'"
                ].join('');

                return u4dmSvc.api.workOrder.operation.tool.getAllActualUsedTool(options);
            })(wooId, wosId);
        }

        function nonConformanceTransition() {
            return customize('nonConformanceTransition', function () {
                var options = [
                  "search=NonConformanceTransition",// todo: current status of non conformance ....
                ].join(' ');
                return u4dmSvc.data.getAll('NonConformanceTransition', options);
            })();
        }

        function updateUADMSentenceNonConformance(nonConformance) {
            return customize('updateUADMSentenceNonConformance', function (nonConformance) {
                var commandParam = {
                    NonConformanceNId: nonConformance.nonConformanceNId,
                    Notes: nonConformance.notes,
                    NonConformanceStatusNid: nonConformance.nonConformanceStatusNid,
                    DocumentIds: nonConformance.documentIds,
                }
                return u4dmSvc.data.execute('UADMSentenceNonConformance', commandParam);
            })(nonConformance);
        }

        function getChangeType() {
			
			//DABCUSTOM Get Change of type NId=CHANGE PART QTY
			var options = "$filter=NId eq 'CHANGE PART QTY'";
			
            return customize('getChangeType', function () {
                return u4dmSvc.data.getAll('ChangeType', options);
            })();
        }

        function saveChangeRequest(changeRequestParam) {
            return customize('saveChangeRequest', function (changeRequestParam) {
                var command = 'UADMCreateChangeNonConformance';
                return u4dmSvc.data.execute(command, changeRequestParam);
            })(changeRequestParam);
        }

        function getPartProgramForMachines(wooId, machineList) {
            return customize('getPartProgramForMachines', function (wooId, machineList) {
                var deferred = $q.defer();
                var calls = [];
                var actualUsedMachines = [];

                machineList.forEach(function (machine) {
                    if (machine) {
                        var options = ["$expand=Machine",
                            "&$filter=WorkOrderOperation_Id eq ", wooId,
                            " and Machine_Id eq ", machine.Id
                        ].join('');

                        calls.push(u4dmSvc.api.workOrder.operation.machine.getActualUsedMachines(options));
                    }
                })

                $q.all(calls).then(function (results) {
                    var error = _.find(results, function (result) {
                        return result.error.errorCode !== 0;
                    });
                    if (error) {
                        deferred.reject(error);
                    } else {
                        calls = [];
                        var dncAndMachines = [];
                        results.forEach(function (res) {
                            actualUsedMachines.push(res.value[0]);
                            if (res.value[0].PartProgram) {
                                var options = ["$filter=DNCId eq '", res.value[0].PartProgram, "'",
                                    "&$expand=DNCItemMachineMaterialAssociationList($expand=MachineToDNC($select=Equipment_Id,DNCMachine);$select=MachineToDNC,MaterialDefinition_Id)"
                                ].join('');
                                calls.push(u4dmSvc.api.equipment.dnc.getAllDNCItem(options));
                            }
                        });
                        $q.all(calls).then(function (resDnc) {
                            var error = _.find(resDnc, function (result) {
                                return result.error.errorCode !== 0;
                            });
                            if (error) {
                                deferred.reject(error);
                            } else {
                                actualUsedMachines.forEach(function (machine) {
                                    if (machine.PartProgram) {
                                        var dnc = _.find(resDnc, function (dncItem) { return dncItem.value.length > 0 && dncItem.value[0].DNCId === machine.PartProgram });
                                        dncAndMachines.push(_.extend(machine, {
                                            DNC: dnc.value[0]
                                        }));
                                    }
                                    else {
                                        dncAndMachines.push(machine);
                                    }
                                });
                                // all load functions update the operation. so just need to resolve using the original result containing that operation.
                                deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(dncAndMachines));
                            }
                        });
                    }
                });

                return deferred.promise;
            })(wooId, machineList);
        };

        function get3DPrinterMachinesForCurrentUser(wooId) {
            return customize('get3DPrinterMachinesForCurrentUser', function (wooId) {
                var printer = u4dmSvc.constants.AMConstants.PrinterMachineDefinition;
                var currentUser = u4dmSvc.security.getCurrentUser().unique_name.toLowerCase();

                var options = [
                    "$expand=Equipment($expand=MachineDefinitionId,MachineToAM)",
                    "&$filter=WorkOrderOperation_Id eq ", wooId,
                    " and (Equipment/MachineDefinitionId/NId eq '", printer,
                    "' or Equipment/MachineDefinitionId/Parent eq '", printer, "')",
                     " and tolower(User) eq '", currentUser, "'"
                ].join('');

                return u4dmSvc.api.workOrder.operation.machine.getActiveUserOnMachine(options);
            })(wooId);
        };

        function getToBeUsedMaterials(wooId) {
            return customize('getToBeUsedMaterials', function (wooId) {
                var options = [
                     "$filter=NId eq '" + wooId + "'&$select=Id&$expand=ToBeProducedMaterials($expand=MaterialItem($expand=MaterialDefinition))" //$select=Quantity
                ].join('');
                return u4dmSvc.data.getAll("WorkOrderOperation", options);
            })(wooId);
        }

        function getActualPrintJobFiles(actualUsedMachine, woo, finalMaterialId, quantity) {
            return customize('getActualPrintJobFiles', function (actualUsedMachine, woo, finalMaterialId, quantity) {
                var options = [
                    '$filter=ActualUsedMachine/Machine_Id eq ', actualUsedMachine.Id,
                    ' and ActualUsedMachine/WorkOrderOperation_Id eq ', woo,
                    ' and PrintJobFile/PrintJobFileAssociation/any(pjfAssoc: (pjfAssoc/Quantity/Val ge ', quantity, ' or pjfAssoc/Quantity/Val eq null) and pjfAssoc/MaterialDefinition_Id eq ', finalMaterialId, ')',
                    '&$expand=ActualUsedMachine,PrintJobFile($expand=PrintJobFileAssociation)'
                ].join('');

                return u4dmSvc.api.workOrder.operation.machine.getActualUsedMachinesPrintJobFile(options);
            })(actualUsedMachine, woo, finalMaterialId, quantity);
        }


        function getToBeAndActualProducedMaterials(woos) {
            return customize('getToBeAndActualProducedMaterials', function (woos) {
                var deferred = $q.defer();
                var promises = [];
                var error;

                woos.forEach(function (woo) {
                    // "full" production types will not have a "ToBe" or "Actual" produced list on the operation
                    if (isFullProductionType(woo)) {
                        woo.ToBeProducedMaterials = [];
                        woo.ActualProducedMaterials = [];
                    } else {
                        promises.push(getFromOperation(woo));
                    }
                });
                $q.all(promises).then(function (results) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve((results)); // don't really need to return anything
                    }
                });

                return deferred.promise;

                function isFullProductionType(woo) {
                    return woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.fullQuantity ||
                           woo.WorkOrder.ProductionType.NId === u4dmConstants.productionTypes.fullSerialized;
                }

                // gets the ToBeProducedMaterials list associated to the WorkOrderOperation
                function getFromOperation(woo) {
                    var entity = u4dmSvc.api.entityList.WorkOrderOperation;
                    //var options = "$filter=NId eq '" + woo.NId + "'&$select=Id&$expand=ToBeProducedMaterials($expand=MaterialItem($expand=MaterialDefinition))";
                    var options = [
                        "$filter=NId eq '" + woo.NId + "'",
                        "&$select=Id",
                        "&$expand=",
                            "ToBeProducedMaterials($expand=MaterialItem($expand=MaterialDefinition)),",
                            "ActualProducedMaterials($expand=MaterialItem($expand=MaterialDefinition),Equipment)"
                    ].join('');

                    return u4dmSvc.data.getAll(entity, options).then(
                        function (result) {
                            woo.ToBeProducedMaterials = result.value[0].ToBeProducedMaterials;
                            woo.ActualProducedMaterials = result.value[0].ActualProducedMaterials;
                        },
                        function (reason) {
                            error = reason;
                        }
                        );
                }
            })(woos);
        }

        function getMaterialDefinitionDocuments(materialDefinitionId) {
            return customize('getMaterialDefinitionDocuments', function (materialDefinitionId) {
                var entity = u4dmSvc.api.entityList.MaterialDefinitionDocument;
                var options = [
                     "$filter=MaterialDefinitionId eq " + materialDefinitionId,
                     "&$expand=Document"
                ].join('');
                return u4dmSvc.data.getAll(entity, options).then(function (result) {
                    // return the "Document" entities attached to the MaterialDefinitionDocument entities.
                    result.value = _.map(result.value, function (matDoc) {
                        return matDoc.Document;
                    });
                    return result;
                });
            })(materialDefinitionId);
        }


        function getMaterialDefinitionDocumentsList(materialDefinitionIds) {
            return customize('getMaterialDefinitionDocumentsList', function (materialDefinitionIds) {
                var deferred = $q.defer();
                var documents = [];

                // One call for each mat def document
                var documentPromises = _.map(materialDefinitionIds, function (matDefId) {
                    return getMaterialDefinitionDocuments(matDefId).then(function (matDefDocResult) {
                        documents = documents.concat(matDefDocResult.value);
                    });
                });

                // after all loaded, resolve promise
                $q.all(documentPromises).then(function () {
                    deferred.resolve(new u4dmSvc.data.SuccessfulGetAllResponse(documents));
                });
                return deferred.promise;
            })(materialDefinitionIds);
        }

    }


})();