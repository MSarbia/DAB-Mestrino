/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @ngdoc module
 * @name siemens.simaticit.common.widgets.table
 * @description
 * Provides functionalities related to tables.
 */

(function () { 
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table', [])
        .run(['$templateCache', function ($templateCache) {

            $templateCache.put('template/smart-table/custom-pagination.html',
                '<div>' +
                '<div class="ngTotalSelectContainer">' +
                '<div class="ngFooterTotalItems">' +
                '<span class="ngLabel">{{"pager.total-items" | translate}}: {{totalItemCount}}</span>' +
                '</div>' +
                '<div class="ngFooterSelectedItems" ng-if="selectionMode !== \'single\'">' +
                '<span class="ngLabel">{{"pager.selected-items"| translate}}: {{selectedItems}}</span>' +
                '</div>'+
                '</div>' +
                '<div class="ngPagerContainer">' +
                '<div class="ngRowCountPicker">' +
                '<span class="ngLabel page-size-label">{{"pager.page-size" | translate}}:</span>' +
                '<select class="uyRowCountSelect" ng-model="stItemsByPage" ng-options="pageSize for pageSize in stPageSizes"></select>' +
                '</div>' +
                '<div ng-if="pages.length >= 2" class="ngPagerControl">' +
                '<button type="button" class="ngPagerButton" ng-disabled="cantPageBackward(currentPage)" ng-click="selectPage(1)" title="{{"pager.page-first" | translate}}">' +
                '<div class="ngPagerFirstTriangle"><div class="ngPagerFirstBar"></div></div>' +
                '</button>' +
                '<button type="button" class="ngPagerButton" ng-disabled="cantPageBackward(currentPage)"  ng-click="selectPage(currentPage - 1)" title="{{"pager.page-prev" | translate}}">' +
                '<div class="ngPagerFirstTriangle ngpagerprevtriangle"></div>' +
                '</button>' +
                '<div class="page-select-container">' +
                '<sit-page-select></sit-page-select>' +
                '<span class="ngGridMaxPagesNumber" ng-show="pages.length > 0"> / {{numPages}}</span>' +
                '</div>' +
                '<button type="button" class="ngPagerButton" ng-disabled="cantPageForward(currentPage)" ng-click="selectPage(currentPage + 1)" title="{{"pager.page-next" | translate}}">' +
                '<div class="ngPagerLastTriangle ngpagernexttriangle"></div>' +
                '</button>' +
                '<button type="button" class="ngPagerButton" ng-disabled="cantPageForward(currentPage)" ng-click="selectPage(numPages)" title="{{"pager.page-last" | translate}}">' +
                '<div class="ngPagerLastTriangle"><div class="ngPagerLastBar"></div></div>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>'
                );
        }]);
})();





(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table')
        .directive('sitPageSelect', function () {
            return {
                restrict: 'E',
                template: '<input type="number" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)" min="1" max="{{numPages}}">',
                link: function (scope) {
                    scope.$watch('currentPage', function (c) {
                        scope.inputPage = c;
                    });
                }
            }
        });
})();
(function () {
    'use strict';
   
    /**
   * @ngdoc directive
   * @name sitTableButton
   * @module siemens.simaticit.common.widgets.table
   * @description  
   * Displays a button.  
   *
   * @usage 
   * As an attribute:
   * ```
   * <span sit-table-button sit-type="buttonType" sit-icon="buttonIcon" sit-label="buttonLabel" ng-click="clickFunction()"></span>
   * ```
   * @restrict A
   * 
   * @param {string} [sit-type = normal] _(Optional)_  Type of button.
   * @param {String} [sit-icon = undefined] Icon for the button.
   * @param {String} [sit-label = undefined] Label for the button.
   * @param {String} [ng-click = undefined] Function to be called on button click.
   *
   * @example
   * The following example shows how to configure a table button in a template: 
   *
   * ```
   * <span sit-table-button sit-type="normal" sit-icon="fa-cogs" sit-label="Settings" ng-click="ctrl.clickFunction()"></span>
   * ``` 
   *
   * The example below shows how to declare a table button click function: 
   * ```
   *  this.clickFunction=function() {
   *    // statement goes here
   *  }
   * ```
   */
    angular.module('siemens.simaticit.common.widgets.table').directive('sitTableButton', sitTableButton);

    TableButtonController.$inject = ['$scope'];
    function TableButtonController($scope) {
        var vm = this;
        vm.buttonClicked = buttonClicked;
        function activate() {
            if (!vm.type) {
                vm.type = 'normal';
            }
        }

        function buttonClicked(button) {
            if (button.type === 'toggle') {
                button.selected = !button.selected;
            }
            if (button.hasOwnProperty('method')) {
                if (isFunction(button['method'])) {
                    button['method'](button);
                }
            }
        }

        function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }

        activate();

        $scope.$on('$destroy', function () {
        });
    }

    function sitTableButton() {
        return {
            bindToController: {
                icon: '@sitIcon',
                method: '&tablebuttonclick',
                type: '@?sitType',
                selected: '=sitSelected',
                label: '@sitLabel'
            },
            controller: TableButtonController,
            controllerAs: 'tableBtnCtrl',
            restrict: 'A',
            replace: true,
            scope: {},
            templateUrl: 'common/widgets/table/table-button.html'
        };
    }
})();
(function () {
    "use strict";

    angular.module('siemens.simaticit.common.widgets.table').directive('sitTableColResize', sitTableColResize);

    /**
    * @ngdoc directive
    * @module siemens.simaticit.common.widgets.table 
    * @name sitTableColResize
    * @access internal
    * 
    * @restrict A
    *
    * @usage 
    * As an attribute:
    * ```
    * <span sit-table-col-resize></span>
    * ```
    *
    * @description 
	* Enables column resizing for the table.
    *
    */
    sitTableColResize.$inject = ['$interpolate', '$timeout'];
    function sitTableColResize($interpolate, $timeout) {
        return {
            restrict: 'A',
            require: '^sitTable',
            compile: compile
        };

        function compile() {
            return {
                post: post
            };

            function post(scope, element) {
                var originalWidths = [];
                var resizableColumns = [];

                activate();
                function activate() {
                    subscribeEvents();
                    if (0 === $(element).find('th:not(.scroll-column-header)').length) {
                        startWatch();
                        return;
                    }
                    startProcessing();
                }

                function startWatch() {
                    var unwatch = scope.$watch(function () {
                        return $(element).find('th:not(.scroll-column-header)').length;
                    }, function (newValue) {
                        if (undefined === newValue || 0 === newValue) {
                            return;
                        }
                        //startProcessing();
                        $timeout(startProcessing);
                        unwatch();
                    });
                }

                function startProcessing() {
                    $(element).find('th:not(.scroll-column-header)').each(function (index) {
                        resizableColumns.push(new ResizableColumn($interpolate, $timeout, scope, element, this, index, originalWidths));
                    });
                }

                function subscribeEvents() {
                    scope.$on('$destroy', function () {
                        originalWidths = resizableColumns = null;
                    });
                }
            }
        }
    }

    function ResizableColumn($interpolate, $timeout, scope, element, elmColumn, index, originalWidths) {
        var MIN_COL_WIDTH = 30; //A column will not be reduced beyond 30px
        var $th = $(elmColumn);
        var fn = $interpolate($th.html());
        var html = fn(scope);
        var $colHandle = $('<span class=\'colHandle\'></span>');
        var colResizer = $('<span class=\'colResizer\'></span>').html(html).append($colHandle);
        var $headerRow = $(element);
        var trOriginalWidth = $headerRow.width();
        originalWidths.push($th.width());
        $th.html('');
        $th.append(colResizer);

        $colHandle.bind('mousedown', mouseDownHandler);
        function mouseDownHandler(e) {
            var $tbody = $(element).parent().next('tbody');
            var startX = e.clientX;

            $(document).bind('mousemove', mousemoveHandler);
            $(document).bind('mouseup', mouseupHandler);

            function mouseupHandler() {
                $(document).unbind('mousemove', mousemoveHandler);
            }

            function mousemoveHandler(e) {
                var mousemove = e.clientX - startX;
                var thWidth = $th.width() + mousemove;
                if (thWidth < MIN_COL_WIDTH) { return; }
                var trWidth = $headerRow.width() + mousemove;
                // Table should not be reduced beyond its original width
                if (lessThanOriginalWidth(thWidth) || trWidth < trOriginalWidth) {
                    trWidth = trOriginalWidth;
                    var closestHeader = $th.next('th:not(.scroll-column-header)');
                    if (!closestHeader.length) {
                        closestHeader = $th.prev('th');
                    }
                    closestHeader.width(closestHeader.width() + (trOriginalWidth - trWidth));
                }
                $headerRow.width(trWidth);
                $tbody.find('tr').width(trWidth);
                $th.width(thWidth);

                //Adjust all the table body td as per the corresponding header widths
                $headerRow.find('th:not(.scroll-column-header)').each(function (index) {
                    $tbody.find('tr:not([ng-repeat-start]) td:nth-of-type(' + (index + 1) + ')').width($(this).width());
                });
                startX = e.clientX;
            }

            if ($tbody.attr('type') === 'group') {
                attachGroupClickHandlers();
            }

            attachtbodyEvents();

            function attachtbodyEvents() {
                $tbody.scroll(function () {
                    var left = -this.scrollLeft;
                    $headerRow.css('margin-left', left + 'px');
                });
                $tbody.hover(function () {
                    if (this.scrollWidth > this.clientWidth) {
                        $(this).find('.scroll-column-data').show();
                    }
                });
            }

            function handleTableBodyChange() {
                // Timeout is needed for the table data to render
                $timeout(function () {
                    // tbody needs to be reassigned since it changes on page or group change
                    $tbody = $(element).parent().next('tbody');
                    attachtbodyEvents();
                    if ($tbody.attr('type') === 'group') {
                        $tbody.find("tr").width($headerRow.width());
                        attachGroupClickHandlers();
                    } else {
                        $headerRow.find("th:not(.scroll-column-header)").each(function (index) {
                            $tbody.find('tr:not([ng-repeat-start]) td:nth-of-type(' + (index + 1) + ')').width($(this).width());
                        });
                    }
                });
            }

            // This is needed to adjust the td under a group according to the table headers
            function attachGroupClickHandlers() {
                $tbody.find('tr[ng-repeat-start]').on('click', function () {
                    var trgroup = $(this).siblings('tr:not([ng-repeat-start])');
                    if (trgroup.length) {
                        $headerRow.find('th:not(.scroll-column-header)').each(function (index) {
                            trgroup.find('td:nth-of-type(' + (index + 1) + ')').width($(this).width());
                        });
                    }
                });
            }

            function windowResize() {
                trOriginalWidth = $headerRow.width();
            }

            scope.$on('sit-table-collection-change', handleTableBodyChange);
            $(window).bind('resize', windowResize)
            scope.$on('$destroy', function () {
                $(document).unbind('mouseup', mouseupHandler);
                $colHandle.unbind('mousedown', mouseDownHandler);
                $(window).unbind('resize', windowResize);
            });
        }

        // This method ensure that as long as the sum of all the header lengths are less than their original
        // lengths , the entire table header row does not grow.
        function lessThanOriginalWidth(newThWidth) {
            var i = 0, length = originalWidths.length;
            var originalSum = originalWidths.reduce(function (a, b) {
                return a + b;
            }, 0);
            var width = newThWidth;
            for (i; i < length; i++) {
                if (i !== index) {
                    width += originalWidths[i];
                }
            }
            return (width < originalSum);
        }

    }

})();
//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table').constant('sitConfiguration', {
        pagination: {
            template: 'template/smart-table/custom-pagination.html',
            itemsByPage: 10,
            displayedPages: 5,
            pageSizes : [10,20,50]
        },
        search: {
            delay: 400, // ms
            inputEvent: 'input'
        },
        select: {
            mode: 'multi',
            selectedClass: 'st-selected'
        },
        sort: {
            ascentClass: 'st-sort-ascent', 
            descentClass: 'st-sort-descent',
            descendingFirst: false,
            skipNatural: false,
            delay: 300
        },
        pipe: {
            delay: 100 //ms
        }
    });
})();

