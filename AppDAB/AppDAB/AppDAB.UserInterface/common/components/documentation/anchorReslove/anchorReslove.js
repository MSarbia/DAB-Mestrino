/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';

    function documentAnchor($compile, $rootScope, DocumentService, documentationCenterConfigProvider) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
            },
            controller: DocumentAnchorController,
            controllerAs: 'dacCtrl',
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            var oDataPath = documentationCenterConfigProvider.config.oDataServiceURI;
            scope.$on("siemens.simaticit.common.page.contentRendered", function (event, eventArgs) {
                if (eventArgs.content.length > 0) {
                    ctrl.anchorTags = $(eventArgs.content).find('a');
                    ctrl.imageTags = $(eventArgs.content).find('img');
                    if (ctrl.anchorTags.length) {
                        modifyAnchorTags(eventArgs.callee);
                    }

                    if (ctrl.imageTags.length) {
                        addPathToImage();
                    }
                }
            });

            // Add path to Image
            // This function will set the src attribute value of an image based on the odata path and the image id.
            function addPathToImage() {
                $(ctrl.imageTags).each(function (index) {
                    if (ctrl.imageTags[index].hasAttribute('id')) {
                        var imageSrc = ctrl.imageTags[index].getAttribute('id');
                        $(ctrl.imageTags[index]).attr('src', oDataPath + "/Asset('" + imageSrc + "')/$value");
                    }
                });
            }

            // Modify the anchor tags.
            // Check if the anchor tag is pointing to an external link --> then DO NOT modify.
            // If the anchor tag is pointing to a link in same page then add a functionality to scroll to that position.
            // If the anchor tag is pointing to another page in same domain, then add a routing functionality with scroll (if any).
            /*jshint -W083 */
            function modifyAnchorTags(caller) {
                var tagParts, currentStateLink, isSamePage, pathHashCount;
                if (caller === "modalPopupCtrl.pageContent" || ctrl.currentLink === undefined) {
                    currentStateLink = [];
                }
                else {
                    currentStateLink = ctrl.currentLink.split('/');
                }
                $(ctrl.anchorTags).each(function (index) {
                    if (ctrl.anchorTags[index].hasAttribute('href')) {
                        var isExternalLink = ctrl.anchorTags[index].getAttribute('href').indexOf('http');
                        if (isExternalLink === -1) {
                            if (ctrl.anchorTags[index].getAttribute('href').indexOf('Page?$filter=contains(Title') !== -1) {
                                $(ctrl.anchorTags[index]).attr('class', 'removed-link');
                                var splittedArray = ctrl.anchorTags[index].getAttribute('href').split("'");
                                var pageTitle = null;
                                if (splittedArray[1]) {
                                    pageTitle = splittedArray[1];
                                }
                                var docId = null;
                                if (splittedArray[3]) {
                                    docId = splittedArray[3];
                                }
                                DocumentService.getAllPages("$filter=contains(tolower(Title),tolower('" + pageTitle + "')) and DocumentCode eq '" + docId + "'").then(function (result) {
                                    if (result.value.length > 0) {
                                        var popupData = '';
                                        var currentReleasePage = $.grep(result.value, function (e) { return e.ReleaseId === $rootScope.release; });
                                        if (currentReleasePage.length === 0) {
                                            if (result.value.length > 1) {
                                                popupData = createPopupData(result.value, index, caller);
                                                angular.element(ctrl.anchorTags[index]).attr('id', 'linktag' + index);
                                                angular.element(ctrl.anchorTags[index]).attr('data-toggle', 'dropdown');
                                                angular.element(ctrl.anchorTags[index]).attr('aria-haspopup', 'true');
                                                angular.element(ctrl.anchorTags[index]).attr('aria-expanded', 'false');
                                                $(ctrl.anchorTags[index]).wrap('<div style=\"display:inline-block;\" class=\"dropdown\"></div>');
                                                var linkText = angular.element(ctrl.anchorTags[index]).html();
                                                angular.element(ctrl.anchorTags[index]).html(linkText + " <span class=\"caret\"></span> ");
                                                angular.element(popupData).insertAfter(ctrl.anchorTags[index]);
                                            } else {
                                                currentReleasePage = result.value[0];
                                            }
                                        } else {
                                            currentReleasePage = currentReleasePage[0];
                                        }
                                        if (caller === "modalPopupCtrl.pageContent") {
                                            if (popupData === '') {
                                                $(ctrl.anchorTags[index]).on("click", function () {
                                                    $rootScope.reloadPopUpOnLnkClk(currentReleasePage.Id);
                                                }
                                                    );
                                                var buttonNewTab = window.document.createElement('a');
                                                angular.element(buttonNewTab).attr('href', '' + ctrl.docCenterUrl + '#/docHome/document/' + currentReleasePage.DocumentId + '/page/' + currentReleasePage.Id + '');
                                                angular.element(buttonNewTab).attr('target', '_blank');
                                                var spanNewTab = window.document.createElement('span');
                                                angular.element(buttonNewTab).append(' ');
                                                angular.element(buttonNewTab).append(spanNewTab);
                                                angular.element(buttonNewTab).insertAfter(ctrl.anchorTags[index]);
                                            }
                                        }
                                        else {
                                            $(ctrl.anchorTags[index]).on("click", function () {
                                                if (popupData === '') {
                                                    ctrl.changeState(currentReleasePage.DocumentId, currentReleasePage.Id, null);
                                                }
                                            });
                                        }
                                        $(ctrl.anchorTags[index]).removeAttr("class");
                                        $(ctrl.anchorTags[index]).attr('style', 'cursor: pointer;');
                                    }
                                });
                                $(ctrl.anchorTags[index]).removeAttr('href');
                                return;
                            }
                            tagParts = ctrl.anchorTags[index].getAttribute('href').split('/');
                            isSamePage = ctrl.anchorTags[index].getAttribute('issamepage');
                            pathHashCount = ctrl.anchorTags[index].getAttribute('isPathHavingHash');
                            if (tagParts.length > 0) {
                                ctrl.items = tagParts[tagParts.length - 1].split('#');
                                // Check if the link is in the same page.
                                if (currentStateLink[currentStateLink.length - 1] === ctrl.items[0] || isSamePage === "true") {
                                    if (ctrl.items.length > 1) {
                                        (function (anchorId) {
                                            $(ctrl.anchorTags[index]).on("click", function () {
                                                ctrl.goToHeading(anchorId);
                                            });
                                        }(ctrl.items[1]));
                                    }
                                    $(ctrl.anchorTags[index]).removeAttr('issamepage');

                                } else {
                                    var documentId, pageId, achId;
                                    documentId = tagParts[2];
                                    pageId = ctrl.items[0];
                                    achId = ctrl.items[1];
                                    if (pathHashCount && parseInt(pathHashCount) > 0) {
                                        if (ctrl.items.length > parseInt(pathHashCount) + 1) {
                                            achId = ctrl.items[ctrl.items.length - 1];
                                            var pageIdArray = ctrl.items.slice(0, ctrl.items.length - 1);
                                            pageId = pageIdArray.join('#');
                                        } else {
                                            pageId = ctrl.items.join('#');
                                            achId = null;
                                        }
                                        $(ctrl.anchorTags[index]).removeAttr('isPathHavingHash');
                                    }
                                    $(ctrl.anchorTags[index]).on("click", function () {
                                        ctrl.changeState(documentId, pageId, achId);
                                    });
                                }
                                $(ctrl.anchorTags[index]).attr('style', 'cursor: pointer;');
                                $(ctrl.anchorTags[index]).removeAttr("class");
                                $(ctrl.anchorTags[index]).removeAttr('href');
                            }
                        } else {
                            $(ctrl.anchorTags[index]).attr('target', '_blank');
                        }
                    }
                });
            }

            function makeReleaseOptionsClickHandler(pageInfo, caller) {
                return function () {
                    if (caller === "modalPopupCtrl.pageContent") {
                        $rootScope.reloadPopUpOnLnkClk(pageInfo.Id);
                    } else {
                        ctrl.changeState(pageInfo.DocumentId, pageInfo.Id, null);
                    }
                };
            }

            function createPopupData(data, anchorIndex, caller) {
                var ul = window.document.createElement('ul');
                angular.element(ul).attr('class', 'dropdown-menu');
                angular.element(ul).attr('style', 'padding-left:2px;');
                angular.element(ul).attr('aria-labelledby', 'linktag' + anchorIndex);
                $(ul).append('<li class=\'releaseDropdownHeader\'>Select Page</li>');
                for (var i = 0; i < data.length; i++) {
                    var div = window.document.createElement('a');
                    var release = window.document.createElement('div');
                    angular.element(release).attr('style', 'padding:2px;font-size:10px;');
                    var page = window.document.createElement('div');
                    angular.element(page).attr('style', 'padding:2px;font-size:14px');
                    var releaseName = window.localStorage.getItem(data[i].ReleaseId);
                    if (releaseName) {
                        angular.element(release).append(releaseName);
                    } else {
                        angular.element(release).append(data[i].ReleaseId);
                    }
                    angular.element(page).append(data[i].Title);
                    angular.element(div).attr('style', 'cursor: pointer;');
                    angular.element(div).append(page);
                    angular.element(div).append(release);
                    div.addEventListener("click", makeReleaseOptionsClickHandler(data[i], caller));
                    $(div).wrap('<li></li>');
                    $(ul).append($(div).parent());
                }
                return ul;
            }
        }
    }

    DocumentAnchorController.$inject = [  '$state', 'common.services.documentation.service'];
    function DocumentAnchorController(  $state, documentCenterService) {
        var vm = this;

        activate();

        function activate() {
            init();
        }

        function init() {
            vm.currentLink = $state.current.sitBreadcrumbLink;
            vm.docCenterUrl = documentCenterService.getDocCenterUrl();
        }

        // Function to navigate to specified heading within the page.
        vm.goToHeading = function (headerId) {
            var element = $('#' + headerId.trim());
            if (element.length === 0) {
                element = $('[name="' + headerId + '"]');
            }
            var target = element.offset().top;
            var headerHeight = $('.table-row').height();
            var breadcrumbHeight = $('.breadcrumb-div').height();
            $("div.doc-center-page").scrollTop(target - headerHeight - breadcrumbHeight);
        }

        vm.changeState = function (docId, pageId, aId) {
            if (docId) {
                $state.go('docHome.document.page', {
                    documentid: docId, pageid: pageId, anchorId: aId, preventReload: true
                });
            }
        }
    }

    /**
   * @ngdoc directive
   * @access public
   * @name sitDocumentationAnchorReslove
   * @module siemens.simaticit.common.components.documentation
   * @restrict E
   * 
   * @description
   * A directive to resolve all document related anchor tags
   * 
   * 
   * @example
   * As an Element:
   * ```
   *   <sit-documentation-anchor-reslove></sit-documentation-anchor-reslove>
   * ```
   */
    angular.module('siemens.simaticit.common.components.documentation').directive('sitDocumentationAnchorReslove', ['$compile', '$rootScope', 'common.services.documentation.service', 'common.services.documentation.config', documentAnchor]);
})();