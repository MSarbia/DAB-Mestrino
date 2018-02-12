/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/**
 * @ngdoc module
 * @name siemens.simaticit.common.widgets.filterBar
 * @access internal
 * @description
 * Provides functionalities related to defining filters.
 */
(function () {
	'use strict';

	angular.module('siemens.simaticit.common.widgets.filterBar', ['siemens.simaticit.common.widgets.switchButton', 'ui.bootstrap']);

})();
/*jshint -W117,-W098, -W027 */
(function () {
    'use strict';
    /**
 * @ngdoc directive
 * @module siemens.simaticit.common.widgets.filterBar 
 * @name sitFilterBar
 * @access internal
 * @requires $log  
 *
 * @restrict E
 *
 * @description
 * Provides a configurable UI for searching, filtering and grouping.
 * 
 * <em>  NOTE: This directive was created for internal use by the 
 *       {@link siemens.simaticit.common.widgets.itemCollectionViewer.sitItemCollectionViewer} directive.</em>
 *
 * @example
 * In a view template, you can use the **sitFilterBar** as follows:
 * ```
 *       <sit-filter-bar sit-filter-options="filterOptions"></sit-filter-bar>
 * ```
 * 
 * In the corresponding view controller, add a **filterOptions** object to the $scope
 * to define the options for the filter bar.
 * ```
 *  $scope.filterOptions = {
 *       currentGroupField: '',
 *       currentSortDirection: 'none',
 *       currentSortField: 'lastName',
 *       displayOptions: 'sqg', 
 *       onFilterClickCallback: null, //not currently supported
 *       groupByFields: ['lastName', 'country', 'gender'],
 *       onGroupChangeCallback: null,
 *       quickSearchField: 'lastName',
 *       onSearchChangeCallback: myQuickSearchHandler,
 *       sortByFields: ['lastName', 'country', 'gender'],
 *       sortByText: 'Sort By',
 *       onSortChangeCallback: mySortChangeHandler
 *  }
 * ```
 * @example
 * The default values for the sitFilterBar are as follows:
 * ```
 *  {
 *      currentGroupField: '',
 *      currentSortDirection: 'none',
 *      currentSortField: '',
 *      displayOptions: 'sqg', 
 *      onFilterClickCallback: null, 
 *      groupByFields: [],
 *      onGroupChangeCallback: null,
 *      quickSearchField: '',
 *      onSearchChangeCallback: null,
 *      sortByFields: [],
 *      sortByText: 'Sort By',
 *      onSortChangeCallback: null
 *  }
 * ```

 * @param {FilterOptions} filterOptions For a description of this object see {@link FilterOptions}
  */
    angular.module('siemens.simaticit.common.widgets.filterBar').directive('sitFilterBar', FilterBarDirective);

    function FilterBarDirective() {
        /**
* @ngdoc object
* @module siemens.simaticit.common.widgets.filterBar
* @name filterBarConfigurationDefaults
* @access internal
* @description
* An object defining the default values for the **filterOptions** parameter 
* of the {@link siemens.simaticit.common.widgets.filterBar} directive.
* 
* ```
*  {
*      currentGroupField: '',
*      currentSortDirection: 'none',
*      currentSortField: '',
*      displayOptions: 'sqg', 
*      onFilterClickCallback: null, 
*      groupByFields: [],
*      onGroupChangeCallback: null,
*      quickSearchField: '',
*      onSearchChangeCallback: null,
*      sortByFields: [],
*      sortByText: 'Sort By',
*      onSortChangeCallback: null
*  }
* ```
* 
* See {@link siemens.simaticit.common.widgets.filterBar.filterBarConfigurationDetails} for a description of all options.
*
*/
        var filterBarConfigurationDefaults = {
            currentGroupField: '',
            currentSortDirection: 'none',
            currentSortField: '',
            displayOptions: 'sqg', //(s)ort, (q)uick search, (f)ilter, (g)roup
            onFilterClickCallback: null, //not currently supporting
            groupByFields: [],
            onGroupChangeCallback: null,
            quickSearchField: '',
            onSearchChangeCallback: null,
            sortByFields: [],
            //sortByText: 'Sort By',
            onSortChangeCallback: null
        };

        /**
        * @ngdoc type
        * @module siemens.simaticit.common.widgets.filterBar
        * @name FilterOptions
        * @access internal
        * @description This provides a full description of the settings configured by the **filterOptions** parameter 
        * of the {@link siemens.simaticit.common.widgets.filterBar} directive.
        * @property {String} [currentGroupField=undefined]
         * 
         * Specifies the field to use for grouping data.  
         * 
         * The field must be one of the fields specified in the **groupByFields** property. 
         * The value is updated if the user changes the grouping field through the UI.
         * 
         * @property {String} [currentSortDirection='none']
         * 
         * Defines the current sorting direction.
         * 
         * Allowed values are **asc** and **desc**. (Not case sensitive)
         * The values are updated if the user changes the sort direction through the UI.
         * 
         * @property {String} [currentSortField=undefined]
         * 
         * Specifies the field to use for sorting data.
         * 
         * The field must be one of hte fields specified in the **sortByFields** property.
         * The value is updated if the user changes the sorting field through the UI.
         * 
         * @property {String} [displayOptions='sqg']
         * 
         * Defines the UI elements that are visible.
         * 
         * The value must be any combination of the following letter codes: (not case sensitive)
         * * **S**: Show sorting UI elements. This includes a dropdown list with field names and the asc/desc buttons.
         * * **Q**: Show the quick search input box. 
         * * **F**: Not currently supported. Intended for showing filtering UI.
         * * **G**: Show dropdown list of fields for grouping data.
         * 
         * @property {Function} [onFilterClickCallback=undefined]
         * 
         * Filtering not currently supported.
         * 
         * @property {String[]} [groupByFields=empty array]
         * 
         * Defines the fields that may be used for grouping data.
         * Format is an array of strings.
         * 
         * @property {Object[]} [groupByFields=empty array]
         * 
         * Alternate method to define the fields that may be used for grouping data.
         * Format is an array of objects.  Each object must have a <em>field</em> property and a <em>displayName</em> property that will be displayed to the user.
         * 
         * @property {Function} [onGroupChangeCallback=undefined]
         * 
         * Specifies the function to call when the user changes the group field.
         * 
         * @property {String} [quickSearchField=undefined]
         * 
         * Defines the field used with quick search functionality.
         * 
         * @property {Function} [onSearchChangeCallback=undefined]
         * 
         * Specifies the function to call when the user types into the quick search box.
         * 
         * @property {String[]} [sortByFields=empty array]
         * 
         * Defines the fields that may be used for sorting data.
         * Format is an array of strings.
         * 
         * @property {Object[]} [sortByFields=empty array]
         * 
         * Alternate method to define the fields that may be used for sorting data.
         * Format is an array of objects.  Each object must have a <em>field</em> property and a <em>displayName</em> property that will be displayed to the user.
         * 
         * @property {String} [sortByText='Sort By']
         * 
         * Text to use as a lable for the sort field dropdown list.
         * 
         * @property {Function} [onSortChangeCallback=undefined]
         * 
         * Specifies the function to call when the user changes the sort field.
        */


        /**
         * @ngdoc object
         * @module siemens.simaticit.common.widgets.filterBar
         * @name filterBarConfigurationDetails
         * @access internal
         * @description
         * This provides a full description of the settings configured by the **filterOptions** parameter 
         * of the {@link siemens.simaticit.common.widgets.filterBar} directive.
         * 
         *
         * @property {String} [currentGroupField=undefined]
         * 
         * Specifies the field to use for grouping data.  
         * 
         * The field must be one of the fields specified in the **groupByFields** property. 
         * The value is updated if the user changes the grouping field through the UI.
         * 
         * @property {String} [currentSortDirection='none']
         * 
         * Defines the current sorting direction.
         * 
         * Allowed values are **asc** and **desc**. (Not case sensitive)
         * The values are updated if the user changes the sort direction through the UI.
         * 
         * @property {String} [currentSortField=undefined]
         * 
         * Specifies the field to use for sorting data.
         * 
         * The field must be one of hte fields specified in the **sortByFields** property.
         * The value is updated if the user changes the sorting field through the UI.
         * 
         * @property {String} [displayOptions='sqg']
         * 
         * Defines the UI elements that are visible.
         * 
         * The value must be any combination of the following letter codes: (not case sensitive)
         * * **S**: Show sorting UI elements. This includes a dropdown list with field names and the asc/desc buttons.
         * * **Q**: Show the quick search input box. 
         * * **F**: Not currently supported. Intended for showing filtering UI.
         * * **G**: Show dropdown list of fields for grouping data.
         * 
         * @property {Function} [onFilterClickCallback=undefined]
         * 
         * Filtering not currently supported.
         * 
         * @property {String[]} [groupByFields=empty array]
         * 
         * Defines the fields that may be used for grouping data.
         * Format is an array of strings.
         * 
         * @property {Object[]} [groupByFields=empty array]
         * 
         * Alternate method to define the fields that may be used for grouping data.
         * Format is an array of objects.  Each object must have a <em>field</em> property and a <em>displayName</em> property that will be displayed to the user.
         * 
         * @property {Function} [onGroupChangeCallback=undefined]
         * 
         * Specifies the function to call when the user changes the group field.
         * 
         * @property {String} [quickSearchField=undefined]
         * 
         * Defines the field used with quick search functionality.
         * 
         * @property {Function} [onSearchChangeCallback=undefined]
         * 
         * Specifies the function to call when the user types into the quick search box.
         * 
         * @property {String[]} [sortByFields=empty array]
         * 
         * Defines the fields that may be used for sorting data.
         * Format is an array of strings.
         * 
         * @property {Object[]} [sortByFields=empty array]
         * 
         * Alternate method to define the fields that may be used for sorting data.
         * Format is an array of objects.  Each object must have a <em>field</em> property and a <em>displayName</em> property that will be displayed to the user.
         * 
         * @property {String} [sortByText='Sort By']
         * 
         * Text to use as a lable for the sort field dropdown list.
         * 
         * @property {Function} [onSortChangeCallback=undefined]
         * 
         * Specifies the function to call when the user changes the sort field.
         * 
         */
        var filterBarConfigurationDetails = {
        };
        return {
            restrict: 'E',
            bindToController: {
                filterOptions: '=sitFilterOptions'
            },
            scope: {},
            link: function (scope, element, attr, ctrl) {
                ctrl.quickSearchTextChanged = quickSearchTextChanged;
                // debounce so we don't re-filter the data until the user stops typing
                var changeQuickSearch = _.debounce(function (e) {
                    // have to use apply so Angular will know we made a change
                    scope.$apply(ctrl.doQuickSearch());
                }, 500);

                function quickSearchTextChanged() {
                    changeQuickSearch();
                }

                scope.$watch(function () {
                    return ctrl.filterOptions;
                }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ctrl.setDisplayOptions();
                        ctrl.groupSelectChange(ctrl.options.currentGroupField);
                    }
                    ctrl.setApiMethods();
                });
                scope.$on('sit-item-collection-viewer.quicksearch-text-changed', function (event, text) {
                    ctrl.quickSearchText = text;
                });
            },
            controller: FilterBarController,
            controllerAs: 'filterBarCtrl',
            templateUrl: 'common/widgets/filterBar/filter-bar.html'
        };
    }

    FilterBarController.$inject = ['$scope', 'common', 'LOG_TYPES'];

    function FilterBarController($scope, common, LOG_TYPES) {
        var vm = this;
        var logInfoFn = common.logger.getLogFn('FilterBar Widget', LOG_TYPES.INFO);
        var defaultOptions = {
            currentGroupField: '',
            currentSortDirection: 'none',
            currentSortField: '',
            displayOptions: 'sqg', //(s)ort, (q)uick search, (f)ilter, (g)roup
            onFilterClickCallback: null, //not currently supporting
            groupByFields: [],
            onGroupChangeCallback: null,
            quickSearchField: '',
            onSearchChangeCallback: null,
            sortByFields: [],
            onSortChangeCallback: null
        };

        function init() {
            vm.convertToObjects = convertToObjects;
            vm.setSelectedSort = setSelectedSort;
            vm.setDisplayOptions = setDisplayOptions;
            vm.filterButton = [{
                faIcon: 'fa-filter',
                selected: false,
                onClickCallback: function () { vm.onFilterClicked(); }
            }];
            vm.setSortDirection = setSortDirection;
            vm.onSortChanged = onSortChanged;
            vm.onFilterClicked = onFilterClicked;
            vm.groupSelectChange = groupSelectChange;
            vm.groupStatus = {
                isOpen: false,
                groupField: null
            };
            vm.itemSelected = itemSelected;
            /*Fix to Bug 20754:UI Framework - Item collection viewer: Quick Search default value is not visible*/
            vm.quickSearchText = vm.filterOptions.quickSearchText;
            vm.doQuickSearch = doQuickSearch;
            vm.getSortVisible = getSortVisible;
            vm.getSearchVisible = getSearchVisible;
            vm.getFilterVisible = getFilterVisible;
            vm.setFilterSelected = setFilterSelected;
            vm.getGroupVisible = getGroupVisible;
            vm.changeSort = changeSort;
            vm.getSearchText = getSearchText;
            vm.getGroupField = getGroupField;
            vm.getSortInfo = getSortInfo;
            vm.setApiMethods = setApiMethods;
        }

        function activate() {
            init();
            vm.setDisplayOptions();
            vm.groupSelectChange(vm.options.currentGroupField);
            vm.setApiMethods();
        }

        activate();

        function convertToObjects(arrayToConvert) {
            var configObjects = [];
            // if group by fields are only strings, convert to objects
            angular.forEach(arrayToConvert, function (configItem) {
                if (angular.isString(configItem)) {
                    configObjects.push({ displayName: configItem, field: configItem });
                } else {
                    configObjects.push(configItem);
                }
            });
            return configObjects;
        }

        function setSelectedSort(field) {
            vm.selectedSort = _.find(vm.options.sortByFields, function (sortField) { return sortField.field === field; });
            if (!vm.selectedSort) {
                vm.selectedSort = {
                    field: '',
                    direction: 'none'
                };
            }
        }

        function setDisplayOptions() {
            vm.options = $.extend(true, {}, defaultOptions, vm.filterOptions);
            vm.options.groupByFields = vm.convertToObjects(vm.options.groupByFields);
            vm.options.sortByFields = vm.convertToObjects(vm.options.sortByFields);
            // if user did not configure a current sort field
            // - select first field
            // - but set direction to 'none' so no button highlight to indicate no sort direction
            if (!vm.options.currentSortField) {
                vm.options.currentSortDirection = 'none';
                if (vm.options.sortByFields.length > 0) {
                    vm.options.currentSortField = vm.options.sortByFields[0].field;
                }
            }
            // bound to the html select
            vm.setSelectedSort(vm.options.currentSortField);
            // set visibility of options
            var displayOptions = vm.options.displayOptions.toLowerCase();
            vm.showSortControls = displayOptions.indexOf('s') !== -1 && vm.options.sortByFields.length > 0;
            vm.showQuickSearchControl = displayOptions.indexOf('q') !== -1;
            vm.showFilterButton = displayOptions.indexOf('f') !== -1 && vm.options.filterFields && vm.options.filterFields.length > 0;
            vm.showGroupButton = displayOptions.indexOf('g') !== -1 && vm.options.groupByFields.length > 0;
            vm.compactMode = displayOptions.indexOf('c') !== -1;
            vm.quickSearchText = vm.options.quickSearchText;
            vm.sortStyle = {
                'max-width': '145px'
            };

            // for compact mode, fix some widths depending on what is showing to make layout look a bit better
            if (vm.compactMode) {
                vm.openLeft = true;
                if (vm.showSortControls) {
                    if (vm.showQuickSearchControl || (vm.showFilterButton && vm.showGroupButton)) {
                        // sort will be alone in top row
                        vm.sortStyle = {
                            'width': '150px'
                        };
                    } else if (!vm.showQuickSearchControl && (vm.showFilterButton || vm.showGroupButton)) {
                        // make only one row by putting the single button on same row as sort
                        vm.sortStyle = {
                            'width': '140px'
                        };
                    }
                }
                if (vm.showQuickSearchControl && vm.showGroupButton) {
                    vm.searchStyle = {
                        'width': '176px'
                    };
                    vm.searchContainerStyle = {
                        'width': '180px'
                    };
                }
            }
            var sortDir = vm.options.currentSortDirection ? vm.options.currentSortDirection.toLowerCase() : 'none';
            vm.sortButtons = [{
                faIcon: 'fa-sort-alpha-asc',
                selected: sortDir === 'asc',
                onClickCallback: function () {
                    vm.setSortDirection('asc');
                }
            }, {
                faIcon: 'fa-sort-alpha-desc',
                selected: sortDir === 'desc',
                onClickCallback: function () {
                    vm.setSortDirection('desc');
                }
            }];
        }

        // handle click of the sort direction buttons
        function setSortDirection(direction) {
            if (vm.options.currentSortDirection !== direction) {
                vm.options.currentSortDirection = direction;
                if (vm.options.onSortChangeCallback) {
                    vm.options.onSortChangeCallback(vm.options.currentSortField, direction);
                }
            }
        }

        //$scope.sortStatus = {
        //    isOpen: false
        //}

        // handle change of selected sorting field
        function onSortChanged() {
            // handle case of no prior sort and highlight a sort button
            if (vm.options.currentSortDirection === 'none') {
                vm.options.currentSortDirection = 'asc';
                vm.sortButtons[0].selected = true;
            }
            vm.options.currentSortField = vm.selectedSort.field;
            if (vm.options.onSortChangeCallback) {
                vm.options.onSortChangeCallback(vm.options.currentSortField, vm.options.currentSortDirection);
            }
        }


        // handle click on the filter button
        function onFilterClicked() {
            // do NOT toggle the selected status of the button
            vm.filterButton[0].selected = !vm.filterButton[0].selected;
            if (vm.options.onFilterClickCallback) {
                vm.options.onFilterClickCallback(vm.filterButton[0].selected);
            }
        }

        // handle change of selected grouping field
        function groupSelectChange(groupField) {
            if (vm.options.onGroupChangeCallback) {
                vm.options.onGroupChangeCallback(groupField);
            }
            vm.groupStatus.groupField = groupField;
            vm.groupStatus.isOpen = false;
            vm.optionSelectedClass = groupField ? 'switch-button-select' : '';
            var msg = '[Controller.groupSelectChange] Group select was changed \n"';
            var data = {
                'field': groupField
            };
            logInfoFn(msg, data);
        }

        function itemSelected(field) {
            var selected = false;
            if (field) {
                selected = vm.groupStatus.groupField === field;
            } else {
                selected = !vm.groupStatus.groupField;
            }
            return selected;
        }


        function doQuickSearch() {
            if (vm.options.onSearchChangeCallback) {
                vm.options.onSearchChangeCallback(vm.quickSearchText);
                $scope.$emit('filterbar.quicksearch.done');
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////
        //  API Methods
        ///////////////////////////////////////////////////////////////////////////////////

        // are the sort controls visible
        function getSortVisible() {
            return vm.showSortControls;
        }
        // is the search control visible
        function getSearchVisible() {
            return vm.showQuickSearchControl;
        }
        // is the filter button visible
        function getFilterVisible() {
            return vm.showFilterButton;
        }
        // set whether the filter button should be displayed as selected
        function setFilterSelected(selected) {
            vm.filterButton[0].selected = selected;
        }
        // is the group button visible
        function getGroupVisible() {
            return vm.showGroupButton;
        }

        function changeSort(field, direction) {
            vm.options.currentSortField = field;
            vm.options.currentSortDirection = direction;
            if (direction === 'asc') {
                vm.sortButtons[0].selected = true;
                vm.sortButtons[1].selected = false;
            } else {
                vm.sortButtons[0].selected = false;
                vm.sortButtons[1].selected = true;
            }
            vm.setSelectedSort(field);
        }

        function getSearchText() {
            return vm.quickSearchText;
        }

        function getGroupField() {
            return vm.groupStatus.groupField;
        }

        function getSortInfo() {
            return {
                field: vm.options.currentSortField,
                direction: vm.options.currentSortDirection
            };
        }

        function setApiMethods() {
            vm.filterOptions.changeSort = vm.changeSort;
            vm.filterOptions.getFilterVisible = vm.getFilterVisible;
            vm.filterOptions.setFilterSelected = vm.setFilterSelected;
            vm.filterOptions.getGroupField = vm.getGroupField;
            vm.filterOptions.getGroupVisible = vm.getGroupVisible;
            vm.filterOptions.getSearchText = vm.getSearchText;
            vm.filterOptions.getSearchVisible = vm.getSearchVisible;
            vm.filterOptions.getSortInfo = vm.getSortInfo;
            vm.filterOptions.getSortVisible = vm.getSortVisible;
        }
    }
})();