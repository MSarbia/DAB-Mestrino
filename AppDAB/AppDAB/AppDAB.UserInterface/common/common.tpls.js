angular.module('templates-uiFramework', ['common/components/buttonBox/buttonbox-dev-tpl.html', 'common/components/documentation/helpWindow/help-window.html', 'common/components/header/flymenu/flymenu.html', 'common/components/header/header.tpl.html', 'common/layout/component/component.html', 'common/layout/home/home.tpl.html', 'common/layout/homeState/loading.html', 'common/layout/settings/settings.tpl.html', 'common/layout/shell/shell.tpl.html', 'common/layout/unauthorized/unauthorized.html', 'common/widgets/accordion/sit-accordion-group.html', 'common/widgets/accordion/sit-accordion.html', 'common/widgets/breadcrumb/breadcrumb.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev-dsleditor-template.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev-home-template.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev-mashup-template.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev-template.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev-viewdetail-template.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev-viewlist-template.html', 'common/widgets/breadcrumb/samples/breadcrumb-dev.html', 'common/widgets/busyIndicator/busy-indicator.html', 'common/widgets/checkbox/checkbox.html', 'common/widgets/commandBar/command-bar.html', 'common/widgets/commandBar/command-group.html', 'common/widgets/commandBar/command.html', 'common/widgets/commandBar/samples/command-bar-dev-tpl.html', 'common/widgets/commandBar/samples/command-bar-dev.html', 'common/widgets/commandBar/samples/commandbar-dev-view.html', 'common/widgets/component/samples/swac/index.html', 'common/widgets/component/samples/test.html', 'common/widgets/component/samples/ui/chatMessenger.html', 'common/widgets/datePicker/date-picker.html', 'common/widgets/dateTimePicker/date-time-picker.html', 'common/widgets/dialog/dialog.html', 'common/widgets/dialog/samples/dialog-dev-popup1-template.html', 'common/widgets/dialog/samples/dialog-dev-popup2-template.html', 'common/widgets/dialog/samples/dialog-dev-tpl.html', 'common/widgets/dialog/samples/dialog-dev.html', 'common/widgets/dialogButton/dialogButton.html', 'common/widgets/dialogButton/samples/dialog-button-dev.html', 'common/widgets/email/email.html', 'common/widgets/entityPicker/entityPicker.html', 'common/widgets/entityPicker/popup-default-template.html', 'common/widgets/entityPicker/samples/entity-picker-custom-template.html', 'common/widgets/entityPicker/samples/index.html', 'common/widgets/entityPicker/typeahead-default-template.html', 'common/widgets/fileUpload/file-upload.html', 'common/widgets/filter/sit-filter.html', 'common/widgets/filterBar/filter-bar.html', 'common/widgets/flyout/samples/flyout-dev-tpl.html', 'common/widgets/flyout/samples/flyout-dev-view.html', 'common/widgets/flyout/samples/flyout-dev.html', 'common/widgets/flyout/samples/sit-flyout-template.html', 'common/widgets/flyout/samples/sit-flyout-template2.html', 'common/widgets/graph/graph.html', 'common/widgets/grid/grid.html', 'common/widgets/iconPicker/icon-selection-template.html', 'common/widgets/iconPicker/iconPicker.html', 'common/widgets/iconPreview/iconPreview.html', 'common/widgets/itemCollectionViewer/item-collection-viewer.html', 'common/widgets/label/label.html', 'common/widgets/multiSelect/sit-multi-select.html', 'common/widgets/navigationLink/sit-tab.html', 'common/widgets/navigationLink/sit-tabset.html', 'common/widgets/navigationLink/tab.html', 'common/widgets/navigationLink/tabset.html', 'common/widgets/notificationTile/notification-tile.html', 'common/widgets/notificationTile/samples/notification-tile-dev.html', 'common/widgets/numeric/numeric.html', 'common/widgets/overlay/overlay.html', 'common/widgets/overlay/samples/overlay-dev-tpl.html', 'common/widgets/overlay/samples/overlay-dev.html', 'common/widgets/pager/pager.html', 'common/widgets/password/password.html', 'common/widgets/propertyGrid/property-grid.html', 'common/widgets/propertyGrid/property.html', 'common/widgets/radio/radio.html', 'common/widgets/select/select.html', 'common/widgets/sidebar/scroll.html', 'common/widgets/sidebar/sidebar-item.html', 'common/widgets/sidebar/sidebar.html', 'common/widgets/sidePanel/sidepanel.html', 'common/widgets/sortableAccordion/sortable-accordion.html', 'common/widgets/status/status.html', 'common/widgets/switchButton/switch-button.html', 'common/widgets/table/table-button.html', 'common/widgets/table/table-filterbar.html', 'common/widgets/table/table-with-group.html', 'common/widgets/text/text.html', 'common/widgets/textarea/textarea.html', 'common/widgets/tiles/action-tile.html', 'common/widgets/tiles/custom-tile-item.html', 'common/widgets/tiles/item-tile.html', 'common/widgets/tiles/large-tile-item.html', 'common/widgets/tiles/medium-tile-item.html', 'common/widgets/tiles/tile-group.html', 'common/widgets/tiles/tile-view.html', 'common/widgets/tiles/wide-tile-item.html', 'common/widgets/timePicker/time-picker.html', 'common/widgets/typeahead/typeahead.html', 'common/widgets/viewBar/view-bar.html', 'common/blueprints/executeCommandTemplate/execute-commandTemplate.html', 'common/blueprints/masterDetailsTemplate/masterDetailsLayoutTemplate.html', 'common/blueprints/overviewTemplate/overviewTemplate.html', 'common/blueprints/singleEntityTemplate/singleEntityLayoutTemplate.html']);

angular.module("common/components/buttonBox/buttonbox-dev-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/components/buttonBox/buttonbox-dev-tpl.html",
    "<div>\n" +
    "    <button ng-disabled=\"buttonBoxCtr.hidePrevTask\" class=\"btn btn-info\" style=\"width:100%;\" ng-click=\"prevTaskCallback()\"><i class=\"fa fa-caret-up fa-3\"></i>Previous task</button>\n" +
    "    <div>\n" +
    "        <button class=\"btn btn-success\" style=\"width:25%;float:left;\" ng-click=\"okCallback()\">OK</button>\n" +
    "        <button class=\"btn btn-danger\" style=\"width:25%;float:left;\" ng-click=\"notOkCallBack()\">NOK</button>\n" +
    "        <button class=\"btn btn-warning\" style=\"width:25%;float:left;\" ng-click=\"NACallBack()\">N/A</button>\n" +
    "        <button class=\"btn btn-primary\" style=\"width:25%;float:left;\" ng-click=\"detailsCallBack()\">?</button>\n" +
    "        <span class=\"label label-default\">Title</span>\n" +
    "        <input type=\"text\" ng-model=\"buttonBoxCtr.title\"/></div>\n" +
    "    <button ng-disabled=\"buttonBoxCtr.hideNextTask\" class=\"btn btn-info\" style=\"width:100%;\" ng-click=\"nextTaskCallback()\"><i class=\"fa fa-caret-down fa-3\"></i>Next task</button>\n" +
    "</div>");
}]);

angular.module("common/components/documentation/helpWindow/help-window.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/components/documentation/helpWindow/help-window.html",
    "<div class=\"overlay-look\">\n" +
    "    <script type=\"text/ng-template\" id=\"PopupContent.html\">\n" +
    "        <div class=\"doc-popup-modal\" id=\"popupDocCenter\" ng-mouseover=\"modalPopupCtrl.draggable()\">\n" +
    "            <div class=\"modal-header\">\n" +
    "                <div class=\"help-window-toolbar row\">\n" +
    "                    <div class=\"help-window-tb-left\">\n" +
    "                        <i class=\"fa fa-arrow-circle-left\" ng-show=\"modalPopupCtrl.showPrev\" ng-click=\"modalPopupCtrl.goToPrevState()\"></i>\n" +
    "                        <i class=\"fa fa-arrow-circle-right\" ng-show=\"modalPopupCtrl.showNext\" ng-click=\"modalPopupCtrl.goToNextState()\"></i>\n" +
    "                        <span>{{'common.helpWindow.title'|translate}}</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"help-window-tb-right\">\n" +
    "                        <i class=\"fa fa-share\" ng-click=\"modalPopupCtrl.openDocCenterTab()\"></i>\n" +
    "                        <i class=\"fa fa-times\" ng-click=\"modalPopupCtrl.closeDocPopup()\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"help-window-search-bar row\">\n" +
    "                    <div class=\"quick-search-container\" ng-show=\"true\">\n" +
    "                        <form ng-submit=\"modalPopupCtrl.doSearchOnPopup()\" class=\"ng-pristine ng-valid\">\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input type=\"text\"\n" +
    "                                       id=\"quickSearchPopUpTextBox\"\n" +
    "                                       ng-model=\"modalPopupCtrl.searchQuery\" autocomplete=\"off\"\n" +
    "                                       class=\"form-control filter-quick-search search-input ng-pristine ng-valid ng-touched\"\n" +
    "                                       data-internal-type=\"quickSearchPopUpTextBox\"\n" +
    "                                       placeholder=\"{{'common.helpWindow.search'|translate}}\" />\n" +
    "                                <div class=\"input-group-btn\">\n" +
    "                                    <button class=\"btn btn-default search-button\"\n" +
    "                                            id=\"quickSearchIcon\"\n" +
    "                                            data-internal-type=\"quickSearchIcon\">\n" +
    "                                        <i class=\"fa fa-search\"></i>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\" ng-hide=\"modalPopupCtrl.show\">\n" +
    "                <article>\n" +
    "                    <div class=\"quick-search-title\">\n" +
    "                        <h4 id=\"{{modalPopupCtrl.query}}\" ng-hide=\"modalPopupCtrl.show\"><strong>{{'common.helpWindow.search-info'|translate}}: <em>{{modalPopupCtrl.query}}</em></strong></h4>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"modalPopupCtrl.showNoResult\">\n" +
    "                        <span>{{'common.helpWindow.no-items-found'|translate}}</span>\n" +
    "                    </div>\n" +
    "                    <section ng-show=\"!modalPopupCtrl.showNoResult\" ng-repeat=\"result in modalPopupCtrl.data | limitTo : modalPopupCtrl.maxSearchResult\">\n" +
    "                        <h4 id=\"{{result.PageId}}\">\n" +
    "                            <a href=\"javascript:void(0);\" ng-click=\"reloadPopUpOnLnkClk(result.Id)\"> {{result.Title}} </a>&nbsp;\n" +
    "                            <a target=\"_blank\" href=\"{{modalPopupCtrl.docCenterUrl}}#/docHome/document/{{result.DocumentId}}/page/{{result.Id}}\"><span class=\"fa fa-external-link\"></span></a>\n" +
    "                        </h4>\n" +
    "                        <p ng-bind-html=\"result.HighlightedText\">\n" +
    "                        </p>\n" +
    "                        <p>\n" +
    "                            <span>\n" +
    "                                <strong>{{'common.helpWindow.document'|translate}}:&nbsp;</strong>\n" +
    "                                <a href=\"javascript:void(0);\" ng-click=\"modalPopupCtrl.reloadPopUpOnDocumentLnkClk(result.DocumentId)\"> {{result.DocumentTitle}} </a>&nbsp;\n" +
    "                                <a target=\"_blank\" href=\"{{modalPopupCtrl.docCenterUrl}}#/docHome/document/{{result.DocumentId}}/page/\"><span class=\"fa fa-external-link\"></span></a>\n" +
    "                            </span>\n" +
    "                        </p>\n" +
    "                        <br />\n" +
    "                    </section>\n" +
    "                </article>\n" +
    "            </div>\n" +
    "            <div class=\"doc-center-page modal-body\" ng-show=\"modalPopupCtrl.show\">\n" +
    "                <article>\n" +
    "                    <p sit-bind-dynamic-html=\"modalPopupCtrl.pageContent\" class=\"doc-page-layout\"></p>\n" +
    "                    <sit-documentation-anchor-reslove></sit-documentation-anchor-reslove>\n" +
    "                </article>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "</div>");
}]);

angular.module("common/components/header/flymenu/flymenu.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/components/header/flymenu/flymenu.html",
    "<div class=\"popover {{placement}} header-color header-popover\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    " <div class=\"popover-inner\">\n" +
    "     <div class=\"popover-content\" ng-repeat=\"idx in content\" data-internal-type=\"flyMenu{{idx.id}}\" ng-class=\"idx.popoverItemClass\" ng-click=\"getfn()(idx.fnCallback, idx.id)\">\n" +
    "         <span ng-class=\"idx.popooverItemImageClass\"></span>\n" +
    "         <span>{{idx.text}}</span>\n" +
    "     </div>\n" +
    " </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("common/components/header/header.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/components/header/header.tpl.html",
    "<div class=\"container-fluid navbar-header header-fluid header-color\" ng-controller=\"headerController as hc\">\n" +
    "    <div id=\"headerNavBar\" class=\"col-xs-20 col-sm-20 col-md-25 col-lg-25 pull-left\" role=\"navigation\" ng-class=\"hc.headerType.navBarClass\">\n" +
    "        <div data-internal-type=\"headerBarHamburger\" class=\"flymenu header-navbar-item-noborder header-navbar-item-button pull-left fa fa-lg fa-bars\" ng-class=\"hc.headerType.navBarButtonClass\" flymenu=\"{{hc.popoverHamburger}}\" style=\"margin-right: 0;\" flymenu-placement=\"bottom\"></div>\n" +
    "        <div class=\"flymenu header-navbar-item-noborder header-navbar-item-button pull-left\">\n" +
    "            <i class=\"flymenu fa fa-home fa-lg\" ng-click=\"hc.goToHome()\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"flymenu header-navbar-item-noborder header-navbar-item-button pull-left\">\n" +
    "            <i class=\"flymenu fa fa-info-circle fa-lg\" ng-click=\"hc.showAbout()\"></i>\n" +
    "        </div>\n" +
    "        <div data-internal-type=\"headerBarHelp\" class=\"flymenu header-navbar-item-noborder header-navbar-item-button pull-left\" ng-if=\"hc.helpIcon\">\n" +
    "            <i class=\"flymenu fa fa-question-circle fa-lg help-icon\" ng-click=\"hc.showHelpWindow()\"></i>\n" +
    "        </div>\n" +
    "        <div data-internal-type=\"headerBarUser\" class=\"flymenu header-navbar-item-noborder header-navbar-item-button pull-left header-navbar-user\" flymenu=\"{{hc.popoverUser}}\" flymenu-placement=\"bottom\">\n" +
    "            <span class=\"flymenu navbar-user-logo\"><i class=\"flymenu fa fa-lg sit sit-user\"></i>&nbsp; {{ (hc.identity['urn:fullname'] && hc.identity['urn:fullname'].trim() !== '' ) ? hc.identity['urn:fullname'].trim()  : hc.identity.unique_name.trim()  }}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--\n" +
    "    <div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\" ng-class=\"hc.headerType.titleClass\">\n" +
    "        <div data-internal-type=\"headerBarTitle\" class=\"product-name-label\">{{hc.title}}</div\n" +
    "    </div>\n" +
    "    -->\n" +
    "    <!-- Menu parts -->\n" +
    "    \n" +
    "\n" +
    "\n" +
    "    <div ng-if=\"hc.logoImage\" class=\"logo-container navbar-brand pull-right\" data-internal-type=\"headerBarLogo\">\n" +
    "         <img ng-src=\"{{hc.logoImage}}\" />\n" +
    "    </div>\n" +
    "    <div ng-if=\"!hc.logoImage\" class=\"default-logo-container navbar-brand pull-right\" data-internal-type=\"headerBarLogo\">\n" +
    "        <svg width=\"82\" height=\"16\" viewBox=\"0 0 82 16\">\n" +
    "         <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"icon-logo-color\" fill=\"#009999\" d=\"M2.2,13.8v-2.4C3.6,11.8,4.8,12,5.8,12c1.4,0,2.1-0.4,2.1-1.1 c0-0.3-0.1-0.5-0.3-0.7C7.4,10,6.9,9.7,6,9.4C4.4,8.7,3.4,8.2,2.9,7.7C2.3,7.1,2,6.3,2,5.4c0-1.2,0.5-2.1,1.4-2.7 c0.9-0.6,2-0.9,3.5-0.9c0.8,0,1.9,0.1,3.4,0.4v2.3C9.1,4.1,8.1,3.8,7.2,3.8c-1.3,0-2,0.4-2,1.1c0,0.3,0.1,0.5,0.4,0.7 c0.2,0.1,0.8,0.4,1.9,0.9c1.5,0.6,2.4,1.2,2.9,1.7c0.6,0.6,0.9,1.3,0.9,2.2c0,1.3-0.6,2.3-1.7,3c-0.9,0.6-2.1,0.8-3.5,0.8 C4.7,14.2,3.5,14.1,2.2,13.8\"></path><rect x=\"13.1\" y=\"2\" class=\"icon-logo-color\" fill=\"#009999\" width=\"3.3\" height=\"12\"></rect><polygon fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"icon-logo-color\" fill=\"#009999\" points=\"19.5,14 19.5,2 28,2 28,4.2 22.7,4.2 22.7,6.9 27.3,6.9 27.3,8.8 22.7,8.8 22.7,11.7 28.2,11.7 28.2,14 \"></polygon><polygon fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"icon-logo-color\" fill=\"#009999\" points=\"30.3,14 30.3,2 34.7,2 37.7,9.6 40.8,2 44.9,2 44.9,14 41.7,14 41.7,5.5 38.2,14.1 36.1,14.1 32.7,5.5 32.7,14 \"></polygon><polygon fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"icon-logo-color\" fill=\"#009999\" points=\"47.9,14 47.9,2 56.5,2 56.5,4.2 51.2,4.2 51.2,6.9 55.8,6.9 55.8,8.8 51.2,8.8 51.2,11.7 56.6,11.7 56.6,14 \"></polygon><polygon fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"icon-logo-color\" fill=\"#009999\" points=\"58.8,14 58.8,2 62.7,2 66.8,10 66.8,2 69.2,2 69.2,14 65.4,14 61.2,5.9 61.2,14 \"></polygon><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" class=\"icon-logo-color\" fill=\"#009999\" d=\"M71.5,13.8v-2.4c1.3,0.4,2.5,0.6,3.6,0.6c1.4,0,2.1-0.4,2.1-1.1 c0-0.3-0.1-0.5-0.3-0.7c-0.2-0.2-0.8-0.5-1.6-0.8c-1.6-0.6-2.6-1.2-3.1-1.7c-0.6-0.6-0.9-1.4-0.9-2.3c0-1.2,0.4-2.1,1.4-2.7 c0.9-0.6,2-0.9,3.5-0.9c0.8,0,1.8,0.1,3.1,0.4l0.3,0.1v2.3c-1.1-0.4-2.1-0.7-3.1-0.7c-1.3,0-2,0.4-2,1.1c0,0.3,0.1,0.5,0.4,0.7 c0.2,0.1,0.8,0.4,1.9,0.9c1.4,0.6,2.4,1.2,2.9,1.7c0.6,0.6,0.9,1.3,0.9,2.2c0,1.3-0.6,2.3-1.7,3c-0.9,0.6-2.1,0.8-3.6,0.8 C74,14.2,72.8,14.1,71.5,13.8\"></path>\n" +
    "         </svg>\n" +
    "    </div>\n" +
    "    <sit-dialog sit-title=\"hc.aboutDialog.title\"\n" +
    "                sit-templatedata='hc.aboutDialog.templateData'\n" +
    "                sit-modalid='aboutId'\n" +
    "                sit-buttons='hc.aboutDialog.buttons'>\n" +
    "    </sit-dialog>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/layout/component/component.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/layout/component/component.html",
    "<sit-container sit-isswac=\"false\" sit-group-name=\"internal\">\n" +
    "    <sit-component sit-name=\"{{componentCtr.name}}\" sit-componentname=\"{{componentCtr.name}}\" sit-type=\"ui\" sit-source=\"{{componentCtr.source}}\" \n" +
    "                   sit-left=\"0\" sit-top=\"0\" sit-cols=\"12\" sit-rows=\"12\" sit-flavor=\"ui\" sit-contracts=\"componentCtr.contracts\"></sit-component>\n" +
    "</sit-container>");
}]);

angular.module("common/layout/home/home.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/layout/home/home.tpl.html",
    "<style>\n" +
    "    .centering {\n" +
    "        float:none;\n" +
    "         margin:5px 5px 0 0;\n" +
    "    }\n" +
    "    .row-fluid {\n" +
    "        margin:5px 5px 0 0;\n" +
    "        vertical-align: middle;\n" +
    "    }\n" +
    "    .header {\n" +
    "        font-size: 20px;\n" +
    "        font-weight:bold;\n" +
    "    }\n" +
    "\n" +
    "</style>\n" +
    "<div style=\"padding-left: 8px; padding-top: 16px\" ng-controller=\"homeController as lc\">\n" +
    "    <div>\n" +
    "        <div>\n" +
    "            <div class=\"header\">Main</div><sit-item-tile sit-tile-content=\"area\" id=\"homeSettings\" ng-repeat=\"area in lc.areas\"></sit-item-tile>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <div class=\"header\"></div><sit-item-tile sit-tile-content=\"doc\" id=\"homeDocuments\" ng-repeat=\"doc in lc.documents\"></sit-item-tile>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/layout/homeState/loading.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/layout/homeState/loading.html",
    "<div class=\"loading-ui-view\">\n" +
    "    <div class=\"loadingSection\">\n" +
    "        <h2>Loading...</h2>\n" +
    "        <div class=\"loader\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/layout/settings/settings.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/layout/settings/settings.tpl.html",
    "<div ng-controller=\"settingsCtrl as sc\" class=\"user-preference-settings\">\n" +
    "    <h2>{{ 'settings.title' | translate }}</h2>\n" +
    "    <div>\n" +
    "        <button type=\"button\" data-internal-type=\"settingsSaveResetToDefaultButton\" class=\"btn side-panel-button\" ng-click=\"sc.restoreSettings()\">{{ 'settings.btnReset' | translate }}</button>\n" +
    "        <button type=\"button\" data-internal-type=\"settingsSaveChangesButton\" class=\"btn side-panel-button\" ng-click=\"sc.saveSettings()\">{{ 'settings.btnSave' | translate }}</button>\n" +
    "    </div>\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <!-- left column: language  & log -->\n" +
    "        <!--<div class=\"col-lg-20 col-md-20 col-sm-40 col-xs-40\" style=\"padding: 10px \">\n" +
    "            <div>\n" +
    "                <h4>{{ 'settings.subtitle' | translate }}</h4>\n" +
    "                <hr>\n" +
    "                <div class=\"container-fluid\">\n" +
    "                    <div class=\"col-lg-15 col-md-15\"> {{ 'settings.select' | translate }}</div>\n" +
    "                    <div class=\"dropdown col-lg-25 col-md-25 disabled\" data-internal-type=\"ddLanguage\">\n" +
    "                            <div class=\"btn-group\" role=\"group\">\n" +
    "                            <button type=\"button\" data-toggle=\"dropdown\" class=\"btn btn-default dropdown-toggle btn-dropdown-languages\" ng-disabled=\"sc.disableDropdown\" dropdown ng-model=\"sc.currentLanguage\">\n" +
    "                                    <div>{{sc.currentLanguage}} </div>\n" +
    "                                </button>\n" +
    "\n" +
    "                                <button type=\"button\" id=\"settingsDdLanguage\" data-toggle=\"dropdown\" ng-disabled=\"sc.disableDropdown\" class=\"btn btn-default dropdown-toggle btn-dropdown-languages-caret\" dropdown>\n" +
    "                                    <span class=\"caret\"></span>\n" +
    "                                </button>\n" +
    "                                <ul class=\"dropdown-menu dropdown-languages\" role=\"menu\" aria-labelledby=\"ddLanguage\" dropdown-toggle>\n" +
    "                                    <li ng-repeat=\"item in sc.languages\" ng-cloak>\n" +
    "                                        <a  ng-click=\"sc.languageSelected(item.langKey)\" id=\"language{{item.langKey}}\">\n" +
    "                                            {{item.langKey}}\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                          </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>-->\n" +
    "        <div class=\"settings-log-info\">\n" +
    "            <h3>{{ 'settings.log' | translate }}</h3>\n" +
    "            <div data-internal-type=\"settingsLogLevels\">\n" +
    "                <sit-item-tile ng-model=\"sc.loglevel\" ng-repeat=\"item in sc.loglevel\" sit-tile-content=\"item\"></sit-item-tile>\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "    </div>\n" +
    "    <!-- right column: themes -->\n" +
    "    <div class=\"col-lg-20 col-md-20 col-sm-40 col-xs-40\">\n" +
    "        <div class=\"settings-theme-div\">\n" +
    "            <h3>{{ 'settings.theme' | translate }}</h3>\n" +
    "            <table>\n" +
    "                <tr>\n" +
    "                    <td>\n" +
    "                        <div data-internal-type=\"tileThemeLight\" class=\"tile tile-theme-light\" ng-click=\"sc.themeSelected(0)\">\n" +
    "                            <div class=\"select-border\" ng-show=\"sc.isCurrentTheme(0)\"></div>\n" +
    "                            <div ng-show=\"sc.isCurrentTheme(0)\" class=\"top-right-corner-triangle\"></div>\n" +
    "                            <span ng-show=\"sc.isCurrentTheme(0)\" class=\"top-right-select-img fa fa-check fa-inverse fa-lg\"></span>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </td>\n" +
    "                    <td class=\"theme-eye-selector\">\n" +
    "                        <span class=\"fa fa-eye fa-lg\" ng-click=\"sc.openModal(0)\"></span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <tr>\n" +
    "                    <td>\n" +
    "                        <div data-internal-type=\"tileThemeDark\" class=\"tile tile-theme-dark\" ng-click=\"sc.themeSelected(1)\">\n" +
    "                            <div class=\"select-border\" ng-show=\"sc.isCurrentTheme(1)\" ></div>\n" +
    "                            <div ng-show=\"sc.isCurrentTheme(1)\" class=\"top-right-corner-triangle\"></div>\n" +
    "                            <span ng-show=\"sc.isCurrentTheme(1)\" class=\"top-right-select-img fa fa-check fa-inverse fa-lg\"></span>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"theme-eye-selector\">\n" +
    "                        <span class=\"fa fa-eye fa-lg\" ng-click=\"sc.openModal(1)\"></span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>       \n" +
    "    </div>\n" +
    "<div sit-notification-tile\n" +
    "     sit-tile-title=\"sc.notificationTile.title\"\n" +
    "     sit-tile-content=\"sc.notificationTile.content\"\n" +
    "     sit-tile-type=\"sc.notificationTile.type\"\n" +
    "     sit-tile-counter=sc.notificationTile.counter\n" +
    "     sit-tile-callback=\"sc.notificationTile.clickCallback\"\n" +
    "     sit-tile-popup=\"sc.notificationTile.popup\"\n" +
    "     id=\"{{sc.notificationTile.id}}\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("common/layout/shell/shell.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/layout/shell/shell.tpl.html",
    "<div class=\"canvas\" ng-controller=\"layoutController as lc\">\n" +
    "    <div data-internal-type=\"property-area-container-modal\" ng-class=\"lc.typeClass + 'Modal'\" ng-style=\"lc.swacEnabled===true && {'top':'0px',left:'0px'}\"\n" +
    "         ng-show=\"lc.currentPAreaType === lc.propertyAreaTypes.edit\"></div>\n" +
    "    <div ng-hide=\"lc.hide\" class=\"property-are-parent\">\n" +
    "        <div data-internal-type=\"property-area-container\" class=\"\" ng-class=\"lc.typeClass\" ng-style=\"lc.swacEnabled===true && {'top':'0px'}\"\n" +
    "             h-adapter>\n" +
    "            <!-- <p translate-cloak>{ { 'ui.propertyarea' | translate } }</p> -->\n" +
    "            <div class=\"title\">\n" +
    "                {{lc.title}}\n" +
    "            </div>\n" +
    "            <div ui-view=\"property-area-container\" class=\"content\">\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--<span style=\"font-weight:bold\"><p translate-cloak>{{'ui.canvas' | translate: mc.currentLang }}</p></span> -->\n" +
    "\n" +
    "\n" +
    "    <div ng-if=\"lc.swacEnabled!==true\" class=\"breadcrumb-div canvas-ui-view\" ng-show=\"lc.isBreadcrumbShown\">\n" +
    "        <div ng-if=\"lc.isGridsterEnabled !== true\">\n" +
    "            <sit-breadcrumb></sit-breadcrumb>\n" +
    "        </div>\n" +
    "        <div ng-if=\"lc.isGridsterEnabled !==false\" ng-style=\"{'width': lc.isLargeScreen ? 'calc(100% - 200px)' : '100%' }\" style=\"float:left\">\n" +
    "            <sit-breadcrumb></sit-breadcrumb>\n" +
    "        </div>\n" +
    "        <div ng-if=\"(lc.isGridsterEnabled && lc.isLargeScreen)\">\n" +
    "            <div style=\"width:190px; float:right; margin-right: 10px;\">\n" +
    "                <sit-command-bar sit-commands=\"lc.commandBarData\"></sit-command-bar>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div style=\"clear:both\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"canvas-scroll-view\">\n" +
    "        <div ui-view=\"Canvas\" class=\"canvas-ui-view\" h-adapter=\".breadcrumb-div\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div> ");
}]);

