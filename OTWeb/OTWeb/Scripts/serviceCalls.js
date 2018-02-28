function Login(username, password, errorCall) {
    if (username === '' || password === '')
        return;

    var login = {
        User: username,
        Password: password
    };

    callService("Login", login, function (result) {
        var userData = result;
        userData.User = login.User;
        userData.Password = login.Password;
        SaveSession('userData', userData);

        var locationHref = '';
        if (result.Role === 0) {
            locationHref = 'OTOperatorDashboard.html';
        }
        else if (result.Role === 1) {
            locationHref = 'OTTeamLeaderDashboard.html';
        }
        window.location.href = locationHref;
    }, errorCall);
}


function LogoutClick() {
    if (confirm("Sei sicuro di voler effetuare il Logout?"))
        Logout();
}

function Logout() {
    var userData = GetOrAddSession('userData', undefined);
    if (userData != undefined) {
        var chat = $.connection.callHub;
        chat.server.leaveWorkArea(userData.WorkArea);
    }
    $.connection.hub.stop();
    EmptySession();
    window.location.href = 'OTLogin.html', true;
}

function SubscribeToLeaderCalls(chat, materialCallsSuccess, teamLeaderCallsSuccess) {

    chat.client.getMaterialCall = function (message) {
        GetMaterialCalls(materialCallsSuccess);
    };

    chat.client.getTeamLeaderCall = function (message) {
        GetTeamLeaderCalls(teamLeaderCallsSuccess);
    };
}

function SubscribeToOperatorCalls(chat, getSerialsSuccess) {

    chat.client.getNewSerial = function (message) {
        GetSerials(getSerialsSuccess);
    };     
}

function GetMaterialCalls(materialCallsSuccess) {
    var userData = GetSession('userData');

    var materialCallRequest = {
        User: userData.User,
        Password: userData.Password,
        WorkArea: userData.WorkArea
    };

    callService("GetMaterialCalls", materialCallRequest, function (result) {
        materialCallsSuccess(result);
    });
}

function GetTeamLeaderCalls(teamLeaderCallsSuccess) {
    var userData = GetSession('userData');

    var teamLeaderCallRequest = {
        User: userData.User,
        Password: userData.Password,
        WorkArea: userData.WorkArea
    };

    callService("GetTeamLeaderCalls", teamLeaderCallRequest, function (result) {
        teamLeaderCallsSuccess(result);
    });
}


function CallTeamLeader() {
    var userData = GetSession('userData');

    var teamLeaderCallRequest = {
        User: userData.User,
        Password: userData.Password,
        Equipment: userData.Equipment
    };

    callService("SendTeamLeaderCall", teamLeaderCallRequest, function (result) {
        showInfo('Chiamata a TeamLeader eseguita con successo');
    });
}

function CallMaterials() {
    var userData = GetSession('userData');

    var materialCallRequest = {
        User: userData.User,
        Password: userData.Password,
        Equipment: userData.Equipment
    };

    callService("SendMaterialCall", materialCallRequest, function (result) {
        showInfo('Chiamata Materiali eseguita con successo');
    });
}


function GetSerials(getSerialsSuccess) {
    var userData = GetSession('userData');

    var getSerialsRequest = {
        User: userData.User,
        Password: userData.Password,
        Equipment: userData.Equipment
    };

    callService("GetSerials", getSerialsRequest, function (result) {
        getSerialsSuccess(result);
    });
}

function StartSerial(order, serialNumber, operation, productCode, getSerialsSuccess) {
    var userData = GetSession('userData');
    
    var startSerialRequest = {
        User: userData.User,
        Password: userData.Password,
        Equipment: userData.Equipment,
        Order: order,
        SerialNumber: serialNumber,
        Operation: operation
    };

    callService("StartSerial", startSerialRequest, function (result) {
        var getSerialsRequest = {
            User: userData.User,
            Password: userData.Password,
            Equipment: userData.Equipment
        };

        callService("GetSerials", getSerialsRequest, function (result) {
            getSerialsSuccess(result);
            var serialNumbers = result.Serials.map(function (s) { return s.SerialNumber; });
            if (serialNumbers.indexOf(serialNumber) > -1) {
                showInfo('Seriale avviato con successo');
            }
            else {
                showInfo('Seriale completato con successo');
            }
        });
    });
}

