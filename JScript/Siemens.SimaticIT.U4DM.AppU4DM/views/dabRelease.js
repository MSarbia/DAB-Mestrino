(function () {
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
		var currentItem       = {};
		currentItem.actualNumberOperator = 0;
        
        var icon = u4dmSvc.icons.icon;
        var propGridMgr = new u4dmSvc.propertyGridSvc($scope, this, "edit", "dabReleasePropertyGrid");
        
        init();
		
        function init() {
            // expose functions to markup
            vm.save = save;
            vm.cancel = cancel;
            // initialize the side panel

			/*
            if(vMisFutureHold && vMisFutureHold == true)
                u4dmSvc.ui.sidePanel.setTitle('sit.u4dm.holdMgt.view-title.futureHold');
            else
                u4dmSvc.ui.sidePanel.setTitle('sit.u4dm.holdMgt.view-title.hold-mgt');
			*/
			
			u4dmSvc.ui.sidePanel.setTitle('sit.u4dm.release');

            u4dmSvc.ui.sidePanel.open('e');
			
            configurePropertyGrid();
			
            // disable the save button
            vm.validInputs = false;

        };


        function save() {
			
            getPropertyGridValues();
           
		    var a = currentItem.actualNumberOperator;

			var selectedWorkOrder = u4dmSvc.data.cache.getSelectedWorkOrder();
			
			workOrderStatusSvc.dabReleaseWorkOrder(selectedWorkOrder, actualNumberOperator).
                                      then(function (result) {
                                          
										  u4dmSvc.ui.notify.showInfo('sit.u4dm.workOrderStatus.messages.workorder-released', 'common.success');
                                          $state.go('^');
										  
                                      }, u4dmSvc.ui.overlay.showBackendError);
				
		    
        }

        function cancel() {
            u4dmSvc.ui.sidePanel.close();
            $state.go('^');
        }

        function configurePropertyGrid() {

			pgFields.actualNumberOperator = propGridMgr.createNumericProperty({
                    id: 'actualNumberOperator',
                    labelKey: 'sit.u4dm.quantity',
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