angular.module("common/layout/unauthorized/unauthorized.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/layout/unauthorized/unauthorized.html",
    "<div class=\"unauthorizedDiv\">\n" +
    "    <i class=\"fa fa-exclamation-circle fa-3x unauthIcon\" aria-hidden=\"true\"></i>\n" +
    "    <h2 class=\"unauthTitle\">{{unauthCtrl.title}}</h2>\n" +
    "    <div style=\"clear:both\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div style=\"padding-left:60px;\">{{unauthCtrl.message}}</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/accordion/sit-accordion-group.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/accordion/sit-accordion-group.html",
    "<div class=\"sit-panel-default\" ng-style=\"paddingStyle\">\n" +
    "    <div ng-click=\"accGrpCtrl.itemClicked($event)\" id={{accGrpCtrl.menuItemId}} data-internal-type=\"{{accGrpCtrl.internalType}}\" class=\"sit-panel-heading sit-panel-cont {{accGrpCtrl.itemSpaceClass}}\" ng-class=\"{'highlight-selected-menu': (accGrpCtrl.isSelected === 'true')}\">\n" +
    "        <div class=\"{{accGrpCtrl.imgLevelClass}} sit-panel-fa fa\" ng-class=\"accGrpCtrl.isOpen ? accGrpCtrl.faOpenIcon: accGrpCtrl.faIcon\"  ng-click=\"accGrpCtrl.toggleOpen($event)\"></div>\n" +
    "        <div class=\"sit-panel-title\" ng-class=\"accGrpCtrl.txtLevelClass\">\n" +
    "            <h2 class=\"panel-title sit-title\">\n" +
    "                <a tabindex=\"0\" class=\"accordion-toggle\"  sit-accordion-transclude=\"heading\">\n" +
    "                    <span ng-class=\"{'text-muted': accGrpCtrl.isDisabled}\"></span>\n" +
    "                </a>\n" +
    "            </h2>\n" +
    "        </div>\n" +
    "      \n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse\" ng-class=\"{'collapse' : !accGrpCtrl.isOpen}\">\n" +
    "        <div class=\"sit-panel-body\" ng-transclude></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/accordion/sit-accordion.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/accordion/sit-accordion.html",
    "<div class=\"sit-panel-group\" ng-transclude></div>");
}]);

angular.module("common/widgets/breadcrumb/breadcrumb.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/breadcrumb.html",
    "<div data-internal-type=\"breadcrumbContainerDiv\">\n" +
    "    <ol class=\"breadcrumb\">\n" +
    "        <li ng-if=\"ctrl.breadcrumbType=='Complete'\" ng-repeat=\"current in ctrl.trails\" ng-switch=\"$last\">\n" +
    "            <a ng-switch-when=\"false\" href=\"{{current.sitBreadcrumbLink}}\" data-internal-type=\"breadcrumb-item-{{$index+1}}\">{{current.title}} </a>\n" +
    "            <span class=\"lastItem\" ng-switch-when=\"true\" data-internal-type=\"breadcrumb-item-{{$index+1}}\">{{current.title}} </span>\n" +
    "        </li>\n" +
    "        <li ng-if=\"ctrl.breadcrumbType=='HideMiddle'\" ng-repeat=\"shown in ctrl.tobeShown\">\n" +
    "            <span ng-if=\"$middle\" class=\"breadcrumbEllipsis\" ng-class=\"{'breadcrumbEllipsisHighLight':ctrl.showFlyout==true}\" data-internal-type=\"breadcrumb-ellipsis\">{{shown.title}}</span>\n" +
    "            <a ng-if=\"$first\" href=\"{{shown.sitBreadcrumbLink}}\" data-internal-type=\"breadcrumb-first-item\">{{shown.title}}</a>\n" +
    "            <span ng-if=\"$last\" class=\"lastItem\" data-internal-type=\"breadcrumb-last-item\">{{shown.title}}</span>\n" +
    "        </li>\n" +
    "        <li ng-if=\"ctrl.breadcrumbType=='ShowOnlyLast'\" ng-repeat=\"shown in ctrl.tobeShown\">\n" +
    "            <span ng-if=\"$first\" class=\"breadcrumbEllipsis\" ng-class=\"{'breadcrumbEllipsisHighLight':ctrl.showFlyout==true}\" data-internal-type=\"breadcrumb-ellipsis\">{{shown.title}}</span>\n" +
    "            <span ng-if=\"$last\" class=\"lastItem\" title=\"{{ctrl.toolTipforLastItem}}\" data-internal-type=\"breadcrumb-last-item\">{{shown.title}}</span>\n" +
    "        </li>\n" +
    "    </ol>\n" +
    "    <div class=\"divBreadcrumbFlyout\" ng-show=\"ctrl.showFlyout\" ng-style=\"{'top':ctrl.flyoutTop, 'left':ctrl.flyoutLeft, 'margin-left':ctrl.flyoutMarginLeft}\">\n" +
    "        <div class=\"divDropDownBreadcrumbExpander\" ng-if=\"ctrl.showAsDropDown\">\n" +
    "            <a ng-repeat=\"hidden in ctrl.tobeHidden\" class=\"dropdownItems\" href=\"{{hidden.sitBreadcrumbLink}}\" title=\"{{hidden.toolTip}}\" data-internal-type=\"breadcrumb-flyout-menu-item-{{$index+1}}\">{{hidden.title}}</a>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <ol class=\"breadcrumb\" ng-if=\"!ctrl.showAsDropDown\">\n" +
    "                <li ng-repeat=\"hidden in ctrl.tobeHidden\">\n" +
    "                    <a href=\"{{hidden.sitBreadcrumbLink}}\" data-internal-type=\"breadcrumb-flyout-item-{{$index+1}}\">{{hidden.title}}</a>\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev-dsleditor-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev-dsleditor-template.html",
    "<h2>DSL Editor</h2>");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev-home-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev-home-template.html",
    "<h2>Home Page</h2>\n" +
    "<div class=\"well\">\n" +
    "    This is to the breadcrumb widget developed for the unity UI applications.\n" +
    "    <p></p>\n" +
    "    <p> <a ui-sref=\"mashupEditor\">Go To Mashup Editor</a> </p>\n" +
    "    <p> <a ui-sref=\"dslEditor\">Go to DSL Editor</a></p>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev-mashup-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev-mashup-template.html",
    "<h2>Mashup Editor</h2>\n" +
    "<div class=\"well\">\n" +
    "\n" +
    "    <p>List of Views</p>\n" +
    "    <p> <a ui-sref=\"mashupEditor.views\">Go to the View List </a> </p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev-template.html",
    "<div class=\"container\">\n" +
    "<!--<div>-->\n" +
    "    <div class=\"row\">\n" +
    "        <sit-breadcrumb></sit-breadcrumb>\n" +
    "        <div ui-view></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev-viewdetail-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev-viewdetail-template.html",
    "<h2>View Detail</h2>\n" +
    "<div class=\"well\">\n" +
    "    <p></p>\n" +
    "    <p> Details about view : <label>{{ViewName}}</label>  </p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev-viewlist-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev-viewlist-template.html",
    "<h2>Views</h2>\n" +
    "<div class=\"well\">\n" +
    "    The list of views already created\n" +
    "    <p></p>\n" +
    "    <p> <a ui-sref=\"mashupEditor.views.detail({ViewName: 'ViewA'})\">View A</a> </p>\n" +
    "    <p> <a ui-sref=\"mashupEditor.views.detail({ViewName: 'ViewB'})\">View B</a></p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/breadcrumb/samples/breadcrumb-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/breadcrumb/samples/breadcrumb-dev.html",
    "<!doctype html>\n" +
    "<html lang=\"en\" ng-app=\"siemens.simaticit.common.widgets.breadcrumbDemo\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Breadcrumb Development</title>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "    <link href=\"/common/styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "</head>\n" +
    "<body>\n" +
    "    <ng-include src=\"'breadcrumb-dev-template.html'\" />\n" +
    "\n" +
    "    <!-- Vendor scripts-->\n" +
    "\n" +
    "    <script src=\"/common/scripts/angular/angular.min.js\"></script>\n" +
    "    <script src=\"/common/scripts/jquery-2.1.1.min.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui-router.min.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui/ui-bootstrap-tpls.min.js\"></script>\n" +
    "\n" +
    "    <!-- BREADCRUMB Widget SCRIPTS-->\n" +
    "    <script src=\"/common/widgets/breadcrumb/sit-breadcrumb-mod.js\"></script>\n" +
    "    <script src=\"/common/widgets/breadcrumb/sit-breadcrumb-svc.js\"></script>\n" +
    "    <script src=\"/common/widgets/breadcrumb/sit-breadcrumb-dir.js\"></script>\n" +
    "\n" +
    "    <!-- application scripts-->\n" +
    "    <script src=\"/common/widgets/breadcrumb/samples/breadcrumb-dev-app.js\"></script>\n" +
    "    <script src=\"/common/widgets/breadcrumb/samples/breadcrumb-dev-config.route.js\"></script>\n" +
    "    <script src=\"/common/widgets/breadcrumb/samples/breadcrumd-dev-viewcontroller.js\"></script>\n" +
    "</body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("common/widgets/busyIndicator/busy-indicator.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/busyIndicator/busy-indicator.html",
    "<div class=\"modal\" data-backdrop=\"static\" data-internal-type=\"busy-indicator-div\">\n" +
    "    <div class=\"busy-indicator-msg\">\n" +
    "        <div class=\"container-msg\">\n" +
    "            <span data-internal-type=\"busy-indicator-message\">{{busyCtrl.message}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"container-icon\">\n" +
    "        <div class=\"horizontal inner-container\">\n" +
    "            <div class=\"vertical\">\n" +
    "                <i data-internal-type=\"busy-indicator-icon\" class=\"fa {{busyCtrl.icon}} fa-3x\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/checkbox/checkbox.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/checkbox/checkbox.html",
    "<div ng-if=\"checkboxCtrl.readOnly || checkboxCtrl.ngReadonly\" class=\"label-property-grid-control-readonly\">\n" +
    "    <div class='property-grid-span-group-block property-grid-no-border-items' ng-repeat=\"item in checkboxCtrl.value\">\n" +
    "        <div class=\"checkbox-control-readonly\">\n" +
    "            <input type='checkbox' disabled ng-model='item.checked' style=\"min-height:25px;\"/>\n" +
    "            <span style='padding-left:7px' class=\"label-property-grid-control-readonly property-label-ellipsis\"> {{item.label}} </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<ng-form ng-if=\"!(checkboxCtrl.readOnly || checkboxCtrl.ngReadonly)\"\n" +
    "         name=\"checkboxForm\" ng-class=\"{'isrequired' : (checkboxCtrl.validation.required) && (checkboxForm.$error.required.length===checkboxCtrl.value.length) }\">\n" +
    "    <div class=\"property-grid-span-group-block validator-control\" ng-model=\"checkboxCtrl.value\">\n" +
    "        <ng-form name=\"checkboxItemForm\" class=\"group-control\" ng-repeat=\"item in checkboxCtrl.value\" style=\"display:block;\">\n" +
    "            <div class=\"group-control-data\">\n" +
    "                <input type='checkbox'\n" +
    "                       name='{{item.label}}'\n" +
    "                       ng-model='item.checked'\n" +
    "                       ng-blur=\"checkboxCtrl.ngBlur()\"\n" +
    "                       ng-checked=\"item.checked\"\n" +
    "                       sit-change=\"checkboxCtrl.sitChange\"\n" +
    "                       ng-disabled=\"checkboxCtrl.ngDisabled\"\n" +
    "                       ng-focus=\"checkboxCtrl.ngFocus()\"\n" +
    "                       ng-required=\"checkboxCtrl.validation.required\"\n" +
    "                       sit-form-input-validator />\n" +
    "                <span class=\"property-label-ellipsis\">{{item.label}}</span>\n" +
    "            </div>\n" +
    "        </ng-form>\n" +
    "    </div>\n" +
    "</ng-form>\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/commandBar/command-bar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/commandBar/command-bar.html",
    "<div data-internal-type=\"command-bar\" ng-class=\"{Action:'commandBarContainerAction',Tool:'commandBarContainerTool'}[commandBarCtrl.commands.barType]\">\n" +
    "\n" +
    "    <div data-internal-type=\"command-menu-command-bar\" ng-class=\"{right: 'right-align-align'}[commandBarCtrl.labelAlign]\">\n" +
    "\n" +
    "        <div class=\"container-fluid\">\n" +
    "\n" +
    "\n" +
    "            <ul data-internal-type=\"command-bar-collapse-1\" class=\"commandBarContainerList\" style=\"display:inline-flex\">\n" +
    "                <li ng-show=\"commandBarCtrl.DisplayMenu\" class=\"btn-group\">\n" +
    "                    <!-- Collapse button -->\n" +
    "\n" +
    "                    <button data-internal-type=\"collapse-button-command-bar\" id=\"collapse-button-command-bar\" ng-class=\"{Action:'dropdown-toggle CommandActionDropdown',Tool:'dropdown-toggle CommandToolDropdown'}[commandBarCtrl.commands.barType]\" data-toggle=\"dropdown\" title=\"Other commands\">\n" +
    "                        <div style=\"display:inline\">\n" +
    "                            <span class=\"fa-stack fa-lg\">\n" +
    "                                <i class=\"fa fa-bars fa-stack \"></i>\n" +
    "                            </span>\n" +
    "\n" +
    "                            <div class=\"caret\"></div>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"commandBarCtrl.commands.barType=='Tool'\" class=\"CommandToolDropdownLabel\">{{commandBarCtrl.otherCommandsText}}</div>\n" +
    "                    </button>\n" +
    "\n" +
    "                    <ul data-internal-type=\"collapse-menu-command-bar\" id=\"sit-commandbar-collapse-menu\" class=\"dropdown-menu commandBarDropdownMenu\" ng-class=\"{'commandBarDropdownMenuAlignRight':!commandBarCtrl.openLeft}\" role=\"menu\" data-toggle=\"dropdown\">\n" +
    "                        <li ng-repeat=\"command in commandBarCtrl.commands.bar\" class=\"commandBarDropdownItem\" ng-show=\"$index<=commandBarCtrl.MaxIndexNumber\">\n" +
    "\n" +
    "                            <div ng-switch=\"command.type\">\n" +
    "\n" +
    "\n" +
    "                                <div ng-switch-when=\"Command\" data-internal-type=\"collapse-menu-item-command-bar\">\n" +
    "                                    <!-- Action button -->\n" +
    "                                    <sit-command sit-showas=\"Menu\" sit-command=\"command\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-switch-when=\"toggle\" data-internal-type=\"collapse-menu-item-command-bar\">\n" +
    "                                    <!-- Toggle button -->\n" +
    "                                    <sit-command sit-showas=\"Menu\" sit-command=\"command\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-switch-when=\"Sep\">\n" +
    "                                    <!-- Separator button -->\n" +
    "                                    <div data-internal-type=\"collapse-menu-separator-command-bar\" class=\"divider menuDivider\"></div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-switch-when=\"Group\" data-internal-type=\"collapse-submenu-command-bar\">\n" +
    "                                    <!-- Group Button button -->\n" +
    "                                    <sit-command-group sit-showas=\"Menu\" sit-group=\"command\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command-group>\n" +
    "\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-switch-when=\"MainCommand\">\n" +
    "                                    <sit-command sit-showas=\"Menu\" sit-command=\"command\" sit-type=\"main\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-switch-default>\n" +
    "                                    Unknown sub command type: Allowed values are \"Command\" or \"Sep\"\n" +
    "                                </div>\n" +
    "\n" +
    "                            </div>\n" +
    "\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <li ng-repeat=\"command in commandBarCtrl.commands.bar\">\n" +
    "\n" +
    "                    <div ng-switch=\"command.type\" ng-show=\"!commandBarCtrl.DisplayMenu || ($index>commandBarCtrl.MaxIndexNumber)\">\n" +
    "\n" +
    "                        <div ng-switch-when=\"Command\">\n" +
    "                            <!--ng-show=\"command.visible\"-->\n" +
    "                            <!-- Action button -->\n" +
    "                            <sit-command sit-command=\"command\" sit-showas=\"Button\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-when=\"toggle\">\n" +
    "                            <!--ng-show=\"command.visible\"-->\n" +
    "                            <!-- Toggle button -->\n" +
    "                            <sit-command sit-command=\"command\" sit-showas=\"Button\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-when=\"Sep\">\n" +
    "                            <!-- Separator button -->\n" +
    "                            <div data-internal-type=\"separator-command-bar\" ng-class=\"{Tool:'commandBarDividerTool',Action:'commandBarDivider'}[commandBarCtrl.commands.barType]\">\n" +
    "                                <div class=\"commandBarDividerIcon\" />\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-when=\"Group\">\n" +
    "                            <!-- Group Button button -->\n" +
    "                            <sit-command-group sit-label-align=\"{{commandBarCtrl.labelAlign}}\" sit-group=\"command\" sit-showas=\"Button\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command-group>\n" +
    "\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-when=\"MainCommand\">\n" +
    "                            <sit-command sit-command=\"command\" sit-showas=\"Button\" sit-bartype=\"{{commandBarCtrl.commands.barType}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-default>\n" +
    "                            Unknown sub command type: Allowed values are \"Command\", \"Group\" or \"Sep\"\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <ng-transclude ng-show=false></ng-transclude>\n" +
    "                <div ng-show=\"commandBarCtrl.commands.barType === 'Tool' || commandBarCtrl.commands.barType === 'Action'\"  class=\"commandBarRightMarginForActionButton\"></div>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/commandBar/command-group.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/commandBar/command-group.html",
    "<div>\n" +
    "    <div ng-switch=\"cmdBarGrpBtnCtrl.showas\" ng-show=\"cmdBarGrpBtnCtrl.groupVisibility\">\n" +
    "        <div ng-switch-when=\"Button\" class=\"btn-group \">\n" +
    "            <button data-internal-type=\"group-button-command-bar\" ng-class=\"{Action:'dropdown-toggle CommandActionDropdown',Tool:'dropdown-toggle CommandToolDropdown'}[cmdBarGrpBtnCtrl.bartype]\" data-toggle=\"dropdown\" title=\"{{cmdBarGrpBtnCtrl.group.tooltip || cmdBarGrpBtnCtrl.group.name}}\">\n" +
    "                <div style=\"display:inline;\">\n" +
    "                    <span ng-if=\"cmdBarGrpBtnCtrl.group.image\" class=\"fa-stack fa-lg\">\n" +
    "                        <i class=\"fa {{cmdBarGrpBtnCtrl.group.image}} fa-stack\"></i>\n" +
    "                    </span>\n" +
    "                    <div class=\"caret\"></div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"cmdBarGrpBtnCtrl.bartype=='Tool'\" class=\"CommandToolDropdownLabel\">{{cmdBarGrpBtnCtrl.group.label}}</div>\n" +
    "            </button>\n" +
    "\n" +
    "            <ul data-internal-type=\"menu-command-bar\" class=\"dropdown-menu commandBarDropdownMenu \" ng-class=\"{'commandBarDropdownMenuAlignRight':cmdBarGrpBtnCtrl.openLeft}\" role=\"menu\" data-toggle=\"dropdown\">\n" +
    "                <li ng-repeat=\"subcommand in cmdBarGrpBtnCtrl.group.group\" class=\"commandBarDropdownItem\">\n" +
    "\n" +
    "                    <div ng-switch=\"subcommand.type\">\n" +
    "\n" +
    "\n" +
    "                        <div data-internal-type=\"menu-item-command-bar\" ng-switch-when=\"Command\">\n" +
    "                            <!-- Action button -->\n" +
    "                            <sit-command sit-command=\"subcommand\" sit-showas=\"Menu\" sit-bartype=\"{{cmdBarGrpBtnCtrl.bartype}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-when=\"Sep\">\n" +
    "                            <!-- Separator button -->\n" +
    "                            <div data-internal-type=\"menu-separator-command-bar\" class=\" divider menuDivider\" />\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-internal-type=\"menu-item-command-bar\" ng-switch-when=\"toggle\">\n" +
    "                            <!-- Action button -->\n" +
    "                            <sit-command sit-command=\"subcommand\" sit-showas=\"Menu\" sit-bartype=\"{{cmdBarGrpBtnCtrl.bartype}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-default>\n" +
    "                            Unknown sub command type: Allowed values are \"Command\" or \"Sep\"\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div ng-switch-when=\"Menu\" class=\"dropdown-submenu \" ng-class=\"{'pull-left':cmdBarGrpBtnCtrl.openLeft}\">\n" +
    "\n" +
    "            <div data-internal-type=\"group-submenu-command-bar\" class='btnMenu' style=\"text-align:left\" title=\"{{cmdBarGrpBtnCtrl.group.tooltip || cmdBarGrpBtnCtrl.group.name}}\">\n" +
    "                <span ng-if=\"cmdBarGrpBtnCtrl.group.image && !cmdBarGrpBtnCtrl.group.imageTemplate\" class=\"fa {{cmdBarGrpBtnCtrl.group.image}}  \">\n" +
    "                </span>\n" +
    "                <span data-internal-type=\"image-container\" ng-if=\"cmdBarGrpBtnCtrl.group.imageTemplate\" class=\"fa-lg\" ng-bind-html=\"cmdBarGrpBtnCtrl.group.imageTemplate\"></span>\n" +
    "                <label class=\"menuLabel\">{{cmdBarGrpBtnCtrl.group.label}} </label>\n" +
    "\n" +
    "                <span class=\"fa fa-caret-right\"></span>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <ul data-internal-type=\"submenu-command-bar\" class=\"dropdown-menu commandBarDropdownMenu \" role=\"menu\">\n" +
    "                <li class=\"commandBarDropdownItem\" ng-repeat=\"subcommand in cmdBarGrpBtnCtrl.group.group\">\n" +
    "\n" +
    "                    <div ng-switch=\"subcommand.type\">\n" +
    "\n" +
    "\n" +
    "                        <div data-internal-type=\"submenu-item-command-bar\" ng-switch-when=\"Command\">\n" +
    "                            <!-- Action button -->\n" +
    "                            <sit-command sit-command=\"subcommand\" sit-showas=\"Menu\" sit-bartype=\"{{cmdBarGrpBtnCtrl.bartype}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-internal-type=\"submenu-separator-command-bar\" ng-switch-when=\"Sep\">\n" +
    "                            <!-- Separator button -->\n" +
    "                            <div class=\"divider menuDivider\"></div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-internal-type=\"submenu-item-command-bar\" ng-switch-when=\"toggle\">\n" +
    "                            <!-- Action button -->\n" +
    "                            <sit-command sit-command=\"subcommand\" sit-showas=\"Menu\" sit-bartype=\"{{cmdBarGrpBtnCtrl.bartype}}\"></sit-command>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-default>\n" +
    "                            Unknown sub command type: Allowed values are \"Command\" or \"Sep\"\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "        </div>\n" +
    "        <ng-transclude ng-show=false></ng-transclude>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/commandBar/command.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/commandBar/command.html",
    "<div ng-transclude></div>\n" +
    "<div ng-switch=\"cmdCtrl.showas\" ng-show=\"cmdCtrl.command.visibility && !cmdCtrl.command.deniedFromAuthorization\">\n" +
    "    <div ng-switch-when=\"Button\" id=\"Button{{cmdCtrl.command.type}}{{cmdCtrl.command.name}}\">\n" +
    "        <button data-internal-type=\"command-button-command-bar\"\n" +
    "                ng-class=\"[{Action:'{{cmdCtrl.command.type}}ActionButton',Tool:'{{cmdCtrl.command.type}}ToolButton'}[cmdCtrl.bartype],{'toggle': cmdCtrl.command.type === 'toggle' && cmdCtrl.command.selected}]\"\n" +
    "                ng-click=\"cmdCtrl.commandClicked(cmdCtrl.command)\" title=\"{{cmdCtrl.command.tooltip || cmdCtrl.command.label}}\" ng-disabled=\"cmdCtrl.command.disabled\">\n" +
    "            <span data-internal-type=\"image-container\" ng-if=\"cmdCtrl.command.image && !cmdCtrl.command.imageTemplate\" class=\"fa-lg\">\n" +
    "                <i class=\"fa {{cmdCtrl.command.image}}\"></i>\n" +
    "            </span>\n" +
    "            <span data-internal-type=\"image-container\" ng-if=\"cmdCtrl.command.imageTemplate\" class=\"fa-lg\" ng-bind-html=\"cmdCtrl.command.imageTemplate\"></span>\n" +
    "            <span data-internal-type=\"text-container\" ng-if=\"cmdCtrl.bartype=='Tool' || cmdCtrl.command.type=='MainCommand'\" class=\"{{cmdCtrl.command.type}}{{cmdCtrl.bartype}}Label\">{{cmdCtrl.command.label}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div ng-switch-when=\"Menu\">\n" +
    "        <div data-internal-type=\"command-menu-command-bar\" type=\"button\" class=\"btnMenu\" style=\"text-align:left\" ng-click=\"cmdCtrl.commandClicked(cmdCtrl.command, $event)\" title=\"{{cmdCtrl.command.tooltip || cmdCtrl.command.label}}\" ng-disabled=\"cmdCtrl.command.disabled\">\n" +
    "            <span data-internal-type=\"image-container\" ng-if=\"cmdCtrl.command.image && !cmdCtrl.command.imageTemplate\" class=\"fa {{cmdCtrl.command.image}}\"></span>\n" +
    "            <span data-internal-type=\"image-container\" ng-if=\"cmdCtrl.command.imageTemplate\" ng-bind-html=\"cmdCtrl.command.imageTemplate\"></span>\n" +
    "            <label data-internal-type=\"text-container\" class=\"menuLabel\" onclick=\"event.preventDefault();\" ng-class=\"!cmdCtrl.command.image && cmdCtrl.labelAlign === 'right' ? 'menu-label-icon-margin' : 'menu-label-margin'\">\n" +
    "                {{cmdCtrl.command.label}}\n" +
    "                <input type=\"checkbox\" style=\"float:right\" ng-show=\"cmdCtrl.command.type === 'toggle'\" ng-checked=\"cmdCtrl.command.selected\"/>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/commandBar/samples/command-bar-dev-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/commandBar/samples/command-bar-dev-tpl.html",
    "<!--<div ng-controller=\"CommandBarDevController as cbDevCtrl\">\n" +
    "    <div class=\"container\" >-->\n" +
    "\n" +
    "<div ng-controller=\"CommandBarDevController as cbDevCtrl\" style=\"display:table; width:100%; border:1px solid blue;\">\n" +
    "    <div  style=\"width:auto\" ng-style=\"redStyle\">\n" +
    "        <!--<div class=\"col-md-20 col-xs-20 col-lg-20 col-sm-20\"></div>-->\n" +
    "        <div class=\"col-md-20 col-md-offset-20 col-xs-offset-20 col-lg-offset-20  col-sm-offset-20 col-xs-20 col-lg-20 col-sm-20\" ng-style=\"yellowStyle\">\n" +
    "            <sit-command-bar sit-commands=\"cbDevCtrl.commandBarData\" on-click=\"cbDevCtrl.commandBarClick(clickedCommand)\"></sit-command-bar>\n" +
    "        </div>\n" +
    "            </div>\n" +
    "    <div class=\"\">\n" +
    "        <input type=\"checkbox\" ng-model=\"useColors\" ng-change=\"changeColors()\" /> Use Colors\n" +
    "\n" +
    "    </div>\n" +
    "    <!--<div class=\"row\">\n" +
    "        TEST\n" +
    "    </div>-->\n" +
    "    <!--<br />-->\n" +
    "\n" +
    "    <div style=\"width:auto; height: 150px; overflow:auto; background:#879baa\">\n" +
    "        <strong>Notifications</strong><br />\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"event in events\">{{event}}</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <br />\n" +
    "    <span>\n" +
    "        <button ng-click=\"cbDevCtrl.switchMode(cbDevCtrl.commandBarData)\"> Switch mode</button>\n" +
    "        <span> mode : {{cbDevCtrl.commandBarData.barType}}</span>\n" +
    "\n" +
    "\n" +
    "    </span>\n" +
    "    <br />\n" +
    "    <br />\n" +
    "    <span>\n" +
    "        <button ng-click=\"cbDevCtrl.addButton()\"> Add Button</button>\n" +
    "\n" +
    "\n" +
    "    </span>\n" +
    "    <br />\n" +
    "    <br />\n" +
    "    <span>Toggle Visibility:</span>\n" +
    "    <div ng-repeat=\"command in cbDevCtrl.commandBarData.bar\">\n" +
    "\n" +
    "        <div ng-switch=\"command.type\">\n" +
    "\n" +
    "            <div ng-switch-when=\"Command\">\n" +
    "                <button ng-click=\"command.visibility = !command.visibility\"> {{command.name}}: {{command.visibility}}</button>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-when=\"Sep\">\n" +
    "                <!-- Separator button -->\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-when=\"Group\">\n" +
    "                <!-- Group Button button -->\n" +
    "                <div ng-repeat=\"subcommand in command.group\">\n" +
    "\n" +
    "                    <div ng-switch=\"subcommand.type\">\n" +
    "\n" +
    "                        <div ng-switch-when=\"Command\">\n" +
    "                            <button ng-click=\"subcommand.visibility = !subcommand.visibility\">{{command.name}}/{{subcommand.name}}: {{subcommand.visibility}}</button>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-when=\"Sep\">\n" +
    "                            <!-- Separator button -->\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-switch-default>\n" +
    "                            Unknown sub command type: Allowed values are \"Command\" or \"Sep\"\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-default>\n" +
    "                Unknown sub command type: Allowed values are \"Command\", \"Group\" or \"Sep\"\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--</div>\n" +
    "    </div>-->\n" +
    "</div>");
}]);

