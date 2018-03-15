using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using OTWeb.CallManagement;
using System.Linq;
using SmartWatchConnectorLibrary;
using System.Xml.Linq;
using UAFServerConnectorLibrary;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands;
using RM = Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;

namespace OTWeb
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "OTService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select OTService.svc or OTService.svc.cs at the Solution Explorer and start debugging.
    public class OTFakeService : IOTService
    {
        //public static List<MaterialCall> MaterialCalls { get; set; } = new List<MaterialCall>();
        //public static List<Call> TeamLeaderCalls { get; set; } = new List<Call>();
        //public static List<OrderItem> Serials10 { get; set; } = new List<OrderItem>();
        //public static List<OrderItem> Serials20 { get; set; } = new List<OrderItem> { };
        //public static int CurrentOrder10 { get; set; } = 1;
        //public static int CurrentOrder20 { get; set; } = 1;
        static OTFakeService()
        {
            //InitSerials();
            //SmartWatchConnector.Init<OTService>();            
        }

        public LoginResponse Login(LoginRequest loginRequest)
        {
            var response = new LoginResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            
            response.Equipment = "100.DM1.D103.OP10";
            response.WorkArea = "100.DM1.D103";
            response.Role = OTRole.Operator;
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
            response.Orders.Add(new OrderItem
            {
                Description = "Order 1 Desc",
                Operation = "Operation 1",
                OperationId = 1,
                Order = "Order1",
                ProductCode = "101110060",
                Serials = new List<SerialItem>
                {
                    new SerialItem
                    {
                        SerialNumber = "000000001",
                        Status = "Available"
                    },
                    new SerialItem
                    {
                        SerialNumber = "000000002",
                        Status = "Available"
                    },
                    new SerialItem
                    {
                        SerialNumber = "000000003",
                        Status = "Available"
                    }
                }
            });

            response.Orders.Add(new OrderItem
            {
                Description = "Order 2 Desc",
                Operation = "Operation 2",
                OperationId = 2,
                Order = "Order2",
                ProductCode = "101110062",
                Serials = new List<SerialItem>
                {
                    new SerialItem
                    {
                        SerialNumber = "000000004",
                        Status = "Available"
                    },
                    new SerialItem
                    {
                        SerialNumber = "000000005",
                        Status = "Available"
                    },
                    new SerialItem
                    {
                        SerialNumber = "000000006",
                        Status = "Available"
                    }
                }
            });
            
            return response;
        }

        public GetMaterialCallsResponse GetMaterialCalls(GetMaterialCallsRequest getMaterialCalls)
        {
            var response = new GetMaterialCallsResponse()
            {
                Succeeded = true,
                Error = string.Empty,
                MaterialCalls = new List<DataContracts.MaterialCall>()
            };
            
            return response;
        }

        public GetTeamLeaderCallsResponse GetTeamLeaderCalls(GetTeamLeaderCallsRequest getTeamLeaderCalls)
        {
            var response = new GetTeamLeaderCallsResponse()
            {
                Succeeded = true,
                Error = string.Empty,
                TeamLeaderCalls = new List<DataContracts.Call>()
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
            if(string.IsNullOrEmpty(startSerialRequest.Equipment)
                || string.IsNullOrEmpty(startSerialRequest.Operation)
                || string.IsNullOrEmpty(startSerialRequest.Order)
                || string.IsNullOrEmpty(startSerialRequest.WorkArea)
                || string.IsNullOrEmpty(startSerialRequest.ProductCode)
                || string.IsNullOrEmpty(startSerialRequest.Status)
                || string.IsNullOrEmpty(startSerialRequest.SerialNumber)
                || string.IsNullOrEmpty(startSerialRequest.User)
                || string.IsNullOrEmpty(startSerialRequest.Password)
                || (startSerialRequest.OperationId == 0))
            {
                response.Succeeded = false;
                response.Error = "Errore";
            }
            return response;
        }

        public CallTeamLeaderResponse CallTeamLeader(CallTeamLeaderRequest teamLeaderCall)
        {

            return new CallTeamLeaderResponse();
        }

        public CallMaterialResponse CallMaterial(CallMaterialRequest materialCall)
        {
            return new CallMaterialResponse();
        }

        public SmartwatchInfo GetSmartWatchUser(string macAddress)
        {
            var smartwatchInfo = new SmartwatchInfo
            {
                User = string.Empty,
                Password = string.Empty
            };
            
            return smartwatchInfo;
        }

        public void RefreshSerials(string workArea)
        {

        }
    }
}
