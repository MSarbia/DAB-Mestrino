/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';
    /**
      * @ngdoc module 
      * @name siemens.simaticit.common.widgets.sortableAccordion
      * @description This module provides functionalities related to the {@ sitSortableAccordion} widget.
      * @access internal
      */
    angular.module('siemens.simaticit.common.widgets.sortableAccordion', []);

})();
/**
    * @ngdoc directive
    * @name sitSortableAccordion
    * @module siemens.simaticit.common.widgets.sortableAccordion
    * @access internal
    * @description 
    * Displays a sortable accordion.
    * 
    * @usage 
    * As an element:
    * ```
    * <sit-sortable-accordion-directive class="with_widgets_group" sit-close-others="sortAccCtrl.closeOthers" sit-sortable-options="sortAccCtrl.sortableOptions" sit-sort-acc-items="sortAccCtrl.sitSortAccData"></sit-sortable-accordion-directive>
    * ```
    *  
    * @restrict E
    * @param {Object} sit-close-others --> Control whether expanding an item will cause the other items to close.
    * @param {Boolean} sit-sortable-options --> Make the target accordion row sortable.
    * @param {Array} sit-sort-acc-items --> Contains info about accordion rows namely:
    * (a) headerName, 
    * (b) templateUrl, 
    * (c) dataObjs and 
    * (d) data

    * @example
    * The following example shows how to configure a sortable accordion widget:
    * ```
    * vm.sitSortAccData = [
    *      {
    *          headerName: 'Nid(ID)',
    *          templateUrl: 'common/examples/sortableAccordion/group-template.html',
    *          dataObjs: '',
    *          data: {
    *              'name': 'Nid(ID)',
    *              'onDelete': function (headingName) {},
    *              'onSave': function (heading, dataObjs) {}
    *          }
    *      }
    * }];
    *
    * vm.sortableOptions = {
    *       // placeholder: "placeholder",   // Commented coz distorting the DOM on drag
    *       connectWith: ".sortHead",
    *       cursor: "grabbing",
    *       stop: '' // Defined inside sit-sortable-accordion-dir.js
    * };
    * ```
    */

(function () {
    'use strict';

    function SitSortableAccordionController() {
        //var vm = this;
        //function activate(vm) {
        //    vm.isOpen = true;
        //}
        //activate(vm);
    }

    angular.module('siemens.simaticit.common.widgets.sortableAccordion')
        .controller('SitSortableAccordionController', SitSortableAccordionController)
        .directive('sitSortableAccordionDirective', ['sitSortableAccordionService', function (sitSortableAccordionService) {
            return {
                restrict: 'E',
                controller: SitSortableAccordionController,
                controllerAs: 'sortAccCtrl',
                templateUrl: 'common/widgets/sortableAccordion/sortable-accordion.html',
                transclude: true,
                scope: true,
                bindToController: {
                    items: '=?sitSortAccItems',
                    closeOthers: "=?sitCloseOthers",
                    sortableOptions: "=?sitSortableOptions"
                },
                link: function (scope, elmnt, attrs, ctrl) {
                /* istanbul ignore next */
                    if (ctrl.sortableOptions) {
                        ctrl.sortableOptions.stop = function () {
                            var names = elmnt.find(".nestingAccordionCustom h4.panel-title span");
                            sitSortableAccordionService.currentAccordionOrder = [];
                            angular.forEach(names, function (value) {
                                sitSortableAccordionService.currentAccordionOrder.push(value.textContent);
                            });
                        }
                    }
                }
            }
        }]);
})();
(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.sortableAccordion').service('sitSortableAccordionService', sitSortableAccordionService);

    sitSortableAccordionService.$inject = [];

    function sitSortableAccordionService() {
        this.currentAccordionOrder = [];
        // Get the current order
        this.getCurrentAccordionOrder = function () {
            return this.currentAccordionOrder;
        }
        // Set the current order
        this.setCurrentAccordionOrder = function (args) {
            this.currentAccordionOrder = args;
        }
    }

})();