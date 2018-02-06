/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';
    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.timePicker
    * 
    * @description
    * This module provides functionalities related to displaying time-pickers.
    */
    angular.module('siemens.simaticit.common.widgets.timePicker', []);

})();
(function () {
    'use strict';

    var app = angular.module('siemens.simaticit.common.widgets.timePicker');

    function TimePickerController($scope, $timeout, $filter) {
        var vm = this;
        var timer;
        vm.isOpen = false;
        var timeValue;

        if (vm.showMeridian === undefined) {
            vm.showMeridian = true;
        }

        vm.popupValue = angular.copy(vm.value);

        if (vm.format === '' || vm.format === undefined) {
            vm.format = 'mediumTime';
        }
        vm.value = $filter('date')(vm.value, vm.format);
        function focusElement() {
            timer = $timeout(function () {
                $(vm.element[0]).find("input")[1].focus();
            }, 0, false);
        }
        vm.clicked = function () {
            vm.isOpen = vm.isOpen ? false : true;
            vm.element.find('input.property-grid-control').focus();
            if (vm.isOpen) {
                if (!vm.popupValue) {
                    timeValue = new Date();
                    vm.popupValue = timeValue;
                }
                focusElement();
            }
        };

        vm.setClicked = function () {
            vm.value = $filter('date')(vm.popupValue, vm.format);
            vm.isOpen = false;
        };

        vm.clearTime = function () {
            vm.value = null;
            vm.isOpen = false;
        };

        $scope.$on('$destroy', function () {
            if (timer) {
                $timeout.cancel(timer);
            }
        });
    }

    TimePickerController.$inject = ['$scope', '$timeout', '$filter'];

    app.controller('sitTimePickerController', TimePickerController);

    /**
    * @ngdoc directive
    * @name sitTimePicker
    * @module siemens.simaticit.common.widgets.timePicker
    * @description 
    * Displays a time-picker control.
    * 
    * @usage 
    * As an element:
    * ```
    * <sit-time-picker sit-value="value" sit-validation="validation" ng-readonly="ngReadonly" ng-blur="ngBlur" sit-change="vm.timepicker.sitChange"
    *       ng-disabled="ngDisabled" ng-focus="ngFocus" show-meridian="vm.timepicker.showMeridian">
    * </sit-time-picker>
    * ```
    *
    * In the corresponding view controller, add the **sit-widget-attributes** and other objects 
    * to the controller to define the options.
    * ```
    * (function(){
    * 'use strict'
    * var app=angular.module('myModule');
    * 
    * function ControllerMethod(){
    * var vm=this;
    * 
    * vm.timepicker={
    *            showMeridian: true,
    *             sitChange = function (oldValue, newValue, ngModel) {
    *                         }
    *                 }
    * app.contoller('controllerName',ControllerMethod);
    * })();
    *  
    * @restrict E
	* 
    * @param {String} sit-value Value of the time picker widget.
    * @param {string} sit-format A format in which the selected time is displayed on the widget. Possible values are: mediumTime, shortTime.
    * @param {ValidationModel} sit-validation See {@link ValidationModel}.
    * @param {string} [sit-change] _(Optional)_ An expression to evaluate on change of value.
    * @param {string} [ng-disabled] _(Optional)_ If this expression is truthy, the element will be disabled.
    * @param {string} [ng-readonly] _(Optional)_ If this expression is truthy, the element will be set as read-only.
    * @param {Object} [show-meridian] _(Optional)_ An attribute show-meridian which specifies whether to display 12H or 24H mode. True is 12H mode. (Default: true)
    * @example
    * The following example shows how to configure a time-picker widget within the sit-data attribute of the {@link siemens.simaticit.common.widgets.propertyGrid sit-property-grid} directive:
    * ```
    *  {
    *     read_only: false,
    *     value: "09-10-2014 11:15:45",
    *     widget: "sit-time-picker",
    *     widgetAttributes: {
    *           showMeridian:false
    *        }
    *  }
    * ```
    */
    app.directive('sitTimePicker', ['$document', function ($document) {
        return {
            scope: {},

            restrict: 'E',

            bindToController: {
                'readOnly': '=sitReadOnly',
                'value': '=sitValue',
                'validation': '=sitValidation',
                'format': '=?sitFormat',
                'ngBlur': '&?',
                'sitChange': '=?',
                'ngDisabled': '=?',
                'ngFocus': '&?',
                'ngReadonly': '=?',
                'showMeridian': '=?'
            },

            templateUrl: 'common/widgets/timePicker/time-picker.html',

            controller: 'sitTimePickerController',

            controllerAs: 'timePickerCtrl',

            link: function (scope, element, attrs, ctrl) {

                ctrl.element = element;

                function documentClickBind(event) {
                    if (ctrl.isOpen && !$(event.target).parents("div.sitTimePicker").length) {
                        scope.$apply(function () {
                            ctrl.isOpen = false;
                        });
                    }
                }

                var unbindWatcher = scope.$watch('timePickerCtrl.isOpen', function (value) {
                    if (value) {
                        $document.bind('click', documentClickBind);
                    } else {
                        $document.unbind('click', documentClickBind);
                    }
                });

                function keyDownEvent(event) {
                    // event.preventDefault();
                    if (ctrl.isOpen) {
                        if (event.which === 27) {
                            scope.$apply(function () {
                                ctrl.isOpen = false;
                            });
                        }
                    }
                    else if (event.which === 40 || event.which === 32) {
                        //Down arrow or spacebar pushed
                        scope.$apply(function () {
                            ctrl.isOpen = true;
                        });
                    }
                }

                element.on('keydown', keyDownEvent);

                //un-register events and un-bind watchers on scope destroy
                scope.$on('$destroy', function () {
                    element.off('keydown', keyDownEvent);
                    unbindWatcher();
                    $document.unbind('click', documentClickBind);
                });
            }
        };
    }]);
})();