angular.module("common/widgets/commandBar/samples/command-bar-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/commandBar/samples/command-bar-dev.html",
    "<!DOCTYPE html>\n" +
    "<html data-ng-app=\"siemens.simaticit.app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Command Bar Development</title>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "    <link href=\"/common/styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "    <style>\n" +
    "        html, body {\n" +
    "            width: '100%';\n" +
    "            height: '100%';\n" +
    "        }\n" +
    "\n" +
    "        #test-container {\n" +
    "            border: 2px solid black;\n" +
    "            padding: 4px;\n" +
    "            margin: 4px;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"CommandBarDevController as cbDevCtrl\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <input type=\"checkbox\" ng-model=\"useColors\" ng-change=\"changeColors()\" /> Use Colors\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\" ng-style=\"redStyle\">\n" +
    "            <div class=\"col-md-20 col-xs-20 col-lg-20 col-sm-20\"></div>\n" +
    "            <div class=\"col-md-20 col-xs-20 col-lg-20 col-sm-20\" ng-style=\"yellowStyle\">\n" +
    "                <sit-command-bar sit-commands=\"cbDevCtrl.commandBarData\" on-click=\"cbDevCtrl.commandBarClick(clickedCommand)\"></sit-command-bar>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            TEST\n" +
    "        </div>\n" +
    "\n" +
    "        <br />\n" +
    "\n" +
    "        <div style=\"width:100%; height: 150px; overflow:auto;\">\n" +
    "            <strong>Notifications</strong><br />\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"event in events\">{{event}}</li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <br />\n" +
    "        <span>\n" +
    "            <button ng-click=\"cbDevCtrl.switchMode(cbDevCtrl.commandBarData)\"> Switch mode</button>\n" +
    "            <span> mode : {{cbDevCtrl.commandBarData.barType}}</span>\n" +
    "\n" +
    "\n" +
    "        </span>\n" +
    "        <br />\n" +
    "        <br />\n" +
    "        <span>\n" +
    "            <button ng-click=\"cbDevCtrl.addButton()\"> Add Button</button>\n" +
    "\n" +
    "\n" +
    "        </span>\n" +
    "        <br />\n" +
    "        <br />\n" +
    "        <span>Toggle Visibility:</span>\n" +
    "        <div ng-repeat=\"command in cbDevCtrl.commandBarData.bar\">\n" +
    "\n" +
    "            <div ng-switch=\"command.type\">\n" +
    "\n" +
    "                <div ng-switch-when=\"Command\">\n" +
    "                    <button ng-click=\"command.visibility = !command.visibility\"> {{command.name}}: {{command.visibility}}</button>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-switch-when=\"Sep\">\n" +
    "                    <!-- Separator button -->\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-switch-when=\"Group\">\n" +
    "                    <!-- Group Button button -->\n" +
    "                    <div ng-repeat=\"subcommand in command.group\">\n" +
    "\n" +
    "                        <div ng-switch=\"subcommand.type\">\n" +
    "\n" +
    "                            <div ng-switch-when=\"Command\">\n" +
    "                                <button ng-click=\"subcommand.visibility = !subcommand.visibility\">{{command.name}}/{{subcommand.name}}: {{subcommand.visibility}}</button>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div ng-switch-when=\"Sep\">\n" +
    "                                <!-- Separator button -->\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div ng-switch-default>\n" +
    "                                Unknown sub command type: Allowed values are \"Command\" or \"Sep\"\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-switch-default>\n" +
    "                    Unknown sub command type: Allowed values are \"Command\", \"Group\" or \"Sep\"\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <!-- Vendor Scripts -->\n" +
    "    <script src=\"/common/scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-animate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-route.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-sanitize.js\"></script>\n" +
    "    <script src=\"/common/scripts/bootstrap.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui-router.js\"></script>\n" +
    "\n" +
    "    <!-- Bootstrapping -->\n" +
    "    <script src=\"/common/widgets/commandBar/samples/command-bar-dev-app.js\"></script>\n" +
    "\n" +
    "    <!-- Test Data -->\n" +
    "    <script src=\"/common/widgets/commandBar/samples/command-bar-test-data.js\"></script>\n" +
    "\n" +
    "    <!-- command bar Widget scripts -->\n" +
    "    <script src=\"/common/widgets/commandBar/sit-command-bar-mod.js\"></script>\n" +
    "    <script src=\"/common/widgets/commandBar/sit-command-bar-dir.js\"></script>\n" +
    "    <script src=\"/common/widgets/commandBar/sit-command-dir.js\"></script>\n" +
    "    <script src=\"/common/widgets/commandBar/sit-command-group-dir.js\"></script>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>");
}]);

angular.module("common/widgets/commandBar/samples/commandbar-dev-view.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/commandBar/samples/commandbar-dev-view.html",
    "<div  \n" +
    "     style=\"margin-left:50px; text-align: left;  vertical-align: top; \">\n" +
    "    <ng-include src=\"'/app/common/widgets/commandBar/docs/command-bar-dev-tpl.html'\" />\n" +
    "</div>");
}]);

angular.module("common/widgets/component/samples/swac/index.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/component/samples/swac/index.html",
    "<!DOCTYPE html>\n" +
    "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
    "<head>\n" +
    "    <title>SWAC Chat Messenger</title>\n" +
    "           \n" +
    "    <script src=\"../../../../scripts/jquery-2.1.1.min.js\"></script>\n" +
    "    \n" +
    "    <script src=\"../../../../scripts/angular/angular.min.js\"></script>    \n" +
    "    <script src=\"../../../../scripts/swac/swac-base.js\"></script>    \n" +
    "    <script src=\"../../../../scripts/swac/swac-boot.js\"></script>\n" +
    "\n" +
    "    <script src=\"swac-dev-app.js\"></script>\n" +
    "    <script src=\"Directives/swac-dev-scroll-down-directive.js\"></script>\n" +
    "    <script src=\"Services/swac-dev-swac-component-service.js\"></script>\n" +
    "    <script src=\"Services/swac-dev-chat-messenger-service.js\"></script>\n" +
    "    <script src=\"Controllers/swac-dev-chat-messenger-controller.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "<body style=\"background-color: lightgray\">\n" +
    "    <div id=\"appDivContainer\" ng-app=\"chatApp\" ng-controller=\"chatMessengerCtrl\">\n" +
    "            <div>\n" +
    "                Messenger Name:\n" +
    "                <input type=\"text\" ng-model=\"messengerName\" placeholder=\"Enter Name\"/>\n" +
    "            </div>\n" +
    "            <div scroll-down style=\"overflow:auto; height:300px; width:400px;background-color:white; border:1px solid; line-height:25px;\">\n" +
    "                <div ng-repeat=\"chat in chatRecieved\">\n" +
    "                    {{chat.sender}}: {{chat.message}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div>\n" +
    "                Message: <input type=\"text\" ng-model=\"chatToSend\" ng-keypress=\"onKeyPress($event)\" size=\"32\" />\n" +
    "                <button ng-click=\"sendChat()\">Send</button>\n" +
    "            </div>\n" +
    "    </div>\n" +
    "</body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("common/widgets/component/samples/test.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/component/samples/test.html",
    "<!DOCTYPE html>\n" +
    "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
    "<head>\n" +
    "    <title>Mashup Runtime</title>\n" +
    "    <script src=\"../../../scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular/angular.min.js\"></script>\n" +
    "    <script src=\"../../../scripts/swac/swac-base.js\"></script>\n" +
    "    <script src=\"../../../scripts/swac/swac-container.js\"></script>\n" +
    "\n" +
    "    <script src=\"app.js\"></script>\n" +
    "    <script src=\"../uy-swac-module.js\"></script>\n" +
    "    <script src=\"../sit-container-dir.js\"></script>\n" +
    "    <script src=\"../uy-element-directive.js\"></script>\n" +
    "    <script src=\"../sit-wire-dir.js\"></script>\n" +
    "    <script src=\"../../../services/swac/sit-swac-component-svc.js\"></script>\n" +
    "    <script src=\"../../../services/swac/sit-swac-container-svc.js\"></script>\n" +
    "    <script src=\"../../../services/swac/sit-ui-component-svc.js\"></script>\n" +
    "    <script src=\"ui/scroll-down.js\"></script>\n" +
    "    <script src=\"ui/chatMessenger.js\"></script>\n" +
    "    <script src=\"ui/chatMessengerCtrl.js\"></script>\n" +
    "    <script src=\"mashupWireController.js\"></script>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <div ng-app=\"myApp\" style=\"position:relative;width:100%;height:900px;\">\n" +
    "        <uy-container create=\"20000\" internal=\"20000\" functions=\"20000\" events=\"20000\" ng-controller=\"mashupWireController as mashup\" isswac=\"true\">\n" +
    "            <uy-element name=\"SWAC_Messenger1\" type=\"swac\" source=\"swac/index.html\" left=\"0\" top=\"1\" width=\"3\" height=\"6\" flavor=\"ui\"></uy-element>\n" +
    "            <uy-element name=\"messenger2\" type=\"ui\" source=\"chat-messenger\" componenttype=\"ui\" left=\"4\" top=\"3\" width=\"3\" height=\"6\" flavor=\"ui\"></uy-element>\n" +
    "            <uy-element name=\"messenger3\" type=\"ui\" source=\"chat-messenger\" componenttype=\"ui\" left=\"8\" top=\"2\" width=\"3\" height=\"6\" flavor=\"ui\"></uy-element>\n" +
    "\n" +
    "            <uy-wire name=\"wire1\" inputcomponents=\"messenger3\" inputevents=\"newMessageTyped\" outputcomponents=\"messenger2\" outputapis=\"getChatMessage\" converters=\"mashup.Wire1Converters\" inputtypes=\"ui\" outputtypes=\"ui\"></uy-wire>\n" +
    "            <uy-wire name=\"wire3\" inputcomponents=\"SWAC_Messenger1\" inputevents=\"newMessageTyped\" outputcomponents=\"messenger2,messenger3\" outputapis=\"getChatMessage,getChatMessage\" converters=\"mashup.Wire3Converters\" inputtypes=\"swac\" outputtypes=\"ui,ui\"></uy-wire>\n" +
    "        </uy-container>\n" +
    "    </div>\n" +
    "</body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("common/widgets/component/samples/ui/chatMessenger.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/component/samples/ui/chatMessenger.html",
    "<div>\n" +
    "    Messenger Name:\n" +
    "    <input type=\"text\" ng-model=\"messengerName\" placeholder=\"Enter Name\"/>\n" +
    "</div>\n" +
    "<div scroll-down style=\"overflow:auto; height:300px; width:400px;background-color:white; border:1px solid; line-height:25px;\">\n" +
    "    <div ng-repeat=\"chat in chatRecieved\">\n" +
    "        {{chat.sender}}: {{chat.message}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div>\n" +
    "    Message: <input type=\"text\" ng-model=\"chatToSend\" ng-keypress=\"onKeyPress($event)\" size=\"32\" />\n" +
    "    <button ng-click=\"sendChat()\">Send</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/datePicker/date-picker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/datePicker/date-picker.html",
    "<div class=\"property-grid-input-group\">\n" +
    "    <div ng-if=\"datepickerCtrl.readOnly || datepickerCtrl.ngReadonly\" class=\"label-property-grid-control-readonly property-value-ellipsis\"> {{datepickerCtrl.value | date: 'shortDate'}} </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<ng-form ng-if=\"!(datepickerCtrl.readOnly || datepickerCtrl.ngReadonly)\" name='datepickerForm' ng-class=\"{'isrequired' : (datepickerCtrl.validation.required) && (datepickerCtrl.value===undefined) }\">\n" +
    "    <div class=\"property-grid-input-group\" style=\"border:0;\">\n" +
    "        <input type=\"text\"               \n" +
    "               class=\"property-grid-control validator-control\" \n" +
    "               ng-click=\"datepickerCtrl.open($event)\"\n" +
    "               ng-class='((datepickerForm.$invalid && datepickerForm.$dirty) || (datepickerForm.$invalid && datepickerForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               uib-datepicker-popup=\"{{datepickerCtrl.format}}\"\n" +
    "               ng-model=\"datepickerCtrl.value\"\n" +
    "               is-open=\"datepickerCtrl.opened\"\n" +
    "               close-text=\"Close\"\n" +
    "               datepicker-options=\"datepickerCtrl.dateOptions\"\n" +
    "               ng-required=\"datepickerCtrl.validation.required\"\n" +
    "               show-button-bar=\"datepickerCtrl.showButtonBar\"\n" +
    "               style=\"cursor:pointer;\"\n" +
    "               datepicker-append-to-body=\"datepickerCtrl.appendToBody\"\n" +
    "               ng-blur=\"datepickerCtrl.ngBlur()\"\n" +
    "               sit-change=\"datepickerCtrl.sitChange\"\n" +
    "               ng-disabled=\"datepickerCtrl.ngDisabled\"\n" +
    "               ng-focus=\"datepickerCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator readonly=\"readonly\" />\n" +
    "        <div class=\"btn property-grid-addon-icon\" ng-click=\"datepickerCtrl.open($event)\" ng-disabled=\"datepickerCtrl.ngDisabled\">\n" +
    "            <i class=\"fa fa-calendar\" ng-disabled=\"datepickerCtrl.ngDisabled\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/dateTimePicker/date-time-picker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dateTimePicker/date-time-picker.html",
    "<div class=\"property-grid-input-group\">\n" +
    "    <div class=\"label label-property-grid-control-readonly property-value-ellipsis\" ng-if=\"dateTimePickerCtrl.readOnly || dateTimePickerCtrl.ngReadonly\">\n" +
    "        {{dateTimePickerCtrl.value | date: 'short'}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<ng-form name='dateTimePickerForm' ng-if=\"!(dateTimePickerCtrl.readOnly || dateTimePickerCtrl.ngReadonly)\"\n" +
    "         ng-class=\"{'isrequired' : (dateTimePickerCtrl.validation.required) && (dateTimePickerCtrl.value===undefined)}\">\n" +
    "    <div class=\"property-grid-input-group\">\n" +
    "        <div class=\"property-grid-input-group\">\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"property-grid-control validator-control date-time-input-hover\"\n" +
    "                   ng-model=\"dateTimePickerCtrl.value\"\n" +
    "                   uib-datepicker-popup=\"{{dateTimePickerCtrl.format}}\"\n" +
    "                   ng-class=\"((dateTimePickerForm.$invalid && dateTimePickerForm.$dirty) || (dateTimePickerForm.$invalid && dateTimePickerForm.$visited)) ? 'validator-control-invalid' : 'validator-control'\"\n" +
    "                   ng-click=\"dateTimePickerCtrl.clicked()\"\n" +
    "                   ng-keydown=\"dateTimePickerCtrl.keydownPressed($event)\"\n" +
    "                   ng-disabled=\"dateTimePickerCtrl.ngDisabled\"\n" +
    "                   ng-blur=\"dateTimePickerCtrl.ngBlur()\"\n" +
    "                   ng-focus=\"dateTimePickerCtrl.ngFocus()\"\n" +
    "                   ng-required=\"dateTimePickerCtrl.validation.required\"\n" +
    "                   sit-change=\"dateTimePickerCtrl.sitChange\"\n" +
    "                   sit-form-input-validator\n" +
    "                   readonly=\"readonly\" />\n" +
    "            <div class=\"btn property-grid-addon-icon\" ng-click=\"dateTimePickerCtrl.ngDisabled || dateTimePickerCtrl.clicked()\" ng-disabled=\"dateTimePickerCtrl.ngDisabled\">\n" +
    "                <i class=\"fa fa-calendar\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"dropdown-menu\" ng-style=\"{display: (dateTimePickerCtrl.isOpen && 'block') || 'none'}\">\n" +
    "            <div class=\"date-time-icon\">\n" +
    "                <button type=\"button\" class=\"date-time-icon-btn\" ng-click=\"dateTimePickerCtrl.switchDateTimePicker()\"><i ng-class=\"dateTimePickerCtrl.isCollapsed ? 'fa fa-clock-o fa-lg' : 'fa fa-calendar-o fa-lg' \"></i></button>\n" +
    "            </div>\n" +
    "\n" +
    "            <div id=\"datepicker\" sit-data-internal-type=\"datepicker\" uib-collapse=\"!dateTimePickerCtrl.isCollapsed\">\n" +
    "                <div uib-datepicker ng-model=\"dateTimePickerCtrl.value\" datepicker-options=\"dateTimePickerCtrl.dateOptions\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div id=\"timepicker\" sit-data-internal-type=\"timepicker\" uib-collapse=\"dateTimePickerCtrl.isCollapsed\">\n" +
    "                <div uib-timepicker ng-model=\"dateTimePickerCtrl.value\" show-seconds=\"dateTimePickerCtrl.showSeconds\" show-meridian=\"dateTimePickerCtrl.showMeridian\" class=\"time-picker-centered\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"uib-button-bar\" ng-class=\"{'pull-center' : !dateTimePickerCtrl.showButtonBar}\">\n" +
    "                <span class=\"pull-left btn-group\" ng-show=\"dateTimePickerCtrl.showButtonBar\">\n" +
    "                    <button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"dateTimePickerCtrl.today()\">{{dateTimePickerCtrl.buttonLabel}}</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"dateTimePickerCtrl.clear()\">{{dateTimePickerCtrl.clearLabel}}</button>\n" +
    "                </span>\n" +
    "                <button type=\"button\" ng-class=\"{'pull-right' : dateTimePickerCtrl.showButtonBar}\" class=\"btn btn-sm btn-success\" ng-click=\"dateTimePickerCtrl.close()\">{{dateTimePickerCtrl.closeLabel}}</button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>\n" +
    "");
}]);

angular.module("common/widgets/dialog/dialog.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialog/dialog.html",
    "<div class=\"modal dialog-modal\" id={{Dialog.modalid}} tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" data-backdrop=\"static\">\n" +
    "    <!--[Fix]Bug - 8894. The duplicate template code is the fix for slow dialog rendering in IE.-->\n" +
    "    <div class=\"modal-dialog dialog-dialog dialog-dialog-centered\" ng-if=\"Dialog.positioning == 'centered'\">\n" +
    "        <div data-internal-type=\"input-dialog-border\" class=\"dialog-dialogborder\">\n" +
    "            <div data-internal-type=\"input-dialog-content\" class=\"dialog-content\">\n" +
    "                <div data-internal-type=\"input-dialog-header\" class=\"dialog-header\">\n" +
    "                    {{Dialog.dialogTitle}}\n" +
    "                </div>\n" +
    "                <div data-internal-type=\"input-dialog-body\" class=\"dialog-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"dialog-body-overflow\">\n" +
    "                            <ng-include id=\"{{Dialog.modalid}}-includeTemplate\" ng-if=\"Dialog.dialogTemplate\" src=\"Dialog.dialogTemplate\"> </ng-include>\n" +
    "                            <div ng-if=\"!Dialog.dialogTemplate\">\n" +
    "                                <div class=\"dialog-information-{{Dialog.templatedata.layout}}\" ng-if=\"Dialog.templatedata.information\">\n" +
    "                                    <div ng-bind-html=\"Dialog.templatedata.information\"></div>\n" +
    "                                </div>\n" +
    "                                <div class=\"row\">\n" +
    "                                    <sit-property-grid sit-id=\"{{Dialog.modalid}}_dialog_property_grid\"\n" +
    "                                                       sit-data=\"Dialog.templatedata.data\"\n" +
    "                                                       sit-layout=\"{{Dialog.templatedata.layout}}\"\n" +
    "                                                       sit-type=\"Fixed\"\n" +
    "                                                       sit-mode=\"{{Dialog.templatedata.mode ? Dialog.templatedata.mode : 'edit'}}\"\n" +
    "                                                       sit-columns=\"1\">\n" +
    "                                    </sit-property-grid>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"dialog-alert-container-{{Dialog.templatedata.layout}}\" ng-hide=\"Dialog.isValid.value\">\n" +
    "                            <div class=\"alert alert-warning dialog-alert\">\n" +
    "                                <i class=\"fa fa-warning \"></i>\n" +
    "                                <span class=\"alert-title\">{{'dialog.validator.warningTitle'|translate}} </span>\n" +
    "                                {{'dialog.validator.warningMessage'|translate}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div data-internal-type=\"input-dialog-footer\" class=\"dialog-footer\">\n" +
    "                    <div class=\"dialog-div-button\" ng-repeat=\"button in Dialog.buttons\">\n" +
    "                        <sit-dialog-button sit-button=\"button\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div><!-- /.modal-content -->\n" +
    "        </div><!-- /.modal-dialog -->\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-dialog dialog-dialog dialog-dialog-notcentered\" ng-if=\"Dialog.positioning == 'notcentered'\">\n" +
    "        <div data-internal-type=\"input-dialog-border\" class=\"dialog-dialogborder\">\n" +
    "            <div data-internal-type=\"input-dialog-content\" class=\"dialog-content\">\n" +
    "                <div data-internal-type=\"input-dialog-header\" class=\"dialog-header\">\n" +
    "                    {{Dialog.dialogTitle}}\n" +
    "                </div>\n" +
    "                <div data-internal-type=\"input-dialog-body\" class=\"dialog-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"dialog-body-overflow\">\n" +
    "                            <ng-include id=\"{{Dialog.modalid}}-includeTemplate\" ng-if=\"Dialog.dialogTemplate\" src=\"Dialog.dialogTemplate\"> </ng-include>\n" +
    "                            <div ng-if=\"!Dialog.dialogTemplate\">\n" +
    "                                <div class=\"dialog-information-{{Dialog.templatedata.layout}}\" ng-if=\"Dialog.templatedata.information\">\n" +
    "                                    <div ng-bind-html=\"Dialog.templatedata.information\"></div>\n" +
    "                                </div>\n" +
    "                                <div class=\"row\">\n" +
    "                                    <sit-property-grid sit-id=\"{{Dialog.modalid}}_dialog_property_grid\"\n" +
    "                                                       sit-data=\"Dialog.templatedata.data\"\n" +
    "                                                       sit-layout=\"{{Dialog.templatedata.layout}}\"\n" +
    "                                                       sit-type=\"Fixed\"\n" +
    "                                                       sit-mode=\"{{Dialog.templatedata.mode ? Dialog.templatedata.mode : 'edit'}}\"\n" +
    "                                                       sit-columns=\"1\">\n" +
    "                                    </sit-property-grid>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"dialog-alert-container-{{Dialog.templatedata.layout}}\" ng-hide=\"Dialog.isValid.value\">\n" +
    "                            <div class=\"alert alert-warning dialog-alert\">\n" +
    "                                <i class=\"fa fa-warning \"></i>\n" +
    "                                <span class=\"alert-title\">{{'dialog.validator.warningTitle'|translate}} </span>\n" +
    "                                {{'dialog.validator.warningMessage'|translate}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div data-internal-type=\"input-dialog-footer\" class=\"dialog-footer\">\n" +
    "                    <div class=\"dialog-div-button\" ng-repeat=\"button in Dialog.buttons\">\n" +
    "                        <sit-dialog-button sit-button=\"button\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div><!-- /.modal-content -->\n" +
    "        </div><!-- /.modal-dialog -->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/dialog/samples/dialog-dev-popup1-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialog/samples/dialog-dev-popup1-template.html",
    "<div class=\"row\" style=\"width:500px\">\n" +
    "   \n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"test-container\">\n" +
    "            <sit-property-grid sit-id=\"MyID\"\n" +
    "                               sit-data=\"templatedata\"\n" +
    "                               sit-layout=\"'Vertical'\"\n" +
    "                               sit-mode=\"edit\"></sit-property-grid>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/dialog/samples/dialog-dev-popup2-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialog/samples/dialog-dev-popup2-template.html",
    "<div class=\"row\" style=\"width:auto\">\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div id=\"test-container\">\n" +
    "\n" +
    "            <sit-property-grid sit-id=\"dialogPopup2\"\n" +
    "                               sit-data=\"Dialog.templatedata\"\n" +
    "                               sit-layout=\"'Horizontal'\"\n" +
    "                               sit-type=\"'Fixed'\"\n" +
    "                               sit-mode=\"edit\"\n" +
    "                               sit-columns=\"'1'\">\n" +
    "\n" +
    "            </sit-property-grid>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/dialog/samples/dialog-dev-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialog/samples/dialog-dev-tpl.html",
    "<div ng-controller=\"DialogDevController as dDevCtrl\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div>\n" +
    "            Vertical : <input type=\"checkbox\" ng-model=\"dialoglayout\" ng-init=\"dialoglayout=true\" />\n" +
    "            \n" +
    "        </div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <button id=\"buttonTest\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup1()\" >\n" +
    "            Launch modal 1\n" +
    "        </button>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <button id=\"buttonTestCenter\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup1Center()\" >\n" +
    "            Launch modal 1 centered\n" +
    "        </button>\n" +
    "        <button id=\"buttonTest2\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup2()\" >\n" +
    "            Launch modal 2\n" +
    "        </button>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <button id=\"buttonTestCenter2\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup2Center()\" >\n" +
    "            Launch modal 2 centered\n" +
    "        </button>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <sit-dialog sit-title=\"dDevCtrl.dialogVerticalDataTitle\"\n" +
    "                    sit-templatedata='dDevCtrl.dialogVerticalData'\n" +
    "                    sit-modalid=\"popup1\"\n" +
    "                    sit-buttons='dDevCtrl.buttonsList'>\n" +
    "\n" +
    "        </sit-dialog>\n" +
    "        <sit-dialog sit-title=\"dDevCtrl.dialogHorizontalDataTitle\"\n" +
    "                    sit-templatedata='dDevCtrl.dialogHorizontalData'\n" +
    "                    sit-modalid=\"popup3\"\n" +
    "                    sit-buttons='dDevCtrl.buttonsList'>\n" +
    "\n" +
    "        </sit-dialog>\n" +
    "        <sit-dialog sit-title=\"dDevCtrl.dialogDataTitle\"\n" +
    "                    sit-templatedata='dDevCtrl.dialogData'\n" +
    "                    sit-templateuri=\"dDevCtrl.dialogDataTemplateUri\"\n" +
    "                    sit-modalid=\"popup2\"\n" +
    "                    sit-buttons='dDevCtrl.buttonsList'>\n" +
    "\n" +
    "        </sit-dialog>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/dialog/samples/dialog-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialog/samples/dialog-dev.html",
    "<!DOCTYPE html>\n" +
    "<html data-ng-app=\"siemens.simaticit.app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Dialog popup Development</title>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "    <link href=\"/common/styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "    <style>\n" +
    "        html, body {\n" +
    "            width: '100%';\n" +
    "            height: '100%';\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"DialogDevController as dDevCtrl\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div>\n" +
    "            Vertical : <input type=\"checkbox\" ng-model=\"dialoglayout\" ng-init=\"dialoglayout=true\" />\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <button id=\"buttonTest\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup1()\">\n" +
    "            Launch modal 1\n" +
    "        </button>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <button id=\"buttonTestCenter\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup1Center()\">\n" +
    "            Launch modal 1 centered\n" +
    "        </button>\n" +
    "        <button id=\"buttonTest2\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup2()\">\n" +
    "            Launch modal 2\n" +
    "        </button>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <button id=\"buttonTestCenter2\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup2Center()\">\n" +
    "            Launch modal 2 centered\n" +
    "        </button>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <sit-dialog sit-title=\"dDevCtrl.dialogVerticalDataTitle\"\n" +
    "                    sit-templatedata='dDevCtrl.dialogVerticalData'\n" +
    "                    sit-modalid=\"popup1\"\n" +
    "                    sit-buttons='dDevCtrl.buttonsList'>\n" +
    "\n" +
    "        </sit-dialog>\n" +
    "        <sit-dialog sit-title=\"dDevCtrl.dialogHorizontalDataTitle\"\n" +
    "                    sit-templatedata='dDevCtrl.dialogHorizontalData'\n" +
    "                    sit-modalid=\"popup3\"\n" +
    "                    sit-buttons='dDevCtrl.buttonsList'>\n" +
    "\n" +
    "        </sit-dialog>\n" +
    "        <sit-dialog sit-title=\"dDevCtrl.dialogDataTitle\"\n" +
    "                    sit-templatedata='dDevCtrl.dialogData'\n" +
    "                    sit-templateuri=\"dialog-dev-popup2-template.html\"\n" +
    "                    sit-modalid=\"popup2\"\n" +
    "                    sit-buttons='dDevCtrl.buttonsList'>\n" +
    "\n" +
    "        </sit-dialog>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Vendor Scripts -->\n" +
    "    <script src=\"/common/scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-animate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-route.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-sanitize.js\"></script>\n" +
    "    <script src=\"/common/scripts/bootstrap.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui-router.js\"></script>\n" +
    "\n" +
    "\n" +
    "    <script src=\"/common/scripts/angular-translate/translate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/default-interpolation.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/handler-log.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/loader-static-files.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/loader-partial.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/storage-key.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/storage-local.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/storage-cookie.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/translate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/directive/translate-cloak.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/directive/translate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/filter/translate.js\"></script>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!-- Property Grid Widget scripts -->\n" +
    "    <script src=\"/common/widgets/propertyGrid/sit-property-grid-module.js\"></script>\n" +
    "    <script src=\"/common/widgets/propertyGrid/sit-property-grid-service.js\"></script>\n" +
    "    <script src=\"/common/widgets/propertyGrid/sit-property-grid-directive.js\"></script>\n" +
    "    <script src=\"/common/widgets/propertyGrid/sit-property-grid-fixed-directive.js\"></script>\n" +
    "    <script src=\"/common/widgets/propertyGrid/sit-property-grid-fluid-directive.js\"></script>\n" +
    "    <script src=\"/common/widgets/propertyGrid/sit-property-grid-vertical-directive.js\"></script>\n" +
    "\n" +
    "\n" +
    "    <!-- dialog button Widget scripts -->\n" +
    "    <script src=\"/common/widgets/dialogButton/sit-dialog-button-mod.js\"></script>\n" +
    "    <script src=\"/common/widgets/dialogButton/sit-dialog-button-dir.js\"></script>\n" +
    "\n" +
    "    <!-- Bootstrapping -->\n" +
    "    <script src=\"/common/widgets/dialog/samples/dialog-dev-app.js\"></script>\n" +
    "\n" +
    "    <!-- Test Data -->\n" +
    "    <script src=\"/common/widgets/dialog/samples/dialog-test-data.js\"></script>\n" +
    "\n" +
    "    <!-- Dialog Widget scripts -->\n" +
    "    <script src=\"/common/widgets/dialog/sit-dialog-mod.js\"></script>\n" +
    "    <script src=\"/common/widgets/dialog/sit-dialog-svc.js\"></script>\n" +
    "    <script src=\"/common/widgets/dialog/sit-dialog-dir.js\"></script>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>");
}]);

