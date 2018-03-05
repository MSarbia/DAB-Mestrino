(function () {
    'use strict';
    angular.module('Engineering.DAB.AppDAB.OEEModule')
        .constant('Engineering.DAB.AppDAB.OEEModule.OEEScreen.constants', ScreenServiceConstants())
        .service('Engineering.DAB.AppDAB.OEEModule.OEEScreen.service', ScreenService)
        .run(ScreenServiceRun);

    function ScreenServiceConstants() {
        return {
            data: {
                appName: 'AppDAB',
                appPrefix: 'Engineering.DAB',
                // TODO: Customize the entityName with the name of the entity defined in the App you want to manage within the UI Module.
                //       Customize the command name with the name of the command defined in the App you want to manage within the UI Module
                entityName: null,
                createPublicName: null,
                updatePublicName: null,
                deletePublicName: null
            }
        };
    }

    ScreenService.$inject = ['$q', '$state', 'common.base', 'Engineering.DAB.AppDAB.OEEModule.OEEScreen.constants', 'common.services.logger.service'];
    function ScreenService($q, $state, base, context, loggerService) {
        var self = this;
        var logger, backendService;

        activate();
        function activate() {
            logger = loggerService.getModuleLogger('Engineering.DAB.AppDAB.OEEModule.OEEScreen.service');
            backendService = base.services.runtime.backendService;
            exposeApi();
        }

        function exposeApi() {
            self.getAll = getAll;
            self.create = createEntity;
            self.update = updateEntity;
            self.delete = deleteEntity;
        }

        function getAll(options) {
            return execGetAll(options);
        }

        function createEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create 
            var obj = {
                'Id': data.Id
            };
            return execCommand(context.data.createPublicName, obj);
        }

        function updateEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create
            var obj = {
                'Id': data.Id
            };
            return execCommand(context.data.updatePublicName, obj);
        }

        function deleteEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will delete
            var obj = {
                'Id': data.Id
            };
            return execCommand(context.data.deletePublicName, obj);
        }

        function execGetAll(options) {
            return backendService.findAll({
                'appName': context.data.appName,
                'entityName': context.data.entityName,
                'options': options
            });
        }

        function execCommand(publicName, params) {
            logger.logDebug('Executing command.......', publicName);
            return backendService.invoke({
                'appName': context.data.appName,
                'commandName': publicName,
                'params': params
            });
        }
    }

    ScreenServiceRun.$inject = ['Engineering.DAB.AppDAB.OEEModule.OEEScreen.constants', 'common.base'];
    function ScreenServiceRun(context, common) {
        if (!context.data.entityName) {
            common.services.logger.service.logWarning('Configure the entityName');
        };
        if (!context.data.createPublicName) {
            common.services.logger.service.logWarning('Configure the createPublicName');
        };
        if (!context.data.deletePublicName) {
            common.services.logger.service.logWarning('Configure the deletePublicName');
        };
        if (!context.data.updatePublicName) {
            common.services.logger.service.logWarning('Configure the updatePublicName');
        };
    }
}());


//*********************************************************************
// From DataManager.js
//
function drawLineChart(URL_ANDON_GET_DATA, onComplete) {

    if (!URL_ANDON_GET_DATA)
        URL_ANDON_GET_DATA = "http://localhost/WebserviceAndon/Andon/Andon/GetOEEvalues";

    // Add a helper to format timestamp data
    Date.prototype.formatMMDDYYYY = function () {
        return (this.getMonth() + 1) +
            "/" + this.getDate() +
            "/" + this.getFullYear();
    }

    //$.ajax({
    //    //url: "http://localhost:25412/Andon/Andon/GetOEEvalues",
    //    url: URL_ANDON_GET_DATA,
    //    //url: "WebserviceAndon/GetOEEvalues",
    //    type: 'POST',
    //    dataType: 'json',
    //    timeout: 30000,
    //    cache: false
    //}).done(function (results) {

    //    // Split timestamp and data into separate arrays
    //    /*
    //            var labels = [], data = [];
    //            results["packets"].forEach(function (packet) {
    //                labels.push(new Date(packet.timestamp).formatMMDDYYYY());
    //                data.push(parseFloat(packet.payloadString));
    //            });

    //            loadProd(labelProd, dataProd);
    //            loadOEE(labelOEE, dataOEE);
    //    */
    loadProd("", "");
    loadOEE("", "");

    //    $("#gigietto").html(results.ProductionLineId);
    //    ANDON.SetData()
    //    onComplete();

    //})
    //.error(function (err) {

    //    MyTrace(1, "ERR:" + JSON.stringify(err))

    //    try {
    //        xhr.abort();
    //    }
    //    catch (e) { }
    //    ANDON.timestampAjax = ANDON.getTime();
    //    ANDON.webServiceStatus = 0;
    //    $("#ANDON_WS_STATUS").css("background-color", "red");
    //});
}

