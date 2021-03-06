﻿(function () {
    'use strict';
    var controllerName = 'dabRelease_Ctrl';

    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM')
        .controller(controllerName, [
            '$q',
            '$state',
            '$scope',
            'u4dm.constants',
            'u4dm.services',     
			'workOrderStatus_Svc',			
            dabReleaseController
        ]);

    function dabReleaseController(
        $q,
        $state,
        $scope,
        u4dmConstants,
        u4dmSvc,
		workOrderStatusSvc        
        ) {
			
        var vm = this;
        var pgFields = {};
        var currentItem  = {};
        var selectedWorkOrder = {};
        vm.workOrderExt = {};
		currentItem.actualNumberOperator = 0;
        
        var icon = u4dmSvc.icons.icon;
        var propGridMgr = new u4dmSvc.propertyGridSvc($scope, this, "edit", "dabReleasePropertyGrid");
        
        init();
		
        function init() {
            // expose functions to markup
            vm.save = save;
            
            vm.cancel = cancel;

            selectedWorkOrder = u4dmSvc.data.cache.getSelectedWorkOrder();
            
            loadWorkOrderExt();

            currentItem.actualNumberOperator = vm.workOrderExt.ActualOperators;

			u4dmSvc.ui.sidePanel.setTitle('sit.u4dm.release');

            u4dmSvc.ui.sidePanel.open('e');
			
            configurePropertyGrid();
			
            // disable the save button
            vm.validInputs = false;

        };


        function save() {
			
            getPropertyGridValues();
           
            var actualNumberOperator_tmp = currentItem.actualNumberOperator;

			workOrderStatusSvc.dabReleaseWorkOrder(selectedWorkOrder, actualNumberOperator_tmp).
                                      then(function (result) {
                                          
										  u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-released', 'common.success');
                                          
                                          u4dmSvc.messaging.post('DABReleaseOrder', { });

                                          $state.go('^');
										  
                                      }, u4dmSvc.ui.overlay.showBackendError);
				
		    
        }

        function loadWorkOrderExt() {

            var workOrderId = selectedWorkOrder.Id;

            var options = "$filter=WorkOrderId eq " + workOrderId;

            workOrderStatusSvc.getAllWorkOrderExt(options).then(function (data) {
                
                vm.workOrderExt = data.value[0];
				
				currentItem.actualNumberOperator = vm.workOrderExt.ActualOperators;
				
				configurePropertyGrid();

            }, u4dmSvc.ui.overlay.showBackendError);
        }

        function cancel() {
            u4dmSvc.ui.sidePanel.close();
            $state.go('^');
        }

        function configurePropertyGrid() {

			pgFields.actualNumberOperator = propGridMgr.createNumericProperty({
                    id: 'actualNumberOperator',
                    labelKey: 'Numero di Operatori',
                    value: currentItem.actualNumberOperator,
                    required: true
            });


            propGridMgr.getValues = getStandardPropertyGridValues

            vm.propertyGrid = u4dmSvc.customizator.customizePropertyGrid(controllerName, propGridMgr, vm.actualNumberOperator);
        }

        function getPropertyGridValues() {
            // pass the standard method in case custom override wants to use it
            return vm.propertyGrid.getValues(currentItem, getStandardPropertyGridValues);
        }

        function getStandardPropertyGridValues(obj) {
			var values = obj;
			
            values.actualNumberOperator = pgFields.actualNumberOperator.value;
			
        }

       
    }

   
}());

