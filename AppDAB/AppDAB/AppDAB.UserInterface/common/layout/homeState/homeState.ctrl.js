(function () {
    'use strict';
    angular.module('siemens.simaticit.common.services.layout')
        .controller('HomeStateController', HomeStateController)
        .config(['$locationProvider', '$compileProvider', AngularConfig]);

    function AngularConfig($locationProvider, $compileProvider) {
        //configured on angular migration to 1.6.3
        $locationProvider.hashPrefix("");
        $compileProvider.preAssignBindingsEnabled(true);
    }

    HomeStateController.$inject = ['$rootScope', '$state', 'common.services.security.ui.authorization', 'CONFIG', 'APPCONFIG', 'common.sidebar.sidebarService', '$stateParams', 'common.widgets.messageOverlay.service', '$translate',
        'checkStartupTasks', '$q', 'common.services.session', 'common.globalization.globalizationConfig', 'common.services.ui.authentication', 'common.services.authentication.config', 'common.services.layout.shell', 'RESOURCE', 'common.services.logger.service',
        'common.services.startup.service'];
    function HomeStateController($rootScope, $state, auth, CONFIG, APPCONFIG, SidebarService, $stateParams, globalMsgOverlayManager, $translate,
        checkStartupTasks, $q, sessionService, globalizationConfig, authentication, authenticationConfig, shell, RESOURCE, loggerService, startupService) {
        var config, logger;

        activate();
        function activate() {
            init();
            if ($stateParams.stateid && $stateParams.stateToReturn) {
                sessionService.set($stateParams.stateid + '.stateToReturn', $stateParams.stateToReturn);
                if ($stateParams.stateParamsToReturn) {
                    sessionService.set($stateParams.stateid + '.stateParamsToReturn', $stateParams.stateParamsToReturn);
                }
            }
            if (!checkStartupTasks) {
                start();
                return;
            }
            loadResources().then(function () {
                checkAuthentication().then(function () {
                    start();
                }, function () {
                    logger.logDebug('authentication failed.....waiting for redirect');
                });
            });
        }

        function init() {
            config = angular.extend({}, APPCONFIG, CONFIG);
            logger = loggerService.getModuleLogger('HomeStateController');
        }

        function start() {
            if ($state.current.name !== 'home') {
                return;
            }
            if (auth.isFunctionalRightsLoaded) {
                redirectToState();
                return;
            }
            if (CONFIG.type !== 'rt') {
                auth.isFunctionalRightsLoaded = true;
                executeStartTasks().finally(redirectToState);
                return;
            }
            auth.initialize().then(function () {
                //hiding inaccessible screens in sidebar at 'RUNTIME'
                hideSidebarMenuItems(auth.getAuthorizedScreens());
            }, function () {

            }).finally(function() {
                executeStartTasks().finally(redirectToState);
            });
        }

        function loadResources() {
            var deferred = $q.defer();
            if (globalizationConfig.resourcesLoaded) {
                deferred.resolve();
                return deferred.promise;
            }
            shell.setGlobalization(RESOURCE, config.languages).then(function () {
                $translate.refresh().then(function () {
                    globalizationConfig.resourcesLoaded = true;
                    deferred.resolve();
                }, function () {
                    deferred.resolve();
                });
            }, function () {
                deferred.resolve();
            });
            return deferred.promise;
        }

        function checkAuthentication() {
            var deferred = $q.defer();
            if (authentication.isAuthorized()) {
                deferred.resolve();
                return deferred.promise;
            }
            if (!authenticationConfig.config.enableAuthentication) {
                deferred.resolve();
                return deferred.promise;
            }
            authentication.checkAuthentication().then(function () {
                deferred.resolve();
            }, function (reason) {
                logger.logErr('check Authentication Error: ', reason);
                if (reason && reason.status !== undefined && reason.status !== 401 && reason.status !== 404) {
                    $state.go('error');
                    deferred.reject();
                    return;
                }
                if (reason.data.error !== undefined && reason.data.error.errorCode === '6401') {
                    deferred.reject();
                    return;
                }
                if (reason.data.error !== undefined && reason.data.error.errorCode === 503) {
                    showErrorMessage($translate.instant('common.serviceLayerError.title'), reason.data.error.errorMessage);
                    deferred.reject();
                    return;
                }
                deferred.resolve();
            });
            return deferred.promise;
        }

        function executeStartTasks() {
            var deferred = $q.defer();
            startupService.execute().finally(function () {
                deferred.resolve();
            });
            return deferred.promise;
        }

        function hideSidebarMenuItems(accessibleStates) {
            var hideInSidebar = [], menuIds = [];
            var menuItems = CONFIG.menu;
            menuItems.forEach(function (menuItem) {
                menuIds.push(menuItem.id);
                var contents = menuItem.contents;
                if (contents && contents.length > 0) {
                    var idsToHide = [];
                    contents.forEach(function (content) {
                        if (content.securable === true) {
                            var isStateAccessible = _.contains(accessibleStates, content.id);

                            if (!isStateAccessible) {
                                idsToHide.push(content.id);
                            }
                        }
                    });
                    if (contents.length === idsToHide.length) {
                        hideInSidebar.push(menuItem.id);
                    } else if (idsToHide.length > 0) {
                        idsToHide.forEach(function (id) {
                            hideInSidebar.push(id);
                        });
                    }

                } else {
                    if (menuItem.securable === true) {
                        var isStateAccessible = _.contains(accessibleStates, menuItem.id);
                        if (!isStateAccessible) {
                            hideInSidebar.push(menuItem.id);
                        }
                    }
                }
            });
            var matchStates = _.difference(menuIds, hideInSidebar)
            if (matchStates.length === 0 && hideInSidebar.length === menuIds.length) {
                $rootScope.hideSidebar = true;
            } else {
                SidebarService.hideMenuItems(hideInSidebar);
            }
        }

        function redirectToState() {
            var state, stateParams;
            if ($stateParams.stateid) {
                state = sessionService.get($stateParams.stateid + '.stateToReturn');
                stateParams = sessionService.get($stateParams.stateid + '.stateParamsToReturn');

                sessionService.remove($stateParams.stateid + '.stateToReturn');
                sessionService.remove($stateParams.stateid + '.stateParamsToReturn');
            }
            if (undefined === state || null === state || 'home' === state) {
                if (config.home === undefined) {
                    showErrorMessage($translate.instant('common.undefinedHome.title'), $translate.instant('common.undefinedHome.text'));
                    return;
                }
                state = config.home;
            }
            if (undefined !== stateParams && null !== stateParams) {
                stateParams = JSON.parse(stateParams);
            } else {
                stateParams = {};
            }
            $state.go(state, stateParams, { inherit: false });
        }

        function hideOverlay() {
            globalMsgOverlayManager.hide();
        }

        function showErrorMessage(title, text) {
            var overlaySettings = {
                buttons: [{
                    id: 'ok',
                    displayName: $translate.instant('common.ok'),
                    onClickCallback: hideOverlay
                }],
                title: title,
                text: text
            };

            globalMsgOverlayManager.set(overlaySettings);
            globalMsgOverlayManager.show();
        }
    }
})();


