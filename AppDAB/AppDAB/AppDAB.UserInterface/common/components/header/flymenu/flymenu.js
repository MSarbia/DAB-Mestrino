/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';

    var module = angular.module('siemens.simaticit.common');
    //var tooltipModule = angular.module('ui.bootstrap.tooltip');
    /**
     * @ngdoc directive
     * @name  popoverPopup
     * @module siemens.simaticit.common
     *
     * @description
     * update ui-bootstrap popoover Directive with new template and modified 'content' isolate scope property.
     * created runtime by $popoverMenu provider
     *
     */
    /* module.config(['$provide', function ($provide) {
         $provide.decorator('popoverPopupDirective', ['$delegate', function ($delegate) {
 
 
             var directive = $delegate[0];
                 directive.scope['content'] = '=';
                 directive.scope['getfn'] = '&';
                 directive.templateUrl = 'common/components/header/flymenu/flymenu.html';
 
             return $delegate;
         }]);
     }]);
 */

    module.directive('menuPopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', content: '=', placement: '@', popupClass: '@', animation: '&', isOpen: '&', getfn: '&' },
            templateUrl: 'common/components/header/flymenu/flymenu.html'
        };
    });


    /**
     * @ngdoc provider
     * @name  $popoverMenu
     * @module siemens.simaticit.common
     *
     * @description
     * $popoverMenu creates popover-like (popoverPopup) directive.
     *
     *
     *
     */
    module.provider('$popoverMenu', function () {
        // The default options tooltip and popover.
        var defaultOptions = {
            placement: 'top',
            animation: true,
            popupDelay: 0,
            useContentExp: false
        };

        // Default hide triggers for each show trigger
        var triggerMap = {
            'mouseenter': 'mouseleave',
            'click': 'click',
            'focus': 'blur'
        };

        // The options specified to the provider globally.
        var globalOptions = {};

        /**
         * `options({})` allows global configuration of all tooltips in the
         * application.
         *
         *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
         */
        this.options = function (value) {
            angular.extend(globalOptions, value);
        };

        /**
         * This allows you to extend the set of trigger mappings available. E.g.:
         *
         *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
         */
        this.setTriggers = function setTriggers(triggers) {
            angular.extend(triggerMap, triggers);
        };

        /**
         * This is a helper function for translating camel-case to snake-case.
         */
        /*function snake_case(name){
         var regexp = /[A-Z]/g;
         var separator = '-';
         return name.replace(regexp, function(letter, pos) {
         return (pos ? separator : '') + letter.toLowerCase();
         });
         }
         */
        /**
         * Returns the actual instance of the $tooltip service.
         * TODO support multiple triggers
         */
        this.$get = ['$rootScope', '$window', '$compile', '$timeout', '$document', '$uibPosition', '$interpolate', function ($rootScope, $window, $compile, $timeout, $document, $position, $interpolate) {
            return function $tooltip(type, prefix, defaultTriggerShow, options) {
                options = angular.extend({}, defaultOptions, globalOptions, options);

                /**
                 * Returns an object of show and hide triggers.
                 *
                 * If a trigger is supplied,
                 * it is used to show the tooltip; otherwise, it will use the `trigger`
                 * option passed to the `$tooltipProvider.options` method; else it will
                 * default to the trigger supplied to this directive factory.
                 *
                 * The hide trigger is based on the show trigger. If the `trigger` option
                 * was passed to the `$tooltipProvider.options` method, it will use the
                 * mapped trigger from `triggerMap` or the passed trigger if the map is
                 * undefined; otherwise, it uses the `triggerMap` value of the show
                 * trigger; else it will just use the show trigger.
                 */
                function getTriggers(trigger) {
                    var show = trigger || options.trigger || defaultTriggerShow;
                    var hide = triggerMap[show] || show;
                    return {
                        show: show,
                        hide: hide
                    };
                }

                var directiveName = 'menu';//snake_case( type );

                var startSym = $interpolate.startSymbol();
                var endSym = $interpolate.endSymbol();
                var template =
                        '<div ' + directiveName + '-popup ' +
                        'title="' + startSym + 'title' + endSym + '" ' +
                        'content="content" ' +
                        'placement="' + startSym + 'placement' + endSym + '" ' +
                        'popup-class="' + startSym + 'popupClass' + endSym + '" ' +
                        'animation="animation" ' +
                        'is-open="isOpen"' +
                        'origin-scope="origScope" ' +
                        'getfn="callParentFn"' +
                        '>' +
                        '</div>';

                return {
                    restrict: 'EA',
                    compile: function () {
                        var tooltipLinker = $compile(template);

                        return function link(scope, element, attrs) {
                            var tooltip;
                            var tooltipLinkedScope;
                            var transitionTimeout;
                            var popupTimeout;
                            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
                            var triggers = getTriggers(undefined);
                            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
                            var ttScope = scope.$new(true);

                            ttScope.callParentFn = function (fnName, id) {
                                //find assigned function to parent scope
                                var parentScope = scope;
                                var elements = fnName.split('.');
                                elements.forEach(function (element) {
                                    if (parentScope[element]) {
                                        parentScope = parentScope[element];
                                    }
                                    //else {
                                    //    console.debug('[POPOVER]', 'function ' + fnName + 'not found');
                                    //}
                                });

                                if (parentScope) {
                                    parentScope(id);
                                }

                                //close Active Tooltip
                                hide();

                            };



                            function positionTooltip() {
                                if (!tooltip) { return; }
                                var ttStyle;

                                switch (ttScope.placement) {
                                    case 'bottom':
                                        //min-width                                       
                                        var relativeContainer = $('#headerNavBar').offset();
                                        var relativeElementPosition = element.offset().left - relativeContainer.left;


                                        ttStyle = {
                                            top: element.height() - 2 + 'px',
                                            left: relativeElementPosition + 'px'
                                        }
                                        if (element.outerWidth() > 100) {
                                            // Match the width of the flyout button if long enough (e.g. user name)
                                            ttStyle.width = element.outerWidth() + 2 + 'px';
                                        }

                                        // Now set the calculated positioning.
                                        tooltip.css(ttStyle);
                                        break;
                                }

                            }

                            // Set up the correct scope to allow transclusion later
                            ttScope.origScope = scope;

                            // By default, the tooltip is not open.
                            // TODO add ability to start tooltip opened
                            ttScope.isOpen = false;

                            function toggleTooltipBind() {
                                if (!ttScope.isOpen) {
                                    showTooltipBind();
                                } else {
                                    hideTooltipBind();
                                }
                            }

                            function onDocumentClick(event) {
                                if (event.target.classList && !event.target.classList.contains('flymenu')) {
                                    hideTooltipBind();
                                }
                            }

                            //hide the tooltip popup element when the focus is changed
                            $document.bind('click', onDocumentClick);

                            window.addEventListener('window.click', hideTooltipBind, false);

                            // Show the tooltip with delay if specified, otherwise show it immediately
                            function showTooltipBind() {
                                if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                                    return;
                                }

                                prepareTooltip();

                                if (ttScope.popupDelay) {
                                    // Do nothing if the tooltip was already scheduled to pop-up.
                                    // This happens if show is triggered multiple times before any hide is triggered.
                                    if (!popupTimeout) {
                                        popupTimeout = $timeout(show, ttScope.popupDelay, false);
                                        popupTimeout.then(function (reposition) { reposition(); });
                                    }
                                } else {
                                    show()();
                                }
                            }

                            function hideTooltipBind() {
                                scope.$apply(function () {
                                    hide();
                                });
                            }

                            // Show the tooltip popup element.
                            function show() {

                                popupTimeout = null;

                                // If there is a pending remove transition, we must cancel it, lest the
                                // tooltip be mysteriously removed.
                                if (transitionTimeout) {
                                    $timeout.cancel(transitionTimeout);
                                    transitionTimeout = null;
                                }

                                // Don't show empty tooltips.
                                if (!(options.useContentExp ? ttScope.contentExp() : ttScope.content)) {
                                    return angular.noop;
                                }

                                createTooltip();

                                // Set the initial positioning.
                                tooltip.css({ top: 0, left: 0, display: 'block' });
                                ttScope.$digest();

                                positionTooltip();

                                // And show the tooltip.
                                ttScope.isOpen = true;
                                ttScope.$apply(); // digest required as $apply is not called

                                // Return positioning function as promise callback for correct
                                // positioning after draw.
                                return positionTooltip;
                            }

                            // Hide the tooltip popup element.
                            function hide() {
                                // First things first: we don't show it anymore.
                                ttScope.isOpen = false;

                                //if tooltip is going to be shown after delay, we must cancel this
                                $timeout.cancel(popupTimeout);
                                popupTimeout = null;

                                // And now we remove it from the DOM. However, if we have animation, we
                                // need to wait for it to expire beforehand.
                                // FIXME: this is a placeholder for a port of the transitions library.
                                if (ttScope.animation) {
                                    if (!transitionTimeout) {
                                        transitionTimeout = $timeout(removeTooltip, 500);
                                    }
                                } else {
                                    removeTooltip();
                                }
                            }

                            function createTooltip() {
                                // There can only be one tooltip element per directive shown at once.
                                if (tooltip) {
                                    removeTooltip();
                                }
                                tooltipLinkedScope = ttScope.$new();
                                tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                                    if (appendToBody) {
                                        $document.find('body').append(tooltip);
                                    } else {
                                        element.after(tooltip);
                                    }
                                });

                                tooltipLinkedScope.$watch(function () {
                                    $timeout(positionTooltip, 0, false);
                                });

                                if (options.useContentExp) {
                                    tooltipLinkedScope.$watch('contentExp()', function (val) {
                                        if (!val && ttScope.isOpen) {
                                            hide();
                                        }
                                    });
                                }



                                //Remove all menu-popup
                                if ($rootScope.activeTooltip) {

                                    $rootScope.activeTooltip.element.remove();
                                    $rootScope.activeTooltip.scope.isOpen = false;

                                }
                                //register this menupopup
                                $rootScope.activeTooltip = { element: tooltip, scope: ttScope };


                            }

                            function removeTooltip() {
                                transitionTimeout = null;
                                if (tooltip) {
                                    tooltip.remove();
                                    tooltip = null;
                                }
                                if (tooltipLinkedScope) {
                                    tooltipLinkedScope.$destroy();
                                    tooltipLinkedScope = null;
                                }
                            }

                            function prepareTooltip() {
                                prepPopupClass();
                                prepPlacement();
                                prepPopupDelay();
                            }

                            ttScope.contentExp = function () {
                                return scope.$eval(attrs[type]);
                            };

                            /**
                             * Observe the relevant attributes.
                             */
                            if (!options.useContentExp) {
                                attrs.$observe(type, function (val) {
                                    ttScope.content = JSON.parse(val);

                                    if (!val && ttScope.isOpen) {
                                        hide();
                                    }
                                });
                            }

                            attrs.$observe('disabled', function (val) {
                                if (val && ttScope.isOpen) {
                                    hide();
                                }
                            });

                            attrs.$observe(prefix + 'Title', function (val) {
                                ttScope.title = val;
                            });

                            function prepPopupClass() {
                                ttScope.popupClass = attrs[prefix + 'Class'];
                            }

                            function prepPlacement() {
                                var val = attrs[prefix + 'Placement'];
                                ttScope.placement = angular.isDefined(val) ? val : options.placement;
                            }

                            function prepPopupDelay() {
                                var val = attrs[prefix + 'PopupDelay'];
                                var delay = parseInt(val, 10);
                                ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                            }

                            function unregisterTriggers() {
                                element.unbind(triggers.show, showTooltipBind);
                                element.unbind(triggers.hide, hideTooltipBind);
                            }

                            function prepTriggers() {
                                var val = attrs[prefix + 'Trigger'];
                                unregisterTriggers();

                                triggers = getTriggers(val);

                                if (triggers.show === triggers.hide) {
                                    element.bind(triggers.show, toggleTooltipBind);
                                } else {
                                    element.bind(triggers.show, showTooltipBind);
                                    element.bind(triggers.hide, hideTooltipBind);
                                }
                            }
                            prepTriggers();

                            var animation = scope.$eval(attrs[prefix + 'Animation']);
                            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

                            var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody']);
                            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

                            // if a tooltip is attached to <body> we need to remove it on
                            // location change as its parent scope will probably not be destroyed
                            // by the change.
                            if (appendToBody) {
                                scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
                                    if (ttScope.isOpen) {
                                        hide();
                                    }
                                });
                            }

                            // Make sure tooltip is destroyed and removed.
                            scope.$on('$destroy', function onDestroyTooltip() {
                                $timeout.cancel(transitionTimeout);
                                $timeout.cancel(popupTimeout);
                                unregisterTriggers();
                                element.unbind(triggers.show, toggleTooltipBind);
                                $document.unbind('click', onDocumentClick);
                                window.removeEventListener('window.click', hideTooltipBind, false);
                                removeTooltip();
                                ttScope = null;
                            });
                    };
                }
            };
        };
        }];
    });





    /**
     * @ngdoc directive
     * @name  flymenu
     * @module siemens.simaticit.common
     * @restrict EA
     * @param {array} flymenu array of object containing the item info.
     * @param {string} flymenu-placement Where to place it? Defaults to "top", but also accepts "bottom", "left", "right".
     * @param {boolean} flymenu-animation Should it fade in and out? Defaults to "true".
     * @param {string} flymenu-popup-delay For how long should the user have to have the mouse over the element before the popover shows (in milliseconds)? Defaults to 0.
     * @param {string} flymenu-trigger What should trigger the show of the popover? Accepts: mouseenter, mouseleave, click, focus, blur
     * @param {string} flymenu-append-to-body Should the tooltip be appended to $body instead of the parent element?
     *
     * @description
     * flymenu directive.
     * @usage
     *
     *```
     * //controller
     * function myController(){
     *      var hc = this;
     *
     *      var hc.popoverUserCallback = function(id){
     *          console.log('item click')
     *      }
     *
     *      hc.popoverUser= [ {id:'Logout',text:'Logout',  popoverItemClass:'eng-header-popover', popooverItemImageClass:'fa fa-sign-out fa-lg', fnCallback:'hc.popoverUserCallback'}];
     * }
     *
     *
     *   //id: item id
     *   //text: text displayed
     *   //popoverItemClass: custom css class
     *   //popoverItemImageClass: font awesome classes: fa fa-xxx fa-lg
     *   //fnCallback: name of function to call when the item is clicked.
     * ```
     * ...
     * ```
     * //html usage
     * <div flymenu="{{hc.popoverUser}}"  flymenu-placement="bottom">
     *     ...
     *</div>
     * ```
     *
     */
    module.directive('flymenu', ['$popoverMenu', function ($popoverMenu) {
        return $popoverMenu('flymenu', 'flymenu', 'click');
    }]);

})();