angular.module("common/widgets/dialogButton/dialogButton.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialogButton/dialogButton.html",
    "<button id={{dialogButtonCtrl.button.id}} class=\"btn btn-default dialogButton\" ng-click=\"dialogButtonCtrl.button.onClickCallback()\" ng-disabled=\"dialogButtonCtrl.button.disabled\">\n" +
    "    {{dialogButtonCtrl.button.displayName}}\n" +
    "</button>\n" +
    "");
}]);

angular.module("common/widgets/dialogButton/samples/dialog-button-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/dialogButton/samples/dialog-button-dev.html",
    "<!DOCTYPE html>\n" +
    "<html data-ng-app=\"app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Dialog Button Development</title>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "\n" +
    "    <link href=\"/common/styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "    <style>\n" +
    "        html, body {\n" +
    "            overflow: auto !important;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"dialogButtonDevController\">\n" +
    "\n" +
    "    <!-- UI-ROUTER EXAMPLE -->\n" +
    "    <div>\n" +
    "        <p>Test Dialog Button 2</p>\n" +
    "        <sit-dialog-button sit-button=\"myButton\" />\n" +
    "\n" +
    "    </div>\n" +
    "    <!-- END UI-ROUTER EXAMPLE -->\n" +
    "    <!-- Vendor Scripts -->\n" +
    "    <script src=\"/scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular-animate.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular-route.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular-sanitize.js\"></script>\n" +
    "    <script src=\"/scripts/bootstrap.js\"></script>\n" +
    "    <script src=\"/scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "    <script src=\"/scripts/angular-ui-router.js\"></script>\n" +
    "\n" +
    "    <!-- Bootstrapping -->\n" +
    "    <script src=\"dialog-button-dev-app.js\"></script>\n" +
    "\n" +
    "    <!-- Test Data -->\n" +
    "    <!-- Flyout Widget scripts -->\n" +
    "    <script src=\"../sit-dialog-button-mod.js\"></script>\n" +
    "    <script src=\"../sit-dialog-button-dir.js\"></script>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>");
}]);

angular.module("common/widgets/email/email.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/email/email.html",
    "<div ng-if=\"emailCtrl.readOnly || emailCtrl.ngReadonly\" class=\"label label-property-grid-control-readonly property-value-ellipsis\"> {{emailCtrl.value}} </div>\n" +
    "\n" +
    "<ng-form ng-if=\"!(emailCtrl.readOnly || emailCtrl.ngReadonly)\" name='emailForm' ng-class=\"{'isrequired' : (emailCtrl.validation.required) && emailCtrl.value===undefined}\">\n" +
    "    <div class='property-grid-input-group'>\n" +
    "        <input type='email'\n" +
    "               name='{{emailCtrl.value}}'\n" +
    "               ng-class='((emailForm.$invalid && emailForm.$dirty) || (emailForm.$invalid && emailForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               ng-model='emailCtrl.value'\n" +
    "               ng-required='emailCtrl.validation.required'\n" +
    "               ng-minlength='emailCtrl.validation.minlength'\n" +
    "               ng-maxlength='emailCtrl.validation.maxlength'\n" +
    "               ng-pattern='emailCtrl.validation.pattern'\n" +
    "               sit-form-input-validator\n" +
    "               ng-blur=\"emailCtrl.ngBlur()\"\n" +
    "               sit-change=\"emailCtrl.sitChange\"\n" +
    "               ng-disabled=\"emailCtrl.ngDisabled\"\n" +
    "               ng-focus=\"emailCtrl.ngFocus()\" />\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/entityPicker/entityPicker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/entityPicker/entityPicker.html",
    "<div ng-if=\"entityPickerCtrl.readOnly || entityPickerCtrl.ngReadonly\" class=\"label-property-grid-control-readonly property-value-ellipsis\"> {{entityPickerCtrl.value.name}} </div>\n" +
    "<ng-form name=\"entityPickerForm\" ng-if=\"!(entityPickerCtrl.readOnly || entityPickerCtrl.ngReadonly)\" ng-class=\"{'isrequired' : (entityPickerCtrl.validation.required) && entityPickerCtrl.value===undefined}\">\n" +
    "    <div data-internal-type=\"entity-picker-container\" id=\"entity-picker-container\" class=\"property-grid-input-group entity-picker-container\">\n" +
    "         <div style=\"display:inline-block;width:100%;\">            \n" +
    "             <input ng-required=\"entityPickerCtrl.required\"\n" +
    "                    ng-attr-id=\"{{entityPickerCtrl.id ? entityPickerCtrl.id + '.typeahead' : undefined}}\"\n" +
    "                    type=\"text\" ng-model=\"entityPickerCtrl.value\"\n" +
    "                    placeholder={{entityPickerCtrl.placeholder}}\n" +
    "                    class=\"entityPicker-control\"\n" +
    "                    uib-typeahead=\"entity as entity[entityPickerCtrl.selectedAttributeToDisplay] for entity in entityPickerCtrl.datasource  | filter:$viewValue | limitTo:entityPickerCtrl.limit\"\n" +
    "                    typeahead-template-url={{entityPickerCtrl.templateUrl}}\n" +
    "                    typeahead-editable=entityPickerCtrl.editable\n" +
    "                    sit-form-input-validator=\"{{entityPickerCtrl.label}}\"\n" +
    "                    typeahead-on-select='entityPickerCtrl.onSelect($item, $model, $label)'\n" +
    "                    ng-class='((entityPickerForm.$invalid && entityPickerForm.$dirty) || (entityPickerForm.$invalid && entityPickerForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "                    ng-blur=\"entityPickerCtrl.ngBlur()\"\n" +
    "                    sit-change=\"entityPickerCtrl.sitChange\"\n" +
    "                    ng-disabled=\"entityPickerCtrl.ngDisabled\"\n" +
    "                    ng-focus=\"entityPickerCtrl.ngFocus()\"\n" +
    "                    autocomplete=\"off\"\n" +
    "                    ng-change=\"entityPickerCtrl.setDropDownHeight()\" />                        \n" +
    "            </div>\n" +
    "        <div class=\"btn property-grid-addon-icon\" ng-click=\"entityPickerCtrl.ngDisabled || entityPickerCtrl.showPopup()\" ng-hide=\"!entityPickerCtrl.sitoption\" ng-disabled=\"entityPickerCtrl.ngDisabled\">\n" +
    "            <i class=\"fa fa-ellipsis-h fa-1x\" ng-hide=\"!entityPickerCtrl.sitoption\" ng-disabled=\"entityPickerCtrl.ngDisabled\"></i>\n" +
    "        </div>\n" +
    "    </div>    \n" +
    "</ng-form>\n" +
    "");
}]);

angular.module("common/widgets/entityPicker/popup-default-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/entityPicker/popup-default-template.html",
    "<div class=\"entity-picker-popup\">\n" +
    "    <sit-item-collection-viewer id=\"{{Dialog.modalid}}-item-colletion-viewer\" sit-data=\"Dialog.templatedata.data\" sit-options=\"Dialog.templatedata.options\"></sit-item-collection-viewer>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/entityPicker/samples/entity-picker-custom-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/entityPicker/samples/entity-picker-custom-template.html",
    "<a class=\"aClass\">\n" +
    "    <div class=\"mainContainer\">\n" +
    "        <div class=\"leftContainer\">\n" +
    "            <span class=\"highlighted\" bind-html-unsafe=\"match.model.name | typeaheadHighlight:query\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"rightContainer\">\n" +
    "            <div class=\"rightRowContainer normalText\">\n" +
    "                <label> version: </label>\n" +
    "                <label bind-html-unsafe=\"match.model.version | typeaheadHighlight:query\"></label>\n" +
    "            </div>\n" +
    "            <div class=\"rightRowContainer normalText\">\n" +
    "                <label> product: </label>\n" +
    "                <label bind-html-unsafe=\"match.model.product | typeaheadHighlight:query\"></label>\n" +
    "            </div>\n" +
    "            <div class=\"rightRowContainer normalText\">\n" +
    "                <label> status: </label>\n" +
    "                <label bind-html-unsafe=\"match.model.status | typeaheadHighlight:query\"></label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</a>");
}]);

angular.module("common/widgets/entityPicker/samples/index.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/entityPicker/samples/index.html",
    "<!doctype html>\n" +
    "<html ng-app=\"app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">entityPicker Development</title>\n" +
    "    <link href=\"/common/styles/common-light.css\" rel=\"stylesheet\" />\n" +
    "</head>\n" +
    "<body>\n" +
    "    <style>\n" +
    "        .mainContainer {\n" +
    "            display: table;\n" +
    "            background-color: #eeeeee;\n" +
    "            width: 400px;\n" +
    "            height: 100px;\n" +
    "        }\n" +
    "\n" +
    "            .mainContainer:hover {\n" +
    "                border: solid;\n" +
    "                border-color: #2882a0;\n" +
    "                border-width: thin;\n" +
    "            }\n" +
    "\n" +
    "        .group {\n" +
    "            display: table-cell;\n" +
    "            text-align: center;\n" +
    "            border-style: solid;\n" +
    "            border-color: #808080;\n" +
    "            border-width: thin;\n" +
    "            width: 33%;\n" +
    "            height: 100px;\n" +
    "        }\n" +
    "\n" +
    "        .generalInfo {\n" +
    "            display: table-cell;\n" +
    "            text-align: center;\n" +
    "            vertical-align: middle;\n" +
    "            border-style: solid;\n" +
    "            border-color: #808080;\n" +
    "            border-width: thin;\n" +
    "            height: 100px;\n" +
    "        }\n" +
    "\n" +
    "        .leftContainer {\n" +
    "            display: table-cell;\n" +
    "            text-align: center;\n" +
    "            vertical-align: middle;\n" +
    "            height: 100px;\n" +
    "        }\n" +
    "\n" +
    "        .rightContainer {\n" +
    "            display: table-cell;\n" +
    "            height: 100px;\n" +
    "            padding-left: 60px;\n" +
    "        }\n" +
    "\n" +
    "        .topRightContainer {\n" +
    "            display: table-row;\n" +
    "            text-align: right;\n" +
    "            padding-bottom: 70px;\n" +
    "            table-layout: auto;\n" +
    "        }\n" +
    "\n" +
    "        .bottomRightContainer {\n" +
    "            display: table-row;\n" +
    "            text-align: right;\n" +
    "            vertical-align: bottom;\n" +
    "            height: 50%;\n" +
    "            table-layout: auto;\n" +
    "        }\n" +
    "\n" +
    "        .highlighted {\n" +
    "            font-family: 'Segoe UI';\n" +
    "            font-size: 16pt;\n" +
    "            font-weight: bold;\n" +
    "            color: #808080;\n" +
    "        }\n" +
    "\n" +
    "        .normalText {\n" +
    "            font-family: 'Segoe UI';\n" +
    "            font-size: 12pt;\n" +
    "            color: #808080;\n" +
    "        }\n" +
    "        ul {\n" +
    "            list-style-type: none;\n" +
    "            margin: 0;\n" +
    "            padding: 0;\n" +
    "        }\n" +
    "    </style>\n" +
    "    <script type=\"text/ng-template\" id=\"customTemplate.html\">\n" +
    "        <div class=\"mainContainer\">\n" +
    "            <div class=\"group\">\n" +
    "                <label class=\"normalText\">\n" +
    "                    {{match.model.product}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"generalInfo\">\n" +
    "                <div class=\"leftContainer\">\n" +
    "                    <label class=\"highlighted\">\n" +
    "                        {{match.model.name}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"rightContainer\">\n" +
    "                    <div class=\"topRightContainer\">\n" +
    "                        <label class=\"normalText\">\n" +
    "                            version: {{match.model.version}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <label class=\"normalText\">\n" +
    "                            status: {{match.model.status}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "    </script>\n" +
    "    <div class='container-fluid' ng-controller=\"entityPickerController\">\n" +
    "        <!--<input type=\"text\" ng-model=\"customSelected\" placeholder=\"Custom template\" typeahead=\"state for state in toto | filter:$viewValue | limitTo:8\" typeahead-template-url=\"customTemplate.html\" class=\"form-control\" typeahead-editable=\"false\">-->\n" +
    "        <sit-entity-picker sit-datasource=\"datasource\"\n" +
    "                           sit-template-url=\"'customTemplate.html'\"\n" +
    "                           sit-selected-attribute-to-display=\"selectedAttributeToDisplay\"\n" +
    "                           sit-selected-object=\"selectedObject\"\n" +
    "                           sit-limit=\"limit\"\n" +
    "                           sit-editable=\"editable\"\n" +
    "                           sit-required=\"required\"\n" +
    "                           sit-placeholder=\"placeholder\"\n" +
    "                           sit-id=\"'ep01'\" />\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <!-- Vendor Scripts -->\n" +
    "    <script src=\"/common/scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-animate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-route.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular/angular-sanitize.js\"></script>\n" +
    "    <script src=\"/common/scripts/bootstrap.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-ui-router.js\"></script>\n" +
    "    \n" +
    "    <script src=\"/common/scripts/angular-translate/translate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/default-interpolation.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/handler-log.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/loader-static-files.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/loader-partial.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/storage-key.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/storage-local.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/storage-cookie.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/service/translate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/directive/translate-cloak.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/directive/translate.js\"></script>\n" +
    "    <script src=\"/common/scripts/angular-translate/filter/translate.js\"></script>\n" +
    "    \n" +
    "\n" +
    "    <script src=\"/common/widgets/validator/sit-validator-mod.js\"></script>\n" +
    "    <script src=\"/common/widgets/validator/sit-validator-dir.js\"></script>\n" +
    "\n" +
    "    <!-- Bootstrapping -->\n" +
    "    <script src=\"/common/widgets/entityPicker/samples/app.js\"></script>\n" +
    "\n" +
    "    <!-- Property Grid Widget scripts -->\n" +
    "    <script src=\"/common/widgets/entityPicker/sit-entityPicker-mod.js\"></script>\n" +
    "    <script src=\"/common/widgets/entityPicker/sit-entityPicker-dir.js\"></script>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>\n" +
    "");
}]);

angular.module("common/widgets/entityPicker/typeahead-default-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/entityPicker/typeahead-default-template.html",
    "<a class=\"aClass\">\n" +
    "    <div>\n" +
    "        <span class=\"highlighted\" ng-bind-html=\"match.label | uibTypeaheadHighlight:query\">\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</a>");
}]);

angular.module("common/widgets/fileUpload/file-upload.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/fileUpload/file-upload.html",
    "<div ng-show=\"uploadCtrl.readOnly || uploadCtrl.ngReadonly\" class=\"label-property-grid-control-readonly property-value-ellipsis\"> {{uploadCtrl.selectedFile.name}} </div>\n" +
    "<ng-form name=\"fileForm\" ng-hide=\"uploadCtrl.readOnly || uploadCtrl.ngReadonly\">\n" +
    "    <div>\n" +
    "        <span ng-transclude></span>\n" +
    "        <div class=\"textboxHolder\">\n" +
    "            <span class=\"statusIcon\" ng-show=\"(!uploadCtrl.isFileLoaded && !uploadCtrl.isError)\"><i class=\"fa fa-ban fa-1x\"></i></span>\n" +
    "            <span class=\"statusIcon\" ng-show=\"uploadCtrl.isFileLoaded && !uploadCtrl.isError\"><i class=\"fa fa-file-o fa-1x\"></i></span>\n" +
    "            <span class=\"errorIcon\" ng-show=\"uploadCtrl.isError\"><i class=\"fa fa-warning\"></i></span>\n" +
    "\n" +
    "            <span ng-show=\"uploadCtrl.currentPercentage!=='' && uploadCtrl.currentPercentage!=='100%'\"\n" +
    "                  class=\"btn btn-primary progressBar\" ng-style=\"{'width': uploadCtrl.currentPercentage}\">{{uploadCtrl.currentPercentage}}</span>\n" +
    "\n" +
    "            <div class=\"form-control uploadSection\" >\n" +
    "                <input type=\"text\" data-internal-type=\"fileStatus\" class=\"showStatus\" title={{uploadCtrl.selectedFile.name}} ng-model=\"uploadCtrl.uploadedFile.name\" placeholder=\"{{uploadCtrl.selectedFile.name}}\" ng-required=\"uploadCtrl.validation.required\"\n" +
    "                       sit-change=\"uploadCtrl.sitChange\"  sit-form-input-validator readonly />\n" +
    "                <a class=\"btn deleteButton sharpCornerButton\" data-internal-type=\"deleteButton\" ng-show=\"uploadCtrl.isFileLoaded\" ng-click=\"uploadCtrl.removeFile($event)\" role=\"button\" title=\"Remove\">\n" +
    "                    <i class=\"fa fa-trash fa-1x\" ng-disabled=\"uploadCtrl.ngDisabled\"></i>\n" +
    "                </a>\n" +
    "                <input type=\"file\" data-internal-type=\"fileInput\"\n" +
    "                       class=\"btn actionButton File\" style=\"display:none\" ng-model=\"uploadCtrl.selectedFile\" accept=\"{{uploadCtrl.accept}}\" ng-disabled=\"uploadCtrl.ngDisabled\">\n" +
    "                <a class=\"btn actionButton sharpCornerButton\" data-internal-type=\"uploadButton\" role=\"button\" title=\"Browse\" ng-class=\"{disable:uploadCtrl.isFileLoaded}\" ng-disabled=\"uploadCtrl.ngDisabled\">\n" +
    "                    <i class=\"fa fa-folder-open-o fa-1x\" ng-disabled=\"uploadCtrl.ngDisabled\"></i>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/filter/sit-filter.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/filter/sit-filter.html",
    "<ng-form name=\"filterForm\">\n" +
    "    <table class=\"sit-filter-table\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <td class=\"add-remove\"></td>\n" +
    "                <td class=\"add-remove\"></td>\n" +
    "                <td class=\"filter-group\" ng-if=\"FilterCtrl.allowGrouping\" ng-class=\"FilterCtrl.isGroupingEnabled === true ? 'enabled' : 'disabled'\" ng-click=\"FilterCtrl.group()\"><span title=\"{{'common.group' | translate}}\" class=\"fa fa-link\"></span></td>\n" +
    "                <td ng-if=\"FilterCtrl.lastGrpId !== -1\" class=\"grp\"> </td>\n" +
    "                <td class=\"logical-operator\">{{'common.and-or' | translate}}</td>\n" +
    "                <td class=\"field\">{{'common.field' | translate}}</td>\n" +
    "                <td class=\"operator\">{{'common.operator' | translate}}</td>\n" +
    "                <td>{{'common.value' | translate}}</td>\n" +
    "                <td></td>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"clause in FilterCtrl.clauses\">\n" +
    "                <td class=\"add-remove\" ng-click=\"FilterCtrl.addClause(clause)\"><i class=\"fa fa-plus\"></i></td>\n" +
    "                <td class=\"add-remove\" ng-click=\"FilterCtrl.removeClause(clause)\"><i class=\"fa fa-minus\"></i></td>\n" +
    "                <td class=\"filter-group\" ng-if=\"FilterCtrl.allowGrouping\" ng-init=\"clause.index = $index\"><input type=\"checkbox\" ng-model=\"clause.selected\" ng-change=\"FilterCtrl.clauseSelectionChange()\" /></td>\n" +
    "                <td ng-if=\"FilterCtrl.lastGrpId !== -1\" class=\"{{clause.grpClass}}\">\n" +
    "                    <span ng-if=\"clause.grpClass && clause.grpClass.indexOf('grp-start') !== -1\" class=\"ungrp fa fa-unlink\" ng-click=\"FilterCtrl.unGroup(clause.grpId)\" title=\"{{'common.ungroup' | translate}}\"></span>\n" +
    "                </td>\n" +
    "                <td class=\"logical-operator\">\n" +
    "                    <select ng-model=\"clause.andOr\" ng-hide=\"$index===0\">\n" +
    "                        <option ng-repeat=\"option in FilterCtrl.operatorOptions\" value=\"{{option.id}}\">{{option.value}}</option>\n" +
    "                    </select>\n" +
    "                </td>\n" +
    "\n" +
    "                <td class=\"field\">\n" +
    "                    <select ng-model=\"clause.filterField\"\n" +
    "                            ng-options=\"filterField.displayName || filterField.field for filterField in FilterCtrl.sitFilterFields\"\n" +
    "                            ng-change=\"FilterCtrl.fieldChanged('{{clause.filterField.type}}', clause)\"></select>\n" +
    "                </td>\n" +
    "                <td class=\"operator\">\n" +
    "                    <select ng-model=\"clause.operator\"\n" +
    "                            ng-change=\"FilterCtrl.operatorChanged(clause)\"\n" +
    "                            ng-options=\"operator.id as operator.display for operator in FilterCtrl.getOperators(clause)\"></select>\n" +
    "                </td>\n" +
    "                \n" +
    "                <td ng-switch=\"clause.widget\" ng-if=\"!(clause.operator==='isnull' || clause.operator==='isnotnull')\">\n" +
    "                        <sit-numeric ng-switch-when=\"sit-numeric\"\n" +
    "                                     ng-readonly=\"false\"\n" +
    "                                     data-sit-value=\"clause.value\"\n" +
    "                                     data-sit-validation=\"clause.validation\"></sit-numeric>\n" +
    "                        <sit-text ng-switch-when=\"sit-text\"\n" +
    "                                  ng-readonly=\"false\"\n" +
    "                                  data-sit-value=\"clause.value\"\n" +
    "                                  data-sit-validation=\"clause.validation\"></sit-text>\n" +
    "                        <sit-select ng-switch-when=\"sit-select\"\n" +
    "                                    ng-readonly=\"false\"\n" +
    "                                    data-sit-value=\"clause.selectValue\"\n" +
    "                                    data-sit-options=\"clause.filterField.selectValues\"\n" +
    "                                    data-sit-to-keep=\"'id'\"\n" +
    "                                    data-sit-to-display=\"'name'\"\n" +
    "                                    data-sit-validation=\"clause.validation\"></sit-select>\n" +
    "                        <sit-entity-picker ng-switch-when=\"sit-entity-picker\"\n" +
    "                                           ng-readonly=\"false\"\n" +
    "                                           data-sit-selected-object=\"clause.selectValue\"\n" +
    "                                           data-sit-datasource=\"clause.filterField.selectValues\"\n" +
    "                                           data-sit-validation=\"clause.validation\"\n" +
    "                                           data-sit-placeholder=\"clause.placeHolder\">\n" +
    "                        </sit-entity-picker>\n" +
    "                        <sit-multi-select ng-switch-when=\"sit-multi-select\"\n" +
    "                                          data-sit-options=\"clause.filterField.selectValues\"\n" +
    "                                          data-sit-selected-string=\"clause.value\"\n" +
    "                                          data-sit-split-list=\"true\"\n" +
    "                                          data-sit-placeholder=\"FilterCtrl.multiSelectPlaceHolder\"\n" +
    "                                          data-sit-validation=\"clause.validation\"></sit-multi-select>\n" +
    "                        <sit-checkbox ng-switch-when=\"sit-checkbox\"\n" +
    "                                      ng-readonly=\"false\"\n" +
    "                                      data-sit-value=\"clause.checkValue\"\n" +
    "                                      data-sit-validation=\"clause.validation\"></sit-checkbox>\n" +
    "                        <sit-datepicker ng-switch-when=\"sit-datepicker\"\n" +
    "                                        ng-readonly=\"false\"\n" +
    "                                        data-sit-value=\"clause.value\"\n" +
    "                                        data-sit-append-to-body=\"true\"\n" +
    "                                        data-sit-format=\"FilterCtrl.dateFormat\"\n" +
    "                                        data-sit-validation=\"clause.validation\"></sit-datepicker>\n" +
    "                        <sit-date-time-picker ng-switch-when=\"sit-date-time-picker\"\n" +
    "                                              ng-readonly=\"false\"\n" +
    "                                              sit-value=\"clause.value\"\n" +
    "                                              sit-format=\"FilterCtrl.dateTimeOptions.format\"\n" +
    "                                              sit-show-seconds=\"FilterCtrl.dateTimeOptions.showSeconds\"\n" +
    "                                              sit-validation=\"clause.validation\"></sit-date-time-picker>\n" +
    "                     </td>\n" +
    "\n" +
    "                <td>                   \n" +
    "                    <label ng-if=\"!(clause.operator==='isnull' || clause.operator==='isnotnull') && clause.filterField.type==='string' && clause.filterField.showMatchCase!== false && !FilterCtrl.sitFilterServerSide && FilterCtrl.isMatchCaseShown\"><input type=\"checkbox\" ng-model=\"clause.matchCase\" />{{'common.match-case' | translate}}</label>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "    <a href=\"\" class=\"sit-add-new-clause\" ng-click=\"FilterCtrl.addClause();\"><i class=\"fa fa-plus\"></i>{{'filter.add-new-clause' | translate}}</a>\n" +
    "    <br />\n" +
    "    <button ng-if=\"!FilterCtrl.sitHideApplyReset\" ng-click=\"FilterCtrl.reset();\" class=\"sit-filter-button-reset\">{{'common.reset' | translate}}</button>\n" +
    "    <button ng-if=\"!FilterCtrl.sitHideApplyReset\" ng-click=\"FilterCtrl.apply();\" ng-disabled=\"filterForm.$invalid\" class=\"sit-filter-button-apply\">{{'common.apply' | translate}}</button>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/filterBar/filter-bar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/filterBar/filter-bar.html",
    "<div id=\"filterBarContainer\" data-internal-type=\"filterbarcontainer\"  class=\"filter-bar-holder\">\n" +
    "    <div id=\"filterBarSortDiv\" data-internal-type=\"filterBarSortDiv\" style=\"display:inline-block\" ng-show=\"filterBarCtrl.showSortControls\">\n" +
    "        <span ng-hide=\"filterBarCtrl.compactMode\">{{'filterBar.sortby' | translate}}</span>\n" +
    "        <select ng-options=\"field.displayName for field in filterBarCtrl.options.sortByFields\" ng-change=\"filterBarCtrl.onSortChanged();\" ng-style=\"filterBarCtrl.sortStyle\"\n" +
    "                ng-model=\"filterBarCtrl.selectedSort\" class=\"sort-dropdown\"></select>\n" +
    "        <!--<div class=\"dropdown\" is-open=\"sortStatus.isOpen\" style=\"display:inline-block\">\n" +
    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n" +
    "                {{options.currentSortField}}\n" +
    "                <span class=\"caret\"></span>\n" +
    "            </button>\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li ng-repeat=\"field in options.sortByFields\">\n" +
    "                    <a ng-click=\"sortSelectChange(field)\" style=\"cursor:pointer\">{{field}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>-->\n" +
    "        <sit-switch-button sit-buttons=\"filterBarCtrl.sortButtons\"></sit-switch-button>\n" +
    "    </div>\n" +
    "    <div id=\"quickSearchContainer\" data-internal-type=\"quickSearchContainer\" class=\"quick-search-container\" ng-show=\"filterBarCtrl.showQuickSearchControl\" ng-style=\"filterBarCtrl.searchContainerStyle\">\n" +
    "        <input id=\"quickSearchTextBox\" data-internal-type=\"quickSearchTextBox\" type=\"text\" ng-change=\"filterBarCtrl.quickSearchTextChanged()\"\n" +
    "               placeholder=\"{{'filterBar.quick-search' | translate}}\" class=\"form-control filter-quick-search\" ng-model=\"filterBarCtrl.quickSearchText\" ng-style=\"filterBarCtrl.searchStyle\" />\n" +
    "        <i id=\"quickSearchIcon\" data-internal-type=\"quickSearchIcon\" class=\"fa fa-search filter-search-icon\" ng-click=\"filterBarCtrl.doQuickSearch()\"></i>\n" +
    "    </div>\n" +
    "    <div id=\"filterBarFilterDiv\" data-internal-type=\"filterBarFilterDiv\" style=\"display:inline-block\" ng-show=\"!filterBarCtrl.compactMode && filterBarCtrl.showFilterButton\">\n" +
    "        <sit-switch-button sit-buttons=\"filterBarCtrl.filterButton\"></sit-switch-button>\n" +
    "    </div>\n" +
    "    <div data-internal-type=\"filterBarButtonContainer\" class=\"btn-group group-dropdown\" dropdown is-open=\"filterBarCtrl.groupStatus.isOpen\" ng-show=\"filterBarCtrl.showGroupButton\">\n" +
    "        <i class=\"fa fa-tasks dropdown-toggle switch-button switch-button-dropdown {{filterBarCtrl.optionSelectedClass}}\" data-toggle=\"dropdown\" style=\"margin-left:0; margin-right:0\"><span class=\"caret\"></span></i>\n" +
    "        <ul class=\"dropdown-menu sit-dropdown-menu\" ng-class=\"{'dropdown-menu-right':filterBarCtrl.openLeft}\" role=\"menu\">\n" +
    "            <li ng-repeat=\"groupBy in filterBarCtrl.options.groupByFields\">\n" +
    "                <a ng-click=\"filterBarCtrl.groupSelectChange(groupBy.field)\">\n" +
    "                    <span title=\"{{groupBy.displayName}}\">{{groupBy.displayName}}</span>\n" +
    "                    <i class=\"fa fa-check\" ng-show=\"filterBarCtrl.itemSelected(groupBy.field)\"></i>\n" +
    "                    <br style=\"clear:both\"/>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ng-click=\"filterBarCtrl.groupSelectChange()\">\n" +
    "                    <span title=\"{{'filterBar.none' | translate}}\">{{'filterBar.none' | translate}}</span>\n" +
    "                    <i class=\"fa fa-check\" ng-show=\"filterBarCtrl.itemSelected()\"></i>\n" +
    "                    <br style=\"clear:both\"/>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/flyout/samples/flyout-dev-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/flyout/samples/flyout-dev-tpl.html",
    "<div class=\"container\" ng-controller=\"DialogDevController as dDevCtrl\">\n" +
    "\n" +
    "    <button id=\"showDialogCenteredModal\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup1Center()\">\n" +
    "        Show Dialog Centered Modal\n" +
    "    </button>\n" +
    "\n" +
    "    <button id=\"showDialogCenteredModal2\" class=\"btn btn-primary btn-lg\" ng-click=\"dDevCtrl.showPopup2Center()\">\n" +
    "        Show Dialog Centered Modal 2\n" +
    "    </button>\n" +
    "\n" +
    "    <button id=\"bottomFlyout\" class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"common/widgets/flyout/samples/sit-flyout-template.html\" data-sit-placement=\"bottom\">Bottom Template</button>\n" +
    "    <button class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"common/widgets/flyout/samples/sit-flyout-template.html\" data-sit-placement=\"right\">Right Template</button>\n" +
    "    <button class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"common/widgets/flyout/samples/sit-flyout-template.html\" data-sit-placement=\"left\">Left Template</button>\n" +
    "    <button class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"common/widgets/flyout/samples/sit-flyout-template.html\" data-sit-placement=\"top\">Top Template</button>\n" +
    "    <button class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"common/widgets/flyout/samples/sit-flyout-template.html\" data-sit-placement=\"auto\">Auto Template</button>\n" +
    "\n" +
    "\n" +
    "    <button class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"QA/1559/sit-flyout-template2.html\" data-sit-templatedata=\"currentUser\" data-sit-placement=\"right\">Template</button>\n" +
    "\n" +
    "\n" +
    "    <sit-dialog sit-title=\"dDevCtrl.dialogTitle\"\n" +
    "                sit-templatedata='currentUser'\n" +
    "                sit-templateuri=\"dDevCtrl.dialogTemplateUri\"\n" +
    "                sit-modalid=\"popup1\"\n" +
    "                sit-buttons='dDevCtrl.buttonsList'>\n" +
    "    </sit-dialog>\n" +
    "    <sit-dialog sit-title=\"dDevCtrl.dialogTitleModify\"\n" +
    "                sit-templatedata='dDevCtrl.dialogData2'\n" +
    "                sit-templateuri=\"dDevCtrl.dialogTemplateUriModify\"\n" +
    "                sit-modalid=\"popup2\"\n" +
    "                sit-buttons='dDevCtrl.buttonsList2'>\n" +
    "    </sit-dialog>\n" +
    "\n" +
    "    <button class=\"btn btn-lg btn-info\" data-sit-flyout data-sit-templateuri=\"common/widgets/flyout/samples/sit-flyout-template.html\" data-sit-placement=\"auto\">Auto Template</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/flyout/samples/flyout-dev-view.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/flyout/samples/flyout-dev-view.html",
    "<div style=\"margin-left:50px; text-align: left;  vertical-align: top; \">\n" +
    "    <ng-include src=\"'/common/widgets/flyout/samples/flyout-dev-tpl.html'\" />\n" +
    "</div>");
}]);