function AcceptTeamLeaderCall(callId, teamLeaderCallsSuccess) {
    var userData = GetSession('userData');

    var teamLeaderCallRequest = {
        User: userData.User,
        Password: userData.Password,
        CallId: callId
    };

    callService("AcceptTeamLeaderCall", teamLeaderCallRequest, function (result) {
        GetTeamLeaderCalls(teamLeaderCallsSuccess);
        showInfo('Chiamata a Team Leader accettata con successo');
    });
}

function AcceptMaterialCall(callId, materialCallsSuccess) {
    var userData = GetSession('userData');

    var materialCallRequest = {
        User: userData.User,
        Password: userData.Password,
        CallId: callId
    };

    callService("AcceptMaterialCall", materialCallRequest, function (result) {
        GetMaterialCalls(materialCallsSuccess)
        showInfo('Chiamata Materiale accettata con successo');
    });
}

function callService(methodName, input, successCallback, errorCallBack) {

    $('.overlay').show();
    $.ajax({
        type: "POST",
        url: "OTService.svc/" + methodName,
        data: JSON.stringify(input),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.Succeeded) {
                successCallback(result);
            }
            else {
                if (errorCallBack) {
                    errorCallBack(result.Error);
                }
                else {
                    showError(result.Error);
                }
            }
            $('.overlay').hide();
        },

        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus === "error" && errorThrown !== "") {
                showError(errorThrown);
            }
            $('.overlay').hide();
        }
    });
}



function EmptySession() {
    sessionStorage.clear();
}

function SaveSession(name, value) {
    sessionStorage[name] = JSON.stringify(value);
}

function GetSession(name) {
    var sessionValue = sessionStorage[name];
    if (sessionValue == undefined) {
        Logout();
        return;
    }
    return JSON.parse(sessionStorage[name]);
}

function GetOrAddSession(name, value) {
    var sessionValue = sessionStorage[name];
    if (sessionValue == undefined) {
        SaveSession(name, value);
        return value;
    }
    else {
        return JSON.parse(sessionStorage[name]);
    }
}

function ClearSession(name) {
    delete sessionStorage[name];
}

function centralTitle() {
    var userD = GetSession('userData');
    var texttitle = "<span style='color:#CAD4D4'>Utente: </span><span style='display:inline-block; padding-right:30px;'>" + userD.User + "</span>"
    texttitle += "<span style='color:#CAD4D4'>Linea: </span><span style='display:inline-block; padding-right:30px;'>" + userD.WorkArea + "</span>";
    if (userD.Equipment!= null && userD.Equipment != '')
        texttitle += "<span style='color:#CAD4D4'>Postazione: </span><span>" + userD.Equipment + "</span>";

    var idtitle = document.getElementById("centralTitle");
    idtitle.innerHTML = texttitle;
}

function toggleFullscreen(elem) {

    elem = elem || document.documentElement;

    if (!document.fullscreenElement && !document.mozFullScreenElement &&

      !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (elem.requestFullscreen) {

            elem.requestFullscreen();

        } else if (elem.msRequestFullscreen) {

            elem.msRequestFullscreen();

        } else if (elem.mozRequestFullScreen) {

            elem.mozRequestFullScreen();

        } else if (elem.webkitRequestFullscreen) {

            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

        }

    } else {

        if (document.exitFullscreen) {

            document.exitFullscreen();

        } else if (document.msExitFullscreen) {

            document.msExitFullscreen();

        } else if (document.mozCancelFullScreen) {

            document.mozCancelFullScreen();

        } else if (document.webkitExitFullscreen) {

            document.webkitExitFullscreen();

        }

    }

}