/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/**
 * @ngdoc module
 * @name siemens.simaticit.common.widgets.itemCollectionViewer
 *
 * @description
 * This module provides functionalities to show a collection of items as a **grid** or **tiles**.
 * Depends on the following modules
	 * * **siemens.simaticit.common.widgets.grid**
	 * * **siemens.simaticit.common.widgets.tiles**
	 * * **siemens.simaticit.common.widgets.viewBar**
	 * * **siemens.simaticit.common.widgets.filterBar**
	 * * **siemens.simaticit.common.widgets.pager**
 * 
 */
(function () {
	'use strict';

	angular.module('siemens.simaticit.common.widgets.itemCollectionViewer', [
        'siemens.simaticit.common.widgets.grid',
        'siemens.simaticit.common.widgets.tiles',
        'siemens.simaticit.common.widgets.viewBar',
        'siemens.simaticit.common.widgets.filterBar',
        'siemens.simaticit.common.widgets.pager'
    ]);

})();
/*jshint -W098 */
(function () {
    'use strict';
    //#region ng-doc comments
    /**
    * @ngdoc type
    * @name ICVOptions
    * @module siemens.simaticit.common.widgets.itemCollectionViewer
    * @description An object containing the configuration settings for the Item Collection Viewer.
    * @property {Boolean} [noScroll=false] Specifies if the scroll bar for the ICV content should be displayed or hidden.
    * @property {Boolean} [alwaysShowPager=false] Specifies if the pager is always shown. The default behavior hides the pager if the number of items to show is less than the page size. This option allows a user to override that behavior.
    * @property {String} [bgColor=undefined] Represents the custom background color for non-selected tiles, either as a CSS color value or name (e.g. 'red' or '#647887'). 
    * @property {String} [bgColorSelected=undefined] Represents the custom background color for selected tiles, either as a CSS color value or name (e.g. 'red' or '#647887'). 
    * @property {String} [color=undefined] Represents the custom foreground color for non-selected tiles, either as a CSS color value or name (e.g. 'red' or '#647887'). 
    * @property {String} [colorSelected=undefined] Represents the custom foreground color for selected tiles, either as a CSS color value or name (e.g. 'red' or '#647887'). 
    * @property {String} [containerID=undefined] Identifies the ID of the containing element that is used to set the height of the tile size.
    * @property {String} [descriptionField=undefined] Specifies the name of the field to be used for the description text of tiles. 
    * If specified, the value of this field is retrieved and displayed in the tile. 
    * It overrides any value set in the **description** property of the tiles configuration object.
    * For more information, see {@link ActionTileContent} or {@link ItemTileContent} .
    *
    * This property supports **dot** notation. 
    * For example, consider a tile configuration object that has a property named **data**.
    * The value of the **data** property is itself an object that contains the property **type**.
    * To use the value of the **type** property as the description text of the tile, 
    * set '**data.type**' in the **descriptionField** property.
    * @property {Boolean}  [enablePaging=true] Specifies if the pager is displayed or not in the UI.
    * @property {String} [filterBarOptions=sqg] Specifies the options to be displayed in the filter bar.
    * 
    * Allowed values are:
    *  * **S**: Sorting 
    *  * **Q**: Quick Search
    *  * **F**: Filtering
    *  * **G**: Grouping 
    * 
    ***NOTE:** Values are not case sensitive.
    * @property {Object[]} [filterFields=undefined] Defines the data fields that may be used for filtering data.
    * 
    * Filtering of data in the **ICV** is accomplished using the: 
    * * {@link siemens.simaticit.common.widgets.filter.sitFilter} directive and the
    * * {@link siemens.simaticit.common.widgets.filter.sitFilterService} service.
    * 
    * The ICV wraps the use of these components so that a user of the ICV does
    * not need to interact with them directly. You only need to define
    * filter fields with this property and add the 'F' option to the **filterBarOptions** property.
    *
    * See {@link FilterField} for a detailed 
    * description of the configuration options.
    * @property {Object} [gridConfig=undefined] Contains settings for displaying data items as a grid.
    * 
    * Supports the following grid configuration options:
    * * **columnDefs**
    * * **customRowClasses**
    * * **enableColumnResize**
    *
    * For a full description of the options, see {@link GridOptions}.
    * @property {String} [groupField=''] Name of the field to be used to group data when the item collection is displayed for the first time.
    *
    * @property {String[] | Object[]} [groupFields=empty array] The list of fields a user can group by. 
    * 
    * If the array elements are strings, they represent the field names a user is allowed to group by.
    * These field names are added to a drop-down list in the filter bar of the ICV.
    * 
    * To provide more user friendly names in the dropdown, use objects as the array elements.
    * The objects must have the following format
    * ```
    *    {
    *        field: 'lastName',
    *        displayName: 'Last Name'
    *    }
    * ```
    * 
    * * **field**: defines the field name to use for grouping.
    * * **displayName**: defines the text to appear in the drop down.
    * 
    * @property {String} [height=undefined] Specifies a fixed size (in pixels) used to set the height of the widget.
    *
    * When set, it overrides the height set using the **containerId** property.
    * @property {Number} [rowHeight=30] Sets the grid row height.
    * @property {String} [image=undefined] The name of a **Font Awesome** icon to use as the default image for tiles.
    * 
    * This value is only used if a tile does not have the image property set.  
    *
    * **Note:** It does not override values that are set directly in the tile content.
    * @property {String} largeTileTemplate A string that contains a custom HTML template, which overrides the contents of the large tile, leaving the dimensions and some of the behaviors unchanged (e.g. selection).
    *
    * **Note:** The raw data set to ICV can be accessed via the **itemTileCtrl.tileContent** object (the same name must be used in the template) inside the custom template.
    *
     * For example, if the raw data set to ICV has a property called **version** , it can be accessed as **itemTileCtrl.tileContent.version**
    *```
    * <div class = 'customTileClass'> <span>{{ itemTileCtrl.tileContent.version }} </span> </div>
    *
    *```
    *
    * @property {String} mediumTileTemplate A string that contains a custom HTML template, which overrides the contents of the medium tile, leaving the dimensions and some of the behaviors unchanged (e.g. selection).
    *
    * **Note:** The raw data set to ICV can be accessed via the **itemTileCtrl.tileContent** object (the same name must be used in the template) inside the custom template.
    *
    * For example, if the raw data set to ICV has a property called **version** , it can be accessed as **itemTileCtrl.tileContent.version**
    *```
    * <div class = 'customTileClass'> <span>{{ itemTileCtrl.tileContent.version }} </span> </div>
    *
    *```
    * @property {Boolean} [multiSelect=true] Specifies if multiple items can be selected. 
    * @property {String} [noDataMessage=Localized version of 'No Data'] Specifies the message to be displayed when no data is set. 
    * @property {Object} pagingOptions Contains the options to configure the pager.
    * @property {Array} [propertyFields=undefined] Defines the fields to be displayed as properties in a tile.
    *
    * Example:
    * ```
    *  propertyFields[ 'firstName', 'lastName', 'country'] 
    * ```
    * 
    * You can also list the fields as objects to provide a localized name for the text label. 
    * By default, the field name is used. For example:
    * ```
    *  propertyFields: [
    *      { field: 'firstName', displayName: 'First Name' },
    *      { field: 'lastName', displayName: 'Last Name' },
    *      { field: 'country', displayName: 'Country' },
    *  ]
    * ```
    * 
    * If object notation is used and the **displayName** is not specified, the field is used as the label.
    * 
    * This property supports **dot** notation. 
    * For example, consider a tile configuration object that has a property named **data**.
    * The value of the **data** property is itself an object that contains the property **type**.
    * To use the value of the **type** property as one of the property fields of the tile, 
    * set '**data.type**' as a **propertyField** value.
    * ```
    *  ctrl.tileConent = {
    *      ...
    *      data: {
    *          name: weight,
    *          type: grams
    *      },
    *      ...
    *      propertyFields: [
    *          { field: 'data.type', displayName: 'unit' }
    *      ]
    * }
    * ```
    * 
    * @property {Object} [quickSearchOptions=undefined] Defines the options to manage the **Quick Search** behavior.
    * 
    * **Quick Search** is implemented by filtering the data collection and showing only the items
    * that match the specified criteria. Filtering is performed on only one configured data field. The
    * field is compared against the criteria to see if it begins with the specified value.
    * 
    * The object contains the following properties.
    * * **enabled**: Determines if quick search filtering is performed.
    * * **field**: The name of the field to compare with criteria.
    * * **filterText**: The text string to compare against the field.
    * 
    * @property {Function} [onPageChangedCallback=undefined] Specifies the function to call when the current page of data is changed. 
    * The function is passed as one argument: **pageNumber**, which represents the number of the new page.
    * @property {String} [onSelectionChangeCallback=undefined] Specifies the function to call when the list of selected items changes.
    * The function is passed in two arguments
    * * **selectedItems** An array of objects that represents the currently selected data items. 
    * * **selectedItem** The item a user clicked that triggered the selection change. 
    * **Note:** Set to **null** for programmatic selection.
    * @property {Function} [onSortingChangedCallback=undefined] 
    * Specifies the function to call when the list of selected items changes. 
    * The function is passed in two arguments:
    * * **field** The field being sorted
    * * **direction** The direction of the sort operation (asc/desc).
    * @property {String} [selectionMode="multi"] Specifies if the user can select only one item or multiple items or no items.
    * The following values are allowed:
    ** **multi**: Multiple items can be selected.
    ** **single**: Only single items can be selected. 
    ** **none**: No items can be selected.
    * @property {Object} [serverDataOptions=undefined] Contains settings that define the presentation service and data entity to be used as a data source.
    * 
    * The object has the following format
    * 
    * ```
    *     {
    *         dataService: engineeringData,
    *         dataEntity: 'CommandDefinition',
    *         optionsString: '',
    *         appName: 'myApp'
    *     }
    * ``` 
    * 
    * * **dataService**: A presentation service object such as **engineeringData**.
    * * **dataEntity**: The name of an entity to be retrieved using the service.
    * * **optionsString**: **oData** query options.
    * * **appName**: The name of the App where the entity is defined.
    * 
    * For dynamic data updates, it is necessary to call the {@link ICVOptions refresh} method.
    *
    * For example, the code snippet below updates serverDataOptions and refreshes the ICV dynamically.
    *```
    *            vm.icvGridOptions.serverDataOptions.optionsString = "$filter=(Name eq '" + selectedItem[0].Name + "')";
    *            vm.icvGridOptions.refresh();
    *```
    *
    * @property {String} smallTileTemplate A string that contains a custom HTML template, which overrides the contents of the small tile, leaving the dimensions and some of the behaviors unchanged (e.g. selection).
    *
    * **Note:** The raw data set to ICV can be accessed via the **itemTileCtrl.tileContent** object (the same name must be used in the template) inside the custom template.
    *
    * For example, if the raw data set to ICV has a property called **version** , it can be accessed as **itemTileCtrl.tileContent.version**
    *```
    * <div class = 'customTileClass'> <span>{{ itemTileCtrl.tileContent.version }} </span> </div>
    *
    *```
    * @property {Object} [sortInfo=undefined] Defines the fields that may be used for sorting as well as the initial sort for the collection.
    * 
    * The object has the following format:
    * 
    * ```
    *  {
    *      field: 'lastName',
    *      direction: 'asc',
    *      fields: [ 
    *          { field: 'lastName', displayName: 'Last Name'}, 
    *          { field: 'city', displayName: 'City'}, 
    *          { field: 'country', displayName: 'Country'} 
    *      ]
    *  }
    * ```
    * 
    * * **field**: The name of the field on which to sort.
    * * **direction**: The sort direction. Allowed values are: 
    *  * **asc** (Ascending)
    *  * **desc** (Descending)
    * * **fields**: An array of objects that defines the fields that may be used for sorting. 
    * 
    * The **fields** array contains objects with **field** and **displayName** properties.
    * This makes it possible to localize the options that are displayed to a user.
    * The **displayName** property does not need to be set. If not set, the **field** value is used.
    * 
    * The **fields** array also supports a list of strings. In this case, the strings
    * represent field names. 
    * **Note:** Localization is not supported using this format. 
    * 
    * @property {String} [titleField=undefined] Specifies the name of the field to use for the title text when the tiles are shown.
    * @property {Boolean} [useCustomColors="false"] Specifies whether the system uses the specified custom colors when the tiles are shown.
    * 
    * @property {Boolean} [enableResponsiveBehaviour="false"]   
    * Determines if the widget is responsive for different device resolution. If set to true the ICV will rearrange 
    * from large to wide and then to medium for **tile views** based on decreasing the device resolution. For extra small
    * devices the ICV will switch to compact mode.
    * 
    * @property {String} [viewMode="g"]  Defines how the data is initially shown.
    * 
    * The property value must be one of the following letter codes.
    * * **C**: Puts the ICV in **Compact Mode**. For feature description, see {@link siemens.simaticit.common.widgets.itemCollectionViewer.sitItemCollectionViewer}
    * * **G**: Shows data in a grid.
    * * **S**: Shows data as small tiles. (size **medium** item tile)
    * * **M**: Shows data as medium sized tiles. (size **wide** item tile)
    * * **L**: Shows data as large tiles. (size **large** item tile)
    * **Note:** The letter codes are not case sensitive. 
    * 
    * @property {String} [viewOptions="gsmlx"]  Defines the UI elements to be shown in the viewbar
    * 
    * The property value is any combination of the following letter codes.
    * * **G**: Shows the grid button.
    * * **S**: Shows the small tile button.
    * * **M**: Shows the medium tile button.
    * * **L**: Shows the large tile button.
    * * **X**: Shows the selection mode check box.  
    * **Note:** The letter codes are not case sensitive.
    * 
    * @property {String} [gridContainerClass = undefined] Applies the defined custom class's style to grid.
    *
    * @property {String} [tileContainerClass = undefined] Applies the defined custom class's style to tile.
    *
    */

    /**
    * @ngdoc directive
    * @module siemens.simaticit.common.widgets.itemCollectionViewer
    * @name sitItemCollectionViewer
    * 
    * @requires $log
    *
    * 
    * @restrict E
    * 
    * @description 
    * Displays a collection of items as tiles or in a grid.  
    * Includes UI to filter and sort data, and switch between tile view and grid view.
    * 
    * @param {Object[]} [sitData] An array of data objects to show as a collection.
    * <br><br>
    * If **serverDataOptions** are specified in the **sitOptions** parameter, then data is retrieved 
    * from a server. Any data items assigned to this property will be ignored.
    *
    *
    * @param {ICVOptions} sitOptions For a description of this object see {@link ICVOptions}
    * 
    * @example
    * In a view template, you can use the **sitItemCollectionViewer** as follows:
    * ```
    *       <sit-item-collection-viewer sit-data="viewerData" sit-options="viewerOptions"></sit-item-collection-viewer>
    * ```
    * 
    * In the corresponding view controller, add the **viewerData** and **viewerOptions** objects
    * to the controller to define the options for the view bar.
    * ```
    *   // viewerData defines the data objects to show
    * (function(){
    * 'use strict'
    * var app=angular.module('myModule');
    * 
    * function ControllerMethod(){
    * var vm=this;
    *   vm.viewerData = [
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
    *   // viewerOptions configures how to show the data
    *   vm.viewerOptions = {
    *      containerID: 'myIcvContainer',
    *      gridConfig: {
    *          columnDefs: [
    *		        { field: 'title', displayName: 'Title' },
    *		        { field: 'author', displayName: 'Author', resizable: false },
    *		        { field: 'yearPublished', displayName: 'Year' }
    *          ]
    *      },
    *      groupField: '',
    *      groupFields: ['title', 'author', 'yearPublished'],
    *      quickSearchOptions: {
    *          enabled: true,
    *          field: 'author',
    *          filterText: ''
    *      },
    *      onSelectionChangeCallback: ctrl.mySelectionChangeHandler,
    *      selectionMode: 'multi',
    *      selectStyle: 'alternate',
    *      sortInfo: {
    *          field: 'author',
    *          direction: 'asc',
    *          fields: ['title', 'author', 'yearPublished']
    *      },
    *      tileConfig: {
    *          titleField: 'title',
    *          descriptionField: 'subTitle'
    *      },
    *      viewMode: 'm',
    *      viewOptions: 'gsmlx',
    *      rowHeight:50,
    *      tileContainerClass:'tileCustomClass',
    *      gridContainerClass:'gridCustomClass'
    *
    *   }
    * }
    * 
    * ControllerMethod.$inject=['$log'];
    * app.contoller('controllerName',ControllerMethod);
    * })();
    *  
    * ```
    * 
    * 
    * <h2>Features</h2>
    * 
    * <h3>Item Selection</h3>
    * 
    * The ICV supports the following ways of selecting data-items:
    * * **Individual**: Select individual items by clicking on each item in the UI.
    * * **Group**: Select all items in a group by selecting the checkbox in the group header.
    * * **Programmatic**: Programmatic selection using the API methods attached to the **sitOptions** configuration object.
    * 
    * **Individual item selection**
    * 
    * Developers configure the ICV to operate in one of the following selection modes:
    * * Single item selection
    * * Multiple item selection _(default)_
    * * No selection
    * 
    * 
    * Configuration is carried out by setting the {@link siemens.simaticit.common.widgets.itemCollectionViewer.ICVOptions selectionMode} property to one of the allowed values.
    * ```
    *      selectionMode: 'single',
    * ```
    * 
    * By default, the user can toggle between single and multi selection by selecting  
    * or deselecting the checkbox in the viewBar.
    * Developers can disable the ability to toggle the selection mode by hiding the checkbox. To achieve this, 
    * set the {@link siemens.simaticit.common.widgets.itemCollectionViewer.ICVOptions viewOptions} 
    * property to make sure it does not have the 'x' parameter. 
    * ```
    *      // show buttons for grid, small/medium/large tiles, but not selection check.
    *      viewOptions: 'gsml',
    *      ...
    * ```
    * 
    * **Group selection**
    * 
    * When data items are grouped (in tile view modes or grid view modes), the group header contains a checkbox.
    * Check the checkbox to select all items in the group. 
    * Uncheck the checkbox to deselect all the items in the group.
    * 
    * The selection works whether or not the group is expanded (items visible).
    * 
    * Manual selection or deselection of items by clicking directly on the items has no affect on the header-check state. 
    * The header-check acts only as a trigger to select or deselect all items in the group. 
    * 
    * **Programmatic selection**
    * 
    * In order to show the data item in selected status when it is first displayed in the viewer, set the 
    * **selected** property on the item to **true**.
    * ```
    *      // select all items in collection with some property value
    *      angular.forEach(dataItems, function(item,index){
    *          if(item.distance > 500)
    *              item.selected = true;
    *      });
    * 
    *      // set the collection to the controller var mapped to the icv 'sit-data' attribute
    *      ctrl.sitData = dataItems;
    * ```
    * 
    * Also use this technique if adding new items to a collection already bound to the ICV.
    * ```
    *      var myNewDataItem = {
    *          name: antares,
    *          magnitued: 1.06,
    *          distance: 535,
    *          unit: 'ly',
    *          selected: true,
    *      }
    * 
    *      ctrl.sitData.push(myNewDataItem);
    * ```
    * 
    * To manage programmatic selection after data items are added, use the
    * {@link ICVOptions API methods} on the 
    * **sitOptions** configuration object.
    * 
    * Use {@link ICVOptions#selectItems selectItems}
    * to select one or more items.
    * 
    * Use {@link ICVOptions#selectAll selectAll}
    * to select or deselect all items.
    *
    * <h3>View Options</h3>
    * 
    * The Item Collection Viewer has 4 main sections:
    * * The **Viewbar** on the left side of the header.
    * * The **Filterbar** on the right side of the header.
    * * The **Data** area occupies the whole area between the header and footer.
    * * The **Pager** in the footer.
    * 
    * The data items can be visualized as a grid or a collection of tiles. The view bar allows
    * the user to toggle between different view modes. The developer can control the 
    * view modes that are available to the user through the {@link ICVOptions viewOptions} property
    * of the configuration object. 
    * 
    * When viewing data as a grid, you must define which data fields to show as columns.
    * Use the {@link ICVOptions gridConfig} property
    * for grid specific settings.
    * 
    * <h3>Compact Mode</h3>
    * 
    * Compact mode is a special view-mode of the **itemCollectionViewer** that displays the collection of data items in a minimal space. 
    * It is enabled by setting the value of the {@link ICVOptions viewMode}
    * configuration setting to **C**. In this mode the ICV has following restrictions:
    * * The **Viewbar** is not visible, which blocks the user from changing the view mode.
    * * Data is displayed as a collection of **medium item** tiles that are stacked vertically.
    * * The ICV width is set to a value that is sufficient to contain the medium tile width.
    * * Paging is disabled, but tiles can be scrolled vertically.
    * 
    * <h3>Effects of default options</h3>
    * **Grouping**
    * * Data is not grouped by default.
    * * To have data grouped when first shown, set values to both **groupFields** and **groupField** options.
    * 
    * **Paging**
    * * Paging is enabled by default.
    * * If the number of total data items is less than the page size, the pager is not shown.
    * * The pager can always be shown by setting the **alwaysShowPager** option to **true**.
    * * Paging can be disabled by setting the **enablePaging** option to **false**.
    * 
    * **Sorting**
    * * Data is not sorted by default.
    * * This is indicated by having neither the sort ascending nor sort descending buttons highlighted as active.
    * 
    */
    //#endregion ng-doc comments
    ItemCollectionViewerController.$inject = ['$rootScope', '$timeout', '$log', 'common.widgets.itemCollectionViewer.service', 'common.widgets.pager.pageService', '$translate', '$element'];
    function ItemCollectionViewerController($rootScope, $timeout, $log, itemCollectionViewerService, uyPageService, $translate, $element) {
        var ctrl = this;
        var element = $element;
        var logger, viewMode, compactMode, localPageOptions, viewOptions;

        function initializeTileViewOptions() {
            var tileMode, tileTpl;
            if (compactMode || viewMode === 's') {
                tileMode = 'medium';
                tileTpl = ctrl.sitOptions ? ctrl.sitOptions.smallTileTemplate : '';
            } else if (viewMode === 'm') {
                tileMode = 'wide';
                tileTpl = ctrl.sitOptions ? ctrl.sitOptions.mediumTileTemplate : '';
            } else {
                tileMode = 'large';
                tileTpl = ctrl.sitOptions ? ctrl.sitOptions.largeTileTemplate : '';
            }
            // tile view options
            if (ctrl.sitOptions) {
                ctrl.tileViewOptions = {
                    alwaysShowPager: compactMode ? false : ctrl.sitOptions.alwaysShowPager,
                    bgColor: ctrl.sitOptions.bgColor,
                    bgColorSelected: ctrl.sitOptions.bgColorSelected,
                    color: ctrl.sitOptions.color,
                    colorSelected: ctrl.sitOptions.colorSelected,
                    containerID: 'tileViewDiv',
                    descriptionField: ctrl.sitOptions.tileConfig.descriptionField,
                    noDataMessage: ctrl.sitOptions.noDataMessage,
                    enablePaging: compactMode ? false : ctrl.sitOptions.enablePaging,
                    groupBy: ctrl.sitOptions.groupField,
                    handleResize: ctrl.handleResize, // force tile-view to handle resize even though specific height is set.
                    image: ctrl.sitOptions.image ? ctrl.sitOptions.image : ctrl.sitOptions.tileConfig.image,
                    multiSelect: compactMode ? false : ctrl.sitOptions.selectionMode === 'multi',
                    selectionMode: ctrl.sitOptions.selectionMode,
                    pageManager: ctrl.pageManager,
                    pagingOptions: localPageOptions,
                    propertyFields: ctrl.sitOptions.tileConfig.propertyFields,
                    quickSearchOptions: ctrl.sitOptions.quickSearchOptions,
                    onPageChangedCallback: ctrl.sitOptions.onPageChangedCallback,
                    onSelectionChangeCallback: ctrl.sitOptions.onSelectionChangeCallback,
                    onSortingChangedCallback: ctrl.sitOptions.onSortingChangedCallback,
                    selectStyle: compactMode ? 'alternate' : ctrl.sitOptions.selectStyle,
                    sortInfo: ctrl.sitOptions.sortInfo,
                    tileSize: tileMode,
                    tileType: 'item', //hardcoded. do not let user specify
                    titleField: ctrl.sitOptions.tileConfig.titleField,
                    useCustomColors: ctrl.sitOptions.useCustomColors,
                    viewHeight: ctrl.collectionHeight,
                    debug: ctrl.sitOptions.debug,
                    tileTemplate: tileTpl,
                    enableResponsiveBehaviour: ctrl.sitOptions.enableResponsiveBehaviour,
                    tileViewMode: viewMode,
                    noScroll: ctrl.sitOptions.noScroll,
                    tileContainerClass: ctrl.sitOptions.tileContainerClass
                };
            } else {
                ctrl.tileViewOptions = {
                    alwaysShowPager: false,
                    bgColor: '',
                    bgColorSelected: '',
                    color: '',
                    colorSelected: '',
                    containerID: 'tileViewDiv',
                    descriptionField: '',
                    noDataMessage: '',
                    enablePaging: false,
                    groupBy: '',
                    handleResize: ctrl.handleResize, // force tile-view to handle resize even though specific height is set.
                    image: '',
                    multiSelect: false,
                    selectionMode: 'single',
                    pageManager: ctrl.pageManager,
                    pagingOptions: localPageOptions,
                    propertyFields: [],
                    quickSearchOptions: {},
                    onPageChangedCallback: null,
                    onSelectionChangeCallback: null,
                    onSortingChangedCallback: null,
                    selectStyle: compactMode ? 'alternate' : '',
                    sortInfo: {},
                    tileSize: tileMode,
                    tileType: 'item', //hardcoded. do not let user specify
                    titleField: '',
                    useCustomColors: false,
                    viewHeight: ctrl.collectionHeight,
                    debug: false,
                    enableResponsiveBehaviour: false,
                    tileTemplate: tileTpl,
                    tileViewMode: viewMode,
                    noScroll: false,
                    tileContainerClass: ''
                };
            }
        }

        function initializeGridViewOptions() {
            // grid view options
            ctrl.gridOptions = $.extend(true, {}, ctrl.sitOptions ? ctrl.sitOptions.gridConfig : {});
            ctrl.gridOptions.gridContainerClass = ctrl.sitOptions ? ctrl.sitOptions.gridContainerClass : '';
            ctrl.gridOptions.alwaysShowPager = ctrl.sitOptions ? ctrl.sitOptions.alwaysShowPager : false;
            ctrl.gridOptions.containerID = 'gridViewDiv';
            //ctrl.gridOptions.containerID = 'itemCollectionCanvas',
            ctrl.gridOptions.enablePaging = ctrl.sitOptions ? ctrl.sitOptions.enablePaging : false;
            ctrl.gridOptions.handleResize = ctrl.handleResize;      // force grid to handle resize even though specific height is set.
            ctrl.gridOptions.height = ctrl.collectionHeight;
            ctrl.gridOptions.rowHeight = ctrl.sitOptions.rowHeight;
            ctrl.gridOptions.groups = ctrl.sitOptions ? (ctrl.sitOptions.groupField !== '' ? [ctrl.sitOptions.groupField] : []) : [];
            ctrl.gridOptions.pageManager = ctrl.pageManager;
            ctrl.gridOptions.pagingOptions = localPageOptions;
            ctrl.gridOptions.quickSearchOptions = ctrl.sitOptions ? ctrl.sitOptions.quickSearchOptions : [];
            ctrl.gridOptions.noDataMessage = ctrl.sitOptions ? ctrl.sitOptions.noDataMessage : '';
            ctrl.gridOptions.onPageChangedCallback = ctrl.sitOptions ? ctrl.sitOptions.onPageChangedCallback : null;
            ctrl.gridOptions.onSelectionChangeCallback = ctrl.sitOptions ? ctrl.sitOptions.onSelectionChangeCallback : null;
            // the grid may initiate a sort, so we need to handle in this controller. ctrl func will call callback if exists.
            ctrl.gridOptions.onSortingChangedCallback = ctrl.sortingChangedCallback;
            ctrl.gridOptions.selectionMode = ctrl.sitOptions ? ctrl.sitOptions.selectionMode : '';
            ctrl.gridOptions.noScroll = ctrl.sitOptions ? ctrl.sitOptions.noScroll : false;
            ctrl.gridOptions.debug = ctrl.sitOptions ? ctrl.sitOptions.debug : false;
            ctrl.gridOptions.enableResponsiveBehaviour = ctrl.sitOptions ? ctrl.sitOptions.enableResponsiveBehaviour : false;
            //Fix 30073 : Initializing the sorting fields in grid
            ctrl.gridOptions.sortInfo = {
                fields: [],
                directions: [],
                columns: []
            };
            if (ctrl.sitOptions && ctrl.sitOptions.sortInfo && ctrl.sitOptions.sortInfo.direction) {
                ctrl.gridOptions.sortInfo.fields.push(ctrl.sitOptions.sortInfo.field);
                ctrl.gridOptions.sortInfo.directions.push(ctrl.sitOptions.sortInfo.direction);
            }
        }

        function initializeViewOptions() {
            // view bar options
            viewOptions = ctrl.sitOptions ? ctrl.sitOptions.viewOptions.toLowerCase() : '';
            if (compactMode) {
                ctrl.viewBarOptions = {
                    grid: { show: false },
                    smallTile: { show: false },
                    mediumTile: { show: false },
                    largeTile: { show: false },
                    check: { show: false },
                    details: { show: false }
                };
            } else {
                ctrl.viewBarOptions = {
                    grid: {
                        show: viewOptions && viewOptions.indexOf('g') !== -1,
                        selected: ctrl.sitOptions ? ctrl.sitOptions.viewMode === 'g' : false,
                        onClickCallback: function () {
                            ctrl.changeViewMode('grid');
                        }
                    },
                    smallTile: {
                        show: viewOptions && viewOptions.indexOf('s') !== -1,
                        selected: ctrl.sitOptions ? ctrl.sitOptions.viewMode === 's' : false,
                        onClickCallback: function () {
                            ctrl.changeViewMode('tile', 'medium');
                        }
                    },
                    mediumTile: {
                        show: viewOptions && viewOptions.indexOf('m') !== -1,
                        selected: ctrl.sitOptions ? ctrl.sitOptions.viewMode === 'm' : false,
                        onClickCallback: function () {
                            ctrl.changeViewMode('tile', 'wide');
                        }
                    },
                    largeTile: {
                        show: viewOptions && viewOptions.indexOf('l') !== -1,
                        selected: ctrl.sitOptions ? ctrl.sitOptions.viewMode === 'l' : false,
                        onClickCallback: function () {
                            ctrl.changeViewMode('tile', 'large');
                        }
                    },
                    //todo: change name to something more indicitive of purpose rather than the check icon that is displayed
                    check: {
                        show: ctrl.sitOptions ? ctrl.sitOptions.selectionMode !== 'none' && viewOptions && viewOptions.indexOf('x') !== -1 : false,
                        selected: ctrl.sitOptions ? ctrl.sitOptions.selectionMode === 'multi' : false,
                        onClickCallback: function (multiSelect) {
                            var mode = multiSelect ? 'multi' : 'single';
                            ctrl.tileViewOptions.multiSelect = multiSelect;
                            ctrl.gridOptions.selectionMode = mode;
                            // change gridOptions object to trigger grid's watch on the options
                            ctrl.gridOptions = $.extend(true, {}, ctrl.gridOptions);
                            logger.log('selection mode button callback', 'selection mode changed to ' + mode);
                        }
                    },
                    details: {
                        //todo: implement showing details of selected item when this button clicked.
                        show: viewOptions && viewOptions.indexOf('d') !== -1,
                        selected: false,
                        onClickCallback: function () {
                            //todo: implement handler for click of details button
                        }
                    }
                };
            }
        }

        function activate() {
            itemCollectionViewerService.setConfigurationDefaults(ctrl.sitOptions);
            logger = new LogWrapper($log, (ctrl.sitOptions ? ctrl.sitOptions.debug : false), 'ItemCollectionViewer.controller');
            ctrl.groupBy = ctrl.sitOptions ? ctrl.sitOptions.groupField : '';
            ctrl.viewHeight = ctrl.sitOptions ? ctrl.sitOptions.height : 0;
            ctrl.multiSelect = ctrl.sitOptions ? ctrl.sitOptions.selectionMode === 'multi' : false;
            ctrl.resetView = true;
            //hiding no data message on load and handle it when change in sitData (i.e, in resetData). 
            ctrl.noData = true;
            ctrl.noDataMessage = ctrl.sitOptions ? (ctrl.sitOptions.noDataMessage ? ctrl.sitOptions.noDataMessage : $translate.instant('common.no-data')) : '';
            ctrl.showFilter = false;
            ctrl.filterSearchOptions = {};
            viewMode = ctrl.sitOptions ? ctrl.sitOptions.viewMode.toLowerCase() : '';

            // check for compact mode and fix width if necessary so it works well with medium item tile.
            compactMode = viewMode === 'c';
            ctrl.compactStyle = compactMode ? { width: '267px' } : '';
            ctrl.handleResize = true;
            ctrl.collectionStyle = {};
            ctrl.setPageManager(true);

            // local copy of paging options to pass to the grid/tileView
            // don't want either corrupting the original
            localPageOptions = $.extend(true, {}, ctrl.sitOptions ? ctrl.sitOptions.pagingOptions : {});
            localPageOptions.initialPageSize = localPageOptions.pageSize;

            initializeTileViewOptions();
            initializeGridViewOptions();
            initializeViewOptions();

            ctrl.updateFilterBarOptions();
            ctrl.setOptionsAPIMethods();
        }

        ctrl.setCollectionStyle = function () {
            ctrl.initializeHeight();
            return ctrl.collectionStyle;
        };

        ctrl.setCollectionHeight = function (height) {
            //TODO: standardize view/filter bar height. one is 44 and one 47 in Chrome. 
            var headerHeight = 50;
            //if both the sort and search controls are showing in compact mode, they will stack.
            //NOTE: tried to add api methods to filterbar, but the link function on this directive
            //      (which calls the initialize height method) is called before the controller function of the
            //      filterbar directive(which adds the api functions.). Thought all controllers called before linking phase...
            //      So below is code duplication to see what filter bar contols are showing
            var displayOptions = ctrl.sitOptions ? ctrl.sitOptions.filterBarOptions.toLowerCase() : '';
            var sortVisible = displayOptions.indexOf('s') !== -1 && /*ctrl.sitOptions.sortFields &&*/ ctrl.sitOptions.sortInfo.fields && ctrl.sitOptions.sortInfo.fields.length > 0;
            var searchVisible = displayOptions.indexOf('q') !== -1;
            if (compactMode && sortVisible && searchVisible) {
                headerHeight = 100;
            }
            ctrl.collectionHeight = height - headerHeight;
            ctrl.collectionStyle = { "height": ctrl.collectionHeight + 'px' };
        };

        ctrl.setHeight = function (height) {
            if (!height) {
                height = ctrl.sitOptions ? getElementHeight(ctrl.sitOptions.containerID) : 0;
            }
            if (height <= 0) {
                return;
            }

            ctrl.setCollectionHeight(height);

            // in case of multiple ICVs on a page, set heights only for decendents of specified container
            element.find('#itemCollectionViewerContainer').height(height);
            element.find('#itemCollectionCanvas').height(ctrl.collectionHeight);
            element.find('#noDataDiv').height(ctrl.collectionHeight);
            element.find('#gridViewDiv').height(ctrl.collectionHeight);
            element.find('#tileViewDiv').height(ctrl.collectionHeight);

            logger.log('icvCtrl.setHeight', 'widgetHeight: ' + height + 'px, collectionHeight: ' + ctrl.collectionHeight + 'px');
        };

        ctrl.checkResponsiveness = function (width) {
            if(!ctrl.sitOptions.enableResponsiveBehaviour){
                return;
            }
            if (width < 500) {
                if(ctrl.sitOptions.viewMode !== 'c' && !ctrl.isCompactView){
                    setPreviousViewMode();
                    ctrl.sitOptions.viewMode = 'c';
                    reinitializeICV();
                    ctrl.isCompactView = true;
                }
            } else {
                if(ctrl.sitOptions.viewMode === 'c' && ctrl.isCompactView) {
                    ctrl.sitOptions.viewMode = ctrl.prevViewMode;
                    reinitializeICV();
                    ctrl.isCompactView = false;
                }
            }
        };

        ctrl.initializeHeight = function () {
            var widgetHeight = 0;
            if (ctrl.sitOptions) {
                if (ctrl.sitOptions.height) {
                    widgetHeight = ctrl.sitOptions.height;
                } else if (ctrl.sitOptions.containerID) {
                    widgetHeight = getElementHeight(ctrl.sitOptions.containerID);
                    if (widgetHeight > 0) {
                        ctrl.handleResize = true;
                    }
                }
            }

            // default to half the window height
            if (widgetHeight <= 0) {
                widgetHeight = Math.ceil($(window).height() / 2);
            }

            ctrl.setHeight(widgetHeight);

            // update the options for both grid/tileView to have correct settings for handling resize
            ctrl.tileViewOptions.handleResize = ctrl.handleResize;
            ctrl.tileViewOptions.viewHeight = ctrl.collectionHeight;
            ctrl.gridOptions.handleResize = ctrl.handleResize;
            ctrl.gridOptions.height = ctrl.collectionHeight;
        };

        function setPreviousViewMode(){
            if(ctrl.viewMode === 'grid'){
                ctrl.prevViewMode = 'g';
            } else if(ctrl.viewMode === 'tile'){
                if(ctrl.tileViewOptions.tileSize === 'medium'){
                    ctrl.prevViewMode = 's';
                }else if(ctrl.tileViewOptions.tileSize === 'wide'){
                    ctrl.prevViewMode = 'm';
                }else{
                    ctrl.prevViewMode = 'l';
                }
            }
        }

        function reinitializeICV(){
            ctrl.resetView = false;
            viewMode = ctrl.sitOptions ? ctrl.sitOptions.viewMode.toLowerCase() : '';
            compactMode = viewMode === 'c';
            ctrl.compactStyle = compactMode ? { width: '267px' } : '';
            ctrl.setPageManager(true);
            initializeTileViewOptions();
            initializeGridViewOptions();
            initializeViewOptions();
            ctrl.updateFilterBarOptions();
            $timeout(function() {
                ctrl.resetView = true;
            });
        }

        function getElementHeight(id) {
            var height = 0;
            var container = $('#' + id);
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

        // set page manager here to share between grid/tile views
        ctrl.setPageManager = function (setViewMode) {
            if (ctrl.pageManager !== undefined) {
                ctrl.sitOptions.pagingOptions.pageSize = ctrl.pageManager.getPageSize();
                ctrl.sitOptions.pagingOptions.currentPage = ctrl.pageManager.getCurrentPage();
            }
            ctrl.pageManager = uyPageService.getPageManager(ctrl.sitOptions ? ctrl.sitOptions : {}, ctrl.sitData);
            if (setViewMode) {
                if (compactMode) {
                    ctrl.viewMode = 'compact';
                } else if (ctrl.sitOptions && (ctrl.sitOptions.viewMode === 'g' || ctrl.sitOptions.viewMode === 'G')) {
                    ctrl.viewMode = 'grid';
                } else {
                    ctrl.viewMode = 'tile';
                }
            }
        };

        ctrl.sortingChangedCallback = function (sortInfo) {
            ctrl.filterOptions.changeSort(sortInfo.field, sortInfo.direction);
            if (ctrl.sitOptions) {
                if (ctrl.sitOptions.onSortingChangedCallback) {
                    ctrl.sitOptions.onSortingChangedCallback(sortInfo);
                }
            }
        };

        if (ctrl.sitOptions) {
            ctrl.sitOptions.getSelectedItems = function () {
                if (ctrl.viewMode === 'grid') {
                    //if no data, grid ctrl may never have been called to create the getSelectedItems func
                    return ctrl.gridOptions.getSelectedItems ? ctrl.gridOptions.getSelectedItems() : [];
                } else {
                    return ctrl.tileViewOptions.getSelectedItems ? ctrl.tileViewOptions.getSelectedItems() : [];
                }
            };
        }

        // apply the given filter clauses to the grid or tile data
        ctrl.applyFilter = function (clauses) {
            ctrl.filterOptions.setFilterSelected(!!clauses && clauses.length > 0);
            ctrl.showFilter = false;

            if (ctrl.viewMode === 'grid') {
                ctrl.gridOptions.setFilter(clauses);
            } else {
                ctrl.tileViewOptions.setFilter(clauses);
            }
        };

        // clear any filtering in the grid or tile view
        ctrl.resetFilter = function () {
            ctrl.filterOptions.setFilterSelected();
            if (ctrl.viewMode === 'grid') {
                ctrl.gridOptions.setFilter([]);
            } else {
                ctrl.tileViewOptions.setFilter([]);
            }
        };

        ctrl.changeViewMode = function (mode, size) {
            //var viewerChanged = ctrl.viewMode !== mode;
            ctrl.viewMode = mode;
            var searchText = ctrl.filterOptions.getSearchText();
            var groupField = ctrl.filterOptions.getGroupField();
            var sortInfo = ctrl.filterOptions.getSortInfo();
            if (ctrl.viewMode === 'tile') {
                var tileTpl = '';
                if (ctrl.sitOptions) {
                    tileTpl = ctrl.sitOptions.largeTileTemplate;
                    if (size === 'medium') {
                        tileTpl = ctrl.sitOptions.smallTileTemplate;
                    } else if (size === 'wide') {
                        tileTpl = ctrl.sitOptions.mediumTileTemplate;
                    }
                }
                ctrl.tileViewOptions.tileTemplate = tileTpl;
                ctrl.tileViewOptions.tileSize = size;
                ctrl.tileViewOptions.tileViewMode = size;
                // in case resize supported and window size has changed, make sure widget sized correctly
                ctrl.tileViewOptions.viewHeight = ctrl.collectionHeight;
                // push filterBar options the user may have changed to the config object
                ctrl.tileViewOptions.quickSearchOptions.filterText = searchText;
                ctrl.tileViewOptions.groupBy = groupField;
                ctrl.tileViewOptions.sortInfo = sortInfo;
                // keep pager settings as user toggles between tile/grid view
                ctrl.tileViewOptions.pagingOptions.pageSize = ctrl.pageManager.getPageSize();
                ctrl.tileViewOptions.pagingOptions.currentPage = ctrl.pageManager.getCurrentPage();
                logger.log('view button callback', 'view mode changed to ' + size + ' tile');
            } else {
                ctrl.gridOptions.height = ctrl.collectionHeight;
                ctrl.gridOptions.quickSearchOptions.filterText = searchText;
                //TODO: somehow setting groups here will break sorting in the grid.
                //      so temporarilly, just dont pass group field set in tile view to grid.
                //      this seems like the less bad limitation
                //ctrl.gridOptions.groups.length = 0;// = [groupField];
                //ctrl.gridOptions.groups.push(groupField);
                // filterBar sets direction to 'none' if no sort enabled.
                if (sortInfo.direction !== 'none') {
                    ctrl.gridOptions.sortInfo.fields.length = 0;
                    ctrl.gridOptions.sortInfo.fields.push(sortInfo.field);
                    ctrl.gridOptions.sortInfo.directions.length = 0;
                    ctrl.gridOptions.sortInfo.directions.push(sortInfo.direction);
                    ctrl.gridOptions.sortInfo.columns.length = 0;
                }
                // keep pager settings as user toggles between tile/grid view
                ctrl.gridOptions.pagingOptions.pageSize = ctrl.pageManager.getPageSize();
                ctrl.gridOptions.pagingOptions.currentPage = ctrl.pageManager.getCurrentPage();
                logger.log('view button callback', 'view mode changed to grid');
            }
        };

        // filter bar options
        ctrl.updateFilterBarOptions = function () {
            ctrl.filterOptions = {
                quickSearchText: (ctrl.sitOptions && ctrl.sitOptions.quickSearchOptions && ctrl.sitOptions.quickSearchOptions.filterText) ? ctrl.sitOptions.quickSearchOptions.filterText : '',
                currentGroupField: ctrl.sitOptions ? ctrl.sitOptions.groupField : '',
                currentSortDirection: ctrl.sitOptions ? ctrl.sitOptions.sortInfo.direction : '',
                currentSortField: ctrl.sitOptions ? ctrl.sitOptions.sortInfo.field : '',
                displayOptions: ctrl.sitOptions ? ctrl.sitOptions.filterBarOptions + (compactMode ? 'c' : '') : '',
                onFilterClickCallback: function () {
                    ctrl.showFilter = !ctrl.showFilter;
                    if (ctrl.showFilter) {
                        if (ctrl.sitOptions) {
                            var container = $("#" + ctrl.sitOptions.containerID);
                            container.find('#filter').css('max-height', ctrl.collectionHeight * 0.3);
                        }
                    }
                },
                groupByFields: ctrl.sitOptions ? ctrl.sitOptions.groupFields : '',
                onGroupChangeCallback: function (group) {
                    logger.log('onGroupChangeCallback', 'selected group field: ' + group);
                    if (ctrl.viewMode === 'grid'){
                        ctrl.gridOptions.groups = group ? [group] : [];
                    } else{
                        ctrl.tileViewOptions.groupBy = group ? group : '';
                    }
                    //ctrl.gridOptions = $.extend(true, {}, ctrl.gridOptions); // this will force a redraw of the grid
                },
                quickSearchField: ctrl.sitOptions ? ctrl.sitOptions.quickSearchOptions.field : '',
                onSearchChangeCallback: function (searchText) {
                    var message = 'quick search: text: [' + searchText + '].';
                    logger.log('onSearchChangeCallback', message);
                    if (ctrl.viewMode === 'grid') {
                        ctrl.gridOptions.quickSearchOptions.filterText = searchText;
                    } else {
                        ctrl.tileViewOptions.quickSearchOptions.filterText = searchText;
                    }
                    $rootScope.$on('sit-grid.data-filtered', function () {
                        $rootScope.$broadcast('sit-item-collection-viewer.data-search-completed');
                    });
                },
                //sortByFields: ctrl.sitOptions.sortFields,
                sortByFields: ctrl.sitOptions ? ctrl.sitOptions.sortInfo.fields : '',
                onSortChangeCallback: function (field, direction) {
                    var message = 'sort changed: field: [' + field + '], direction: [' + direction + '].';
                    logger.log('onSortChangeCallback', message);
                    if (ctrl.viewMode === 'grid') {
                        if (ctrl.gridOptions.sortBy) {
                            ctrl.gridOptions.sortBy(field, direction);
                        }
                    } else {
                        var si = {
                            field: field, direction: direction
                        };
                        ctrl.tileViewOptions.sortInfo = si;
                    }
                },
                filterFields: ctrl.sitOptions ? ctrl.sitOptions.filterFields : ''
            };
            // verify quick search field is set if configured to show. If not, do not show quick search
            if (ctrl.filterOptions.displayOptions) {
                var qIndex = ctrl.filterOptions.displayOptions.toLowerCase().indexOf("q");
                if (qIndex !== -1 && (!ctrl.filterOptions.quickSearchField || ctrl.filterOptions.quickSearchField.length === 0)) {
                    if (ctrl.sitOptions) {
                        ctrl.filterOptions.displayOptions = ctrl.sitOptions.filterBarOptions = ctrl.sitOptions.filterBarOptions.replace('q', '');
                    }
                    logger.warn('setFilterOptions', 'Quick Search control configured to display but no search field specified. Not showing control.');
                }
            }
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#refresh
        *
        * @description
        * An API used to refresh the ICV when used in server mode on change of any options.
        * It is not required in local mode.
        *  @param {Boolean} [resetDataFlag= undefined] If true, resets the grid option to default value
        *
        */
        ctrl.refresh = function (resetDataFlag) {
            ctrl.dataUpdated(resetDataFlag);
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#dataUpdated
        *
        * @deprecated Use {@link ICVOptions refresh} instead.
        *
        */
        ctrl.dataUpdated = function (resetDataFlag) {
            if (!resetDataFlag) {
                ctrl.resetData();
                $rootScope.$broadcast('grid.refreshList');
            }
            if (ctrl.gridOptions.dataUpdated && ctrl.viewMode === 'grid') {
                ctrl.gridOptions.dataUpdated();
            } else if (ctrl.tileViewOptions.dataUpdated) {
                ctrl.tileViewOptions.dataUpdated();
            }
        };


        ctrl.resetData = function () {        
            ctrl.setPageManager(false);
            ctrl.tileViewOptions.pageManager = ctrl.gridOptions.pageManager = ctrl.pageManager;
            // gridConfig/tileConfig default to undefined on the options object
            if (ctrl.sitOptions) {
                if (ctrl.sitOptions.gridConfig) {
                    ctrl.gridOptions.columnDefs = ctrl.sitOptions.gridConfig.columnDefs;
                }
                if (ctrl.sitOptions.tileConfig) {
                    ctrl.tileViewOptions.descriptionField = ctrl.sitOptions.tileConfig.descriptionField;
                    ctrl.tileViewOptions.titleField = ctrl.sitOptions.tileConfig.titleField;
                    ctrl.tileViewOptions.propertyFields = ctrl.sitOptions.tileConfig.propertyFields;                   
                }
            }
            if (ctrl.sitData && ctrl.sitData.length) {
                ctrl.noData = false;
            } else {
                ctrl.noData = true;
            }
            //ctrl.dataUpdated();
            // both tile and grid have watches on local data and will respond
            // if we are sure those watch handlers execute after this, then we are OK.
            // otherwise, we need to make sure that these option changes are pushed to tile/grid 
            // prior to their watch handlers executing.
        };

        //functions for item selection api
        ctrl.selectItems = function (items, state, clear) {
            //items is expected to be an array of numbers or objects
            if (!items || items.constructor !== Array) {
                return;
            }
            // defer work to active viewer
            if (ctrl.viewMode === 'grid') {
                ctrl.gridOptions.selectItems(items, state, clear);
            } else {
                ctrl.tileViewOptions.selectItems(items, state, clear);
            }
        };

        ctrl.selectAll = function (state) {
            if (ctrl.viewMode === 'grid') {
                if (ctrl.gridOptions && ctrl.gridOptions.selectAll) {
                    ctrl.gridOptions.selectAll(state);
                }
            } else {
                if (ctrl.tileViewOptions && ctrl.tileViewOptions.selectAll) {
                    ctrl.tileViewOptions.selectAll(state);
                }
            }
        };

        ctrl.expandGroup = function (field, value) {
            if (ctrl.viewMode === 'grid') {
                ctrl.gridOptions.expandGroup(field, value);
            }
        };

        ctrl.applyFilterCallback = function (clauses) {
            if (ctrl.viewMode === 'grid') {
                ctrl.gridOptions.setFilter(clauses);
            } else {
                ctrl.tileViewOptions.setFilter(clauses);
            }
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#getSearchText
        *
        * @description
        * An API method which returns quick search text from filterbar
        *
        * @returns {string} quick search text
        */
        ctrl.getSearchText = function () {
            var searchText = '';
            if (ctrl.filterOptions.hasOwnProperty('getSearchText')) {
                searchText = ctrl.filterOptions.getSearchText();
            }
            return searchText;
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#getGroupField
        *
        * @description
        * An API method which returns current group field from filterbar
        *
        * @returns {string} group field
        */
        ctrl.getGroupField = function () {
            var groupField = null;
            if (ctrl.filterOptions.hasOwnProperty('getGroupField')) {
                groupField = ctrl.filterOptions.getGroupField();
            }
            return groupField;
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#getSortInfo
        *
        * @description
        * An API method which returns current sort info from filterbar
        *
        * @returns {Object} Sort info object
        */
        ctrl.getSortInfo = function () {
            var sortInfo = {};
            if (ctrl.filterOptions.hasOwnProperty('getSortInfo')) {
                sortInfo = ctrl.filterOptions.getSortInfo();
            }
            return sortInfo;
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#getFilterClauses
        *
        * @description
        * An API method which returns current filter clauses from filter
        *
        * @returns {Array} current filter clauses array
        */
        ctrl.getFilterClauses = function () {
            var clauses = [];
            if (ctrl.filterSearchOptions.hasOwnProperty('getFilterClauses')) {
                clauses = ctrl.filterSearchOptions.getFilterClauses();
            }
            return clauses;
        };

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#getCurrentData
        *
        * @description
        * An API method which returns currently displayed data
        *
        * @returns {Array} currently displayed data
        */
        ctrl.getCurrentData = function () {
            var result = [];
            if (ctrl.viewMode === 'grid') {
                if (ctrl.gridOptions.hasOwnProperty('getCurrentData')) {
                    result = ctrl.gridOptions.getCurrentData();
                }
            } else {
                if (ctrl.tileViewOptions.hasOwnProperty('getCurrentData')) {
                    result = ctrl.tileViewOptions.getCurrentData();
                }
            }
            return result;
        };

        ctrl.setOptionsAPIMethods = function () {
            if (ctrl.sitOptions) {
                ctrl.sitOptions.dataUpdated = ctrl.dataUpdated;
                ctrl.sitOptions.refresh = ctrl.refresh;
                ctrl.sitOptions.selectItems = ctrl.selectItems;
                ctrl.sitOptions.selectAll = ctrl.selectAll;
                ctrl.sitOptions.updateFilterBar = ctrl.updateFilterBarOptions;
                ctrl.sitOptions.expandGroup = ctrl.expandGroup;
                ctrl.sitOptions.getSearchText = ctrl.getSearchText;
                ctrl.sitOptions.getGroupField = ctrl.getGroupField;
                ctrl.sitOptions.getSortInfo = ctrl.getSortInfo;
                ctrl.sitOptions.getFilterClauses = ctrl.getFilterClauses;
                ctrl.sitOptions.getCurrentData = ctrl.getCurrentData;

                // for testing so dev page can call to apply a hardcoded filter
                ctrl.sitOptions.applyFilter = ctrl.applyFilterCallback;
            }
        };

        activate();
    }

    ItemCollectionViewer.$inject = ['$log', '$timeout', '$window'];
    function ItemCollectionViewer($log, $timeout, $window) {
        function postLink(scope, element, attr, ctrl) {

            scope.$watch(function () {
                return ctrl.sitData;
            }, function () {
                ctrl.resetData();
            }, true);

            if (ctrl.sitOptions.quickSearchOptions) {
                scope.$watch(function () {
                    return ctrl.sitOptions.quickSearchOptions;
                }, function (newOptions, oldOptions) {
                    if(newOptions.filterText !== oldOptions.filterText) {
                        ctrl.filterOptions.quickSearchText = newOptions.filterText;
                        scope.$broadcast('sit-item-collection-viewer.quicksearch-text-changed', newOptions.filterText);
                    }
                }, true);
            }
            scope.$on('$destroy', onDirectiveDestroy);

            scope.$evalAsync(initializeHeight);

            determineICVDisplayMode();

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
                determineICVDisplayMode();
            }

            function determineICVDisplayMode(){
                $timeout(function () {
                    ctrl.checkResponsiveness(element.parent().width());
                });
            }
        }

        return {
            bindToController: {
                sitData: '=sitData',
                sitOptions: '=sitOptions',
                sitFormat: '=?sitFormat'
            },
            controller: ItemCollectionViewerController,
            controllerAs: 'ICVController',
            link: postLink,
            restrict: 'E',
            scope: {},
            templateUrl: 'common/widgets/itemCollectionViewer/item-collection-viewer.html'
        };
    }

    angular.module('siemens.simaticit.common.widgets.itemCollectionViewer').directive('sitItemCollectionViewer', ItemCollectionViewer);

    //#region ng-doc comments
    /**
    * @ngdoc object
    * @module siemens.simaticit.common.widgets.itemCollectionViewer
    * @name icvConfigurationDetails
    * @access internal
    * @description
    * This provides a detailed description for all the options supported
    * by the **sitOptions** parameter of the {@link siemens.simaticit.common.widgets.itemCollectionViewer.sitItemCollectionViewer} directive.
    * 
    * The ICV also provides an API for devlopers by adding the methods to the **sitOptions** object.
    * 
    * @property {Boolean} [alwaysShowPager=false]
    * <a id="alwaysShowPager"></a>
    * 
    * Specifies if the pager is always shown.
    *
    * Default behavior hides the pager if the number of data items to show is less than the page size.
    * This option allows a user to override that behavior.
    * 
    * 
    * @property {String} [bgColor=undefined] 
    * <a id="bgColor"></a>
    * 
    * Specifies a custom color to be used as background color for **non-selected** item tiles.
    * 
    * The value is applied directly to the CSS property. Example, 'red' or '#647887'.
    * 
    * @property {String} [bgColorSelected=undefined] 
    * <a id="bgColorSelected"></a>
    * 
    * Specifies a custom color to be used as background color for **selected** item tiles.
    * 
    * The value is applied directly to the CSS property. Example, 'red' or '#647887'.
    * 
    * @property {String} [color=undefined] 
    * <a id="color"></a>
    * 
    * Specifies a custom color to be used as foreground color (text/image) for **non-selected** item tiles.
    * 
    * The value is applied directly to the CSS property. Example, 'red' or '#647887'.
    * 
    * @property {String} [colorSelected=undefined] 
    * <a id="colorSelected"></a>
    * 
    * Specifies a custom color to be used as foreground color (text/image) for **selected** item tiles.
    * 
    * The value is applied directly to the CSS property. Example, 'red' or '#647887'.
    * 
    * @property {String} [containerID=undefined] 
    * <a id="containerID"></a>
    * 
    * Identifies the **id** of a containing element to help automatically set the tile size.
    * 
    * @property {String} [descriptionField=undefined] 
    * <a id="descriptionField"></a>
    * 
    * Specifies the name of the field to be used for the description text of tiles.
    * 
    * If specified, the value of this field is retrieved and displayed in the tile. 
    * It overrides any value set in the **description** property of the tiles configuration object.
    * For more information, see {@link siemens.simaticit.common.widgets.tiles.tileContentDetails}.
    *  
    * This property supports **dot** notation. 
    * For example, consider a tile configuration object that has a property named **data**.
    * The value of the **data** property is itself an object that contains the property **type**.
    * To use the value of the **type** property as the description text of the tile, 
    * set '**data.type**' in the **descriptionField** property.
    * 
    * @property {Boolean} [enablePaging=true]
    * <a id="enablePaging"></a>
    * 
    * Determines if the pager is shown in the UI.
    * 
    * @property {String} [filterBarOptions='sqg']
    * <a id="filterBarOptions"></a>
    * 
    * Defines the options available in the filter bar.
    * 
    * Allowed values are:
    *  * **S**: Sorting 
    *  * **Q**: Quick Search
    *  * **F**: Filtering
    *  * **G**: Grouping 
    * 
    ***NOTE:** Values are not case sensitive.
    * 
    * @property {Object[]} [filterFields=undefined]
    * <a id="filterFields"></a>
    * 
    * Defines the data fields that may be used for filtering.
    * 
    * Filtering of data in the **ICV** is accomplished using the 
    * {@link siemens.simaticit.common.widgets.filter.sitFilter} directive and the
    * {@link siemens.simaticit.common.widgets.filter.sitFilterService} service.
    * 
    * The ICV wraps the use of these components so that a user of the ICV does
    * not need to interact with them directly. You only need to define
    * filter fields with this property and add the 'F' option to the **fitlerBarOptions** property.
    * 
    * See {@link siemens.simaticit.common.widgets.filter.filterFieldDetails} for a detailed 
    * description of the configuration options.
    * 
    * 
    * 
    * @property {Object} [gridConfig=undefined]
    * <a id="gridConfig"></a>
    * 
    * Contains settings for displaying data items as a grid.
    * 
    * Supports the following grid configuration options:
    * * **colunDefs**
    * * **customRowClasses**
    * * **enableColumnResize**
    * 
    * For a full description of the options, see {@link siemens.simaticit.common.widgets.grid.gridConfigurationDetails}.
    * 
    * @property {String} [groupField='']
    * <a id="groupField"></a>
    * 
    * The name of a field to group-by when the item collection is shown for the first time.
    * 
    * @property {String[] | Object[]} [groupFields=empty array]
    * <a id="groupFields"></a>
    * 
    * The list of fields a user can group by. 
    * 
    * If the array elements are strings, they represent the field names a user is allowed to group by.
    * These field names are added to a drop-down list in the filter bar of the ICV.
    * 
    * To provide more user friendly names in the dropdown, use objects as the array elements.
    * The objects must have the following format
    * ```
    *    {
    *        field: 'lastName',
    *        displayName: 'Last Name'
    *    }
    * ```
    * 
    * * **field**: defines the field name to use for grouping.
    * * **displayName**: defines the text to appear in the drop down.
    * 
    * @property {String} [height=undefined]
    * <a id="height"></a>
    * 
    * Specifies a fixed size (in pixels) to be used to set the height of the widget.
    * 
    * When set, it overrides the height set using the **containerID**.
    * 
    * @property {String} [image=undefined] 
    * <a id="image"></a>
    * 
    * The name of a **Font Awesome** icon to use as the default image for tiles.
    * 
    * This value is only used if a tile does not have the image property set.  
    * **Note:** It does not override values that are set directly in the tile content.
    * 
    * @property {Boolean} [multiSelect=true]
    * <a id="multiSelect"></a>
    * 
    * Specifies if multiple items can be selected.
    * 
    * @property {String} [noDataMessage=Localized version of 'No Data']
    * <a id="noDataMessage"></a>
    * 
    * Specifies the message to be displayed when no data is set.
    * 
    * @property {Object} [pagingOptions=<em>See</em> {@link siemens.simaticit.common.widgets.itemCollectionViewer.icvConfigurationDefaults icvConfigDefaults}]
    * <a id="pagingOptions"></a>
    * 
    * Defines the options to configure the pager.
    * 
    * @property {Object[]|String[]} [propertyFields=undefined]  
    * <a id="propertyFields"></a>
    * 
    * Defines the fields to be displayed as properties in a tile.
    *
    * Example:
    * ```
    *  propertyFields[ 'firstName', 'lastName', 'country'] 
    * ```
    * 
    * You can also list the fields as objects to provide a localized name for the text label. 
    * By default, the field name is used. For example:
    * ```
    *  propertyFields: [
    *      { field: 'firstName', displayName: 'First Name' },
    *      { field: 'lastName', displayName: 'Last Name' },
    *      { field: 'country', displayName: 'Country' },
    *  ]
    * ```
    * 
    * If object notation is used and the **displayName** is not specified, the field is used as the label.
    * 
    * This property supports **dot** notation. 
    * For example, consider a tile configuration object that has a property named **data**.
    * The value of the **data** property is itself an object that contains the property **type**.
    * To use the value of the **type** property as one of the property fields of the tile, 
    * set '**data.type**' as a **propertyField** value.
    * ```
    *     ctrl.tileConent = {
    *      ...
    *      data: {
    *          name: weight,
    *          type: grams
    *      },
    *      ...
    *      propertyFields: [
    *          { field: 'data.type', displayName: 'unit' }
    *      ]
    * }
    * ```
    * 
    * @property {Object} [quickSearchOptions=undefined]
    * <a id="quickSearchOptions"></a>
    * 
    * Defines the options to manage the **Quick Search** behavior.
    * 
    * **Quick Search** is implemented by filtering the data collection and showing only the items
    * that match the specfied criteria. Filtering is performed on only one configured data field. The
    * field is compared against the criteria to see if it begins with the specified value.
    * 
    * The object contains the following properties.
    * * **enabled**: Determines if quick search filtering is performed.
    * * **field**: The name of the field to compare with criteria.
    * * **filterText**: The text string to compare against the field.
    * 
    * @property {Function} [onPageChangedCallback=undefined]
    * Specifies the function to call when the current page of data is changed.
    * The function is passed one argument.
    * * **pageNumber** The number of the new page.
    * 
    * @property {Function} [onSelectionChangeCallback=undefined]
    * <a id="onSelectionChangeCallback"></a>
    * 
    * Specifies the function to call when the list of selected items changes.
    * The function is passed in two arguments
    * * **selectedItems** An array of objects that represents the currently selected data items. 
    * * **selectedItem** The item a user clicked that triggered the selection change. 
    * **Note:** Set to **null** for programmatic selection.
    * 
    * @property {Function} [onSortingChangedCallback=undefined]
    * Specifies the function to call when the sort field or direction has changed.
    * The function is passed in one argument that is an object with two properties.
    * * **field** The field being sorted.
    * * **direction** The direction of the sort (asc/desc).
    * 
    * @property {string} [selectionMode="multi"]
    * <a id="selectionMode"></a>
    * 
    * Controls the user ability to select items in the collection. 
    * The following values are allowed:
    * * **multi**: Multiple items can be selected.
    * * **single**: Only single item can be selected. 
    * * **none**: No items can be selected.
    *
    * @property {Object} [serverDataOptions=undefined]
    * <a id="serverDataOptions"></a>
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
    *         optionsString: '',
    *         appName: 'myApp'
    *     }
    * ``` 
    * 
    * * **dataService**: A presentation service object such as **engineeringData**.
    * * **dataEntity**: The name of an entity to be retrieved using the service.
    * * **optionsString**: **oData** query options.
    * * **appName**: The name of the App where the entity is defined
    *  
    * @property {Object} [sortInfo=undefined]
    * <a id="sortInfo"></a>
    * 
    * Defines the fields that may be used for sorting as well as the initial sort for the collection.
    * 
    * The object has the following format:
    * 
    * ```
    *  {
    *      field: 'lastName',
    *      direction: 'asc',
    *      fields: [ 
    *          { field: 'lastName', displayName: 'Last Name'}, 
    *          { field: 'city', displayName: 'City'}, 
    *          { field: 'country', displayName: 'Country'} 
    *      ]
    *  }
    * ```
    * 
    * * **field**: The name of the field on which to sort.
    * * **direction**: The sort direction. Allowed values are: 
    *  * **asc** (Ascending)
    *  * **desc** (Descending)
    * * **fields**: An array of objects that defines the fields that may be used for sorting. 
    * 
    * The **fields** array contains objects with **field** and **displayName** properties.
    * This allows for localizing the options that are displayed to a user.
    * **displayName** does not need to be set. If not set, the value of **field** is used.
    * 
    * The **fields** array also supports a list of strings. In this case, the strings
    * represent field names. 
    * **Note:** Localization is not supported using this format. 
    * 
    * @property {String} [titleField=undefined] 
    * <a id="titleField"></a>
    * 
    * Specifies the name of the field to use for the title text when the tiles are shown. 
    * 
    * @property {Boolean} [useCustomColors="false"] 
    * <a id="useCustomColors"></a>
    *  
    * Specifies whether the system uses the specified custom colors when the tiles are shown.
    * 
    * @property {String} [viewMode="g"] 
    * <a id="viewMode"></a>
    * 
    * Defines how the data is initially shown.
    * 
    * The property value must be one of the following letter codes.
    * * **C**: Puts the ICV in a **Compact Mode**. For feature description, see {@link siemens.simaticit.common.widgets.itemCollectionViewer.sitItemCollectionViewer}
    * * **G**: Shows data in a grid.
    * * **S**: Shows data as small tiles. (size **medium** item tile)
    * * **M**: Shows data as medium sized tiles. (size **wide** item tile)
    * * **L**: Shows data as large tiles. (size **large** item tile)
    * **Note:** The letter codes are not case sensitive. 
    * 
    * @property {String} [viewOptions="gsmlx"] 
    * <a id="viewOptions"></a>
    * 
    * Defines the UI elements to be shown in the viewbar
    * 
    * The property value is any combination of the following letter codes.
    * * **G**: Shows the grid button.
    * * **S**: Shows the small tile button.
    * * **M**: Shows the medium tile button.
    * * **L**: Shows the large tile button.
    * * **X**: Shows the selection mode check box.  
    * **Note:** The letter codes are not case sensitive.
    * 
    */
    //#endregion ng-doc comments
    //#region icvConfigurationDetails
    var icvConfigurationDetails = {
        alwaysShowPager: false,
        bgColor: '',
        bgColorSelected: '',
        color: '',
        colorSelected: '',
        containerID: '',
        descriptionField: 'myCustomDescriptionField',
        enablePaging: true,
        filterBarOptions: 'sqg',
        gridConfig: {
            columnDefs: [],
            customRowClasses: {
                //even: undefined,
                //odd: undefined,
                //selected: undefined
            },
            enableColumnResize: true
        },
        groupField: '',
        groupFields: ['title', 'author', 'yearPublished'],
        height: 400,
        image: 'fa-beer',
        noDataMessage: 'No Data',
        pageManager: null,
        pagingOptions: {
            pageSizes: [10, 25, 50, 100, 250],
            pageSize: 10,
            currentPage: 1
        },
        propertyFields: undefined, //todo: currently using this but must switch to field/displayName to localize
        quickSearchOptions: {
            enabled: false,
            field: '',
            filterText: ''
        },
        //onSelectionChangeCallback: mySelectionChangedHandler,
        selectionMode: 'multi',
        selectStyle: 'standard',
        serverDataOptions: {
            dataService: 'engineeringData',
            dataEntity: 'CommandDefinition',
            optionsString: ''
        },
        sortInfo: {
            field: '',
            direction: '',
            fields: []
        },
        titleField: undefined,
        useCustomColors: false,
        viewMode: 's',
        viewOptions: 'gsmlx',

        debug: false,
        enableResponsiveBehaviour: false,

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#selectItems
        * 
        * @description
        * Selects or deselects items in the collection.
        * 
        * Use this method only after the digest cycle triggered by adding or updating the data collection has completed. 
        * To have data items selected immediately after adding them, set the item's **selected** property to **true**.
        * 
        * @param {Object[]|Number[]} [items]
        * An array of objects or indexes defining the items to select.
        * * If objects are specified, a compare by reference is performed to find the matching data object in the collection.
        * * If numbers (indexes) are specified, items are selected by their current position (zero based).
        * 
        * @param {Boolean} [state]
        * Set **true** to select, **false** to deselect.
        * 
        * @param {Boolean} [clear]
        * If **true**, any existing selections are cleared before selecting the specified items.
        * 
        */
        selectItems: function (items, state) { },

        /**
        * @ngdoc method
        * @module siemens.simaticit.common.widgets.itemCollectionViewer
        * @name ICVOptions#selectAll
        * 
        * @description
        * Selects or deselects all items in the collection.
        * 
        * Use this method only after the digest cycle, triggered by adding or updating the data collection, has completed. 
        * To have data items selected immediately after adding them, set the item's **selected** property to **true**.
        * 
        * @param {Boolean} [state]
        * Set **true** to select all items, **false** to deselect.
        * 
        */
        selectAll: function (state) { }

    };
    //#endregion icvConfigurationDetails
    /**
    * Wraps use of the $log service for outputting diagnostic messages to the console
    * - Prepends message with a timestamp
    * - Formats message for consistency: timestamp [function] message.
    * - Can turn on/off debug messages with configuration param so you do not have to comment out in code.
    */
    function LogWrapper($log, debug) {
        this.log = function (funcName, msg) { if (debug) { $log.log(getMessage(funcName, msg)); } };
        this.info = function (funcName, msg) { $log.info(getMessage(funcName, msg)); };
        this.warn = function (funcName, msg) { $log.warn(getMessage(funcName, msg)); };
        this.error = function (funcName, msg) { $log.error(getMessage(funcName, msg)); };

        function getMessage(funcName, msg) {
            return getTimeString() + ' [' + funcName + '] ' + msg;
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
            } else if (ms < 100) {
                msString = '0' + ms;
            } else {
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
     * @module siemens.simaticit.common.widgets.itemCollectionViewer
     * @name common.widgets.itemCollectionViewer.service
     * @access internal
     * @description
     * This service provides the functionality to support the **sitItemCollectionViewer** directive. 
     * A user of that directive has no need to interact with this service directly.
     */
    angular.module('siemens.simaticit.common.widgets.itemCollectionViewer').service('common.widgets.itemCollectionViewer.service', viewManager);
    function viewManager() {

        /**
         * @ngdoc object
         * @module siemens.simaticit.common.widgets.itemCollectionViewer
         * @name icvConfigurationDefaults
         * @access internal
         * @description
         * This provides the default values for the **sitOptions** 
         * parameter of {@link siemens.simaticit.common.widgets.itemCollectionViewer.sitItemCollectionViewer}.
         * 
         * @example
         * The following object contains default values for all supported options that have defaults other than **undefined**.
         * 
         * ```
         *  {
         *      enablePaging: true,
         *      filterBarOptions: 'sqg', 
         *      groupField: '',
         *      groupFields: [],
         *      pagingOptions: {
         *          pageSizes: [10, 25, 50, 100, 250],
         *          pageSize: 10,
         *          currentPage: 1
         *      },
         *      quickSearchOptions: {
         *          enabled: true,
         *          field: '',
         *          filterText: ''
         *      },
         *      noDataMessage: 'No Data',   // actual default is localized value of "No Data"
         *      selectionMode: 'multi',     //'single' for compact mode.
         *      sortInfo: {
         *          field: '',
         *          direction: 'none',
         *          fields: []
         *      },
         *      viewMode: 'g',
         *      viewOptions: 'gsmlx', 
         *  }
         * ```
         * 
         * For a full description of all the options, see {@link ICVOptions}.
         * 
         * <h3>Effects of default options</h3>
         * **Grouping**
         * * Data is not grouped by default.
         * * To have data grouped when first shown, set values to both **groupFields** and **groupField** options.
         * 
         * **Paging**
         * * Paging is enabled by default.
         * * If the number of total data items is less than the page size, the pager is not shown.
         * * The pager can always be shown by setting the **alwaysShowPager** option to **true**.
         * * Paging can be disabled by setting the **enablePaging** option to **false**.
         * 
         * **Sorting**
         * * Data is not sorted by default.
         * * This is indicated by having neither the sort ascending nor sort descending buttons highlighted as active.
         * 
         * 
         * 
         * 
         */
        this.icvConfigurationDefaults = {

            alwaysShowPager: false,

            // shows or hides the pager control
            enablePaging: true,

            // controls the options displayed in the filter bar
            // todo: filter not currently supported
            filterBarOptions: 'sqg',   //(s)ort, (q)uick search, (f)ilter, (g)roup

            // grid view specific settings (see common.widgets.grid.service for details)
            //TODO: we require users to specifiy columns so there must be a gridConfig object.
            //      get defaults does not deep copy so having a default does nothing.
            //      verify if we should create default columns and how best to manger it.
            //gridConfig: {
            //    columnDefs: [],
            //    customRowClasses: {
            //        //even: undefined,
            //        //odd: undefined,
            //        //selected: undefined
            //    },
            //    enableColumnResize: true
            //},

            // specifies the initial field to group by
            //TODO: eval if we can leave undefined
            groupField: '',

            // the comma separated list of field names a user may group by
            //TODO: eval if we can leave undefined.
            groupFields: [],

            // specifies allowed page sizes,  initial page size,  and initial page
            pagingOptions: {
                pageSizes: [10, 25, 50, 100, 250],
                pageSize: 10,
                currentPage: 1
            },

            // specifies if quick search is active,  what field to filter on, and initial filter text
            // - if filter bar options are set to NOT show the quick search controls,
            //   the enabled setting will get set false.
            quickSearchOptions: {
                enabled: true,
                field: '',
                filterText: ''
            },

            // message to show when there is no data. 
            // todo: default to value acquired from angular-translate if custom value not specified
            //noDataMessage: 'No Data',

            // initial selection mode.
            // - options: multi, single, none
            selectionMode: 'multi',

            // todo: server connection parameters are currently undefined.
            //       when client API for acquiring server data is set, this will need updating
            //serverConnectionParams: {
            //    ???
            //},

            // gathers the sort options into one object.
            // internally, this object is used so above 3 fields are now depricated
            sortInfo: {
                field: '',
                direction: 'none',
                fields: []
            },

            // tile view specific settings. 
            // These define the mappings between data fields and places to show the data in tiles
            // todo: describe exactly where each is dislayed in the different tile sizes.
            tileConfig: {
                titleField: '',
                descriptionField: ''
                //propertyFields: [],      //array of field names to use as tile properties
            },

            // specifies the initial viewing mode for the item collection
            // options: (g)rid, (s)mall, (m)edium, (l)arge
            viewMode: 'g',

            // specifies the view mode buttons to display. 
            // options: (g)rid, (s)mall tile, (m)edium tile, (l)arge tile, (x)selection mode , (d)etails
            // - the first 4 control what view modes are available
            // - the selection mode button toggles between single and multi-select
            // - the details button is not currently supported.
            //   you could show it, but the its click handler will perform no action
            viewOptions: 'gsmlx',

            // setting true will turn on debugging messages the widget outputs to the browser console
            // this should remain off for any release implementation
            // todo: test performance implication
            debug: false, // set true to turn on debug logging

            enableResponsiveBehaviour: false
        };

    }

    viewManager.prototype = {
        /**
         * @ngdoc method
         * @name ICVOptions#setConfigurationDefaults
         * @description
         * Sets default values on the configuration object.
         * 
         * @param {Object} [config=undefined]
         * The configuration object to be updated with default values.
         * 
         * For a full description of all options and default values, see {@link ICVOptions}.
         * 
         */
        setConfigurationDefaults: function (config) {
            // default selection mode changes based on view mode. single for compact, multi for anything else

            var updateSortInfo = true;
            if (config) {
                updateSortInfo = !config.sortInfo;
            }

            // create an object that has all the originial settings plus the defaults
            var configWithDefaults = $.extend({}, this.icvConfigurationDefaults, config);

            // push sort options into sortInfo object if not already set.
            // NOTE: this is only to support legacy processing. 'sortInfo' on config object was introduced March 1 2015.
            //       keep this processing for a while. Check back in a few months and if not used anywhere, remove.
            if (updateSortInfo) {
                configWithDefaults.sortInfo.field = configWithDefaults.sortField ? configWithDefaults.sortField : '';
                configWithDefaults.sortInfo.direction = configWithDefaults.sortDirection ? configWithDefaults.sortDirection : '';
                configWithDefaults.sortInfo.fields = configWithDefaults.sortFields ? configWithDefaults.sortFields : [];
            }

            // update the original obect with default values
            $.extend(config, configWithDefaults);

            if (config) {
                var filterBarOptions = config.filterBarOptions.toLowerCase();
                if (filterBarOptions.indexOf("q") === -1) {
                    config.quickSearchOptions.enabled = false;
                }
            }

            return config;
        }

    };

    /**************************************************************************
     * private helper methods and static data
     */

})();