// © Siemens AG, 2017
// This file has been modified as per the requirements in the SIMATIC IT App

//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';
    //#region ng-doc comments

    /**
    * @ngdoc type
    * @name SettingsObject
	* @module siemens.simaticit.common.widgets.table
	* @description An object containing the table settings.
	* @property {Object} [sort={}] Information about the table sort state.
    *
	* The object has the following format
    * ```
    *    {
    *       predicate : <"field name"">,     
    *   	reverse : <true or false>   
    *    }
    * ```
    * 
    * * **predicate**: Defines the name of the field used for sorting.
    * * **reverse**: (Boolean) true if descending order, otherwise false. 
    * 
	* @property {Object} [search={}] Information about the table search state.
    *
	* The object has the following format
    * ```
    *    {
    *       fieldNames : [],     
    *   	input : 'string text'   
    *    }
    * ```
    * 
    * * **fieldNames**: Defines an array of field names used for searching.
    * * **input**: Defines the string used for matching. 
	*
	* @property {Object} [filter={}] Information about the table filter state.
	* The object has the following format
    * ```
    *    {
    *       predicateObject : []    
    *    }
    * ```
    * 
    * * **predicateObject**: Defines an array of filter objects.
	*
	* @property {Object} [pagination={}] Information about the table search state.
    *
	* The object has the following format

    * ```
    *    {
    *       number : 10,     
    *   	start : 0,
	*		totalItemCount: 0,
	*		selectedItems  : 0
    *    }
    * ```
    * 
    * * **number**: Defines the items per page.
    * * **start**: Start index of the array slice displayed in the table. 
	* * **totalItemCount**: Total number of items contained in the table. 
	* * **selectedItems**: Number of selected items in the table. 
	*
	* @property {String} [selectionMode=undefined] Contains information about the selection mode of the table.
	* The following values are allowed:
    ** **multi**: Multiple items can be selected.
    ** **single**: Only single items can be selected. 
    ** **none**: No items can be selected.
	*
	* @property {Object} [group={}] Information about the table group state.
	* The object has the following format
    * ```
    *    {
    *       predicate : <"name of group by field">      
    *    }
    * ```
    * 
    * * **predicate**: Defines the name of the field used for grouping.
	*
	* @property {Object[]} [selectedRows] Array containing the rows selected in the table.
	*
    *
	*/

    /**
    * @ngdoc type
    * @name FilteringConfig
	* @module siemens.simaticit.common.widgets.table
	* @description An object containing the filter configuration.
	* @property {Boolean} [default=false] 
     * Specifies if a clause should be made automatically for this data field.
     * 
     * The **sitFilter** directive always shows at least one clause in the UI. 
     * When the UI is first shown, all elements in the filter list are checked
     * to see if any have the **default** property set to true. 
     * If so, a clause is created for each.
     * If no configured data fields have the **default** property set true,
     * then a clause is created for the first field in the list regardless of the **default** value.
     *
     * @property {String} [type='string'] 
     * Specifies the type of data contained in the data field.
     * The following is a list of allowed values:
     * * **string**
     * * **number**
     * * **date**
     * * **boolean**
     * 
     * This affects the type of UI element used for data input.
     * 
     * @property {String} validation A validation rule supported by the data input widget.
     * @property {String[]} [values=undefined] 
     * Defines a set of predefined values a user can select from. 
     * 
     * @property {String} widget
     * The name of a **Property Grid** widget to use for data input. 
     * 
     * This allows a developer to override the default widget used for data input based on data type.
     * If specified, this widget is used regardless of data type.
     * 
	 */

    /**
     * @ngdoc type
     * @name FieldConfig
     * @module siemens.simaticit.common.widgets.table
     * @description An object containing the configuration for each field in the table.
     * **Note:** If any of the configuration fields are not specified then the default values will be considered.
     * @property {Boolean} [sorting=false] Specifies if the field will be used for sorting. If true the field will be used.
     * @property {Boolean} [grouping=false] Specifies if the field will be used for grouping. If true the field will be used. 
     * @property {Boolean} [quicksearch=false] Specifies if the field will be used for quicksearch. If true the field will be used.
     * @property {Object}  [filtering=undefined] Represents the configuration to be used for filtering the field.  
     * The filtering object must be of type {@link FilteringConfig}
     *
     * The object has the following format
     * ```
     *    filtering: {
     *		type: "string",
     *		default: false,
     *		validation: {},
     *		values: ['Male', 'Female'],
     *		widget: "sit-select"
     *	}
     * ```
     *
     * @property {String} [displayName] An alternative name that will be used instead of the field name during sorting, grouping and filtering.
     * **Note:** Ideally the displayName of a field should be the same as the text specified in the table headers. Hence it is recommended to bind the 'displayName' property from the fieldConfig in the table headers.
     *
     */

    /**
     * @ngdoc type
     * @name TableConfig
     * @module siemens.simaticit.common.widgets.table
     * @description An object containing the configuration settings for the sit-table widget.
     * @property {String} [selectionMode="multi"] Specifies if the user can select only one item, multiple items or no items.
     * The following values are allowed:
     ** **multi**: Multiple items can be selected.
     ** **single**: Only single items can be selected. 
     ** **none**: No items can be selected.
     * @property {Boolean} [enableColumnResizing=true] Specifies if the table columns can be resized.
     * @property {Object} [fields=undefined] Specifies the configuration for each item to be displayed in the table.
     *
     * Each item in the field object should be specified so that the 'key' corresponds to the data item to be displayed in the table and 
     * the value corresponds to a configuration object of type {@link FieldConfig}, which determines the configuration for the particular field.
     *
     * Each field item must have the following format
     * ```
     *    fields : {
     *        'id' :{
     *				sorting: true,
     *				grouping: false,
     *				quicksearch: false,
     *               displayName : 'Identifier',
     *				filtering: {
     *					type: "number",
     *					default: false,
     *					validation: {}
     *				}
     *    		}
     *	}
     * ```
     *
     * @property {Function} [onPageChangedCallback=undefined] Specifies the function to call when the current page of data is changed. 
     * The function is passed as one argument: **pageNum**, which represents the number of the new page.
     *
     * @property {String} [onSelectionChangeCallback=undefined] Specifies the function to call when the list of selected items changes.
     * The function is passed in two arguments
     * * **selectedItems** An array of objects that represents the currently selected data items. 
     * * **selectedItem** The item a user clicked that triggered the selection change. 
     *
     * @property {Function} [onSortingChangedCallback=undefined] 
     * Specifies the function to call when the order of the displayed data changes. 
     *
     * The function is passed in two arguments:
     * * **field** The field being sorted.
     * * **reverse** Boolean determining if the list is sorted in reverse order (true/false).   
     * 
     * @property {Function} [onInitCallback=undefined] Specifies the function to call when the table is initialised (before the table is rendered). 
     * This callback is useful to change grid settings before the table is rendered on the page.
     * The function is passed in one argument: 
     * * **config** Represents the configuration settings of the table. The API methods exposed by the table on the {@link TableConfig} object will also be available.
     *
     * @property {Object} [data=undefined] Contains the data array to be displayed in the table.
     * If the **dataSource** option mentioned below is specified, then the data is retrieved 
     * from a server. Any data items assigned to this property will be ignored.
     *
     * For dynamic data updates, it is necessary to call the {@link TableConfig#refreshData refreshData} method.
     *
     * For example, the code snippet below updates data and refreshes the sitTable dynamically.
     *```
     *            vm.config.data = [{"id": 1, "firstName": "Judith"} , {"id": 2, "firstName": "Aaron",}];
     *            vm.config.refreshData();
     *```
     *
     * @property {Object} [dataSource=undefined] Contains settings that define the presentation service and data entity to be used as a data source.
     * 
     * The object has the following format
     * 
     * ```
     *     {
     *         dataService: engineeringData,
     *         dataEntity: 'CommandDefinition',
     *         optionsString: '',
     *         appName: 'myApp',
     *         onBeforeDataLoadCallBack: function ( data) {}
     *     }
     * ``` 
     * 
     * * **dataService**: A presentation service object such as **engineeringData**.
     * * **dataEntity**: The name of an entity to be retrieved using the service.
     * * **optionsString**: **oData** query options.
     * * **appName**: The name of the App where the entity is defined.
     * * **onBeforeDataLoadCallBack**: Specifies the function to call just before the call is made to fetch data from the back-end. This allows the developer to form a custom string to filter data from the backend. 
     * If this method is defined, then the return value of this method alone will determine how the data from the service is filtered/ordered.
     * 
     * 
     * For dynamic data updates, it is necessary to call the {@link TableConfig#refreshData refreshData} method.
     *
     * For example, the code snippet below updates dataSource and refreshes the sitTable dynamically.
     *```
     *            vm.config.dataSource.optionsString = "$filter=(Name eq '" + selectedItem[0].Name + "')";
     *            vm.config.refreshData();
     *```
     *
     *
     */

    /**
    * @ngdoc directive
    * @module siemens.simaticit.common.widgets.table
    * @name sitTable
    *
    * @requires common.services.logger.service
    * @requires $compile
    * @requires $timeout
    * @requires $templateCache
    *
    * @restrict A
    *
    * @usage 
    * As an attribute:
    * ```
    * <table sit-table="uniqueSitTableName" sit-config="ctrl.config" class="table">
    * ```
    *
    *
    * @description 
    * Converts an html table, which uses this directive, into a smart table that can handle data more efficiently.  
    *
    * Manages the sorting, searching, filtering and grouping of data by using the  {@link siemens.simaticit.common.widgets.table.sitTableFilterbar} directive and {@link siemens.simaticit.common.widgets.table.sitTablePager} directive.
    * 
    *
    * @param {TableConfig} sitConfig For a description of this object see {@link TableConfig}
    * 
    * @example
    * The **sit-table-filterbar**({@link siemens.simaticit.common.widgets.table.sitTableFilterbar}) should be specified in the **thead** section of the table as shown in the example below, for the filter bar to be displayed.
    *
    * Buttons for additional actions can be specified next to the filter-bar or without the filter-bar using the **sit-table-button** directive as shown
    * in the example below.
    *
    * The **sit-table-pager**({@link siemens.simaticit.common.widgets.table.sitTablePager}) should be specified in the **tfoot** section of the table as shown in the example below, for the pager to be displayed.
    * If the pager is not specified, the entire list will be displayed in the table. Not specifying the pager for large data sets will cause performance issues.
    * 
    * In a view template, you can use the **sitTable** as follows:
    * ```
    *   <div style="height:500px;" >
    *    <table sit-table="sitSmartTableExample" sit-config="tableExCtrl.config" class="table">
    *        <thead>
    *           <tr>
    *                <th>
    *                    <div class="tool-bar">
    *                        <span sit-table-filterbar></span>
    *                        <span sit-table-separator></span>
    *
    *                       <span sit-table-button
    *                              sit-icon="fa-cogs"
    *                              ng-click="tableExCtrl.onSettings()"
    *                              sit-label="Settings"></span>
    *                        <span sit-table-button
    *                              sit-icon="fa-plus"
    *                              ng-click="tableExCtrl.onAdd()"
    *                              sit-label="Add"></span>
    *                    </div>
    *                </th>
    *            </tr>
    *            <tr>
    *                <th>{{tableExCtrl.config.fields.id.displayName}}</th>
    *                <th>{{tableExCtrl.config.fields.firstName.displayName}}</th>
    *                <th>{{tableExCtrl.config.fields.lastName.displayName}}</th>
    *                <th>{{tableExCtrl.config.fields.gender.displayName}}</th>
    *                <th>App ID</th>
    *            </tr>
    *        </thead>
    *       <tbody>
    *            <tr ng-repeat="row in tableExCtrl.config.data">
    *                <td>{{row.id}}</td>
    *                <td>{{row.firstName}}</td>
    *                <td>{{row.lastName}}</td>
    *                <td>{{row.gender}}</td>
    *                <td>{{row.appID}}</td>
    *            </tr>
    *        </tbody>
    *        <tfoot>
    *            <tr sit-table-pager></tr>
    *        </tfoot>
    *    </table>
    * </div>
    * ```
    * 
    * In the corresponding view controller, add the **config** object.
    * ```
    *   // viewerData Defines the data objects to show
    * (function(){
    * 'use strict'
    * var app=angular.module('myModule');
    * 
    * function ControllerMethod(){
    *   var vm=this;
    *   
    *   // config 
    *   vm.config = {
    *        selectionMode: "multi",
    *        enableColumnResizing: true,
    *        fields: {
    *            "id": {
    *                sorting: true,
    *                grouping: false,
    *                quicksearch: false, 
    *                displayName: 'Identifier',            
    *                filtering: {
    *                    type: "number",
    *                    default: false,
    *                    validation: {}
    *                }
    *           },
    *           "firstName": {
    *                sorting: true,
    *                grouping: true,
    *                quicksearch:true,
    *                displayName: 'First Name', 
    *                filtering: {
    *                    type: "string",
    *                    default: false,
    *                    validation: { required: false }
    *                }
    *            },
    *            "lastName": {
    *                sorting: true,
    *                grouping: true,
    *                quicksearch: false,
    *                displayName: 'Last Name', 
    *                filtering: {
    *                    type: "string",
    *                    default: false,
    *                    validation: { required: true, pattern: /^[a-z]+$/ }
    *                }
    *            },
    *            "gender": {
    *                sorting: false,
    *                grouping: true,
    *                quicksearch: false,
    *                displayName: 'Gender', 
    *                filtering: {
    *                    type: "string",
    *                    default: false,
    *                   validation: {},
    *                    values: ['Male', 'Female'],
    *                    widget: "sit-select"
    *                }
    *            }
    *        },
    *        pageSizes: [10, 30, 50],
    *        pageSizeDefault: 30,
    *        onSelectionChangeCallback: function (list, item) {
    *            vm.selectedItems = list;
    *            vm.info = 'Number of selected rows has changed . Length:'+ list.length;
    *        },
    *       onPageChangeCallback: function(pageNum){
    *            vm.info = 'Page change is called. Current Page - ' + pageNum;
    *        },
    *        onSortChangeCallback: function (fieldName, reverse) {
    *            vm.info = 'Sort change callback called : Field - ' + fieldName + ', Reverse - ' + reverse;
    *        },
    *        onInitCallback: function (config) {
    *            vm.info = 'Table Initialised Callback fired';
    *        }
    *	}
    * }
    * 
    * app.contoller('controllerName',ControllerMethod);
    * })();
    * ```
    *  
    */
    //#endregion ng-doc comments
    angular.module('siemens.simaticit.common.widgets.table')
    .controller('sitTableController', SitTableController)
    .directive('sitTable', TableDirective);

    SitTableController.$inject = ['$translate', 'common', '$scope', '$parse', '$filter', '$attrs', 'common.widgets.pager.serverDataService', 'common.widgets.busyIndicator.service', 'common.widgets.messageOverlay.service'];
    function SitTableController($translate, common, $scope, $parse, $filter, $attrs, serverDataService, busyIndicatorService, globalMsgOverlayManager) {

        var ctrl = this;
        var propertyName = $attrs.sitConfig + '.data';
        var displayGetter = $parse(propertyName);
        var displaySetter = displayGetter.assign;
        var safeCopy = copyRefs(displayGetter($scope));
        var safeGetter = displayGetter;
        var serverDataManager;
        var orderBy = $filter('orderBy');
        var filter = $filter('filter');
        var filterBarFilter = $filter('sitCustomFilter');
        var filtered;
        var pipeAfterSafeCopy = true;
        var lastSelected;
        ctrl.isAllSelected = false;

        var tableState = {
            sort: {},
            search: {},
            filter: {},
            pagination: {
                start: 0,
                totalItemCount: 0,
                selectedItems: 0
            },
            selectionMode: ctrl.sitConfig.selectionMode,
            group: {},
            selectedRows: []
        };

        var overlay = {
            text: 'er1',
            title: 'error',
            buttons: [{
                id: 'okButton',
                displayName: $translate.instant('common.ok'),
                onClickCallback: function () { globalMsgOverlayManager.hide() }
            }]
        };

        ctrl.selectToggle = function () {
            var rows = [];
            if (!ctrl.isAllSelected) {
                rows = copyRefs(safeCopy);
                tableState.selectedRows = rows;
                tableState.pagination.selectedItems = rows.length;
            } else {
                tableState.selectedRows = [];
                tableState.pagination.selectedItems = 0;
            }
            notifySelectionChanged(rows)
            ctrl.isAllSelected = !ctrl.isAllSelected;
            var rowArray = getRows($scope[ctrl.displayedCollectionId], tableState.group.predicate);
            var i = 0, length = rowArray.length;
            for (i; i < length; i++) {
                rowArray[i].isSelected = ctrl.isAllSelected;
            }
        };

        ctrl.getTableName = function () {
            return $attrs.sitTable;
        }

        function refresh() {
            ctrl.pipe();
        }

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.table
        * @name TableConfig#refreshData
        *
        * @description
        * An API used to refresh the table when data is changed.
        *
        */
        function refreshData() {
            displayGetter = $parse(propertyName);
            displaySetter = displayGetter.assign;
            safeCopy = copyRefs(displayGetter($scope));
            ctrl.pipe();
        }

        function updateSafeCopy() {
            safeCopy = copyRefs(safeGetter($scope));
            if (pipeAfterSafeCopy === true) {
                ctrl.pipe();
            }
        }

        if ($attrs.stSafeSrc) {
            safeGetter = $parse($attrs.stSafeSrc);
        }
        $scope.$watch(function () {
            var safeSrc = safeGetter($scope);
            return safeSrc && safeSrc.length ? safeSrc[0] : undefined;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                updateSafeCopy();
            }
        });
        $scope.$watch(function () {
            var safeSrc = safeGetter($scope);
            return safeSrc ? safeSrc.length : 0;
        }, function (newValue) {
            if (newValue !== safeCopy.length) {
                updateSafeCopy();
            }
        });
        $scope.$watch(function () {
            return safeGetter($scope);
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                tableState.pagination.start = 0;
                updateSafeCopy();
            }
        });


        /**
         * sort the rows
         * @param {Function | String} predicate - function or string which will be used as predicate for the sorting.
         * @param [reverse] - if you want to reverse the order
         */
        this.sortBy = function sortBy(predicate, reverse) {
            tableState.sort.predicate = predicate;
            tableState.sort.reverse = reverse === true;

            if (angular.isFunction(predicate)) {
                tableState.sort.functionName = predicate.name;
            } else {
                delete tableState.sort.functionName;
            }
            tableState.pagination.start = 0;
            if (serverDataManager) {
                serverDataManager.setCurrentPage(1); // reset to first page when sort is clicked
            }
            notifySortChanged(predicate, reverse);
            return this.pipe();
        };

        /**
         * search matching rows
         * @param {String} input - the input string
         * @param {String} [predicate] - the property name against which you want to check the match, otherwise it will search all properties
         */
        this.search = function search(input, predicate) {
            input = angular.isString(input) ? input.trim() : input;
            tableState.search.fieldNames = predicate;
            tableState.search.input = input;
            tableState.pagination.start = 0;
            if (serverDataManager) {
                serverDataManager.setCurrentPage(1); // reset to first page when search is performed
            }
            return this.pipe();
        };

        this.filter = function filter(filterClause) {
            tableState.filter.predicateObject = filterClause;
            tableState.pagination.start = 0;
            return this.pipe();
        };

        this.groupBy = function groupBy(predicate) {
            tableState.group.predicate = predicate ? predicate : undefined;
            return this.pipe();
        };

        var getData = _.debounce(function (pagination) {
            if (!serverDataManager) {
                setServerDataManager();
            } else {
                !_.isEmpty(tableState.pagination) && setServerPagingOption();
                !_.isEmpty(tableState.sort) && setServerSortingOption();
                !_.isEmpty(tableState.search) && setServerQSOption();
                !_.isEmpty(tableState.filter) && setServerFilterOption();
            }
            busyIndicatorService.show();
            if (pagination.number === undefined) {
                serverDataManager.getAllData().then(function (data) {
                    busyIndicatorService.hide();
                    $scope[ctrl.displayedCollectionId] = data.data;
                    setSelectedItems(); //Method for selecting items when settings are restored, need to be optimised
                    $scope.$emit('sit-table-collection-change');
                }, function (err) {
                    busyIndicatorService.hide();
                    showOverlay(err);
                });
            } else {
                serverDataManager.getPageData().then(function (data) {
                    busyIndicatorService.hide();
                    $scope[ctrl.displayedCollectionId] = data.data;
                    pagination.numberOfPages = Math.ceil(data.totalDataSize / ctrl.tableState().pagination.number) || 0;
                    pagination.totalItemCount = data.totalDataSize;
                    setSelectedItems();
                    $scope.$emit('sit-table-collection-change');
                }, function (err) {
                    busyIndicatorService.hide();
                    showOverlay(err);
                });
            }
        }, 200)

        /**
         * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
         */
        //pipe method modified for handling server side pagination
        this.pipe = function pipe() {
            var pagination = tableState.pagination;
            var group = tableState.group;

            if (ctrl.sitConfig.dataSource) {
                getData(pagination);
            } else {

                var searchFieldNames = tableState.search.fieldNames;
                var input = tableState.search.input;
                if (searchFieldNames && searchFieldNames.length && input) {
                    var filteredArr = [], i = 0, length = searchFieldNames.length;
                    for (i; i < length; i++) {
                        var pred = {};
                        $parse(searchFieldNames[i]).assign(pred, input);
                        filteredArr = _.union(filteredArr, filter(safeCopy, pred));
                    }
                    filtered = filteredArr;
                } else {
                    filtered = safeCopy
                }

                if (tableState.filter.predicateObject) {
                    filtered = tableState.filter.predicateObject ? filterBarFilter(filtered, tableState.filter.predicateObject) : safeCopy;
                }

                if (tableState.sort.predicate) {
                    filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var output;
                pagination.totalItemCount = filtered.length;
                if (group.predicate !== undefined) {
                    filtered = groupByProperty(filtered, group.predicate);
                }
                if (pagination.number !== undefined) {
                    pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
                    pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
                    output = filtered.slice(pagination.start, pagination.start + parseInt(pagination.number));
                }
                var finalOutput = output || filtered;
                $scope[ctrl.displayedCollectionId] = finalOutput;
                reformSelectedRowsList(tableState, safeCopy);
                setSelectedItems();// Method for selecting items when settings are restored.
                $scope.$emit('sit-table-collection-change');
            }
        };

        function setSelectedItems() {
            var rowArray = getRows($scope[ctrl.displayedCollectionId],tableState.group.predicate);
            var i = 0, j, length = rowArray.length, selectedlength = tableState.selectedRows.length;
            removeCurrentSelection(rowArray);
            for (i; i < selectedlength; i++) {
                for (j = 0; j < length; j++) {
                    if (areObjectsEqual(tableState.selectedRows[i], rowArray[j]) && !rowArray[j].isSelected) {
                        rowArray[j].isSelected = true;
                    }
                }
            }
            updatePager(tableState, ctrl);
        }

        function updatePager(tableState, ctrl) {
            tableState.pagination.selectedItems = tableState.selectedRows.length;
            tableState.pagination.selectedItems === tableState.pagination.totalItemCount && tableState.pagination.totalItemCount > 0 ? ctrl.isAllSelected = true : ctrl.isAllSelected = false;
        }

        function setServerDataManager() {
            var serverOptions = ctrl.sitConfig.dataSource;

            // Need to add info for the quick search and other details from tablestate
            // Default Config
            var config = {
                pagingOptions: {
                    currentPage: 1,
                    pageSize: 10
                },
                quickSearchOptions: {
                    enabled: true,
                    field: '',
                    filterText: ''
                },

                sortInfo: {
                    field: '',
                    direction: ''
                },
                serverDataOptions: serverOptions
            };
            serverDataManager = serverDataService.getDataManager(config);

            !_.isEmpty(tableState.pagination) && setServerPagingOption();
            !_.isEmpty(tableState.sort) && setServerSortingOption();
            !_.isEmpty(tableState.search) && setServerQSOption();
            !_.isEmpty(tableState.filter) && setServerFilterOption();
        }


        function setServerPagingOption() {
            var paginationState = tableState.pagination;
            var start = paginationState.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var pageSize = paginationState.number || 10;  // Number of entries showed per page.
            var currentPage = Math.floor(start / pageSize) + 1
            serverDataManager.setPageSize(pageSize);
            serverDataManager.setCurrentPage(currentPage);
        }

        function setServerSortingOption() {
            var sortState = tableState.sort;
            var sortDirection = sortState.reverse ? 'desc' : 'asc';
            var sortField = sortState.predicate || '';
            serverDataManager.setSortInfo(sortField, sortDirection);
        }

        function setServerQSOption() {
            var searchState = tableState.search;
            var searchFields = searchState.fieldNames || '';
            var input = searchState.input || ''
            serverDataManager.setSearchField(searchFields);
            serverDataManager.setSearchText(input);
        }

        function setServerFilterOption() {
            serverDataManager.setFilter(tableState.filter.predicateObject);
        }

        function showOverlay(err) {
            overlay.title = $translate.instant('common.error');
            overlay.text = common.formatErrorMessage(err);
            globalMsgOverlayManager.set(overlay);
            globalMsgOverlayManager.show();
        }

        /**
         * select a dataRow (it will add the attribute isSelected to the row object)
         * @param {Object} row - the row to select
         * @param {String} [mode] - "single" or "multiple" (multiple by default)
         */
        this.select = function select(row, mode) {
            var rows = getRows($scope[ctrl.displayedCollectionId],tableState.group.predicate);
            var index = rows.indexOf(row);
            if (index !== -1) {
                if (mode === 'single') {
                    tableState.selectedRows = [];
                    row.isSelected = row.isSelected !== true;
                    if (lastSelected) {
                        lastSelected.isSelected = false;
                    }
                    lastSelected = row.isSelected === true ? row : undefined;
                } else {
                    rows[index].isSelected = !rows[index].isSelected;
                    rows[index].isSelected === true ? tableState.pagination.selectedItems++ : tableState.pagination.selectedItems--;
                    if (!row.isSelected) {
                        removeFromSelectedList(row);
                    }

                    if (tableState.pagination.selectedItems === tableState.pagination.totalItemCount) {
                        ctrl.isAllSelected = true;
                    } else {
                        ctrl.isAllSelected = false;
                    }

                }
                row.isSelected && tableState.selectedRows.push(row);
                notifySelectionChanged(row);
            }
        };

        /**
         * @ngdoc event
         * @name sitTable#sit-row-selection-change
         * @eventType emit on sitTable
         * @description
         * Emitted when a user clicks on a row in the collection and changes
         * the list of currently selected rows.
         * 
         * Two parameters are passed along with the event.
         * * **selectedRows**: A list of the currently selected data rows.
         * * **selRow**:The data item corresponding to the row the user
         * clicked on to trigger the event.
         * 
         * @param {Object} event The event object.
         * 
         * @param {Object[]} selectedRows A list of the currently selected data rows.
         * 
         * @param {Object} selRow The data item corresponding to the row the user
         * clicked to trigger the event.
         * 
         */
        function notifySelectionChanged(selRow) {
            $scope.$emit('sit-row-selection-change', tableState.selectedRows, selRow);
            if (ctrl.sitConfig.onSelectionChangeCallback) {
                ctrl.sitConfig.onSelectionChangeCallback(tableState.selectedRows, selRow);
            }
        }

        function removeFromSelectedList(row) {
            var i = 0, length = tableState.selectedRows.length;
            for (i; i < length; i++) {
                if (areObjectsEqual(tableState.selectedRows[i], row)) {
                    tableState.selectedRows.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * take a slice of the current sorted/filtered collection (pagination)
         *
         * @param {Number} start - start index of the slice.
         * @param {Number} number - the number of items in the slice.
         * @param {Number} pageNum - the current page number. 
         */
        this.slice = function splice(start, number, page) {
            tableState.pagination.number && notifyPageChanged(page);
            tableState.pagination.start = start;
            tableState.pagination.number = number;
            return this.pipe();
        };

        /**
         * returns the current state of the table
         * @returns {{sort: {}, search: {}, pagination: {start: number}}}
         */
        this.tableState = function getTableState() {
            return tableState;
        };

        this.getFilteredCollection = function getFilteredCollection() {
            return filtered || safeCopy;
        };

        /**
         * Use a different filter function than the angular FilterFilter
         * @param filterName The name under which the custom filter is registered
         */
        this.setFilterFunction = function setFilterFunction(filterName) {
            filter = $filter(filterName);
        };


        this.setFilterBarFunction = function setFilterBarFunction(filterName) {
            filterBarFilter = $filter(filterName);
        };

        /**
         * Use a different function than the angular orderBy
         * @param sortFunctionName the name under which the custom order function is registered
         */
        this.setSortFunction = function setSortFunction(sortFunctionName) {
            orderBy = $filter(sortFunctionName);
        };

        /**
         * Usually when the safe copy is updated the pipe function is called.
         * Calling this method will prevent it, which is something required when using a custom pipe function
         */
        this.preventPipeOnWatch = function preventPipe() {
            pipeAfterSafeCopy = false;
        };

        /*API methods*/
        ctrl.onInitCallback = function () {
            if (ctrl.sitConfig.onInitCallback && angular.isFunction(ctrl.sitConfig.onInitCallback)) {
                ctrl.sitConfig.onInitCallback(ctrl.sitConfig);
            }
        };

        /**
         * @ngdoc event
         * @name sitTable#sit-table-page-change
         * @eventType emit on sitTable pager
         * @description
         * Emitted when the value of the current page in the pager is changed.
         * 
         * The new page number is passed as a parameter with the event.
         * 
         * @param {Object} event The event object.
         * 
         * @param {Number} currPageNum The new page number.
         * 
         */
        function notifyPageChanged(currPageNum) {
            $scope.$emit('sit-table-page-change', currPageNum);
            if (ctrl.sitConfig.onPageChangeCallback && angular.isFunction(ctrl.sitConfig.onPageChangeCallback)) {
                ctrl.sitConfig.onPageChangeCallback(currPageNum);
            }
        }

        /**
        * @ngdoc event
        * @name sitTable#sit-table-sort-change
        * @eventType emit on sitTable pager
        * @description
        * Emitted when the table sort configuration changes.
        * 
        * fieldName and reverse are passed as parameters with the event.
        * 
        * @param {Object} event The event object.
        * 
        * @param {String} fieldName The name of the field on which sorting is performed.
        *
        * @param {Boolean} reverse Set to 'true' if sorted in descending order, else set to 'false'.
        * 
        */
        function notifySortChanged(fieldName, reverse) {
            $scope.$emit('sit-table-sort-change', fieldName, reverse);
            if (ctrl.sitConfig.onSortChangeCallback && angular.isFunction(ctrl.sitConfig.onSortChangeCallback)) {
                ctrl.sitConfig.onSortChangeCallback(fieldName, reverse);
            }
        }

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.table
        * @name TableConfig#getSettings
        *
        * @description
        * Retrieves the current settings(selections, groups, sorting, etc.) of the table .
        *
        * @returns {SettingsObject} Object containing table settings. For a description of this object see {@link SettingsObject}
        */
        this.getSettings = function () {
            return tableState;
        }

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.table
        * @name TableConfig#applySettings
        * @param {SettingsObject} [settingsObject] Object containg table settings. For a description of this object see {@link SettingsObject}
        * @description
        * Applies the specified settings defined by a {@link SettingsObject} . If {@link SettingsObject} is invalid (or of a different table) , then
        * the table will not behave as expected.
        *
        */
        this.applySettings = function (settingsObject) {
            if (settingsObject) {
                tableState = settingsObject;
                refresh();
            }
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.table
        * @name TableConfig#saveSettings
        *
        * @param {String} [ID]
        * ID of the table whose settings need to be saved.
        *
        * @description
        * Saves the settings (selections, groups, sorting, etc.) of a specified table (identified by a unique ID) to sessionStorage.
        *
        */
        this.saveSettings = function (id) {
            window.sessionStorage.setItem(id, JSON.stringify(tableState));
        }

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.table
        * @name TableConfig#loadSettings
        * @param {String} [ID]
        * ID of the table whose settings need to be loaded.
        *
        * @description
        * Loads the settings (selections, groups, sorting, etc.) of a specified table (identified by a unique ID) from sessionStorage (selections, groups, sorting, etc.).
        *
        * @returns {SettingsObject} Settings object containing the table settings. For a description of this object see {@link SettingsObject}
        */
        this.loadSettings = function (id) {
            var savedState;
            if (window.sessionStorage.getItem(id)) {
                savedState = JSON.parse(window.sessionStorage.getItem(id));
            }
            return savedState;
        }

        ctrl.setTableAPIOptions = function () {
            if (ctrl.sitConfig) {
                ctrl.sitConfig.getSettings = ctrl.getSettings;
                ctrl.sitConfig.applySettings = ctrl.applySettings;
                ctrl.sitConfig.loadSettings = ctrl.loadSettings;
                ctrl.sitConfig.saveSettings = ctrl.saveSettings;
                ctrl.sitConfig.refreshData = refreshData;
            }
        };

        ctrl.setTableAPIOptions();
        ctrl.onInitCallback();
    }

    // Whenever the collection changes we need to ensure that the selected rows list is still valid and make necessary deletions.
    function reformSelectedRowsList(tableState,safeCopy) {
        var i = 0, j, length = safeCopy.length;
        for (i; i < tableState.selectedRows.length; i++) {
            for (j = 0; j < length; j++) {
                if (areObjectsEqual(tableState.selectedRows[i], safeCopy[j])) {
                    break;
                }
            }
            if (j === length) {
                tableState.selectedRows.splice(i, 1);
                tableState.pagination.selectedItems > 0 && tableState.pagination.selectedItems--;
            }
        }
    }

    function areObjectsEqual(obj1, obj2) {
        if (obj1 && obj2){
            var obj1Copy = JSON.parse(angular.toJson(obj1))
            var obj2Copy = JSON.parse(angular.toJson(obj2))
            delete obj1Copy.isSelected;
            delete obj2Copy.isSelected;
            if (_.isEqual(obj1Copy, obj2Copy)) {
                return true;
            }
        }
        return false;
    }

    function groupByProperty(collection, property) {
        var output = [];
        var groupReference = {};

        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            var keyValue = getPropValue(item,property);

            var group = groupReference[keyValue];
            if (group === undefined) {
                group = {
                    key: keyValue,
                    items: []
                };
                groupReference[keyValue] = group;
                output.push(group);
            }
            group.items.push(item);
        }
        return output;
    }

    function getPropValue(item,key) {
        var keyArray = key.split(".");
        while (keyArray.length){
            item = item[keyArray.shift()];
        }
        return item;
    }

    function removeCurrentSelection(rowArray){
        var i = 0,length = rowArray.length;
        for (i; i < length; i++) {
            if (rowArray[i].isSelected){
                rowArray[i].isSelected = false;
            }
        }
    }

    function copyRefs(src) {
        return src ? [].concat(src) : [];
    }

    function getRows(displayedCollection,isGrouped) {
        var rows = copyRefs(displayedCollection);
        if (isGrouped !== undefined) {
            rows = getGroupedRows(rows);
        }
        return rows;
    }

    function getGroupedRows(rows) {
        var groupedRows = [];
        function makeRows(rows) {
            rows.forEach(function (row) {
                if (row.items && row.items.length > 0) {
                    makeRows(row.items)
                } else {
                    groupedRows.push(row)
                }
            });
        }
        makeRows(rows);
        return groupedRows;
    }

    TableDirective.$inject = ['common.services.logger.service', '$compile', '$timeout', '$templateCache'];
    function TableDirective(logger, $compile, $timeout, $templateCache) {
        var tableCount = 0;
        return {
            restrict: 'A',
            controller: 'sitTableController',
            controllerAs: 'sitTableCtrl',
            bindToController: {
                sitConfig: '=sitConfig'
            },
            compile: function (tElement, tAttrs) {
                tableCount++;
                var displayedCollectionId = 'displayedCollection_' + tableCount;

                var headerCache = tElement.children().eq(0).children('tr:last-child');
                var eleCache = tElement.children().eq(1).children();
                var rowCollection = eleCache[0].getAttribute('ng-repeat');
                var rowName = rowCollection.substring(0, rowCollection.indexOf(' '));
                eleCache.attr('sit-select-row', rowName);
                var recordLabel = [];
                eleCache[0].setAttribute('ng-repeat', rowName + ' in ' + displayedCollectionId);
                headerCache.children().each(function (index, item) {
                    recordLabel.push(item.innerHTML);
                });
                eleCache.children().each(function (index, item) {
                    var label = recordLabel.splice(0, 1);
                    $(item).attr('data-label', label[0]);
                });
                headerCache.append('<th class="scroll-column-header"></th>');
                eleCache.append('<td class="scroll-column-data"></td>');
                // change the outer html to suit the display collection
                $templateCache.put(tAttrs.sitTable, tElement.children()[1].outerHTML);

                return {
                    pre: function preLink() {
                    },
                    post: function postLink(scope, element, attr, ctrl) {
                        if (attr.stSetFilter) {
                            ctrl.setFilterFunction(attr.stSetFilter);
                        }

                        if (attr.stSetSort) {
                            ctrl.setSortFunction(attr.stSetSort);
                        }

                        ctrl.displayedCollectionId = displayedCollectionId;
                        scope[displayedCollectionId] = [];
                        if (ctrl.tableState().group.predicate) {
                            var groupedTableBody = $compile('<sit-table-group type="group" name="' + attr.sitTable + '"></sit-table-group>')(scope);
                            element.children().eq(1).replaceWith(groupedTableBody);
                        }

                        scope.$watch(function () {
                            return ctrl.tableState().group;
                        }, function (newValue, oldValue) {
                            if (angular.isString(newValue.predicate) !== angular.isString(oldValue.predicate)) {
                                logger.log('Grouping changed', newValue.predicate, 'sitTable');
                                var groupedTableBody;
                                if (newValue.predicate !== '' && newValue.predicate !== undefined) {
                                    groupedTableBody = $compile('<sit-table-group type="group" name="' + attr.sitTable + '"></sit-table-group>')(scope);
                                    element.children().eq(1).replaceWith(groupedTableBody);
                                } else {
                                    groupedTableBody = $compile('<sit-table-group name="' + attr.sitTable + '"></sit-table-group>')(scope);
                                    element.children().eq(1).replaceWith(groupedTableBody);
                                }
                                scope.$emit('sit-table-group-change', newValue.predicate);
                            }
                        }, true);
                        if (!ctrl.sitConfig.selectionMode || (ctrl.sitConfig.selectionMode.toLowerCase() !== 'single' && ctrl.sitConfig.selectionMode.toLowerCase() !== 'none')) {
                            var button = $compile('<span sit-table-button sit-icon=\"fa-check-square-o\" ng-click=\"sitTableCtrl.selectToggle()\" sit-selected="sitTableCtrl.isAllSelected"  sit-type="toggle" sit-label=\"{{\'common.selectAll\' | translate}}\"></span><span sit-table-separator></span>')(scope);
                            element.children().eq(0).find('.tool-bar').prepend(button);
                        }
                        if (ctrl.sitConfig.enableColumnResizing !== false) {
                            $compile(element.children().eq(0).children('tr:last-child').attr('sit-table-col-resize', ''))(scope);
                        }
                    }
                };
            }

        };
    }

})();

(function () {
    "use strict";
    /**
    * @ngdoc directive
    * @module siemens.simaticit.common.widgets.table 
    * @name sitTableFilterbar
    *
    * @restrict AE
    *
    * @description 
	* Provides a UI for defining the filter bar.
    *
    * @usage 
    * As an attribute:
    * ```
    * <span sit-table-filterbar></span>
    * ```
    *
    * Filtering of data in the **sitTableFilterbar** is performed using the: 
    * * {@link siemens.simaticit.common.widgets.filter.sitFilter} directive and the
    * * {@link siemens.simaticit.common.widgets.filter.sitFilterService} service.
    * 
    * The **sitTable** wraps the use of these components so that a user of the **sitTable** does
    * not need to interact with them directly.
    */

    angular.module('siemens.simaticit.common.widgets.table').directive('sitTableFilterbar', TableFilterBar);

    SitTableFilterbarController.$inject = ['$scope', '$element'];
    function SitTableFilterbarController($scope, $element) {
        var vm = this;
        vm.activate = activate;
        activate();

        function activate() {
            vm.showFilter = false;
            vm.sortByField = sortByField;
            vm.quickSearch = quickSearch;
            vm.groupFields = groupFields;
            vm.tableCtrl = $element.controller('sitTable');
            vm.serverData = vm.tableCtrl.sitConfig.dataSource ? true : false;
            var displayOptions = getDisplayOptions();
            var tableState = vm.tableCtrl.getSettings();
            var groupField = tableState.group.predicate || '';
            var sortField = tableState.sort.predicate || '';
            var sortDirection = tableState.sort.reverse ? 'desc' : 'asc';
            var searchText = tableState.search.input;
            vm.filterOptions = {
                currentGroupField: groupField,
                currentSortDirection: sortDirection,
                currentSortField: sortField,
                displayOptions: displayOptions,
                onFilterClickCallback: function () {
                    vm.showFilter = !vm.showFilter;
                },
                groupByFields: getAllFieldsToGroup(),
                onGroupChangeCallback: function (group) {
                    vm.groupFields(group);
                },
                quickSearchField: getAllFieldsToSearch(),
                quickSearchText: searchText,
                onSearchChangeCallback: function (searchText) {
                    vm.quickSearch(searchText);
                },
                sortByFields: getAllFieldsToSort(),
                sortByText: 'Sort By',
                onSortChangeCallback: function (field, direction) {
                    vm.sortByField(field, direction);
                },
                filterFields: getAllFilterFields()
            };
            vm.filterClauses = tableState.filter.predicateObject;
            vm.filterClauses && setFilterFields();
            vm.filterSearchOptions = {};
            init();
        }

        function getDisplayOptions() {
            var displayOption = 'sqgf';
            if (getAllFieldsToSearch().length < 1) { displayOption = displayOption.replace('q', ''); }
            if (vm.serverData || getAllFieldsToGroup().length < 1) { displayOption = displayOption.replace('g', ''); }
            return displayOption;
        }

        // Method to set the filterFields to the filter clauses as needed by filter directive
        function setFilterFields() {
            var i = 0, length = vm.filterClauses.length;
            for (i; i < length; i++) {
                var clauseFieldName = vm.filterClauses[i].filterField.field;
                var field = _.findWhere(vm.filterOptions.filterFields, { 'field' : clauseFieldName })
                vm.filterClauses[i].filterField = field;
            }
            vm.showFilter = true;
        }

        function getAllFieldsToSearch() {
            return _.filter(_.keys(vm.tableCtrl.sitConfig.fields), function (key) {
                return vm.tableCtrl.sitConfig.fields[key].quicksearch;
            });
        }

        function getAllFieldsToGroup() {
            var groupFields =  _.filter(_.keys(vm.tableCtrl.sitConfig.fields), function (key) {
                return vm.tableCtrl.sitConfig.fields[key].grouping;
            });
            return _.map(groupFields, function (obj) {
                var displayName = vm.tableCtrl.sitConfig.fields[obj].displayName || obj
                return { field: obj, displayName : displayName};
            });
        }

        function getAllFieldsToSort() {
            var sortFields =  _.filter(_.keys(vm.tableCtrl.sitConfig.fields), function (key) {
                return vm.tableCtrl.sitConfig.fields[key].sorting;
            });
            return _.map(sortFields, function (obj) {
                var displayName = vm.tableCtrl.sitConfig.fields[obj].displayName || obj
                return { field: obj, displayName: displayName };
            });
        }

        function getAllFilterFields() {
            var filterFields = _.filter(vm.tableCtrl.sitConfig.fields, function (filterField, key) {
                if (filterField.filtering) {
                    filterField.filtering.field = key;
                    filterField.filtering.displayName = filterField.displayName;
                }
                return filterField.filtering;
            });
             return _.map(filterFields, function (obj) {
                return obj.filtering;
            });
        }

        function sortByField(field, direction) {
            var reverse = direction === 'asc' ? false : true;
            vm.tableCtrl.sortBy(field, reverse);
        }

        function quickSearch(searchText) {
            vm.tableCtrl.setFilterFunction('filter');
            invokeQuickSearch(searchText);
        }

        function invokeQuickSearch(input) {
            var length = vm.filterOptions.quickSearchField.length;
            if (length === Object.keys(vm.tableCtrl.sitConfig.fields).length) {
                vm.tableCtrl.search(input, '$');
            } else {
                var predicate = length > 0 ? vm.filterOptions.quickSearchField: '';
                vm.tableCtrl.search(input, predicate);
            }
        }

        function groupFields(group) {
            vm.tableCtrl.groupBy(group);
        }

        function init() {
            vm.applyFilter = applyFilter;
            vm.resetFilter = resetFilter;
        }

        function applyFilter(clauses) {
            vm.tableCtrl.setFilterBarFunction('sitCustomFilter');
            vm.tableCtrl.filter(clauses);
        }

        function resetFilter() {
            $scope.$broadcast('sit-table-filter', []);
        }
    }

    TableFilterBar.$inject = ['$window']
    function TableFilterBar($window) {
        return {
            restrict: 'AE',
            require: '^sitTable',
            replace: true,
            scope : {},
            controller: SitTableFilterbarController,
            controllerAs: 'sitTableFilterbarCtrl',
            templateUrl: 'common/widgets/table/table-filterbar.html',
            link: function (scope, element, attr, ctrl) {
                var FILTER_MARGIN_TOP = 10;
                var currCtrl = element.controller('sitTableFilterbar');

                scope.$watch(function () {
                    return ctrl.tableState();
                }, function () {
                    currCtrl.activate();
                });

                scope.$watch(function () {
                    return currCtrl.showFilter;
                }, function (newVal) {
                    if (newVal === true) {
                        adjustFilterHeight();
                    } else {
                        var toolBar = element.parent('.tool-bar');
                        toolBar.removeClass('filter-open');
                        element.find('#filter').css('top','0px');
                    }
                });

                angular.element($window).on('resize', onResize);

                function onResize() {
                    if (currCtrl.showFilter) {
                        adjustFilterHeight();
                    }
                }

                function adjustFilterHeight() {
                    var toolBar = element.parent('.tool-bar');
                    toolBar.addClass('filter-open');
                    var toolBarheight = toolBar.height();
                    element.find('#filter').css('top', (toolBarheight + FILTER_MARGIN_TOP) + 'px');
                }

                scope.$on('$destroy', function () {
                    angular.element($window).off('resize', onResize);
                });

            }
        };
    }

    angular.module('siemens.simaticit.common.widgets.table')
        .filter('sitCustomFilter', ['common.widgets.filter.service', function (sitFilterService) {
            return function sitCustomFilter(array, clause) {
                var output = sitFilterService.filterArray(clause, array);
                return output;
            };

        }]);
})();
(function () {
    "use strict";

    angular.module('siemens.simaticit.common.widgets.table').directive('sitTableGroup', TableGroup);

    TableGroup.$inject = ['$templateCache'];
    function TableGroup($templateCache) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: function (element, attr) {
                if (attr.type === "group") {
                    return 'common/widgets/table/table-with-group.html';
                } else {
                    return attr.name;
                }
            },
            compile: function (tElement, tAttribute) {
                if (tAttribute.type === "group") {
                    var parsedHtml = $.parseHTML($templateCache.get(tAttribute.name));
                    var rowCollection = parsedHtml[0].children[0].getAttribute('ng-repeat');
                    var rowName = rowCollection.substring(0, rowCollection.indexOf(' '));
                    var rowDataTD = parsedHtml[0].children[0].children;

                    tElement.children().eq(0).attr('ng-repeat-start', rowCollection);
                    tElement.children().eq(0).children()[0].innerText = '{{' + rowName + '.key}} ({{' + rowName + '.items.length}})';
                    tElement.children().eq(0).children()[0].innerHTML = '<i ng-class="show ? \'fa fa-angle-down\':\'fa fa-angle-right\'" aria-hidden="true"></i> {{row.key}} ({{row.items.length}})';
                    tElement.children().eq(1).attr('ng-repeat', rowName + ' in ' + rowName + '.items');
                    tElement.children().eq(1).append(rowDataTD);

                }
            }
        };
    }

    
})();
(function () {
    "use strict";
    /**
    * @ngdoc directive
    * @module siemens.simaticit.common.widgets.table 
    * @name sitTablePager
    * 
    * @restrict AE
    *
    * @usage 
    * As an attribute:
    * ```
    * <span sit-table-pager></span>
    * ```
    *
    * @description 
	* Provides a UI for defining the pager.
    *
    */
    function sitTablePager() {
        return {
            restrict: 'AE',
            require: '^sitTable',
            replace: true,
            template: '<td><div st-pagination="" st-items-by-page="itemsByPage" st-page-sizes="displayedPages" st-template="template/smart-table/custom-pagination.html"></div></td>',
            link: function (scope, element, attrs, ctrl) {
                scope.itemsByPage = ctrl.sitConfig.pageSizeDefault;
                scope.displayedPages = ctrl.sitConfig.pageSizes;
            }
        };
    }

    angular.module('siemens.simaticit.common.widgets.table').directive('sitTablePager', sitTablePager);

})();
// © Siemens AG, 2017
// This file has been modified as per the requirements in the SIMATIC IT App

