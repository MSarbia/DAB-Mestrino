function Login(username, password)
{
    if (username === '' || password === '')
        return;

    var login = {
        User: username,
        Password: password
    };

                                 
    $.ajax({
        type: "POST",
        url: "../OTService.svc/Login",
        data: JSON.stringify(login),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.Succeeded) {
                var userData = result;
                userData.User = login.User;
                userData.Password = login.Password;
                SaveSession('userData', userData);   
                if (result.Role === 'Operator') {
                    window.location.href = 'OTOperatorDashboard.html';
                }
                else if (result.Role === 'Operator') {   
                    window.location.href = 'OTTeamLeaderDashboard.html';
                }
            }              
        },

        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus === "error" && errorThrown !== "") {
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
        }
    });      
}

function SaveSession(name, value) {
    sessionStorage[name] =JSON.stringify(value);
}

function GetSession(name) {
    return JSON.parse(sessionStorage[name]);
}

function ClearSession(name) {
    delete sessionStorage[name];
}