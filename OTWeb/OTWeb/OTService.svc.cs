using Microsoft.AspNet.SignalR;
using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using OTWeb.CallManagement;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Diagnostics;

namespace OTWeb
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "OTService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select OTService.svc or OTService.svc.cs at the Solution Explorer and start debugging.
    public class OTService : IOTService
    {
        private static object tempLock = new object();
        public static List<MaterialCall> MaterialCalls { get; set; } = new List<MaterialCall>();
        public static List<Call> TeamLeaderCalls { get; set; } = new List<Call>();
        public static List<SerialItem> Serials { get; set; } = new List<SerialItem> { new SerialItem { SerialNumber = "SN1", Status="Ready" }, new SerialItem { SerialNumber = "SN2", Status = "Ready" }, new SerialItem { SerialNumber = "SN3", Status = "Ready" }, new SerialItem { SerialNumber = "SN4", Status = "Ready" }, new SerialItem { SerialNumber = "SN5", Status = "Ready" }, new SerialItem { SerialNumber = "SN6", Status = "Ready" }, new SerialItem { SerialNumber = "SN7", Status = "Ready" }, new SerialItem { SerialNumber = "SN8", Status = "Ready" }, new SerialItem { SerialNumber = "SN9", Status = "Ready" }, new SerialItem { SerialNumber = "SN10", Status = "Ready" } };



        public LoginResponse Login(LoginRequest loginRequest)
        {
            var response = new LoginResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            if (loginRequest.User.ToLowerInvariant().StartsWith("op"))
            {
                response.Role = "Operator";
                response.Equipment = "Equip1";
                response.WorkArea = "Line1";
            }
            else if (loginRequest.User.ToLowerInvariant().StartsWith("tl"))
            {
                response.Role = "TeamLeader";
                response.WorkArea = "Line1";
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
            var response = new SendTeamLeaderCallResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                TeamLeaderCalls.Add(new Call { CallDate = DateTime.UtcNow, CallId = Guid.NewGuid(), Equipment = teamLeaderCall.Equipment, WorkArea = loginResponse.WorkArea, Status = "Pending" });
            }
            CallHub.Static_SendTeamLeaderCall(loginResponse.WorkArea, teamLeaderCall.Equipment);
            return response;
        }

        public SendMaterialCallResponse SendMaterialCall(SendMaterialCallRequest materialCall)
        {
            var login = new LoginRequest { User = materialCall.User, Password = materialCall.Password };
            var loginResponse = Login(login);
            var response = new SendMaterialCallResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                MaterialCalls.Add(new MaterialCall { CallDate = DateTime.UtcNow, CallId = Guid.NewGuid(), Equipment = materialCall.Equipment, WorkArea = loginResponse.WorkArea, Status = "Pending", Order = "MyOrder", Description = "MyOrderDescription", ProductCode = "MyProductCode", SerialNumber = materialCall.SerialNumber });
            }
            CallHub.Static_SendMaterialCall(loginResponse.WorkArea, materialCall.Equipment);
            return response;
        }

        public GetSerialsResponse GetSerials(GetSerialsRequest getSerials)
        {
            var login = new LoginRequest { User = getSerials.User, Password = getSerials.Password };
            var loginResponse = Login(login);
            var serials = new GetSerialsResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error,
                Serials = new List<SerialItem>()
            };
            if (!serials.Succeeded)
            {
                return serials;
            }
            serials.Order = "Order1";
            serials.Order = "Op10";
            serials.Description = "I'm Order1";
            serials.ProductCode = "JET50";

            lock (tempLock)
            {
                foreach (var serial in Serials.Where(s=>s.Status != "Complete"))
                {
                    serials.Serials.Add(new SerialItem { SerialNumber = serial.SerialNumber, Status = serial.Status });
                }
            }
            serials.Serials.OrderBy(s => s.SerialNumber);
            return serials;
        }

        public GetMaterialCallsResponse GetMaterialCalls(GetMaterialCallsRequest getMaterialCalls)
        {
            var login = new LoginRequest { User = getMaterialCalls.User, Password = getMaterialCalls.Password };
            var loginResponse = Login(login);
            var response = new GetMaterialCallsResponse()
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error,
                MaterialCalls = new List<MaterialCall>()
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                response.MaterialCalls.AddRange(MaterialCalls.Where(mc => mc.WorkArea == loginResponse.WorkArea && mc.Status == "Pending"));
            }
            response.MaterialCalls.OrderBy(mc => mc.CallDate);
            return response;
        }

        public GetTeamLeaderCallsResponse GetTeamLeaderCalls(GetTeamLeaderCallsRequest getTeamLeaderCalls)
        {
            var login = new LoginRequest { User = getTeamLeaderCalls.User, Password = getTeamLeaderCalls.Password };
            var loginResponse = Login(login);
            var response = new GetTeamLeaderCallsResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error,
                TeamLeaderCalls = new List<Call>()
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                response.TeamLeaderCalls.AddRange(TeamLeaderCalls.Where(mc => mc.WorkArea == loginResponse.WorkArea && mc.Status == "Pending"));
            }
            response.TeamLeaderCalls.OrderBy(tc => tc.CallDate);
            return response;
        }

        public AcceptMaterialCallResponse AcceptMaterialCall(AcceptMaterialCallRequest acceptMaterialCall)
        {
            var login = new LoginRequest { User = acceptMaterialCall.User, Password = acceptMaterialCall.Password };
            var loginResponse = Login(login);
            var response = new AcceptMaterialCallResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                var call = MaterialCalls.FirstOrDefault(mc => mc.CallId == acceptMaterialCall.CallId && mc.Status == "Pending");
                if (call == null)
                {
                    response.Succeeded = false;
                    response.Error = $"No MaterialCall found with Id: {acceptMaterialCall.CallId}";
                    return response;
                }
                call.Status = "Accepted";
            }
            return response;
        }

        public AcceptTeamLeaderCallResponse AcceptTeamLeaderCall(AcceptTeamLeaderCallRequest acceptTeamLeaderCall)
        {
            var login = new LoginRequest { User = acceptTeamLeaderCall.User, Password = acceptTeamLeaderCall.Password };
            var loginResponse = Login(login);
            var response = new AcceptTeamLeaderCallResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                var call = TeamLeaderCalls.FirstOrDefault(tc => tc.CallId == acceptTeamLeaderCall.CallId && tc.Status == "Pending");
                if (call == null)
                {
                    response.Succeeded = false;
                    response.Error = $"No TeamLeaderCall found with Id: {acceptTeamLeaderCall.CallId}";
                    return response;
                }
                call.Status = "Accepted";
            }
            return response;
        }

        public StartSerialResponse StartSerial(StartSerialRequest startSerialRequest)
        {
            var login = new LoginRequest { User = startSerialRequest.User, Password = startSerialRequest.Password };
            var loginResponse = Login(login);
            var response = new StartSerialResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error
            };
            if (!response.Succeeded)
            {
                return response;
            }
            lock (tempLock)
            {
                var serial = Serials.FirstOrDefault(s => s.SerialNumber == startSerialRequest.SerialNumber && s.Status != "Complete");
                if (serial == null)
                {
                    response.Succeeded = false;
                    response.Error = $"SerialNumber {startSerialRequest.SerialNumber} not found";
                    return response;
                }
                if(serial.Status=="Ready")
                {
                    serial.Status = "Active";
                }
                else if(serial.Status == "Active")
                {
                    serial.Status = "Complete";
                }
            }
            return response;
        }
    }
}
