/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/**
 * @ngdoc module
 * @name siemens.simaticit.common.widgets.pager
 * @description
 * @access internal
 * This module provides functionalities related to paging a collection of data items.
 */
(function () {
	'use strict';

	angular.module('siemens.simaticit.common.widgets.pager', [
        'siemens.simaticit.common.services.filterSort',
        'siemens.simaticit.common.widgets.filter'
	]);

})();
(function () {
    'use strict';
    /**
    * @ngdoc object
    * @module siemens.simaticit.common.widgets.pager
    * @name LocalDataManager
    * @access internal
    * @description
    * Manages a specific data collection.
    * 
    */
    function LocalDM(config, localData, uySortService, $q, logger, sitFilterService) {
        var ldm = this;

        ldm.logger = logger.getModuleLogger('siemens.simaticit.common.widgets.pager');

        //ldm.logger.log('creating local DM instance with data length: ' + localData.length);
        /**
         * private data
         */      
        var currentPage = config.pagingOptions.currentPage;
        var pageSize = config.pagingOptions.pageSize;
        var data = localData ? localData : [];
        var searchText = config.quickSearchOptions.filterText;
        var searchField = config.quickSearchOptions.field;
        var sortField = config.sortInfo.field;
        var sortDirection = config.sortInfo.direction && config.sortInfo.direction.toLowerCase ? config.sortInfo.direction.toLowerCase() : '';
        var quickSearchFilter = null;
        var filteredData = data;
        var filterClauses;

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#isServerData
         * @access internal
         * @description
         * Returns **false** since this object only manages local data.
         */
        ldm.isServerData = function () { return false; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getPageData
         * @access internal
         * @description
         * Retrieves the current page of data including the page number and total data item count. 
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object containing the following:
         * * the data items for the current page
         * * the current page number
         * * the total count of all data items
         * 
         * The object has the following format
         * ```
         *     {
         *         data: [Object, Object, ...], 
         *         currentPage: 3,
         *         totalDataSize: 147
         *     }
         * ```
         */
        ldm.getPageData = function () {        
            if (currentPage <= 0) {
                currentPage = 1;
            }
            var endRow = currentPage * pageSize;
            var startRow = endRow - pageSize;
            var dataObj = {
                data: null,
                currentPage: 1,
                totalDataSize: 0
            };
            if (startRow >= filteredData.length) {
                dataObj.data = filteredData.slice(0, pageSize),
                dataObj.currentPage = 1,
                dataObj.totalDataSize = filteredData.length
            }
            else {
                dataObj.data = endRow > filteredData.length ? filteredData.slice(startRow) : filteredData.slice(startRow, endRow),
                dataObj.currentPage = currentPage,
                dataObj.totalDataSize = filteredData.length
            }
            

            // for consistency with serverDataService, return result with a promise
            var deferred = $q.defer();
            deferred.resolve(dataObj);
            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#goToPage
         * @access internal
         * @description
         * Retrieves a page of data after setting the current page to the specified value. 
         * 
         * @param {Number} [page]
         * The page number to set as the current page.
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object with the same format as for {@link siemens.simaticit.common.widgets.pager.LocalDataManager#getPageData getPageData}
         * 
         */
        ldm.goToPage = function (page) {
            if (page) {            
                currentPage = page;
            }
            // return value is a promise
            return ldm.getPageData();
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#nextPage
         * @access internal
         * @description
         * Retrieves a page of data after incrementing the current page by one.
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object with the same format as for {@link siemens.simaticit.common.widgets.pager.LocalDataManager#getPageData getPageData}
         * 
         */
        ldm.nextPage = function () {
            // return value is a promise
            return ldm.goToPage(currentPage + 1);
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#prevPage
         * @access internal
         * @description
         * Retrieves a page of data after decrementing the current page by one.
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object with the same format as for {@link siemens.simaticit.common.widgets.pager.LocalDataManager#getPageData getPageData}
         * 
         */
        ldm.prevPage = function () {
            // return value is a promise
            return ldm.goToPage(currentPage - 1);
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setSortInfo
         * @access internal
         * @description
         * Sets the data field and direction for sorting the data collection.
         * 
         * @param {string} [field]
         * The name of the field to sort by.
         * 
         * @param {String } [direction]
         * The direction of the sort. Must be **asc** or **desc** case-insensitive.
         */
        ldm.setSortInfo = function (field, direction) {
            sortField = field;
            sortDirection = direction && direction.toLowerCase ? direction.toLowerCase() : '';
            doSort();
        };


        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getSortInfo
         * @access internal
         * @description
         * Retrieves the current field and direction used for sorting.
         * 
         * @returns {Object}
         * An object containing the sort field and direction.
         * 
         * The object has the following format
         * ```
         *     {
         *         field: "lastName",
         *         direction: "desc"
         *     }
         * ```
         * 
         */
        ldm.getSortInfo = function () {
            return {
                field: sortField,
                direction: sortDirection
            };
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getCurrentPage
         * @access internal
         * @description
         * Retrieves the number of the current page. 
         * 
         * @returns {Number}
         * The current page number.
         * 
         */
        ldm.getCurrentPage = function () { return currentPage; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setCurrentPage
         * @access internal
         * @description
         * Sets the current page to the specified value. 
         * 
         * @param {Number} [page]
         * The page number to set as the current page.
         * 
         */
        ldm.setCurrentPage = function (val) { currentPage = val; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getPageSize
         * @access internal
         * @description
         * Retrieves the current page size. 
         * 
         * @returns {Number}
         * The current page size.
         * 
         */
        ldm.getPageSize = function () { return pageSize; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setPageSize
         * @access internal
         * @description
         * Sets the size used for a page of data.
         * 
         * This may change the current page.
         * For example, consider current values of:
         * * total item count of 100 
         * * current page size of 10
         * * current page of 10
         * 
         * If the page size is changed to 25, then 10 is no longer a valid current page.
         * The current page must be changed. 
         * 
         * The data manager will try to set the new current page to the one containing the first item in the old current page.
         * 
         * @param {Number} [size]
         * The number of items to include in a page of data.
         * 
         */
        ldm.setPageSize = function (size) {
            //todo: error check size is one of the allowed sizes
            //get the first row of the current page so we can try and send back data containing this.
            var currentRow = ((currentPage - 1) * pageSize) + 1;
            pageSize = size;
            //page containing current row changed, get it
            var newPage = Math.ceil(currentRow / pageSize);           
            currentPage = (newPage === 0) ? 1 : newPage;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getAllData
         * @access internal
         * @description
         * Retrieves all data items. 
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object containing the following:
         * * all data items
         * * the current page set to zero indicating all data
         * * the total count of data items
         * 
         * The object has the following format
         * ```
         *     {
         *         data: [Object, Object, ...], 
         *         currentPage: 0,
         *         totalDataSize: 147
         *     }
         * ```
         */
        ldm.getAllData = function () {
            var dataObj = {
                data: filteredData.slice(0), //return a new array to get grid to respond to change
                currentPage: 0,
                //filteredDataSize: filteredData.length,
                totalDataSize: filteredData.length
            };

            // for consistency with serverDataService, return result with a promise
            var deferred = $q.defer();
            deferred.resolve(dataObj);
            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getTotalItemCount
         * @access internal
         * @description
         * Retrieves the count of all data items. 
         * 
         * The count is set after filtering by the configured **quickSearchOptions**.
         * For example, if the total number of **person** entities in a database is 1000,
         * but this is reduced to 85 after applying search options, then the total count returned is 85.
         * If no filter options are set, the returned value would be 1000. 
         * 
         * @returns {Number}
         * The data item count.
         * 
         */
        ldm.getTotalItemCount = function () {
            return filteredData.length;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getPageCount
         * @access internal
         * @description
         * Retrieves the number of pages. 
         * 
         * The count is set after filtering by the configured **quickSearchOptions**.
         * For example, if the total number of **person** entities in a database is 1000,
         * but this is reduced to 85 after applying search options, then a page size of 25 results in a page count of 4.
         * If no filter options are set, the page count would be 40. 
         * 
         * @returns {Number}
         * The page count.
         * 
         */
        ldm.getPageCount = function () {
            return Math.ceil(ldm.getTotalItemCount() / ldm.getPageSize());
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getSearchText
         * @access internal
         * @description
         * Retrieves the text currently used for matching against the configured quick search field. 
         * 
         * @returns {String}
         * The search text.
         * 
         */
        ldm.getSearchText = function () { return searchText; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setSearchText
         * @access internal
         * @description
         * Sets the text to use for matching against the configured quick search field. 
         * 
         * @param {String} [searchText]
         * The text to use for searching.
         * 
         */
        ldm.setSearchText = function (val) {
            //if (searchText !== val) {
            searchText = val;
            setFilteredData();
            //return ldm.goToPage(1);
            //}
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setFilter
         * @access internal
         * @description
         * Sets the filter function to use when getting a page of data.
         * 
         */
        ldm.setFilter = function (clauses) {
            filterClauses = clauses;
            setFilteredData();
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#getSearchField
         * @access internal
         * @description
         * Retrieves the field name currently used for matching quick search text. 
         * 
         * @returns {String}
         * A field name.
         * 
         */
        ldm.getSearchField = function () { return searchField; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setSearchField
         * @access internal
         * @description
         * Sets the field to use for matching quick search text. 
         * 
         * @param {String} [searchField]
         * The field to use for searching.
         * 
         */
        ldm.setSearchField = function (val) {
            searchField = val;
            setQuickSearchFilter();
        };

        /**
         * private methods
         */
        /*jshint unused:false*/
        function doSort() {
            if (sortField && (sortDirection === 'asc' || sortDirection === 'desc')) {
                // sort service requires array of objects
                var sortInfo = [{ field: sortField, direction: sortDirection }];
                uySortService.sort(sortInfo, data);
                setFilteredData();
            }
        }
        /*jshint unused:true*/

        function setQuickSearchFilter() {
            quickSearchFilter = config.quickSearchOptions.enabled && searchField ? sitFilterService.getQuickSearchFilter(searchField) : null;
        }

        function setFilteredData() {
            // filter by search text first. it may be simpler and faster (not verified as of 5/27/2015)
            filteredData = quickSearchFilter ? quickSearchFilter.getFilteredData(data, searchText) : data;

            if (filterClauses && filterClauses.length) {
                filteredData = sitFilterService.filterArray(filterClauses, filteredData);
            }
        }

        function initialize() {
            setQuickSearchFilter();
            setFilteredData();
        }
        initialize();

    }

    function localDataService(uySortService, $q, logger, sitFilterService) {
        var svc = this;
        var configDefaults;
        function init() {
            configDefaults = {
                pagingOptions: {
                    currentPage: 1,
                    pageSize: 25
                },
                quickSearchOptions: {
                    enabled: false,
                    field: '',
                    filterText: ''
                },
                sortInfo: {
                    field: '',
                    direction: ''
                }
            };

            svc.getDataManager = getDataManager;
        }
        function activate() {
            init();
        }
        
        activate();

        function setConfigDefaults(config) {
            if (!config.pagingOptions) {
                config.pagingOptions = configDefaults.pagingOptions;
            } else {
                if (!config.pagingOptions.currentPage) {
                    config.pagingOptions.currentPage = configDefaults.pagingOptions.currentPage;
                }
                if (!config.pagingOptions.pageSize) {
                    config.pagingOptions.pageSize = configDefaults.pagingOptions.pageSize;
                }
            }

            if (!config.quickSearchOptions) {
                config.quickSearchOptions = configDefaults.quickSearchOptions;
            }

            if (!config.sortInfo) {
                config.sortInfo = configDefaults.sortInfo;
            }
        }

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name common.widgets.pager.localDataService#getDataManager
         * @access internal
         * @description
         * Retrieves an object that manages paging, sorting and searching an array of data items.
         * 
         * @param {Object} [config]
         * Configures an instance of a data manager.
         * * **pagingOptions**
         *   * **currentPage**: Defines the current page of data when paging.
         *   * **pageSize**: Defines the number of data items in page.
         * * **quickSearchOptions**
         *   * **enabled**: Determines if quick search filtering is performed.
         *   * **field**: The name of the field to use for quick search. 
         *   * **filterText**: Text to compare against the configured field. Compare operation does a "begins with" match. 
         * * **sortInfo**
         *   * **field**: The name of the field to sort by.
         *   * **direction**: Must be `asc` or `desc` case insensitive.
         * 
         * @param {Object[]} [localData]
         * The data items to be managed by the data manager.
         * 
         * @returns {Object}
         * An object configured to manage the data array.
         */
         function getDataManager(config, localData) {
            setConfigDefaults(config);
            return new LocalDM(config, localData, uySortService, $q, logger, sitFilterService);
        }
    }

    /**
     * @ngdoc service
     * @name common.widgets.pager.localDataService
     * @module siemens.simaticit.common.widgets.pager
     * @description
     * @access internal
     * Provides functionality to support working with an array of data.
     */
    angular.module('siemens.simaticit.common.widgets.pager').service('common.widgets.pager.localDataService', ['common.services.filterSort.service', '$q', 'common.services.logger.service', 'common.widgets.filter.service', localDataService]);
})();
/*jshint -W098 */
(function () {
    'use strict';

    /**
	 * @ngdoc directive
	 * @name sitPager
     * @access internal
	 * @description Directive with UI for navigating through multiple pages of data.
	 * @module siemens.simaticit.common.widgets.pager
	 */
    angular.module('siemens.simaticit.common.widgets.pager').directive('sitPager', PagerDirective);

    function PagerDirective() {
        return {
            restrict: 'E',
            bindToController: {
                pagingOptions: '=sitPagingOptions'
            },
            scope: {},
            link: function (scope, element, attr, ctrl) {
                //watch for count changes from parent
                scope.$watch(function () {
                    return ctrl.pagingOptions.totalItems;
                }, function (newVal, oldVal) {
                    //scope.totalItems = ctrl.pagingOptions.totalItems;
                    ctrl.setMaxPage();
                });

                scope.$watch(function () {
                    return ctrl.pagingOptions.pageSize;
                }, function (newVal, oldVal) {
                    if (oldVal !== newVal && ctrl.pagingOptions.pageSizeChangeCallback) {
                        ctrl.pagingOptions.pageSizeChangeCallback(newVal);
                        ctrl.setMaxPage();
                    }
                });

                // note: below mess is attempt to avoid circular watches. 
                // we want to bind the current page from the options object to the UI text box,
                // but we also want to call back when user changes current page.
                // we don't want programmatic change of options object value to trigger a callback.
                // so we need to distinguish beteen value changing programmatically and user changing. 

                // the current page on the options object
                // watching this responds to owner programmatically changing current page
                scope.$watch(function () {
                    return ctrl.pagingOptions.currentPage;
                }, function (newVal, oldVal) {
                    if (oldVal !== newVal) {
                        if (ctrl.userUpdate) {
                            ctrl.userUpdate = false;
                        } else {
                            // flag other watch to not callback and bind new page to UI
                            ctrl.apiUpdate = true;
                            ctrl.currentPage = newVal;
                        }
                    }
                });

                // utility function.  This really should be in some kind of utility service...
                function isInt(x) {
                    var y = parseInt(x, 10);
                    return !isNaN(y) && x === y && x.toString() === y.toString();
                }

                // the current page bound to the UI text box
                // watching this responds to the user changing the current page
                scope.$watch(function () {
                    return ctrl.currentPage;
                }, function (newVal, oldVal) {
                    if (!isInt(newVal) || undefined === oldVal) {
                        return;
                    }

                    if (oldVal !== newVal) {
                        if (ctrl.apiUpdate) {
                            ctrl.apiUpdate = false;
                            ctrl.pagingOptions.pageChangeCallback(newVal);
                        } else {
                            // flag other watch to not set UI value again and bind new value to options object
                            ctrl.userUpdate = true;
                            ctrl.pagingOptions.currentPage = newVal;
                            if (ctrl.pagingOptions.pageChangeCallback) {
                                ctrl.pagingOptions.pageChangeCallback(newVal);
                            }
                        }
                    }
                });
            },
            templateUrl: 'common/widgets/pager/pager.html',
            controller: PagerController,
            controllerAs: 'pagerCtrl'
        };
    }

    PagerController.$inject = ['common.widgets.pager.pageService'];

    function PagerController(sitPageService) {
        var vm = this;
        function init() {
            //initialize max page to some large number. will be reset when total items changes
            vm.maxPage = 1000;
            // initialize the current page after setting flag that blocks the callback
            vm.currentPage = vm.pagingOptions.currentPage;
            //attach functions to controller
            vm.pageToFirst = pageToFirst;
            vm.pageBackward = pageBackward;
            vm.pageForward = pageForward;
            vm.pageToLast = pageToLast;
            vm.footerStyle = footerStyle;
            vm.setMaxPage = setMaxPage;
            vm.cantPageBackward = cantPageBackward;
            vm.cantPageForward = cantPageForward;
            vm.cantPageToLast = cantPageToLast;
        }

        function activate() {
            init();
            sitPageService.setConfigurationDefaults(vm.pagingOptions);
        }
        activate();

        sitPageService.setConfigurationDefaults(vm.pagingOptions);

        function pageToFirst() {
            vm.currentPage = 1;
        }
        function pageBackward() {
            if (vm.currentPage > 1)
            { vm.currentPage -= 1; }
        }
        function pageForward() {
            if (vm.currentPage < vm.maxPage)
            { vm.currentPage += 1; }
        }
        function pageToLast() {
            vm.currentPage = vm.maxPage;
        }

        function footerStyle() {
            return { "width": "100%", "height": 55 + "px" };
        }

        function setMaxPage() {
            vm.maxPage = Math.ceil(vm.pagingOptions.totalItems / vm.pagingOptions.pageSize);
        }
        function cantPageForward() {
            return vm.currentPage === vm.maxPage;

        }
        function cantPageToLast() {
            return vm.currentPage === vm.maxPage;
        }

        function cantPageBackward() {
            return vm.currentPage <= 1;
        }
    }

})();

/*jshint -W117 */
(function () {
    'use strict';

    function pageManagerService(sitLocalDataService, sitServerDataService) {
        var svc = this;
        var defaultConfiguration;
        function init() {
            defaultConfiguration = {
                pageSizes: [10, 25, 50, 100, 250],
                pageSize: 10,
                currentPage: 1,
                serverDataOptions: false,
                totalItems: 0,
                filterItems: 0,
                selectedItems: 0,
                pageChangeCallback: null,
                pageSizeChangeCallback: null
            };
        }
        function activate() {
            init();
        }
        
        activate();

        svc.setConfigurationDefaults = function (config) {
            // create an object that has all the originial settings plus the defaults
            var configWithDefaults = $.extend({}, defaultConfiguration, config);
            // update the original obect with default values
            $.extend(config, configWithDefaults);
            return config;
        };

            /**
             * @ngdoc method
             * @module siemens.simaticit.common.widgets.pager
             * @name common.widgets.pager.pageService#getPageManager
             * @access internal
             * @description
             * Constructs and returns an object for managing data paging.
             * 
             * @param {Object} [config]
             * An object configuring options for the data paging.  See config param for 
             * {@link common.widgets.pager.localDataService#getDataManager getDataManager} method of sitLocalDataService or
             * config param for {@link common.widgets.pager.serverDataService#getDataManager getDataManager} method of common.widgets.pager.serverDataService
             * 
             * @param {Object[]} [localData]
             * The data items to be managed by the data manager.  
             * 
             * @returns {Object}
             * 
             * A data manager object for either local data or server data.  If the given config parameter has server data options set, 
             * the returned data manager object will be a server data manager.  Otherwise, it will be a local data manager.
             * 
             */
        svc.getPageManager = function getPageManager(config, localData) {
            if (config.serverDataOptions) {
                //return new serverDataManager(config.pagingOptions, config.serverDataOptions);
                return sitServerDataService.getDataManager(config);
            } else {
                return sitLocalDataService.getDataManager(config, localData);
            }
        };
    }

    /**
     * @ngdoc service
     * @name common.widgets.pager.pageService
     * @module siemens.simaticit.common.widgets.pager
     * @access internal
     * @description
     * _(Internal)_ Provides functionality to support paging through an array of data.
     */
    angular.module('siemens.simaticit.common.widgets.pager').service('common.widgets.pager.pageService', ['common.widgets.pager.localDataService', 'common.widgets.pager.serverDataService', pageManagerService]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc object
     * @module siemens.simaticit.common.widgets.pager
     * @name ServerDataManager
     * @access internal
     * @description
     * Manages retrieving data from a configured presentation service for a specific entity.
     * 
     */
    function ServerDM(config, $q, logger, sitFilterService) {
        var sdm = this;

        sdm.logger = logger.getModuleLogger('siemens.simaticit.common.widgets.pager');

        // private data
        var currentPage = config.pagingOptions.currentPage;
        var pageSize = config.pagingOptions.pageSize;
        var searchText = config.quickSearchOptions.filterText;
        var searchField = config.quickSearchOptions.field;
        var quickSearchEnabled = config.quickSearchOptions.enabled;
        var sortField = config.sortInfo.field;
        var sortDirection = (config.sortInfo.direction && config.sortInfo.direction.toLowerCase) ? config.sortInfo.direction.toLowerCase() : '';
        var dataCount; 
        var filterQueryString = "";
        var filterClauses = [];

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#isServerData
         * @access internal
         * @description
         * Returns **true** since this object only manages retrieving data through a presentation service.
         */
        sdm.isServerData = function () { return true; };

        // are we waiting for the server to return with data?
        sdm.waitingForServer = false;

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getPageData
         * @access internal
         * @description
         * Retrieves the current page of data including the page number and total data item count. 
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object containing the following:
         * * the data items for the current page
         * * the current page number
         * * the total count of all data items
         * 
         * The object has the following format
         * ```
         *     {
         *         data: [Object, Object, ...], 
         *         currentPage: 3,
         *         totalDataSize: 147
         *     }
         * ```
         */
        sdm.getPageData = function () {
            var deferred = $q.defer();

            var endRow = currentPage * pageSize;
            var startRow = endRow - pageSize;

            if (dataCount && (startRow > dataCount)) {
                throw new Error('Invalid arguments. page: [' + currentPage + '],  pageSize: [' + pageSize + '], start row: [' + startRow + '], data length: [' + dataCount + ']');
            }

            sdm.loadPageOfData(
                config.serverDataOptions.dataService,
                config.serverDataOptions.dataEntity,
                config.serverDataOptions.optionsString,
                config.serverDataOptions.appName,
                currentPage,
                pageSize,
                quickSearchEnabled ? { field: searchField, text: searchText } : {},
                { field: sortField, direction: sortDirection },
                config.serverDataOptions.onBeforeDataLoadCallBack
            ).then(
                function (response) {
                    // TODO - need this?
                    dataCount = response.totalDataCount;

                    deferred.resolve({
                        data: response.pageData,
                        currentPage: currentPage,
                        totalDataSize: response.totalDataCount
                    });
                },
                function (rejectReason) {
                    deferred.reject(rejectReason);
                }
            );

            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#goToPage
         * @access internal
         * @description
         * Retrieves a page of data after setting the current page to the specified value. 
         * 
         * @param {Number} [page]
         * The page number to set as the current page.
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object with the same format as for {@link siemens.simaticit.common.widgets.pager.ServerDataManager#getPageData getPageData}
         * 
         */
        sdm.goToPage = function (page) {
            page = page || currentPage;
            var startRow = (page * pageSize) - pageSize;
            if (startRow > dataCount)
            { throw new Error('Invalid arguments. page: [' + page + '],  pageSize: [' + pageSize + '], start row: [' + startRow + '], data length: [' + dataCount + ']'); }

            currentPage = page;
            return sdm.getPageData();
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#nextPage
         * @access internal
         * @description
         * Retrieves a page of data after incrementing the current page by one.
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object with the same format as for {@link siemens.simaticit.common.widgets.pager.ServerDataManager#getPageData getPageData}
         * 
         */
        sdm.nextPage = function () {
            return sdm.goToPage(currentPage + 1);
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#prevPage
         * @access internal
         * @description
         * Retrieves a page of data after decrementing the current page by one.
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object with the same format as for {@link siemens.simaticit.common.widgets.pager.ServerDataManager#getPageData getPageData}
         * 
         */
        sdm.prevPage = function () {
            return sdm.goToPage(currentPage - 1);
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getCurrentPage
         * @access internal
         * @description
         * Retrieves the number of the current page. 
         * 
         * @returns {Number}
         * The current page number.
         * 
         */
        sdm.getCurrentPage = function () { return currentPage; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#setCurrentPage
         * @access internal
         * @description
         * Sets the current page to the specified value. 
         * 
         * @param {Number} [page]
         * The page number to set as the current page.
         * 
         */
        sdm.setCurrentPage = function (val) { currentPage = val; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getPageSize
         * @access internal
         * @description
         * Retrieves the current page size. 
         * 
         * @returns {Number}
         * The current page size.
         * 
         */
        sdm.getPageSize = function () {
            return pageSize;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#setPageSize
         * @access internal
         * @description
         * Sets the size used for a page of data.
         * 
         * This may change the current page.
         * For example, consider current values of:
         * * total item count of 100 
         * * current page size of 10
         * * current page of 10
         * 
         * If the page size is changed to 25, then 10 is no longer a valid current page.
         * The current page must be changed. 
         * 
         * The data manager will try to set the new current page to the one containing the first item in the old current page.
         * 
         * @param {Number} [size]
         * The number of items to include in a page of data.
         * 
         */
        sdm.setPageSize = function (size) {
            var sizeInt = parseInt(size, 10);

            // check size is one of the allowed sizes (if specified)
            if (config.pagingOptions.pageSizes && !_.contains(config.pagingOptions.pageSizes, sizeInt)) {
                throw new Error('Size ' + size + ' is not in list of allowable sizes: ' + config.pagingOptions.pageSizes.join());
            }

            //get the first row of the current page so we can try and send back data containing this.
            var currentRow = ((currentPage - 1) * pageSize) + 1;
            pageSize = sizeInt;
            //page containing current row changed, get it
            var newPage = Math.ceil(currentRow / pageSize);
            currentPage = (newPage === 0) ? 1 : newPage;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getAllData
         * @access internal
         * @description
         * Retrieves all data items. 
         * 
         * @returns {Object}
         * A $q Promise
         * 
         * When resolved, the result is an object containing the following:
         * * all data items
         * * the current page set to zero indicating all data
         * * the total count of data items
         * 
         * The object has the following format
         * ```
         *     {
         *         data: [Object, Object, ...], 
         *         currentPage: 0,
         *         totalDataSize: 147
         *     }
         * ```
         */
        sdm.getAllData = function () {

            var deferred = $q.defer();

            sdm.loadPageOfData(
                config.serverDataOptions.dataService,
                config.serverDataOptions.dataEntity,
                config.serverDataOptions.optionsString,
                config.serverDataOptions.appName,
                0,
                0,
                quickSearchEnabled ? { field: searchField, text: searchText } : {},
                { field: sortField, direction: sortDirection },
                config.serverDataOptions.onBeforeDataLoadCallBack
            ).then(
                function (response) {
                    // TODO - need this?
                    dataCount = response.totalDataCount;

                    deferred.resolve({
                        data: response.pageData,
                        currentPage: currentPage,
                        totalDataSize: response.totalDataCount
                    });
                },
                function (rejectReason) {
                    deferred.reject(rejectReason);
                }
            );

            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getTotalItemCount
         * @access internal
         * @description
         * Retrieves the count of all data items. 
         * @access internal
         * The count is set after filtering by the configured **quickSearchOptions**.
         * For example, if the total number of **person** entities in a database is 1000,
         * but this is reduced to 85 after applying search options, then the total count returned is 85.
         * If no filter options are set, the returned value would be 1000. 
         * 
         * @returns {Number}
         * The data item count.
         * 
         */
        sdm.getTotalItemCount = function () {
            return dataCount;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getPageCount
         * @access internal
         * @description
         * Retrieves the number of pages. 
         * 
         * The count is set after filtering by the configured **quickSearchOptions**.
         * For example, if the total number of **person** entities in a database is 1000,
         * but this is reduced to 85 after applying search options, then a page size of 25 results in a page count of 4.
         * If no filter options are set, the page count would be 40. 
         * 
         * @returns {Number}
         * The page count.
         * 
         */
        sdm.getPageCount = function () {
            return Math.ceil(dataCount / pageSize);
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getSearchText
         * @access internal
         * @description
         * Retrieves the text currently used for matching against the configured quick search field. 
         * 
         * @returns {String}
         * The search text.
         * 
         */
        sdm.getSearchText = function () { return searchText; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#setSearchText
         * @access internal
         * @description
         * Sets the text to use for matching against the configured quick search field. 
         * 
         * @param {String} [searchText]
         * The text to use for searching.
         * 
         */
        sdm.setSearchText = function (newText) {
            searchText = newText;
            currentPage = 1;
            //return sdm.getPageData();
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name LocalDataManager#setFilter
         * @access internal
         * @description
         * sets the filter function to use when getting a page of data.
         * 
         */
        sdm.setFilter = function (clauses) {
            filterClauses = clauses;
            filterQueryString = sitFilterService.getODataFilterString(clauses);
        };


        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getSearchField
         * @access internal
         * @description
         * Retrieves the field name currently used for matching quick search text. 
         * 
         * @returns {String}
         * A field name.
         * 
         */
        sdm.getSearchField = function () { return searchField; };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#setSearchField
         * @access internal
         * @description
         * Sets the field to use for matching quick search text. 
         * 
         * @param {String} [searchField]
         * The field to use for searching.
         * 
         */
        sdm.setSearchField = function (newField) {
            searchField = newField;
            currentPage = 1;
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#setSortInfo
         * @access internal
         * @description
         * Sets the data field and direction for sorting the data collection.
         * 
         * @param {string} [field]
         * The name of the field to sort by.
         * 
         * @param {String } [direction]
         * The direction of the sort. Must be **asc** or **desc** case-insensitive.
         */
        sdm.setSortInfo = function (field, direction) {
            sortField = field;
            sortDirection = direction && direction.toLowerCase ? direction.toLowerCase() : '';
        };

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name ServerDataManager#getSortInfo
         * @access internal
         * @description
         * Retrieves the current field and direction used for sorting.
         * 
         * @returns {Object}
         * An object containing the sort field and direction.
         * 
         * The object has the following format
         * ```
         *     {
         *         field: "lastName",
         *         direction: "desc"
         *     }
         * ```
         * 
         */
        sdm.getSortInfo = function () {
            return {
                field: sortField,
                direction: sortDirection
            };
        };

        // utility function.  Could not find a jQuery or underscore way to do this!!!
        sdm.isInt = function (x) {
            var y = parseInt(x, 10);
            return !isNaN(y) && x === y && x.toString() === y.toString();
        };

        // get the '$filter' portion of the query string based on current quick search and filter values.
        // (mainly in a func for testing but also makes 'sdm.loadPageOfData' slightly more compact)
        function getFilterQueryString() {
            var qsText;
            var searchQueryString;
            var combinedQueryString = "";


            if (quickSearchEnabled && searchField && searchText !== undefined && searchText !== null && searchText.length > 0) {
                if (searchText[0] === "*") {
                    if (searchText[searchText.length - 1] === "*") {
                        // contains
                        qsText = searchText.substr(1, searchText.length - 2);
                        qsText = sitFilterService.escapeODataValue(qsText);
                        if (Object.prototype.toString.call(searchField) === '[object Array]') {
                            searchQueryString = constructQSString("contains", searchField, qsText);
                        } else {
                            searchQueryString = "contains(" + searchField + ",'" + qsText + "')";
                        }
                    } else {
                        // endsWith
                        qsText = searchText.substr(1);
                        qsText = sitFilterService.escapeODataValue(qsText);
                        if (Object.prototype.toString.call(searchField) === '[object Array]') {
                            searchQueryString = constructQSString("endswith", searchField, qsText);
                        } else {
                            searchQueryString = "endswith(" + searchField + ",'" + qsText + "')";
                        }
                    }
                } else {
                    // beginsWith
                    qsText = searchText.substr(0, searchText.length);
                    qsText = sitFilterService.escapeODataValue(qsText);
                    if (Object.prototype.toString.call(searchField) === '[object Array]') {
                        searchQueryString = constructQSString("startswith", searchField, qsText);
                    } else {
                        searchQueryString = "startswith(" + searchField + ",'" + qsText + "')";
                    }
                }
            }

            if (searchQueryString) {
                combinedQueryString = "$filter=" + searchQueryString;
                if (filterQueryString) {
                    combinedQueryString += " and (" + filterQueryString + ")";
                }
            } else if (filterQueryString) {
                combinedQueryString = "$filter=" + filterQueryString;
            }

            return combinedQueryString;
        }

        function constructQSString(odataFunction, searchField, qsText) {
            var qsString;
            var i = 0, length = searchField.length;
            for (i; i < length; i++) {
                qsString = qsString ? qsString + ' or ' : ''
                qsString += odataFunction+"(" + searchField[i] + ",'" + qsText + "')";
            }
            return qsString;
        }

        // constructs string and makes oData call to load data
        sdm.loadPageOfData = function (
                dataService,
                dataEntity,
                optionsString,
                appName,
                pageNumber,
                pageSize,
                filter,
                sort,
                onBeforeDataLoadCallBack) {

            // check service
            if ( (typeof dataService.getAll !== 'function') && (!appName)) {
                sdm.logger.logErr('The given service does not have a getAll function.');
                throw new Error('The given service does not have a getAll function.');
            }

            if ((typeof dataService.findAll !== 'function') && (appName)) {
                sdm.logger.logErr('The given service does not have a findAll function.If you defined in serverData appName the service must contain a findAll function');
                throw new Error('The given service does not have a findAll function.');
            }

            // check entity name
            if (!dataEntity) {
                sdm.logger.logErr(dataEntity + ' is not a valid value for data entity name.');
                throw new Error(dataEntity + ' is not a valid value for data entity name.');
            }

            // check page number, page size
            if (!sdm.isInt(pageNumber) /*|| pageNumber < 1*/) {
                sdm.logger.logErr(pageNumber + ' is not a valid value for page number.');
                throw new Error(pageNumber + ' is not a valid value for page number.');
            }

            if (!sdm.isInt(pageSize) /*|| pageSize < 1*/) {
                sdm.logger.logErr(pageSize + ' is not a valid value for page size.');
                throw new Error(pageSize + ' is not a valid value for page size.');
            }

             // string we are building with all options
            var fullOptionsString = '';

            if (onBeforeDataLoadCallBack && onBeforeDataLoadCallBack instanceof Function) {
                var configData  = { 
                    currentPage : currentPage,
                    pageSize : pageSize,
                    searchText : searchText,
                    searchField : searchField,
                    quickSearchEnabled : quickSearchEnabled,
                    sortField : sortField,
                    sortDirection : sortDirection,
                    filterClauses: filterClauses
                }
                fullOptionsString = onBeforeDataLoadCallBack(configData);
            } else {
                fullOptionsString += getFilterQueryString();
                // add page criteria
                var pageCriteria = '';
                if (pageSize && pageNumber) {
                    pageCriteria += fullOptionsString ? '&' : '';
                    pageCriteria += '$top=' + pageSize + '&$skip=' + (pageSize * (pageNumber - 1));
                }

                fullOptionsString += pageCriteria;

                // sort
                var sortCriteria = '';
                if (sort && sort.field) {
                    sortCriteria = fullOptionsString ? '&' : '';
                    var sortfield = (sort.field.replace) ? sort.field.replace(/\./g, "/") : (sort.field);
                    sortCriteria += '$orderby=' + sortfield;

                    if (sort.direction.toLowerCase() === 'asc' || sort.direction.toLowerCase() === 'desc') {
                        sortCriteria += ' ' + sort.direction.toLowerCase();
                    }
                }

                fullOptionsString += sortCriteria;

                // count
                var countCriteria = fullOptionsString ? '&' : '';
                countCriteria += '$count=true';

                fullOptionsString += countCriteria;

                // any aditional oData string
                var additionalCriteria = '';
                if (optionsString) {
                    additionalCriteria = fullOptionsString ? '&' : '';
                    additionalCriteria += optionsString;
                }

                fullOptionsString += additionalCriteria;
            }
           
            return sdm.loadDataFromODataString(dataService, dataEntity, fullOptionsString,appName);
        };

        sdm.loadDataFromODataString = function (dataService, dataEntity, optionsString, appName) {

            // we're waiting for a call to the server to return OR there's already a request waiting on deck
            if (sdm.waitingForServer || sdm.nextDeferred) {
                if (sdm.nextODataString) {
                    sdm.logger.logInfo('Dropping waiting request.  New request: ' + optionsString);
                    sdm.nextODataString = optionsString;
                    return sdm.nextDeferred.promise;
                }
                // make this request the next (waiting) request
                sdm.nextODataString = optionsString;
                sdm.nextDeferred = $q.defer();
                return sdm.nextDeferred.promise;
            }

            sdm.waitingForServer = true;
            var promise = (appName) ? (dataService.findAll({appName: appName, entityName: dataEntity, options: optionsString})) : (dataService.getAll(dataEntity, optionsString));
            return promise
            .then(
                function (response) {
                    sdm.logger.logInfo('Loaded ' + response.value.length + ' ' + dataEntity + ' records from data service.  Total records: ' + response.count);
                    return {
                        pageData: response.value,
                        currentPage: 0,
                        totalDataCount: response.count
                    };
                },
                function (reject) {
                    sdm.logger.logErr('Error loading server data', reject);
                    return $q.reject(reject);
                }
            ).finally(function () {
                // call to server has returned, 
                sdm.waitingForServer = false;

                if (sdm.nextODataString) {
                    // hold onto these
                    var nextODataStringCopy = sdm.nextODataString;
                    var wasNextDeferred = sdm.nextDeferred;

                    // clear out these so another request can be handled
                    sdm.nextODataString = '';
                    sdm.nextDeferred = null;

                    sdm.loadDataFromODataString(dataService, dataEntity, nextODataStringCopy,appName)
                        .then(
                            function (response) {
                                wasNextDeferred.resolve(response);
                            },
                            function (reject) {
                                wasNextDeferred.reject(reject);
                            }
                        );
                }
                // TODO sdm.hide();
            });
        };

    }

    function serverDataService($q, logger, sitFilterService) {
        var svc = this;
        var configDefaults;
        function init() {
            configDefaults = {
                pagingOptions: {
                    currentPage: 1,
                    pageSize: 25
                },
                quickSearchOptions: {
                    enabled: false,
                    field: '',
                    filterText: ''
                },
                sortInfo: {
                    field: '',
                    direction: ''
                }
            };
            svc.getDataManager = getDataManager;
        }

        function activate() {
            init();
        }
        
        activate();

        function setConfigDefaults(config) {
            if (!config.pagingOptions) {
                config.pagingOptions = configDefaults.pagingOptions;
            } else {
                if (!config.pagingOptions.currentPage) {
                    config.pagingOptions.currentPage = configDefaults.pagingOptions.currentPage;
                }
                if (!config.pagingOptions.pageSize) {
                    config.pagingOptions.pageSize = configDefaults.pagingOptions.pageSize;
                }
            }

            if (!config.quickSearchOptions) {
                config.quickSearchOptions = configDefaults.quickSearchOptions;
            }

            if (!config.sortInfo) {
                config.sortInfo = configDefaults.sortInfo;
            }
        }

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.pager
         * @name common.widgets.pager.serverDataService#getDataManager
         * @access internal
         * @description
         * Retrieves an object that manages paging, sorting and searching an array of data items.
         * 
         * @param {Object} [config]
         * Configures an instance of a data manager.
         * * **pagingOptions**
         *   * **currentPage**: Defines the current page of data when paging.
         *   * **pageSize**: Defines the number of data items in page.
         * * **quickSearchOptions**
         *   * **enabled**: Determines if quick search filtering is performed.
         *   * **field**: The name of the field to use for quick search. 
         *   * **filterText**: Text to compare against the configured field. Compare operation does a "begins with" match. 
         * * **serverDataOptions**
         *   * **dataService**: A presentation service object such as engineeringData (object not string)
         *   * **dataEntity**: The name of an entity to retrieve via the service
         *   * **optionsString**: An oData compliant query string
         * * **sortInfo**
         *   * **field**: The name of the field to sort by.
         *   * **direction**: Must be `asc` or `desc` case insensitive.
         * 
         * @returns {Object}
         * An object configured to manage data retrieval from a server.
         */
        function getDataManager(config) {
            setConfigDefaults(config);
            return new ServerDM(config, $q, logger, sitFilterService);
        }
    }

    /**
     * @ngdoc service
     * @name common.widgets.pager.serverDataService
     * @module siemens.simaticit.common.widgets.pager
     * @description
     * @access internal
     * Provides functionality for retrieving data from a configured presentation service.
     */
    angular.module('siemens.simaticit.common.widgets.pager').service('common.widgets.pager.serverDataService', ['$q', 'common.services.logger.service', 'common.widgets.filter.service', serverDataService]);
})();