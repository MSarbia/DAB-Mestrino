using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands;
using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using UAFServerConnectorLibrary;

namespace WebApplication1
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "IOTService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select IOTService.svc or IOTService.svc.cs at the Solution Explorer and start debugging.
    public class IOTService : IIOTService
    {
        //public static List<MaterialCall> MaterialCalls { get; set; } = new List<MaterialCall>();
        //public static List<Call> TeamLeaderCalls { get; set; } = new List<Call>();
        //public static List<OrderItem> Serials10 { get; set; } = new List<OrderItem>();
        //public static List<OrderItem> Serials20 { get; set; } = new List<OrderItem> { };
        //public static int CurrentOrder10 { get; set; } = 1;
        //public static int CurrentOrder20 { get; set; } = 1;
        static IOTService()
        {
            //InitSerials();
            // SmartWatchConnector.Init<OTService>();            
        }

        public LoginResponse Login(LoginRequest loginRequest)
        {
            var response = new LoginResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            return response;
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(loginRequest.User, loginRequest.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }
            var loginResponse = uafConnector.CallCommand<LoginUser, LoginUser.Response>(new LoginUser { User = loginRequest.User });

            if (!loginResponse.Succeeded)
            {
                response.Succeeded = false;
                response.Error = $"Errore {loginResponse.Error.ErrorCode}: {loginResponse.Error.ErrorMessage}";
                return response;
            }
            response.Equipment = loginResponse.Equipment;
            response.WorkArea = loginResponse.WorkAreas.First();
            response.Role = (OTRole)Enum.Parse(typeof(OTRole), loginResponse.Role);
            return response;
        }

        public SendTeamLeaderCallResponse SendTeamLeaderCall(SendTeamLeaderCallRequest teamLeaderCall)
        {
            var response = new SendTeamLeaderCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
           
            return response;
        }

        public SendMaterialCallResponse SendMaterialCall(SendMaterialCallRequest materialCall)
        {
            var response = new SendMaterialCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            
            return response;
        }

        public GetSerialsResponse GetSerials(GetSerialsRequest getSerials)
        {
            var response = new GetSerialsResponse
            {
                Succeeded = true,
                Error = string.Empty,
                Orders = new List<OrderItem>()
            };
            
            return response;
        }

        public GetMaterialCallsResponse GetMaterialCalls(GetMaterialCallsRequest getMaterialCalls)
        {
            var response = new GetMaterialCallsResponse()
            {
                Succeeded = true,
                Error = string.Empty,
                MaterialCalls = new List<OTWeb.DataContracts.MaterialCall>()
            };
            
            return response;
        }

        public GetTeamLeaderCallsResponse GetTeamLeaderCalls(GetTeamLeaderCallsRequest getTeamLeaderCalls)
        {
            var response = new GetTeamLeaderCallsResponse()
            {
                Succeeded = true,
                Error = string.Empty,
                TeamLeaderCalls = new List<OTWeb.DataContracts.Call>()
            };
            
            return response;
        }

        public AcceptMaterialCallResponse AcceptMaterialCall(AcceptMaterialCallRequest acceptMaterialCall)
        {
            var response = new AcceptMaterialCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            
            
            return response;
        }

        public AcceptTeamLeaderCallResponse AcceptTeamLeaderCall(AcceptTeamLeaderCallRequest acceptTeamLeaderCall)
        {
            var response = new AcceptTeamLeaderCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            
            return response;
        }

        public StartSerialResponse StartSerial(StartSerialRequest startSerialRequest)
        {
            var response = new StartSerialResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            
            return response;
        }

        public CallTeamLeaderResponse CallTeamLeader(CallTeamLeaderRequest teamLeaderCall)
        {
            SmartwatchInfo userInfo = GetSmartWatchUser(teamLeaderCall.MacAddress);
            SendTeamLeaderCallRequest request = new SendTeamLeaderCallRequest
            {
                User = userInfo.User,
                Password = userInfo.Password,
                Equipment = userInfo.Equipment
            };
            var response = SendTeamLeaderCall(request);
            return new CallTeamLeaderResponse
            {
                Error = response.Error,
                Succeeded = response.Succeeded
            };
        }

        public CallMaterialResponse CallMaterial(CallMaterialRequest materialCall)
        {
            SmartwatchInfo userInfo = GetSmartWatchUser(materialCall.MacAddress);
            SendMaterialCallRequest request = new SendMaterialCallRequest
            {
                User = userInfo.User,
                Password = userInfo.Password,
                Equipment = userInfo.Equipment
            };
            var response = SendMaterialCall(request);
            return new CallMaterialResponse
            {
                Error = response.Error,
                Succeeded = response.Succeeded
            };
        }

        private SmartwatchInfo GetSmartWatchUser(string macAddress)
        {
            var smartwatchInfo = new SmartwatchInfo
            {
                User = string.Empty,
                Password = string.Empty
            };
            
            return smartwatchInfo;
        }
    }
}
