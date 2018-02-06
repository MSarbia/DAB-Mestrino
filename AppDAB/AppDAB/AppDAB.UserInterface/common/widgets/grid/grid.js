/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
	'use strict';

	/**
	 * @ngdoc module
	 * @name siemens.simaticit.common.widgets.grid
	 * @description 
	 * This module provides functionalities to display, sort, and filter the information shown in a grid.
	 * 
	 * It depends on the following modules:
	 * * **ngGrid**
	 * * **ngGrid.services**
	 * * **siemens.simaticit.common.services.filterSort**
	 * * **siemens.simaticit.common.widgets.pager**
	 */
	angular.module('siemens.simaticit.common.widgets.grid', [
        'ngGrid',
        'ngGrid.services',
        'siemens.simaticit.common.widgets.pager'
	]);

})();
/*jshint -W098 */
(function () {
    'use strict';

    GridDirective.$inject = ['$log', '$window', '$timeout'];
    function GridDirective($log, $window, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                sitGridData: '=sitGridData',
                sitGridOptions: '=sitGridOptions',
                sitFormat: '=?sitFormat'
            },
            controller: GridController,
            controllerAs: 'gridCtrl',
            link: linkFn,
            templateUrl: 'common/widgets/grid/grid.html'
        };

        function linkFn(scope, element, attr, ctrl) {
            var logger, currentPageNum, sorting;
            var sitGridDataWatchHandler;

            activate();
            function activate() {
                logger = new LogWrapper($log, ctrl.sitGridOptions.debug, 'siemens.simaticit.common.widgets.grid.link');
                sorting = false;        // to avoid resetting grid on data change when we have only sorted the data
                ctrl.apiSorting = false;   // to know when we need to notify a parent the sort has changed
                ctrl.gridResizeEvent(element.parent().width());

                exposeApi();
                subscribeEvents();
            }

            function exposeApi() {
                ctrl.getCurrentPage = getCurrentPage;
            }

            function subscribeEvents() {
                scope.$on('$destroy', onDirectiveDestroy);
                scope.$on('grid.refreshList', onGridRefresh);

                scope.$watch('gridCtrl.getCurrentPage()', onCurrentPageChange);
                scope.$watch('gridCtrl.gridOptions.sortInfo', onSortInfoChange, true);
                scope.$watch('gridCtrl.gridOptions.pagingOptions.pageSize', onPageSizeChange);
                scope.$watch('gridCtrl.sitGridOptions', onGridOptionsChange);
                scope.$watch('gridCtrl.sitGridOptions.columnDefs', onColumnDefsChange);
                scope.$watch('gridCtrl.sitGridOptions.serverConnectionParams', onServerSettingsChange);
                scope.$watch('gridCtrl.sitGridOptions.quickSearchOptions.filterText', onQuickSearchChange);
                scope.$watch('gridCtrl.sitGridOptions.groups', onGroupsChange);
                
                activateWatchOnCollection();
                scope.$evalAsync(initializeHeight);
            }

            function onGridRefresh() {
                ctrl.gridOptions.pagingOptions.currentPage = ctrl.pageManager ? ctrl.pageManager.getCurrentPage() : 1;
            }

            function getCurrentPage() {
                if (ctrl.gridOptions.pagingOptions.currentPage) {
                    currentPageNum = ctrl.gridOptions.pagingOptions.currentPage;
                } else {
                    ctrl.gridOptions.pagingOptions.currentPage = currentPageNum - 1;
                }
                return ctrl.gridOptions.pagingOptions.currentPage;
            }

            /**
             * Handle change in the sortInfo object to force sorting on the entire data set rather than just current page.
             * - using gridOptions.sortBy() only sorts the current page.
             */
            function onSortInfoChange(newVal, oldVal) {
                //30073 Fix:do something only if sorting field or direction changes
                if (newVal === oldVal || (newVal.fields[0] === oldVal.fields[0] && newVal.directions[0] === oldVal.directions[0])) {
                    return;
                }
                sorting = true;
                ctrl.pageManager.setSortInfo(newVal.fields[0], newVal.directions[0]);
                ((ctrl.sitGridOptions.enablePaging && !ctrl.grouping) ? ctrl.pageManager.goToPage(1) : ctrl.pageManager.getAllData())
                .then(function (result) {
                    ctrl.setSlicedData(result.data);
                    ctrl.gridOptions.pagingOptions.currentPage = 1;
                    $('#data-container').scrollTop(0);
                    if (!ctrl.apiSorting && newVal.fields.length > 0) {
                        ctrl.emitSortInfoChanged(newVal);
                    }
                    logger.log('watch: gridOptions.sortInfo', 'sort changed success');
                }, function (reason) {
                    ctrl.handleError(reason);
                    logger.error('watch: gridOptions.sortInfo', 'sort changed error');
                }).finally(function () {
                    ctrl.apiSorting = false;
                });
            }

            /**
             * Handle a change in current page.
             * - Get new grid data from the page manager.
             * - Emit an event to notify parent of page change.
             */
            function onCurrentPageChange(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                ctrl.pageManager.goToPage(newVal)
                    .then(function (result) {
                        _.each(ctrl.selectedItems, function (selItem) {
                            selItem.selected = undefined;
                        });

                        if (ctrl.selectedItems) {
                            for (var i = 0; i < ctrl.selectedItems.length; i++) {
                                for (var j = 0; j < result.data.length; j++) {
                                    result.data[j].selected = undefined;
                                    if (JSON.stringify(result.data[j]) === JSON.stringify(ctrl.selectedItems[i])) {
                                        result.data[j].selected = true;
                                        ctrl.selectedItems[i] = result.data[j];
                                        break;
                                    }
                                }
                            }
                        }
                        if (ctrl.sitGridOptions.noScroll === true) {
                            $timeout(function () {
                                $(window).trigger('resize');
                            }, 100);
                        }
                        ctrl.setSlicedData(result.data);
                        $('#data-container').scrollTop(0);
                        ctrl.emitPageChanged(newVal);
                        logger.log('watch: pagingOptions.currentPage', 'page changed sucess.  Old: ' + oldVal + ', New: ' + newVal);
                    }, function (reason) {
                        ctrl.handleError(reason);
                        logger.error('watch: pagingOptions.currentPage', 'page changed error.  Old: ' + oldVal + ', New: ' + newVal);
                    });
            }

            /**
             * Handle a change in page size.
             * - Get new grid data from page manager.
             * - Update current page because page manger will try set new current page so same first row is showing.
             * - Emit an event to notify parent of page size change.
             */
            function onPageSizeChange(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                ctrl.sitConfig.pagingOptions.pageSize = newVal;
                ctrl.pageManager.setPageSize(newVal);
                ctrl.pageManager.getPageData()
                .then(function (result) {
                    if (ctrl.sitGridOptions.noScroll === true) {
                        $timeout(function () {
                            $(window).trigger('resize');
                        }, 100);
                    }
                    ctrl.gridOptions.pagingOptions.currentPage = result.currentPage;
                    ctrl.preventCurrentPageWatch(result.currentPage);
                    ctrl.setSlicedData(result.data);
                    $('#data-container').scrollTop(0);
                    ctrl.emitPageSizeChanged(newVal);
                    logger.log('watch: pagingOptions.pageSize', 'page size changed success.  Old: ' + oldVal + ', New: ' + newVal);
                }, function (reason) {
                    ctrl.handleError(reason);
                    logger.log('watch: pagingOptions.pageSize', 'page size changed error.  Old: ' + oldVal + ', New: ' + newVal);
                });
            }

            /**
             * Handle a change in the local data source.
             * - this must be ignored when configured to use server data
             * - resets the grid to allow showing a completely new set of data when data is bound locally.
             */
            function onGridDataChange(newVal, oldVal) {
                var newLen = newVal ? newVal.length : 'undefined';
                var oldLen = oldVal ? oldVal.length : 'undefined';
                logger.info('watch: sitGridData (grid) new len: ' + newLen + ', old len: ' + oldLen + ', new===old: ' + (newVal === oldVal).toString());
                if (sorting) {
                    sorting = false;
                    triggerResize();
                    return;
                }
                if (newVal !== oldVal && (!ctrl.pageManager || !ctrl.pageManager.isServerData())) {
                    logger.info('watch: sitGridData', 'data changed, length = ' + ctrl.sitGridData.length);
                    ctrl.sitConfig.pagingOptions.currentPage = ctrl.pageManager ? ctrl.pageManager.getCurrentPage() : 1;
                    ctrl.resetGrid(true).then(function () {
                        triggerPagerSorting();
                        triggerResize();
                    }, function (reason) {
                        triggerPagerSorting();
                        triggerResize();
                    });
                }
            }

            /**
             * Handle a change of the grid options object.
             */
            function onGridOptionsChange(newVal, oldVal) {
                if (newVal !== oldVal) {
                    logger.info('watch: sitGridOptions', 'grid options changed');
                    ctrl.resetGrid();
                }
            }

            /**
             * Handle a change in the column definitions.
             * - resets the grid to allow correct showing of new columns.
             */
            function onColumnDefsChange(newVal, oldVal) {
                if (newVal !== oldVal) {
                    logger.info('watch: sitGridOptions.columnDefs', 'column definitions changed, length = ' + ctrl.sitGridOptions.columnDefs.length);
                    ctrl.resetGrid();
                }
            }

            /**
             * Handle a change in the server connection parameters
             * - resets the grid to allow showing a completely new set of data when data managed from a server.
             */
            function onServerSettingsChange(newVal, oldVal) {
                if (newVal !== oldVal) {
                    ctrl.resetGrid(true);
                }
            }

            /**
             * Handle a change in the quick search filter text
             */
            function onQuickSearchChange(newVal, oldVal) {
                if (newVal !== oldVal) {
                    ctrl.pageManager.setSearchText(newVal);
                    ctrl.updateDataOnFilterChange();
                }
            }

            /**
             * Handle a change in the grouping field
             */
            function onGroupsChange(newVal, oldVal) {
                if (newVal !== oldVal) {
                    ctrl.grouping = ctrl.sitGridOptions.groups && ctrl.sitGridOptions.groups.length > 0;
                    logger.log('watch: sitGridOptions.groups', 'grouping: ' + ctrl.grouping);// + ', new data count: ' + ctrl.slicedGridData.length);
                    ctrl.resetGrid();
                }
            }

            function initializeHeight() {
                ctrl.initializeHeight();
                if (ctrl.handleResize) {
                    angular.element($window).bind('resize', onWindowResize);
                }
            }

            function onDirectiveDestroy() {
                if (ctrl.handleResize) {
                    angular.element($window).unbind('resize', onWindowResize);
                }
            }

            function onWindowResize() {
                ctrl.setHeight();
                ctrl.gridResizeEvent(element.parent().width());
            }

            function activateWatchOnCollection() {
                sitGridDataWatchHandler = scope.$watchCollection('gridCtrl.sitGridData', onGridDataChange);
            }

            function deActivateWatchOnCollection() {
                sitGridDataWatchHandler();
                sitGridDataWatchHandler = null;
            }

            function triggerPagerSorting() {
                if (undefined === ctrl.sitGridData || null === ctrl.sitGridData || ctrl.sitGridData.length <= 1) {
                    return;
                }
                deActivateWatchOnCollection();
                sorting = true;
                ctrl.pageManager.setSortInfo(ctrl.gridOptions.sortInfo.fields[0], ctrl.gridOptions.sortInfo.directions[0]);
                updateSlicedData();
                sorting = false;
                activateWatchOnCollection();
            }

            function updateSlicedData() {
                ((ctrl.sitGridOptions.enablePaging && !ctrl.grouping) ? ctrl.pageManager.getPageData() : ctrl.pageManager.getAllData())
                .then(function (result) {
                    ctrl.setSlicedData(result.data);
                    ctrl.updateSelectedItems();
                }, function (reason) {
                });
            }

            function triggerResize() {
                if (ctrl.sitGridOptions.noScroll === true) {
                    $timeout(function () {
                        $(window).trigger('resize');
                    }, 100);
                }
            }
        }
    }

    GridController.$inject = ['$scope', 'common', 'common.widgets.grid.service', 'common.widgets.pager.pageService', '$translate', '$timeout', '$state', 'LOG_TYPES', '$window', '$filter', '$element', '$q'];
    function GridController($scope, common, gridService, sitPageService, $translate, $timeout, $state, LOG_TYPES, $window, $filter, element, $q) {
        var vm = this;
        // sitConfig is a reference to vm.sitGridOptions. hmmm, more compact but not necessary and potentially confusing...keep for now...
        var sitConfig = gridService.setGridConfigurationDefaults(vm.sitGridOptions);
        vm.sitConfig = sitConfig;

        var logInfoFn = common.logger.getLogFn('siemens.simaticit.common.widgets.grid.controller', LOG_TYPES.LOG_INFO);
        var logErrorFn = common.logger.getLogFn('siemens.simaticit.common.widgets.grid.controller', LOG_TYPES.LOG_ERROR);

        function activate() {
            init();
            initializeEventsEmitMethods();
            $timeout(function () {
                $(window).trigger('resize');
                sortBy(vm.gridOptions.sortInfo.fields[0], vm.gridOptions.sortInfo.directions[0]);
            }, 100);
            //30073 Fix:
            vm.pageManager.setSortInfo(vm.gridOptions.sortInfo.fields[0], vm.gridOptions.sortInfo.directions[0]);
            if (undefined === vm.sitGridData || null === vm.sitGridData || 0 === vm.sitGridData.length) {
                return;
            }
            updateSlicedData();
        }

        activate();

        function init() {
            vm.handleError = handleError;
            vm.setPageManager = setPageManager;
            vm.setPageManager();

            vm.selectedItems = [];
            vm.initialPageCount = 1; //dummy value for gridConfig until resetGrid sets actual value after getting data.
            vm.initialPageSize = sitConfig.pagingOptions.initialPageSize;

            vm.afterSelectionChange = afterSelectionChange;
            vm.notifySelectionChanged = notifySelectionChanged;
            //api methods used in ng-grid options setup
            initializeOptionsAPIMethods();

            vm.get2LetterCultureCode = get2LetterCultureCode;
            vm.updateGridOptions = updateGridOptions;
            vm.updateGridOptions(true);
            vm.grouping = vm.sitGridOptions.groups && vm.sitGridOptions.groups.length > 0;
            vm.setHeight = setHeight;
            vm.initializeHeight = initializeHeight;
            vm.setSlicedData = setSlicedData;

            //need to set something for ngGrid. will get changed when resetGrid runs after data load
            vm.setSlicedData([]);
            vm.colDefs = sitConfig.columnDefs;
            vm.totalDataItems = 0;

            vm.updateSelectedItems = updateSelectedItems;
            vm.resetGrid = resetGrid;
            vm.resetGrid(true);

            vm.updateDataOnFilterChange = updateDataOnFilterChange;

            vm.setOptionsAPIMethods = setOptionsAPIMethods;
            vm.setOptionsAPIMethods();

            // now that api funcs are defined, set callback to ngGrid options
            vm.gridOptions.selectAggregateCallback = vm.selectItems;
            vm.gridResizeEvent = gridResizeEvent;
        }

        function initializeOptionsAPIMethods() {
            vm.selectItems = selectItems;
            vm.selectAll = selectAll;
            vm.sortBy = sortBy;
            vm.dataUpdated = dataUpdated;
            vm.getSelectedItems = getSelectedItems;
            vm.setFilter = setFilter;
            vm.getCurrentData = getCurrentData;
        }

        function initializeEventsEmitMethods() {
            vm.emitPageChanged = emitPageChanged;
            vm.emitPageSizeChanged = emitPageSizeChanged;
            vm.emitSortInfoChanged = emitSortInfoChanged;
            vm.emitItemSelectionChanged = emitItemSelectionChanged;
            vm.preventCurrentPageWatch = preventCurrentPageWatch;
        }

        function handleError(commandResponse) {
            if (vm.sitGridOptions.onErrorCallback) {
                vm.sitGridOptions.onErrorCallback(commandResponse);
            } else {
                var error = commandResponse.data.error;
                var errorMsg = ': ' + $translate.instant('common.error-code-message', { code: error.errorCode, message: error.errorMessage });
                vm.gridOptions.noDataMessage += errorMsg;
                vm.setSlicedData([]);
            }
        }

        // ensure use of page manager set by parent (if one exists)
        function setPageManager() {
            // the data service needs a sortInfo object of the form { field: '', direction: '' }
            // don't want to change the existing config object, so clone it and update the sortInfo
            var configCopy = $.extend({}, sitConfig);
            configCopy.sortInfo = {
                field: sitConfig.sortInfo.fields.length > 0 ? sitConfig.sortInfo.fields[0] : '',
                direction: sitConfig.sortInfo.directions.length > 0 ? sitConfig.sortInfo.directions[0] : ''
            };
            vm.pageManager = sitConfig.pageManager ? sitConfig.pageManager : sitPageService.getPageManager(configCopy, vm.sitGridData);
        }

        /**
         * Handle selection change event from ng-grid.
         * - Emits an event passing a collection of the selected itmes.
         * - This gets triggered once for the item that is unselected and once for the item that is selected.
         * - event always seems to be undefined
         */
        function afterSelectionChange(rowItem) {
            var selItem = [];
            if (Array.isArray(rowItem)) {
                var i, length = rowItem.length;
                for (i = 0; i < length; i++) {
                    rowItem[i].entity.selected = rowItem[i].selected;
                    selItem.push(rowItem[i].entity);
                }
            }
            else {
                rowItem.entity.selected = rowItem.selected;
                selItem = rowItem.entity;
            }
            if (selItem && selItem.stateTransition) {
                var st = selItem.stateTransition;
                $state.go(st.to, st.params, st.options);
            } else {
                vm.notifySelectionChanged(selItem);
            }
        }

        function notifySelectionChanged(selItem) {
            if (!vm.blockSelectionNotifications) {
                vm.emitItemSelectionChanged(vm.selectedItems, selItem);
                if (vm.sitGridOptions.onSelectionChangeCallback) {
                    vm.sitGridOptions.onSelectionChangeCallback(vm.selectedItems, selItem);
                }
            }
        }

        function gridResizeEvent(gridContainerWidth) {
            if (!vm.sitGridOptions.enableResponsiveBehaviour) {
                return;
            }
            if (gridContainerWidth <= 768) {
                for (var i = 2; i < vm.sitGridOptions.columnDefs.length; i++) {
                    vm.sitGridOptions.columnDefs[i].visible = false;
                }
            } else {
                for (var j = 2; j < vm.sitGridOptions.columnDefs.length; j++) {
                    vm.sitGridOptions.columnDefs[j].visible = true;
                }
            }
        }

        /**
         * Selects the specified items and optionally clears existing selections
         * items is an array containing either of the following 
         * - indexes of the data items to select
         * - references to the actual data items
         */
        function selectItems(items, state, clear) {
            //items is expected to be an array of numbers or objects
            if (!items || items.constructor !== Array)
            { return; }

            // block notifications during programmatic selection
            vm.blockSelectionNotifications = true;

            var i, index, selItem, dataItem;
            // only operate on the current page of data
            var data = $scope.slicedGridData;

            // when selecting consider option to clear existing selections
            if (state && clear) {
                for (i = 0; i < vm.selectedItems.length; i++) {
                    selItem = vm.selectedItems[i]
                    selItem.selected = false;
                }
                vm.gridOptions.selectAll(false);
            }

            // items may be either an index into the data arrary, or references to the actual objects in the data array
            if (items.length > 0) {
                if (typeof items[0] === 'number') {
                    // handle selection by index
                    for (i = 0; i < items.length; i++) {
                        index = items[i];
                        selItem = data[index];
                        if (selItem) {
                            selItem.selected = state;
                            vm.gridOptions.selectRow(index, state);
                            //vm.gridOptions.selectItem(index, state);
                        }
                    }
                } else {
                    // handle selection by data object
                    // ng-grid programatically selects items by index
                    // build a list of item indexes by finding the data items using reference compare
                    var itemIndexes = [];
                    for (index = 0; data[index]; index++) {
                        dataItem = data[index];
                        i = 0;
                        while (items[i]) {
                            selItem = items[i];
                            if (selItem === dataItem) {
                                dataItem.selected = state;
                                itemIndexes.push(index);
                                items.splice(i, 1); //remove the item so we don't compare against it again.
                                break;
                            }
                            i++;
                        }
                        if (items.length === 0)
                        { break; }
                    }

                    // do the ng-grid selection with the indexes
                    for (i = 0; i < itemIndexes.length; i++) {
                        vm.gridOptions.selectRow(itemIndexes[i], state);
                    }
                }
            }
            // re-enable notifications on UI triggered selection change 
            vm.blockSelectionNotifications = false;
            vm.notifySelectionChanged(null);
        }

        function selectAll(state) {
            // ngGrid for some unknown reason clears the selected list and does not add back items already selected.
            // to selected all and have ngGrid correctly update the selected list, need to first clear all.
            // could try and fix ngGrid, but this is an easy enough workaround.
            if (state && vm.selectedItems.length > 0) {
                vm.blockSelectionNotifications = true;
                vm.gridOptions.selectAll(false);
                vm.blockSelectionNotifications = false;
            }
            vm.gridOptions.selectAll(state);
        }

        /**
         * returns array of selected data items
         */
        function getSelectedItems() {
            return vm.gridOptions.selectedItems;
        }

        // standard scenario should be to get language from translate service.
        // but let parent override by specifying value. (legacy processing)
        // default to english
        function get2LetterCultureCode() {
            var code = sitConfig.culture;
            if (!code) {
                var preferredLang = $translate.preferredLanguage();
                code = preferredLang ? preferredLang.substring(0, 2) : 'en';
            }
            return code;
        }

        /**
         * Translate the unity grid options to ng-grid options.
         */
        function updateGridOptions(firstUpdate) {
            if (vm.sitGridOptions === null || vm.sitGridOptions === undefined) {
                logErrorFn('vm.sitGridOptions can\'t be null or undefined');
            }

            sitConfig = gridService.setGridConfigurationDefaults(vm.sitGridOptions);
            vm.sitConfig = sitConfig;
            logInfoFn('[updateGridOptions] firstUpdate: ' + firstUpdate);

            //update slicedGridData with only one item selected when changing selection mode between single and multi
            if (!firstUpdate) {
                if ($scope.slicedGridData && vm.selectedItems.length > 0) {
                    var selectedItems = vm.selectedItems.slice(vm.selectedItems.length - 1);
                    angular.forEach($scope.slicedGridData, function (item, index) {
                        if (item.selected && item !== selectedItems[0]) {
                            item.selected = !item.selected;
                        }
                    });
                    vm.selectedItems = selectedItems;
                }
            }

            var options = {
                //handle selecting a row to update parent with current selected items
                afterSelectionChange: vm.afterSelectionChange,

                //bind grid data to a scope variable by name allows it to watch for changes
                data: 'slicedGridData',

                //binding column defs to scope param allows for auto update 
                columnDefs: 'colDefs',

                //set custom CSS classes for odd, even, selected rows
                customRowClasses: sitConfig.customRowClasses,

                //sets whether or not any columns can be resized. Can turn off for specific column in columnDefs
                enableColumnResize: sitConfig.enableColumnResize,

                //determines if paging is allowed. true by default
                enablePaging: sitConfig.enablePaging,

                //determines if rows can be selected at all
                enableRowSelection: sitConfig.selectionMode === 'multi' || sitConfig.selectionMode === 'single',

                //set Row Height
                rowHeight: (sitConfig.rowHeight < 30 || !sitConfig.rowHeight) ? 30 : sitConfig.rowHeight,

                //globally enable/disable sorting
                enableSorting: sitConfig.enableSorting,

                //specifies the field or fields to group data by.
                groups: sitConfig.groups ? sitConfig.groups : [],

                //determines if groups are initially collapsed or not
                groupsCollapsedByDefault: sitConfig.groupsCollapsedByDefault,

                //specifies the current culture for ng-grid controlled text like 'page size'
                i18n: vm.get2LetterCultureCode(),

                //by setting false, we allow clicking a selected row to de-select it when in single selection mode
                keepLastSelected: false,

                //when selection is enabled, this determines if the user can select multiple or just a single row
                multiSelect: sitConfig.selectionMode === 'multi',

                //the string to shown when no data is bound to the grid
                noDataMessage: sitConfig.noDataMessage ? sitConfig.noDataMessage : $translate.instant('common.no-data'),

                //sets parameters for the paging controls.
                //for the first update, we use the configuration params.
                //after that, we remember what the user has chosen (possibly not correct thing to do?)
                pagingOptions: {
                    pageSizes: sitConfig.pagingOptions.pageSizes,
                    pageSize: firstUpdate ? sitConfig.pagingOptions.pageSize : vm.gridOptions.pagingOptions.pageSize,
                    currentPage: firstUpdate ? sitConfig.pagingOptions.currentPage : vm.gridOptions.pagingOptions.currentPage
                },

                // handles clicking the check box in a group row
                // - the ctrl func will not be defined for first call to this func, so is also set at end ctrl.
                //   have here also so it gets reset if we update the grid options
                selectAggregateCallback: vm.selectItems,

                //by binding a scope property to the selectedItems list, 
                //the grid will automatically update it with the data items corresponding to the selected rows.
                selectedItems: vm.selectedItems,

                // set show/hide of pager control. 
                // page count dependency is attempt to not show pager if all data fits on one page.
                // but only want to check this on data changing. not when user changes page size. 
                showFooter: sitConfig.enablePaging &&
                    (sitConfig.alwaysShowPager ||
                        ((!sitConfig.groups || sitConfig.groups.length === 0) && (vm.initialPageCount > 1 || (vm.pageManager.getTotalItemCount() > vm.initialPageSize))) ||
                        // server data and there's a filter set - we have no way to know how many data items there are if the filter is removed
                        (vm.pageManager.isServerData() && sitConfig.quickSearchOptions.enabled && sitConfig.quickSearchOptions.field && sitConfig.quickSearchOptions.filterText)
                    ),

                //never show the group panel. grouping is managed via api
                showGroupPanel: false,

                //allows for setting of initial sort.
                sortInfo: sitConfig.sortInfo,

                //by binding to the scope property, the total count is automatically updated by the grid.
                totalServerItems: 'totalDataItems',

                //show check box selection column
                showSelectionCheckbox: sitConfig.showSelectionCheckbox,

                //only allow selection using the check box column (do not support for now, but leave code for possible future support)
                //selectWithCheckboxOnly: sitConfig.selectWithCheckboxOnly,

                //show selected rows with highlight styling?  May want this turned off if selecting by checkbox
                showRowHighlight: sitConfig.showRowHighlight,

                //force use of external sorting so we sort all data and not just visible data
                useExternalSorting: true,
                enableResponsiveBehaviour: sitConfig.enableResponsiveBehaviour
            };
            vm.gridOptions = options;
        }

        // set height based on specified value or containing element
        function setHeight(height) {
            if (vm.sitGridOptions.noScroll === true) {
                var noScrollHeight;
                var headerHeight = 30;
                var footerHeight = 55;
                vm.pageManager.getAllData().then(function (result) {
                    var totalDataLength = result.data.length;
                    var pageSize = vm.pageManager.getPageSize();
                    var slicedDataLenght = $scope.slicedGridData.length;
                    if (slicedDataLenght < pageSize) {
                        noScrollHeight = (slicedDataLenght * (vm.gridOptions.rowHeight + 1));// rowHeight ->height of each row, 1-> sapcing
                    }
                    else if (pageSize > totalDataLength) {
                        noScrollHeight = (totalDataLength * (vm.gridOptions.rowHeight + 1));
                    }
                    else {
                        noScrollHeight = (pageSize * (vm.gridOptions.rowHeight + 1));
                    }
                    vm.gridHeight = {
                        "height": (noScrollHeight + footerHeight + headerHeight) + 'px'
                    };
                    $('.ngViewport').css({ "overflow": "hidden", "height": noScrollHeight });
                }, function (reason) {
                    vm.handleError(reason);
                })
            }
            else {
                if (!height) {
                    height = getElementHeight(sitConfig.containerID);
                }
                if (height <= 0) {
                    return;
                }
                vm.gridHeight = { "height": height + 'px' };
                common.logger.log('sitGrid.vm.setHeight', 'height: ' + height);
            }
        }

        function initializeHeight() {
            var height = 0;
            if (sitConfig.height) {
                height = sitConfig.height;
            } else if (sitConfig.containerID) {
                height = getElementHeight(sitConfig.containerID);
            }

            // handle resize if we have a container and explicitly told to do so or if container has non-zero height.
            vm.handleResize = sitConfig.containerID && (sitConfig.handleResize || height >= 0);

            if (height <= 0) {
                height = Math.ceil($(window).height() / 2);
            }

            vm.setHeight(height);
        }

        function getElementHeight(id) {
            var height = -1;
            var container = $('#' + id, element.parents('div#itemCollectionCanvas')[0]);
            if (container.length === 0) {
                return height;
            }
            if (container.is(':visible')) {
                height = container.height();
            } else {
                if (-1 === container.css('height').indexOf('%')) {
                    height = container.height();
                } else {
                    height = 0;
                }
            }
            return height;
        }

        // function to set the actual data bound to the grid.
        function setSlicedData(data) {
            $scope.slicedGridData = data;
        }

        // refresh items selected in the grid based on selected property of the data item
        // - putting them in the selectedItems list is enough. ngGrid will check this 
        //   when building its rows and select the rows where the row entity exists in the selected list.
        function updateSelectedItems() {
            vm.selectedItems.length = 0;
            angular.forEach($scope.slicedGridData, function (item) {
                if (item.selected) {
                    vm.selectedItems.push(item);
                }
            });
        }


        /**
         * Completely resets the grid by removing it's elements from the DOM and adding them back with new grid options
         * - Reset in this manner allows for dynamic change of all grid settings.
         * - First implemented to work around what may be a bug in handling of columnDefs. (or just missunderstanding of correct use)
         *   The property is supposed to be dynamically updatable. (set value as string name of scope property).
         *   However, switching between data sources can cause several problems
         *   - not all column data may show
         *   - header of first column is corrupted.
         *   The problem seems due to the fact the grid does not remove no longer used columns. It just shows/hides them.
         *   So the auto-update probably is OK if you are just changing column visible or resizeable. 
         *   The full reset here allows for changing columns.
         * - The reset will cause a flicker of the grid as it is removed and redrawn.
         */
        function resetGrid(resetPageCount) {
            var deferred = $q.defer();
            if (vm.gridResetting) {
                logInfoFn('[reset grid] reset already in progress');
                deferred.reject({});
                return deferred.promise;
            }
            vm.gridResetting = true;
            vm.showGrid = false;
            $timeout(function () {
                refreshGrid(resetPageCount).then(function () {
                    deferred.resolve({});
                }, function (reason) {
                    deferred.reject({ reason: reason });
                });
            }, 100);
            return deferred.promise;
        }

        function refreshGrid(resetPageCount) {
            var deferred = $q.defer();
            vm.setPageManager();
            if (vm.filterClauses) {
                vm.setFilter(vm.filterClauses);
                vm.gridResetting = false;
                vm.showGrid = true;

                deferred.resolve({});
                return deferred.promise;
            }
            ((vm.grouping || !vm.sitGridOptions.enablePaging) ? vm.pageManager.getAllData() : vm.pageManager.getPageData()).then(
                function (result) {
                    if (resetPageCount) {
                        vm.initialPageCount = vm.pageManager.getPageCount();
                    }
                    vm.updateGridOptions();
                    vm.setOptionsAPIMethods();
                    $scope.totalDataItems = result.totalDataSize;
                    vm.setSlicedData(result.data);
                    $scope.colDefs = sitConfig.columnDefs;
                    vm.updateSelectedItems();
                    vm.gridResetting = false;
                    vm.showGrid = true;
                    deferred.resolve({});
                },
                function (reason) {
                    vm.gridResetting = false;
                    vm.handleError(reason);
                    logErrorFn('[reset grid] error resetting grid: ' + reason.data.error.errorMessage);
                    deferred.reject({ reason: reason });
                }
            );
            return deferred.promise;
        }

        function updateSlicedData() {
            ((vm.sitGridOptions.enablePaging && !vm.grouping) ? vm.pageManager.getPageData() : vm.pageManager.getAllData())
            .then(function (result) {
                vm.setSlicedData(result.data);
                vm.updateSelectedItems();
            }, function (reason) {
            });
        }

        /*** functions attached to the options object. this gives users api into the directive ***/

        /**
         * ngGrid sorts only on visible data. That is, just the current page. But we want to 
         * actually sort all data, not just the current page. To do this, we can use the sort service
         * provided by ngGrid. 
         */
        function sortBy(sortField, sortDirection) {
            vm.apiSorting = true; //flag to tell sortInfo watch whether or not to notify parent of sort change

            if (!sortDirection)
            { sortDirection = 'asc'; }

            if (vm.gridOptions.sortBy)
            { vm.gridOptions.sortBy(sortField, sortDirection); }
            else
            { logInfoFn('[sitGridOptions.sortBy] attempt to sort grid when sortBy not defined'); }

            logInfoFn('[sitGridOptions.sortBy] sorting by field: ' + sortField + ' sort direction: ' + sortDirection);
        }

        /**
         * Called to let us know that the grid's data has been updated
         */
        function dataUpdated() {
            vm.resetGrid(true);
        }

        // after quick search text or filter change, update the available data
        function updateDataOnFilterChange() {
            ((vm.sitGridOptions.enablePaging && !vm.grouping) ? vm.pageManager.goToPage(1) : vm.pageManager.getAllData())
            .then(
                function (result) {
                    vm.setSlicedData(result.data);
                    vm.gridOptions.pagingOptions.currentPage = 1;
                    vm.preventCurrentPageWatch(1);
                    $scope.totalDataItems = result.totalDataSize ? result.totalDataSize : 0;
                    $('#data-container').scrollTop(0);
                    $scope.$emit('sit-grid.data-filtered');
                },
                function (reason) {
                    vm.handleError(reason);
                }
            );
        }

        function setFilter(clauses) {
            vm.filterClauses = clauses.length ? clauses : undefined;
            vm.pageManager.setFilter(clauses);
            vm.updateDataOnFilterChange();
        }
        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.grid
         * @name GridOptions#getCurrentData
         *
         * @description
         * An API method which returns currently displayed data
         *
         * @returns {Array} A list of currently displayed data
         */
        function getCurrentData() {
            return $scope.slicedGridData;
        }

        // assigns the API methods on the options object to the controller methods that implement the functionality. 
        // allows for easy resetting if the sitGridOptions object is changed.
        function setOptionsAPIMethods() {
            vm.sitGridOptions.selectItems = vm.selectItems;
            vm.sitGridOptions.selectAll = vm.selectAll;
            vm.sitGridOptions.sortBy = vm.sortBy;
            vm.sitGridOptions.dataUpdated = vm.dataUpdated;
            vm.sitGridOptions.getSelectedItems = vm.getSelectedItems;
            vm.sitGridOptions.setFilter = vm.setFilter;
            vm.sitGridOptions.getCurrentData = vm.getCurrentData;
        }

        ///////////////////////////////////////////////////////////////
        // functions to emit events mainly for documentation convenience
        ///////////////////////////////////////////////////////////////

        /**
         * @ngdoc event
         * @name sitGrid#sit-grid.page-changed
         * @eventType emit on sitGrid pager
         * @description
         * Emitted when the value of the current page in the pager is changed.
         * 
         * The new page number is passed as a parameter with the event.
         * 
         * @param {Object} event The event object.
         * 
         * @param {Number} currentPage The new page number.
         * 
         */
        function emitPageChanged(currentPage) {
            $scope.$emit('sit-grid.page-changed', currentPage);
            if (vm.sitGridOptions.onPageChangedCallback) {
                vm.sitGridOptions.onPageChangedCallback(currentPage);
            }
        }

        /**
         * @ngdoc event
         * @name sitGrid#sit-grid.page-size-changed
         * @eventType emit on sitGrid pager
         * @description
         * Emitted when the value of the current page size in the pager is changed.
         * 
         * The new page size is passed as a parameter with the event.
         * 
         * @param {Object} event The event object.
         * 
         * @param {Number} pageSize The number of items to be displayed in a page.
         * 
         */
        function emitPageSizeChanged(pageSize) {
            $scope.$emit('sit-grid.page-size-changed', pageSize);
        }

        /**
         * @ngdoc event
         * @name sitGrid#sit-grid.sort-changed
         * @eventType emit on sitGrid column header
         * @description
         * Emitted when the current sort is changed after the user clicks on a column header.
         * 
         * The new sorting information is passed as a parameter with the event. 
         * It is passed as an object with the following properties:
         * * **fields**: An array of field names.
         * * **directions**: An array of **_asc_** or **_desc_** values that provide sort direction
         * for the field with the same index.
         * 
         * **Note:** The object contains only arrays because **ngGrid** is designed to support multi-column sorting.
         * Each array must contain only one element because **sitGrid** supports only single column sorting.
         * 
         * @param {Object} event The event object.
         * 
         * @param {Object} sortInfo An object that contains the column and direction of the new sort.
         * 
         */
        function emitSortInfoChanged(sortInfo) {
            $scope.$emit('sit-grid.sort-changed', sortInfo);
            if (vm.sitGridOptions.onSortingChangedCallback) {
                // strip out columns and send just single field/direction
                vm.sitGridOptions.onSortingChangedCallback({
                    field: sortInfo.fields[0],
                    direction: sortInfo.directions[0]
                });
            }
        }

        /**
         * @ngdoc event
         * @name sitGrid#sit-grid.item-selection-changed
         * @eventType emit on sitGrid
         * @description
         * Emitted when the user clicks within the grid to change the currently selected rows.
         * 
         * Two parameters are passed along with the event.
         * * **selectedItems**: A list of the currently selected data items.
         * * **clickedItem**: The data item corresponding to the row that the user clicked to trigger the event.
         * 
         * @param {Object} event The event object.
         * 
         * @param {Object[]} selectedItems A list of the currently selected data items.
         * 
         * @param {Object} clickedItem The data item corresponding to the row that the user clicked to trigger the event.
         * 
         */
        function emitItemSelectionChanged(selectedItems, clickedItem) {
            $scope.$emit('sit-item-selection-changed', selectedItems, clickedItem);
        }

        /**
         * Prevent the "currentPage" watcher from triggering.  Fool it 
         * into thinking its last value is the current value.
         */
        function preventCurrentPageWatch(currentPageNumber) {
            // find the watcher
            var curPageWatcher = _.findWhere($scope.$$watchers, { exp: 'function () { return ctrl.gridOptions.pagingOptions.currentPage; }' });
            if (curPageWatcher) {
                if (curPageWatcher.last !== currentPageNumber) {
                    // emit the event here since the watcher won't be doing it
                    vm.emitPageChanged(currentPageNumber);
                }
                curPageWatcher.last = currentPageNumber;
            }
        }
    }

    /**
	 * @ngdoc directive
	 * @module siemens.simaticit.common.widgets.grid
	 * @name sitGrid
	 * 
	 * @requires $timeout
	 * @requires $log
	 * 
	 * @restrict E
	 * 
	 * @description 
	 * A configurable widget to show a collection of data items in a grid format.
	 *
	 * The actual grid implementation uses <a href="http://www.github.com/angular-ui/ng-grid/tree/2.x">ngGrid.</a>
     * **sitGrid** wraps **ngGrid** to provide a consistent look and feel with other unity widgets.
     * 
     * @param {Object[]} sitGridData An array of the data objects to be displayed in the grid.
	 * <br><br>
	 * If **serverDataOptions** are specified in the **sitGridOptions** parameter, then data is retrieved 
	 * from a server. Any data items assigned to this property will be ignored.
     * 
     * @param {GridOptions} sitGridOptions For a description of this object see {@link GridOptions}.
     * 
     * @example
     * In a view template, you can use the **sitGrid** as follows:
     * ```
     *       <sit-grid sit-grid-data="vm.gridData" sit-grid-options="vm.gridOptions"></sit-grid>
     * ```
     * 
     * In the corresponding view controller, add **gridData** and **gridOptions** objects
     * to the vm. 
     * ```
     *   // gridData defines the data objects to show
	 *   vm.gridData = [
	 *	    {
     *		   title: 'Dune',
     *		   author: 'Frank Herbert',
     *		   yearPublished: 1965,
     *         subTitle: 'A spice addicts guide to world domination.'
	 *      },
	 *      {
	 *         title: 'Hitchhikers Guide to the Galaxy',
	 *         author: 'Douglas Adams',
	 *         yearPublished: 1979,
	 *         subTitle: 'How to get lost in space without really trying.'
	 *      },
	 *  ];
	 *  
     * 
     *
	 *   // gridOptions configures how to show the data
	 *   vm.gridOptions = {
	 *      containerID: 'myGridContainer',
	 *      gridConfig: {
	 *          columnDefs: [
     *		        { field: 'title', displayName: 'Title' },
     *		        { field: 'author', displayName: 'Author', resizable: false },
     *		        { field: 'yearPublished', displayName: 'Year' }
	 *          ]
	 *      },
	 *      groupField: '',
	 *      groupFields: ['title', 'author', 'yearPublished'],
	 *      onSelectionChangeCallback: ctrl.mySelectionChangeHandler,
	 *      selectionMode: 'multi',
	 *      sortInfo: {
	 *          fields: ['author'],
	 *          directions: ['asc']
	 *      },
     *      rowHeight:50,
     *      gridContainerClass:'gridCustomClass'
	 *   }
     * ``` 
	 */
    angular.module('siemens.simaticit.common.widgets.grid').directive('sitGrid', GridDirective);

    /**
    *
     * @ngdoc type
     * @name GridOptions
     * @module siemens.simaticit.common.widgets.grid
     * @description An object providing a detailed description for all the options supported
     * by the **sitGridOptions** parameter of the {@link siemens.simaticit.common.widgets.grid.sitGrid} directive.
     * @property {ColumnDef} columnDefs For a description of this object see {@link ColumnDef}
     * @property {String} [containerID=undefined] 
     * 
     * Identifies the ID of a containing element.
     * 
     * Identifying a containing element allows the widget to size itself. If the element has a fixed height, 
     * the height of the grid is adjusted to fit the available space. 
     * 
     * 
     * @property {String} [culture='en']
     * 
     * Defines the language to be used for localizing text in the grid.
     * 
     * For most processing do not set this. The value will be determined from the 
     * current preferred language of the **$translate** service. Setting a value here
     * will override the preferred language and force the grid to use the specified culture.
     * 
     * Values are set using the two letter ISO codes. For example: _'it'_ or _'de'_. 
     * 
     * @property {Object} [customRowClasses=undefined]
     * 
     * Defines the CSS classes to be used for customized styling of the grid rows. 
     * The following options are supported.
     * 
     * * **even**: Specifies the class to be used for even numbered rows.
     * * **odd**: Specifies the class to be used for odd numbered rows.
     * * **selected**: Specifies the class to be used for selected rows.
     * 
     * Example object
     * ```
     *  {
     *      even: 'myEvenRowClass',
     *      odd: 'myOddRowClass',
     *      selected: 'mySelectedRowClass'
     *  }
     * ```
     * 
     * @property {Number} [rowHeight=30]
     * Set the grid row height
     *
     * @property {Boolean} [enableColumnResize=true]
     * 
     * Determines if column resizing is enabled for any columns.
     * 
     * 
     * Setting the value to **false** turns off resizing for all columns. 
     * Setting the value to **true** turns on resizing for those columns configured as resizable. 
     * Configure a column as resizable using the **resizable** option of the corresponding 
     * column definition object in the  **columnDefs** option.
     * 
     * 
     * @property {Boolean} [enablePaging=true]
     * 
     * Determines if the pager is shown.
     *
     * If paging is not allowed, all rows appear in the grid with a vertical scroll.
     *
     * @property {Boolean} [alwaysShowPager=false] Specifies if the pager is always shown. 
     * The default behavior hides the pager if the number of items to show is less than the page size. This option allows a user to override that behavior.
     * 
     * @property {Boolean} [enableSorting=true]
     * 
     * Determines if sorting is enabled.
     *
     * When enabled, clicking in a column header will sort data by that column.
     * When not enabled, the grid will not respond to a click in the column header.
     * 
     * @property {String[]} [groups=undefined]
     * Specifies the field to group by.
     * 
     * The property value is an array of field names to potentially support multiple levels of grouping. 
     * However, the current implementation supports grouping on only one field.
     * 
     * @property {Boolean} [groupsCollapsedByDefault=true]
     * Determines whether or not the groups are initially collapsed when grouping data.
     * 
     * @property {String|Number} [height=undefined]
     * 
     * Specifies a fixed height to use for the grid.
     * 
     * If specified, the value overrides setting height by way of the **containerID** option.
     * 
     * @property {String} [noDataMessage=Localized version of 'No Data']
     * 
     * Specifies a message to show when no data is set to the grid.
     * 
     * @property {Object} pagingOptions
     * 
     * Defines the options for configuring the pager.
     * 
     * @property {String} [selectionMode='multi']
     * 
     * Specifies how rows may be selected.
     * 
     * The following modes are supported:
     * * **multi**: Multiple rows may be selected. Clicking a row toggles the selected state.
     * * **single**: Only one row may be selected. Clicking a row toggles selected state on that row and clears the state on all other selected rows.
     * * **none**: Row selection is disabled.
     * 
     * @property {Object} [serverDataOptions=undefined]
     * 
     * Contains settings that define the presentation service and data entity
     * to be used as a data source.
     * 
     * The object has the following format
     * 
     * ```
     *     {
     *         dataService: engineeringData,
     *         dataEntity: 'CommandDefinition',
     *         optionsString: ''
     *     }
     * ``` 
     * 
     * * **dataService**: a presentation service object such as engineeringData (object not string).
     * * **dataEntity**: the name of an entity to retrieve via the service.
     * * **optionsString**: an oData compliant query string.
     * 
     * @property {Boolean} [showSelectionCheckbox=false]
     * 
     * Determines if a check box is shown in the first column to indicate selection state.
     *   
     * @property {Boolean} [enableResponsiveBehaviour=false]
     * 
     * Determines if the widget is responsive for different device resolution. If set to true, when the device resolution
     * decreases, the columns are progressively hidden from right to left. 
     * 
     * @property {Boolean} [showRowHighlight=true]
     * 
     * Determines if selected rows are highlighted.
     * 
     * @property {Object} [sortInfo=undefined]
     * 
     * Sets the field and direction for sorting.
     * Only single field sorting is supported. However, the structure of the object
     * allows to specify multiple fields for possible future enhancement.
     * 
     * Object structure
     * * **fields** An array of field names.
     * * **directions** An array of directions. Allowed values are
     *  * **asc** (Ascending) 
     *  * **desc** (Descending)
     * 
     * Example object
     * ```
     *  {
     *      fields: ['lastName'],
     *      directions: ['asc']
     *  }
     * ```
     * 
     * A **$watch** is set on the **sortInfo** object so the grid can respond to any changes.
     * 
     * @property {String} [gridContainerClass = undefined] Applies the defined custom class's style to grid.
     *
     */
    /**

     *
     * @ngdoc type
     * @name ColumnDef
     * @module siemens.simaticit.common.widgets.grid
     * @description Defines the columns to appear in the grid. 
     * Each object in the array specifies a column to be displayed in the grid.  
     * Properties of each object specify how to display the data and how the column behaves. 
     * @property {String} field Field that corresponds to one of the properties of the objects in the sit-grid-data.
     * @property {Boolean} [groupable=true] identifies if the user is allowed to group rows by this column value.
     * @property {String} [displayName=field] The column header name displayed.
     * @property {String} cellFilter Filter to be used on the contents of the cell. For more information, see **ng-grid** documentation.
     * Examples include **currency** and **date** (with the following format: "dd/MM/yyyy HH:mm").
     * @property {String} cellTemplate Applies the custom format for the specified column cells.
     * ```
     *  {
     * cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"> custom template here </div>'
     *  }
     * ```
     * @property {Boolean} [resizable=true] Defines if the column can be resized. 
     * @property {Boolean} [sortable=true] Defines if the column can be used for sorting.
     * @property {Number} width _(Optional)_ Width of the column.
     * 
     * Note: When width attribute is set, double clicking the column resizer automatically resets the column width to it's best fit.
     *
     * @example
     * Example object
     * ```
     *      {
     *          field: 'currentDate',
     *          displayName: 'Date',
     *          cellFilter: 'date:\'shortDate\'',  //where 'shortDate' is the type of the format 
     *          cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span>sample text<\span></div>'
     *          resizable: true,
     *          sortable: true,
     *          width : 100
     *      }
     * ```
     *
     */

    /**
    *
    * @module siemens.simaticit.common.widgets.grid
    * @name gridConfigurationDetails
    * @access internal
    * @description
    * This provides a detailed description for all the options supported
    * by **sitGridOptions** parameter of the {@link siemens.simaticit.common.widgets.grid.sitGrid} directive.
    * 
    */
    var gridConfigurationDetails = {
        columnDefs: undefined,
        containerID: '',
        culture: 'en', //todo: determine if system only supports 2 letter identifier
        customRowClasses: {
            //even: undefined,
            //odd: undefined,
            //selected: undefined
        },
        enableColumnResize: true,
        enablePaging: true,
        groups: [],
        height: 500,
        noDataMessage: 'No Data',
        pageManager: null,
        pagingOptions: {
            pageSizes: [10, 25, 50, 100, 250],
            pageSize: 10,
            currentPage: 1
        },
        selectionMode: 'multi',
        showSelectionCheckbox: false,
        showRowHighlight: true,
        sortInfo: { fields: [], columns: [], directions: [] },
        useExternalSorting: true,   //for internal use so we can sort all data, not just current page.

        debug: false,
        enableResponsiveBehaviour: false
    };


    /**
     * Wraps use of the $log service for outputting diagnostic messages to the console
     * - Prepends message with a timestamp
     * - Formats message for consistancy: timestamp [function] message.
     * - Can turn on/off debug messages with configuration param so you do not have to comment out in code.
     */
    function LogWrapper($log, debug, module) {

        this.log = function (funcName, msg) { if (debug) { $log.log(getMessage(funcName, msg)); } };
        this.info = function (funcName, msg) { $log.info(getMessage(funcName, msg)); };
        this.warn = function (funcName, msg) { $log.warn(getMessage(funcName, msg)); };
        this.error = function (funcName, msg) { $log.error(getMessage(funcName, msg)); };

        function getMessage(funcName, msg) {
            return getTimeString() + ' [' + module + '] [' + funcName + '] ' + msg;
        }

        function getTimeString() {
            var d = new Date();
            var seconds = d.getSeconds();
            var secondString = seconds < 10 ? '0' + seconds : seconds.toString();
            var minutes = d.getMinutes();
            var minuteString = minutes < 10 ? '0' + minutes : minutes.toString();
            var hours = d.getHours();
            var hourString = hours < 10 ? '0' + hours : hours.toString();
            var ms = d.getMilliseconds();
            var msString;
            if (ms < 10) {
                msString = '00' + ms;
            }
            else if (ms < 100) {
                msString = '0' + ms;
            }
            else {
                msString = ms;
            }
            return hourString + ':' + minuteString + ':' + secondString + '.' + msString;
        }
    }

})();
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @module siemens.simaticit.common.widgets.grid
     * @name common.widgets.grid.service
     * @access internal
     * @description
     * This service provides functionalities to support the **sitGrid** directive.
     * * Defines a default configuration object and a method to extend the default values with a user-defined configuration.
     * * Implements a page manager object. This controls paging regardless of whether the data source is local or on the server.
     */
    angular.module('siemens.simaticit.common.widgets.grid').service('common.widgets.grid.service', GridManagerService);

    function GridManagerService() {
        /**
         * @ngdoc object
         * @module siemens.simaticit.common.widgets.grid
         * @name gridConfigurationDefaults
         * @access internal
         * @description
         * This provides the default values for **sitGridOptions** parameter of {@link siemens.simaticit.common.widgets.grid.sitGrid}.
         * 
         * 
         * @example
         * The following object contains default values for all supported options that have defaults other than **undefined**.
         * 
         * ```
         *  {
         *      enableColumnResize: true,
         *      enablePageing: true,
         *      enableSorting: true,
         *      groupsCollapsedByDefault: true,
         *      pagingOptions: {
         *          pageSizes: [10, 25, 50, 100, 250],
         *          pageSize: 10,
         *          currentPage: 1
         *      },
         *      selectionMode: 'multi',
         *      showRowHighlight: true
         *      showSelectionCheckbox: false,
         *  }
         * ```
         * 
         * For full description of all the supported options, see {@link siemens.simaticit.common.widgets.grid.gridConfigurationDetails}.
         * 
         */
        this.gridConfigurationDefaults = {
            enableColumnResize: true,
            enablePaging: true,
            enableSorting: true,
            //groups: [],
            groupsCollapsedByDefault: true,
            //height: '500px',
            //noDataMessage: 'No Data',
            pageManager: null,
            pagingOptions: {
                pageSizes: [10, 25, 50, 100, 250],
                pageSize: 10,
                currentPage: 1
            },
            quickSearchOptions: {
                enabled: true,
                field: '',
                filterText: ''
            },
            selectionMode: 'multi',
            //selectWithCheckboxOnly: false, //ngGrid supports but defaults to false. sitGrid doesn't support
            //serverConnectionParams: {
            //    dataType: undefined,   
            //    filter: undefined
            //},
            //sortInfo: { fields: [], columns: [], directions: [] },
            showSelectionCheckbox: false,
            showRowHighlight: true,
            useExternalSorting: true,   //TODO: verify correct behavior not used even though set here.

            debug: false,
            enableResponsiveBehaviour: false
        };

        /**
         * @ngdoc object
         * @module siemens.simaticit.common.widgets.grid
         * @name defaultColumn
         * @access internal
         * @description
         * The default values for a single column definition.
         * 
         * ```
         * {
         *      groupable: true,
         *      resizeable: true,
         *      sortable: true
         * }
         * ```
         * 
         * @property {string} [cellFilter] Specifies an **Angular JS** filter to be applied to the column.
         * @property {string} [displayName=field] Defines a user friendly name to use as header text for the column.
         * @property {string} field Identifies the data field to be used as the data source for the column.
         * @property {boolean} [groupable=true] Identifies if the user is allowed to group rows by this column value.
         * @property {boolean} [resizeable=true] Identifies if the user is allowed to resize the column.
         * @property {boolean} [sortable=true] Identifies if sorting is enabled for the column.
         */
        this.defaultColumn = {
            cellFilter: undefined,
            displayName: undefined,
            field: undefined,
            groupable: true,
            resizeable: true,
            sortable: true
        };

        
        function setGridConfigurationDefaults(config) {

            // create an object that has all the originial settings plus the defaults
            var configWithDefaults =  $.extend({}, this.gridConfigurationDefaults, config);
            
            // ensure a unique sortInfo reference. If not and multiple grids, sorting one grid will sort the other
            // also, ngGrid needs the columns property even though we don't do anything with it.
            if (config) {
                if (!config.sortInfo) {
                    configWithDefaults.sortInfo = { fields: [], columns: [], directions: [] };
                } else if (!config.sortInfo.columns) {
                    configWithDefaults.sortInfo.columns = [];
                }
            }

            // update the original obect with any default values
            $.extend(config, configWithDefaults);

            return config;
        }

        this.setGridConfigurationDefaults = setGridConfigurationDefaults;

    }
})();