//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table')
        .directive('stPagination', ['sitConfiguration', function (sitConfiguration) {
            return {
                restrict: 'EA',
                require: '^sitTable',
                scope: {
                    stItemsByPage: '=?',
                    stDisplayedPages: '=?',
                    stPageSizes:'=?',
                    stPageChange: '&'
                },
                templateUrl: function (element, attrs) {
                    if (attrs.stTemplate) {
                        return attrs.stTemplate;
                    }
                    return sitConfiguration.pagination.template;
                },
                link: function (scope, element, attrs, ctrl) {

                    scope.stPageSizes = scope.stPageSizes ? (scope.stPageSizes) : sitConfiguration.pagination.pageSizes;
                    scope.stItemsByPage = scope.stItemsByPage ? (scope.stItemsByPage) : sitConfiguration.pagination.itemsByPage;
                    if (scope.stPageSizes.indexOf(scope.stItemsByPage) === -1) {
                        scope.stItemsByPage = scope.stPageSizes[0];
                    }
                    scope.stDisplayedPages = scope.stDisplayedPages ? (scope.stDisplayedPages) : sitConfiguration.pagination.displayedPages;

                    scope.currentPage = 1;
                    scope.pages = [];

                    function redraw() {
                        var paginationState = ctrl.tableState().pagination;
                        var start = 1;
                        var end;
                        var i;
                        var prevPage = scope.currentPage;
                        scope.selectionMode = ctrl.tableState().selectionMode;
                        scope.selectedItems = paginationState.selectedItems;
                        scope.totalItemCount = paginationState.totalItemCount;
                        scope.currentPage = Math.floor(paginationState.start / paginationState.number) + 1;

                        start = Math.max(start, scope.currentPage - Math.abs(Math.floor(scope.stDisplayedPages / 2)));
                        end = start + scope.stDisplayedPages;

                        if (end > paginationState.numberOfPages) {
                            end = paginationState.numberOfPages + 1;
                            start = Math.max(1, end - scope.stDisplayedPages);
                        }

                        scope.pages = [];
                        scope.numPages = paginationState.numberOfPages;

                        for (i = start; i < end; i++) {
                            scope.pages.push(i);
                        }

                        if (prevPage !== scope.currentPage) {
                            scope.stPageChange({ newPage: scope.currentPage });
                        }

                    }

                    //function setThWidths() {
                    //    //var table
                    //    var ths = $('table thead tr th');
                    //    var length = ths.length;
                    //    var i = 0;
                    //    for (i; i < length; i++) {
                    //        var width = $("table tr td:nth-of-type(" + (i + 1) + ")").width();
                    //        $("table thead tr th:nth-of-type(" + (i + 1) + ")").width(width);
                    //    }

                    //}

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().pagination;
                    }, redraw, true);

                    //scope --> table state  (--> view)
                    scope.$watch('stItemsByPage', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            scope.selectPage(1);
                        }
                    });

                    scope.$watch('stDisplayedPages', redraw);

                    //view -> table state
                    scope.selectPage = function (page) {
                        if (page > 0 && page <= scope.numPages) {
                            ctrl.slice((page - 1) * scope.stItemsByPage, scope.stItemsByPage, page);
                        }
                    };

                    scope.cantPageBackward = function (page) {
                        return page <= 1;
                    }

                    scope.cantPageForward = function(page) {
                        return page === scope.numPages;
                    }

                    if (!ctrl.tableState().pagination.number) {
                        ctrl.slice(0, scope.stItemsByPage, 1);
                    }
                }
            };
        }]);

})();