angular.module("common/widgets/flyout/samples/flyout-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/flyout/samples/flyout-dev.html",
    "<!DOCTYPE html>\n" +
    "<html data-ng-app=\"app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Flyout Development</title>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "    <link href=\"../../../styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "    <style>\n" +
    "        html, body {\n" +
    "            overflow: auto !important;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"flyoutDevController\">\n" +
    "\n" +
    "    <!-- UI-ROUTER EXAMPLE -->\n" +
    "    <div>\n" +
    "        <div style=\"height:350px\"></div>\n" +
    "        <p>Current User: {{currentUser}}</p>\n" +
    "        <a href=\"#\" class=\"btn btn-lg btn-info\" data-sit-flyout data-templateuri=\"sit-flyout-template.html\" data-placement=\"bottom\">Bottom placement Template 1</a>\n" +
    "        <button class=\"btn btn-lg btn-info\" data-sit-flyout data-templateuri=\"sit-flyout-template2.html\" data-templatedata=\"currentUser\" data-placement=\"auto\">Auto placement Template 2</button>\n" +
    "\n" +
    "    </div>\n" +
    "    <!-- END UI-ROUTER EXAMPLE -->\n" +
    "    <!-- Vendor Scripts -->\n" +
    "    <script src=\"../../../scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular/angular.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular/angular-animate.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular/angular-route.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular/angular-sanitize.js\"></script>\n" +
    "    <script src=\"../../../scripts/bootstrap.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "    <script src=\"../../../scripts/angular-ui-router.js\"></script>\n" +
    "\n" +
    "    <!-- Bootstrapping -->\n" +
    "    <script src=\"./flyout-dev-app.js\"></script>\n" +
    "\n" +
    "    <!-- Test Data -->\n" +
    "    <!-- Flyout Widget scripts -->\n" +
    "    <script src=\"../sit-flyout-mod.js\"></script>\n" +
    "    <script src=\"../sit-flyout-svc.js\"></script>\n" +
    "    <script src=\"../sit-flyout-dir.js\"></script>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>");
}]);

angular.module("common/widgets/flyout/samples/sit-flyout-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/flyout/samples/sit-flyout-template.html",
    "<p>This is a flyout with a really really really really really long text</p>\n" +
    "");
}]);

angular.module("common/widgets/flyout/samples/sit-flyout-template2.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/flyout/samples/sit-flyout-template2.html",
    "<p>This is an other template with binding</p>\n" +
    "Current User <input type=\"text\" ng-model=\"templatedata\" />\n" +
    "");
}]);

angular.module("common/widgets/graph/graph.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/graph/graph.html",
    "<div class=\"graphbackground\" ng-show=\"GraphCtrl.isGraphValid\">\n" +
    "    <div>\n" +
    "        <div ng-show=\"GraphCtrl.sitOptions.zooming\" class=\"graphZoomControl\">\n" +
    "            <div class=\"zoom\"><label>Zoom: &nbsp;</label></div>\n" +
    "            <input class=\"graphZoomControlInput\" type=\"range\" min=\"1\" max=\"8\" ng-model=\"zoomLevel\" step=\".1\" />\n" +
    "            <button class=\"btn btn-info graphAutoFit\">Auto Fit</button>\n" +
    "            <button class=\"btn btn-info panAndZoom\">Pan and Zoom</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div data-internal-type=\"graphwrapper\" class=\"graphWrapperMain\">\n" +
    "        <svg data-internal-type=\"graphsvg\" width=\"500\" height=\"500\"></svg>\n" +
    "    </div>\n" +
    "    <div ng-show=\"GraphCtrl.sitOptions.zooming\" class=\"panZoom\" ng-class=\"GraphCtrl.showPan==1?'pan':'panHidden'\">\n" +
    "        <svg data-internal-type=\"panWindow\">\n" +
    "            <g></g>\n" +
    "        </svg>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<label ng-show=\"!GraphCtrl.isGraphValid\">{{graphError}}</label>\n" +
    "");
}]);

angular.module("common/widgets/grid/grid.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/grid/grid.html",
    "<div id=\"gridContainerDiv\" ng-class=\"gridCtrl.sitGridOptions.gridContainerClass\" data-internal-type=\"gridContainerDiv\" class=\"grid\" ng-style=\"gridCtrl.gridHeight\">\n" +
    "    <div ng-if=\"gridCtrl.showGrid\" id=\"showHideGrid\">\n" +
    "        <div class=\"gridStyle\" ng-style=\"gridCtrl.gridHeight\" ng-grid=\"gridCtrl.gridOptions\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/iconPicker/icon-selection-template.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/iconPicker/icon-selection-template.html",
    "<a class=\"icon-picker-dropdown\">\n" +
    "    <div class=\"icon-details\">\n" +
    "        <div class=\"icon-container\">         \n" +
    "            <i class=\"fa {{match.model.icon}} fa-lg\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"icon-name-container\">\n" +
    "            <div class=\"name-container icon-text\">             \n" +
    "                <label class=\"image-name\" ng-bind-html=\"match.model.icon \"></label>\n" +
    "            </div>          \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</a>");
}]);

angular.module("common/widgets/iconPicker/iconPicker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/iconPicker/iconPicker.html",
    "<div data-internal-type=\"icon-picker-container\" id=\"icon-picker-container\" class=\"icon-picker-container\"> \n" +
    "    <div class=\"icon-selector\" ng-if=\"iconPickerCtrl.showpicker\">\n" +
    "    <sit-entity-picker sit-id=\"iconPickerCtrl.id\"                       \n" +
    "                       sit-change=\"iconPickerCtrl.valueChanged\"                      \n" +
    "                       sit-datasource=\"iconPickerCtrl.datasource\" \n" +
    "                       sit-limit=\"iconPickerCtrl.limit\" \n" +
    "                       sit-placeholder=\"iconPickerCtrl.placeholder\"\n" +
    "                       sit-selected-attribute-to-display=\"iconPickerCtrl.selectedAttributeToDisplay\" \n" +
    "                       sit-editable=\"iconPickerCtrl.editable\" \n" +
    "                       sit-required=\"iconPickerCtrl.required\"\n" +
    "                       sit-template-url=\"iconPickerCtrl.templateUrl\"\n" +
    "                       sit-read-only=\"iconPickerCtrl.readOnly\" \n" +
    "                       sit-validation=\"iconPickerCtrl.validation\" \n" +
    "                       sit-selected-object=\"iconPickerCtrl.selectedObject\"\n" +
    "                       ng-blur=\"iconPickerCtrl.ngBlur\"\n" +
    "                       ng-disabled=\"iconPickerCtrl.ngDisabled\"\n" +
    "                       ng-focus=\"iconPickerCtrl.ngFocus\"\n" +
    "                       ng-readonly=\"iconPickerCtrl.ngReadonly\"\n" +
    "                       class=\"property-grid-input-group\"/>\n" +
    "    </div>  \n" +
    "    <div class=\"icon-view\">     \n" +
    "        <span>\n" +
    "            <i class=\"fa {{iconPickerCtrl.value}} fa-lg\"></i>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/iconPreview/iconPreview.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/iconPreview/iconPreview.html",
    "<span ng-if=\"iconpreviewCtrl.readOnly || iconpreviewCtrl.ngReadonly\" class=\"label-property-grid-control-readonly property-value-ellipsis\">\n" +
    "    <i class=\"fa {{iconpreviewCtrl.value}} fa-lg\"></i>\n" +
    "</span>\n" +
    "<ng-form name='iconpreviewForm' ng-if=\"!(iconpreviewCtrl.readOnly || iconpreviewCtrl.ngReadonly)\" ng-class=\"{'isrequired' :(iconpreviewCtrl.validation.required) && iconpreviewCtrl.value===undefined}\">\n" +
    "    <span style=\"display: inline-block; width:95%\" class='property-grid-input-group'>\n" +
    "        <input type=\"text\"\n" +
    "               name='{{iconpreviewCtrl.value}}'\n" +
    "               ng-class='((iconpreviewForm.$invalid && iconpreviewForm.$dirty) || (iconpreviewForm.$invalid && iconpreviewForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               ng-model='iconpreviewCtrl.value'\n" +
    "               ng-required='iconpreviewCtrl.validation.required'\n" +
    "               ng-minlength='iconpreviewCtrl.validation.minlength'\n" +
    "               ng-maxlength='iconpreviewCtrl.validation.maxlength'\n" +
    "               ng-pattern='iconpreviewCtrl.validation.pattern'\n" +
    "               ng-blur=\"iconpreviewCtrl.ngBlur()\"\n" +
    "               sit-change=\"iconpreviewCtrl.sitChange\"\n" +
    "               ng-disabled=\"iconpreviewCtrl.ngDisabled\"\n" +
    "               ng-readonly=\"iconpreviewCtrl.ngReadOnly\"\n" +
    "               ng-focus=\"iconpreviewCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator='{{iconpreviewCtrl.value}}' />\n" +
    "    </span>\n" +
    "    <span>\n" +
    "        <i class=\"fa {{iconpreviewCtrl.value}} fa-lg\"></i>\n" +
    "    </span>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/itemCollectionViewer/item-collection-viewer.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/itemCollectionViewer/item-collection-viewer.html",
    "<div id=\"itemCollectionViewerContainer\" data-internal-type=\"itemCollectionViewerContainer\" ng-style=\"ICVController.compactStyle\">\n" +
    "    <div ng-if=\"ICVController.resetView\">\n" +
    "        <div id=\"topCommandBars\" data-internal-type=\"topCommandBars\" class=\"top-command-bars\">\n" +
    "            <div id=\"viewBar\" data-internal-type=\"viewBar\">\n" +
    "                <sit-view-bar sit-view-options=\"ICVController.viewBarOptions\"></sit-view-bar>\n" +
    "            </div>\n" +
    "            <!-- Needed to remove space between multiple inline-block elements.  Do not remove this.\n" +
    "            -->\n" +
    "            <div id=\"filterBar\" data-internal-type=\"filterBar\" class=\"filterBar-container\">\n" +
    "                <sit-filter-bar sit-filter-options=\"ICVController.filterOptions\"></sit-filter-bar>\n" +
    "            </div>\n" +
    "            <div id=\"filter\" class=\"filter-container\" ng-class=\"ICVController.showFilter ? 'open' : 'closed'\" data-internal-type=\"filter\">\n" +
    "                <sit-filter sit-filter-fields=\"ICVController.sitOptions.filterFields\" sit-filter-server-side=\"ICVController.sitOptions.serverDataOptions\" sit-filter-options=\"ICVController.filterSearchOptions\" sit-apply-callback=\"ICVController.applyFilter(clauses)\" sit-reset-callback=\"ICVController.resetFilter()\"></sit-filter>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div id=\"itemCollectionCanvas\" data-internal-type=\"itemCollectionCanvas\" ng-style=\"ICVController.collectionStyle\">\n" +
    "            <div id=\"noDataDiv\" data-internal-type=\"noDataDiv\" ng-style=\"ICVController.collectionStyle\" ng-if=\"ICVController.noData && !ICVController.pageManager.isServerData()\" style=\"font-size: large; padding-left: 10px;\">{{ICVController.noDataMessage}}</div>\n" +
    "            <div id=\"gridViewDiv\" data-internal-type=\"gridViewDiv\" ng-style=\"ICVController.setCollectionStyle()\" ng-if=\"(!ICVController.noData || ICVController.pageManager.isServerData()) && ICVController.viewMode == 'grid'\">\n" +
    "                <sit-grid data-sit-grid-data=\"ICVController.sitData\" data-sit-grid-options=\"ICVController.gridOptions\"></sit-grid>\n" +
    "            </div>\n" +
    "            <div id=\"tileViewDiv\" data-internal-type=\"tileViewDiv\" ng-style=\"ICVController.collectionStyle\" ng-if=\"(!ICVController.noData || ICVController.pageManager.isServerData()) && ICVController.viewMode != 'grid'\">\n" +
    "                <sit-tile-view data-sit-tiles=\"ICVController.sitData\" data-sit-options=\"ICVController.tileViewOptions\"></sit-tile-view>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/label/label.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/label/label.html",
    "<div class='label-property-grid-control-readonly property-grid-label property-value-ellipsis' title=\"{{labelCtrl.value}}\">{{labelCtrl.value}}</div>");
}]);

angular.module("common/widgets/multiSelect/sit-multi-select.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/multiSelect/sit-multi-select.html",
    "<div class=\"label label-property-grid-control-readonly property-value-ellipsis\" ng-if=\"ctrl.readOnly || ctrl.ngReadonly\">\n" +
    "    {{ ctrl.sitSelectedString || ctrl.sitPlaceholder }}\n" +
    "</div>\n" +
    "<ng-form ng-if=\"!(ctrl.readOnly || ctrl.ngReadonly)\" name='multiselectForm'\n" +
    "         ng-class=\"{'isrequired' : (ctrl.validation.required) && ! ((ctrl.sitOptions | filter:{selected:true}).length > 0)}\">\n" +
    "    <div class=\"dropdown multi-select-dropdown\">\n" +
    "        <button class=\"btn btn-default\" type=\"button\" id=\"dropdownMenu1\" aria-expanded=\"true\" data-toggle=\"dropdown\"\n" +
    "                ng-class='((multiselectForm.$invalid && multiselectForm.$dirty) || (multiselectForm.$invalid && multiselectForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "                ng-blur=\"ctrl.ngBlur()\" ng-disabled=\"ctrl.ngDisabled\" ng-focus=\"ctrl.ngFocus()\">\n" +
    "            {{ctrl.getSelectedText()}}\n" +
    "            <i class=\"fa fa-chevron-down\"></i>\n" +
    "        </button>\n" +
    "        <input type=\"hidden\" ng-model=\"ctrl.sitSelectedString\" ng-required=\"ctrl.validation.required\"  sit-form-input-validator />\n" +
    "\n" +
    "        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">\n" +
    "            <li ng-repeat=\"selectable in ctrl.sitOptions | filter: ctrl.sitSplitList ? {selected:true} : {}\" role=\"presentation\" ng-click=\"ctrl.toggleSelected($event, selectable)\" class=\"dropdown-item\">\n" +
    "                <input type=\"checkbox\" ng-model=\"selectable.value\" sit-change=\"ctrl.sitChange\" ng-checked=\"selectable.selected\" class=\"view-text\" />\n" +
    "                <a role=\"menuitem\" tabindex=\"-1\">{{selectable.name}}</a>\n" +
    "                <!--TODO - make this configurable\n" +
    "                <i class=\"fa\" ng-class=\"selectable.direction==='desc' ? 'fa-sort-alpha-desc' : 'fa-sort-alpha-asc'\" ng-click=\"ctrl.toggleDirection($event, selectable)\"></i>-->\n" +
    "            </li>\n" +
    "            <!--This is VERY inefficient-->\n" +
    "            <li role=\"presentation\" class=\"divider\" ng-if=\"ctrl.sitSplitList && (ctrl.sitOptions | filter:ctrl.isFalsy).length > 0 && (ctrl.sitOptions | filter:{selected:true}).length > 0\"></li>\n" +
    "            <li ng-if=\"ctrl.sitSplitList\" ng-repeat=\"selectable in ctrl.sitOptions | filter:ctrl.isFalsy\" role=\"presentation\" ng-click=\"ctrl.toggleSelected($event, selectable)\" class=\"dropdown-item\">\n" +
    "                <input type=\"checkbox\" ng-checked=\"selectable.selected\" class=\"view-text\" />\n" +
    "                <a role=\"menuitem\" tabindex=\"-1\">{{selectable.name}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/navigationLink/sit-tab.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/navigationLink/sit-tab.html",
    "<div sit-tab-heading-transclude></div>");
}]);

angular.module("common/widgets/navigationLink/sit-tabset.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/navigationLink/sit-tabset.html",
    "<div class=\"sit-navigation-tabs\" data-internal-type=\"sit-navigation-tabs\">\n" +
    "    <ng-transclude ng-show=\"false\"></ng-transclude>\n" +
    "    <ul class=\"nav navbar-nav tabset\" data-internal-type=\"sit-navigation-tabs-navbar\">\n" +
    "        <li class=\"navbar-nav-tab\" data-internal-type=\"sit-navigation-tabs-navbar-tab-item\" ng-repeat=\"tab in tabs\" \n" +
    "            ng-class=\"{active: tab.active, disabled: tab.disabled, warning: tab.warning, new: tab.new}\" \n" +
    "            ng-if=\"$index<=tabsetCtrl.visibleTabs - 1\" ng-style=\"{'max-width' : tabsetCtrl.maxTabWidth}\"\n" +
    "            uib-tooltip-html=\"tab.heading\" tooltip-palacement=\"top\" tooltip-enable=\"tabsetCtrl.isTabEllipsis(tab)\">\n" +
    "            <a ng-click=\"tab.select()\">\n" +
    "                <div>\n" +
    "                    <div class=\"sit-nav-tab-i\">\n" +
    "                        <i class=\"fa fa-warning\" ng-if=\"tab.warning\"></i>\n" +
    "                        <i class=\"fa fa-asterisk\" ng-if=\"tab.new\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"sit-nav-tab-label\" data-ellipsis-id=\"sit-nav-tab-span-{{tab.$id}}\" ng-bind-html=\"tab.heading\"></div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"navbar-nav-dropdown\" data-internal-type=\"sit-navigation-tabs-navbar-dropdown\" ng-show=\"tabsetCtrl.displayDropdown\">\n" +
    "            <button data-toggle=\"dropdown\" title=\"Other commands\" class=\"dropdown-toggle\" ng-click=\"tabsetCtrl.setDropdownHeight()\">\n" +
    "                <div style=\"display:inline\">\n" +
    "                    <span class=\"fa-stack fa-lg stackButton\">\n" +
    "                        <i class=\"fa fa-bars fa-stack \"></i>\n" +
    "                    </span>\n" +
    "                    <div class=\"caret\"></div>\n" +
    "                </div>\n" +
    "            </button>\n" +
    "\n" +
    "            <ul class=\"dropdown-menu dropdown-menu-right\"  data-internal-type=\"sit-navigation-tabs-navbar-dropdown-ul\" role=\"menu\" data-toggle=\"dropdown\">\n" +
    "                <li class=\"sit-tab-dropdown-menu-items\"  data-internal-type=\"sit-navigation-tabs-navbar-dropdown-ul-li\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active, disabled: tab.disabled, warning: tab.warning, new: tab.new}\" ng-show=\"$index>tabsetCtrl.visibleTabs - 1\">\n" +
    "                    <a ng-click=\"tab.select()\">\n" +
    "                        <i class=\"fa fa-warning\" ng-show=\"tab.warning\"></i>\n" +
    "                        <i class=\"fa fa-asterisk\" ng-show=\"tab.new\"></i>\n" +
    "                        <span ng-bind-html=\"tab.heading\"></span>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div class=\"sit-tab-clear-div\"></div>\n" +
    "    <div class=\"tab-content\">\n" +
    "        <div class=\"tab-pane\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active}\" sit-tab-content-transclude=\"tab\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/navigationLink/tab.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/navigationLink/tab.html",
    "<div tab-heading-transclude>\n" +
    "</div>");
}]);

