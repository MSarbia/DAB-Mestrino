/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';

    function ModalPopupController($sce, $rootScope, $window, pageId, documentId, pageContent,
        query, data, docCenterUrl, documentCenterServices, helpWindowService, helpWindowNavigationService) {

        var vm = this;

        activate();

        function init() {
            vm.pageContent = pageContent;
            vm.query = query;
            vm.data = data;
            vm.show = false;
            vm.showNoResult = false;
            vm.pageId = pageId;
            vm.documentId = documentId;
            vm.maxSearchResult = 10;
            vm.docCenterUrl = docCenterUrl;
            vm.searchQuery = '';

            vm.closeDocPopup = closeDocPopup;
            vm.openDocCenterTab = openDocCenterTab;
            vm.reloadPopUpOnDocumentLnkClk = reloadPopUpOnDocumentLnkClk;
            vm.doSearchOnPopup = doSearchOnPopup;
            vm.draggable = draggable;
            vm.showPrev = false;
            vm.showNext = false;
            vm.goToPrevState = goToPrevState;
            vm.goToNextState = goToNextState;
        }

        function activate() {
            if ('undefined' !== typeof (pageContent) && '' !== pageContent) {
                pageContent = hrefParser(pageContent);
            }

            init();

            setNavigationButtonStates(helpWindowNavigationService.savePageHistory({ Type: 'page', Id: pageId }));

            if (0 < data.length) {
                vm.show = false;
            } else {
                vm.show = true;
            }
        }

        function closeDocPopup() {
            helpWindowService.hide();
        }

        function setNavigationButtonStates(state) {
            vm.showPrev = false;
            vm.showNext = false;
            if (!state.isFirstPage) {
                vm.showPrev = true;
            }
            if (!state.isLastPage) {
                vm.showNext = true;
            }
        }

        function goToPrevState() {
            goToState(helpWindowNavigationService.getPreviousPage());
        }

        function goToNextState() {
            goToState(helpWindowNavigationService.getNextPage());
        }

        function goToState(state) {
            if (state.Data.Type === 'page') {
                callPage(state.Data.Id, true);
            } else if (state.Data.Type === 'search') {
                doSearch(state.Data.Id, true);
            }
            setNavigationButtonStates(state);
        }

        function openDocCenterTab() {
            var url = '#/docHome/document/' + vm.documentId + '/page/' + vm.pageId;
            $window.open(vm.docCenterUrl + url, '_blank');
            $window.focus();
        }

        function draggable() {
            angular.element('.modal.doc-popup-modal').draggable({
                handle: ".help-window-toolbar",
                containment: '.modal-open'
            });
            angular.element('.modal.doc-popup-modal').resizable();
        }

        // Get first document page with a click on an internal link 
        function reloadPopUpOnDocumentLnkClk(docId) {
            documentCenterServices.getDocument(docId).then(function (dataResponse) {
                var results = dataResponse;
                if ('undefined' !== typeof (results) && null !== results && null !== results.value && 'undefined' !== typeof (results.value[0])) {
                    var docIndex = results.value[0];
                    var firstPage = docIndex.Contents;
                    var htmlObj = $.parseHTML(firstPage);
                    var hrefNodes = angular.element(htmlObj).find('[href]');
                    var pageId = '';
                    if (0 < hrefNodes.length) {
                        if (hrefNodes[0].attributes['href']) {
                            var hrefValue = hrefNodes[0].attributes['href'].value;
                            var splittedArray = hrefValue.split('\'');
                            if (splittedArray[1]) {
                                pageId = splittedArray[1];
                            }
                        }
                    }
                    callPage(pageId);
                }
            });
        }

        // Reload  popup text area within click on search control  
        function doSearchOnPopup() {
            var quickSearchPopUpTextBox = vm.searchQuery.replace(/<\/?[^>]+>/gi, ' ');
            doSearch(quickSearchPopUpTextBox);
        }

        function callPage(docPageId, fromNavButton) {
            documentCenterServices.getPage(docPageId).then(function (dataResponse) {
                var results = dataResponse;
                if ('undefined' !== typeof (results) && null !== results && null !== results.value && 'undefined' !== typeof (results.value[0])) {
                    if (!fromNavButton) {
                        setNavigationButtonStates(helpWindowNavigationService.savePageHistory({ Type: 'page', Id: docPageId }));
                    }

                    var html = results.value[0].Contents;
                    vm.pageId = results.value[0].Id;
                    vm.documentId = results.value[0].DocumentId;
                    html = hrefParser(html);
                    vm.data = [];
                    vm.pageContent = html;
                    vm.show = true;
                }
            });
        }

        function doSearch(query, fromNavButton) {
            vm.query = query;
            //var option = '$top=10';
            documentCenterServices.searchPages(query).then(function (dataResponse) {
                if (undefined !== dataResponse && undefined !== dataResponse.value) {
                    var results = dataResponse;
                    if ('undefined' !== typeof (results) && null !== results && null !== results.value && 0 < results.value.length) {
                        vm.showNoResult = false;
                        if (!fromNavButton) {
                            setNavigationButtonStates(helpWindowNavigationService.savePageHistory({ Type: 'search', Id: query }));
                        }

                        vm.pageContent = '';
                        vm.data = [];
                        var data = results.value;
                        vm.pageContent = '';

                        angular.forEach(data, function (item) {
                            var res = $sce.trustAsHtml(item.HighlightedText);
                            item.HighlightedText = res;
                            vm.data.push(item);
                        });

                        vm.show = false;
                        vm.searchQuery = '';
                    } else {
                        vm.show = false;
                        vm.searchQuery = '';
                        vm.showNoResult = true;
                    }
                }
            });
        }

        function hrefParser(data) {
            var html = $.parseHTML(data);

            var hrefNodes = angular.element(html).find('[href]');
            for (var j = 0, hrefNodesLength = hrefNodes.length; j < hrefNodesLength; j++) {
                var node = hrefNodes[j];

                var externalLink = '';
                var hrefValue = '';
                if (node.attributes['href']) {

                    hrefValue = node.attributes['href'].value;
                    externalLink = hrefValue;
                }

                //external link
                if (-1 !== hrefValue.toLowerCase().indexOf('http')) {
                    if (node.attributes['class']) {
                        angular.element(hrefNodes[j]).removeAttr('class');
                    }
                    if (node.attributes['target']) {
                        angular.element(hrefNodes[j]).removeAttr('target');
                    }
                    if (node.attributes['href']) {
                        angular.element(hrefNodes[j]).removeAttr('href');
                    }

                    // Add button to open new tab
                    var button = window.document.createElement('a');
                    angular.element(button).attr('href', externalLink);
                    angular.element(button).attr('target', '_blank');
                    var span = window.document.createElement('span');
                    angular.element(button).append(span);
                    angular.element(button).insertAfter(hrefNodes[j]);
                }
                    //internal link
                else if (node.getAttribute("href").indexOf("$filter=contains") === -1) {
                    if (node.attributes['target']) {
                        angular.element(hrefNodes[j]).removeAttr('target');
                    }

                    var pageId = '';
                    var documentId = '';
                    var splittedHref = hrefValue.split('/page/');
                    if (1 < splittedHref.length) {
                        pageId = splittedHref[1];
                        var docSplitted = splittedHref[0].split('/document/');
                        if (1 < docSplitted.length) {
                            documentId = docSplitted[1];
                        }
                    }

                    var pageIdParts = [];
                    pageIdParts = pageId.split('#');
                    if (pageIdParts[0] !== vm.pageId) {

                        angular.element(hrefNodes[j]).attr('href', '#');
                        angular.element(hrefNodes[j]).attr('ng-click', "reloadPopUpOnLnkClk('" + pageIdParts[0] + "')");
                    }
                    else {
                        angular.element(hrefNodes[j]).attr('issamepage', true);
                    }
                } 
            }

            //Re-assign to data
            var htmlStr = '';
            for (var k = 0, htmlLength = html.length ; k < htmlLength; k++) {
                if (html[k].nodeName !== '#text') {
                    var ss = html[k].outerHTML;
                    htmlStr += ss;
                }
            }
            data = htmlStr;
            return data;
        }

        // Reload  popup text area within click on an internal link 
        $rootScope.reloadPopUpOnLnkClk = function (docPageId) {
            callPage(docPageId);
        };

    }

    ModalPopupController.$inject = ['$sce', '$rootScope', '$window', 'pageId', 'documentId', 'pageContent', 'query', 'data', 'docCenterUrl', 'common.services.documentation.service', 'common.components.documentation.helpWindowService', 'common.components.documentation.helpWindowNavigationService'];

    angular.module('siemens.simaticit.common.components.documentation').controller('common.components.documentation.modalPopupController', ModalPopupController);

})();
(function () {
    'use strict';

    function HelpWindowController($scope, $rootScope, $modal, $timeout, $window, $translate, documentCenterServices, busyIndicatorService, helpWindowNavigationService) {
        var vm = this;
        activate();

        function init() {
            vm.query = '';
            vm.data = [];
            vm.pageContent = '';
            vm.docCenterUrl = documentCenterServices.getDocCenterUrl();
            vm.modalInstanceTimeout = null;
            vm.openDocPopup = openDocPopup;
            vm.showWindow = showWindow;
            vm.hideWindow = hideWindow;
            vm.closePopup = '';
            vm.isAlreadyOpen = false;
            vm.isClosed = true;
        }

        function activate() {
            init();
        }

        function showWindow() {
            vm.isAlreadyOpen = false;
            if (0 < angular.element('#popupDocCenter').length) {
                vm.isAlreadyOpen = true;
            }
            if (!vm.sitPageId) {
                if (vm.sitPageTitle) {
                    //set Page Id by searching from titles
                    documentCenterServices.getAllPages("$filter=indexof(tolower(Title),tolower('" + vm.sitPageTitle + "')) ne -1").then(function (dataResponse) {
                        var results = dataResponse;
                        vm.query = vm.sitPageTitle;
                        if ('undefined' !== typeof (results) && null !== results && null !== results.value && results.value.length) {
                            vm.sitPageId = results.value[0].Id;
                            openPopupWindow();
                        } else {
                            if (vm.sitIsTabbed) {
                                openTabbedDocCenter();
                            } else {
                                var unknownPage = $translate.instant('common.helpWindow.unknown-page');
                                vm.pageContent = '<h1>' + unknownPage + '</h1>';
                                openDocPopup();
                        }
                        }
                    });
                }
                else if (vm.sitPageQuery) {
                    //Set Page Id by search
                    documentCenterServices.searchPages(vm.sitPageQuery).then(function (dataResponse) {
                        var results = dataResponse;
                        vm.query = vm.sitPageQuery;
                        if ('undefined' !== typeof (results) && null !== results && null !== results.value && results.value.length) {
                            vm.sitPageId = results.value[0].Id;
                            openPopupWindow();
                        } else {
                            if (vm.sitIsTabbed) {
                                openTabbedDocCenter();
                            } else {
                                var unknownPage = $translate.instant('common.helpWindow.unknown-page');
                                vm.pageContent = '<h1>' + unknownPage + '</h1>';
                                openDocPopup();
                            }

                        }
                    });
                }
            }
            else {
                openPopupWindow();
            }
        }

        function openPopupWindow() {
            if (vm.isAlreadyOpen) {
                $rootScope.reloadPopUpOnLnkClk(vm.sitPageId);
                busyIndicatorService.hide();
            } else {
                showPageInformation(vm.sitPageId);
            }
        }

        function hideWindow() {
            helpWindowNavigationService.clearPageHistory();
            vm.closePopup();
            vm.isClosed = true;
        }

        function showPageInformation(pageId) {
            documentCenterServices.getPage(pageId).then(function (dataResponse) {
                var results = dataResponse;
                vm.query = pageId;
                //vm.hideContent = true;
                if ('undefined' !== typeof (results) && null !== results && null !== results.value && results.value.length) {
                    var html = results.value[0].Contents;
                    vm.data = [];
                    vm.pageContent = html;
                    vm.pageId = results.value[0].Id;
                    vm.documentId = results.value[0].DocumentId;
                    if (vm.sitIsTabbed) {
                        openTabbedDocCenter(vm.documentId, vm.pageId);
                        return;
                    }
                }
                openDocPopup();
            });
        }

        function openDocPopup() {
            if (vm.isClosed) {
                var modalInstance = $modal.open({
                    templateUrl: 'PopupContent.html',
                    controller: 'common.components.documentation.modalPopupController',
                    controllerAs: 'modalPopupCtrl',
                    backdrop: false,
                    keyboard: false,
                    right: 'auto',
                    animation: true,
                    bottom: 'auto',
                    overflow: 'visible',
                    resolve: {
                        pageId: function () {
                            return vm.pageId;
                        },
                        documentId: function () {
                            return vm.documentId;
                        },
                        pageContent: function () {
                            return vm.pageContent;
                        },
                        query: function () {
                            return vm.query;
                        },
                        data: function () {
                            return vm.data;
                        },
                        docCenterUrl: function () {
                            return vm.docCenterUrl;
                        }
                    }
                });

                vm.isClosed = false;

                vm.closePopup = modalInstance.close;

                // Here we do some DOM manipolation overriding the popup modal css classes using selectors 
                // using timeout we can wait till DOM is rendered and so we could apply changes to html elements already loaded.
                modalInstance.opened.then(
                    vm.modalInstanceTimeout = $timeout(function () {
                        angular.element('#popupDocCenter').parent().parent().addClass('doc-popup-dialog');
                        angular.element('#popupDocCenter').parent().addClass('doc-popup-content');
                        angular.element('#popupDocCenter').parent().parent().parent().addClass('doc-popup-modal');
                    })
                );
            }
                busyIndicatorService.hide();
        }

        function openTabbedDocCenter(docId, pageId) {
            busyIndicatorService.hide();
            var url = '#/docHome/document/' + docId + '/page/' + pageId;
            $window.open(vm.docCenterUrl + url, '_blank');
            $window.focus();
            return;
        }

        $scope.$on('$destroy', function () {
            $timeout.cancel(vm.modalInstanceTimeout);
            vm.modalInstanceTimeout = null;
        });
    }

    HelpWindowController.$inject = ['$scope', '$rootScope', '$uibModal', '$timeout', '$window', '$translate', 'common.services.documentation.service', 'common.widgets.busyIndicator.service', 'common.components.documentation.helpWindowNavigationService'];

    function helpWindow(helpWindowService) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                sitPageId: '=?',
                sitPageQuery: '=?',
                sitPageTitle: '=?',
                sitIsTabbed: '=?'
            },
            controller: HelpWindowController,
            controllerAs: 'helpWindowCtrl',
            templateUrl: 'common/components/documentation/helpWindow/help-window.html',
            link: function (scope, element, attrs, ctrl) {
                function show(args) {
                    ctrl.sitPageId = args.pageId;
                    ctrl.sitPageQuery = args.searchQuery;
                    ctrl.sitPageTitle = args.pageTitle;
                    ctrl.sitIsTabbed = args.isTabbed;
                    ctrl.showWindow();
                }

                function hide() {
                    ctrl.hideWindow();
                }

                scope.$on('$destroy', function () {
                });

                helpWindowService.registerShowCallback(show);
                helpWindowService.registerHideCallback(hide);
            }
        };
    }

    /**
     * @ngdoc directive
     * @name sitHelpWindow
     * @module siemens.simaticit.common.components.documentation 
     * @access internal
     * @restrict E
     * 
     * @description
     * A directive used to model a pop-up, which performs a search operation in a page, and allows you to navigation the results. 
     * Only one instance of the pop-up is allowed. If a new pop-up is trying to open, its contents will be updated with the new 
     * content.
     * 
     * @example
     * The following example shows how to configure a help window in a view template. The help window component
     * can use either the page ID , page query or page title as an attribute.
     * ```
     *   <sit-help-window sit-page-id="pageCtrl.id">
     *   </sit-help-window >
     * 
     * In the above example the directive uses the ID of the page (page-id). The documentation service retrieves the requested page based on this pageId to construct the help window.
     *      
     *                      OR
     * 
     *  <sit-help-window  sit-page-query='pageCtrl.query'>
     *  </sit-help-window >
     *
     * In this example the page-query (the documentation service searches the requested page based on the query) is used to 
     * create the help window.
     *                               
     *                      OR
     * 
     *  <sit-help-window  sit-page-title='pageCtrl.title'>
     *  </sit-help-window >
     *
     * In this example the page-title (the documentation service searches the requested page based on the query) is used to 
     * create the help window.
     * ```
     */
    angular.module('siemens.simaticit.common.components.documentation').directive('sitHelpWindow', ['common.components.documentation.helpWindowService', helpWindow]);

}
)();
/**
 * @ngdoc service
 * @module siemens.simaticit.common.components.documentation
 * @access internal
 * @name common.components.documentation.helpWindowNavigationService
 *
 * @description
 * Contains presentation service to keep the page history
 *
 * @example
 * The following methods are exposed by the service
 * 1.savePageHistory
 * The argument for this method has to be an object with Type and Id as properties
 * Returns the current page object
 * Sample-> savePageHistory({Type:"page/search",Id:"PageId/search string"}
 * 2.getNextPage
 * Returns the next page ( page which was rendered in the help window before the previous button was clicked )
 * 3.getPreviousPage
 * Returns the previous page called within the help window
 * 4.clearPageHistory
 * clears the page history
 */