// © Siemens AG, 2017
// This file has been modified as per the requirements in the SIMATIC IT App
//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';
 
    angular.module('siemens.simaticit.common.widgets.table')
        .directive('stPipe', ['sitConfiguration', '$timeout', function (config, $timeout) {
            return {
                require: 'sitTable',
                scope: {
                    stPipe: '='
                },
                link: {

                    pre: function (scope, element, attrs, ctrl) {

                        var pipePromise = null;

                        if (angular.isFunction(scope.stPipe)) {
                            ctrl.preventPipeOnWatch();
                            ctrl.pipe = function () {

                                if (pipePromise !== null) {
                                    $timeout.cancel(pipePromise)
                                }

                                pipePromise = $timeout(function () {
                                    scope.stPipe(ctrl.tableState(), ctrl);
                                }, config.pipe.delay);

                                return pipePromise;
                            }
                        }
                    },

                    post: function (scope, element, attrs, ctrl) {
                        ctrl.pipe();
                    }
                }
            };
        }]);

})();

// © Siemens AG, 2017
// This file has been modified as per the requirements in the SIMATIC IT App
//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table')
        .directive('stSearch', ['sitConfiguration', '$timeout', '$parse', function (sitConfiguration, $timeout, $parse) {
            return {
                require: '^sitTable',
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var promise = null;
                    var throttle = attr.stDelay || sitConfiguration.search.delay;
                    var event = attr.stInputEvent || sitConfiguration.search.inputEvent;

                    attr.$observe('stSearch', function (newValue, oldValue) {
                        var input = element[0].value;
                        if (newValue !== oldValue && input) {
                            ctrl.tableState().search = {};
                            tableCtrl.search(input, newValue);
                        }
                    });

                    //table state -> view
                    scope.$watch(function () {
                        return ctrl.tableState().search;
                    }, function (newValue) {
                        var predicateExpression = attr.stSearch || '$';
                        if (newValue.predicateObject && $parse(predicateExpression)(newValue.predicateObject) !== element[0].value) {
                            element[0].value = $parse(predicateExpression)(newValue.predicateObject) || '';
                        }
                    }, true);

                    function onSearchEvent(evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }

                        promise = $timeout(function () {
                            tableCtrl.search(evt.target.value, attr.stSearch || '');
                            promise = null;
                        }, throttle);
                    }

                    // view -> table state
                    element.bind(event, onSearchEvent);

                    scope.$on('$destroy', function () {
                        element.unbind(event, onSearchEvent);
                    });
                }
            };
        }]);

})();