angular.module("common/widgets/navigationLink/tabset.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/navigationLink/tabset.html",
    "<div class=\"sit-navigation-tabs\" data-internal-type=\"sit-navigation-tabs\">\n" +
    "    <ng-transclude ng-show=\"false\"></ng-transclude>\n" +
    "    <ul class=\"nav navbar-nav tabset\" data-internal-type=\"sit-navigation-tabs-navbar\">\n" +
    "        <li class=\"navbar-nav-tab\" data-internal-type=\"sit-navigation-tabs-navbar-tab-item\" ng-repeat=\"tab in tabs\" \n" +
    "            ng-class=\"{active: tab.active, disabled: tab.disabled, warning: tab.warning, new: tab.new}\" \n" +
    "            ng-if=\"$index<=tabsetCtrl.visibleTabs - 1\" ng-style=\"{'max-width' : tabsetCtrl.maxTabWidth}\"\n" +
    "            uib-tooltip-html=\"tab.heading\" tooltip-palacement=\"top\" tooltip-enable=\"tabsetCtrl.isTabEllipsis(tab)\">\n" +
    "            <a ng-click=\"tab.select()\">\n" +
    "                <div>\n" +
    "                    <div class=\"sit-nav-tab-i\">\n" +
    "                        <i class=\"fa fa-warning\" ng-if=\"tab.warning\"></i>\n" +
    "                        <i class=\"fa fa-asterisk\" ng-if=\"tab.new\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"sit-nav-tab-label\" data-ellipsis-id=\"sit-nav-tab-span-{{tab.$id}}\" ng-bind-html=\"tab.heading\"></div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"navbar-nav-dropdown\" data-internal-type=\"sit-navigation-tabs-navbar-dropdown\" ng-show=\"tabsetCtrl.displayDropdown\">\n" +
    "            <button data-toggle=\"dropdown\" title=\"Other commands\" class=\"dropdown-toggle\" ng-click=\"tabsetCtrl.setDropdownHeight()\">\n" +
    "                <div style=\"display:inline\">\n" +
    "                    <span class=\"fa-stack fa-lg stackButton\">\n" +
    "                        <i class=\"fa fa-bars fa-stack \"></i>\n" +
    "                    </span>\n" +
    "                    <div class=\"caret\"></div>\n" +
    "                </div>\n" +
    "            </button>\n" +
    "\n" +
    "            <ul class=\"dropdown-menu dropdown-menu-right\"  data-internal-type=\"sit-navigation-tabs-navbar-dropdown-ul\" role=\"menu\" data-toggle=\"dropdown\">\n" +
    "                <li class=\"sit-tab-dropdown-menu-items\"  data-internal-type=\"sit-navigation-tabs-navbar-dropdown-ul-li\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active, disabled: tab.disabled, warning: tab.warning, new: tab.new}\" ng-show=\"$index>tabsetCtrl.visibleTabs - 1\">\n" +
    "                    <a ng-click=\"tab.select()\">\n" +
    "                        <i class=\"fa fa-warning\" ng-show=\"tab.warning\"></i>\n" +
    "                        <i class=\"fa fa-asterisk\" ng-show=\"tab.new\"></i>\n" +
    "                        <span ng-bind-html=\"tab.heading\"></span>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div class=\"sit-tab-clear-div\"></div>\n" +
    "    <div class=\"tab-content\">\n" +
    "        <div class=\"tab-pane\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active}\" tab-content-transclude=\"tab\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/notificationTile/notification-tile.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/notificationTile/notification-tile.html",
    "<div class=\"notification-tile\"\n" +
    "     ng-click=\"notificationCtrl.thisTileClick()\"\n" +
    "     ng-show=\"notificationCtrl.tileIsVisible\"\n" +
    "     ng-class=\"{'notification-tile-popup': notificationCtrl.tilePopup,\n" +
    "                'notification-tile-color-info': notificationCtrl.tileType=='info',\n" +
    "                'notification-tile-color-warning':  notificationCtrl.tileType=='warning',\n" +
    "                'normalTile':notificationCtrl.format!=='wide',\n" +
    "                'wideTile':notificationCtrl.format=='wide',\n" +
    "                'topCenterPositioning':notificationCtrl.position=='topCenter',\n" +
    "                'normalPositioning':notificationCtrl.position=='topRight',\n" +
    "                'bottomRightPositioning':notificationCtrl.position=='bottomRight',\n" +
    "                'topLeftPositioning':notificationCtrl.position=='topLeft',\n" +
    "                'dropShadow':notificationCtrl.shadow!==false}\"\n" +
    "     ng-mouseenter=\"notificationCtrl.stpoInterval()\"\n" +
    "     ng-mouseleave=\"notificationCtrl.startInterval()\">\n" +
    "\n" +
    "    <div class=\"notification-tile-container\">\n" +
    "        <div class=\"notification-tile-title\" data-internal-type=\"title\">{{notificationCtrl.cropedTitle}}</div>\n" +
    "        <div class=\"notification-tile-description\" data-internal-type=\"content\">{{notificationCtrl.cropedContent}}</div>\n" +
    "        <div class=\"notification-tile-icon\" data-internal-type=\"icon\">\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-info': notificationCtrl.tileType=='info',\n" +
    "                                     'fa-warning': notificationCtrl.tileType=='warning'}\">\n" +
    "            </i>\n" +
    "        </div>\n" +
    "        <div class=\"notification-tile-counter\" data-internal-type=\"counter\"> <span>{{notificationCtrl.tileCounter}}</span> </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/notificationTile/samples/notification-tile-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/notificationTile/samples/notification-tile-dev.html",
    "<!DOCTYPE html>\n" +
    "<html data-ng-app=\"app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Notification Tile Development</title>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "    <link href=\"/common/styles/font-awesome/font-awesome.css\" rel=\"stylesheet\" />\n" +
    "    <link href=\"../../../styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "    <style type=\"text/css\">\n" +
    "        body {\n" +
    "            overflow: auto;\n" +
    "        }\n" +
    "    </style>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"notificationTileDevController\">\n" +
    "\n" +
    "\n" +
    "    <div>\n" +
    "        <div class=\"row\">\n" +
    "            <div style=\"width:1000px; padding:20px; border:1px solid #3366AA; position:relative; margin:50px;\">\n" +
    "\n" +
    "                <div data-sit-notification-tile\n" +
    "                     data-sit-tile-title=\"'Success'\"\n" +
    "                     data-sit-tile-content=\"'Form has been saved!'\"\n" +
    "                     data-sit-tile-type=\"'info'\"\n" +
    "                     data-sit-tile-counter=\"1\"\n" +
    "                     data-sit-tile-click=\"hasClicked('Tile info was clicked!')\"\n" +
    "                     data-sit-tile-popup=\"true\"\n" +
    "                     id=\"infoTile\"></div>\n" +
    "\n" +
    "                <div data-sit-notification-tile\n" +
    "                     data-sit-tile-title=\"'warning'\"\n" +
    "                     data-sit-tile-content=\"'Error saving form'\"\n" +
    "                     data-sit-tile-type=\"'warning'\"\n" +
    "                     data-sit-tile-counter=\"1\"\n" +
    "                     data-sit-tile-click=\"hasClicked('Tile warning was clicked!')\"\n" +
    "                     data-sit-tile-popup=\"true\"\n" +
    "                     id=\"warningForm\"></div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                <h3 style=\"color:#3366AA;\">Notification Tile Development</h3>\n" +
    "                <div style=\"width:500px;  padding:20px; border:1px solid #3366AA; position:relative; margin:50px;\">\n" +
    "                    <h3 style=\"color:#3366AA;\">Form</h3>\n" +
    "                    <form role=\"form\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"txtName\">Login:</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" id=\"txtLogin\">\n" +
    "\n" +
    "                            <div style=\"position:absolute; top:14px; left:482px;\">\n" +
    "                                <div data-sit-notification-tile\n" +
    "                                     data-sit-tile-title=\"'Warning Message'\"\n" +
    "                                     data-sit-tile-content=\"'This field is required'\"\n" +
    "                                     data-sit-tile-type=\"'warning'\"\n" +
    "                                     data-sit-tile-counter=\"1\"\n" +
    "                                     id=\"warningTile\"></div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!--<div class=\"form-group\">\n" +
    "                            <label for=\"txtPwd\">Password:</label>\n" +
    "                            <input type=\"password\" class=\"form-control\" id=\"txtPwd\">\n" +
    "                        </div>-->\n" +
    "                        <!--<button type=\"submit\" id=\"btnSubmit\" class=\"btn btn-default\">Submit</button>-->\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <button type=\"button\" id=\"btnInput\" class=\"btn btn-default\" ng-click=\"hasClicked('Show info notification');\">Show info notification</button>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <button type=\"button\" id=\"btnInputHide\" class=\"btn btn-default\" ng-click=\"hasClicked('Hide info notification');\">Hide info notification</button>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <button type=\"button\" id=\"btnInputToggle\" class=\"btn btn-default\" ng-click=\"hasClicked('Toggle info notification');\">Toggle info notification</button>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <button type=\"button\" id=\"btnContainerSuccess\" class=\"btn btn-default\" ng-click=\"hasClicked('Show popup info notification')\">Show popup info notification</button>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <button type=\"button\" id=\"btnContainerWarning\" class=\"btn btn-default\" ng-click=\"hasClicked('Show popup Warning notification');\">Show popup Warning notification</button>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </form>\n" +
    "                    <br />\n" +
    "                    <div>\n" +
    "                        <strong>Notifications</strong><br />\n" +
    "                        <ul>\n" +
    "                            <li ng-repeat=\"event in events\">{{event}}</li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "\n" +
    "                <!--<button type=\"button\" class=\"btn btn-default\" onclick=\"$('#infoTile').data('notificationTileToggle')()\">Info</button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" onclick=\"$('#warningTile').data('notificationTileToggle')()\">Warning</button>-->\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Vendor Scripts -->\n" +
    "        <script src=\"../../../scripts/jquery-2.1.1.js\"></script>\n" +
    "        <script src=\"../../../scripts/angular/angular.js\"></script>\n" +
    "        <script src=\"../../../scripts/angular/angular-animate.js\"></script>\n" +
    "        <script src=\"../../../scripts/angular/angular-route.js\"></script>\n" +
    "        <script src=\"../../../scripts/angular/angular-sanitize.js\"></script>\n" +
    "        <script src=\"../../../scripts/bootstrap.js\"></script>\n" +
    "        <script src=\"../../../scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "        <script src=\"../../../scripts/angular-ui-router.js\"></script>\n" +
    "\n" +
    "        <!-- Bootstrapping -->\n" +
    "        <script src=\"./notification-tile-dev-app.js\"></script>\n" +
    "\n" +
    "        <!-- Test Data -->\n" +
    "        <!-- NotificationTile Widget scripts -->\n" +
    "        <script src=\"../sit-notification-tile-mod.js\"></script>\n" +
    "        <script src=\"../sit-notification-tile-svc.js\"></script>\n" +
    "        <script src=\"../sit-notification-tile-dir.js\"></script>\n" +
    "\n" +
    "\n" +
    "        <!--<script type=\"text/javascript\">\n" +
    "            $(document).ready(function () {\n" +
    "                $(\"#txtLogin\").blur(function () {\n" +
    "                    if ($(this).val() == \"\") {\n" +
    "                        $('#warningTile').data('notificationTileShow')();\n" +
    "                    } else {\n" +
    "                        $('#warningTile').data('notificationTileHide')();\n" +
    "                    }\n" +
    "                });\n" +
    "\n" +
    "                $(\"#btnSubmit\").click(function () {\n" +
    "                    if ($(\"#txtLogin\").val() == \"\" || $(\"#txtPwd\").val() == \"\") {\n" +
    "                        $('#warningForm').data('notificationTileShow')();\n" +
    "                    } else {\n" +
    "                        $('#infoTile').data('notificationTileShow')();\n" +
    "                    }\n" +
    "\n" +
    "                });\n" +
    "            });\n" +
    "\n" +
    "        </script>-->\n" +
    "\n" +
    "        <script type=\"text/javascript\">\n" +
    "            $(document).ready(function () {\n" +
    "                $(\"#btnInput\").click(function () {\n" +
    "                    $('#warningTile').data('notificationTileShow')();\n" +
    "                });\n" +
    "\n" +
    "                $(\"#btnInputToggle\").click(function () {\n" +
    "                    $('#warningTile').data('notificationTileToggle')();\n" +
    "                });\n" +
    "\n" +
    "                $(\"#btnInputHide\").click(function () {\n" +
    "                    $('#warningTile').data('notificationTileHide')();\n" +
    "                });\n" +
    "\n" +
    "                $(\"#btnContainerSuccess\").click(function () {\n" +
    "                    $('#infoTile').data('notificationTileShow')();\n" +
    "                });\n" +
    "\n" +
    "                $(\"#btnContainerWarning\").click(function () {\n" +
    "                    $('#warningForm').data('notificationTileShow')();\n" +
    "                });\n" +
    "            });\n" +
    "\n" +
    "        </script>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>");
}]);

angular.module("common/widgets/numeric/numeric.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/numeric/numeric.html",
    "<div ng-if=\"numericCtrl.readOnly || numericCtrl.ngReadonly\" class=\"label-property-grid-control-readonly property-value-ellipsis\"> {{numericCtrl.value}} </div>\n" +
    "\n" +
    "<ng-form ng-if=\"!(numericCtrl.readOnly || numericCtrl.ngReadonly)\" name='numericForm' ng-class=\"{'isrequired' : (numericCtrl.validation.required) && numericCtrl.value===undefined}\">\n" +
    "    <div class='property-grid-input-group'>\n" +
    "        <input type='number'\n" +
    "               step=\"any\"\n" +
    "               name='{{numericCtrl.value}}'\n" +
    "               ng-class='((numericForm.$invalid && numericForm.$dirty) || (numericForm.$invalid && numericForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               ng-model='numericCtrl.value'\n" +
    "               ng-required='numericCtrl.validation.required'\n" +
    "               ng-minlength='numericCtrl.validation.minlength'\n" +
    "               ng-maxlength='numericCtrl.validation.maxlength'\n" +
    "               ng-pattern='numericCtrl.validation.pattern'\n" +
    "               ng-min='numericCtrl.validation.min'\n" +
    "               ng-max='numericCtrl.validation.max'\n" +
    "               ng-blur=\"numericCtrl.ngBlur()\"\n" +
    "               sit-change=\"numericCtrl.sitChange\"\n" +
    "               ng-disabled=\"numericCtrl.ngDisabled\"\n" +
    "               ng-focus=\"numericCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator />\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/overlay/overlay.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/overlay/overlay.html",
    "<div class=\"modal fade overlay-modal\" id={{overlayCtrl.modalid}} tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" data-backdrop=\"static\">\n" +
    "    <div class=\"overlay-dialog\">\n" +
    "        <div class=\"overlay-content\">\n" +
    "            <div class=\"overlay-header\">\n" +
    "                <span data-internal-type=\"overlay-header-content\" class=\"overlay-title\">{{overlayCtrl.title}}</span>\n" +
    "            </div>\n" +
    "                <div data-internal-type=\"overlay-text-content\" class=\"overlay-body\" style=\"white-space:pre-wrap\">{{overlayCtrl.modaltext}}</div>\n" +
    "            <div class=\"overlay-footer\">\n" +
    "                <div data-internal-type=\"overlay-buttons-content\" class=\"overlay-div-button\" ng-repeat=\"button in overlayCtrl.buttons\">\n" +
    "                    <sit-dialog-button sit-button=\"button\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/overlay/samples/overlay-dev-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/overlay/samples/overlay-dev-tpl.html",
    "<div ng-controller=\"OverlayController as overlayDevCtrl\">\n" +
    "\n" +
    "    <div class=\"container\"><br />\n" +
    "        <div>\n" +
    "            Title:\n" +
    "            <input value=\"Main instruction\" ng-model=\"title\">\n" +
    "\n" +
    "        </div><br />\n" +
    "        <div>\n" +
    "            Text:\n" +
    "            <textarea ng-model=\"modaltext\" cols=\"50\" rows=\"5\">\n" +
    "                uifhufhurhfurh\n" +
    "                </textarea>\n" +
    "        </div><br />\n" +
    "        <div style=\"display:inline\">\n" +
    "            <button class=\"btn btn-primary btn-lg\" ng-click=\"overlayDevCtrl.addApplyButton(true)\">\n" +
    "                Add apply button\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-primary btn-lg\" ng-click=\"overlayDevCtrl.addApplyButton(false)\">\n" +
    "                Delete apply button\n" +
    "            </button>\n" +
    "        </div><br /><br />\n" +
    "        <button class=\"btn btn-primary btn-lg\" ng-click=\"overlayDevCtrl.showOverlay('TestOverlay')\">\n" +
    "            Launch modal\n" +
    "        </button>\n" +
    "        <sit-overlay sit-modalid=\"TestOverlay\" sit-modaltext=\"modaltext\" sit-title=\"title\" sit-buttons=\"overlayDevCtrl.buttons\"></sit-overlay>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("common/widgets/overlay/samples/overlay-dev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/overlay/samples/overlay-dev.html",
    "<!DOCTYPE html>\n" +
    "<html data-ng-app=\"app\">\n" +
    "<head>\n" +
    "    <title data-ng-bind=\"title\">Overlay Development</title>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge, chrome=1\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />\n" +
    "\n" +
    "    <link href=\"/common/styles/common-dark.css\" rel=\"stylesheet\" />\n" +
    "\n" +
    "    <style>\n" +
    "        html, body {\n" +
    "            width: '100%';\n" +
    "            height: '100%';\n" +
    "        }\n" +
    "\n" +
    "        #test-container {\n" +
    "            border: 2px solid black;\n" +
    "            padding: 4px;\n" +
    "            margin: 4px;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"OverlayController as overlayDevCtrl\">\n" +
    "\n" +
    "    <div class=\"container\"><br />\n" +
    "        <div>\n" +
    "            Title:\n" +
    "            <input value=\"Main instruction\" ng-model=\"title\">\n" +
    "\n" +
    "        </div><br />\n" +
    "        <div>\n" +
    "            Text:\n" +
    "            <textarea ng-model=\"modaltext\" cols=\"50\" rows=\"5\">\n" +
    "                uifhufhurhfurh\n" +
    "                </textarea>\n" +
    "        </div><br />\n" +
    "        <div style=\"display:inline\">\n" +
    "            <button class=\"btn btn-primary btn-lg\" ng-click=\"overlayDevCtrl.addApplyButton(true)\">\n" +
    "                Add apply button\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-primary btn-lg\" ng-click=\"overlayDevCtrl.addApplyButton(false)\">\n" +
    "                Delete apply button\n" +
    "            </button>\n" +
    "        </div><br /><br />\n" +
    "        <button class=\"btn btn-primary btn-lg\" ng-click=\"overlayDevCtrl.showOverlay('TestOverlay')\">\n" +
    "            Launch modal\n" +
    "        </button>\n" +
    "        <sit-overlay sit-modalid=\"TestOverlay\" sit-modaltext=\"modaltext\" sit-title=\"title\" sit-buttons=\"overlayDevCtrl.buttons\"></sit-overlay>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Vendor Scripts -->\n" +
    "    <script src=\"/scripts/jquery-2.1.1.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular-animate.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular-route.js\"></script>\n" +
    "    <script src=\"/scripts/angular/angular-sanitize.js\"></script>\n" +
    "    <script src=\"/scripts/bootstrap.js\"></script>\n" +
    "    <script src=\"/scripts/angular-ui/ui-bootstrap-tpls.js\"></script>\n" +
    "    <script src=\"/scripts/angular-ui-router.js\"></script>\n" +
    "\n" +
    "    <!-- Bootstrapping -->\n" +
    "    <script src=\"/app/common/widgets/overlay/docs/overlay-app.js\"></script>\n" +
    "\n" +
    "    <!-- Property Grid Widget scripts -->\n" +
    "\n" +
    "    <script src=\"/app/common/widgets/dialogButton/sit-dialog-button-mod.js\"></script>\n" +
    "    <script src=\"/app/common/widgets/dialogButton/sit-dialog-button-dir.js\"></script>\n" +
    "    <script src=\"/app/common/widgets/overlay/sit-overlay-mod.js\"></script>\n" +
    "    <script src=\"/app/common/widgets/overlay/sit-overlay-svc.js\"></script>\n" +
    "    <script src=\"/app/common/widgets/overlay/sit-overlay-dir.js\"></script>\n" +
    "   \n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>");
}]);