// jshint ignore: start
/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common) {
            var components;
            (function (components) {
                var documentation;
                (function (documentation) {
                    var HelpWindowNavigationService = (function () {
                        function HelpWindowNavigationService() {
                            this.maxHistoryCount = 20;
                            this.navigationArray = [];
                        }
                        HelpWindowNavigationService.prototype.clearPageHistory = function () {
                            this.navigationArray = [];
                        };
                        HelpWindowNavigationService.prototype.getNextPage = function () {
                            var result = $.grep(this.navigationArray, function (e) { return e.isCurrentPage === true; });
                            var currentIndex = this.navigationArray.indexOf(result[0]);
                            this.navigationArray[currentIndex].isCurrentPage = false;
                            this.navigationArray[currentIndex + 1].isCurrentPage = true;
                            return this.navigationArray[currentIndex + 1];
                        };
                        HelpWindowNavigationService.prototype.getPreviousPage = function () {
                            var result = $.grep(this.navigationArray, function (e) { return e.isCurrentPage === true; });
                            var currentIndex = this.navigationArray.indexOf(result[0]);
                            this.navigationArray[currentIndex].isCurrentPage = false;
                            this.navigationArray[currentIndex - 1].isCurrentPage = true;
                            return this.navigationArray[currentIndex - 1];
                        };
                        HelpWindowNavigationService.prototype.savePageHistory = function (navigationData) {
                            var result = $.grep(this.navigationArray, function (e) { return e.isCurrentPage === true; });
                            if (result.length === 1 && navigationData.Id === result[0].Data.Id) {
                                return result[0];
                            }
                            if (result.length === 1) {
                                var currentIndex = this.navigationArray.indexOf(result[0]);
                                this.navigationArray[currentIndex].isCurrentPage = false;
                                this.navigationArray[currentIndex].isLastPage = false;
                                this.navigationArray.splice(currentIndex + 1, (this.navigationArray.length - 1) - currentIndex);
                            }
                            if (this.navigationArray.length === 0) {
                                this.navigationArray.push({ Data: navigationData, isCurrentPage: true, isFirstPage: true, isLastPage: true });
                            }
                            else if (this.navigationArray.length < this.maxHistoryCount) {
                                this.navigationArray.push({ Data: navigationData, isCurrentPage: true, isFirstPage: false, isLastPage: true });
                            }
                            else {
                                this.navigationArray.shift();
                                this.navigationArray[0].isFirstPage = true;
                                this.navigationArray.push({ Data: navigationData, isCurrentPage: true, isFirstPage: false, isLastPage: true });
                            }
                            return this.navigationArray[this.navigationArray.length - 1];
                        };
                        return HelpWindowNavigationService;
                    }());
                    documentation.HelpWindowNavigationService = HelpWindowNavigationService;
                    angular
                        .module('siemens.simaticit.common.components.documentation')
                        .service('common.components.documentation.helpWindowNavigationService', HelpWindowNavigationService);
                })(documentation = components.documentation || (components.documentation = {}));
            })(components = common.components || (common.components = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
// jshint ignore: end  
//# sourceMappingURL=sit-help-window-navigation-svc.js.map
/**
 * @ngdoc service
 * @module siemens.simaticit.common.components.documentation
 * @name common.components.documentation.helpWindowService
 *
 * @description
 * This service is used to configure, show, and a hide a help window containing contextual documentation.
 * @example
 * The easiest way to display documentation contextual to a web page consists in simply specifying a **help** property in the **data** object of a state configuration,
 * and set it to the title of a relevant documentation page.
 *
 * In the following example, the **help** property is set to 'Configuring UI Applications'.
    * ```
    * (function () {
    *'use strict';
    * //Application Editor route configuration
    * angular.module('siemens.simaticit.admin.applicationEditor')
    *    .config(['$stateProvider', function ($stateProvider) {
    *
    *         var applicationEditorHome = {
    *            name: 'adminHome.projectHome.applicationEditor',
    *            url: '/application-editor',
    *            views: {
    *                'Canvas@': {
    *                    templateUrl: 'admin/modules/application-editor/app-editor-home/app-editor.html',
    *                    controller: 'admin.applicationEditor.appEditorController',
    *                    controllerAs: 'appEditorCtrl'
    *                },
    *                'property-area-container@': {
    *                    templateUrl: 'admin/modules/application-editor/app-editor-home/create-spa.html',
    *                    controller: 'admin.applicationEditor.createSPAController',
    *                    controllerAs: 'createSPACtrl'
    *                }
    *            },
    *            data: {
    *                title: 'UI Applications',
    *                help: 'Configuring UI Applications'
    *            }
    *        };
    *
    * ```
    * In this case, when the user navigates to this state and clicks the <i class="fa fa-question-circle"></i> help icon in the header bar, the 'Configuring UI Applications' page
    * will be opened within the help window.
    *
    * Alternatively, it is possible to also programmatically show and hide the help window using the **show** and **hide** methods.
    */
/**
* @ngdoc method
* @name common.components.documentation.helpWindowService#show
* @description
* Shows the help window of the specific page. The parameters are considered in order, first **pageId**, then **pageTitle** and finally **searchQuery**.
* @param {String} pageId
* Contains the page Id of the page to be loaded.
* @param {String} pageTitle
* Contains the title of a page that should match.
* @param {String} searchQuery
* Contains the search query text.
*/
/**
* @ngdoc method
* @name common.components.documentation.helpWindowService#hide
* @description
* Closes the help window of the specific page.
*/
// jshint ignore: start
/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common) {
            var components;
            (function (components) {
                var documentation;
                (function (documentation) {
                    var HelpWindowService = (function () {
                        function HelpWindowService() {
                            this.helpWindowCount = 0;
                            this.showCallbacks = [];
                            this.hideCallbacks = [];
                        }
                        HelpWindowService.prototype.show = function (data) {
                            this.showCallbacks.forEach(function (fnCallback) {
                                fnCallback(data);
                            });
                        };
                        HelpWindowService.prototype.hide = function () {
                            this.hideCallbacks.forEach(function (fnCallback) {
                                fnCallback();
                            });
                        };
                        HelpWindowService.prototype.registerShowCallback = function (fnCallback) {
                            if (fnCallback) {
                                this.showCallbacks.push(fnCallback);
                            }
                        };
                        HelpWindowService.prototype.registerHideCallback = function (fnCallback) {
                            if (fnCallback) {
                                this.hideCallbacks.push(fnCallback);
                            }
                        };
                        return HelpWindowService;
                    }());
                    documentation.HelpWindowService = HelpWindowService;
                    angular
                        .module('siemens.simaticit.common.components.documentation')
                        .service('common.components.documentation.helpWindowService', HelpWindowService);
                })(documentation = components.documentation || (components.documentation = {}));
            })(components = common.components || (common.components = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
// jshint ignore: end 
//# sourceMappingURL=sit-help-window-svc.js.map