// © Siemens AG, 2017
// This file has been modified as per the requirements in the SIMATIC IT App

//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table')
        .directive('sitSelectRow', ['sitConfiguration', function (sitConfiguration) {
            return {
                restrict: 'A',
                scope: {
                    row: '=sitSelectRow'
                },
                link: function (scope, element, attr) {
                    var tableCtrl = element.controller('sitTable');
                    var mode;

                    function selectRow() {
                        scope.$apply(function () {
                            tableCtrl.select(scope.row, mode);
                        });
                    }

                    if (tableCtrl) {
                        mode = tableCtrl.tableState().selectionMode || attr.sitSelectMode || sitConfiguration.select.mode;
                        if (mode !== 'none') {
                            element.bind('click', selectRow);
                        }
                        if (scope.row.isSelected) {
                            element.addClass(sitConfiguration.select.selectedClass);
                        }
                        scope.$watch('row.isSelected', function (newValue) {
                            if (newValue === true) {
                                element.addClass(sitConfiguration.select.selectedClass);
                            } else {
                                element.removeClass(sitConfiguration.select.selectedClass);
                            }
                        });
                    }

                    scope.$on('$destroy', function () {
                        element.unbind('click', selectRow);
                    });
                }
            };
        }]);

})();

(function () {
    "use strict";
    angular.module('siemens.simaticit.common.widgets.table').directive('sitTableSeparator', sitTableSeparator);

    function sitTableSeparator() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<div class="sit-table-separator"><span></span></div>'
        };
    }
})();
// © Siemens AG, 2017
// This file has been modified as per the requirements in the SIMATIC IT App