angular.module("common/widgets/pager/pager.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/pager/pager.html",
    "<div id=\"pagerContainer\" data-internal-type=\"pagerContainer\" class=\"ngGrid ngFooterPanel\" ng-class=\"{'ui-widget-content': jqueryuitheme, 'ui-corner-bottom': jqueryuitheme}\" ng-style=\"pagerCtrl.footerStyle()\">\n" +
    "    <div class=\"ngTotalSelectContainer\">\n" +
    "        <div class=\"ngFooterTotalItems\" ng-class=\"{ngNoMultiSelect: !multiselect}\">\n" +
    "            <span class=\"ngLabel\" ng-show=\"pagerCtrl.pagingOptions.showTotalItems\">{{'pager.total-items' | translate}}: {{pagerCtrl.pagingOptions.totalItems}}</span>\n" +
    "            <span class=\"ngLabel\" ng-show=\"pagerCtrl.pagingOptions.showFilterItems\">({{'pager.filtered-items' | translate}}: {{pagerCtrl.pagingOptions.filterItems}})</span>\n" +
    "        </div>\n" +
    "        <div class=\"ngFooterSelectedItems\" ng-show=\"pagerCtrl.pagingOptions.showSelectedItems\">\n" +
    "            <span class=\"ngLabel\">{{'pager.selected-items' | translate}}: {{pagerCtrl.pagingOptions.selectedItems}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ngPagerContainer\" style=\"float: right; margin-top: 10px;\">\n" +
    "        <div style=\"float:left; margin-right: 10px;\" class=\"ngRowCountPicker\">\n" +
    "            <span style=\"float: left; margin-top: 5px; margin-right:5px\" class=\"ngLabel\">{{'pager.page-size' | translate}}:</span>\n" +
    "            <select style=\"float: left; height: 27px; width: 100px\" ng-model=\"pagerCtrl.pagingOptions.pageSize\" class=\"uyRowCountSelect\" ng-options=\"pageSize for pageSize in pagerCtrl.pagingOptions.pageSizes\">\n" +
    "                <!--<option ng-repeat=\"size in pagingOptions.pageSizes\">{{size}}</option>-->\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div style=\"float:left; margin-right: 10px; min-width: 135px;\" class=\"ngPagerControl\">\n" +
    "            <button type=\"button\" class=\"ngPagerButton\" ng-click=\"pagerCtrl.pageToFirst()\" ng-disabled=\"pagerCtrl.cantPageBackward()\" title=\"{{'pager.page-first' | translate}}\"><div class=\"ngPagerFirstTriangle\"><div class=\"ngPagerFirstBar\"></div></div></button>\n" +
    "            <button type=\"button\" class=\"ngPagerButton\" ng-click=\"pagerCtrl.pageBackward()\" ng-disabled=\"pagerCtrl.cantPageBackward()\" title=\"{{'pager.page-prev' | translate}}\"><div class=\"ngPagerFirstTriangle ngpagerprevtriangle\"></div></button>\n" +
    "            <div style=\"display:inline-block; vertical-align:top;\">\n" +
    "                <input ng-show=\"pagerCtrl.currentPage\" class=\"ngPagerCurrent\" min=\"1\" max=\"{{pagerCtrl.maxPage}}\" type=\"number\" style=\"width:50px; padding: 0 4px 0 4px; height:25px; min-height: 25px; font-size: 12px;\" ng-model=\"pagerCtrl.currentPage\" />\n" +
    "                <span class=\"ngGridMaxPagesNumber\" ng-show=\"pagerCtrl.maxPage > 0\">/ {{pagerCtrl.maxPage}}</span>\n" +
    "            </div>\n" +
    "            <button type=\"button\" class=\"ngPagerButton\" ng-click=\"pagerCtrl.pageForward()\" ng-disabled=\"pagerCtrl.cantPageForward()\" title=\"{{'pager.page-next' | translate}}\"><div class=\"ngPagerLastTriangle ngpagernexttriangle\"></div></button>\n" +
    "            <button type=\"button\" class=\"ngPagerButton\" ng-click=\"pagerCtrl.pageToLast()\" ng-disabled=\"pagerCtrl.cantPageToLast()\" title=\"{{'pager.page-last' | translate}}\"><div class=\"ngPagerLastTriangle\"><div class=\"ngPagerLastBar\"></div></div></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/password/password.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/password/password.html",
    "<ng-form name='textForm' ng-class=\"{'isrequired' : (passwordCtrl.validation.required) && passwordCtrl.value===undefined}\">\n" +
    "    <div class='property-grid-input-group'>\n" +
    "        <input type='password'\n" +
    "               name='{{passwordCtrl.name}}'\n" +
    "               ng-class='{\"validator-control-invalid\" : (textForm.$invalid && textForm.$dirty) || (textForm.$invalid && textForm.$visited) ,\n" +
    "                \"validator-control\" :  !( (textForm.$invalid && textForm.$dirty) || (textForm.$invalid && textForm.$visited) ) ,\n" +
    "                \"label-property-grid-control-readonly property-value-ellipsis\" : passwordCtrl.readOnly || passwordCtrl.ngReadonly}'\n" +
    "               ng-model='passwordCtrl.value'\n" +
    "               ng-required='passwordCtrl.validation.required'\n" +
    "               ng-minlength='passwordCtrl.validation.minlength'\n" +
    "               ng-maxlength='passwordCtrl.validation.maxlength'\n" +
    "               ng-pattern='passwordCtrl.validation.pattern'\n" +
    "               ng-blur=\"passwordCtrl.ngBlur()\"\n" +
    "               sit-change=\"passwordCtrl.sitChange\"\n" +
    "               ng-disabled=\"passwordCtrl.ngDisabled\"\n" +
    "               ng-focus=\"passwordCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator='Password'\n" +
    "               ng-readonly=\"passwordCtrl.ngReadonly\" />\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/propertyGrid/property-grid.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/propertyGrid/property-grid.html",
    "<!--Old Configuration-->\n" +
    "<div class=\"property-grid-container\" ng-if=\"!propertyGridCtrl.transclusionIsSet\">\n" +
    "    <sit-property-grid-layout ng-if=\"propertyGridCtrl.layout === 'Vertical'\"\n" +
    "                                sit-id=\"{{propertyGridCtrl.id}}\"\n" +
    "                                sit-mode=\"{{propertyGridCtrl.mode}}\"\n" +
    "                                sit-data=\"propertyGridCtrl.data\"\n" +
    "                                class=\"property-grid-vertical-layout\">\n" +
    "    </sit-property-grid-layout>\n" +
    "    <sit-property-grid-layout ng-if=\"propertyGridCtrl.layout === 'Horizontal' && propertyGridCtrl.type === 'Fixed'\"\n" +
    "                                sit-id=\"{{propertyGridCtrl.id}}\"\n" +
    "                                sit-mode=\"{{propertyGridCtrl.mode}}\"\n" +
    "                                sit-data=\"propertyGridCtrl.data\"\n" +
    "                                ng-attr-class=\"{{propertyGridCtrl.columns !== 0 ? 'property-grid-horizontal-fixed-layout x' + propertyGridCtrl.columns : 'property-grid-horizontal-fixed-layout'}}\">\n" +
    "    </sit-property-grid-layout>\n" +
    "    <sit-property-grid-layout ng-if=\"propertyGridCtrl.layout === 'Horizontal' && propertyGridCtrl.type === 'Fluid'\"\n" +
    "                                sit-id=\"{{propertyGridCtrl.id}}\"\n" +
    "                                sit-mode=\"{{propertyGridCtrl.mode}}\"\n" +
    "                                sit-data=\"propertyGridCtrl.data\"\n" +
    "                                class=\"property-grid-horizontal-fluid-layout\">\n" +
    "    </sit-property-grid-layout>\n" +
    "\n" +
    "    <div ng-if=\"propertyGridCtrl.layout === 'Horizontal' && (propertyGridCtrl.type !== 'Fixed' && propertyGridCtrl.type !== 'Fluid')\">\n" +
    "        {{'propertyGrid.invalidLayout'|translate}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--New Configuration-->\n" +
    "\n" +
    "<div class=\"property-grid-container\" ng-if=\"propertyGridCtrl.transclusionIsSet\">\n" +
    "    <form name=\"{{'Form'+propertyGridCtrl.id}}\">\n" +
    "        <sit-property-grid-layout ng-if=\"propertyGridCtrl.layout === 'Vertical'\" \n" +
    "                                  sit-id=\"{{propertyGridCtrl.id}}\"\n" +
    "                                  sit-mode=\"{{propertyGridCtrl.mode}}\" \n" +
    "                                  class=\"property-grid-vertical-layout\" ng-transclude>\n" +
    "        </sit-property-grid-layout>\n" +
    "        <sit-property-grid-layout ng-if=\"propertyGridCtrl.layout === 'Horizontal' && propertyGridCtrl.type === 'Fixed'\"\n" +
    "                                  sit-id=\"{{propertyGridCtrl.id}}\"\n" +
    "                                  sit-mode=\"{{propertyGridCtrl.mode}}\"\n" +
    "                                  ng-attr-class=\"{{propertyGridCtrl.columns !== 0 ? 'property-grid-horizontal-fixed-layout x' + propertyGridCtrl.columns : 'property-grid-horizontal-fixed-layout'}}\" ng-transclude>\n" +
    "        </sit-property-grid-layout>\n" +
    "        <sit-property-grid-layout ng-if=\"propertyGridCtrl.layout === 'Horizontal' && propertyGridCtrl.type === 'Fluid'\"\n" +
    "                                  sit-id=\"{{propertyGridCtrl.id}}\"\n" +
    "                                  sit-mode=\"{{propertyGridCtrl.mode}}\"\n" +
    "                                  class=\"property-grid-horizontal-fluid-layout\" ng-transclude>\n" +
    "        </sit-property-grid-layout>\n" +
    "        <div ng-if=\"propertyGridCtrl.layout === 'Horizontal' && (propertyGridCtrl.type !== 'Fixed' && propertyGridCtrl.type !== 'Fluid')\">\n" +
    "            {{'propertyGrid.invalidLayout'|translate}}\n" +
    "        </div>\n" +
    "    </form>    \n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/propertyGrid/property.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/propertyGrid/property.html",
    "<div class=\"property\">\n" +
    "    <div ng-class=\"[{ asterisk_req:propertyCtrl.sitRequired || (propertyCtrl.validation && propertyCtrl.validation.required)},\n" +
    "         { VERTICAL: 'vertical-property-grid-control-label',\n" +
    "           HORIZONTAL: { FLUID: 'property-grid-col-label-fluid',\n" +
    "                         FIXED: 'property-grid-col-label-fixed'\n" +
    "                        }[propertyCtrl.parentScope.type]\n" +
    "        }[propertyCtrl.parentScope.layout]]\"><span ng-transclude></span></div>\n" +
    "    <div ng-if=\"propertyCtrl.isMultiValueWidget && propertyCtrl.value.length === 0 && !(propertyCtrl.readOnly || propertyCtrl.ngReadonly)\">\n" +
    "        <a class=\"btn btn-link\" ng-click=\"propertyCtrl.addWidgetInstance(0)\">{{'propertyGrid.property.addItem'|translate}}</a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"propertyCtrl.isMultiValueWidget\"\n" +
    "         ng-class=\"{HORIZONTAL: { FLUID: 'property-grid-col-value-fluid', FIXED: 'property-grid-col-value-fixed'}[propertyCtrl.parentScope.type]}[propertyCtrl.parentScope.layout]\">\n" +
    "        <div ng-repeat=\"item in propertyCtrl.value track by $index\" ng-class=\"{'property-grid-control-div': !(propertyCtrl.ngReadonly || propertyCtrl.readOnly)}\">\n" +
    "            <div ng-hide=\"propertyCtrl.ngReadonly || propertyCtrl.readOnly\" class=\"property-grid-icons-div\">\n" +
    "                <span title=\"{{propertyCtrl.addBtnTitle}}\" class=\"property-grid-icon-add\" ng-click=\"propertyCtrl.addWidgetInstance($index)\" ng-disabled=\"propertyCtrl.value.length === propertyCtrl.maxItems\"><i class=\"fa fa-plus\"></i></span>\n" +
    "                <span title=\"{{propertyCtrl.removeBtnTitle}}\" class=\"property-grid-icon-remove\" ng-click=\"propertyCtrl.removeWidgetInstance($index)\" ng-disabled=\"propertyCtrl.value.length <= propertyCtrl.minItems\"><i class=\"fa fa-times\"></i></span>\n" +
    "            </div>\n" +
    "            <div ng-class=\"{ 'property-grid-item-div': !(propertyCtrl.ngReadonly || propertyCtrl.readOnly), 'property-grid-item-div-readonly': (propertyCtrl.ngReadonly || propertyCtrl.readOnly) }\">\n" +
    "                <sit-property-item sit-widget=\"{{propertyCtrl.sitWidget}}\" sit-id=\"propertyCtrl.sitId\"\n" +
    "                                   sit-name=\"{{propertyCtrl.name+$index}}\"\n" +
    "                                   sit-value=\"propertyCtrl.value[$index]\"\n" +
    "                                   sit-validation=\"propertyCtrl.validation\"\n" +
    "                                   sit-read-only=\"propertyCtrl.readOnly\"\n" +
    "                                   sit-placeholder=\"propertyCtrl.placeholder\"\n" +
    "                                   sit-limit=\"propertyCtrl.limit\"\n" +
    "                                   sit-template-url=\"propertyCtrl.templateUrl\"\n" +
    "                                   sit-selected-attribute-to-display=\"propertyCtrl.selectedAttributeToDisplay\"\n" +
    "                                   sit-options=\"propertyCtrl.options\"\n" +
    "                                   sit-to-display=\"propertyCtrl.toDisplay\"\n" +
    "                                   sit-to-keep=\"propertyCtrl.toKeep\"\n" +
    "                                   sit-datasource=\"propertyCtrl.sitDatasource\"\n" +
    "                                   sit-selected-object=\"propertyCtrl.sitSelectedObject\"\n" +
    "                                   sit-editable=\"propertyCtrl.sitEditable\"\n" +
    "                                   accept=\"propertyCtrl.accept\"\n" +
    "                                   sit-min-size=\"propertyCtrl.sitMinSize\"\n" +
    "                                   sit-max-size=\"propertyCtrl.sitMaxSize\"\n" +
    "                                   sit-selected-string=\"propertyCtrl.sitSelectedString\"\n" +
    "                                   sit-split-list=\"propertyCtrl.sitSplitList\"\n" +
    "                                   sit-done-callback=\"propertyCtrl.sitDoneCallback\"\n" +
    "                                   sit-format=\"propertyCtrl.format\"\n" +
    "                                   sit-append-to-body=\"propertyCtrl.appendToBody\"\n" +
    "                                   sit-show-button-bar=\"propertyCtrl.showButtonBar\"\n" +
    "                                   sit-show-weeks=\"propertyCtrl.showWeeks\"\n" +
    "                                   sit-show-meridian=\"propertyCtrl.showMeridian\"\n" +
    "                                   sit-widget-attributes=\"propertyCtrl.widgetAttributes\"\n" +
    "                                   ng-blur=\"propertyCtrl.ngBlur()\"\n" +
    "                                   sit-change=\"propertyCtrl.sitChange\"\n" +
    "                                   ng-disabled=\"propertyCtrl.ngDisabled\"\n" +
    "                                   ng-focus=\"propertyCtrl.ngFocus()\"\n" +
    "                                   ng-readonly=\"propertyCtrl.ngReadonly\"\n" +
    "                                   ng-model=\"propertyCtrl.value[$index]\"\n" +
    "                                   sit-required=\"propertyCtrl.sitRequired\"\n" +
    "                                   class=\"property-grid-input-group\">\n" +
    "                </sit-property-item>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!propertyCtrl.isMultiValueWidget\"\n" +
    "         ng-class=\"{HORIZONTAL: { FLUID: 'property-grid-col-value-fluid', FIXED: 'property-grid-col-value-fixed'}[propertyCtrl.parentScope.type]}[propertyCtrl.parentScope.layout]\">\n" +
    "        <sit-property-item sit-widget=\"{{propertyCtrl.sitWidget}}\" sit-id=\"propertyCtrl.sitId\"\n" +
    "                           sit-name=\"{{propertyCtrl.name}}\"\n" +
    "                           sit-value=\"propertyCtrl.value\"\n" +
    "                           sit-validation=\"propertyCtrl.validation\"\n" +
    "                           sit-read-only=\"propertyCtrl.readOnly\"\n" +
    "                           sit-placeholder=\"propertyCtrl.placeholder\"\n" +
    "                           sit-limit=\"propertyCtrl.limit\"\n" +
    "                           sit-template-url=\"propertyCtrl.templateUrl\"\n" +
    "                           sit-selected-attribute-to-display=\"propertyCtrl.selectedAttributeToDisplay\"\n" +
    "                           sit-options=\"propertyCtrl.options\"\n" +
    "                           sit-to-display=\"propertyCtrl.toDisplay\"\n" +
    "                           sit-to-keep=\"propertyCtrl.toKeep\"\n" +
    "                           sit-datasource=\"propertyCtrl.sitDatasource\"\n" +
    "                           sit-selected-object=\"propertyCtrl.sitSelectedObject\"\n" +
    "                           sit-editable=\"propertyCtrl.sitEditable\"\n" +
    "                           accept=\"propertyCtrl.accept\"\n" +
    "                           sit-min-size=\"propertyCtrl.sitMinSize\"\n" +
    "                           sit-max-size=\"propertyCtrl.sitMaxSize\"\n" +
    "                           sit-selected-string=\"propertyCtrl.sitSelectedString\"\n" +
    "                           sit-split-list=\"propertyCtrl.sitSplitList\"\n" +
    "                           sit-done-callback=\"propertyCtrl.sitDoneCallback\"\n" +
    "                           sit-format=\"propertyCtrl.format\"\n" +
    "                           sit-append-to-body=\"propertyCtrl.appendToBody\"\n" +
    "                           sit-show-button-bar=\"propertyCtrl.showButtonBar\"\n" +
    "                           sit-show-weeks=\"propertyCtrl.showWeeks\"\n" +
    "                           sit-show-meridian=\"propertyCtrl.showMeridian\"\n" +
    "                           sit-widget-attributes=\"propertyCtrl.widgetAttributes\"\n" +
    "                           ng-blur=\"propertyCtrl.ngBlur()\"\n" +
    "                           sit-change=\"propertyCtrl.sitChange\"\n" +
    "                           ng-disabled=\"propertyCtrl.ngDisabled\"\n" +
    "                           ng-focus=\"propertyCtrl.ngFocus()\"\n" +
    "                           ng-readonly=\"propertyCtrl.ngReadonly\"\n" +
    "                           ng-model=\"propertyCtrl.value\"\n" +
    "                           sit-required=\"propertyCtrl.sitRequired\"\n" +
    "                           class=\" property-grid-input-group\">\n" +
    "        </sit-property-item>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/radio/radio.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/radio/radio.html",
    "<div class=\"label label-property-grid-control-readonly property-value-ellipsis\" ng-if=\"radioCtrl.readOnly || radioCtrl.ngReadonly\">\n" +
    "    {{radioCtrl.value}}\n" +
    "</div>\n" +
    "\n" +
    "<ng-form ng-if=\"!(radioCtrl.readOnly || radioCtrl.ngReadonly)\" name=\"radioForm\" ng-class=\"{'isrequired' :(radioCtrl.validation.required) && radioCtrl.value===undefined}\">\n" +
    "    <div class=\"property-grid-span-group-block validator-control\" ng-model=\"radioCtrl.value\">\n" +
    "        <div class=\"radiogroup group-control\" ng-repeat=\"val in radioCtrl.options\" ng-checked=\"radioCtrl.value === val.value\">\n" +
    "            <div class=\"group-control-data\">\n" +
    "                <input type='radio'\n" +
    "                       name='{{radioCtrl.name}}'\n" +
    "                       ng-model='radioCtrl.value'\n" +
    "                       ng-required=\"radioCtrl.validation.required\"\n" +
    "                       ng-value='val.value'\n" +
    "                       ng-blur=\"radioCtrl.ngBlur()\"\n" +
    "                       sit-change=\"radioCtrl.sitChange\"\n" +
    "                       ng-disabled=\"radioCtrl.ngDisabled\"\n" +
    "                       ng-focus=\"radioCtrl.ngFocus()\"\n" +
    "                       ng-readonly=\"radioCtrl.ngReadOnly\"\n" +
    "                       shared-model=\"true\"\n" +
    "                       sit-form-input-validator />\n" +
    "                <span>{{val.label}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/select/select.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/select/select.html",
    "<div class=\"label label-property-grid-control-readonly property-value-ellipsis\" ng-if=\"selectCtrl.readOnly || selectCtrl.ngReadonly\">\n" +
    "    {{selectCtrl.readValue}}\n" +
    "</div>\n" +
    "\n" +
    "<ng-form ng-if=\"!(selectCtrl.readOnly || selectCtrl.ngReadonly)\" name='selectForm' ng-class=\"{'isrequired' : (selectCtrl.validation.required) && selectCtrl.value===undefined}\">\n" +
    "    <div class='property-grid-input-group'>\n" +
    "        <select ng-model='selectCtrl.value'\n" +
    "                ng-class='((selectForm.$invalid && selectForm.$dirty) || (selectForm.$invalid && selectForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "                ng-options='val[\"{{selectCtrl.toDisplay}}\"] group by val[\"{{selectCtrl.sitToGroup}}\"] for val in selectCtrl.options track by val[\"{{selectCtrl.toKeep}}\"]'\n" +
    "                ng-required='selectCtrl.validation.required'\n" +
    "                ng-blur=\"selectCtrl.ngBlur()\"\n" +
    "                sit-change=\"selectCtrl.sitChange\"\n" +
    "                ng-disabled=\"selectCtrl.ngDisabled\"\n" +
    "                ng-focus=\"selectCtrl.ngFocus()\"\n" +
    "                ng-selected=\"selectCtrl.ngSelected\"\n" +
    "                sit-form-input-validator />\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/sidebar/scroll.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/sidebar/scroll.html",
    "<div class=\"sitscroll up\" ng-show=\"scrollCtrl.isEnabled && scrollCtrl.display\">\n" +
    "    <i class=\"fa fa-stack-1x fa-sort-up\"></i>\n" +
    "</div>\n" +
    "<div class=\"sitscroll body\" ng-transclude></div>\n" +
    "<div class=\"sitscroll down\" ng-show=\"scrollCtrl.isEnabled && scrollCtrl.display\">\n" +
    "    <i class=\"fa fa-stack-1x fa-sort-down\"></i>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/sidebar/sidebar-item.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/sidebar/sidebar-item.html",
    "<sit-scroll sit-enable=\"{{itemCtrl.type == 'static'}}\" sit-on-reload=\"common.sidebar.sitSidebar.initilize\">\n" +
    "    <div class=\"sidebar-items\" ng-if=\"itemCtrl.source && itemCtrl.source.length\">\n" +
    "        <div ng-class=\"itemCtrl.type\">\n" +
    "            <ul class=\"nav nav-sidebar\">\n" +
    "                <li ng-repeat=\"item in itemCtrl.source track by $index\"\n" +
    "                    ng-click=\"itemCtrl.click(itemCtrl,item)\"\n" +
    "                    data-toggle=\"sidebar\" ng-hide=\"item.display==false\"\n" +
    "                    title=\"{{item.translatedTitle}}\"\n" +
    "                    class=\"sidebar-item-{{item.id}}\"\n" +
    "                    ng-class=\"{select: item.id===itemCtrl.selected || itemCtrl.isChildrenSelected(item, itemCtrl.selected), parent: item.contents && item.contents.length}\">\n" +
    "                    <a>\n" +
    "                        <i class=\"fa\" ng-class=\"item.icon\"></i>\n" +
    "                        <span class=\"text\" ng-bind=\"item.translatedTitle\" ng-if=\"item.title\"></span>\n" +
    "                        <span class=\"right-caret\" ng-if=\"item.contents && item.contents.length\"></span>\n" +
    "                    </a>\n" +
    "                    <div ng-if=\"item.contents && item.contents.length\"\n" +
    "                         ng-class=\"{'children':item.contents && item.contents.length}\" style=\"top:25px\" >\n" +
    "                        <h3 ng-bind=\"item.translatedTitle\"></h3>\n" +
    "                        <sit-sidebar-item sit-source=\"item.contents\" sit-selected=\"itemCtrl.selected\" sit-environment=\"itemCtrl.environment\">\n" +
    "                        </sit-sidebar-item>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</sit-scroll>\n" +
    "");
}]);

angular.module("common/widgets/sidebar/sidebar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/sidebar/sidebar.html",
    "<div class=\"sidebar\" ng-class=\"{'open':sidebar.options.isExpanded}\" ng-transclude></div>\n" +
    "");
}]);

angular.module("common/widgets/sidePanel/sidepanel.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/sidePanel/sidepanel.html",
    "<div class=\"side-panel-container\">\n" +
    "    <div class=\"side-panel-top\">\n" +
    "        <div class=\"side-panel-header\">\n" +
    "            <span class=\"side-panel-header-text\">{{sidepanelCtrl.title}}</span>\n" +
    "            <button type=\"button\" class=\"side-panel-close-btn\" ng-show=\"sidepanelCtrl.isCloseButtonShown\" ng-click=\"sidepanelCtrl.closeSidepanel()\" title=\"{{sidepanelCtrl.closeButtonTooltip}}\">\n" +
    "                <i class=\"fa fa-times fa-2x\" aria-hidden=\"true\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"side-panel-buttons\" ng-if=\"(sidepanelCtrl.sidepanelCommandButtons.bar.length !== 0 || sidepanelCtrl.sidepanelActionButtons.bar.length !== 0)\">\n" +
    "            <div class=\"side-panel-commands\">\n" +
    "                <sit-command-bar sit-commands=\"sidepanelCtrl.sidepanelCommandButtons\"></sit-command-bar>\n" +
    "            </div>\n" +
    "            <div class=\"side-panel-actions\">\n" +
    "                <sit-command-bar sit-commands=\"sidepanelCtrl.sidepanelActionButtons\" sit-label-align=\"right\"></sit-command-bar>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"side-panel-content\" ng-class=\"sidepanelCtrl.sidepanelCommandButtons.bar.length === 0 && sidepanelCtrl.sidepanelActionButtons.bar.length === 0 ? 'content-height' : 'content-button-height'\">\n" +
    "        <div class=\"side-panel-custom\" ng-transclude></div>\n" +
    "        <div ng-hide=\"!sidepanelCtrl.messages.length\">\n" +
    "            <p class=\"side-panel-message\" ng-repeat=\"message in sidepanelCtrl.messages\" ng-class=\"{\n" +
    "             'admonition admonition-warning':message.type=='warning',\n" +
    "             'admonition admonition-info':message.type=='info'}\">\n" +
    "                <span>{{message.text}}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/sortableAccordion/sortable-accordion.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/sortableAccordion/sortable-accordion.html",
    "<!-- item.templateUrl (e.g. group-template.html) is the intended template url to be loaded inside accordion -->\n" +
    "<!-- homeTemplate.html is the html that defines the structure of the accordion content. Acts like the skeleton of the content and holds userTemplate.html inside it. -->\n" +
    "<!-- userTemplate.html is the html that holds the item.templateUrl as the content and rendered inside homeTemplate.html.\n" +
    "    It acts like a wrapper for item.templateUrl -->\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"homeTemplate.html\">\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <h4 class=\"panel-title\">\n" +
    "                <a href=\"\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" uib-accordion-transclude=\"heading\">\n" +
    "                    <span uib-accordion-header style=\"display:block\" ng-class=\"{'text-muted': isDisabled}\">\n" +
    "                        {{heading}}\n" +
    "                    </span>\n" +
    "                </a>\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "        <div class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
    "            <div class=\"panel-body\" style=\"text-align:center\" ng-transclude></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<uib-accordion class=\"sortHead\" close-others=\"sortAccCtrl.closeOthers\">\n" +
    "    <ul class=\"nestingAccordionCustom\" ui-sortable=\"sortAccCtrl.sortableOptions\" ng-model=\"sortAccCtrl.items\">\n" +
    "        <li ng-repeat=\"item in sortAccCtrl.items\" style=\"padding-top: 5px;\">\n" +
    "            <script type=\"text/ng-template\" id=\"userTemplate.html\" ng-bind=\"item.templateUrl\">\n" +
    "                <div ng-include=\"item.templateUrl\" /> <!-- Passing the html template corresponding to heading -->\n" +
    "            </script>\n" +
    "            <div uib-accordion-group class=\"accordion_content\" heading=\"{{item.headerName}}\" style=\"margin-left: -20px;\" is-disabled=\"sortAccCtrl.status.isFirstDisabled\" template-url=\"homeTemplate.html\">\n" +
    "                <div ng-include=\"'userTemplate.html'\"></div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</uib-accordion>\n" +
    "<style>\n" +
    "    .nestingAccordionCustom {\n" +
    "        list-style: none;\n" +
    "        margin-left: -20px;\n" +
    "        margin-bottom: -15px;\n" +
    "    }\n" +
    "</style>\n" +
    "");
}]);

angular.module("common/widgets/status/status.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/status/status.html",
    "<div class=\"status\">\n" +
    "   <h3> {{statusCtrl.title}} </h3> \n" +
    "<div class=\"subdesc\">\n" +
    "    <div class=\"admonition admonition-info\">{{statusCtrl.desc}}</div>\n" +
    "    <div class=\"body\">\n" +
    "        <div class=\"chart-container\" ng-if=\"statusCtrl.chart == 'true'\">\n" +
    "            <div class=\"pie-wrapper\" ng-class=\"statusCtrl.progressCSSClass\">\n" +
    "                <span class=\"label\">{{statusCtrl.progressValue}}<span class=\"smaller\">%</span><span class=\"total\">TOTAL</span></span>\n" +
    "                <div class=\"pie\">\n" +
    "                    <div class=\"left-side half-circle\"></div>\n" +
    "                    <div class=\"right-side half-circle\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"shadow\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"properties\">\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"prop in statusCtrl.properties track by $index\"> {{prop.name}} <span class=\"badge\">{{prop.value}}</span></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/switchButton/switch-button.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/switchButton/switch-button.html",
    "<div ng-repeat=\"button in switchButtonCtrl.buttons\"\n" +
    "     ng-class=\"'switch-button' + (button.selected ? ' switch-button-select' : '') + switchButtonCtrl.getMarginClass($index)\"\n" +
    "     ng-click=\"switchButtonCtrl.buttonClicked($index)\">\n" +
    "    <i ng-class=\"'fa ' + button.faIcon\"></i>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/table/table-button.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/table/table-button.html",
    "<button tablebuttonclick=\"tableBtnCtrl.buttonClicked(tableBtnCtrl);\" title=\"{{tableBtnCtrl.label}}\" ng-class=\"[{'toggle': tableBtnCtrl.type === 'toggle' && tableBtnCtrl.selected}]\" class=\"CommandToolButton toggleToolButton tableButton\">\n" +
    "    <span class=\"fa-lg\">\n" +
    "        <i class=\"fa {{tableBtnCtrl.icon}}\"></i>\n" +
    "    </span>\n" +
    "    <!--<span style=\"display:block;\" class=\"MainCommandToolLabel\">{{tableBtnCtrl.label}}</span>-->\n" +
    "</button>\n" +
    "");
}]);

angular.module("common/widgets/table/table-filterbar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/table/table-filterbar.html",
    "<div class=\"sit-table-filterbar\">\n" +
    "    <div id=\"filterBar\" data-internal-type=\"filterBar\" class=\"filterBar-container\">\n" +
    "        <sit-filter-bar sit-filter-options=\"sitTableFilterbarCtrl.filterOptions\"></sit-filter-bar>\n" +
    "    </div>\n" +
    "    <div id=\"filter\" class=\"filter-container\" ng-class=\"sitTableFilterbarCtrl.showFilter ? 'open' : 'closed'\" data-internal-type=\"filter\">\n" +
    "        <sit-filter ng-if=\"sitTableFilterbarCtrl.filterOptions.filterFields.length > 0\" sit-clauses=\"sitTableFilterbarCtrl.filterClauses\" sit-filter-server-side=\"sitTableFilterbarCtrl.serverData\" sit-filter-fields=\"sitTableFilterbarCtrl.filterOptions.filterFields\" sit-filter-options=\"sitTableFilterbarCtrl.filterSearchOptions\" sit-apply-callback=\"sitTableFilterbarCtrl.applyFilter(clauses)\" sit-reset-callback=\"sitTableFilterbarCtrl.resetFilter()\"></sit-filter>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/table/table-with-group.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/table/table-with-group.html",
    "<tbody>\n" +
    "    <tr ng-repeat-start=\"row in rowCollection\">\n" +
    "        <td ng-click=\"show = !show\">\n" +
    "            > {{row.key}} ({{row.items.length}})\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr ng-if=\"show\" ng-repeat=\"row in row.items\" sit-select-row=\"row\"></tr>\n" +
    "    <tr ng-repeat-end=\"\" ng-if=\"false\"></tr>\n" +
    "</tbody>");
}]);

angular.module("common/widgets/text/text.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/text/text.html",
    "<div ng-if=\"textCtrl.readOnly || textCtrl.ngReadonly\" class=\"label-property-grid-control-readonly property-value-ellipsis\"> {{textCtrl.value}} </div>\n" +
    "\n" +
    "<ng-form name='textForm' ng-if=\"!(textCtrl.readOnly || textCtrl.ngReadonly)\" ng-class=\"{'isrequired' :(textCtrl.validation.required) && textCtrl.value!==undefined}\">\n" +
    "    <div class='property-grid-input-group'> \n" +
    "        <input type='text'\n" +
    "               ng-class='((textForm.$invalid && textForm.$dirty) || (textForm.$invalid && textForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               ng-model='textCtrl.value'\n" +
    "               ng-required='textCtrl.validation.required'\n" +
    "               ng-minlength='textCtrl.validation.minlength'\n" +
    "               ng-maxlength='textCtrl.validation.maxlength'\n" +
    "               ng-pattern='textCtrl.validation.pattern'\n" +
    "               ng-blur=\"textCtrl.ngBlur()\"\n" +
    "               sit-change=\"textCtrl.sitChange\"\n" +
    "               ng-disabled=\"textCtrl.ngDisabled\"\n" +
    "               ng-focus=\"textCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator />\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/textarea/textarea.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/textarea/textarea.html",
    "<div class=\"label-property-grid-control-readonly textarea-control-readonly\" ng-if=\"textareaCtrl.readOnly || textareaCtrl.ngReadonly\"> {{textareaCtrl.value}} </div>\n" +
    "\n" +
    "<ng-form name='textForm' ng-if=\"!(textareaCtrl.readOnly || textareaCtrl.ngReadonly)\" ng-class=\"{'isrequired' :(textareaCtrl.validation.required) && textareaCtrl.value===undefined}\">\n" +
    "    <div class='property-grid-input-group'>\n" +
    "        <textarea name='{{textareaCtrl.value}}'\n" +
    "                  ng-class='((textForm.$invalid && textForm.$dirty) || (textForm.$invalid && textForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "                  ng-model='textareaCtrl.value'\n" +
    "                  ng-required='textareaCtrl.validation.required'\n" +
    "                  ng-minlength='textareaCtrl.validation.minlength'\n" +
    "                  ng-maxlength='textareaCtrl.validation.maxlength'\n" +
    "                  ng-pattern='textareaCtrl.validation.pattern'\n" +
    "                  ng-blur=\"textareaCtrl.ngBlur()\"\n" +
    "                  sit-change=\"textareaCtrl.sitChange\"\n" +
    "                  ng-disabled=\"textareaCtrl.ngDisabled\"\n" +
    "                  ng-focus=\"textareaCtrl.ngFocus()\"\n" +
    "                  sit-form-input-validator\n" +
    "                  style=\"resize:vertical\"></textarea>\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/tiles/action-tile.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/action-tile.html",
    "<div class=\"tile\" ng-switch on=\"actnTileCtrl.tileContent.size\" ng-click=\"actnTileCtrl.tileClicked()\">\n" +
    "    <div data-internal-type=\"wideActionTile\" class='wide wide-action' ng-switch-when='wide' ng-style=\"{color: actnTileCtrl.color, 'background-color': actnTileCtrl.bgColor}\">\n" +
    "        <div class=\"image-container-96x96\" data-internal-type=\"image-container\">\n" +
    "            <div class=\"image-vcenter-96x96\" data-internal-type=\"image-vcenter\">\n" +
    "                <i ng-if=\"actnTileCtrl.tileContent.image\" class=\"fa {{actnTileCtrl.tileContent.image}}\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <span class=\"wide-action-text\" data-internal-type=\"title\">{{actnTileCtrl.getDisplayText()}}</span>\n" +
    "        <span class=\"wide-action-counter\" data-internal-type=\"counter\">{{actnTileCtrl.tileContent.count | limitTo:4}}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-internal-type=\"squareActionTile\" class='square' ng-switch-when='square' ng-style=\"{color: actnTileCtrl.color, 'background-color': actnTileCtrl.bgColor}\">\n" +
    "        <div class=\"image-container-96x96\" data-internal-type=\"image-container\">\n" +
    "            <div class=\"image-vcenter-96x96\" data-internal-type=\"image-vcenter\">\n" +
    "                <i ng-if=\"actnTileCtrl.tileContent.image\" class=\"fa {{actnTileCtrl.tileContent.image}}\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"square-text\" data-internal-type=\"title\">{{actnTileCtrl.getDisplayText()}}</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-internal-type=\"squareShortcutActionTile\" class='square-shortcut' ng-switch-when='square-shortcut' ng-style=\"{color: actnTileCtrl.color, 'background-color': actnTileCtrl.bgColor}\">\n" +
    "        <div class=\"square-text square-shortcut-text\" data-internal-type=\"title\">{{actnTileCtrl.getDisplayText()}}</div>\n" +
    "        <div class=\"shortcut-image-container\" data-internal-type=\"image-container\">\n" +
    "            <i class=\"fa fa-share fa-2x\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-internal-type=\"squareSummaryActionTile\" class='square-summary' ng-switch-when='square-summary' ng-style=\"{color: actnTileCtrl.color, 'background-color': actnTileCtrl.bgColor}\">\n" +
    "        <div class=\"summary-text\" data-internal-type=\"counter\">{{actnTileCtrl.getSummaryCountText()}}</div>\n" +
    "        <div class=\"category-text\" data-internal-type=\"title\">{{actnTileCtrl.getDisplayText()}}</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-internal-type=\"smallActionTile\" class='small small-action' ng-switch-when=\"small\" ng-style=\"{color: actnTileCtrl.color, 'background-color': actnTileCtrl.bgColor}\">\n" +
    "        <div class=\"image-container-48x48\" data-internal-type=\"image-container\">\n" +
    "            <div class=\"image-vcenter-48x48\" data-internal-type=\"image-vcenter\">\n" +
    "                <i ng-if=\"actnTileCtrl.tileContent.image\" class=\"fa {{actnTileCtrl.tileContent.image}} fa-3x\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/tiles/custom-tile-item.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/custom-tile-item.html",
    "<div ng-attr-data-internal-type=\"{{itemTileCtrl.template == 'large'? 'largeItemTile' : itemTileCtrl.template == 'wide'? 'wideItemTile' : 'mediumItemTile'}}\" class=\"tile\" ng-click=\"itemTileCtrl.tileClicked()\">\n" +
    "    <div data-internal-type='custom-template-container' ng-class=\"{'large large-item' : itemTileCtrl.template == 'large','wide wide-item' : itemTileCtrl.template == 'wide','medium medium-item' : itemTileCtrl.template == 'medium' }\" class='{{itemTileCtrl.selectClass}}' ng-style=\"{'color': itemTileCtrl.color, 'background-color': itemTileCtrl.bgColor}\">\n" +
    "\n" +
    "        <div ng-class=\"{'large-select' : itemTileCtrl.template == 'large','wide-select' : itemTileCtrl.template == 'wide','medium-select' : itemTileCtrl.template == 'medium' }\" ng-show=\"itemTileCtrl.showSelectCheck()\"></div>\n" +
    "        <div ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-corner-triangle\" data-internal-type=\"selection-triangle\"></div>\n" +
    "        <span ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-select-img fa fa-check fa-lg fa-inverse\" data-internal-type=\"selection-check\"></span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/tiles/item-tile.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/item-tile.html",
    "<div class='item-tile-wrapper' ng-include=\"'common/widgets/tiles/'+ itemTileCtrl.tempalteUrl\" onload=\"itemTileCtrl.templateLoaded()\" />\n" +
    "\n" +
    "");
}]);

