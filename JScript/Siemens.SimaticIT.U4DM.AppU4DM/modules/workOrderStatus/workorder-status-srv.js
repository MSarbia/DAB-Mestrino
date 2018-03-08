(function () {
    'use strict';
    var serviceName = 'workOrderStatus_Svc';
    angular.module('Siemens.SimaticIT.U4DM.AppU4DM.workOrderStatus')
        .factory(serviceName, [
            '$q',
            'u4dm.services',
            'u4dm.constants',
            workOrderStatus_Svc
        ]);

    function workOrderStatus_Svc(
        $q,
        u4dmSvc,
        u4dmConstants
    ) {

        var workOperationOptions          = '$expand=WorkOrder,ToBeUsedMachines($expand=Machine),WorkOperationType';
        var workOrderOptionsExt           = '$expand=ParentOrder($select=NId),ProducedMaterialItems($expand=MaterialItem),FinalMaterial,ProductionType($select=NId),WorkOrderOperations';
        var workOrderOptions              = '$expand=FinalMaterial($select=NId, Name,Revision),ProductionType($select=NId),WorkOrderOperations';
        var toBeConsumedMaterialOptions   = '$expand=WorkOrderOperation,MaterialDefinition';
        var actualConsumedMaterialOptions = '$expand=MaterialItem($expand=MaterialDefinition),ProducedMaterialItem($expand=MaterialItem)';
        var toBeUsedDocumentOptions       = '$expand=Document';
        var toBeUsedMachineOptions        = '$expand=Machine,MachineDefinition,PrintJobFiles';
        var workOrderOperationDepOptions  = '$expand=From,To';
        var toBeUsedToolOptions           = '$expand=ToolDefinition';
        var actualUsedToolOptions         = '$expand=ToolDefinition,Tool';
        var actualUsedMachineOptions      = '$expand=Machine';
        var nonConformanceOptions         = '$expand=Defects($expand=DefectType)';
        var workOrderStepDepOptions       = '$expand=From,To';
        var materialItemOptions           = '$expand=MaterialDefinition($select=Id,NId,SerialNumberProfile),ProducedMaterialItems($expand=WorkOrder)';
        var producedMaterialOptions       = '$expand=MaterialItem';
        var runtimeDCDOptions             = '$expand=RuntimeDCDs($expand=DCD)';
        var skillOptions                  = '$expand=Skill';
        var toBeUsedWIOptions             = '$expand=WorkInstruction';

        function customize(fncName, callback) {
            return u4dmSvc.customizator.customizeServiceMethod(serviceName, fncName, callback);
        }

        // define properties for sharing data between states
        var cacheProperties = [
            // volatile cache
            'SelectedWorkOrder',
            'SelectedWorkOrderOperation',
            'SelectedWorkOrderStep',
            'PartiallyAddedOrder',
            'CurrentToBeConsumedMaterials',
            'PartiallyAddedMaterial',
            'SplitWorkOrder',

            // persisted cache
            {
                name: 'CurrentWorkOrders',
                entity: 'WorkOrder',
                keyField: 'Id',
                odataOptions: '$expand=ProductionType,FinalMaterial,WorkOrderOperations'
            },
            {
                name: 'CurrentWorkOrderOperations',
                entity: 'WorkOrderOperation',
                keyField: 'Id',
                odataOptions: ''
            },
            {
                name: 'CurrentWorkOrderSteps',
                entity: 'WorkOrderStep',
                keyField: 'Id',
                odataOptions: ''
            }
        ];

        u4dmSvc.data.cache.addPropertyAccessors(cacheProperties);

        var svc = {};

        //GETTERS ----------------------------------------------------------------
        //ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS ORDERS


        svc.getAll = function (options) {
            return customize('getAll', function (options) {
                var query = u4dmSvc.api.tools.chainQuery(options, workOrderOptions);
                return u4dmSvc.api.workOrder.getAll(query).then(function (result) {
                    result.value.forEach(function (val) {
                        u4dmSvc.humanizer.workOrder.humanize(val);
                        u4dmSvc.humanizer.material.humanize(val.FinalMaterial);
                        val.WorkOrderOperations.forEach(function (woo) {
                            //    TFS 47777 - Request to display an icon that there are active non conformance for the Work Order
                            if (woo.ActiveNonConformanceNr) {
                                val.image = u4dmSvc.icons.icon.workOrderOperationAlert;
                            }
                        });
                    });
                    return result;
                });
            })(options);
        };

        svc.getAllPreKit = function (options) {
            return customize('getAllPreKit', function (options) {
                return u4dmSvc.api.workOrder.getAll(options).then(function (result) {
                    result.value.forEach(function (val) {
                        u4dmSvc.humanizer.workOrder.humanize(val);
                        u4dmSvc.humanizer.material.humanize(val.FinalMaterial);
                        val.WorkOrderOperations.forEach(function (woo) {
                            //    TFS 47777 - Request to display an icon that there are active non conformance for the Work Order
                            if (woo.ActiveNonConformanceNr) {
                                val.image = u4dmSvc.icons.icon.workOrderOperationAlert;
                            }
                        });
                    });
                    return result;
                });
            })(options);
        };

        svc.getById = function (id) {
            return customize('getById', function (id) {
                var query = workOrderOptionsExt + "&$filter=Id eq " + id;
                return u4dmSvc.api.workOrder.getAll(query);
            })(id);
        }

        svc.getWorkOrderSerializedMaterials = function (id) {
            return customize('getWorkOrderSerializedMaterials', function (id) {
                var options = toBeConsumedMaterialOptions + ",WorkOrderStep,PrekitSerialNumberList($expand=ToBeConsumedMaterial,MaterialItem,PrekitMaterialItem)" + "&$filter=MaterialDefinition/SerialNumberProfile and (WorkOrderOperation/WorkOrder/Id eq " + id + "or WorkOrderStep/WorkOrderOperation/WorkOrder/Id eq " + id + " )";
                return u4dmSvc.api.workOrder.operation.material.getAllToBeConsumed(options);
            })(id);
        }

        svc.getProducedMaterialItems = function (orderId) {
            return customize('getProducedMaterialItems', function (orderId) {
                var options = producedMaterialOptions + "&$filter=WorkOrder_Id eq " + orderId;
                return u4dmSvc.api.workOrder.getAllProducedMaterialItem(options);
            })(orderId);
        }

        //OPERATIONS OPERATIONS OPERATIONS OPERATIONS OPERATIONS OPERATIONS OPERATIONS OPERATIONS OPERATIONS OPERATIONS

        svc.LinkOperationToPJF = function (pjfId, machineId) {
            return customize('LinkOperationToPJF', function (pjfId, machineId) {
                var payload = {
                    ToBeUsedMachine: machineId,
                    PrintJobFileList:
                    [
                        {
                            PrintJobFileId: pjfId,
                            IsSource: true
                        }
                    ]
                };
                return u4dmSvc.api.workOrder.operation.machine.linkToBeUsedMachineToPjf(payload);
            })(pjfId, machineId);
        }

        svc.UnLinkOperationToPJF = function (id) {
            return customize('UnLinkOperationToPJF', function (id) {
                var payload = {
                    ToBeUsedMachinePJFList:
                    [
                        id
                    ]
                }
                return u4dmSvc.api.workOrder.operation.machine.unlinkToBeUsedMachineFromPjf(payload);
            })(id);
        }

        svc.getPJFForMachineDefinition = function (machineDefId, materialId) {
            return customize('getPJFForMachineDefinition', function (machineDefId, materialId) {
                var options = '$expand=PrintJobFileAssociation($expand=MaterialDefinition),PrinterList';

                return u4dmSvc.api.am.pjf.getAll(options).then(function (result) {

                    result.value = result.value.filter(function (pjf) {

                        if (pjf.PrinterList.length == 0)
                            return false;

                        if (machineDefId && pjf.PrinterList.length > 0) {
                            if (pjf.PrinterList.filter(function (pr) { return pr.MachineDefinition_Id === machineDefId }).length == 0)
                                return false;
                        }

                        if (materialId && pjf.PrintJobFileAssociation.length > 0) {
                            if (pjf.PrintJobFileAssociation.filter(function (as) { return as.MaterialDefinition_Id === materialId }).length == 0)
                                return false;
                        }

                        return true;
                    });

                    result.value.forEach(function (mat) {
                        u4dmSvc.humanizer.material.humanize(mat.MaterialDefinition);
                    });
                    return result;
                });
            })(machineDefId, materialId);
        }

        svc.getPJFForLocation = function (locationNId, materialId) {
            return customize('getPJFForLocation', function (locationNId, materialId) {
                var options = '$expand=PrintJobFileAssociation($expand=MaterialDefinition),PrinterList';

                return u4dmSvc.api.am.pjf.getAll(options).then(function (result) {

                    return u4dmSvc.api.equipment.getAll("$filter=Parent eq '" + locationNId + "' and (MachineDefinitionId/NId eq '3DPrinter' or MachineDefinitionId/Parent eq '3DPrinter')").then(function (result2) {
                        var children = result2.value;

                        result.value = result.value.filter(function (pjf) {

                            if (pjf.PrinterList.length == 0)
                                return false;

                            if (pjf.PrinterList.filter(function (pr) {
                                 return children.filter(function (eq) { return pr.Machine_Id === eq.Id || pr.MachineDefinition_Id === eq.MachineDefinitionId_Id }).length > 0
                            }).length == 0) {
                                return false;
                            }

                            if (materialId && pjf.PrintJobFileAssociation.length > 0) {
                                if (pjf.PrintJobFileAssociation.filter(function (as) { return as.MaterialDefinition_Id === materialId }).length == 0)
                                    return false;
                            }

                            return true;
                        });

                        result.value.forEach(function (mat) {
                            u4dmSvc.humanizer.material.humanize(mat.MaterialDefinition);
                        });
                        return result;
                    })

                });
            })(locationNId, materialId);
        }

        svc.getPJFForMachine = function (machineId, machineDefId, materialId) {
            return customize('getPJFForMachine', function (machineId, machineDefId, materialId) {
                var options = '$expand=PrintJobFileAssociation($expand=MaterialDefinition),PrinterList';

                return u4dmSvc.api.am.pjf.getAll(options).then(function (result) {
                    result.value = result.value.filter(function (pjf) {

                        if (pjf.PrinterList.length == 0)
                            return false;

                        if (machineId && pjf.PrinterList.length > 0) {
                            if (pjf.PrinterList.filter(function (pr) { return pr.Machine_Id === machineId || pr.MachineDefinition_Id === machineDefId; }).length == 0)
                                return false;
                        }

                        if (pjf.PrintJobFileAssociation.length > 0 && materialId) {
                            if (pjf.PrintJobFileAssociation.filter(function (as) { return as.MaterialDefinition_Id === materialId }).length == 0)
                                return false;
                        }

                        return true;
                    });

                    result.value.forEach(function (mat) {
                        u4dmSvc.humanizer.material.humanize(mat.MaterialDefinition);
                    });
                    return result;
                });
            })(machineId, machineDefId, materialId);
        }


        svc.get3DPrinterLocations = function (plant) {
            return customize('get3DPrinterLocations', function (plant) {
                var filter = "$filter=contains(Plant,'" + plant + "') and LevelId eq 5 and (MachineDefinitionId/NId eq '3DPrinter' or MachineDefinitionId/Parent eq '3DPrinter')"
                return u4dmSvc.api.equipment.getAll(filter).then(function (result) {
                    var calls = [];
                    result.value.forEach(function (m) {
                        calls.push(u4dmSvc.api.equipment.getAll("$filter=NId eq '" + m.Parent + "'"));
                    });
                    return $q.all(calls).then(function (results) {
                        var list = _.map(results, function (r) { return r.value[0]; });
                        return _.uniq(list, function (loc) { return loc.Id; });
                    });
                });
            })(plant);
        }

        svc.getLocations = function (plant) {
            return customize('getLocations', function (plant) {
                var filter = "$filter=contains(Plant,'" + plant + "') and LevelId eq 4";
                return u4dmSvc.api.equipment.getAll(filter);
            })(plant);
        }


        svc.getOperations = function (options) {
            return customize('getOperations', function (options) {
                var query = u4dmSvc.api.tools.chainQuery(options, workOperationOptions);
                return u4dmSvc.api.workOrder.operation.getAll(query);
            })(options);
        };

        //svc.getOperationsByOrderId = function (workOrderId) {
        //    return customize('getOperationsByOrderId', function (workOrderId) {
        //        var options = '$orderby=Sequence&$filter=WorkOrder_Id eq ' + workOrderId;
        //        var query = u4dmSvc.api.tools.chainQuery(options, workOperationOptions);
        //        return u4dmSvc.api.workOrder.operation.getAll(query);
        //    })(workOrderId);
        //};

        svc.getOperationsByOrderId = function (workOrderId,optionsString) {
            return customize('getOperationsByOrderId', function (workOrderId,optionsString) {
                var options = '$orderby=Sequence&$filter=WorkOrder_Id eq ' + workOrderId;
                if (optionsString != null)
                    options = optionsString +'&$filter=WorkOrder_Id eq ' + workOrderId;
                var query = u4dmSvc.api.tools.chainQuery(options, workOperationOptions);
                var com = u4dmSvc.utility.combineFilters(query);
                return u4dmSvc.api.workOrder.operation.getAll(com.$resultquery);
            })(workOrderId, optionsString);
        };

        svc.getOperationByNId = function (workOrderOpNId) {
            return customize('getOperationByNId', function (workOrderOpNId) {
                var options = "$filter=NId eq '" + workOrderOpNId + "'";
                return u4dmSvc.api.workOrder.operation.getAll(options);
            })(workOrderOpNId);
        };

        svc.getOperationById = function (id) {
            return customize('getOperationById', function (id) {
                var options = u4dmSvc.api.tools.chainQuery("$filter=Id eq " + id, workOperationOptions);
                return u4dmSvc.api.workOrder.operation.getAll(options);
            })(id);
        }

        svc.getOperationDocuments = function (operationId) {
            return customize('getOperationDocuments', function (operationId) {
                var options = toBeUsedDocumentOptions + "&$filter=Document/Type ne '" + u4dmConstants.documentTypes.workInstruction + "' and WorkOrderOperation/Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.document.getAll(options);
            })(operationId);
        }

        svc.getOperationWorkInstructions = function (operationId) {
            return customize('getOperationWorkInstructions', function (operationId) {
                var options = toBeUsedDocumentOptions + "&$filter=Document/Type eq '" + u4dmConstants.documentTypes.workInstruction + "' and WorkOrderOperation/Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.document.getAll(options);
            })(operationId);
        }

        svc.getOperationMaterials = function (operationId) {
            return customize('getOperationMaterials', function (operationId) {
                var options = toBeConsumedMaterialOptions + "&$filter=WorkOrderOperation_Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.material.getAllToBeConsumed(options);
            })(operationId);
        }

        svc.getOperationActualConsumedMaterials = function (operationId) {
            return customize('getOperationActualConsumedMaterials', function (operationId) {
                var options = actualConsumedMaterialOptions + "&$filter=WorkOrderOperation_Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.material.getAllActualConsumed(options);
            })(operationId);
        }


        svc.getActualConsumedMaterials = function (options) {
            return customize('getActualConsumedMaterials', function (options) {
                return u4dmSvc.api.workOrder.operation.material.getAllActualConsumed(options);
            })(options);
        }

        svc.getOperationEquipments = function (operationId) {
            return customize('getOperationEquipments', function (operationId) {
                var options = toBeUsedMachineOptions + "&$filter=WorkOrderOperation_Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.machine.getToBeUsedMachines(options);
            })(operationId);
        }

        svc.getOperationEquipmentById = function (id) {
            return customize('getOperationEquipmentById', function (id) {
                var options = toBeUsedMachineOptions + "&$filter=Id eq " + id;
                return u4dmSvc.api.workOrder.operation.machine.getToBeUsedMachines(options);
            })(id);
        }

        svc.getOperationToBeUsedTools = function (operationId) {
            return customize('getOperationToBeUsedTools', function (operationId) {
                var options = toBeUsedToolOptions + "&$filter=WorkOrderOperation_Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.tool.getAllToBeUsedTool(options);
            })(operationId);
        }

        svc.getOperationActualUsedTools = function (operationId) {
            return customize('getOperationActualUsedTools', function (operationId) {
                var options = actualUsedToolOptions + "&$filter=WorkOrderOperation_Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.tool.getAllActualUsedTool(options);
            })(operationId);
        }

        svc.getOperationDefects = function (operationId) {
            return customize('getOperationDefects', function (operationId) {
                var options = nonConformanceOptions + "&$filter=WorkOrderOperation_Id eq " + operationId + 'and Defects/any()';
                return u4dmSvc.api.workOrder.operation.nonconformance.getAll(options);
            })(operationId);
        }

        svc.getOrderOperationsDependencies = function (orderId) {
            return customize('getOrderOperationsDependencies', function (orderId) {
                var options = workOrderOperationDepOptions + "&$filter=To/WorkOrder_Id eq " + orderId + " and From/WorkOrder_Id eq " + orderId;
                return u4dmSvc.api.workOrder.operation.dependency.getAll(options);
            })(orderId);
        }

        svc.getOperationDataCollections = function (operationId) {
            return customize('getOperationDataCollections', function (operationId) {
                var options = '$expand=DCDSpecifications&$filter=Id eq ' + operationId;
                return u4dmSvc.api.bop.process.operation.getAll(options);
            })(operationId);
        };

        
        svc.getRuntimeTaskForToBeUsedDCDTask = function (operationId) {
            return customize('getRuntimeTaskForToBeUsedDCDTask', function (operationId) {
                var options = "$expand=DCDTask($expand=DCDParameters)";
                var calls = [];
                var deferred = $q.defer();

                                   
                calls.push(u4dmSvc.api.workOrder.operation.toBeUsedDCD.getAll(options + "&$filter=WorkOrderOperation_Id eq " + operationId));
               

                
                $q.all(calls).then(function (result) {
                    var tmp = [];
                    angular.forEach(result, function (response) {
                        angular.forEach(response.value, function (response2) {
                            var id           = response2.Id;
                            var dcd          = response2.DCDTask;
                            var isOnDemand   = response2.OnDemand;
                            var isSerialized = response2.Serialized;
                            var tmpNested    = [];
                            angular.forEach(response2.DCDTask.DCDParameters, function (response3) {
                                var obj         = [];
                                obj.Id          = id;
                                obj.Name        = dcd.Name;
                                obj.Version     = dcd.Version;
                                obj.Description = response3.Description;
                                obj.UoM         = response3.UoM;
                                obj.LowerLimit  = response3.LowerLimit;
                                obj.UpperLimit  = response3.UpperLimit;
                                obj.IsOptional  = response3.IsOptional;
                                obj.ParamId     = response3.Id;
                                obj.OnDemand    = isOnDemand;
                                obj.Serialized  = isSerialized;
                                tmp.push(obj);
                            });
                    });
                    });
                    result.value = tmp;
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;

            })(operationId);
        };

        svc.getRuntimeTaskForToBeUsedDCDTaskSteps = function (stepId) {
            return customize('getRuntimeTaskForToBeUsedDCDTaskSteps', function (stepId) {
                var options = "$expand=DCDTask($expand=DCDParameters)";
                var calls = [];
                var deferred = $q.defer();


                calls.push(u4dmSvc.api.workOrder.operation.toBeUsedDCD.getAll(options + "&$filter=WorkOrderStep_Id eq " + stepId));



                $q.all(calls).then(function (result) {
                    var tmp = [];
                    angular.forEach(result, function (response) {
                        angular.forEach(response.value, function (response2) {
                            var id = response2.Id;
                            var dcd = response2.DCDTask;
                            var isOnDemand = response2.OnDemand;
                            var isSerialized = response2.Serialized;
                            var tmpNested = [];
                            angular.forEach(response2.DCDTask.DCDParameters, function (response3) {
                                var obj = [];
                                obj.Id = id;
                                obj.Name = dcd.Name;
                                obj.Version = dcd.Version;
                                obj.Description = response3.Description;
                                obj.UoM = response3.UoM;
                                obj.LowerLimit = response3.LowerLimit;
                                obj.UpperLimit = response3.UpperLimit;
                                obj.IsOptional = response3.IsOptional;
                                obj.ParamId = response3.Id;
                                obj.OnDemand = isOnDemand;
                                obj.Serialized = isSerialized;
                                tmp.push(obj);
                            });
                        });
                    });
                    result.value = tmp;
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;

            })(stepId);
        };


        svc.getToToBeUsedDCDTask = function (operationId) {
            return customize('getToToBeUsedDCDTask', function (operationId) {
                var options = '$filter=WorkOrderOperation_Id eq ' + operationId;
             
                return u4dmSvc.api.workOrder.operation.toBeUsedDCD.getAll(options);
            })(operationId);
        };

        svc.getToToBeUsedDCDTaskStep = function (operationId) {
            return customize('getToToBeUsedDCDTaskStep', function (operationId) {
                var options = '$filter=WorkOrderStep_Id eq ' + operationId;
                return u4dmSvc.api.workOrder.operation.toBeUsedDCD.getAll(options);
            })(operationId);
        };
        svc.getOperationActualUsedMachines = function (operationId) {
            return customize('getOperationActualUsedMachines', function (operationId) {
                var options = actualUsedMachineOptions + '&$filter=WorkOrderOperation_Id eq ' + operationId;
                return u4dmSvc.api.workOrder.operation.machine.getActualUsedMachines(options);
            })(operationId);
        };

        svc.getOperationRuntimeDataCollections = function (operationId) {
            return customize('getOperationRuntimeDataCollections', function (operationId) {
                var options = runtimeDCDOptions + "&$filter=WorkOrderOperation eq " + operationId;
                return u4dmSvc.api.workOrder.operation.dcd.getAll(options);
            })(operationId);
        }

        svc.getOperationsDependent = function (operationId) {
            return customize('getOperationsDependent', function (operationId) {
                var options = workOrderOperationDepOptions + "&$filter=To/Id eq " + operationId + " or From/Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.dependency.getAll(options);
            })(operationId);
        }

        svc.getWorkOrderOpertionWithTargetQuantity = function () {
            return customize('getWorkOrderOpertionWithTargetQuantity', function () {
                var options = "$select=TargetQuantity,Name,Description,NId&$expand=WorkOrder($select=Name,NId)";
                var statusCriteria = [
                "WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Aborted,
                "' and WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Complete,
                "' and WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Edit,
                "' and WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Rework,
                "' and WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Scrap,
                "' and WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Splitted,
                "' and WorkOrder/Status ne '", u4dmConstants.workOrderStatuses.Verified,

                "' and Status ne '", u4dmConstants.workOrderOperationStatuses.ABORTED,
                "' and Status ne '", u4dmConstants.workOrderOperationStatuses.COMPLETE,
                "' and Status ne '", u4dmConstants.workOrderOperationStatuses.DELETED,
                "' and Status ne '", u4dmConstants.workOrderOperationStatuses.NOT_EXECUTED, "'"
                ].join("");


                options = options + '&$filter=' + statusCriteria;
                return u4dmSvc.api.workOrder.operation.getAll(options);
            })();

        }

        //STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS STEPS

        svc.getSteps = function (options) {
            return customize('getSteps', function (options) {
                return u4dmSvc.api.workOrder.operation.step.getAll(options);
            })(options);
        };

        svc.getStepsByOperationId = function (operationId) {
            return customize('getStepsByOperationId', function (operationId) {
                var options = '$filter=WorkOrderOperation_Id eq ' + operationId;
                return u4dmSvc.api.workOrder.operation.step.getAll(options);
            })(operationId);
        };

        svc.getStepById = function (id) {
            return customize('getStepById', function (id) {
                var deferred = $q.defer();
                var step = u4dmSvc.data.cache.getSelectedWorkOrderStep();

                if (step && step.Id === id) {
                    var response = new u4dmSvc.data.SuccessfulGetAllResponse(step);
                    deferred.resolve(response);
                } else {
                    var options = "$filter=Id eq " + id;
                    deferred.resolve(u4dmSvc.api.workOrder.operation.step.getAll(options));
                }

                return deferred.promise;
            })(id);
        }

        svc.getStepMaterials = function (stepId) {
            return customize('getStepMaterials', function (stepId) {
                var options = toBeConsumedMaterialOptions + "&$filter=WorkOrderStep_Id eq " + stepId;
                return u4dmSvc.api.workOrder.operation.step.material.getAllToBeConsumed(options);
            })(stepId);
        }

        svc.getStepToBeUsedTools = function (stepId) {
            return customize('getStepToBeUsedTools', function (stepId) {
                var options = toBeUsedToolOptions + "&$filter=WorkOrderStep_Id eq " + stepId;
                return u4dmSvc.api.workOrder.operation.step.tool.getAllToBeUsedTool(options);
            })(stepId);
        }

        svc.getOperationStepsDependencies = function (operationId) {
            return customize('getOperationStepsDependencies', function (operationId) {
                var options = workOrderStepDepOptions + "&$filter=To/WorkOrderOperation_Id eq " + operationId + " and From/WorkOrderOperation_Id eq " + operationId;
                return u4dmSvc.api.workOrder.operation.step.dependency.getAll(options);
            })(operationId);
        }

        svc.getStepDocuments = function (stepId) {
            return customize('getStepDocuments', function (stepId) {
                var options = toBeUsedDocumentOptions + "&$filter=Document/Type ne '" + u4dmConstants.documentTypes.workInstruction + "'";//+ "' and WorkOrderStep_Id eq " + stepId;

                return u4dmSvc.api.workOrder.operation.step.document.getAll(options);
            })(stepId);
        }

        svc.getStepWorkInstructions = function (stepId) {
            return customize('getStepWorkInstructions', function (stepId) {
               var options = toBeUsedDocumentOptions + "&$filter=Document/Type eq '" + u4dmConstants.documentTypes.workInstruction+"'";//+ "' and WorkOrderStep_Id eq " + stepId;
                return u4dmSvc.api.workOrder.operation.step.document.getAll(options);
            })(stepId);
        }

        svc.getStepDataCollections = function (stepId) {
            return customize('getStepDataCollections', function (stepId) {
                var options = '$expand=DCDSpecifications&$filter=NId eq \'' + stepId + '\'';
                return u4dmSvc.api.bop.process.operation.step.getAll(options);
            })(stepId);
        };

        svc.getStepActualConsumedMaterials = function (stepId) {
            return customize('getStepActualConsumedMaterials', function (stepId) {
                var options = actualConsumedMaterialOptions + "&$filter=WorkOrderStep_Id eq " + stepId;
                return u4dmSvc.api.workOrder.operation.step.material.getAllActualConsumed(options);
            })(stepId);
        }

        svc.getStepActualUsedTools = function (stepId) {
            return customize('getStepActualUsedTools', function (stepId) {
                var options = actualUsedToolOptions + "&$filter=WorkOrderStep_Id eq " + stepId;
                return u4dmSvc.api.workOrder.operation.step.tool.getAllActualUsedTool(options);
            })(stepId);
        }

        svc.getStepRuntimeDataCollections = function (stepId) {
            return customize('getStepRuntimeDataCollections', function (stepId) {
                var options = runtimeDCDOptions + "&$filter=WorkOrderStep eq " + stepId;
                return u4dmSvc.api.workOrder.operation.step.dcd.getAll(options);
            })(stepId);
        }

        // SKILLS

        svc.getWorkOrderOperationSkills = function (operationId) {
            return customize('getWorkOrderOperationSkills', function (operationId) {
                var options = skillOptions + '&$filter=WorkOrderOperation_Id eq ' + operationId;
                return u4dmSvc.api.workOrder.operation.getWorkOrderOperationSkills(options);
            })(operationId);
        };

        svc.unlinkSkillToWorkOrderOperationList = function (workOrderOperationSkill) {
            function standardMethod(workOrderOperationSkill) {
                var ids = [];
                workOrderOperationSkill.forEach(function (result) {
                    ids.push(result.Id);
                });

                var payload = {
                    'WorkOrderOperationSkillIdList': ids
                };
                return u4dmSvc.api.workOrder.operation.unlinkSkillToWorkOrderOperationList(payload);
            }
            return customize('unlinkSkillToWorkOrderOperationList', standardMethod)(workOrderOperationSkill);
        }

        svc.linkSkillToWorkOrderOperationList = function(operationId, skillIds, level) {
            function standardMethod(operationId, skillIds, level) {
                var payload = {
                    'WorkOrderOperationId': operationId,
                    'SkillIdList': skillIds,
                    'Level': level
                };
                return u4dmSvc.api.workOrder.operation.linkSkillToWorkOrderOperationList(payload);
            }
            return customize('linkSkillToWorkOrderOperationList', standardMethod)(operationId, skillIds, level);
        }
        
        svc.editSkillToWorkOrderOperationList = function (workOrderOperationSkillIds, level) {
            function standardMethod(workOrderOperationSkillIds, level) {
                var payload = {
                    'WorkOrderOperationSkillIdList': workOrderOperationSkillIds,
                    'Level': level
                };
                return u4dmSvc.api.workOrder.operation.editSkillToWorkOrderOperationList(payload);
            }
            return customize('editSkillToWorkOrderOperationList', standardMethod)(workOrderOperationSkillIds, level);
        }


        ///////USERS

        svc.getWorkOrderOperationUsers = function (operationId) {
            return customize('getWorkOrderOperationUsers', function (operationId) {
                var options = '$filter=WorkOrderOperation_Id eq ' + operationId;
                return u4dmSvc.api.workOrder.operation.getWorkOrderOperationUsers(options);
            })(operationId);
        };
        
        svc.getUserDetailsList = function(userList, workOrderOperationId, equipmentId) {
            return customize('getUserDetailsList', function (userList, workOrderOperationId, equipmentId) {
                var payload = {
                    UserList: userList,
                    WorkOrderOperationId: workOrderOperationId,
                    EquipmentId: equipmentId
                };
                return u4dmSvc.api.users.getUserDetailsList(payload);
            })(userList, workOrderOperationId, equipmentId);
        }

        svc.unlinkUserToWorkOrderOperationList = function (workOrderOperationUserList) {
            function standardMethod(workOrderOperationUserList) {
                var ids = [];
                workOrderOperationUserList.forEach(function (result) {
                    ids.push(result.Id);
                });

                var payload = {
                    'UserToWorkOrderOperationList': ids
                };
                return u4dmSvc.api.workOrder.operation.unlinkUserToWorkOrderOperationList(payload);
            }
            return customize('unlinkUserToWorkOrderOperationList', standardMethod)(workOrderOperationUserList);
        }

        svc.linkUserToWorkOrderOperationList = function (operationList, userIdList) {
            function standardMethod(operationList, userIdList) {
                var payload = {
                    'UserIdList': userIdList,
                    'WorkOrderOperationIdList': operationList
                };
                return u4dmSvc.api.workOrder.operation.linkUserToWorkOrderOperationList(payload);
            }
            return customize('linkUserToWorkOrderOperationList', standardMethod)(operationList, userIdList);
        }

        //MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC

        svc.getAllDNCItem = function () {
            return customize('getAllDNCItem', function () {
                return u4dmSvc.api.equipment.dnc.getAllDNCItem('$orderby=Name');
            })();
        }

        svc.getWorkOperations = function (options) {
            return customize('getWorkOperations', function (options) {
                return u4dmSvc.api.bop.workoperation.getAll(options);
            })(options);
        }

        svc.getCertifications = function (options) {
            return customize('getCertifications', function (options) {
                return u4dmSvc.api.certification.getAll(options);
            })(options);
        }

        svc.getRoles = function (options) {
            return customize('getRoles', function (options) {
                return u4dmSvc.api.engineering.getRoles(options);
            })(options);
        }


        svc.getToolDefinitions = function (options) {
            return customize('getToolDefinitions', function (options) {
                var com = u4dmSvc.utility.combineFilters(options);
                return u4dmSvc.api.workOrder.operation.tool.getAllToolDefinition(com.$resultquery);
            })(options);
        }


        svc.getToolDefinitionFilter = function (opId) {
            return customize('getToolDefinitionFilter', function (opId) {
                var deferred = $q.defer();
                deferred.resolve();

                if (opId == null) return deferred.promise;

                var filter               = '$select=ToBeUsedMachines&$expand=ToBeUsedMachines($expand=Machine,MachineDefinition)&$filter=Id eq ' + opId;
                var machineDefinitionIds = [];
                var equipmentIds         = [];

                return getworkOrderOperationToBeUsedMachines(filter).then(
                    function (result) {

                        result.value[0].ToBeUsedMachines.forEach(function (equip) {
                            if (equip.MachineDefinition_Id != null) {
                                machineDefinitionIds.push('MachineDefinition_Id eq ' + equip.MachineDefinition_Id + ' ');
                            }
                            if (equip.Machine_Id != null) {
                                equipmentIds.push('(MachineDefinition_Id eq ' + equip.Machine.MachineDefinitionId_Id + ' ) ');
                                equipmentIds.push('( Machine_Id eq ' + equip.Machine_Id + ') ');
                            }
                        });

                        var optionString = [machineDefinitionIds.join(' or '), equipmentIds.join(' or ')];
                        optionString = _.without(optionString, "");

                        if (optionString.length <= 0) return deferred.promise;

                        var filterCompatibleMachine = optionString.length > 0 ? '&$filter=' + optionString.join(' or ') : '';
                        return getToolDefinitionCompatibleMachine(filterCompatibleMachine);
                    });
            })(opId);
        }

        function getworkOrderOperationToBeUsedMachines(options) {
            return customize('getworkOrderOperationToBeUsedMachines', function (options) {
                var com = u4dmSvc.utility.combineFilters(options);
                return u4dmSvc.api.workOrder.operation.getAll(com.$resultquery);
            })(options);
        }

        function getToolDefinitionCompatibleMachine(options) {
            return customize('getToolDefinitionCompatibleMachine', function (options) {
                var com = u4dmSvc.utility.combineFilters(options);
                return u4dmSvc.api.tool.compatiblemachine.getAll(com.$resultquery);
            })(options);
        }

        svc.getAllProductionType = function (options) {
            return customize('getAllProductionType', function (options) {
                return u4dmSvc.api.workOrder.getAllProductionType(options);
            })(options);
        }

        svc.getAllAsPlannedBOP = function (options) {
            return customize('getAllAsPlannedBOP', function (options) {
                return u4dmSvc.api.bop.asplannedbop.getAll(options);
            })(options);
        }

        svc.getMaterialItems = function (orderId) {
            return customize('getMaterialItems', function (orderId) {
                var options = materialItemOptions + "&$filter=ProducedMaterialItems/any(m: m/WorkOrder_Id eq " + orderId + ")";
                return u4dmSvc.api.material.item.getAll(options);
            })(orderId);
        }

        svc.getLinkableMaterialItems = function (options) {
            return customize('getLinkableMaterialItems', function (options) {
                var filters = options + "&$filter=SerialNumberCode ne '' and SerialNumberCode ne null and MaterialDefinition/SerialNumberProfile eq true";
                var com = u4dmSvc.utility.combineFilters(filters);
                var query = "$expand=MaterialDefinition($select=Id,NId,SerialNumberProfile)&" + com.$resultquery;
                return u4dmSvc.api.material.item.getAllAvailable(query);
            })(options);
        }

        svc.getProcesses = function (options) {
            return customize('getProcesses', function (options) {
                return u4dmSvc.api.bop.process.getAll(options);
            })(options);
        }
                

        svc.getProcessToMergeList = function (options) {
            return customize('getProcessToMergeList', function (options) {
                var payload = {
                    WorkOrderId: options
                };
                return u4dmSvc.api.bop.process.getProcessToMergeList(payload);
            })(options);
        }

        svc.getProductionProcessFromAsPlanned = function (options) {
            return customize('getProductionProcessFromAsPlanned', function (options) {
                var payload = {
                    BaselineUId: options
                };
                return u4dmSvc.api.bop.process.getProductionProcessFromAsPlanned(payload);
            })(options);
        }

        svc.getPlants = function (options) {
            return customize('getPlants', function (options) {
                return u4dmSvc.api.equipment.getAll(options);
            })(options);
        }

        svc.getMaterialDefinitions = function (options) {
            return customize('getMaterialDefinitions', function (options) {
                return u4dmSvc.api.material.definition.getAll(options);
            })(options);
        }

        svc.getMachineDefinitions = function (options) {
            return customize('getMachineDefinitions', function (options) {
                return u4dmSvc.api.equipment.machineDef.getAll(options);
            })(options);
        }

        svc.getMaterialSpecficationTypes = function (options) {
            return customize('getMaterialSpecficationTypes', function (options) {
                return u4dmSvc.api.bop.materialSpecification.getAllMaterialSpecificationType(options);
            })(options);
        };

        //ID GENERATION ID GENERATION ID GENERATION ID GENERATION ID GENERATION ID GENERATION ID GENERATION

        svc.generateBatchId = function (mdId, mdNId, plant) {
            return customize('generateBatchId', function (mdId, mdNId, plant) {
                return u4dmSvc.api.template.generateBatchId(mdId, mdNId, plant);
            })(mdId, mdNId, plant);
        }

        svc.generateWorkOrderId = function (mdId, mdNId, plant) {
            return customize('generateWorkOrderId', function (mdId, mdNId, plant) {
                return u4dmSvc.api.template.generateWorkOrderId(mdId, mdNId, plant);
            })(mdId, mdNId, plant);
        }

        //DELETION DELETION DELETION DELETION DELETION DELETION DELETION DELETION DELETION DELETION

        svc.deleteWorkOrder = function (item) {
            return customize('deleteWorkOrder', function (item) {
                var par = {
                    Id: item.Id,
                };
                return u4dmSvc.api.workOrder.deleteWorkOrder(par);
            })(item);
        }

        svc.deleteWorkOrderOperation = function (item) {
            return customize('deleteWorkOrderOperation', function (item) {
                var par = {
                    Id: item.Id,
                };
                return u4dmSvc.api.workOrder.operation.deleteOperation(par);
            })(item);
        }

        //RELEASE RELEASE RELEASE RELEASE RELEASE RELEASE RELEASE RELEASE RELEASE RELEASE RELEASE

        svc.releaseWorkOrder = function (item) {
            return customize('releaseWorkOrder', function (item) {
                var par = {
                    WorkOrderId: item.Id,
                    WorkOrderNId: item.NId,
                };
                return u4dmSvc.api.workOrder.release(par);
            })(item);
        }
        
        //DABCUSTOM new Release command
		svc.dabReleaseWorkOrder = function (item, actualNumberOperator) {
            var payload = createPayloadDABReleaseWorkOrder(data);
            return u4dmSvc.api.workOrder.dabrelease(payload);
        }

        function createPayloadDABReleaseWorkOrder(workOrder, actualNumberOperator)
        {
            var payload = {};

            payload.Id = workOrder.Id;
            payload.NId = workOrder.NId;
            payload.actualNumberOperator = actualNumberOperator;

            return payload;
        }

        //CREATIONS CREATIONS CREATIONS CREATIONS CREATIONS CREATIONS CREATIONS CREATIONS CREATIONS

        svc.createWorkOrderFromProcess = function (data) {
            return customize('createWorkOrderFromProcess', function (data) {
                var payload = createPayloadFromProcess(data);
                return u4dmSvc.api.workOrder.createFromProcess(payload);
            })(data);
        }

        function createPayloadFromProcess(data) {
            var payload = {};

            payload.NId = data.NId;
            payload.ProcessId = data.Process.Id;
            payload.ProductionTypeNId = data.ProductionType.NId;
            payload.Quantity = data.Quantity;

            if (data.FinalMaterialId)
                payload.FinalMaterialId = data.FinalMaterialId;

            if (data.Plant)
                payload.Plant = data.Plant.Name;

            if (data.BatchId)
                payload.BatchId = data.BatchId;

            if (data.Priority)
                payload.Priority = data.Priority;

            if (data.ErpId)
                payload.ERPOrder = data.ErpId;

            if (data.SD)
                payload.EstimatedStartTime = u4dmSvc.time.getJSONDateFromDate(data.SD);

            if (data.ED)
                payload.EstimatedEndTime = u4dmSvc.time.getJSONDateFromDate(data.ED);

            if (data.DD)
                payload.DueDate = u4dmSvc.time.getJSONDateFromDate(data.DD);

            return payload;
        }

        svc.createWorkOrderHeader = function (data) {
            return customize('createWorkOrderHeader', function (data) {
                var payload = createPayloadHeader(data);
                return u4dmSvc.api.workOrder.createHeader(payload);
            })(data);
        }

        function createPayloadHeader(data) {
            var payload = {};

            payload.NId = data.NId;
            payload.Name = data.Name;
            payload.Quantity = data.Quantity;
            payload.Plant = data.Plant.Name;
            if (data.BatchId) payload.BatchId = data.BatchId;
            if (data.DD) payload.DueDate = u4dmSvc.time.getJSONDateFromDate(data.DD);
            if (data.ErpId) payload.ERPOrder = data.ErpId;
            if (data.SD) payload.EstimatedStartTime = u4dmSvc.time.getJSONDateFromDate(data.SD);
            if (data.ED) payload.EstimatedEndTime = u4dmSvc.time.getJSONDateFromDate(data.ED);
            if (data.FinalMaterialId) payload.FinalMaterialId = data.FinalMaterialId;
            if (data.Notes) payload.Notes = data.Notes;
            if (data.Priority) payload.Priority = data.Priority;
            if (data.ProductionType) payload.ProductionTypeNId = data.ProductionType.NId;

            return payload;
        }

        
        
        svc.mergeWorkOrderToProcess = function (data) {
            return customize('mergeWorkOrderToProcess', function (data) {
                var payload = mergePayloadHeader(data);
                return u4dmSvc.api.workOrder.mergeWorkOrderToProcess(payload);
            })(data);
        }

        function mergePayloadHeader(data) {
            var payload = {};

        
            payload.WorkOrderId = data.Id;
            payload.ProcessId = data.ProcessId;
            payload.SerialNumberCodes =[];
            if (data.SD) payload.EstimatedStartTime = u4dmSvc.time.getJSONDateFrom_DPDate_TPDate(data.SD, data.ST);
            if (data.ED) payload.EstimatedEndTime = u4dmSvc.time.getJSONDateFrom_DPDate_TPDate(data.ED, data.ET);
            if (data.DD) payload.DueDate = u4dmSvc.time.getJSONDateFrom_DPDate_TPDate(data.DD, data.DT);
            if (data.ErpId) payload.ERPOrder = data.ErpId;
            if (data.Priority) payload.Priority = data.Priority;
            if (data.ProductionType) {
                if (data.ProductionType.NId != '-')
                    payload.ProductionTypeNId = data.ProductionType.NId;
            }
            if (data.BatchId) payload.BatchId = data.BatchId;
            if (data.ParentBatch) payload.ParentBatch = data.ParentBatch;
            

            return payload;
        }


        svc.createWorkOrderManually = function (data) {
            return customize('createWorkOrderManually', function (data) {
                var payload = createPayloadManually(data);
                return u4dmSvc.api.workOrder.createManually(payload);
            })(data);
        }

        function createPayloadManually(data) {
            var payload = {};

            payload.NId = data.NId;
            payload.ProductionTypeNId = data.ProductionType.NId;
            payload.InitialQuantity = data.Quantity;
            payload.FinalMaterialId = data.FinalMaterialId;
            payload.Plant = data.Plant.Name;
            payload.Sequence = data.Sequence;

            if (data.Name)
                payload.Name = data.Name;

            if (data.Notes)
                payload.Notes = data.Notes;

            if (data.BatchId)
                payload.BatchId = data.BatchId;

            if (data.Priority)
                payload.Priority = data.Priority;

            if (data.ErpId)
                payload.ERPOrder = data.ErpId;

            if (data.SD)
                payload.EstimatedStartTime = u4dmSvc.time.getJSONDateFromDate(data.SD);

            if (data.ED)
                payload.EstimatedEndTime = u4dmSvc.time.getJSONDateFromDate(data.ED);

            if (data.DD)
                payload.DueDate = u4dmSvc.time.getJSONDateFromDate(data.DD);

            return payload;
        }

        svc.createWorkOrderAsPlanned = function (data) {
            return customize('createWorkOrderAsPlanned', function (data) {
                var payload = createPayloadAsPlanned(data);
                return u4dmSvc.api.workOrder.createAsPlanned(payload);
            })(data);
        }

        function createPayloadAsPlanned(data) {
            var payload = {};

            payload.BaselineUId = data.AsPlannedBOP.BaselineUId;
            payload.ProductionTypeNId = (data.ProductionType) ? data.ProductionType.NId : '';
            payload.ERPOrder = data.ErpId;
            if (data.Plant) {
                payload.Plant = data.Plant.Name;
            }
            
            return payload;
        }

        svc.splitWorkOrder = function (data) {
            return customize('splitWorkOrder', function (data) {
                var payload = data;
                return u4dmSvc.api.workOrder.split(payload);
            })(data);
        }

        function undoWorkOrderOperationPayload(data) {
            var payload = {
                WorkOrderId: parseInt(data.WorkOrderId),
                Notes: data.Comment
            };
            return payload;
        }

        svc.undoScrapWorkOrder = function (data) {
            return customize('undoScrapWorkOrder', function (data) {
                var payload = undoWorkOrderOperationPayload(data);
                return u4dmSvc.api.workOrder.undoScrapWorkOrder(payload);
            })(data);
        }

        svc.createWorkOrderOperation = function (data) {
            return customize('createWorkOrderOperation', function (data) {
                var payload = createWorkOrderOperationPayload(data);
                return u4dmSvc.api.workOrder.operation.create(payload);
            })(data);
        }

        svc.createWorkOrderOperationFromProcess = function (data) {
            return customize('createWorkOrderOperationFromProcess', function (data) {
                var payload = createWorkOrderOperationPayload(data);
                return u4dmSvc.api.workOrder.operation.createFromProcess(payload);
            })(data);
        }

        function createWorkOrderOperationPayload(data) {
            var payload = {
                WorkOrderId: data.orderId,
                WorkOrderOperation:
                    {
                        NId: data.NId,
                        EstimatedStartTime: data.EstimatedStartTime ? u4dmSvc.time.getJSONDateFromDate(data.EstimatedStartTime) : null,
                        EstimatedEndTime: data.EstimatedEndTime ? u4dmSvc.time.getJSONDateFromDate(data.EstimatedEndTime) : null,
                        Priority: data.Priority,
                        Description: data.Description,
                        Name: data.Name,
                        OperationId: data.ProcessOperation ? data.ProcessOperation.Id : null,
                        WorkOperationTypeId: data.WorkOperation ? data.WorkOperation.Id : null,
                        RequiredCertificateNId: data.RequiredCertification ? data.RequiredCertification.NId : null,
                        RequiredInspectionRole: data.RequiredInspectionRole ? data.RequiredInspectionRole.Name : null,
                        ElectronicSignatureStart: data.ElectronicSignatureStart,
                        ElectronicSignaturePause: data.ElectronicSignaturePause,
                        ElectronicSignatureComplete: data.ElectronicSignatureComplete,
                        ToBeCollectedDocument: data.ToBeCollectedDocument,
                        Sequence: data.Sequence,
                        EstimatedDuration: data.EstimatedDuration
                    },
                DependencyType: data.CreateDependency ? (data.DependencyType ? data.DependencyType.NId : null) : null
            };

            return payload;
        }

        svc.createToBeConsumedMaterial = function (data) {
            return customize('createToBeConsumedMaterial', function (data) {
                var payload = createToBeConsumedMaterialPayload(data);
                return u4dmSvc.api.workOrder.operation.material.createToBeConsumed(payload);
            })(data);
        }

        function createToBeConsumedMaterialPayload(data) {
            var spec = {
                MaterialDefinitionId: data.materialDefinition.Id,
                Quantity: data.quantity,
                MaterialSpecificationType: data.materialSpecification.NId,
                AlternativeSelected: data.alternativeSelected
            };
            var payload = {
                WorkOrderOperationId: data.operationId ? data.operationId : null,
                WorkOrderStepId: data.stepId ? data.stepId : null,
                ToBeConsumedMaterials: [spec]
            }
            if (data.logicalPosition) {
                spec.LogicalPosition = data.logicalPosition;
            }
            if (data.groupId) {
                spec.GroupId = data.groupId;
            }



            return payload;
        }

        svc.deleteToBeConsumedMaterial = function (id) {
            return customize('deleteToBeConsumedMaterial', function (id) {
                var payload = {
                    ToBeConsumedMaterialId: id
                };
                return u4dmSvc.api.workOrder.operation.material.deleteToBeConsumed(payload);
            })(id);
        };

        svc.createToBeUsedTool = function (data) {
            return customize('createToBeUsedTool', function (data) {
                var payload = createToBeUsedToolPayload(data);
                return u4dmSvc.api.workOrder.operation.tool.createToBeUsed(payload);
            })(data);
        };

        function createToBeUsedToolPayload(data) {
            var payload = {}

            payload.ToBeUsedTools =
                [
                    {
                        ToolDefinitionId: data.toolDefinition.Id,
                        TimesToBeUsed: data.usageNumber
                    }
                ];

            payload.WorkOrderOperationId = data.OperationId;

            return payload;
        }

        svc.deleteToBeUsedTool = function (id) {
            return customize('deleteToBeUsedTool', function (id) {
                var payload = {
                    ToBeUsedToolId: id
                };
                return u4dmSvc.api.workOrder.operation.tool.deleteToBeUsed(payload);
            })(id);
        };

        svc.deleteToBeUsedDocument = function (id) {
            return customize('deleteToBeUsedDocument', function (id) {
                var payload = {
                    ToBeUsedDocumentId: id
                };
                return u4dmSvc.api.workOrder.operation.document.deleteDocument(payload);
            })(id);
        };

        svc.createToBeUsedMachine = function (data) {
            return customize('createToBeUsedMachine', function (data) {
                var payload = createToBeUsedMachinePayload(data);
                return u4dmSvc.api.workOrder.operation.machine.createToBeUsedMachine(payload);
            })(data);
        };

        function createToBeUsedMachinePayload(data) {
            if (data.Type == u4dmConstants.equipmentSpecificationTypes.location) {
                return {
                    WorkOrderOperationNId: data.OperationNId,
                    EquipmentNId: data.Location.NId,
                    PartProgram: data.PartProgram ? data.PartProgram.DNCId : null,
                    PrintJobFIle: data.PJF ? data.PJF.Id : null
                }
            } else if (data.Type == u4dmConstants.equipmentSpecificationTypes.machine) {
                return {
                    WorkOrderOperationNId: data.OperationNId,
                    EquipmentNId: data.Machine.NId,
                    PartProgram: data.PartProgram ? data.PartProgram.DNCId : null,
                    PrintJobFIle: data.PJF ? data.PJF.Id : null
                }
            }
            else if (data.Type == u4dmConstants.equipmentSpecificationTypes.machineDefinition) {
                return {
                    WorkOrderOperationNId: data.OperationNId,
                    MachineDefinitionNId: data.MachineDefinition.NId,
                    PartProgram: data.PartProgram ? data.PartProgram.DNCId : null,
                    PrintJobFIle: data.PJF ? data.PJF.Id : null
                }
            }
        };

        svc.deleteToBeUsedMachine = function (id) {
            return customize('deleteToBeUsedMachine', function (id) {
                var payload = {
                    ToBeUsedMachineId: id
                };
                return u4dmSvc.api.workOrder.operation.machine.deleteToBeUsedMachine(payload);
            })(id);
        };

        svc.createWorkOrderOperationDependency = function (data) {
            return customize('createWorkOrderOperationDependency', function (data) {
                var payload = {
                    Dependencies:
		                [
			                {
			                    FromId: data.from.Id,
			                    ToId: data.to.Id,
			                    OperationDependencyType: data.type.NId
			                }
		                ]
                };
                return u4dmSvc.api.workOrder.operation.dependency.create(payload);
            })(data);
        }

        svc.deleteWorkOrderOperationDependency = function (data) {
            return customize('deleteWorkOrderOperationDependency', function (data) {
                var payload = {
                    Dependency:
		            {
		                FromId: data.From.Id,
		                ToId: data.To.Id,
		                OperationDependencyType: data.DependencyType
		            }
                };
                return u4dmSvc.api.workOrder.operation.dependency.deleteDependency(payload);
            })(data);
        }

        //SERIAL NUMBERS SERIAL NUMBERS SERIAL NUMBERS SERIAL NUMBERS SERIAL NUMBERS SERIAL NUMBERS SERIAL NUMBERS SERIAL NUMBERS

        svc.assignMaterialItems = function (data) {
            return customize('assignMaterialItems', function (data) {
                return u4dmSvc.api.workOrder.assignMaterialItems(data);
            })(data);
        }

        svc.disAssignMaterialItems = function (items, order) {
            return customize('disAssignMaterialItems', function (items, order) {
                var payload = {
                    WorkOrderId: order.Id,
                    WorkOrderNId: order.NId,
                    MaterialItems: []
                };

                items.forEach(function (mi) {
                    payload.MaterialItems.push({
                        MaterialItemId: mi.Id,
                        MaterialItemNId: mi.NId
                    });
                });

                return u4dmSvc.api.workOrder.disassignMaterialItems(payload);
            })(items, order);
        }

        svc.generateAndAssignMaterialItems = function (id, nid) {
            return customize('generateAndAssignMaterialItems', function (id, nid) {
                var par = {
                    WorkOrderId: id,
                    WorkOrderNId: nid
                };
                return u4dmSvc.api.workOrder.generateAndAssignMaterialItems(par);
            })(id, nid);
        }

        //ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT

        svc.abortWorkOrder = function (items) {
            return customize('abortWorkOrder', function (items) {
                var par = {
                    WorkOrderIdentifiersList: []
                };

                items.forEach(function (el) {
                    par.WorkOrderIdentifiersList.push({
                        WorkOrderId: el.Id,
                        WorkOrderNId: el.NId
                    });
                });
                return u4dmSvc.api.workOrder.abort(par);
            })(items);
        }

        //PREKIT PREKIT PREKIT PREKIT PREKIT PREKIT PREKIT PREKIT PREKIT

        svc.reserveMaterialItems = function (items,  isSerialized ) {
            return customize('reserveMaterialItems', function (items, isSerialized) {
                var par = {
                    MaterialItemsToReserveList: []
                };

                var isDuplicateName = false;
                var serialList = [];

                items.forEach(function (el) {
                    el.PrekitSerialNumberList.forEach(function (elPrekitObj) {

                        if (elPrekitObj.PrekitSerialNumber != null && (elPrekitObj.PrekitSerialNumber !== elPrekitObj.PrekitSerialNumberBK)) {

                            if (serialList[elPrekitObj.PrekitSerialNumber]) isDuplicateName = true;
                            else serialList[elPrekitObj.PrekitSerialNumber] = elPrekitObj.PrekitSerialNumber;

                            par.MaterialItemsToReserveList.push({
                                Quantity                    : isSerialized ? el.quantity4Serial : el.Quantity,
                                MaterialDefinition          : el.MaterialDefinition_Id,
                                ToBeConsumedMaterialName    : el.Name,
                                ToBeConsumedMaterialSequence: el.Sequence,
                                SerialNumberCode            : elPrekitObj.PrekitSerialNumber,
                                WorkOrderOperationNId       : el.WorkOrderOperation ? el.WorkOrderOperation.NId : el.WorkOrderStep.NId,
                                MaterialItemId              : elPrekitObj.MaterialItem_Id,
                                ToBeConsumedMaterialId      : el.Id // kate
                            });
                        }
                    });
                });

                if (isDuplicateName) {
                    var deferred = $q.defer(); 
                    u4dmSvc.ui.overlay.showMessage('', u4dmSvc.globalization.translate('sit.u4dm.error.pre-kit.duplicated-serial'));
                    deferred.resolve({ succeeded: false });
                    return deferred.promise;
                }
                else return u4dmSvc.api.workOrder.reserveMaterialItems(par);
                //return u4dmSvc.api.workOrder.reserveMaterialItems(par);
            })(items, isSerialized);
        }

        //UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE

        svc.updateWorkOrder = function (data) {
            return customize('updateWorkOrder', function (data) {
                var payload = createEditWorkOrderPayload(data);
                return u4dmSvc.api.workOrder.edit(payload);
            })(data);
        };

        svc.updateWorkOrderOperation = function (data) {
            return customize('updateWorkOrderOperation', function (data) {
                var payload = creteEditWorkOrderOperationPayload(data);
                return u4dmSvc.api.workOrder.operation.edit(payload);
            })(data);
        };

        svc.getAllWONotification = function (data) {
            return customize('getAllWONotification', function (data) {
                return u4dmSvc.api.workOrder.notification.getAll(data);
            })(data);
        }

        svc.deleteWONotification = function (data) {
            return customize('deleteWONotification', function (data) {
                var payload = {
                    'WorkOrderNotificationIdList': data
                };
                return u4dmSvc.api.workOrder.notification.deleteNotification(payload);
            })(data);
        }

        svc.DeleteToBeUsedDCDTaskList = function (data) {
            function standardMethod(data) {
                var params = {
                    ToBeUsedDCDTaskIdList: data.map(function (wi) { return wi.Id; })
                }

                return u4dmSvc.api.workOrder.operation.toBeUsedDCD.deleteToBeUsedDCDTaskList(params);
                
              
            }
            return customize('DeleteToBeUsedDCDTaskList', standardMethod)(data);


            
        }

        svc.createHoldList = function (data) {
            function standardMethod(data) {
                var payload = {
                    "HoldDetails": (Array.isArray(data) ? data : [data]).map(createHoldParams)
                }
                return  u4dmSvc.api.workOrder.hold.createList(payload);
            }
            return customize('createHoldList', standardMethod)(data);
        }


        svc.unlinkWorkInstructions = function (data) {
            function standardMethod(workInstructions) {
                var params = {
                    Ids: workInstructions.map(function (wi) { return wi.DCDSpecificationId; })
                }
                return u4dmSvc.api.bop.process.operation.step.unLinkDCD(params);
            }
            return customize('unlinkWorkInstructions', standardMethod)(workInstructions);
        }

        function createHoldParams(obj) {
            return {
                'Id': obj.workOrder.Id,
                'NId': obj.workOrder.NId,
                'Comment': obj.Comment,
                'ReasonsId': _(obj.holdReasons).pluck('Id'),
                'Reasons': _(obj.holdReasons).pluck('NId'),
                'Type': obj.Type
            };
        }

        svc.createFutureHoldList = function (data) {
      
            function standardMethod(data) {
                var payload = {
                    "FutureHoldDetails": (Array.isArray(data) ? data : [data]).map(createHoldParams)
                };
                return u4dmSvc.api.workOrder.futurehold.createList(payload);
                
            }
            return customize('createFutureHoldList', standardMethod)(data);
        }

        function creteEditWorkOrderOperationPayload(data) {

             var payload = {
                EstimatedStartTime: data.estStartTime ? u4dmSvc.time.getJSONDateFromDate(data.estStartTime) : null,
                EstimatedEndTime: data.estEndTime ? u4dmSvc.time.getJSONDateFromDate(data.estEndTime) : null,
                Description: data.Description,
                Name: data.name,
                RequiredCertificateNId: data.Certification ? data.Certification.NId : (data.Certification == "" ? "" : null),
                RequiredInspectionRole: data.InspectionRole ? data.InspectionRole.Name : (data.InspectionRole == "" ? "" : null),
                ElectronicSignatureStart: data.ElectronicSignatureStart,
                ElectronicSignaturePause: data.ElectronicSignaturePause,
                ElectronicSignatureComplete: data.ElectronicSignatureComplete,
                ToBeCollectedDocument: data.ToBeCollectedDocument,
                WorkOperationTypeId: data.WorkOperation ? data.WorkOperation.Id : (data.WorkOperation == "" ?  0 : null),
                EstimatedDuration: data.estimatedDuration,
                Id: data.Id
            };
         
            return payload;
        }

        function createEditWorkOrderPayload(data) {
            var payload;
            if (data.Status == u4dmConstants.workOrderStatuses.Edit ||
                data.Status == u4dmConstants.workOrderStatuses.Pending) {
                payload = {
                    Name: data.Name,
                    EstimatedStartTime: data.EstimatedStartTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.EstimatedStartTime_DateTime) : null,
                    EstimatedEndTime: data.EstimatedEndTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.EstimatedEndTime_DateTime): null,
                    ActualStartTime: data.ActualStartTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.ActualStartTime_DateTime) : null,
                    ActualEndTime: data.ActualEndTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.ActualEndTime_DateTime) : null,
                    DueDate: data.DueDate_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.DueDate_DateTime) : null,
                    InitialQuantity: data.InitialQuantity,
                    FinalMaterialId: data.FinalMaterial ? data.FinalMaterial_Id : (data.FinalMaterial == "" ? 0 : null),
                    
                    Plant: data.plant ? data.plant.Name : null,
                    Notes: data.Notes,
                    Priority: data.Priority,
                    Id: data.Id,
                    ParentBatch: data.ParentBatch,
                    BatchId: data.batchId,
                    ERPOrder: data.ERPOrder,
                    ProductionTypeNId: (data.ProductionType && data.ProductionType.NId !== '-') ? data.ProductionType.NId : ""
                };
            } else {
                payload = {
                    EstimatedStartTime: data.EstimatedStartTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.EstimatedStartTime_DateTime) : null,
                    EstimatedEndTime: data.EstimatedEndTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.EstimatedEndTime_DateTime) : null,
                    ActualStartTime: data.ActualStartTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.ActualStartTime_DateTime) : null,
                    ActualEndTime: data.ActualEndTime_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.ActualEndTime_DateTime) : null,
                    DueDate: data.DueDate_DateTime ? u4dmSvc.time.getJSONDateFromDate(data.DueDate_DateTime) : null,
                    Id: data.Id,
                    ParentBatch: data.ParentBatch
                };
            }

            return payload;
        }

  

        return svc;
    }
}());