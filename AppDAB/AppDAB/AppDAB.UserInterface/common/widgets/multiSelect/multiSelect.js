/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/**
 * @ngdoc module
 * @name siemens.simaticit.common.widgets.multiSelect
 * @description
 * Contains UI elements that let a user select mulitple items from a bootstrap-style dropdown
 * 
 * Depends on the following modules:
 * * **ui.bootstrap**
 */
(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.multiSelect', ['ui.bootstrap']);

})();
(function () {
    'use strict';
    angular.module('siemens.simaticit.common.widgets.multiSelect').directive('sitMultiSelect', MultiSelectDirective);
    function MultiSelectDirective() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                readOnly: '=sitReadOnly',
                sitOptions: '=sitOptions',
                sitSelectedString: '=',
                sitSplitList: '=',
                sitPlaceholder: '=sitPlaceholder',
                sitDoneCallback: '&',
                validation: '=sitValidation',
                ngBlur: '&?',
                sitChange: '=?',
                ngDisabled: '=?',
                ngFocus: '&?',
                ngReadonly: '=?'
            },
            templateUrl: 'common/widgets/multiSelect/sit-multi-select.html',
            controllerAs: 'ctrl',
            controller: MultiSelectController,
            link: function (scope, element, attr, ctrl) {
                ctrl.isFalsy = function (selectable) {
                    return !selectable.selected;
                };

                // TODO?
                function selectDropDown() {
                    // build the comma-delimited string of selected items
                    //var selectedObjs = scope.sitOptions.filter(function (selectable) { return selectable.selected; });

                    //scope.sitSelectedString = selectedObjs.map(function (selectable) { return selectable.id; }).join();
                    ctrl.updateSelectedString();
                    if (ctrl.sitDoneCallback) {
                        ctrl.sitDoneCallback();
                    }
                }

                // TODO?
                $('.multi-select-dropdown').on('hidden.bs.dropdown', selectDropDown);

                scope.$on('$destroy', function () {
                    $('.multi-select-dropdown').off('hidden.bs.dropdown', selectDropDown);
                });
            }
        };
    }
    MultiSelectController.$inject = ['$translate'];
    /**
    * @ngdoc directive
    * @name sitMultiSelect
    * @module siemens.simaticit.common.widgets.multiSelect
    * @description 
    * Displays a multi-selection control. 
    *
    * @usage 
    * As an element:
    * ```
    *     <sit-multi-select
                       sit-options="vm.selectValues"
                       sit-selected-string="vm.value"
                       sit-split-list="vm.splitListVisibility"
                       sit-placeholder="vm.placeHolder"
                       sit-done-callback="vm.doneCallBack"
                       ng-blur="ngBlur" ng-change="ngChange" ng-disabled="ngDisabled" ng-focus="ngFocus" ng-readonly="ngReadonly">
          </sit-multi-select>
    * ```
    * @restrict E
    * 
    * @param {Object[]} sit-options Specifies the array of items available for selection. Each item is an object containing following fields:
    * * **id**: Unique string value which specifies the item in the dropdown.
    * * **name**: The string value displayed for an item in the dropdown.
    * @param {string} sit-selected-string Contains comma-seperated string of selected item IDs (Initialized to "").
    * @param {boolean} sit-split-list Specifies whether a seperator is displayed between selected items and un-selected items.If value is true, seperator is displayed. Otherwise, seperator is not displayed.
    * @param {string} sit-placeholder Specifies the initial text to be displayed before user selects the items in the dropdown. 
    * @param {Function} sit-done-callback Specifies the callback function to be called after dropdown is hidden from the user. 
    * @param {ValidationModel} sit-validation See {@link ValidationModel}.
    * @param {string} [ng-blur] _(Optional)_ An expression to evaluate on blur event.
    * @param {string} [sit-change] _(Optional)_ An expression to evaluate on change of value.
    * @param {string} [ng-disabled] _(Optional)_ If this expression is truthy, the element will be disabled.
    * @param {string} [ng-focus] _(Optional)_ An expression to evaluate on focus event.
    * @param {string} [ng-readonly] _(Optional)_ If this expression is truthy, the element will be set as read-only.
    *  
    * 
    * @example
	* In a view template, the **sit-multi-select** directive is used as follows:
	* 
	* ```
	* <sit-multi-select
                       sit-options="vm.selectValues"
                       sit-selected-string="vm.value"
                       sit-split-list="vm.splitListVisibility"
                       sit-placeholder="vm.placeHolder"
                       sit-done-callback="vm.doneCallBack">
          </sit-multi-select>
    * ```
    * 
    */
    function MultiSelectController($translate) {
        var ctrl = this;
        ctrl.toggleSelected = toggleSelected;
        ctrl.toggleDirection = toggleDirection;
        ctrl.getSelectedText = getSelectedText;
        ctrl.updateSelectedString = updateSelectedString;
        //ctrl.logger = logger.getModuleLogger('siemens.simaticit.common.widgets.filter');
        function toggleSelected($event, selectable) {
            $event.stopPropagation();//.preventDefault();
            selectable.selected = !selectable.selected;
            ctrl.updateSelectedString();
        }
        function toggleDirection($event, selectable) {
            $event.stopPropagation();
            selectable.direction = (selectable.direction === 'desc') ? 'asc' : 'desc';
        }
        function getSelectedText() {
            var selCount = 0;
            var selDisplayName = '';
            ctrl.sitOptions.forEach(function (selectable) {
                if (selectable.selected) {
                    selCount++;
                    selDisplayName = selectable.name;
                }
            });
            if (selCount === 0) {
                return ctrl.sitPlaceholder;
            } else if (selCount === 1) {
                return selDisplayName;
            } else if (selCount > 1) {
                // MEN - this may be a good use for ngMessageFormat, but documentation is still very weak...
                return selCount + ' ' + $translate.instant('common.selected');
            }
        }

        /**
         * bug 13061
         * If using this in the sitFilter directive, and you click the Apply button before closing
         * the dropdown (by clicking anywhere else) the Apply handler executes before the handler for the
         * dropdown closing(defined in link function below). The 'hidden.bs.dropdown' handler normally updates 
         * the selectedString based on current selections. That is all that is need if you close the dropdown
         * before clicking Apply. But if you click Apply with dropdown open, the the selectedString value used
         * in the filter may not reflect current selections. So, simple workaround is to refresh it each
         * time the user changes selection. 
         */
        function updateSelectedString() {
            // build the comma-delimited string of selected items
            var selectedObjs = ctrl.sitOptions.filter(function (selectable) { return selectable.selected; });
            ctrl.sitSelectedString = selectedObjs.map(function (selectable) { return selectable.id; }).join();

        }

    }
})();
