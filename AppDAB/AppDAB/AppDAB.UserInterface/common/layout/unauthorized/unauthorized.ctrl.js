(function () {
    'use strict';
    UnauthorizedController.$inject = ['$rootScope', 'CONFIG'];
    function UnauthorizedController($rootScope, CONFIG) {
        var vm = this;
        activate();
        function activate() {
            //hide the sidebar in solution studio
            if (CONFIG.type === 'eng') {
                $rootScope.$state.current.data.sideBarIsHidden = true;
            }
            init();
        }

        function init() {
            vm.title = window.localStorage.getItem("unauthorizedTitle");
            vm.message = window.localStorage.getItem("unauthorizedMessage");

        }

    }

    angular.module('siemens.simaticit.common.services.layout')
          .controller('unauthorizedController', UnauthorizedController);
})();