function refreshSynoptic(URL_SYNOPTIC_GET_DATA, onComplete) {
    if (!URL_SYNOPTIC_GET_DATA)
        URL_SYNOPTIC_GET_DATA = "http://localhost/WebserviceAndon/Andon/Andon/GetSynopticvalues";

    $.ajax({
        url: URL_SYNOPTIC_GET_DATA,
        //url: "WebserviceAndon/GetOEEvalues",
        type: 'POST',
        dataType: 'json',
        timeout: 30000,
        cache: false
    }).done(function (results) {

        $("#btnJET").html(results.LineName);

        onComplete();

    })
    //.error(function (err) {

    //    MyTrace(1, "ERR:" + JSON.stringify(err))

    //    try {
    //        xhr.abort();
    //    }
    //    catch (e) { }
    //    ANDON.timestampAjax = ANDON.getTime();
    //    ANDON.webServiceStatus = 0;
    //    $("#ANDON_WS_STATUS").css("background-color", "red");
    //});
}


//*********************************************************************
// From util.js
//
'use strict';

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

(function (global) {
    var Months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
    ];

    var COLORS = [
		'#4dc9f6',
		'#f67019',
		'#f53794',
		'#537bc4',
		'#acc236',
		'#166a8f',
		'#00a950',
		'#58595b',
		'#8549ba'
    ];

    var Samples = global.Samples || (global.Samples = {});
    var Color = global.Color;

    Samples.utils = {
        // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        srand: function (seed) {
            this._seed = seed;
        },

        rand: function (min, max) {
            var seed = this._seed;
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            this._seed = (seed * 9301 + 49297) % 233280;
            return min + (this._seed / 233280) * (max - min);
        },

        numbers: function (config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 1;
            var from = cfg.from || [];
            var count = cfg.count || 8;
            var decimals = cfg.decimals || 8;
            var continuity = cfg.continuity || 1;
            var dfactor = Math.pow(10, decimals) || 0;
            var data = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = (from[i] || 0) + this.rand(min, max);
                if (this.rand() <= continuity) {
                    data.push(Math.round(dfactor * value) / dfactor);
                } else {
                    data.push(null);
                }
            }

            return data;
        },

        labels: function (config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 100;
            var count = cfg.count || 8;
            var step = (max - min) / count;
            var decimals = cfg.decimals || 8;
            var dfactor = Math.pow(10, decimals) || 0;
            var prefix = cfg.prefix || '';
            var values = [];
            var i;

            for (i = min; i < max; i += step) {
                values.push(prefix + Math.round(dfactor * i) / dfactor);
            }

            return values;
        },

        months: function (config) {
            var cfg = config || {};
            var count = cfg.count || 12;
            var section = cfg.section;
            var values = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = Months[Math.ceil(i) % 12];
                values.push(value.substring(0, section));
            }

            return values;
        },

        color: function (index) {
            return COLORS[index % COLORS.length];
        },

        transparentize: function (color, opacity) {
            var alpha = opacity === undefined ? 0.5 : 1 - opacity;
            return Color(color).alpha(alpha).rgbString();
        }
    };

    // DEPRECATED
    window.randomScalingFactor = function () {
        return Math.round(Samples.utils.rand(0, 100));
    };

    // INITIALIZATION

    Samples.utils.srand(Date.now());

    // Google Analytics
    /* eslint-disable */
    if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-28909194-3', 'auto');
        ga('send', 'pageview');
    }
    /* eslint-enable */

}(this));
