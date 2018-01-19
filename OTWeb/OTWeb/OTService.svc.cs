using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace OTWeb
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "OTService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select OTService.svc or OTService.svc.cs at the Solution Explorer and start debugging.
    public class OTService : IOTService
    {
        public LoginResponse Login(LoginRequest loginRequest)
        {
            var response = new LoginResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            if (loginRequest.User.StartsWith("OP"))
            {
                response.Role = "Operator";
                response.Equipment = "Equip1";
            }
            else if (loginRequest.User.StartsWith("TL"))
            {
                response.Role = "TeamLeader";
                response.Equipment = "Line1";
            }
            else
            {
                response.Succeeded = false;
                return response;
            }
            response.Token = "sdasdaoaoaosd[asda[sdkasd";
            return response;
        }

        public SendTeamLeaderCallResponse SendTeamLeaderCall(SendTeamLeaderCallRequest teamLeaderCall)
        {
            var login = new LoginRequest { User = teamLeaderCall.User, Password = teamLeaderCall.Password };
            var loginResponse = Login(login);
            return new SendTeamLeaderCallResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
        }

        public SendMaterialCallResponse SendMaterialCall(SendMaterialCallRequest teamLeaderCall)
        {
            var login = new LoginRequest { User = teamLeaderCall.User, Password = teamLeaderCall.Password };
            var loginResponse = Login(login);
            return new SendMaterialCallResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
        }

        public GetSerialsResponse GetSerials(GetSerialsRequest getSerials)
        {
            var login = new LoginRequest { User = getSerials.User, Password = getSerials.Password };
            var loginResponse = Login(login);
            var serials = new GetSerialsResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
            if(!serials.Succeeded)
            {
                return serials;
            }
            serials.Order = "Order1";
            serials.Description = "I'm Order1";
            serials.ProductCode = "JET50";
            serials.Serials = new List<string>
            {
                "Serial1","Serial2","Serial3"
            };
            return serials;
        }

        public GetMaterialCallsResponse GetMaterialCalls(GetMaterialCallsRequest getMaterialCalls)
        {
            throw new NotImplementedException();
        }

        public GetTeamLeaderCallsResponse GetTeamLeaderCalls(GetTeamLeaderCallsRequest getTeamLeaderCalls)
        {
            throw new NotImplementedException();
        }

        public AcceptMaterialCallResponse AcceptMaterialCall(AcceptMaterialCallRequest acceptMaterialCall)
        {
            throw new NotImplementedException();
        }

        public AcceptTeamLeaderCallResponse AcceptTeamLeaderCall(AcceptTeamLeaderCallRequest acceptTeamLeaderCall)
        {
            throw new NotImplementedException();
        }
    }
}