//Copyright (C) 2016 Laurent Renard.

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to deal in the Software without restriction, 
//including without limitation the rights to use, copy, modify, merge, publish, distribute, 
//sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or 
//substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
//DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.table')
      .directive('stSort', ['sitConfiguration', '$parse', '$timeout', function (sitConfiguration, $parse, $timeout) {
          return {
              restrict: 'A',
              require: '^sitTable',
              link: function (scope, element, attr, ctrl) {

                  var predicate = attr.stSort;
                  var getter = $parse(predicate);
                  var index = 0;
                  var classAscent = attr.stClassAscent || sitConfiguration.sort.ascentClass;
                  var classDescent = attr.stClassDescent || sitConfiguration.sort.descentClass;
                  var stateClasses = [classAscent, classDescent];
                  var sortDefault;
                  var skipNatural = attr.stSkipNatural !== undefined ? attr.stSkipNatural : sitConfiguration.sort.skipNatural;
                  var descendingFirst = attr.stDescendingFirst !== undefined ? attr.stDescendingFirst : sitConfiguration.sort.descendingFirst;
                  var promise = null;
                  var throttle = attr.stDelay || sitConfiguration.sort.delay;

                  if (attr.stSortDefault) {
                      sortDefault = scope.$eval(attr.stSortDefault) !== undefined ? scope.$eval(attr.stSortDefault) : attr.stSortDefault;
                  }

                  //view --> table state
                  function sort() {
                      if (descendingFirst) {
                          index = index === 0 ? 2 : index - 1;
                      } else {
                          index++;
                      }

                      var func;
                      predicate = angular.isFunction(getter(scope)) || angular.isArray(getter(scope)) ? getter(scope) : attr.stSort;
                      //TODO:  if (index % 3 === 0 && !!skipNatural !== true)
                      //Why do wee need !!skipNatural
                      if (index % 3 === 0 && skipNatural !== true) {
                          //manual reset
                          index = 0;
                          ctrl.tableState().sort = {};
                          ctrl.tableState().pagination.start = 0;
                          func = ctrl.pipe.bind(ctrl);
                      } else {
                          func = ctrl.sortBy.bind(ctrl, predicate, index % 2 === 0);
                      }
                      if (promise !== null) {
                          $timeout.cancel(promise);
                      }
                      if (throttle < 0) {
                          func();
                      } else {
                          promise = $timeout(func, throttle);
                      }
                  }

                  function sortClick() {
                      if (predicate) {
                          scope.$apply(sort);
                      }
                  }

                  element.bind('click', sortClick);

                  if (sortDefault) {
                      index = sortDefault === 'reverse' ? 1 : 0;
                      sort();
                  }

                  //table state --> view
                  scope.$watch(function () {
                      return ctrl.tableState().sort;
                  }, function (newValue) {
                      if (newValue.predicate !== predicate) {
                          index = 0;
                          element
                            .removeClass(classAscent)
                            .removeClass(classDescent);
                      } else {
                          index = newValue.reverse === true ? 2 : 1;
                          element
                            .removeClass(stateClasses[index % 2])
                            .addClass(stateClasses[index - 1]);
                      }
                  }, true);

                  scope.$on('$destroy', function () {
                      element.unbind('click', sortClick);
                  });
              }
          };
      }]);

})();
