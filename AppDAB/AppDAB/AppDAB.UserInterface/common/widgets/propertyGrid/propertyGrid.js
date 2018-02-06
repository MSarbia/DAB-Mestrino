/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */

(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name siemens.simaticit.common.widgets.propertyGrid
     * @description 
     * This module provides functionalities related to displaying object details and generating property-grids to display object properties (**display** and **mode** are configurable). 
     */
    angular.module('siemens.simaticit.common.widgets.propertyGrid', [function () {
        //any dependencies?
    }]);

})();

(function () {
    'use strict';
    /**
     * @ngdoc type
     * @name ValidationModel
     * @module siemens.simaticit.common.widgets.propertyGrid
     * @description
     * An object containings all the validation checks that must be performed on a specific field of a {@link sitPropertyGrid sit-property-grid} directive.
     * 
     * @property {boolean} required Whether a value is required or not.
     * @property {number} minlength The minimum length of a String value.
     * @property {number} maxlength The maximum length of a String value.
     * @property {RegEx} pattern A regular expression to validate a String or Number value.
     * @property {number} min The minimum value (for numbers only, not supported by {@link sitCheckbox sit-checkbox} and {@link sitMultiSelect sit-multi-select}). 
     * @property {number} max The maximum value (for numbers only, not supported by {@link sitCheckbox sit-checkbox} and {@link sitMultiSelect sit-multi-select}).
     * @property {boolean} editable If set to **true**, custom values are not considered valid (used by the {@link sitEntityPicker sit-entity-picker} directive only).
     * @property {Function} custom A custom callback function. If **sit-change** is configured with custom validation, it is required that 
     * the custom validation function returns an updated ngModel.
     *
     */
/**
* @ngdoc directive
* @name sitProperty
* @module siemens.simaticit.common.widgets.propertyGrid
* @description 
* Displays a property field within a Property Grid (see {@link sitPropertyGrid}), comprised of a label and a widget. Layout (vertical, horizontal, fixed, fluid) and mode (view or edit) is determined by the settings configured in the parent property grid.
* 
* @usage
* As element:
* ```
*  <sit-property 
*    sit-widget="sit-text"
*    sit-value="'Some text'"
*    sit-validation="{required: true}"
*    ng-disabled="vm.disablePeroperty"
*    ng-readonly="vm.ngReadonly">My Text:</sit-property>
* ```
* 
* @restrict E
* @param {String} [sit-widget=sit-text] Defines the widget used to edit the field. It must be the name of a valid directive that can be used within a Property Grid, such as one of the following:
*  * {@link sitCheckbox sit-checkbox}
*  * {@link sitDatepicker sit-date-picker}
*  * {@link sitEntityPicker sit-entity-picker}
*  * {@link sitEmail sit-email}
*  * {@link sitFileUploader sit-file-uploader}
*  * {@link sitLabel sit-label}
*  * {@link sitMultiSelect sit-multi-select}
*  * {@link sitNumeric sit-numeric}
*  * {@link sitPassword sit-password}
*  * {@link sitRadio sit-radio}
*  * {@link sitSelect sit-select}
*  * {@link sitText sit-text}
*  * {@link sitTextarea sit-textarea}
*  * {@link sitTimePicker sit-time-picker}
*  * {@link sitTypeahead sit-typehead}
*  * {@link sitDateTimePicker sit-date-time-picker}
*  
* Alternatively you can specify a custom directive, provided that it has been implemented to support usage within the Property Grid directive.
*
* @param {(String|Number|Boolean|Object|Array)} sit-value The value of the property. If this attribute is set to an array and **sit-widget** has not been set to {@link sitMultiSelect sit-multi-select} or {@link sitCheckbox sit-checkbox}, the control will be repeated to populate each element of the array. 
*
* @param {Number} sit-min-items If **sit-value** is bound to an array, determines the minimum number of widget instances to be displayed (not applicable if the specified widget is {@link sitMultiSelect sit-multi-select} or {@link sitCheckbox sit-checkbox}). 
*
* @param {Number} sit-max-items If **sit-value** is bound to an array, determines the maximum number of widget instances to be displayed (not applicable if the specified widget is {@link sitMultiSelect sit-multi-select} or {@link sitCheckbox sit-checkbox}). 
*
* @param {String} sit-change _(Optional)_ A callback function that will be executed when the value of the property changes. The callback will be called with two parameters, corresponding to the old value and the new value of the property.
*
* @param {String} ng-disabled _(Optional)_ If truthy, disables the widget used for editing the property value.
* 
* @param {String} ng-readonly _(Optional)_ If truthy, sets the widget used for editing the property as read-only.
*
* @param {String} sit-read-only _(Optional)_ If falsy, the value of the property will be displayed as a label.
*
* @param {String} ng-required _(Optional)_ If truthy, a value for this property is required. This attribute  will not be supported for new compatible widgets in the future; use **sit-validation** instead.
* 
* @param {String} sit-id A unique identifier for the property. Not needed if the Property Grid is configured via markup.
* 
* @param {ValidationModel} sit-validation _(Optional)_ Defines the validation required for the property. See {@link ValidationModel} for more information.
* @param {?Object} sit-widget-attributes An object containing properties corresponding to attributes to be passed directly to the widget specified in the **sit-widget** attribute. Mandatory for configure certain widgets that require additional mandatory attributes, like {@link sitSelect sit-select} or {@link sitEntityPicker sit-entity-picker}.
* 
* For compatibility reasons, if the following attributes are specified as attributes of a **sit-property** directive, they will be passed to compatibile widgets:
*
* * For the {@link sitSelect sit-select} widget:
*   * sit-options
*   * sit-to-display
*   * sit-to-keep
* * For the {@link sitTypeahead sit-typeahead} widget:
*   * sit-options
*   * sit-to-display
* * For the {@link sitRadio sit-radio} widget:
*   * sit-options
* * For the {@link sitEntityPicker sit-entity-picker} widget:
*   * sit-datasource
*   * sit-limit
*   * sit-editable
*   * sit-placeholder
*   * sit-selected-attribute-to-display
*   * sit-selected-object
*   * sit-template-url
*   * sit-required
* * For the {@link sitDatepicker sit-date-picker} widget:
*   * sit-format
*   * sit-append-to-body
*   * sit-show-button-bar
* * For the {@link sitTimePicker sit-time-picker} widget:
*   * sit-format
*
* Using these attributes directly on the sitProperty widget is deprecated. It is recommended however to configure widget attributes using the **sit-widget-attributes** attribute instead.
*
* 
* 
* @example
* 
* In a view template, the **sit-property** directive is used within a {@link sitPropertyGrid sit-property-grid} as follows:
* 
* ```
*        <sit-property-grid sit-id="{{vm.propertyGridId}}"
*                           sit-data="vm.propertyGridData"
*                           sit-layout="'Horizontal'"
*                           sit-type="vm.propertyGridType"
*                           sit-mode="view"
*                           sit-columns="vm.selectedColumnNumber">
*
*            <sit-property 
*               sit-widget="sit-textarea"  
*               sit-value="vm.textarea.value" 
*               sit-validation="{maxlength: 200, required: true}">Text Area:</sit-property>
* 
*            <sit-property 
*               sit-widget="sit-numeric"
*               sit-value="vm.number.value" 
*               sit-validation="{min: 0, max: 10}">Simple Number:</sit-property>
* 
*            <sit-property 
*               sit-widget="sit-select" 
*               sit-value="vm.selectData.value" 
*               sit-validation="{required: true}" 
*               sit-widget-attributes="{'sit-options': [{id: 'g', name: 'g'}, {id: 'kg', name: 'Kg'}], 'sit-to-display': 'name' }">Select:</sit-property>
*        </sit-property-grid>
* ```   
*
* 
* @example
* ### Configuring a widget using sit-widget-attributes and custom validation
* 
* The following template fragment shows a **sit-property** directive used to configure a {@link sitFileUploader sit-file-uploader} widget with custom validation:
* ```
* <sit-property sit-id="child2" 
*                sit-widget="sit-file-uploader" 
*                sit-value="vm.currentItem.file"
*                sit-validation="{required: true, custom: vm.customValidation}" 
*                sit-widget-attributes="vm.widgetAttributes">File 2
* </sit-property>
* ```
* In this case, the object bound to the **sit-widget-attributes** attribute and the custom validation function are configured in the controller, as follows:
*
* ```
* vm.widgetAttributes = {
*   "accept": 'image/jpeg,video/ogg,audio/ogg,audio/mp3,application/x-zip-compressed',
*   "sit-min-size": '0KB',
*   "sit-max-size": '50MB'
* };
* vm.customValidation = function (value, ngModel){ 
*   if (value) { 
*     try {
*       var obj = JSON.parse(atob(value.contents));
*       if (obj.name) {
*         ngModel.$setValidity('file', true);
*       } else {
*         ngModel.$setValidity('file', false); 
*       }
*     } catch(e) {
*       ngModel.$setValidity('file', false);
*     }
*   } 
*   return ngModel;
* };
* ```
* 
* Note that:
* 
* * The function specified for the custom validation takes two parameters: the first parameter is the new value of the property, and the second parameter is the **ngModelController** object used internally by the widget, which also contains the old value of the property. In this case, the function considers the property valid if the contents of the uploaded file are in JSON format, and if the parsed JSON object contains the property 'name'.
* * The widget attributes specified are specific to the {@link sitFileUploader sit-file-uploader} widget.
*
*
* @example
* ### Integrating custom widgets
*   
* It is possible to easily integrate custom directives to be used with the sit-property directive, as long as they manage at least a **sit-value** attribute.
* 
* For example, the following custom directive can be used to display a toggle button with a tooltip, which is configurable via a **title** attribute:
*
* ```
*    app.directive('myToggle', [function () {
*        return {
*            restrict: 'E',
*            replace: false,
*            scope: {},
*            controller: function () {
*                if (!this.value) this.value = 'off';
*                this.toggle = function () {
*                    if (this.value === 'on') this.value = "off";
*                    else this.value = "on";
*                }
*            },
*            controllerAs: 'toggleCtrl',
*            bindToController: {
*                title: '=?title',
**               value: '=?sitValue'
*            },
*            template: '<span ng-click="toggleCtrl.toggle()" title="{{toggleCtrl.title}} is {{toggleCtrl.value}}"> <i class="fa fa-2x fa-toggle-{{toggleCtrl.value}}" ng-style="{\'color\': toggleCtrl.value ===\'on\' ? \'green\' : \'gray\'}"> </span>',
*        }
*    }]);
*
* ```
*  To use this directive within **sit-property** it is sufficient to specify the **sit-widget** and **sit-widget-attributes** accordingly:
*
*  ```
*              <sit-property-grid sit-id="propertyGrid3"
*                               sit-layout="{{propertyCtrl.propertyGridLayout}}"
*                               sit-type="{{propertyCtrl.propertyGridType}}"
*                               sit-mode="view"
*                               sit-columns="propertyCtrl.propertyGridColumns">
*                <sit-property sit-widget="sit-toggle"
*                              sit-value="propertyCtrl.currentItem.toggleResizing" 
*                              sit-widget-attributes="{title: 'Toggle resizing'}">Resize:</sit-property>
*            
*            </sit-property-grid>
*
* ```
*
* @example
* ### Using the sit-change attribute
* 
* The following template shows how to display a {@link sitSelect sit-select} widget listing cities only after a country has been selected in another sit-select widget:
* 
* ``` 
* <sit-property sit-widget="sit-select"
*			  sit-value="vm.currentItem.Country"
*			  sit-options="vm.countries"
*			  sit-change="vm.setCities"
*			  sit-to-display="'Name'"
*			  sit-to-keep="'Name'">Country:</sit-property>
* <sit-property sit-widget="sit-select"
*			  sit-value="vm.currentItem.City"
*			  sit-options="vm.locations"
*			  ng-if="vm.currentItem.Country.Name"
*			  sit-to-display="'Name'"
*			  sit-to-keep="'Name'">City:</sit-property>
* ``` 
* 
* When the value in the first sit-select widget changes, the callback specified in the **sit-change** attribute will be executed. This is the implementation of the callback in the controller:
* 
* ``` 
* self.setCities = function (modelValue, viewValue) {
*   LocationSvc.getCities(viewValue.Name).then(function (data) {
*     self.locations = data;
*   });
* };
* ``` 
*
* 
* @example
* ### Configuring multi-value widgets
*
* To input multiple values for a property, it is sufficient to bind the **sit-value** attribute to an array and optionally specify the minimum and maximum number of widgets to display, like this:
* 
*  ```
*  <sit-property sit-widget="sit-email"
*                sit-min-items="2"
*                sit-max-items="5"
*                sit-value="['abc1@xyz.com', 'abc2@xyz.com']"
*                sit-validation="{required: true}">Emails:</sit-property>
*  ```
*
*/

    angular.module('siemens.simaticit.common.widgets.propertyGrid').directive('sitProperty', ['$parse',PropertyDirective]);


    function PropertyDirective($parse) {
        var sitProperty = {
            scope: {},
            transclude: true,
            require: ['sitProperty', '^sitPropertyGrid'],
            controller: PropertyCtrl,
            controllerAs: 'propertyCtrl',
            bindToController: {
                sitWidget: '@',
                value: '=?sitValue',
                validation: '=?sitValidation',
                readOnly: '=?sitReadOnly',
                ngRequired: '@?',
                name: '=?sitName',
                placeholder: '=?sitPlaceholder',
                limit: '=?sitLimit',
                templateUrl: '=?sitTemplateUrl',
                selectedAttributeToDisplay: '=?sitSelectedAttributeToDisplay',
                options: '=?sitOptions',
                toDisplay: '=?sitToDisplay',
                toKeep: '=?sitToKeep',
                sitDatasource: '=?',
                sitSelectedObject: '=?',
                sitEditable: '=?',
                accept: '=?accept',
                minSize: '=?sitMinSize',
                maxSize: '=?sitMaxSize',
                sitSelectedString: '=?',
                sitSplitList: '=?',
                sitDoneCallback: '=?',
                minItems: '=?sitMinItems',
                maxItems: '=?sitMaxItems',
                format: '=?sitFormat',
                appendToBody: '=?sitAppendToBody',
                showButtonBar: '=?sitShowButtonBar',
                showMeridian: '=?sitShowMeridian',
                showWeeks:'=?sitShowWeeks',
                widgetAttributes: '=?sitWidgetAttributes',
                ngBlur: '&?',
                sitChange: '=?',
                ngDisabled: '=?',
                ngFocus: '&?',
                ngReadonly: '=?',
                sitRequired: '=?',
                sitId: '=?'
            },
            link: function (scope, elmnt, attrs, ctrls, transclude) {
                var vm = ctrls[0];
                var parent = ctrls[1];//sit-property-grid-dir
                var transcludedText;

                vm.isMultiValueWidget = false;
                vm.parentScope = {
                    layout: parent.layout.toUpperCase(),
                    type: parent.type.toUpperCase(),
                    mode: parent.mode,
                    columns: parent.columns
                };

                if (vm.value && angular.isArray(vm.value) && vm.sitWidget !== 'sit-checkbox' && vm.sitWidget !== 'sit-multi-select') {
                    vm.isMultiValueWidget = true;
                }

                if (parent.mode === 'view') {
                    vm.readOnly = true;
                }

                
                
                if (ctrls[1].layout.toUpperCase() === 'HORIZONTAL' && ctrls[1].type.toUpperCase() === 'FLUID') {
                    var propertyGridWidth = elmnt.parent().width();
                    var flexX = calcFlexBasis(propertyGridWidth);
                    elmnt.parent().css('flex-basis', flexX);
                }

                
                function calcFlexBasis(width){
                    if (width >= 1366) {
                        return '25%';
                    }
                    else if (width >= 768) {
                        return '33%';
                    }
                    else if (width >= 320) {
                        return '50%';
                    }
                    else {
                        return '100%';
                    }
                }
               
                function onMouseEnter() {
                    var tooltipText = transcludedText.text().replace(/\{\{(.+?)\}\}/g, function (match, first) { return $parse(first)(scope) });
                    if (tooltipText.lastIndexOf(':') === tooltipText.length) {
                        tooltipText = tooltipText.substring(0, tooltipText.length)
                    }
                    if (transcludedText[0].offsetWidth < transcludedText[0].scrollWidth) {
                        transcludedText.attr("title", tooltipText);
                    } else {
                        transcludedText.removeAttr("title");
                    }
                }

                transclude(scope, function () {
                    transcludedText = elmnt.find('[ng-transclude]');
                    if (transcludedText && transcludedText.html()) {
                        transcludedText.addClass('property-label-ellipsis');
                        transcludedText.on("mouseenter", onMouseEnter);
                    }
                });

                scope.$on("$destroy", function () {
                    transcludedText.off("mouseenter", onMouseEnter);
                });
            },
            templateUrl: "common/widgets/propertyGrid/property.html"
        };
        return sitProperty;
    }

    PropertyCtrl.$inject = ["$filter"];
    function PropertyCtrl($filter) {
        var vm = this;

        activate();

        function activate() {
            init();
        }

        function init() {
            vm.addWidgetInstance = addWidgetInstance;
            vm.removeWidgetInstance = removeWidgetInstance;
            vm.addBtnTitle = $filter('translate')('propertyGrid.property.addNew');
            vm.removeBtnTitle = $filter('translate')('propertyGrid.property.remove');

            if (angular.isArray(vm.value)) {
                vm.minItems = Number(vm.minItems) || 0;
                vm.maxItems = Number(vm.maxItems) || 99;

                if (vm.value.length === 0 && (vm.readOnly || vm.ngReadonly)) {
                    vm.value.push('');
                }
                changeButtonsTitle();
            }

        }

        function addWidgetInstance(index) {
            if (vm.maxItems !== undefined && vm.maxItems > vm.value.length) {
                vm.value.splice(index + 1, 0, '');
            }
            changeButtonsTitle();
        }

        function removeWidgetInstance(index) {
            if (vm.minItems !== undefined && vm.minItems < vm.value.length) {
                vm.value.splice(index, 1);
            }
            changeButtonsTitle();
        }

        function changeButtonsTitle() {
            vm.addBtnTitle = (vm.value.length === vm.maxItems) ? $filter('translate')('propertyGrid.property.canNotAdd') : $filter('translate')('propertyGrid.property.addNew');
            vm.removeBtnTitle = (vm.value.length <= vm.minItems) ? $filter('translate')('propertyGrid.property.canNotRemove') : $filter('translate')('propertyGrid.property.remove');
        }
    }

})();
/*jshint -W098 */
(function () {
    'use strict';
    /**
    * @ngdoc directive
    * @name sitPropertyGrid
    * @module siemens.simaticit.common.widgets.propertyGrid
    * @description 
    * Displays the properties of an object in a form, according to the specified layout (vertical/horizontal), type (fixed/fluid) and mode (view, edit).
    *
    * You can specify the properties to display and their features either by supplying a configuration object to the **sit-data** attribute or by adding one or more {@link sitProperty sit-property} directives to the markup.
    * 
    * If the **sit-data** attribute is specified (and is not empty), it overrides any declarative configuration specified via any of the child **sit-property** directives.
    * 
    * @usage
    * As element (using {@link sitProperty sit-property} directives to configure each property):
    * ```
    * <sit-property-grid 
    *   sit-id="{{vm.propertyGridId}}"
    *   sit-layout="'Horizontal'"
    *   sit-type="'Fluid'"
    *   sit-mode="view"
    *   sit-columns="4">
    * 
    *   <sit-property 
    *     sit-widget="sit-textarea"
    *     sit-value="vm.textarea"
    *     sit-validation="{minlength: 100, maxlength: 800">
    *     Text Area:
    *   </sit-property>
    * 
    *   <sit-property 
    *     sit-widget="sit-numeric"
    *     sit-value="vm.number"
    *     sit-validation="{required: true}">
    *     Number:
    *   </sit-property>
    * 
    *   <sit-property 
    *     sit-widget="sit-email"
    *     sit-value="vm.email"
    *     sit-validation="{pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/}"
    *     ng-readonly="true">
    *     Email:
    *   </sit-property>
    * 
    *   <sit-property 
    *     sit-widget="sit-radio"
    *     sit-value="vm.radio"
    *     sit-widget-attributes="'sit-options':[{label: 'Raw', value: 'R'}, {label: 'Net', value: 'N'}]">
    *     Radio:
    *   </sit-property>
    * 
    * </sit-property-grid>
    * ```
    * As element (supplying a configuration object to the **sit-data** attribute):
    * ```
    *  <sit-property-grid 
    *    sit-id="{{vm.PropertyGridEdit}}"
    *    sit-data="vm.displayData"
    *    sit-layout="'Horizontal'"
    *    sit-type="'Fluid'"
    *    sit-mode="edit">
    *  </sit-property-grid>
    * ```
    * 
    * @restrict E
    *
    * @param {String} sit-id Unique identifier of the Property Grid. No special characters, except for underscore ("\_"), are allowed for this attribute.
    * 
    * @param {String} sit-type Defines if the vertical property alignment is **Fluid** or **Fixed**:
    * 
    * * **Fluid**: The number of columns is managed dynamically, i.e. the number is defined automatically according to the width available. This option is only available with the **Horizontal** layout.
    * * **Fixed**: The number of column is prefedined.
    * 
    * @param {Number} sit-columns Number of columns to be displayed for **Fixed** type.
    * 
    * @param {String} sit-layout Defines if the Property Grid should be displayed vertically or horizontally.
    * 
    * Allowed values: 
    * * **Vertical** 
    * * **Horizontal**  
    * 
    * @param {String} [sit-mode=edit]  If set to **view**, the Property Grid is not editable, if set to **edit** the Property Grid is editable, and the configured widgets will be used to edit each property.
    *
    * @param {Array.<Object>} sit-data
    * An array of objects, each used to configure a property to display within the Property Grid. 
    * 
    * **Note:** It is recommended to use nested {@link sitProperty sit-property} directives for this kind of configuration instead.
    * 
    * Each object has the following properties:
    * 
    * * **id**: A unique identifier for the property.
    * * **widget**: The widget to use to edit the property. For a list of the supported widgets, see the **sit-widget** attribute of the {@link sitProperty sit-property} directive.
    * * **data**: An optional object passed to automatically determine the widget to use for editing based on its type.
    * * **label**: The label to display next to the property value.
    * * **value**: The property value.
    * * **read_only**: Specifies if the property is editable (only if the widget is editable). If set to **false**, some widgets will display the value as a label.
    * * **invisible**: If set to **true**, the property will not be displayed in the Property Grid.
    * * **validation**: An object used to specify data validation for the property. For a list of the supported properties, see the **sit-validation** attribute of the {@link sitProperty sit-property} directive.
    * * **widgetAttributes**: Used to set widget-specific attributes.
    * 
    *   @example
    * 
    *   <aside class="admonition admonition-note">  
    *     The following example shows how to configure a Property Grid using a single configuration object via the **sid-data** attribute. It is recommended to configure data declaratively for each property using the {@link sitProperty sit-property} directive instead.
    *   </aside>
    * 
    *   In a view template, the **sit-property-grid** directive is used as follows:
    *   ```
    *   <sit-property-grid 
    *       id="examplePropertyGridEdit"
            sit-data="vm.displayData"
            sit-layout="'Horizontal'"
            sit-type="'Fluid'"
            sit-mode="edit"></sit-property-grid>
    *   ```
    *
    *   In the controller, the displayData object is configured as follows:
    *
    *   ```
    *   vm.displayData = [
    *      {
    *         label: "Hidden Guid String",
    *         invisible: true,
    *         value: "xxxxx-xxxx-xxxx-xxxxxxxxxxxx"
    *      }
    *      ,
    *      {
    *         label: "Simple Numeric",
    *         value: 5
    *      }
    *      ,
    *      {
    *         id: "numericid1",
    *         label: "Numeric",
    *         read_only: false,
    *         validation: {},
    *         widget: "sit-numeric",
    *         value: 5
    *      }
    *      ,
    *      {
    *         id: "stringid1",
    *         label: "String",
    *         read_only: false,
    *         widget: "sit-text",
    *         value: "785",
    *         validation: { required: true, maxlength: 10, pattern: "/^[0-9]{1,11}$/" }
    *      }
    *      ,
    *      {
    *         id: "textareaid1",
    *         label: "Text Area",
    *         read_only: false,
    *         widget: "sit-textarea",
    *         value: "This is a textarea tag...\r\nline2",
    *         validation: { required: true, maxlength: 50 }
    *      }
    *      ,
    *      {
    *         id: "datepickerid1",
    *         label: "Date Picker",
    *         read_only: false,
    *         validation: { required: true },
    *         widget: "sit-datepicker",
    *         value: null,
    *         widgetAttributes: {
    *             format: "MM/dd/yyyy"
    *         }
    *      }
    *      ,
    *      {
    *         id: "timepickerid1",
    *         label: "Time picker",
    *         read_only: false,
    *         widget: "sit-time-picker",
    *         value: new Date()
    *      }
    *      ,
    *      {
    *         id: "typeaheadid",
    *         label: "Typeahead",
    *         read_only: false,
    *         widget: "sit-typeahead",
    *         value: "Boby",
    *         validation: { required: true },
    *         widgetAttributes: {
    *            options: [
    *               "John", "Jack", "Jacob", "Jeremy", "Jimmy", "Boby"
    *            ],
    *            toDisplay: null
    *         }
    *      }
    *   ];
    * ```
    * 
    */
/**
 * @ngdoc event
 * @name sitPropertyGrid#sit-property-grid.validity-changed
 * @eventType emit on scope
 * @description
 * Emitted when the overall validity of the Property Grid changes.
 * 
 * @param {object} validity An object containing two properties:
 * 
 * * **id** - The ID of the Property Grid.
 * * **validity** - Set to **true** if the Property Grid contains valid data, **false** otherwise.
 */
    angular.module('siemens.simaticit.common.widgets.propertyGrid').directive('sitPropertyGrid', PropertyGridDirective);
    function PropertyGridDirective(){
        var sitPropertyGrid = {
            scope: {
                type: "@sitType",
                layout: "@sitLayout",
                columns: "=?sitColumns",
                mode: "@sitMode",
                validation: "=?",
                data: "=?sitData",
                id: "@sitId"
            },
            restrict: 'E',
            templateUrl: 'common/widgets/propertyGrid/property-grid.html',
            controller: PropertyGridController,
            controllerAs: 'propertyGridCtrl',
            transclude: true,
            link: ['$scope', '$element', '$attrs', link],
            bindToController: {
                type: "@sitType",
                layout: "@sitLayout",
                columns: "=?sitColumns",
                mode: "@sitMode",
                validation: "=?",
                data: "=?sitData",
                id: "@sitId"
            }
        };
        function link($scope, $element, $attrs) {}
        return sitPropertyGrid;
    }
    PropertyGridController.$inject = ['$scope', '$element', '$attrs'];
    function PropertyGridController($scope, $element, $attrs) {
        var vm = this;
        var arr = [];
        vm.setValidity = setValidity;
        vm.transclusionIsSet = isTransclusionNeeded();
        function isTransclusionNeeded() {
            if ($attrs.sitData) { return false; }
            return true;
        }
        //Function available for child directive
        function setValidity(validity) {
            this.isFormValid = validity;
            $scope.$emit('sit-property-grid.validity-changed', { id: $scope.id, validity: validity }); //To notify parent

            if (this.isFormValid && arr.length > 0) {
                $scope.$emit('sit-property-grid.validity-changed', { id: $scope.id, validity: vm.isFormValid, dirty: false });
            }
            else if (this.isFormValid === false) {
                $scope.$emit('sit-property-grid.validity-changed', { id: $scope.id, validity: vm.isFormValid, dirty: true });
            }
        }

        $scope.$on("sit-property-validator.buttonEnableDisable", function (event, propertyGridEvnt) {    //List for a change in the button            
            if (propertyGridEvnt.originalValue === propertyGridEvnt.value && arr.indexOf(propertyGridEvnt.guid) !== -1) {
                arr.splice(arr.indexOf(propertyGridEvnt.guid), 1);
            }
            else if (propertyGridEvnt.originalValue !== propertyGridEvnt.value && arr.indexOf(propertyGridEvnt.guid) === -1) {
                arr.push(propertyGridEvnt.guid);
            }

            if (arr.length === 0 ) {
                $scope.$emit('sit-property-grid.validity-changed', { id: $scope.id, validity: vm.isFormValid, dirty: true });
            }
            else if (arr.length > 0 && vm.isFormValid) {
                $scope.$emit('sit-property-grid.validity-changed', { id: $scope.id, validity: vm.isFormValid, dirty: false });
            }

        });
    }
})();
(function () {
    'use strict';

    /**
    * @ngdoc directive
    * @access internal
    * @name sitPropertyGridLayout
    * @module siemens.simaticit.common.widgets.propertyGrid
    * @description 
    * _(Internal)_ Directive called to generate the property-grid in configured layout display mode.
    * @usage
    * This directive should be used only by the property-grid.
    */
    /*
    * @param {string} mode Display mode of the data (Read, Edit, Add)
    * @param {object} data (optional) Contains content of the directive
    * @param {string} id Contains identifier of the property-grid
    */
    angular.module('siemens.simaticit.common.widgets.propertyGrid').directive('sitPropertyGridLayout', PropertyGridLayoutDirective);

    PropertyGridLayoutDirective.$inject = ['$compile', 'common.widgets.propertyGrid.service'];
    function PropertyGridLayoutDirective($compile, propertyGridService) {
        return {
            scope: {
                data: "=?sitData",
                mode: "@sitMode",
                id: "@sitId"
            },
            bindToController: {
                data: "=?sitData",
                mode: "@sitMode",
                id: "@sitId"
            },
            controllerAs: 'sitPropertyGridLayoutCtrl',
            controller: PropertyGridLayoutController,
            require: "^sitPropertyGrid",
            restrict: 'E',
            link: function (scope, element, attrs, sitPropertyGridCtrl) {
                var html = '';
                var currentForm, formValidity;
                function formToWatch() {
                    if (undefined !== currentForm) {
                        formValidity = currentForm.$valid;
                    }
                    return formValidity;
                }


                function calcFlexBasis(width) {
                    if (width >= 1366) {
                        return '25%';
                    }
                    else if (width >= 768) {
                        return '33%';
                    }
                    else if (width >= 320) {
                        return '50%';
                    }
                    else {
                        return '100%';
                    }
                }
                function propertyGridCreation(scope, attrs, element, pgCtrl) {
                    if (scope.mode === 'edit') {
                        formValidity = false;
                        if (pgCtrl.transclusionIsSet === true) {
                            html = "<div></div>";
                            element.html($compile(html)(scope));
                            currentForm = scope.$parent['Form' + scope.id];
                        } else {
                            html = propertyGridService.createPropertyGridLayoutHtml(scope.data, pgCtrl.layout, pgCtrl.type, false);
                            html = "<form name='Form" + scope.id + "'>" + html + "</form>";
                            element.html('');
                            scope['Form' + scope.id] = undefined;
                            element.html($compile(html)(scope));
                            currentForm = scope['Form' + scope.id];
                        }
                        formToWatch();
                        scope.$watch(formToWatch, function (newValue) {
                            //Set the parent property isFormValid
                            pgCtrl.setValidity(newValue);
                        }, false);
                    }
                    else {
                        if (pgCtrl.transclusionIsSet === true) {
                            html = "<div></div>";
                        }
                        else {
                            html = propertyGridService.createPropertyGridLayoutHtml(scope.data, pgCtrl.layout, pgCtrl.type, true);
                        }
                        element.html($compile(html)(scope));
                    }

                    if (pgCtrl.layout.toUpperCase() === 'HORIZONTAL' && pgCtrl.type.toUpperCase() === 'FLUID') {
                        var propertyGridWidth = element.width();
                        var flexX = calcFlexBasis(propertyGridWidth);
                        element.find('div.property-fluid').css('flex-basis', flexX);
                    }
                }

                propertyGridCreation(scope, attrs, element, sitPropertyGridCtrl);

                var propertyLabels = element.find('span[class="property-label-ellipsis"]');

                function onMouseEnterEvent() {
                    var propertyLabel = $(this);
                    if (this.offsetWidth < this.scrollWidth) {
                        propertyLabel.attr("title", propertyLabel.html());
                    } else {
                        propertyLabel.removeAttr("title");
                    }
                }

                propertyLabels.on("mouseenter", onMouseEnterEvent);

                scope.$watch(
                    function () { return scope.data; },
                    function (oldV, newV) {
                        if (oldV === newV) { return; }
                        propertyGridCreation(scope, attrs, element, sitPropertyGridCtrl);
                    }
                );
                scope.$on("$destroy", function () {
                    propertyLabels.off("mouseenter", onMouseEnterEvent);
                });
            }
        };
    }
    function PropertyGridLayoutController() { }

})();
/*jshint -W098 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name propertyGridService
     * @module siemens.simaticit.common.widgets.propertyGrid
     * @access internal
     * @description Contains several methods to generate the HTML equivalent for the property-grid. 
     */
    angular.module('siemens.simaticit.common.widgets.propertyGrid').service('common.widgets.propertyGrid.service', PropertyGridService);
    
    function PropertyGridService() {

        this.createPropertyGridLayoutHtml = createPropertyGridLayoutHtml;

        var containerClass = {
            'Vertical': 'property',
            'Horizontal-Fixed': 'property',
            'Horizontal-Fluid': 'property-fluid'
        };

        var labelClass = {
            'Vertical': 'vertical-property-grid-control-label',
            'Horizontal-Fixed': 'property-grid-col-label-fixed',
            'Horizontal-Fluid': 'property-grid-col-label-fluid'
        };

        var valuesClass = {
            'Horizontal-Fixed': 'property-grid-col-value-fixed',
            'Horizontal-Fluid': 'property-grid-col-value-fluid'
        };

        /**
         * @ngdoc method
         * @name propertyGridService#createPropertyGridLayoutHtml
         * @module siemens.simaticit.common.widgets.propertyGrid
         * @access internal
         * @description Creates an HTML template for the Property Grid with given data, layout and display mode 
         * 
         * @param {Object} data Contains data used to generate the HTML template.
         * @param {String} layout Specifies the layout in which Property Grid is to be displayed.
         * @param {String} type Specifies the layout type in which Property Grid is to be displayed.
         * @param {Boolean} isViewMode Specifies the display mode in which Property Grid is to be displayed.
         *
         * @returns {String}  HTML string to be compiled by the `sitPropertyGridLayout` directive.
         * 
         */
        function createPropertyGridLayoutHtml(data, layout, type, isViewMode) {
            var concat = "";

            angular.forEach(data, function (widgetObject, key) {
                if (!widgetObject.invisible) {
                    concat += "<div class='" + getPropertyContainerClass(layout, type) + "'>";

                    concat += "<div class='" + getPropertyLabelClass(layout, type) + "'>";
                    concat += generatePropertyGridLabel(widgetObject);
                    concat += "</div>";

                    concat += "<div class='" + getPropertyValueClass(layout, type) + "'>";
                    concat += generatePropertyGridValue(widgetObject, "data[" + key + "]", isViewMode);
                    concat += "</div>";

                    concat += "</div>";
                }
            });
            return concat;
        }

        function getPropertyContainerClass(layout, type) {
            if (layout === 'Vertical') {
                return containerClass[layout];
            }
            return containerClass[layout + '-' + type];
        }

        function getPropertyLabelClass(layout, type) {
            if (layout === 'Vertical') {
                return labelClass[layout];
            }
            return labelClass[layout + '-' + type];
        }

        function generatePropertyGridLabel(widget) {
            var widgetLabel = "";

            if (widget.invisible)
            { return ''; }

            if (angular.isDefined(widget.label) && widget.label) {
                widgetLabel = "<span class='property-label-ellipsis'>" + widget.label + "</span>" + (widget.validation && widget.validation.required ? ':<span class="asterisk">*</span>' : ':');
            } else {
                widgetLabel = "Label undefined";
            }

            return widgetLabel;
        }

        function getPropertyValueClass(layout, type) {
            return valuesClass[layout + '-' + type];
        }

        function generatePropertyGridValue(widget, dataToBind, isViewMode) {
            var concat = "";
            //Alone widget
            if (!angular.isArray(widget.widget)) {
                var read_only = isViewMode || widget.read_only || false;
                var disabled = widget.disabled;

                if (widget.widget !== 'sit-entity-picker') {
                    var type = "sit-text";
                    var temp = widget.label || widget.id || widget.name;
                    var idName = temp.replace(/ /g, '').toLowerCase();
                    var id = widget.id || idName;
                    var name = widget.name || idName;

                    //identify the widget type
                    var typeo = typeof (widget.value);

                    switch (typeo) {
                        case "number":
                            type = "sit-numeric";
                            break;
                        case "string":
                            if (widget.value.length > 80) {
                                type = "sit-textarea";
                            }
                            break;
                        case "boolean":
                            type = "sit-checkbox";
                            widget.value = [{ label: "", checked: widget.value }];
                            break;
                        case "object":
                            if (angular.isDate(widget.value)) {
                                type = "sit-datepicker";
                            }
                            break;
                        default:
                            break;
                    }
                    
                    concat += "<" + (widget.widget || type) + " ";

                    concat += "sit-name='" + name + "' ";
                    concat += "sit-value='" + dataToBind + ".value' ";
                    concat += "sit-validation='" + dataToBind + ".validation' ";
                    concat += "ng-readonly='" + read_only + "' ";
                    concat += "class='property-grid-input-group' ";
                    concat += "ng-model='" + dataToBind + ".value' ";
                    concat += "ng-disabled='" + disabled + "'";
                    angular.forEach(widget.widgetAttributes, function (value, key) {
                        var angularKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                        if (widget.widget === 'sit-time-picker' && angularKey==='show-meridian') {
                            concat += angularKey + "='" + dataToBind + ".widgetAttributes." + key + "' ";
                        } else {
                            concat += "sit-" + angularKey + "='" + dataToBind + ".widgetAttributes." + key + "' ";
                        }
                    });
                    if ((widget.widgetAttributes) && (widget.widgetAttributes.hasOwnProperty('accept'))) {
                        concat += "accept='" + dataToBind + ".widgetAttributes.accept' ";
                    }

                    concat += ">";
                    concat += "</" + (widget.widget || type) + ">";
                } else if (widget.widget === 'sit-entity-picker') {

                    concat += "<sit-entity-picker" + " ";
                    concat += "sit-id='" + dataToBind + ".id' ";
                    concat += "sit-name='" + dataToBind + ".widgetAttributes.name' ";
                    concat += "sit-datasource='" + dataToBind + ".widgetAttributes.datasource' ";
                    concat += "sit-value='" + dataToBind + ".value' ";
                    concat += "sit-selected-object='" + dataToBind + ".widgetAttributes.selectedObject' ";
                    concat += "sit-validation='" + dataToBind + ".validation' ";
                    concat += "sit-placeholder='" + dataToBind + ".widgetAttributes.placeholder' ";
                    concat += "sit-selected-attribute-to-display='" + dataToBind + ".widgetAttributes.selectedAttributeToDisplay' ";
                    concat += "sit-picker-options='" + dataToBind + ".widgetAttributes.pickerOptions' ";
                    concat += "sit-change='" + dataToBind + ".widgetAttributes.change' ";
                    concat += "ng-readonly='" + read_only + "' ";
                    concat += "ng-disabled='" + disabled + "'";
                    concat += "class='property-grid-input-group' ";
                    concat += ">";
                    concat += "</sit-entity-picker" + ">";
                }
            } else {  //in array
                //var concat = "";
                concat += "<div class='property-grid-input-group'>";
                angular.forEach(widget.widget, function (widget, key) {

                    if (widget.widgetAttributes === undefined || widget.widgetAttributes.type !== 'checkbox') {
                        concat += "<span class='property-grid-span-group-inline'>"; //Display controls on the same line
                        concat += "<div style='display: table; width: 100%; height: 100%'>";
                        concat += generatePropertyGridValue(widget, dataToBind + ".widget[" + key + "]", isViewMode);
                        concat += "</div>";

                    }
                    else {
                        concat += "<span class='property-grid-span-group-block ";  //One line by control
                        if (!(isViewMode || widget.read_only)) {
                            concat += "validator-control";
                        }
                        concat += "'>";
                        concat += generatePropertyGridValue(widget, dataToBind + ".widget[" + key + "]", isViewMode);
                    }

                    concat += "</span>";
                });
                concat += "</div>";
            }
            return concat;
        }
    }
})();
/*
 * Copyright (C) Siemens AG 2015.
 * All Rights Reserved. Confidential.
 * 
 * Descr.: 
 * Element directive which prepares a widget for sit-property 
 * 
 * Authors: Suneel Korada (Suneel.Korada@siemens.com)
 *
 */

