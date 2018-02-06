/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';
    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.select
    * 
    * @description
    * This module provides functionalities related to displaying select controls.
    */
    angular.module('siemens.simaticit.common.widgets.select', []);

})();
/*jshint -W098 */
(function () {
    'use strict';

    var app = angular.module('siemens.simaticit.common.widgets.select');

    /**
    * @ngdoc directive
    * @name sitSelect
    * @module siemens.simaticit.common.widgets.select
    * @description 
    * Displays a select control.
    * 
    * @usage 
    * As an element:
    * ```
    * <sit-select sit-value="value" sit-validation="validation" sit-options="options" sit-to-display="toDisplay" sit-to-keep="toKeep" sit-to-group="toGroup"
    *       ng-readonly="ngReadonly" ng-blur="ngBlur" sit-change="sitChange" ng-disabled="ngDisabled" ng-focus="ngFocus">
    * </sit-select>
    * ```
    * @restrict E
	* 
    * @param {string} sit-value Value of the select widget.
    * @param {Array} sit-options Array of objects that contains list of attributes.
    * @param {string} sit-to-display Attribute name to be displayed.
    * @param {string} sit-to-keep Attribute name to be stored as an identifier.
    * @param {ValidationModel} sit-validation See {@link ValidationModel}.
    * @param {string} [ng-blur] _(Optional)_ An expression to evaluate on blur event.
    * @param {string} [sit-change] _(Optional)_ An expression to evaluate on change of value.
    * @param {string} [ng-disabled] _(Optional)_ If this expression is truthy, the element will be disabled.
    * @param {string} [ng-focus] _(Optional)_ An expression to evaluate on focus event.
    * @param {string} [ng-readonly] _(Optional)_ If this expression is truthy, the element will be set as read-only.
    * @param {string} [sit-to-group] _(Optional)_ Groups the options by a title or key defined, if not there will not be any grouping.
    *
    * @example
    * The following example shows how to configure a select widget within the sit-data attribute of the {@link siemens.simaticit.common.widgets.propertyGrid sit-property-grid} directive:
    * ```
    *  {
    *     value: { id: "kg", name: "kilogramm" },
    *     read_only: false,
    *     widget: "sit-select",
    *     widgetAttributes: {
    *        options: [
    *           { id: "g", name: "gramm", type:"A" },
    *           { id: "kg", name: "kilogramm",type:"A"  },
    *           { id: "l", name: "liter" ,type:"B" },
    *           { id: "ml", name: "milliliter",type:"B"  }       
    *        ],
    *        toDisplay: "name",
    *        toKeep: "id",
    *        toGroup:"type"
    *     }
    *  }
    * ```
    * The **value** attribute is used to define and store the selected value. After selection, the value attribute will contain the chosen item.
    */
    function SelectController() { }

    app.controller('SelectController', SelectController);

    app.directive('sitSelect', function () {

        return {
            scope: {},

            restrict: 'E',

            bindToController: {
                'readOnly': '=sitReadOnly',
                'value': '=sitValue',
                'validation': '=sitValidation',
                'options': '=sitOptions',
                'toDisplay': '=sitToDisplay',
                'toKeep': '=sitToKeep',
                'ngBlur': '&?',
                'sitChange': '=?',
                'ngDisabled': '=?',
                'ngFocus': '&?',
                'ngSelected': '=?',
                'ngReadonly': '=?',
                'sitToGroup':'=?'
            },

            controller: 'SelectController',

            controllerAs: 'selectCtrl',

            templateUrl: 'common/widgets/select/select.html',

            link: function (scope, el, attrs, ctrl) {
                ctrl.readValue = '';
                var valueChangeWatcher = scope.$watch(function () {
                    return ctrl.value;
                }, function (newValue, oldValue) {
                    if (newValue) {
                        ctrl.readValue = newValue[ctrl.toDisplay];
                    }
                });
                scope.$on("$destroy", function () {
                    valueChangeWatcher();
                });                
            }
        };
    });
})();