angular.module("common/widgets/tiles/large-tile-item.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/large-tile-item.html",
    "<div data-internal-type=\"largeItemTile\" class=\"tile\" ng-click=\"itemTileCtrl.tileClicked()\" title=\"{{itemTileCtrl.displayTooltip}}\">\n" +
    "    <div class='large large-item {{itemTileCtrl.selectClass}}' ng-style=\"{'color': itemTileCtrl.color, 'background-color': itemTileCtrl.bgColor}\">\n" +
    "        <div class=\"large-select\" ng-show=\"itemTileCtrl.showSelectCheck()\"></div>\n" +
    "        <div ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-corner-triangle\" data-internal-type=\"selection-triangle\"></div>\n" +
    "        <span ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-select-img fa fa-check fa-lg fa-inverse\" data-internal-type=\"selection-check\"></span>\n" +
    "        <div class=\"large-item-image-container-86x86\" data-internal-type=\"image-container\">\n" +
    "            <div class=\"large-item-image-vcenter-62x62\" data-internal-type=\"image-vcenter\">\n" +
    "                <div ng-if=\"itemTileCtrl.tileContent.image && !itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-4x {{itemTileCtrl.tileContent.image}}\"></div>\n" +
    "                <div ng-if=\"itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-4x\" ng-bind-html=\"itemTileCtrl.tileContent.imageTemplate\"></div>\n" +
    "            </div>\n" +
    "            <span ng-if=\"itemTileCtrl.tileContent.contentStatus ==='editing'\" class=\"bottom-left-status-img fa fa-certificate fa-lg\" />\n" +
    "            <span ng-if=\"itemTileCtrl.tileContent.contentStatus ==='warning'\" class=\"bottom-left-status-img fa fa-warning fa-lg\" />\n" +
    "        </div>\n" +
    "        <div class=\"large-item-title-container\">\n" +
    "            <div class=\"item-title-vcenter\" data-internal-type=\"title\">{{itemTileCtrl.displayTitle}}</div>\n" +
    "        </div>\n" +
    "        <div class=\"large-item-text-container\" data-internal-type=\"text-container\">\n" +
    "            <div class=\"large-item-description\" data-internal-type=\"description\">{{itemTileCtrl.displayDescription}}</div>\n" +
    "            <div class=\"large-item-properties\" data-internal-type=\"properties\">\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp1\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp1.name}}</span><span>{{itemTileCtrl.displayProp1.sanitizedVal}}</span></div>\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp2\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp2.name}}</span><span>{{itemTileCtrl.displayProp2.sanitizedVal}}</span></div>\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp3\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp3.name}}</span><span>{{itemTileCtrl.displayProp3.sanitizedVal}}</span></div>\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp4\" class=\"large-item-property\"><span>{{itemTileCtrl.displayProp4.name}}</span><span>{{itemTileCtrl.displayProp4.sanitizedVal}}</span></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/tiles/medium-tile-item.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/medium-tile-item.html",
    "<div data-internal-type=\"mediumItemTile\" class=\"tile\" ng-click=\"itemTileCtrl.tileClicked()\">\n" +
    "    <div class='medium medium-item {{itemTileCtrl.selectClass}} ' ng-style=\"{'color': itemTileCtrl.color, 'background-color': itemTileCtrl.bgColor}\">\n" +
    "        <div class=\"medium-select\" ng-show=\"itemTileCtrl.showSelectCheck()\"></div>\n" +
    "        <div ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-corner-triangle-med\" data-internal-type=\"selection-triangle\"></div>\n" +
    "        <span ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-select-img-med fa fa-check fa-inverse\" data-internal-type=\"selection-check\"></span>\n" +
    "        <div class=\"medium-item-image-container\" data-internal-type=\"image-container\">\n" +
    "            <div class=\"medium-item-image\" data-internal-type=\"medium-image\">\n" +
    "                <div ng-if=\"itemTileCtrl.tileContent.image && !itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-2x {{itemTileCtrl.tileContent.image}} \"></div>\n" +
    "                <div ng-if=\"itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-2x\" ng-bind-html=\"itemTileCtrl.tileContent.imageTemplate\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"medium-item-text-container\" data-internal-type=\"text-container\">\n" +
    "            <div class=\"medium-item-text\" data-internal-type=\"title\">{{itemTileCtrl.displayTitle}}</div>\n" +
    "            <div class=\"{{itemTileCtrl.descriptionClass}}\" data-internal-type=\"description\">{{itemTileCtrl.displayDescription}}</div>\n" +
    "            <div class=\"medium-item-text\" ng-if=\"itemTileCtrl.showFirstProp\" data-internal-type=\"property\"><span>{{itemTileCtrl.displayProp1.name}}</span><span>{{itemTileCtrl.displayProp1.sanitizedVal}}</span></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/tiles/tile-group.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/tile-group.html",
    "<!-- header -->\n" +
    "<div ng-if=\"!tileGrpCtrl.group.isDummy\" ng-style=\"rowStyle(row)\" style=\"overflow:hidden;\" class=\"tile-group-header\">\n" +
    "\n" +
    "    <div style=\"display:inline-block; float:left;\" ng-click=\"tileGrpCtrl.toggleGroup(tileGrpCtrl.group)\">\n" +
    "        <div class=\"{{tileGrpCtrl.group.arrowClass()}}\" ng-style=\"{height: tileGrpCtrl.group.rowheight}\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-style=\"{height: tileGrpCtrl.group.rowheight}\" class=\"tile-group-text\" ng-click=\"tileGrpCtrl.toggleGroup(tileGrpCtrl.group)\">\n" +
    "        <div style=\"display:table-cell; vertical-align:middle; height:inherit;\">{{tileGrpCtrl.group.name}} ({{tileGrpCtrl.group.childCount()}})</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-style=\"{height: tileGrpCtrl.group.rowheight}\" class=\"tile-group-select\" ng-click=\"tileGrpCtrl.selectGroup()\" ng-show=\"tileGrpCtrl.selectionMode === 'multi'\">\n" +
    "        <div style=\"display:table-cell; vertical-align:middle; height:inherit;\">\n" +
    "            <input type=\"checkbox\" style=\"margin-left:10px; cursor: pointer\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--<div ng-style=\"{height: group.rowheight}\" class=\"tile-group-select\">\n" +
    "        <input type=\"checkbox\"/>\n" +
    "    </div>-->\n" +
    "\n" +
    "    <div class=\"tile-group-line-container\" ng-style=\"{height: tileGrpCtrl.group.rowheight}\">\n" +
    "        <div class=\"tile-group-line\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- tiles container -->\n" +
    "<!-- Do not change whitespace here.  Needed to remove space between multiple inline-block elements -->\n" +
    "<div ng-if=\"tileGrpCtrl.group.expanded || (tileGrpCtrl.groupsLength <= 1 && tileGrpCtrl.group.isDummy)\">\n" +
    "    <!--\n" +
    "    -->\n" +
    "    <sit-item-tile sit-format=\"tileGrpCtrl.sitFormat\" ng-repeat=\"tile in tileGrpCtrl.group.tiles\" sit-tile-content=\"tile\" sit-tile-options=\"tileGrpCtrl.tileOptions\" sit-tile-template=\"tileGrpCtrl.tileOptions.tileTemplate\" sit-last-tile></sit-item-tile>\n" +
    "    <!--\n" +
    "    -->\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/tiles/tile-view.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/tile-view.html",
    "<div data-internal-type=\"tileViewContainerDiv\">\n" +
    "    <div data-internal-type=\"tileContainerDiv\" ng-class=\"tileViewCtrl.options.tileContainerClass\" class=\"tile-container\">\n" +
    "        <div data-internal-type=\"showHideView\" ng-switch=\"tileViewCtrl.options.tileType\" ng-if=\"tileViewCtrl.showView\">\n" +
    "            <div ng-switch-when=\"action\">\n" +
    "                <sit-action-tile ng-repeat=\"tile in tileViewCtrl.tiles\" sit-tile-content=\"tile\">\n" +
    "                </sit-action-tile>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-when=\"item\">\n" +
    "                <sit-tile-group sit-format=\"tileViewCtrl.sitFormat\" ng-repeat=\"group in tileViewCtrl.groups\" data-sit-group=\"group\" data-sit-groups-length=\"{{tileViewCtrl.groups.length}}\" sit-group-expanding=\"tileViewCtrl.groupExpanding(groupCount)\" sit-tile-options=\"tileViewCtrl.tileOptions\" sit-multi-select=\"tileViewCtrl.options.multiSelect\" sit-selection-mode=\"tileViewCtrl.options.selectionMode\">\n" +
    "                </sit-tile-group>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-when=\"notification\">\n" +
    "                Notification tiles\n" +
    "                <!--<uy-notification-tile ng-repeat=\"tile in tiles\" tile-content=\"tile\"></uy-notification-tile>-->\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-default>\n" +
    "                Unknown tile type: {{tileViewCtrl.options.tileType}}.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div data-internal-type=\"showHideMessage\" ng-if=\"tileViewCtrl.showMessage\" style=\"font-size: x-large\">\n" +
    "            {{tileViewCtrl.messageText}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div data-internal-type=\"loading-container-xxx\" ng-if=\"tileViewCtrl.loadingMany\" style=\"position:absolute;left:50%;top:50%; width:300px; height:100px; margin:-50px auto auto -150px; overflow:hidden; text-align:center; background-color:white;\">\n" +
    "        <span style=\"line-height:100px;\"></span>\n" +
    "        <div style=\"display:inline-block; font-size:xx-large;\">{{tileViewCtrl.loadingMessage}}</div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <sit-pager ng-show=\"tileViewCtrl.options.showPager\" sit-paging-options=\"tileViewCtrl.options.pagingOptions\" page-changing=\"pageChanging()\"></sit-pager>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/widgets/tiles/wide-tile-item.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/tiles/wide-tile-item.html",
    "<div data-internal-type=\"wideItemTile\" class=\"tile\" ng-click=\"itemTileCtrl.tileClicked()\">\n" +
    "    <div class=\"wide wide-item {{itemTileCtrl.selectClass}} \" ng-style=\"{'color': itemTileCtrl.color, 'background-color': itemTileCtrl.bgColor}\">\n" +
    "        <div class=\"wide-select\" ng-show=\"itemTileCtrl.showSelectCheck()\"></div>\n" +
    "        <div ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-corner-triangle\" data-internal-type=\"selection-triangle\"></div>\n" +
    "        <span ng-show=\"itemTileCtrl.showSelectCheck()\" class=\"top-right-select-img fa fa-check fa-inverse fa-lg\" data-internal-type=\"selection-check\"></span>\n" +
    "        <div class=\"wide-item-left-col\" data-internal-type=\"left-column\">\n" +
    "            <div class=\"image-container-40x40\" data-internal-type=\"image-container\">\n" +
    "                <div class=\"image-vcenter-32x32\" data-internal-type=\"image-vcenter\">\n" +
    "                    <div ng-if=\"itemTileCtrl.tileContent.image && !itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-2x {{itemTileCtrl.tileContent.image}} \"></div>\n" +
    "                    <div ng-if=\"itemTileCtrl.tileContent.imageTemplate\" class=\"fa fa-2x\" ng-bind-html=\"itemTileCtrl.tileContent.imageTemplate\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <span ng-if=\"itemTileCtrl.tileContent.contentStatus ==='editing'\" class=\"bottom-left-status-img fa fa-certificate fa-lg\" />\n" +
    "            <span ng-if=\"itemTileCtrl.tileContent.contentStatus ==='warning'\" class=\"bottom-left-status-img fa fa-warning fa-lg\" />\n" +
    "        </div>\n" +
    "        <div class=\"wide-item-text\" data-internal-type=\"text-container\">\n" +
    "            <div class=\"wide-item-title\" data-internal-type=\"title\"><strong>{{itemTileCtrl.displayTitle}}</strong></div>\n" +
    "            <div class=\"{{itemTileCtrl.descriptionClass}}\" title=\"{{itemTileCtrl.descriptionTooltip}}\" data-internal-type=\"description\">{{itemTileCtrl.displayDescription}}</div>\n" +
    "            <div class=\"wide-item-properties\" data-internal-type=\"properties\">\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp1\" class=\"wide-item-property\"><span>{{itemTileCtrl.displayProp1.name}}</span><span>{{itemTileCtrl.displayProp1.sanitizedVal}}</span></div>\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp2\" class=\"wide-item-property\"><span>{{itemTileCtrl.displayProp2.name}}</span><span>{{itemTileCtrl.displayProp2.sanitizedVal}}</span></div>\n" +
    "                <div ng-if=\"itemTileCtrl.displayProp3\" class=\"wide-item-property\"><span>{{itemTileCtrl.displayProp3.name}}</span><span>{{itemTileCtrl.displayProp3.sanitizedVal}}</span></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/widgets/timePicker/time-picker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/timePicker/time-picker.html",
    "<div class=\"label label-property-grid-control-readonly property-value-ellipsis\" ng-if=\"timePickerCtrl.readOnly || timePickerCtrl.ngReadonly\">\n" +
    "    {{timePickerCtrl.value | date: 'shortTime'}}\n" +
    "</div>\n" +
    "\n" +
    "<ng-form name='timePickerForm' ng-if=\"!(timePickerCtrl.readOnly || timePickerCtrl.ngReadonly)\" ng-class=\"{'isrequired' : (timePickerCtrl.validation.required) && (timePickerCtrl.value===undefined)}\">\n" +
    "    <div class=\"sitTimePicker\" style=\"border:none;\">\n" +
    "        <div class=\"property-grid-input-group\">\n" +
    "            <input style=\"cursor:pointer;\" class=\"property-grid-control validator-control\" type=\"text\" readonly=\"readonly\" ng-model=\"timePickerCtrl.value\" value=\"{{timePickerCtrl.value | date: 'shortTime'}}\"\n" +
    "                   ng-class='((timePickerForm.$invalid && timePickerForm.$dirty) || (timePickerForm.$invalid && timePickerForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "                   ng-click=\"timePickerCtrl.ngDisabled || timePickerCtrl.clicked($event)\" ng-required=\"timePickerCtrl.validation.required\" sit-form-input-validator\n" +
    "                   sit-change=\"timePickerCtrl.sitChange\" ng-disabled=\"timePickerCtrl.ngDisabled\" ng-blur=\"timePickerCtrl.ngBlur()\" ng-focus=\"timePickerCtrl.ngFocus()\" />\n" +
    "            <div class=\"btn property-grid-addon-icon\" ng-click=\"timePickerCtrl.ngDisabled || timePickerCtrl.clicked($event)\" ng-disabled=\"timePickerCtrl.ngDisabled\">\n" +
    "                <i class=\"fa fa-clock-o\" ng-disabled=\"timePickerCtrl.ngDisabled\" ng-blur=\"timePickerCtrl.ngBlur\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"dropdown-menu property-grid-time-picker-popup\" ng-style=\"{display: (timePickerCtrl.isOpen && 'block') || 'none'}\" ng-disabled=\"timePickerCtrl.ngDisabled\">\n" +
    "            <div uib-timepicker ng-if=\"timePickerCtrl.format==='mediumTime'\" ng-model=\"timePickerCtrl.popupValue\" show-seconds=true show-meridian=\"timePickerCtrl.showMeridian\"></div>\n" +
    "            <div uib-timepicker ng-if=\"!(timePickerCtrl.format==='mediumTime')\" ng-model=\"timePickerCtrl.popupValue\" show-meridian=\"timePickerCtrl.showMeridian\"></div>\n" +
    "            <button type=\"button\" class=\"property-grid-time-picker-popup-button pull-left\" ng-click=\"timePickerCtrl.ngDisabled || timePickerCtrl.setClicked($event)\">{{'timePicker.set' | translate}}</button>\n" +
    "            <button type=\"button\" class=\"property-grid-time-picker-popup-button pull-right\" ng-click=\"timePickerCtrl.ngDisabled || timePickerCtrl.clearTime($event)\">{{'timePicker.clear' | translate}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/typeahead/typeahead.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/typeahead/typeahead.html",
    "<div ng-if=\"typeaheadCtrl.readOnly || typeaheadCtrl.ngReadonly\" class='label-property-grid-control-readonly property-value-ellipsis'>{{typeaheadCtrl.value}}</div>\n" +
    "\n" +
    "<ng-form ng-if=\"!(typeaheadCtrl.readOnly || typeaheadCtrl.ngReadonly)\" name='typeaheadForm' ng-class=\"{'isrequired' : (typeaheadCtrl.validation.required) && typeaheadCtrl.value===undefined}\">\n" +
    "    <div class='property-grid-input-group' ng-if=\"typeaheadCtrl.toDisplay != null\">\n" +
    "        <input type='text'\n" +
    "               name='{{typeaheadCtrl.value}}'\n" +
    "               ng-class='((typeaheadForm.$invalid && typeaheadForm.$dirty) || (typeaheadForm.$invalid && typeaheadForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               ng-model='typeaheadCtrl.value'\n" +
    "               ng-required='typeaheadCtrl.validation.required'\n" +
    "               ng-pattern='typeaheadCtrl.validation.pattern'\n" +
    "               uib-typeahead='val for typeaheadCtrl.toDisplay in typeaheadCtrl.options | filter:$viewValue'\n" +
    "               ng-blur=\"typeaheadCtrl.ngBlur()\"\n" +
    "               sit-change=\"typeaheadCtrl.sitChange\"\n" +
    "               ng-disabled=\"typeaheadCtrl.ngDisabled\"\n" +
    "               ng-focus=\"typeaheadCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator />\n" +
    "    </div>\n" +
    "\n" +
    "    <div class='property-grid-input-group' ng-if=\"typeaheadCtrl.toDisplay == null\">\n" +
    "        <input type='text'\n" +
    "               name='{{typeaheadCtrl.value}}'\n" +
    "               ng-class='((typeaheadForm.$invalid && typeaheadForm.$dirty) || (typeaheadForm.$invalid && typeaheadForm.$visited)) ? \"validator-control-invalid\" : \"validator-control\"'\n" +
    "               ng-model='typeaheadCtrl.value'\n" +
    "               ng-required='typeaheadCtrl.validation.required'\n" +
    "               ng-pattern='typeaheadCtrl.validation.pattern'\n" +
    "               uib-typeahead='val for val in typeaheadCtrl.options | filter:$viewValue'\n" +
    "               ng-blur=\"typeaheadCtrl.ngBlur()\"\n" +
    "               sit-change=\"typeaheadCtrl.sitChange\"\n" +
    "               ng-disabled=\"typeaheadCtrl.ngDisabled\"\n" +
    "               ng-focus=\"typeaheadCtrl.ngFocus()\"\n" +
    "               sit-form-input-validator />\n" +
    "    </div>\n" +
    "</ng-form>");
}]);

angular.module("common/widgets/viewBar/view-bar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/widgets/viewBar/view-bar.html",
    "<div id=\"viewBarContainer\" data-internal-type=\"viewBarContainer\">\n" +
    "    <style>\n" +
    "        .view-text {\n" +
    "            margin-left: 5px;\n" +
    "        }\n" +
    "    </style>\n" +
    "    <div class=\"dropdown btn-group group-dropdown\" style=\"display:inline-block;\" ng-if=\"viewBarCtrl.viewButtons.length > 0\">\n" +
    "        <i class=\"dropdown-toggle switch-button switch-button-dropdown fa ng-class:viewBarCtrl.selectedButton.faIcon\" data-toggle=\"dropdown\"><span class=\"caret\"></span></i>\n" +
    "        <ul class=\"dropdown-menu sit-dropdown-menu\" role=\"menu\">\n" +
    "            <li ng-repeat=\"viewButton in viewBarCtrl.viewButtons\" role=\"presentation\" ng-click=\"viewBarCtrl.selectView($event, viewButton)\">\n" +
    "                <a role=\"menuitem\" tabindex=\"-1\">\n" +
    "                    <span class=\"view-text\">\n" +
    "                        <i class=\"fa ng-class:viewButton.faIcon\"></i>\n" +
    "                        {{viewButton.text}}\n" +
    "                    </span>\n" +
    "                    <i class=\"fa fa-check\" ng-show=\"viewButton.selected\"></i>\n" +
    "                    <br style=\"clear:both\"/>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <sit-switch-button ng-if=\"viewBarCtrl.selectButton.length > 0\" sit-buttons=\"viewBarCtrl.selectButton\"></sit-switch-button>\n" +
    "    <sit-switch-button ng-if=\"viewBarCtrl.detailsButton.length > 0\" sit-buttons=\"viewBarCtrl.detailsButton\"></sit-switch-button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("common/blueprints/executeCommandTemplate/execute-commandTemplate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/blueprints/executeCommandTemplate/execute-commandTemplate.html",
    "<div class=\"command-bar-side-panel\">\n" +
    "    <button ng-click=\"vm.cancel()\" class=\"btn side-panel-button\">Cancel</button>\n" +
    "    <button ng-click=\"vm.save()\" class=\"btn side-panel-button\" ng-show=\"vm.validInputs\">{{vm.buttonLabel}}</button>\n" +
    "</div>\n" +
    "<div class=\"side-panel-property-area-body\">\n" +
    "    <div style=\"width:100%;height:100%\" ng-if=\"vm.renderComplete\">\n" +
    "        <sit-property-grid sit-id=\"itemPropertyGrid\"\n" +
    "                           sit-layout=\"Vertical\"\n" +
    "                           sit-type=\"Fluid\"\n" +
    "                           sit-columns=\"1\"\n" +
    "                           sit-mode=\"edit\">\n" +
    "            <sit-property ng-repeat=\"prop in vm.displayData track by prop.id\"\n" +
    "                          sit-widget=\"{{prop.widget}}\"\n" +
    "                          sit-change=\"vm.DigestEval\"\n" +
    "                          ng-disabled=\"vm.ngDisableItem[prop.name].value\"\n" +
    "                          sit-widget-attributes=\"prop.widgetAttributes\"\n" +
    "                          sit-value=\"vm.currentItem[prop.name]\"\n" +
    "                          sit-validation=\"prop.validation\">\n" +
    "                {{prop.label}}:\n" +
    "            </sit-property>\n" +
    "        </sit-property-grid>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/blueprints/masterDetailsTemplate/masterDetailsLayoutTemplate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/blueprints/masterDetailsTemplate/masterDetailsLayoutTemplate.html",
    "<div class=\"content-area content-area-relative\" style=\"height: calc(100% - 100px) !important\" id=\"itemlist\">\n" +
    "    <sit-command-bar sit-commands=\"vm.newObj.actions\"></sit-command-bar>\n" +
    "    <div>\n" +
    "        <div style=\"display:inline-block;vertical-align:top\">\n" +
    "            <sit-item-collection-viewer sit-data=\"vm.newObj.master.runtimeData\" sit-options=\"vm.newObj.master.runtimeConf\"></sit-item-collection-viewer>\n" +
    "\n" +
    "        </div>\n" +
    "        <div style=\"display:inline-block;vertical-align:top;width:calc(100% - 300px)\">\n" +
    "            <tabset>\n" +
    "                <tab ng-repeat=\"detail in vm.newObj.details\" index=\"{{$index}}\" heading=\"{{detail.name}}\" select=\"vm.setActiveTabIndex(detail.name)\">\n" +
    "                    <div ng-if=\"detail.mode === 'table'\">\n" +
    "                        <sit-item-collection-viewer sit-data=\"detail.runtimeData\" sit-options=\"detail.runtimeConf\"></sit-item-collection-viewer>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"detail.mode === 'form'\">\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                        <sit-property-grid sit-id=\"itemPropertyGrid1\"\n" +
    "                                           sit-layout=\"{{detail.runtimeConf.layout}}\"\n" +
    "                                           sit-type=\"detail.runtimeConf.type\"\n" +
    "                                           sit-columns=\"1\"\n" +
    "                                           sit-mode=\"detail.runtimeConf.mode\"\n" +
    "                                           sit-data=\"detail.runtimeConf.data\">\n" +
    "                        </sit-property-grid>\n" +
    "                    </div>\n" +
    "                </tab>\n" +
    "            </tabset>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/blueprints/overviewTemplate/overviewTemplate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/blueprints/overviewTemplate/overviewTemplate.html",
    "<div>\n" +
    "\n" +
    "  <button ng-click=\"vm.cancel()\" class=\"btn side-panel-button\">Close</button>\n" +
    "\n" +
    "\n" +
    "  <div style=\"clear:both\"></div>\n" +
    "\n" +
    "  <sit-property-grid\n" +
    "    sit-id=\"itemPropertyGrid\"\n" +
    "    sit-layout=\"Vertical\"\n" +
    "    sit-type=\"Fluid\"\n" +
    "    sit-columns=\"1\"\n" +
    "    sit-mode=\"view\">\n" +
    "    <sit-property\n" +
    "      ng-repeat=\"prop in vm.displayData track by prop.id\"\n" +
    "      sit-widget=\"{{prop.widget}}\"\n" +
    "      sit-widget-attributes=\"prop.widgetAttributes\"\n" +
    "      ng-disabled=\"true\"\n" +
    "      sit-value=\"vm.currentItem[prop.name]\">{{prop.label}}:\n" +
    "    </sit-property>\n" +
    "\n" +
    "  </sit-property-grid>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/blueprints/singleEntityTemplate/singleEntityLayoutTemplate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("common/blueprints/singleEntityTemplate/singleEntityLayoutTemplate.html",
    "<div class=\"content-area content-area-relative\" style=\"height: calc(100% - 50px) !important\" id=\"itemlist\">\n" +
    "    <sit-command-bar sit-commands=\"vm.newObj.actions\"></sit-command-bar>\n" +
    "    <div>\n" +
    "        <sit-item-collection-viewer sit-data=\"vm.newObj.master.runtimeData\" sit-options=\"vm.newObj.master.runtimeConf\"></sit-item-collection-viewer>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);
