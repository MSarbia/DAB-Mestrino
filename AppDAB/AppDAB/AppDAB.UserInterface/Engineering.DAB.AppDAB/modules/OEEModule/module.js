﻿(function(){
    'use strict';

    angular.module('Engineering.DAB.AppDAB.OEEModule', []).config(StateConfig);

    StateConfig.$inject = ['$stateProvider'];
    function StateConfig($stateProvider) {
        var moduleStateName = 'home.Engineering_DAB_AppDAB_OEEModule';
        var moduleStateUrl = 'Engineering.DAB_AppDAB_OEEModule';
        var moduleFolder = 'Engineering.DAB.AppDAB/modules/OEEModule';

        //Add new states under the root state to be unique. Below is an example code for reference
        //var state1 = {
        //    name: moduleStateName + '_state_name',
        //    url: '/' + moduleStateUrl + '_state_url',
        //    views: {
        //        'Canvas@': {
        //            templateUrl: moduleFolder + '/state_template.html',
        //            controller: 'state_controller',
        //            controllerAs: 'vm'
        //        }
        //    },
        //    data: {
        //        title: 'state_title'
        //    },
        //    params: {}
        //};
        //$stateProvider.state(state1);
    }
}());
