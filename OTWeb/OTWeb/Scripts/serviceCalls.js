function Login(username, password) {
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
        if (result.Role === 'Operator') {
            locationHref = 'OTOperatorDashboard.html';
        }
        else if (result.Role === 'TeamLeader') {   
            locationHref= 'OTTeamLeaderDashboard.html';
        }        
        window.location.href = locationHref;      
    });       
}


function Logout() {
    var userData = sessionStorage['userData'];
    if (userData != undefined) {
        chat.server.leaveWorkArea(userData.WorkArea);
    }
    $.connection.hub.stop();
    ClearSession('userData');
    window.location.href = 'OTLogin.html';
}

function SubscribeToCalls(chat, materialCallsSuccess, teamLeaderCallsSuccess) {

    chat.client.getMaterialCall = function (message) {
        GetMaterialCalls(materialCallsSuccess);
    };

    chat.client.getTeamLeaderCall = function (message) {
        GetTeamLeaderCalls(teamLeaderCallsSuccess);
    };
}

function GetMaterialCalls(materialCallsSuccess) {
    var userData = GetSession('userData');

    var materialCallRequest = {
        User: userData.User,
        Password: userData.Password,
        WorkArea: userData.WorkArea
    };

    callService("GetMaterialCalls", materialCallRequest,  function (result) {
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
        //codice per chiamata andata a buon fine
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
        //codice per chiamata andata a buon fine
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

function AnswerMaterialCall(callId, materialCallsSuccess) {
    var userData = GetSession('userData');

    var materialCallRequest = {
        User: userData.User,
        Password: userData.Password,
        CallId: callId
    };

    callService("AnswerMaterialCall", materialCallRequest, function (result) {
        GetMaterialCalls(materialCallsSuccess)
    });
}

function callService(methodName, input, successCallback) {
    $.ajax({
        type: "POST",
        url: "../OTService.svc/" + methodName,
        data: JSON.stringify(input),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.Succeeded) {
                successCallback(result);
            }
            else {
                showError(result.Error);
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus === "error" && errorThrown !== "") {
                showError(errorThrown);
            }
        }
    });
}

function showError(errorThrown) {
    var n = noty({
        text: errorThrown,
        type: 'warning',
        dismissQueue: false,
        modal: true,
        layout: 'center',
        theme: 'defaults',
        callback: {
        }
    });
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

function ClearSession(name) {
    delete sessionStorage[name];
}