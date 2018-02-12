/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */

(function () {
    'use strict';

    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.entityPicker
    * 
    * @description
    * This module provides functionalities for selecting entities from a predefined list of entities.
    */

    angular.module('siemens.simaticit.common.widgets.entityPicker', []);

})();
/*jshint -W098 */
(function () {
    'use strict';

    var app = angular.module('siemens.simaticit.common.widgets.entityPicker');

    /**
    * @ngdoc directive
    * @name sitEntityPicker
    * @module siemens.simaticit.common.widgets.entityPicker
    * @description 
	* The **entitypicker** is a widget that is used to select an entity from a predefined list of entities. The widget makes it possible to 
    * select the entity that matches the first character or characters entered by the user.
	*
	* @usage 
    * As an element:
    * ```
    * <sit-entity-picker sit-id="entityPickerID" sit-datasource="datasource" sit-template-url="'customTemplate.html'" sit-limit="limit"
    *        sit-placeholder="placeholder" sit-selected-attribute-to-display="selectedAttributeToDisplay"
    *        sit-selected-object="selectedObject" sit-editable="editable" sit-validation="validation"
    *        ng-blur="ngBlur" ng-change="ngChange" ng-disabled="ngDisabled" ng-focus="ngFocus" ng-readonly="ngReadonly">
    * </sit-entity-picker>
    * ```
    * @restrict E
	*
    * @param {Array} sit-datasource List of entities available for the entity picker.
    * @param {String} sit-templateUrl _(Optional)_ Path to the template used to render the list of entities (applies for each entity).
    * If not specified, a default template is applied to display the **sit-selectedAttributeToDisplay** attribute.
    * @param {String} [sit-selected-attribute-to-display=name] _(Optional)_ Attribute to be displayed in the field when an entity is selected.
    * @param {Object} [sit-selected-object=name] _(Optional)_ Default entity selected when the page is loaded. Updated when the user selects another entity. 
    * @param {String} sit-value Value of the entity picker widget
    * @param {Number} [sit-limit=8] _(Optional)_ Maximum number of entities to be displayed.
    * @param {Bool} [sit-editable=false] _(Optional)_ Specifies if the user is allowed to enter an entity that is not available in the list.
    * @param {String} [sit-placeholder=Find an entity (translated)] _(Optional)_ Text displayed in the **entityPicker** control before it is active.
	* @param {String} sit-id Unique identifier of the entity picker.
    * @param {ValidationModel} sit-validation See {@link ValidationModel}.
    * @param {string} [ng-blur] _(Optional)_ An expression to evaluate on blur event.
    * @param {string} [sit-change] _(Optional)_ An expression to evaluate on change of value.
    * @param {string} [ng-disabled] _(Optional)_ If this expression is truthy, the element will be disabled.
    * @param {string} [ng-focus] _(Optional)_ An expression to evaluate on focus event.
    * @param {string} [ng-readonly] _(Optional)_ If this expression is truthy, the element will be set as read-only.
    * @param {Bool} sit-read-only Specifies if the property is editable.
    * @param {Bool} sit-required _(Deprecated)_ Specifies if the property is mandatory or not. **Note:** If ctrl.sitValidation.required is defined, it will override ctrl.sitRequired value. (default:false)
    * @param {Object} sit-picker-options _(Optional)_ If linked to an {@link ICVOptions} object, the entity picker displays a button, which opens an Item Collection Viewer, where the user can select an item.
    * 
    * 
	* @example
	* In a view template, the `sit-entity-picker` directive is used as follows:
	* 
	* ```
	* <sit-entity-picker sit-id="entityPickerID" sit-datasource="vm.datasource" sit-template-url="'customTemplate.html'">
    * </sit-entity-picker>
	* ```
	* 
	* The following example shows how to add 3 recipes by defining them in the `datasource` property. Each recipe object contains properties which includes the name, version, 
    * product, and status of the recipe:
	*
	* ```
	*[
    *{
    *     name: "Recipe01",
    *     version: "01.01",
    *     product: "Aspirin",
    *     status: "Approved"
    * },
    * {
    *     name: "Recipe02",
    *     version: "01.01",
    *     product: "Dolipran",
    *     status: "Approved"
    * },
    * {
    *     name: "Recipe03",
    *     version: "01.01",
    *     product: "vaccine",
    *     status: "In editing"
    * }
	*];
	*```
	* 
	* The following example defines how the recipe list is rendered (by default, the recipe name is displayed for each recipe). To perform this rendering activity, 
    * the template must be defined in the file referenced in the sit-templateUrl attribute as follows: 
	
	*
	* ```
	*<a>
    *<div>
    *    <div>
    *        <span ng-bind-html="match.model.name | uibTypeaheadHighlight:query">
    *        </span>
    *    </div>
    *    <div>
    *        <div>
    *            <label> version: </label>
    *            <label ng-bind-html="match.model.version | uibTypeaheadHighlight:query"> </label>
    *        </div>
    *        <div>
    *            <label> product: </label>
    *            <label ng-bind-html="match.model.product | uibTypeaheadHighlight:query"></label>
    *        </div>
    *        <div>
    *            <label> status: </label>
    *            <label ng-bind-html="match.model.status | uibTypeaheadHighlight:query"></label>
    *        </div>
    *    </div>
    *</div>
    *</a>
	* ```
	* 
	*The tag `<a>` makes it possible to select a recipe with up arrow and down arrow keys. 
    The **uibTypeaheadHighlight:query** plugin makes it possible to highlight the character or characters specified by the user in the list. 
	*
	* If the developer does not specify the sit-template-url attribute then a default template defined as follows will be used.
	* ```
	* <a class="aClass">
    * <div>
    *   <span class="highlighted" ng-bind-html="match.label | uibTypeaheadHighlight:query">
    *   </span>
    * </div>
    *</a>
    * ```

    **/
    function sitEntityPicker($filter, $translate) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                id: "=?sitId",
                readOnly: '=?sitReadOnly',
                datasource: "=?sitDatasource",
                templateUrl: "=?sitTemplateUrl",
                selectedAttributeToDisplay: "=?sitSelectedAttributeToDisplay",
                selectedObject: "=?sitSelectedObject",
                value: "=?sitValue",
                limit: "=?sitLimit",
                editable: "=?sitEditable",
                placeholder: "=?sitPlaceholder",
                validation: "=?sitValidation",
                sitoption: "=?sitPickerOptions",
                ngBlur: '&?',
                sitChange: '=?',
                ngDisabled: '=?',
                ngFocus: '&?',
                ngReadonly: '=?',
                required: '=?sitRequired'
            },
            controller: EntityPickerController,
            controllerAs: 'entityPickerCtrl',
            templateUrl: 'common/widgets/entityPicker/entityPicker.html'
        };
    }
    EntityPickerController.$inject = ['$scope', '$translate', 'common', 'LOG_TYPES', 'LOG_LEVELS', '$filter', '$window', '$timeout', 'common.widgets.dialog.service'];
    function EntityPickerController($scope, $translate, common, LOG_TYPES, LOG_LEVELS, $filter, $window, $timeout, dialogService) {

        var globalDialogService = common.globalDialog;
        var vm = this;
        var WIDGET_HEIGHT = 50;
        var searchText = '';
        $scope.$watch('entityPickerCtrl.datasource', function (newValue, oldValue) {
            vm.icvObject.data = newValue;
        });

        $scope.$watch('entityPickerCtrl.value', function (val) {
            if (!val) {
                vm.selectedObject = null;
                $scope.$emit('sit-entity-picker.input-blanked', { item: vm.value, selected: vm.selectedObject });
            }

        })

        $scope.$on('sit-item-collection-viewer.data-search-completed', function () {
            var flag = false;
            $timeout(function () {
                var noDataContainer = $("#no-data-message-container")[0];
                if (noDataContainer) {
                    flag = false;
                } else {
                    flag = (vm.icvObject.options.getSelectedItems && vm.icvObject.options.getSelectedItems().length);
                }
                resetICVButtons(flag);
            });
        });
        var defaultValues = {
            limit: 8,
            selectedAttributeToDisplay: 'name',
            templateUrl: 'common/widgets/entityPicker/typeahead-default-template.html'
        };
        var logErrorFn = common.logger.getLogFn('siemens.unity.common.entityPicker.controller', LOG_TYPES.LOG_ERROR);
        if (vm.datasource === null || vm.datasource === undefined) {
            logErrorFn('datasource can\'t be null');
        }
        // Default placeholder if not present
        if (!vm.placeholder) {
            vm.placeholder = $filter('translate')('entityPicker.defaultPlaceHolder');
        }
        vm.dialogTitle = $filter('translate')('entityPicker.selectItem');

        // Default template if not present
        if ((vm.templateUrl === null) || (angular.isUndefined(vm.templateUrl))) {
            vm.templateUrl = defaultValues.templateUrl;
        }
        // If validation.required is present, it will override the value of required
        if (vm.validation && angular.isDefined(vm.validation.required)) {
            vm.required = vm.validation.required;
        }

            // Default value for required if validation.required and required not present

        else if ((vm.required === null) || (angular.isUndefined(vm.required))) {
            vm.required = false;
        }

        // Default value for editable if not present
        if ((vm.editable === null) || (angular.isUndefined(vm.editable))) {
            vm.editable = false;
        }

        // Default value for limit if not present
        if ((vm.limit === null) || (angular.isUndefined(vm.limit))) {
            vm.limit = defaultValues.limit;
        }

        // Default value for selectedAttributeToDisplay if not present 
        if ((vm.selectedAttributeToDisplay === null) || (angular.isUndefined(vm.selectedAttributeToDisplay))) {
            vm.selectedAttributeToDisplay = defaultValues.selectedAttributeToDisplay;
        }

        // Default value for limit if not present
        if ((vm.label === null) || (angular.isUndefined(vm.label))) {
            vm.label = '';
        }

        if (vm.value === undefined) {
            vm.value = vm.selectedObject;
        }

        vm.setDropDownHeight = function () {
            var MIN_COUNT = 4;
            var ITEM_HEIGHT = 30;
            var FOUR_ITEM_HEIGHT = 120;
            var i, entityPickerElement, elementOffset, ulElement, count, dropDownHeight;
            var entityPickerArray = $(".entity-picker-container");
            var elementsCount = entityPickerArray.length;
            for (i = 0; i < elementsCount; i++) {
                entityPickerElement = entityPickerArray[i];
                elementOffset = $(entityPickerElement).offset();
                ulElement = $(entityPickerElement).find('ul');
                count = $(entityPickerElement).find('li').length;
                dropDownHeight = $(window).height() - (elementOffset.top + WIDGET_HEIGHT);
                if ((count > MIN_COUNT) && (dropDownHeight < (MIN_COUNT * ITEM_HEIGHT))) {
                    ulElement.css('min-height', FOUR_ITEM_HEIGHT + 'px');
                }
                ulElement.css('max-height', dropDownHeight + 'px');
                ulElement.css('overflow', 'auto');
            }

        }
        vm.onSelect = function ($item, $model, $label) {
            vm.value = $model;
            vm.selectedObject = $model;
            $scope.$emit('sit-entity-picker.entity-selected', { item: $item, model: $model, label: $label });
        };

        //popups
        vm.modalId = $scope.$id + '_popupGrid';

        vm.showPopup = function () {
            var isObjectSelected = false;
            if (vm.value) {
                var searchObj = typeof vm.value === 'object' ? vm.value[vm.selectedAttributeToDisplay] : vm.value;
                var resFilter = $filter('filter')(vm.datasource, searchObj);
                if (resFilter.length > 0) {
                    resFilter[0].selected = true;
                    isObjectSelected = true;
                    vm.selectedObject = resFilter[0];
                }
            }
            var dialogData = {
                title: vm.dialogTitle,
                templatedata: vm.icvObject,
                templateuri: 'common/widgets/entityPicker/popup-default-template.html',
                buttons: vm.buttonsListICVGrid
            }
            globalDialogService.set(dialogData);
            globalDialogService.show();
            resetICVButtons(isObjectSelected);

            //if ((typeof resFilter === 'object') && (resFilter.length === 1)) {
            //    vm.sitoption.selectItems(resFilter, true, false); 
            //} else {
            //    vm.sitoption.selectAll(false);
            //}
        };

        function resetICVButtons(objectSelected) {
            if (objectSelected) {
                vm.buttonsListICVGrid[0].disabled = false;
            } else {
                vm.buttonsListICVGrid[0].disabled = true;
            }
        }

        vm.buttonsListICVGrid = [{
            id: $scope.$id + "_okButton",
            displayName: $translate.instant('entityPicker.select'),
            onClickCallback: function () {
                globalDialogService.hide();
                if (vm.sitoption) {
                    vm.selectedObject = vm.sitoption.getSelectedItems()[0];
                    vm.value = vm.selectedObject;
                    vm.selectedObject.selected = false;
                    $scope.$emit('sit-entity-picker.entity-selected', { item: vm.selectedObject, model: vm.selectedObject, label: vm.selectedObject[vm.selectedAttributeToDisplay] });
                }
                //reset sorting & filtering
            },
            disabled: false
        }, {
            id: $scope.$id + "_cancelButton",
            displayName: $translate.instant('entityPicker.cancel'),
            onClickCallback: function () {
                var selectedItems = vm.sitoption.getSelectedItems();
                if (selectedItems.length > 0) {
                    selectedItems[0].selected = false;
                }
                globalDialogService.hide();
                //reset sorting & filtering
                if (vm.icvObject && vm.icvObject.options && vm.icvObject.options.quickSearchOptions) {
                    vm.icvObject.options.quickSearchOptions.filterText = searchText;
                }
            },
            disabled: false
        }
        ];

        // viewerOptions configures how to show the data
        if (vm.sitoption) {
            vm.sitoption.selectionMode = 'single';
            vm.sitoption.viewMode = 'g';
            vm.sitoption.viewOptions = 'g';
            vm.sitoption.onSelectionChangeCallback = function (selectedItems, itemChanged) {
                if ((typeof selectedItems === 'object') && (selectedItems.length > 0)) {
                    if (vm.selectedObject) {
                        if (vm.selectedObject !== selectedItems[0]) {
                            vm.selectedObject.selected = false;
                        }
                    }
                    vm.buttonsListICVGrid[0].disabled = false;
                } else {
                    vm.buttonsListICVGrid[0].disabled = true;
                }
            };
            if (vm.sitoption && vm.sitoption.quickSearchOptions) {
                searchText = vm.sitoption.quickSearchOptions.filterText;
            }
        }

        vm.icvObject = {
            data: vm.datasource,
            options: vm.sitoption
        };
    }
    app.directive('sitEntityPicker', ['$filter', '$translate', sitEntityPicker]);
})();