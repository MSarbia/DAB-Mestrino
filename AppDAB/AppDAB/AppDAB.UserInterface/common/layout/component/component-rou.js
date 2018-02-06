/*
 * add new states to $stateProvider
 */
(function () {
    'use strict';
    angular.module('siemens.simaticit.common.services.layout')
        .config(['$stateProvider', function ($stateProvider) {
            var componentState = {
                name: 'home.component',
                url: '/component/:app/:component',
                views: {
                    'Canvas@': {
                        templateUrl: 'common/layout/component/component.html',
                        controller: 'common.services.layout.componentController',
                        controllerAs: 'componentCtr'
                    }
                },
                resolve: {
                    componentManifest: ['$stateParams', '$location', '$log', 'common.services.component.uiComponentService', 'common.services.component.migrationService',
            function ($stateParams, $location, $log, uiComponentService, migrationService) {
                //Load the component manifest using defined folder structure
                return uiComponentService.getComponentManifest($stateParams.app, $stateParams.component).then(function (data) {
                    data = migrationService.migrateUIComponentManifest(data);
                    return data;
                }, function () {
                    $log.error('Please check the name of app and component.');
                    $location.url('/home');
                });
            }
                    ]
                }
            };
            $stateProvider.state(componentState);
        }]);
})();
