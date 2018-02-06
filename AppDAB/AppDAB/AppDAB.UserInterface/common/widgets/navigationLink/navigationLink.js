/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */

(function () {
    'use strict';

    /**
     * @ngdoc module
     * @access internal
     * @name siemens.simaticit.common.navigation-link
     * @description
     * Contains functionality related to tabs.
     */
    angular.module('siemens.simaticit.common.widgets.navigation-link', []);

})();
(function () {
    'use strict';

    /**
     * @name  tab & tabset Directives
     * @module siemens.simaticit.common.widgets.navigation-link
     *
     * @description
     * update ui-bootstrap tab & tabset Directives with new templates.
     *
     * tab Directive: created two isolate scope property: new (bool), warning (bool)
     */

    angular.module('siemens.simaticit.common.widgets.navigation-link').config(['$provide', function ($provide) {
        $provide.decorator('tabsetDirective', ['$delegate', tabsetTemplate]);

        $provide.decorator('tabDirective', ['$delegate', tabTemplate]);

        $provide.decorator('sitTabsetDirective', ['$delegate', tabsetTemplate]);

        $provide.decorator('sitTabDirective', ['$delegate', tabTemplate]);


        function tabsetTemplate($delegate) {
            //get tabsetDirective
            var directive = $delegate[0];
            var prefix = directive.name.indexOf('sit') === 0 ? 'sit-' : '';
            directive.templateUrl = 'common/widgets/navigationLink/' + prefix + 'tabset.html';
            return $delegate;
        }

        function tabTemplate($delegate) {
            //get tabDirective
            var directive = $delegate[0];
            var prefix = directive.name.indexOf('sit') === 0 ? 'sit-' : '';
            directive.templateUrl = 'common/widgets/navigationLink/' + prefix + 'tab.html';
            return $delegate;
        }
    }]);
})();
