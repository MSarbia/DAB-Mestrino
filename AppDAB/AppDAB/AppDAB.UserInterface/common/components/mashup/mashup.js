/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';
    /**
  * @ngdoc module
  * @name siemens.simaticit.common.components.mashup
  * 
  * @description
  * This module provides mashup component.
  */
    
    angular.module('siemens.simaticit.common.components.mashup', []);

})();

(function () {
    'use strict';

    function MashupComponentController($rootScope, $state, $stateParams, $scope) {
        var vm = this;

        function activate(vm) {
            initialize(vm);
            subscribeEvents(vm);
        }


        function parseParams(params) {
            var propt, proptType;
            var parameters = {};
            for (propt in params) {
                if (params.hasOwnProperty(propt) && propt[0] !== '_') {
                    proptType = '_' + propt + 'Type';
                    if (params.hasOwnProperty(proptType)) {
                        switch (params[proptType]) {
                            case 'number':
                                if ((typeof $stateParams === 'object') && ($stateParams.hasOwnProperty(propt)) && ($stateParams[propt])) {
                                    parameters[propt] = +$stateParams[propt];
                                }
                                else {
                                    if (params[propt]){
                                        parameters[propt] = +params[propt];
                                    }
                                }
                             
                                break;
                            case 'boolean':
                                if ((typeof $stateParams === 'object') && ($stateParams.hasOwnProperty(propt)) && ($stateParams[propt])) {
                                    parameters[propt] = ($stateParams[propt] === "true");
                                }
                                else {
                                    if (params[propt]) {
                                        parameters[propt] = (params[propt] === "true");
                                    }
                                }
                             
                                break;
                            case 'date':

                                if ((typeof $stateParams === 'object') && ($stateParams.hasOwnProperty(propt)) && ($stateParams[propt])) {
                                    parameters[propt] = new Date($stateParams[propt]);
                                }
                                else {
                                    if (params[propt]) {
                                        parameters[propt] = new Date(params[propt]);
                                    }
                                }
                              
                                break;
                            default:
                                if ((typeof $stateParams === 'object') && ($stateParams.hasOwnProperty(propt)) && ($stateParams[propt])) {
                                    parameters[propt] = $stateParams[propt];
                                }
                                else {
                                    if (params[propt]) {
                                        parameters[propt] = params[propt];
                                    }
                                }
                                break;
                        }
                    } else {
                        if ((typeof $stateParams === 'object') && ($stateParams.hasOwnProperty(propt)) && ($stateParams[propt])) {
                            parameters[propt] = $stateParams[propt];
                        }
                        else {
                            if (params[propt]) {
                                parameters[propt] = params[propt];
                            }
                        }
                    }
                }
            }
            return parameters;
        }



        function initialize(vm) {
            vm.context = {};
            angular.copy($state.current.context, vm.context);
            if (typeof $state.current.params === 'object')
            {
                vm.parameters = parseParams($state.current.params);
            }
        }

        function subscribeEvents(vm) {
            vm.loadEventInstance = $rootScope.$on('siemens.simaticit.common.widgets.container.mashupReady', function (event) {
                if (event.defaultPrevented) {
                    return;
                }
                event.preventDefault();
                $rootScope.$emit('mashup.' + vm.name + ".onLoad", vm.parameters);
            });
            $scope.$on('$destroy', vm.loadEventInstance);
        }

        this.navigateTo = function (screen) {
            if (screen !== undefined) {
                $state.go(screen, this.context);
            }
        };

        this.setContext = function (context) {
            var propt;
            for (propt in context) {
                if (context.hasOwnProperty(propt)) {
                    this.context[propt] = context[propt];
                }
            }
            $rootScope.$emit('mashup.' + vm.name + '.onContextChanged', this.context);
            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply();
            }
        };

        this.setPosition = function (UIComponentId, position, size) {
            $rootScope.$broadcast('mashup.' + vm.name + '.onComponentMoveResize', { UIComponentId: UIComponentId, position: position, size: size });
            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply();
            }
        };

        this.display = function (UIComponentId, toggle) {
            $rootScope.$broadcast('mashup.' + vm.name + '.onDisplayChanged', { UIComponentId: UIComponentId, toggle: toggle });
            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply();
            }
        };




        activate(vm);
    }

    MashupComponentController.$inject = ['$rootScope', '$state', '$stateParams', '$scope'];

    /***
     * @ngdoc controller
     * @name common.components.mashup.MashupComponentController
     * @module siemens.simaticit.common.components.mashup   
     * @description 
     * A hidden component in the Mashup Editor to provide custom navigation and share data between components through context and parameters.
     */

    angular.module('siemens.simaticit.common.components.mashup').controller('common.components.mashup.MashupComponentController', MashupComponentController)
})();

(function () {
    'use strict';
    /**
  *   @ngdoc directive
  *   @name sitMashup
  *   @module siemens.simaticit.common.components.mashup
  *   @restrict EA
  *   @description Contains functionalities of mashup component.
  *   @usage 
  *   ```
  *   '<sit-mashup name="mashup1" > </sit-mashup>'
  *   
  *   @param {string} name Specifies name of the component instance.
  *   Mashup component contains the following events and methods:
  *   * **Event: onLoad**          :  This event is triggered when the user navigates to the UI State corresponding to the Mashup UI Module (i.e. when the $stateChangeSuccess event of UI Router is fired).
  *                                   The parameters of this event correspond to the parameters of the container Mashup UI Module, defined by the user when the Mashup UI Module was configured..  
  *   * **Event: onContextChanged**:  This event is triggered when any of the UI Module properties constituting the UI Module context changes.
  *                                   The parameters of this event correspond to the properties of the container Mashup UI Module, defined by the user when the Mashup UI Module was configured.  
  *   * **Method: setContext**     :  This method can be called to change the value of one or more properties defined for the UI Module.
  *                                   The parameters of this method correspond to the properties of the container Mashup UI Module, defined by the user when the Mashup UI Module was configured.  
  *   * **Method: navigateTo**     :  This method can be called to navigate to another UI State of a UI Application.
  *                                   The parameters of this method are the following:
  *                                   screen (string) – the ID of the UI State/Screen to navigate to.
  *                                   When navigating to the specified screen, all the properties defined for the current UI Module will be passed as parameters when performing the state transition.  
  *   * **Method: setPosition**    :  This method can be called to change the position and size of a component in the UI Module.
  *                                   The parameters of this method are the following:
  *                                   UIComponentId (string) – the ID of the component.
  *                                   position (object) – the row and column of the component.
  *                                   size (object) – the size x and size y of the component.
  *   * **Method: display**        :  This method can be called to change visibility of a component in the UI Module.
  *                                   The parameters of this method are the following:
  *                                   UIComponentId (string) – the ID of the component.
  *                                   toggle (boolean) – the visibility parameter of the component.
  * 
  *   */
    angular.module('siemens.simaticit.common.components.mashup').directive('sitMashup', function () {
        return {
            restrict: 'EA',
            controller: 'common.components.mashup.MashupComponentController',
            controllerAs: 'mashupCtrl',
            bindToController: { name: "@name" },
            scope: true
        };
    });
})();