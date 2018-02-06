/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common) {
            var services;
            (function (services) {
                var layout;
                (function (layout) {
                    /**
                    * @ngdoc service
                    * @name common.services.header.service
                    * @module siemens.simaticit.common.services.layout
                    *
                    * @requires $filter
                    * @requires common.services.logger.service
                    *
                    * @description This service can be used to configure the header bar included in all UI Applications.
                    */
                    var HeaderSvc = (function () {
                        function HeaderSvc($filter, logger, $sce) {
                            this.$filter = $filter;
                            this.logger = logger;
                            this.$sce = $sce;
                            this.aboutInformation = '<div>SIMATIC IT Unified Architecture Foundation 2.1 </div><div>© Siemens AG, 2017</div>';
                            this.flyoutButtons = [
                                /*{
                                    id: 'Home',
                                    text: $filter('translate')('common.header.home'),
                                    popoverItemClass: 'eng-header-popover',
                                    popooverItemImageClass: 'fa fa-home fa-lg',
                                    fnCallback: 'hc.popoverUserCallback'
                                },*/
                                {
                                    id: 'Settings',
                                    text: $filter('translate')('common.header.settings'),
                                    popoverItemClass: 'header-popover',
                                    popooverItemImageClass: 'fa-lg sit sit-system-configuration',
                                    fnCallback: 'hc.popoverUserCallback'
                                }
                                /*{
                                    id: 'About',
                                    text: $filter('translate')('common.header.about'),
                                    popoverItemClass: 'eng-header-popover',
                                    popooverItemImageClass: 'fa fa-info-circle fa-lg',
                                    fnCallback: 'hc.popoverUserCallback'
                                }*/
                            ];
                            this.flyoutButtonsKeys = [
                                /*{
                                    id: 'Home',
                                    text: 'common.header.home',
                                    fnCallback: 'hc.popoverUserCallback'
                                },*/
                                {
                                    id: 'Settings',
                                    text: 'common.header.settings',
                                    fnCallback: 'hc.popoverUserCallback'
                                }
                                /*{
                                    id: 'About',
                                    text: 'common.header.about',
                                    fnCallback: 'hc.popoverUserCallback'
                                }*/
                            ];
                            this.buttonListModified = null;
                        }
                        /**
                        * @ngdoc method
                        * @name common.services.header.service#setAboutInformation
                        * @description Sets the About information to be shown.
                        * @param {string} content Information to be shown in the About dialog box.
                        */
                        HeaderSvc.prototype.setAboutInformation = function (content) {
                            this.aboutInformation = content;
                        };
                        /**
                        * @ngdoc method
                        * @name common.services.header.service#getAboutInformation
                        * @description Retrieves the About information.
                        * @returns {string} A string containing the information to be shown in the About dialog box.
                        */
                        HeaderSvc.prototype.getAboutInformation = function () {
                            return this.aboutInformation;
                        };
                        //for internal purposes only
                        HeaderSvc.prototype.addListener = function (callback) {
                            this.buttonListModified = callback;
                        };
                        /**
                        * @ngdoc method
                        * @name common.services.header.service#addButton
                        * @description Adds a button to be displayed in the header flyout menu.
                        * ```
                        * //add button
                        * common.services.header.service.addButton(
                        * 'Test',
                        * 'fa fa-check fa-lg',
                        * 'common.header.test',
                        * function () {
                        *   //code to execute on click
                        * });
                        * ```
                        * @param {string} id The unique identifier for the button to be added.
                        * If the ID provided is not unique, an error is logged and **false** is returned.
                        * @param {string} icon The icon to be shown for the button.
                        * @param {string} text The text to be displayed for the button.
                        * @param {function} callbackMethod The function to be executed when the button is clicked.
                        *
                        */
                        HeaderSvc.prototype.addButton = function (id, icon, text, callbackMethod) {
                            var foundIndex = _.findIndex(this.flyoutButtons, function (obj) {
                                return obj.id === id;
                            });
                            if (foundIndex !== -1) {
                                this.logger.logError('addButton', 'id must be unique', 'common.services.header.service');
                                return false;
                            }
                            this.flyoutButtons.splice(this.flyoutButtons.length, 0, {
                                id: id,
                                text: this.$filter('translate')(text),
                                popoverItemClass: 'header-popover',
                                popooverItemImageClass: icon,
                                fnCallback: 'hc.popoverUserCallback'
                            });
                            this.flyoutButtonsKeys.splice(this.flyoutButtons.length, 0, {
                                id: id,
                                text: text,
                                fnCallback: callbackMethod
                            });
                            this.buttonListModified();
                        };
                        /**
                        * @ngdoc method
                        * @name common.services.header.service#removeButton
                        * @description Removes a button from the header flyout menu.
                        * @param {string} id The unique ID for the button to be removed.
                        */
                        HeaderSvc.prototype.removeButton = function (id) {
                            if (id === 'Home' || id === 'Settings' || id === 'About') {
                                this.logger.logError('removeButton', 'can not remove standard buttons', 'common.services.header.service');
                                return false;
                            }
                            var foundIndex = _.findIndex(this.flyoutButtons, function (obj) {
                                return obj.id === id;
                            });
                            if (foundIndex === -1) {
                                this.logger.logError('removeButton', 'id is not found', 'common.services.header.service');
                                return false;
                            }
                            this.flyoutButtons.splice(foundIndex, 1);
                            this.flyoutButtonsKeys.splice(foundIndex, 1);
                            this.buttonListModified();
                        };
                        return HeaderSvc;
                    }());
                    HeaderSvc.$inject = ['$filter', 'common.services.logger.service', '$sce'];
                    layout.HeaderSvc = HeaderSvc;
                    angular.module('siemens.simaticit.common.services.layout')
                        .service('common.services.header.service', HeaderSvc);
                })(layout = services.layout || (services.layout = {}));
            })(services = common.services || (common.services = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
//# sourceMappingURL=header-svc.js.map
(function () {
    'use strict';

    function headerController($rootScope, $scope, $window, $filter, CONFIG, APPCONFIG, authentication, dialogService, helpWindowService, busyIndicatorService, headerService, documentCenterServices) {
        var hc = this;

        activate();

        function activate() {
            $scope.authentication = authentication;
            init();
            setDefaultConfiguration();
            getLoggedInUser();
            updateConfigurations();
            hc.headerType = hc.headerTypes.custom;
            headerService.addListener(buttonListModified);

            // Since the header labels were not translated because of un-availability of resources,
            // So translating and overriding those labels again on stateChangeSuccess.

            $rootScope.$on('common.services.globalization.globalizationService.setLanguage', function () {
                hc.popoverUser[0].text = $filter('translate')('common.header.logout');
                var keys = headerService.flyoutButtonsKeys;
                for (var i = 0; i < keys.length; i++) {
                    hc.popoverHamburger[i].text = $filter('translate')(keys[i].text);
                }
            });
        }

        function buttonListModified() {
            hc.popoverHamburger = headerService.flyoutButtons;
        }

        function init() {

            var baseHType = {
                logoClass: '',
                titleClass: '',
                navBarClass: '',
                navBarButtonClass: '',
                title: ''
            };

            hc.config = angular.extend({}, APPCONFIG, CONFIG);

            hc.headerTypes = {
                custom: angular.extend({}, baseHType)
            };

            hc.popoverTitle = 'Title';
            hc.logoSiemens = 'common/images/SiemensLogo.png';
            hc.title = 'SIMATIC® IT';
            hc.logoImage = null;
            hc.enableBadge = false;
            hc.workPlace = null;
            hc.workStation = null;
            hc.helpIcon = false;
            hc.help = '';

            hc.aboutDialog = {
                title: 'About',
                templateData: {
                    layout: 'Vertical',
                    data: {},
                    information: headerService.aboutInformation,
                    mode: 'view'
                },
                buttons: [
                    {
                        id: 'aboutDialogOkButton',
                        displayName: 'OK',
                        onClickCallback: aboutDialogClickOk
                    }
                ]
            };

            hc.popoverUser = [
                {
                    id: 'Logout',
                    text: $filter('translate')('common.header.logout'),
                    popoverItemClass: 'header-popover',
                    popooverItemImageClass: 'fa fa-sign-out fa-lg',
                    fnCallback: 'hc.popoverUserCallback'
                }
            ];

            hc.popoverHamburger = headerService.flyoutButtons;
            hc.identity = authentication.notifyUser();
            hc.showHelpWindow = showHelpWindow;
            hc.showAbout = showAbout;
            hc.goToHome = goToHome;
        }

        function setDefaultConfiguration() {

            /*Custom*/
            hc.headerTypes.custom.logoClass = 'logo-container';
            hc.headerTypes.custom.titleClass = 'title-container';
            hc.headerTypes.custom.navBarClass = 'header-nav-bar';
            hc.headerTypes.custom.navBarButtonClass = 'header-navbar-button';
            hc.headerTypes.custom.title = '';
        }

        function getLoggedInUser() {
            authentication.getLoggedUser().then(null, null, function (_identity) {
                hc.identity = _identity;
            });
        }

        function updateConfigurations() {
            hc.headerType = hc.headerTypes.custom;
            hc.title += hc.headerType.title;
            hc.popoverUser.popoverItemClass = 'header-popover';

            if (hc.config.title && (hc.config.title !== '')) {
                hc.title = hc.config.title;
            }

            if (hc.config.logo && hc.config.logo !== hc.logoSiemens) {
                hc.logoImage = hc.config.logo;
            }
        }

        hc.popoverUserCallback = function (id) {
            switch (id) {
                case 'Logout':
                    authentication.logout();
                    break;
                case 'Home':
                    $rootScope.$state.go('home', null, { reload: true });
                    break;
                case 'Settings':
                    $rootScope.$state.go('home.settings');
                    break;
                case 'About':
                    hc.aboutDialog.templateData.information = headerService.aboutInformation;
                    dialogService.showDialogCenteredModal('aboutId');
                    break;

                default:
                    var foundIndex = _.findIndex(headerService.flyoutButtonsKeys, {//Custom button
                        id: id
                    });
                    if (foundIndex !== -1) {
                        headerService.flyoutButtonsKeys[foundIndex].fnCallback();
                    }
                    break;
            }

        };

        function aboutDialogClickOk() {
            dialogService.hideDialogModal('aboutId');
        }

        function showHelpWindow() {
            busyIndicatorService.show();
            if (hc.help !== '' && hc.help !== undefined) {
                if ($window.innerWidth <= 768) {
                    helpWindowService.show({ pageTitle: hc.help, isTabbed: true });
                } else {
                    helpWindowService.show({ pageTitle: hc.help });
                }
            }
            else {
                busyIndicatorService.hide();
            }
        }

        function getHelpDataFromState() {
            var currentState = $rootScope.$state.$current;
            var help = '';
            if (currentState.self.data !== undefined && currentState.self.data.help !== undefined) {
                hc.helpIcon = true;
                help = currentState.self.data.help;
            } else {
                help = getHelpDataFromParent(currentState);
            }
            if (help !== '') {
                hc.helpIcon = false;
                documentCenterServices.getAllPages("$filter=indexof(tolower(Title),tolower('" + help + "')) ne -1").then(function (dataResponse) {
                    var results = dataResponse;
                    if ('undefined' !== typeof (results) && null !== results && null !== results.value && results.value.length) {
                        hc.helpIcon = true;
                    } else {
                        hc.helpIcon = false;
                    }

                }, function () { 
                    hc.helpIcon = false;
                });
            }
            hc.help = help;
        }

        function showAbout() {
            hc.aboutDialog.templateData.information = headerService.aboutInformation;
            dialogService.showDialogCenteredModal('aboutId');
        }

        function goToHome(){
            $rootScope.$state.go('home', null, { reload: true, inherit: false });
        }

        function getParentState(state) {
            return state.parent;
        }

        function getHelpDataFromParent(state) {
            var i = true, helpDataFromParent = '';
            var parentState = state;
            while (i) {
                parentState = getParentState(parentState);
                if (parentState === undefined) {
                    hc.helpIcon = false;
                    i = false;
                    break;
                } else if (parentState.self.data !== undefined && parentState.self.data.help !== undefined) {
                    helpDataFromParent = parentState.self.data.help;
                    hc.helpIcon = true;
                    i = false;
                    break;
                }
            }
            return helpDataFromParent;
        }

        $rootScope.keyDown = function (event) {
            if (event.keyCode === 112) {
                window.onhelp = function () {
                    return false;
                }
                event.preventDefault();
                showHelpWindow();
            }
            else if (event.keyCode === 27) {
                helpWindowService.hide();
            }
        }

        $rootScope.$on('$stateChangeSuccess', function () {
            getHelpDataFromState();
        });

    }

    headerController.$inject = ['$rootScope', '$scope', '$window', '$filter', 'CONFIG', 'APPCONFIG', 'common.services.authentication', 'common.widgets.dialog.service',
    'common.components.documentation.helpWindowService', 'common.widgets.busyIndicator.service', 'common.services.header.service', 'common.services.documentation.service'];

    angular.module('siemens.simaticit.common.services.layout').controller('headerController', headerController);
})();