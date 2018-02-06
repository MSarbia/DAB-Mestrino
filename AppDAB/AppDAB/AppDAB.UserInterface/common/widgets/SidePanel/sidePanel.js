/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';
    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.sidepanel
    * 
    * @description
    * This module provides functionalities related to displaying the side-panel.
    */
    angular.module('siemens.simaticit.common.widgets.sidepanel', []);

})();
(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.sidepanel').directive('sitSidePanel', SidepanelDirective);
    /**
    * @ngdoc directive
    * @name sitSidePanel
    * @module siemens.simaticit.common.widgets.sidepanel
    * @description  
    * A directive which defines the standard structure for a side-panel.
    * To maintain consistency across all the side-panels used in the App, it is highly recommended to use this directive instead of providing a custom template for the side-panel.
    * Since buttons, titles and messages are part of the side-panel directive, in order to migrate from a custom template to the side-panel directive
    * you should remove the html for those elements from the custom templates and configure them in the directive.
    * In order to do that you should use the following side-panel directive attributes:
	* * Action, command and close buttons (sit-actions, sit-commands, sit-close).
	* * Error and info messages (sit-messages).
	* * Title (sit-title).
    * The remaining html content of the custom template should be wrapped between the opening and closing tag of the side-panel directive.
    *
    * @usage 
    * As an element:
    * ```
    * <sit-side-panel 
                sit-title="Sidepanel Title" 
                sit-messages="messagesArray" 
                sit-actions="actionButtonsArray" 
                sit-commands="commandButtonsArray" 
                sit-close="closeButtonObj">
    *           **custom contents goes here**
    * </sit-side-panel>
    * ```
    * @restrict E
    * 
    * @param {String} sit-title Title of the side-panel.
    * @param {Array<Message>} sit-messages _(Optional)_ Displays info/warning messages at the bottom of the side-panel .To configure the message object see {@link Message}.
    * @param {Array<ActionButton>} sit-actions _(Optional)_ Action buttons are displayed on the right-hand side, below the side-panel title. To configure action buttons see {@link ActionButton}.
    * @param {Array<CommandButton>} sit-commands _(Optional)_ Command buttons are displayed on the left-hand side, below the side-panel title. To configure command buttons see {@link CommandButton}.
    * @param {Object<CloseButton>} sit-close _(Optional)_ A close button is displayed on the right-hand side, after the side-panel title. To configure close buttons see {@link CloseButton}.
    *
    * @example
    * The following example shows how to configure a side-panel widget: 
    *
    * In Controller: 
    * ```
    *    (function () {
    *        SidepanelDemoController.$inject = ['common']
    *        function SidepanelDemoController(common) {
    *            var self = this;
    *            self.sidepanelConfig = {
    *                messages: [{
    *                    type: 'info',
    *                    text: 'This is an info text'
    *                }, {
    *                    type: 'warning',
    *                    text: 'This is a warning text'
    *                }],
    *                actionButtons: [{
    *                    img: 'fa-car',
    *                    label: 'Cancel',
    *                    tooltip: 'Cancel',
    *                    onClick: function () {
    *                        //content goes here
    *                    },
    *                    enabled: true,
    *                    visible: false
    *                }, {
    *                    img: 'fa-bus',
    *                    label: 'Close',
    *                    tooltip: 'Close',
    *                    onClick: function () {
    *                        //content goes here
    *                    },
    *                    enabled: false,
    *                    visible: true
    *                }],
    *                commandButtons: [{
    *                    img: 'fa-pencil',
    *                    tooltip: 'Edit',
    *                    onClick: function () {
    *                        //content goes here
    *                    },
    *                    enabled: true,
    *                    visible: true
    *                }, {
    *                    img: 'fa-trash',
    *                    tooltip: 'Close',
    *                    onClick: function () {
    *                        //content goes here
    *                    },
    *                    enabled: true,
    *                    visible: true
    *                }],
    *                closeButton: {
    *                   showClose : true,
    *                   tooltip: 'Close Sidepanel',
    *                   onClick: function () {
    *                       //content goes here
    *                       common.sidePanelManager.close();
    *                   }    
    *                }
    *            }
    *        }
    *    })();
    * ```
    *   
    * In Template:
    *```
    *   <sit-side-panel sit-title="Sidepanel Title"
    *                   sit-actions="ctrl.sidepanelConfig.messages"
    *                   sit-messages="ctrl.sidepanelConfig.actionButtons"
    *                   sit-commands="ctrl.sidepanelConfig.commandButtons"
    *                   sit-close="ctrl.sidepanelConfig.closeButton"
    *       <!--Custom Content-->
    *   </sit-side-panel>
    *```
    *
    */
    /**
    * @ngdoc type
    * @module siemens.simaticit.common.widgets.sidepanel
    * @name Message
    * @description 
    * Object to specify the type and text of the message to be dispalyed in side-panel. 
    *   
    * @property {String} type Defines the type of the message to be displayed. The 'type' property accepts two values and they are listed as follows:
    *   * **info**: Displays an info message.
    *   * **warning**: Displays a warning message.
    * @property {String} text The message text.
    * @example
    * The following example shows how to configure the Message object:  
    * ```
    *  {
    *     type: 'info',
    *     text: 'This is an info message'
    *  }
    * ```
    */
    /**
    * @ngdoc type
    * @module siemens.simaticit.common.widgets.sidepanel
    * @name ActionButton
    * @description 
    * An object which defines the action buttons. 
    *  
    * @property {String} img The image of the button.It accepts a valid [FontAwesome](http://fortawesome.github.io/Font-Awesome/icons/) icon.
    * @property {String} label The label to be displayed on the button.
    * @property {String} tooltip _(Optional)_ The tooltip to be displayed when the mouse hovers over the button. If not defined **label** property value is used.
    * @property {Function} onClick _(Optional)_ A function to be called when the button is clicked.
    * @property {Boolean} [enabled= true] _(Optional)_ If set to false, the action button is disabled.
    * @property {Boolean} [visible= true] _(Optional)_ If set to false, the action button is hidden.
    * @example
    * The action button object can be configured as follows:
    * `````````````````
    *  {
    *     img: 'fa-cogs', 
    *     label: 'Command Button',
    *     tooltip: 'Button Tooltip',  
    *     onClick: 'callbackFuntion',
    *     enabled: true,  
    *     visible: true
    *  }
    * `````````````````
    */
    /**
    * @ngdoc type
    * @module siemens.simaticit.common.widgets.sidepanel
    * @name CommandButton
    * @description 
    * An object which defines the command buttons.
    *
    * @property {String} [img= 'fa-cogs'] The image of the button. It accepts a valid [FontAwesome](http://fortawesome.github.io/Font-Awesome/icons/) icon.
    * @property {String} tooltip The tooltip to be displayed when the mouse hovers over the button.
    * @property {Function} onClick _(Optional)_ A function to be called when the button is clicked.
    * @property {Boolean} [enabled= true] _(Optional)_ If set to false, the command button is disabled.
    * @property {Boolean} [visible= true] _(Optional)_ If set to false, the command button is hidden.
    * @example
    * The action button object can be configured as follows:
    * `````````````````
    *  {
    *     img: 'fa-cogs', 
    *     tooltip: 'Button Tooltip', 
    *     onClick: 'callbackFuntion',
    *     enabled: true,  
    *     visible: true
    *  }
    * `````````````````
    */
    /**
    * @ngdoc type
    * @module siemens.simaticit.common.widgets.sidepanel
    * @name CloseButton
    * @description 
    * An object which defines the sidepanel close button properties.
    *
    * @property {Boolean} [showClose = true] _(Optional)_ A boolean value which specifies whether or not to show the close button.
    * @property {String} [tooltip = 'Close'] _(Optional)_ The tooltip to be displayed when the mouse hovers over the close button.
    * @property {Function} onClick _(Optional)_ The callback function to be called on clicking the close button. If callback function is defined, the default side-panel close functionality is disabled, consequently the side-panel close functionality must be implemented in the callback function.
    * @example
    * The close button object can be configured as follows:
    * `````````````````
    *  {
    *     showClose: true, 
    *     tooltip: 'Close Tooltip', 
    *     onClick: 'callbackFuntion'
    *  }
    * `````````````````
    */

    function SidepanelDirective() {
        return {
            transclude: true,
            scope: {},
            bindToController: {
                'title': '@sitTitle',
                'messages': '=?sitMessages',
                'actionButtons': '=?sitActions',
                'commandButtons': '=?sitCommands',
                'closeButton': '=?sitClose'
            },
            restrict: 'E',
            controller: SidepanelController,
            controllerAs: 'sidepanelCtrl',
            templateUrl: 'common/widgets/sidePanel/sidepanel.html',
            link: function (scope, element, attr, ctrl) {
                var sidePanelPadding = 16;
                var sidePanelZeroPadding = 0;
                var sidePanelTitle = element.find('div.side-panel-container div.side-panel-top span.side-panel-header-text');
                sidePanelTitle.on('mouseenter', setTitleText);

                function setTitleText() {
                    var titleElement = this;
                    var tooltipText = titleElement.innerHTML;
                    if (titleElement.offsetWidth < titleElement.scrollWidth) {
                        titleElement.setAttribute('title', tooltipText);
                    } else {
                        titleElement.removeAttribute('title');
                    }
                }

                var classListner = scope.$watch(function () {
                    return element.parents('.property-area-container').attr('class');
                }, function (newValue) {
                    if (newValue && !newValue.includes('property-area-hide')) {
                        element.parents('.property-area-container').css('padding', sidePanelZeroPadding);
                    }
                    else {
                        element.parents('.property-area-container').css('padding', sidePanelPadding);
                    }
                }, true);

                var commandListner = scope.$watch(function () {
                    return ctrl.commandButtons;
                }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ctrl.setCommandButtons(ctrl.commandButtons, 'Command');
                    }
                }, true);

                var actionListner = scope.$watch(function () {
                    return ctrl.actionButtons;
                }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ctrl.setActionButtons(ctrl.actionButtons, 'Action');
                    }
                }, true);

                scope.$on("$destroy", function () {
                    sidePanelTitle.off("mouseenter", setTitleText);
                    element.parents('.property-area-container').css('padding', sidePanelPadding);
                    actionListner();
                    commandListner();
                    classListner();
                });

            }
        }
    }

    SidepanelController.$inject = ['common', '$translate'];
    function SidepanelController(common, $translate) {
        var vm = this;
        var barButtons = [];

        function activate() {
            init();
            setActionButtons(vm.actionButtons);
            setCommandButtons(vm.commandButtons);
        }

        function init() {
            vm.sidepanelActionButtons = {
                barType: "Tool",
                bar: []
            };
            vm.sidepanelCommandButtons = {
                barType: "Action",
                bar: []
            };
            vm.closeButtonTooltip = vm.closeButton && vm.closeButton.tooltip ? vm.closeButton.tooltip : $translate.instant('sidePanel.close');
            vm.isCloseButtonShown = vm.closeButton && typeof vm.closeButton.showClose === 'boolean' ? vm.closeButton.showClose : true;
            vm.closeSidepanel = closeSidepanel;
            vm.setActionButtons = setActionButtons;
            vm.setCommandButtons = setCommandButtons;
        }

        function setSidepanelButton(button, type) {
            barButtons.push({
                "type": "Command",
                "name": button.label || button.tooltip,
                "label": button.label || button.tooltip,
                "tooltip": button.tooltip || button.label,
                "visibility": typeof button.visible === 'boolean' ? button.visible : true,
                "image": type === 'Action' ? button.img || '' : button.img || 'fa-cogs',
                "onClickCallback": button.onClick,
                "disabled": typeof button.enabled === 'boolean' ? !button.enabled : false
            });
        }

        function setActionButtons(actionButtons) {
            if (actionButtons) {
                barButtons = [];
                var labelErrorMsg = "label is mandatory";
                actionButtons.forEach(function (button) {
                    if (!button.label) {
                        logError(labelErrorMsg, button);
                    } else {
                        setSidepanelButton(button, 'Action');
                    }
                });
                vm.sidepanelActionButtons.bar = barButtons;
            }
        }

        function setCommandButtons(commandButtons) {
            if (commandButtons) {
                barButtons = [];
                var tooltipErrorMsg = 'tooltip is mandatory';
                commandButtons.forEach(function (button) {
                    if (!button.tooltip) {
                        logError(tooltipErrorMsg, button);
                    } else {
                        setSidepanelButton(button, 'Command');
                    }
                });
                vm.sidepanelCommandButtons.bar = barButtons;
            }
        }

        function logError(errorMessage, attribute) {
            common.logger.logError(errorMessage, attribute, 'siemens.simaticit.common.widgets.sidepanel');
        }

        function closeSidepanel() {
            if (vm.closeButton && vm.closeButton.onClick && typeof vm.closeButton.onClick === 'function') {
                vm.closeButton.onClick();
            } else {
                common.sidePanelManager.close();
            }
        }

        activate();
    }
})();