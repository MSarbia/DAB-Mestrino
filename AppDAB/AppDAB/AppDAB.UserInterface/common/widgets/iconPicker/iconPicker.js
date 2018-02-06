/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */

(function () {
    'use strict';

    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.iconPicker
    * 
    * @description
    * This module provides functionalities for selecting an icon from a predefined list of font awesome and sit icons.
    */

    angular.module('siemens.simaticit.common.widgets.iconPicker', []);

})();
/// <reference path="icon-selection-template.html" />
(function () {
    'use strict'

    var app = angular.module('siemens.simaticit.common.widgets.iconPicker');

    /**
   * @ngdoc directive
   * @name sitIconPicker
   * @module siemens.simaticit.common.widgets.iconPicker
   * @description 
   * The **iconpicker** is a widget that is used to select an icon from a predefined list of icons.
   * 
   * In addition to the class of the icon selected, additional classes can also be specified in the text box, to modify the appearance of the icon.<br> The user will need to have knowledge on
   * what classes will work with the icon specified. <br>
   * For eg: Using **fa-stack** with a font-awesome icon in icon picker will not be a valid scenario as **fa-stack** is meant for stacking more than one icons.
   * 
   * You can find more details on the font-awesome classes to be used at the <a href= 'http://fontawesome.io/examples'> Font Awesome</a> website.
   * Apart from this, you may also specify custom classes that are loaded in custom css files. This will work like any other css classes.
   *
   * @usage 
   * As an element:
   * ```
   * <sit-icon-picker sit-id="iconPickerID" sit-limit="limit" sit-selected-object="selectedObject"  sit-validation="validation"
   *        ng-blur="ngBlur" ng-change="ngChange" ng-disabled="ngDisabled" ng-focus="ngFocus" ng-readonly="ngReadonly">
   * </sit-icon-picker>
   *
   * ```
   * @restrict E 
   * @param {String} sit-id Unique identifier of the icon picker.
   * @param {Object} [sit-selected-object] _(Optional)_ Default entity selected when the page is loaded. Updated when the user selects another entity. Object should of the format: { icon : 'icon-name'}. 
   *```
   * eg: var selectedObject = { icon: "fa-book" }
   *```
   * @param {String} sit-value Value of the icon picker widget, i.e the name of the icon selected
   * @param {Number} [sit-limit=8] _(Optional)_ Maximum number of icons to be displayed. <br> **Note:** If the specified limit is more than 50 , performance issues maybe observed in some browsers. The recommended limit is 50 and below.
   * @param {ValidationModel} sit-validation See {@link ValidationModel}.
   * @param {string} [ng-blur] _(Optional)_ An expression to evaluate on blur event.   
   * @param {string} [ng-disabled] _(Optional)_ If this expression is truthy, the element will be disabled.
   * @param {string} [ng-focus] _(Optional)_ An expression to evaluate on focus event.
   * @param {string} [ng-readonly] _(Optional)_ If this expression is truthy, the element will be set as read-only.
   * @param {Bool} sit-read-only Specifies if the property is editable.
   * @param {Bool} sit-required _(Deprecated)_ Specifies if the property is mandatory or not. **Note:** If ctrl.sitValidation.required is defined, it will override ctrl.sitRequired value. (default:false)  
   * 
   * @example
   * In a view template, the `sit-icon-picker` directive is used as follows:
   * 
   * ```
   * <sit-icon-picker sit-id="id" ng-disabled="false" ng-blur="true" sit-limit="50" 
                        sit-required="true" sit-validation ="validation"/>
   * ```
   * 
   
   **/


    function sitIconPicker() {
        return {
            restrict: 'E',
            scope: {},
            bindToController:
            {
                id: "=?sitId",
                readOnly: '=?sitReadOnly',
                selectedObject: "=?sitSelectedObject",
                value: "=?sitValue",
                limit: "=?sitLimit",
                validation: "=?sitValidation",
                ngBlur: '&?',
                ngDisabled: '=?',
                ngFocus: '&?',
                ngReadonly: '=?',
                required: '=?sitRequired'
            },
            controller: IconPickerController,
            controllerAs: 'iconPickerCtrl',
            templateUrl: 'common/widgets/iconPicker/iconPicker.html'
        }
    }

    IconPickerController.$inject = ['$scope', '$translate', "common.graph.fontAwesomIconData", "common.iconPicker.sitIconData","$timeout"];
    function IconPickerController($scope, $translate, fontawesomeData, sitIconsData,$timeout) {
        var SIT_ICON_LIMIT = 50;
        var vm = this;
        vm.editable = true;
        vm.showpicker = true;
        vm.valueChanged = valueChanged;
        vm.limit = vm.limit === parseInt(vm.limit) ? vm.limit : SIT_ICON_LIMIT;
        vm.templateUrl = 'common/widgets/iconPicker/icon-selection-template.html';
        var dataSourceArray = [];
        dataSourceArray = fontawesomeData.fontAwesomIcon;
        vm.datasource = dataSourceArray.concat(sitIconsData.sitIcon);
        vm.selectedAttributeToDisplay = 'icon';
        vm.placeholder = $translate.instant('iconPicker.defaultPlaceHolder');
       
        if (vm.selectedObject && vm.selectedObject.icon) {
            vm.icon = vm.selectedObject.icon;
            vm.value = vm.selectedObject.icon;
        }
        var selectObjectWatch = $scope.$watch(function () {
            return vm.selectedObject;
        }, function (newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            vm.showpicker = false;
            if (undefined === vm.selectedObject || null === vm.selectedObject) {
                vm.icon = '';
                vm.value = '';
            } else {
                vm.icon = vm.selectedObject.icon;
                vm.value = vm.selectedObject.icon;
            }
            $timeout(function () {
                vm.showpicker = true;
            }, 0);
        }, true);
        $scope.$on('sit-entity-picker.entity-selected', function (event, data) {           
            vm.icon = data.model.icon;
            vm.value = data.model.icon;            
        });

        function valueChanged(oldVal, newVal) {
            vm.icon = newVal;
            vm.value = newVal;
            $scope.$emit('sit-icon-picker-icon-selected', { icon: vm.value });
        }

        $scope.$on("$destroy", function () {
            selectObjectWatch();
        });
    }

    app.directive('sitIconPicker', [sitIconPicker]);
})();
(function () {
    "use strict";

    /**
    * @ngdoc service
    * @name common.iconPicker.sitIconData
    * @module siemens.simaticit.common.widgets.iconPicker
    *
    * @description
    * This service provides a list of sit icon names.
    *
    */
    var sitIconJson = {
        "sitIcon": [
            { "icon": "sit sit-active" },
{ "icon": "sit sit-active-circle" },
{ "icon": "sit sit-anchor-up"},
{ "icon": "sit sit-application" },
{ "icon": "sit sit-assign"},
{ "icon": "sit sit-associate" },
{ "icon": "sit sit-available" },
{ "icon": "sit sit-batch" },
{ "icon": "sit sit-robot"},
{ "icon": "sit sit-bi-solution" },
{ "icon": "sit sit-bom"},
{ "icon": "sit sit-business-logic-distribution" },
{ "icon": "sit sit-calendar"},
{ "icon": "sit sit-certification" },
{ "icon": "sit sit-cnc-program" },
{ "icon": "sit sit-component" },
{ "icon": "sit sit-custom-time-aggregation" },
{ "icon": "sit sit-data-gateway" },
{ "icon": "sit sit-data-warehouse-project" },
{ "icon": "sit sit-deploy"},
{ "icon": "sit sit-disable"},
{ "icon": "sit sit-doc-center" },
{ "icon": "sit sit-document"},
{ "icon": "sit sit-drag"},
{ "icon": "sit sit-engineering" },
{ "icon": "sit sit-enterprise" },
{ "icon": "sit sit-event-subscription"},
{ "icon": "sit sit-ewi"},
{ "icon": "sit sit-ewi-document"},
{ "icon": "sit sit-export"},
{ "icon": "sit sit-field"},
{ "icon": "sit sit-flow" },
{ "icon": "sit sit-flows"},
{ "icon": "sit sit-form" },
{ "icon": "sit sit-freeze"},
{ "icon": "sit sit-functionality"},
{ "icon": "sit sit-grid"},
{ "icon": "sit sit-hold"},
{ "icon": "sit sit-holiday" },
{ "icon": "sit sit-holiday-set" },
{ "icon": "sit sit-identifier-format" },
{ "icon": "sit sit-import" },
{ "icon": "sit sit-in-progress" },
{ "icon": "sit sit-items"},
{ "icon": "sit sit-kpi" },
{ "icon": "sit sit-layout" },
{ "icon": "sit sit-log" },
{ "icon": "sit sit-machine" },
{ "icon": "sit sit-management" },
{ "icon": "sit sit-measure"},
{ "icon": "sit sit-model" },
{ "icon": "sit sit-monitoring" },
{ "icon": "sit sit-obsolete"},
{ "icon": "sit sit-ontology"},
{ "icon": "sit sit-ontology-alt"},
{ "icon": "sit sit-package-administration"},
{ "icon": "sit sit-parts-and-products"},
{ "icon": "sit sit-push"},
{ "icon": "sit sit-push-alt"},
{ "icon": "sit sit-release" },
{ "icon": "sit sit-resize" },
{ "icon": "sit sit-routing-alt"},
{ "icon": "sit sit-routing" },
{ "icon": "sit sit-scrap"},
{ "icon": "sit sit-section"},
{ "icon": "sit sit-set"},
{ "icon": "sit sit-site"},
{ "icon": "sit sit-skills"},
{ "icon": "sit sit-smart-navigation"},
{ "icon": "sit sit-sn"},
{ "icon": "sit sit-sn-change"},
{ "icon": "sit sit-solution"},
{ "icon": "sit sit-solution-repository"},
{ "icon": "sit sit-source"},
{ "icon": "sit sit-stackable-access"},
{ "icon": "sit sit-stackable-add" },
{ "icon": "sit sit-stackable-bkg"},
{ "icon": "sit sit-stackable-config"},
{ "icon": "sit sit-stackable-deploy" },
{ "icon": "sit sit-stackable-edit" },
{ "icon": "sit sit-stackable-enable" },
{ "icon": "sit sit-stackable-intelligence"},
{ "icon": "sit sit-stackable-machine" },
{ "icon": "sit sit-stackable-management"},
{ "icon": "sit sit-stackable-ok"},
{ "icon": "sit sit-stackable-operation"},
{ "icon": "sit sit-stackable-order" },
{ "icon": "sit sit-stackable-reason" },
{ "icon": "sit sit-stackable-remove" },
{ "icon": "sit sit-stackable-set" },
{ "icon": "sit sit-stackable-setting"},
{ "icon": "sit sit-stackable-show" },
{ "icon": "sit sit-stackable-activate"},
{ "icon": "sit sit-stackable-time" },
{ "icon": "sit sit-stackable-source" },
{ "icon": "sit sit-system-configuration"},
{ "icon": "sit sit-tasklist" },
{ "icon": "sit sit-time-period" },
{ "icon": "sit sit-time-slice"},
{ "icon": "sit sit-time-slice-category"},
{ "icon": "sit sit-tools" },
{ "icon": "sit sit-ui"},
{ "icon": "sit sit-ui-application"},
{ "icon": "sit sit-ui-component" },
{ "icon": "sit sit-ui-module"},
{ "icon": "sit sit-ui-module-mashup"},
{ "icon": "sit sit-ui-screen"},
{ "icon": "sit sit-unassign" },
{ "icon": "sit sit-unset"},
{ "icon": "sit sit-update"},
{ "icon": "sit sit-user"},
{ "icon": "sit sit-user-group"},
{ "icon": "sit sit-user-id" },
{ "icon": "sit sit-user-role" },
{ "icon": "sit sit-work" },
{ "icon": "sit sit-worker-role"},
{ "icon": "sit sit-working-aggregation-type"},
{ "icon": "sit sit-working-pattern"},
{ "icon": "sit sit-work-order" },
{ "icon": "sit sit-work-schedule-rule" }
        ]
    };
    angular.module('siemens.simaticit.common.widgets.iconPicker').value("common.iconPicker.sitIconData", sitIconJson);

})();