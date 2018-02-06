/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';
    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.radio
    * 
    * @description
    * This module provides functionalities related to displaying radio controls. 
    */
    angular.module('siemens.simaticit.common.widgets.radio', []);

})();
/*jshint -W098 */
(function () {
    'use strict';

    var app = angular.module('siemens.simaticit.common.widgets.radio');

    /**
    * @ngdoc directive
    * @name sitRadio
    * @module siemens.simaticit.common.widgets.radio
    * @description  
    * Displays a radio control.  
    *
    * @usage 
    * As an element:
    * ```
    * <sit-radio sit-value="value" sit-validation="validation" sit-options="options" ng-readonly="ngReadonly" ng-blur="ngBlur" sit-change="sitChange"
    *       ng-disabled="ngDisabled" ng-focus="ngFocus">
    * </sit-radio>
    * ```
    * @restrict E
	* 
    * @param {string} sit-value Value of the radio widget.
    * @param {Object[]} sit-options Array of objects that contains label-value pairs.
    * @param {ValidationModel} sit-validation See {@link ValidationModel}.
    * @param {string} [ng-blur] _(Optional)_ An expression to evaluate on blur event.
    * @param {string} [sit-change] _(Optional)_ An expression to evaluate on change of value.
    * @param {string} [ng-disabled] _(Optional)_ If this expression is truthy, the element will be disabled.
    * @param {string} [ng-focus] _(Optional)_ An expression to evaluate on focus event.
    * @param {string} [ng-readonly] _(Optional)_ If this expression is truthy, the element will be set as read-only.
    *
    * @example
    * The following example shows how to configure a radio widget within the sit-data attribute of the {@link siemens.simaticit.common.widgets.propertyGrid sit-property-grid} directive: 
    * ```
    *  {
    *     read_only: false,
    *     widget: "sit-radio",
    *     value: "R",
    *     widgetAttributes: {
    *        name: "myRadio1",
    *        options: [
    *           { label: "Raw", value: "R" },
    *           { label: "Net", value: "Nt" },
    *           { label: "Negative", value: "N" },
    *           { label: "Liquid", value: "Lq" }
    *        ]
    *     }
    *  }
    * ```
    */
    function RadioController() { }

    app.controller('RadioController', RadioController);

    app.directive('sitRadio', function () {

        return {
            scope: {},

            restrict: 'E',

            bindToController: {
                'readOnly': '=sitReadOnly',
                'value': '=sitValue',
                'name': '@sitName',
                'validation': '=sitValidation',
                'options': '=sitOptions',
                'ngBlur': '&?',
                'sitChange': '=?',
                'ngDisabled': '=?',
                'ngFocus': '&?',
                'ngReadonly': '=?'
            },

            controller: 'RadioController',

            controllerAs: 'radioCtrl',

            templateUrl: 'common/widgets/radio/radio.html'
        };
    });
})();


