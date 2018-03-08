(function () {
    'use strict';

    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.services.views', [
        'siemens.simaticit.common',
        'Siemens.SimaticIT.U4DM.AppU4DM.services.constants'
    ]);

    /**
     *  @ngdoc service
     *  @name u4dm.services.views
     *  @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
     *  @description Contains methods to dynamically create states for views needed by the runtime mashups.
     */
    mod.factory('u4dm.services.views', [
        'u4dm.stateAlias', 'u4dm.constants',
        u4dmViewsService
    ]);

    function u4dmViewsService(u4dmStateAlias, u4dmConstants) {
        return {
            configureElectronicSignatureState: configureElectronicSignatureState,
            configureSelectReasonState: configureSelectReasonState,
            configureSelectSkipReasonState: configureSelectSkipReasonState,
            configureStartOptionsState: configureStartOptionsState,
            configureRuntimeNotesState: configureRuntimeNotesState,
            configureTravelingWorkState: configureTravelingWorkState,
            configureCompleteOperationState: configureCompleteOperationState,
            configureAssembledSNsState: configureAssembledSNsState,
            configurePjfDetailsState: configurePjfDetailsState,
            configurePrintJobFilesSelectionState: configurePrintJobFilesSelectionState,
            configureToolsSelectionState: configureToolsSelectionState,
            configureSkillsSelectionState: configureSkillsSelectionState,
            configurePartProgramTreeState: configurePartProgramTreeState,
            configureValidatePrekitState: configureValidatePrekitState,
            configureUserSelectionState: configureUserSelectionState,
            configureRoleSelectionState: configureRoleSelectionState,
            configureAddDocumentState: configureAddDocumentState,
            configureDeclareDefectState: configureDeclareDefectState,
            configureChangeStatusFromDefectState: configureChangeStatusFromDefectState,
            configureNonConformanceState: configureNonConformanceState,
            configureSelectDCDsOptionalState: configureSelectDCDsOptionalState,
            configureSkilledUserSelectionState: configureSkilledUserSelectionState,
            configureSelectMaterialToInspect: configureSelectMaterialToInspect,
            configureSelectTBMaterialToInspect: configureSelectTBMaterialToInspect,
            configureFutureHoldSelectionState: configureFutureHoldSelectionState,
            configureNonConformanceRedLiningState: configureNonConformanceRedLiningState,
            configureSerialNumberForMachine: configureSerialNumberForMachine,
			configureDABReleaseState: configureDABReleaseState
        };

        function configureNonConformanceRedLiningState(parentStateName) {
            var state = {
                name: parentStateName + '.data-collection',
                url: '/redlining/:docId/:ncId',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/red-lining.html',
                        controller: 'RedLiningCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Title'
                }
            };

            u4dmStateAlias.addState(state);

            return state.name;
        }

        function configureSelectDCDsOptionalState(parentStateName) {
            var state = {
                name: parentStateName + '.data-collection',
                url: '/dataCollection',
                        views : {
                        'property-area-container@': {
                            templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/selectDataCollection.html',
                            controller: 'serializedDataCollectionCtrl',
                            controllerAs: 'vm'
                            }
                        },
                            data: {
                            title: ''
                        },
                            params: {
                                wooId: null,
                                stepId: null,
                                materials: [],
                                dcdAlreadyUsed: []
                }
            };

            u4dmStateAlias.addState(state);

            return state.name;
        }

        function configureNonConformanceState(parentStateName) {
            var state = {
                name: parentStateName + '.declare-defect',
                url: '/declareDefect',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/NonConformanceDeclare.html',
                        controller: 'nonConformanceDeclareController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                }
            };

            u4dmStateAlias.addState(state);

            return state.name;
        }

        function configureChangeStatusFromDefectState(parentStateName) {
            var state = {
                name: parentStateName + '.changestatus',
                url: '/changestatus',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/ncChangeStatus.html',
                        controller: 'nc_changeStatus_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.ncSupervisor.breadcrumb-title.change-status'
                },
                params: {
                    id: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        function configureDeclareDefectState(parentStateName) {
            var state = {
                name: parentStateName + '.declare-defect',
                url: '/add-defect/:wooId',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/ncAddDefect.html',
                        controller: 'nc_addDefect_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureSelectReasonState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".selectReason" will be tacked onto the end of this state name.
         * @returns {String} The new "Select Reason" state name.
         * @description Creates a "Select Reason" state as a child of the given state.
         */
        function configureSelectReasonState(parentStateName) {
            var state = {
                name: parentStateName + '.selectReason',
                url: '/selectReason',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/SelectReason.html',
                        controller: 'selectReasonCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.select-reason'
                },
                params: {
                },
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureSelectSkipReasonState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".selectSkipReason" will be tacked onto the end of this state name.
         * @returns {String} The new "Select Skip Reason" state name.
         * @description Creates a "Select Skip Reason" state as a child of the given state.
         */
        function configureSelectSkipReasonState(parentStateName) {
            var state = {
                name: parentStateName + '.selectSkipReason',
                url: '/selectSkipReason',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/SkipReason.html',
                        controller: 'skipReasonCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.select-reason'
                },
                params: {
                },
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureSelectMaterialToInspect
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".selectMaterialToInspect" will be tacked onto the end of this state name.
        * @returns {String} The new "Select material to inspect" state name.
        * @description Creates a "Select material to inspect" state as a child of the given state.
        */
        function configureSelectMaterialToInspect(parentStateName) {
            var state = {
                name: parentStateName + '.selectMaterialToInspect',
                url: '/selectMaterialToInspect',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/selectMaterialToInspect.html',
                        controller: 'selectMaterialToInspectCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.select-material-to-inspect'
                },
                params: {
                    wooId: null
                },
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
       * @ngdoc method
       * @name u4dm.services.views#configureSelectTBMaterialToInspect
       * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
       * @param {String} parentStateName Name of the parent state.  ".selectTBMaterialToInspect" will be tacked onto the end of this state name.
       * @returns {String} The new "Select material to inspect" state name.
       * @description Creates a "Select material to inspect" state as a child of the given state.
       */
        function configureSelectTBMaterialToInspect(parentStateName) {
            var state = {
                name: parentStateName + '.selectTBMaterialToInspect',
                url: '/selectTBMaterialToInspect',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/selectTBMaterialToInspect.html',
                        controller: 'selectTBMaterialToInspectCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.select-tb-material-to-inspect'
                },
                params: {
                    wooId: null
                },
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureStartOptionsState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".startOptions" will be tacked onto the end of this state name.
         * @returns {String} The new "Start Options" state name.
         * @description Creates a "Start Options" state as a child of the given state.
         */
        function configureStartOptionsState(parentStateName) {
            var state = {
                name: parentStateName + '.startOptions',
                url: '/startOptions/:type',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/setStartOptions.html',
                        controller: 'setStartOptionsCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        function configureSerialNumberForMachine(parentStateName) {
            var state = {
                name: parentStateName + '.serialNumberForMachine',
                url: '/serialNumberForMachine/:wooId/:woId/:productionType/:button',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/runtime/serialNumberForMachine.html',
                        controller: 'serialNumberForMachineCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }
        /**
         * @ngdoc method
         * @name u4dm.services.views#configurePartProgramTreeState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".partProgramTree" will be tacked onto the end of this state name.
         * @returns {String} The new "Part Program Tree" state name.
         * @description Creates a "Part Program Tree" state as a child of the given state.
         */
        function configurePartProgramTreeState(parentStateName) {
            var state = {
                name: parentStateName + '.partProgramTree',
                url: '/partProgramTree/:wooId/:dnc/:machineId/:machineDefinitionId/:finalMaterialId',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/partProgramTree.html',
                        controller: 'partProgramTreeCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    machineId: null,
                    machineDefinitionId: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureElectronicSignatureState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".electronicSignature" will be tacked onto the end of this state name.
         * @returns {String} The new "Start Options" state name.
         * @description Creates a "Electronic Signature" state as a child of the given state.
         */
        function configureElectronicSignatureState(parentStateName) {
            var state = {
                name: parentStateName + '.eSignature',
                url: '/eSignature/:op',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/ElectronicSignAuth.html',
                        controller: 'ElectronicSignAuthCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureRuntimeNotesState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".runtimeNotes" will be tacked onto the end of this state name.
         * @returns {String} The new "Runtime Notes" state name.
         * @description Creates a "Runtime Notes" state as a child of the given state.
         */
        function configureRuntimeNotesState(parentStateName) {
            var state = {
                name: parentStateName + '.runtimeNotes',
                url: '/runtimeNotes/:wooId',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/runtimeNotes.html',
                        controller: 'runtimeNotesViewController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureTravelingWorkState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".TravelingWork" will be tacked onto the end of this state name.
        * @returns {String} The new "Select Reason" state name.
        * @description Creates a "Select Reason" state as a child of the given state.
        */
        function configureTravelingWorkState(parentStateName) {
            var state = {
                name: parentStateName + '.travellingWork',
                url: 'travellingWork_:workOrderOperationNId',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/TravelingWork.html',
                        controller: 'travellingWorkCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.travellingWork'
                },
                params: {
                    workOrderOperationNId: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureCompleteOperationState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".completeOperation" will be tacked onto the end of this state name.
        * @returns {String} The new "Complete operation" state name.
        * @description Creates a "Complete operation" state as a child of the given state.
        */
        function configureCompleteOperationState(parentStateName) {
            var state = {
                name: parentStateName + '.completeOperation',
                url: '/complete/:type',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/completedOperations.html',
                        controller: 'completedOperationCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureAssembledSNsState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".assembledSNs" will be tacked onto the end of this state name.
        * @returns {String} The new "Assembled SNs" state name.
        * @description Creates an "Assembled SNs" state as a child of the given state.
        */
        function configureAssembledSNsState(parentStateName) {
            var state = {
                name: parentStateName + '.assembledSNs',
                url: '/assembledSNs',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/assembledSNs.html',
                        controller: 'assembledSNsCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    actualConsumedMaterials: ''
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }
        /** EF to check
         * @ngdoc method
         * @name u4dm.services.views#configurePjfDetailsState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName "PJF File" state name.
         * @description Creates a "PJF File" state as a child of the given state.
         */
        function configurePjfDetailsState(parentStateName) {
            var state = {
                name: parentStateName + '.pfjDetails',
                url: '/pjfDetails/:pjfId',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/printJobFile.html',
                        controller: 'pjfDetailsViewCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                //params: {
                //    pjfId: ''
                //}
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configurePrintJobFilesSelectionState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".selectPJFs" will be tacked onto the end of this state name.
        * @returns {String} The new "Select Print Job Files" state name.
        * @description Creates an ""Select Print Job Files" state as a child of the given state.
        */
        function configurePrintJobFilesSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.selectPJFs',
                url: '/selectPJFs',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/selectPrintJobFiles.html',
                        controller: 'printJobFilesSelectionCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    printJobFileList: [],
                    machine: null,
                    woo: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        };

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureToolsSelectionState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".selectTool" will be tacked onto the end of this state name.
         * @returns {String} The new "Select tools" state name.
         * @description Creates an ""Select Tool" state as a child of the given state.
         */
        function configureToolsSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.selectTool',
                url: '/selectTool',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/selectTool.html',
                        controller: 'toolsSelectionCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    substrateId: null,
                    toolDefinition: null,
                    machineDefId: null,
                    equipmentId: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        };

        /**
         * @ngdoc method
         * @name u4dm.services.views#configureSkillSelectionState
         * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
         * @param {String} parentStateName Name of the parent state.  ".selectSkill" will be tacked onto the end of this state name.
         * @returns {String} The new "Select skills" state name.
         * @description Creates an ""Select Skill" state as a child of the given state.
         */
        function configureSkillsSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.selectSkill',
                url: '/skillSelection',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/skillSelection.html',
                        controller: 'skillsSelectionCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    alreadyAttachedSkillIds: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        };

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureValidatePrekitState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".validatePrekit" will be tacked onto the end of this state name.
        * @returns {String} The new "Validate prekit" state name.
        * @description Creates a "Validate prekit" state as a child of the given state.
        */
        function configureValidatePrekitState(parentStateName) {
            var state = {
                name: parentStateName + '.validatePrekit',
                url: '/validatePrekit',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/validatePrekit.html',
                        controller: 'validatePrekitCtrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    toBeConsumedMaterials: null,
                    workOrderOperation: null,
                    workOrderStep: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureUserSelectionState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".users" will be tacked onto the end of this state name.
        * @returns {String} The new "Users" state name.
        * @description Creates a "Users" state as a child of the given state.
        */
        function configureUserSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.user',
                url: '/user',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/user.html',
                        controller: 'user_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    equipmentId: null,
                    alreadyAttachedUserIds: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        function configureRoleSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.role',
                url: '/role',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/role.html',
                        controller: 'role_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    equipmentId: null,
                    alreadyAttachedRoleIds: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureAddDocumentState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.modules.document
        * @param {String} parentStateName Name of the parent state.  ".document" will be tacked onto the end of this state name.
        * @returns {String} The new "Add Document" state name.
        * @description Creates a "Add Document" state as a child of the given state.
        */
        function configureAddDocumentState(parentStateName) {
            var folder = u4dmConstants.folderPath.document;
            var state = {
                name: parentStateName + '.document',
                url: '/add',
                views: {
                    'property-area-container@': {
                        templateUrl: folder + '/document-list.html',
                        controller: 'document_list_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'sit.u4dm.documentMgt.breadcrumb-title.document-add'
                },
                params: {
                    parentEntityType: null,
                    relatedEntityId: null,
                    alreadyAttachedDocumentIds: [],
                    TypeFilter: null,
                    Extensions: null,
                    title: null,
                    buttonTitle: null,
                    addMode: 'add',
                    isSerialized: false,
                    wooId: null,
                    stepId: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
        * @ngdoc method
        * @name u4dm.services.views#configureSkilledUserSelectionState
        * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
        * @param {String} parentStateName Name of the parent state.  ".users" will be tacked onto the end of this state name.
        * @returns {String} The new "SkilledUsers" state name.
        * @description Creates a "SkilledUsers" state as a child of the given state.
        */
        function configureSkilledUserSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.skilledUser',
                url: '/skilledUser',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/skilledUser.html',
                        controller: 'skilledUser_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    alreadyAttachedUserIds: null,
                    workOrderOperationId : null,
                    equipmentId: null,
                    applyPCDFilter: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

        /**
       * @ngdoc method
       * @name u4dm.services.views#configureFutureHoldSelectionState
       * @module Siemens.SimaticIT.U4DM.AppU4DM.services.views
       * @param {String} parentStateName Name of the parent state.  ".users" will be tacked onto the end of this state name.
       * @returns {String} The new "SkilledUsers" state name.
       * @description Creates a "SkilledUsers" state as a child of the given state.
       */
        function configureFutureHoldSelectionState(parentStateName) {
            var state = {
                name: parentStateName + '.futureHoldAdd',
                url: '/futureHoldAdd',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/futureHoldAdd.html',
                        controller: 'futureHoldAdd_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    icvWorkOrderOperationVisible: null,
                    isFutureHold: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }
		
	
        function configureDABReleaseState(parentStateName) {
            var state = {
                name: parentStateName + '.dabRelease',
                url: '/dabRelease',
                views: {
                    'property-area-container@': {
                        templateUrl: 'Siemens.SimaticIT.U4DM.AppU4DM/views/dabRelease.html',
                        controller: 'dabRelease_Ctrl',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                },
                params: {
                    workOrderId: null,
                    workOrderNId: null
                }
            };

            u4dmStateAlias.addState(state);
            return state.name;
        }

    }
})();