(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.propertyGrid').directive('sitPropertyItem', PropertyItemDirective);
    PropertyItemDirective.$inject = ['$compile'];
    function PropertyItemDirective($compile) {
        var sitPropertyItem = {
            restrict: 'E',
            bindToController: {
                widget: '@sitWidget',
                name: '@sitName',
                value: '=?sitValue',
                validation: '=?sitValidation',
                readOnly: '=?sitReadOnly',
                placeholder: '=?sitPlaceholder',
                limit: '=?sitLimit',
                templateUrl: '=?sitTemplateUrl',
                selectedAttributeToDisplay: '=?sitSelectedAttributeToDisplay',
                options: '=?sitOptions',
                toDisplay: '=?sitToDisplay',
                toKeep: '=?sitToKeep',
                sitDatasource: '=?',
                sitSelectedObject: '=?',
                sitEditable: '=?',
                accept: '=?accept',
                minSize: '=?sitMinSize',
                maxSize: '=?sitMaxSize',
                sitSelectedString: '=?',
                sitSplitList: '=?',
                sitDoneCallback: '=?',
                format: '=?sitFormat',
                appendToBody: '=?sitAppendToBody',
                showButtonBar: '=?sitShowButtonBar',
                showWeeks: '=?sitShowWeeks',
                showMeridian: '=?sitShowMeridian',
                widgetAttributes: '=?sitWidgetAttributes',
                ngRequired: '@?',
                ngBlur: '&?',
                sitChange: '=?',
                sitRequired: '=?',
                ngDisabled: '=?',
                ngFocus: '&?',
                ngReadonly: '=?',
                sitId: '=?'
            },
            scope: true,
            controller: PropertyItemController,
            controllerAs: 'PropertyItemCtrl',
            link: {
                pre: preLinkFn
            }
        };

        function preLinkFn(scope, element, attrs, ctrl) {
            var widgetTag = ' sit-name="{{PropertyItemCtrl.name}}"' + 'sit-id="propertyCtrl.sitId"' +
                    ' sit-show-button-bar="PropertyItemCtrl.showButtonBar"' +
                    ' sit-read-only="PropertyItemCtrl.readOnly" sit-value="PropertyItemCtrl.value" ng-model="PropertyItemCtrl.value" sit-validation="PropertyItemCtrl.validation"' +
                    ' sit-options="PropertyItemCtrl.options" sit-to-display="PropertyItemCtrl.toDisplay" sit-to-keep="PropertyItemCtrl.toKeep"' +
                    ' sit-datasource="PropertyItemCtrl.sitDatasource" sit-limit="PropertyItemCtrl.limit" sit-editable="PropertyItemCtrl.sitEditable"' +
                    ' accept = "{{PropertyItemCtrl.accept}}" sit-min-size = "{{PropertyItemCtrl.minSize}}" sit-max-size = "{{PropertyItemCtrl.maxSize}}"' +
                    ' sit-selected-string="PropertyItemCtrl.sitSelectedString" sit-split-list="PropertyItemCtrl.sitSplitList" sit-done-callback="PropertyItemCtrl.sitDoneCallback()"' +
                    ' sit-placeholder="PropertyItemCtrl.placeholder" sit-selected-object="PropertyItemCtrl.sitSelectedObject" sit-selected-attribute-to-display="PropertyItemCtrl.selectedAttributeToDisplay" sit-template-url="PropertyItemCtrl.templateUrl"' +
                    ' sit-format="PropertyItemCtrl.format" sit-append-to-body="PropertyItemCtrl.appendToBody" sit-show-button-bar="PropertyItemCtrl.showButtonBar" sit-show-weeks="PropertyItemCtrl.showWeeks" sit-show-meridian="PropertyItemCtrl.showMeridian"' +
                    ' ng-required="PropertyItemCtrl.ngRequired" ng-blur="PropertyItemCtrl.ngBlur()" sit-change="PropertyItemCtrl.sitChange" ng-disabled="PropertyItemCtrl.ngDisabled" ng-focus="PropertyItemCtrl.ngFocus()"' +
                    ' ng-readonly="PropertyItemCtrl.ngReadonly" class="' + attrs.class + '"';

            if (attrs.sitWidget === 'sit-entity-picker') {
                widgetTag += ' sit-required="PropertyItemCtrl.sitRequired"';
            }


            widgetTag = '<' + attrs.sitWidget + widgetTag + '></' + attrs.sitWidget + '>';
            widgetTag = angular.element(widgetTag);

            if ('' !== attrs.sitWidgetAttributes && undefined !== attrs.sitWidgetAttributes && ctrl.widgetAttributes) {

                for (var i = 0, attrArray = Object.keys(ctrl.widgetAttributes), len = Object.keys(ctrl.widgetAttributes).length; i < len; i++) {
                    var value = 'PropertyItemCtrl.widgetAttributes["' + attrArray[i] + '"]';
                    widgetTag.attr(attrArray[i], value);
                }
            }

            widgetTag = $compile(widgetTag)(scope);
            element.append(widgetTag);
        }

        return sitPropertyItem;
    }

    function PropertyItemController() { }

})();