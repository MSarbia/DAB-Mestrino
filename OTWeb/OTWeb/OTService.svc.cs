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
    public class OTService : IOTService
    {
        //public static List<MaterialCall> MaterialCalls { get; set; } = new List<MaterialCall>();
        //public static List<Call> TeamLeaderCalls { get; set; } = new List<Call>();
        //public static List<OrderItem> Serials10 { get; set; } = new List<OrderItem>();
        //public static List<OrderItem> Serials20 { get; set; } = new List<OrderItem> { };
        //public static int CurrentOrder10 { get; set; } = 1;
        //public static int CurrentOrder20 { get; set; } = 1;
        static OTService()
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
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(teamLeaderCall.User, teamLeaderCall.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }
            var uafResponse = uafConnector.CallCommand<DABCreateTeamLeaderCall, DABCreateTeamLeaderCall.Response>(new DABCreateTeamLeaderCall
            {
                Equipment = teamLeaderCall.Equipment,
                WorkArea = teamLeaderCall.WorkArea,
                Operatore = teamLeaderCall.User
            });
            if (!uafResponse.Succeeded)
            {
                response.Succeeded = false;
                response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                return response;
            }
            //SmartWatchConnector.SendTeamLeaderlCall(teamLeaderCall.WorkArea, teamLeaderCall.Equipment);
            CallHub.Static_SendTeamLeaderCall(teamLeaderCall.WorkArea, teamLeaderCall.Equipment);
            return response;
        }

        public SendMaterialCallResponse SendMaterialCall(SendMaterialCallRequest materialCall)
        {
            var response = new SendMaterialCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(materialCall.User, materialCall.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }
            var uafResponse = uafConnector.CallCommand<DABCreateMaterialCall, DABCreateMaterialCall.Response>(new DABCreateMaterialCall
            {
                Equipment = materialCall.Equipment,
                WorkArea = materialCall.WorkArea,
                Operatore = materialCall.User,
                MaterialDefinition = string.Empty,
                Operation = " ",
                WorkOrder = " "
            });
            if (!uafResponse.Succeeded)
            {
                response.Succeeded = false;
                response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                return response;
            }
            //SmartWatchConnector.SendMaterialCall(loginResponse.WorkArea, materialCall.Equipment, materialCall.SerialNumber);
            CallHub.Static_SendMaterialCall(materialCall.WorkArea, materialCall.Equipment);
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
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(getSerials.User, getSerials.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }
            var uafResponse = uafConnector.CallCommand<GetSerials, GetSerials.Response>(new GetSerials
            {
                Equipment = getSerials.Equipment
            });
            if (!uafResponse.Succeeded)
            {
                response.Succeeded = false;
                response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                return response;
            }

            response.Orders.AddRange(uafResponse.Orders.Select(o => new OrderItem
            {
                Description = o.Description,
                Operation = o.Operation,
                OperationId = o.OperationId,
                Order = o.Order,
                ProductCode = o.ProductCode,
                Serials = o.Serials.Select(s => new SerialItem { SerialNumber = s.SerialNumber, Status = s.Status }).OrderBy(s => s.SerialNumber).ToList()
            }));
            response.Orders = response.Orders.OrderBy(o => o.Order).ToList();
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
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(getMaterialCalls.User, getMaterialCalls.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }

            var materialCalls = uafConnector.ProjectionQuery<RM.MaterialCall>().Where(mc => mc.WorkArea == getMaterialCalls.WorkArea && !mc.Accepted).ToList();
            response.MaterialCalls.AddRange(materialCalls.Select(mc => new MaterialCall
            {
                WorkArea = mc.WorkArea,
                CallDate = mc.Date.ToLocalTime().DateTime,
                CallId = mc.Id,
                //Description = mc.Description,
                Equipment = mc.Equipment,
                Order = mc.WorkOrder,
                ProductCode = mc.MaterialDefinition,
                //SerialNumber = mc.SerialNumber,
                Status = mc.Accepted ? "Accepted" : "Pending"
            }).OrderBy(mc => mc.CallDate));
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
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(getTeamLeaderCalls.User, getTeamLeaderCalls.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }

            var teamLeaderCalls = uafConnector.ProjectionQuery<RM.TeamLeaderCall>().Where(mc => mc.WorkArea == getTeamLeaderCalls.WorkArea && !mc.Accepted).ToList();
            response.TeamLeaderCalls.AddRange(teamLeaderCalls.Select(tlc => new Call
            {
                WorkArea = tlc.WorkArea,
                CallDate = tlc.Date.ToLocalTime().DateTime,
                CallId = tlc.Id,
                //Description = mc.Description,
                Equipment = tlc.Equipment,
                //SerialNumber = mc.SerialNumber,
                Status = tlc.Accepted ? "Accepted" : "Pending"
            }).OrderBy(tlc => tlc.CallDate));
            return response;
        }

        public AcceptMaterialCallResponse AcceptMaterialCall(AcceptMaterialCallRequest acceptMaterialCall)
        {
            var response = new AcceptMaterialCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(acceptMaterialCall.User, acceptMaterialCall.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }
            var uafResponse = uafConnector.CallCommand<DABAcceptMaterialCall, DABAcceptMaterialCall.Response>(new DABAcceptMaterialCall
            {
                Id = acceptMaterialCall.CallId,
                TeamLeader = acceptMaterialCall.User
            });
            if (!uafResponse.Succeeded)
            {
                response.Succeeded = false;
                response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                return response;
            }
            return response;
        }

        public AcceptTeamLeaderCallResponse AcceptTeamLeaderCall(AcceptTeamLeaderCallRequest acceptTeamLeaderCall)
        {
            var response = new AcceptTeamLeaderCallResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(acceptTeamLeaderCall.User, acceptTeamLeaderCall.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }
            var uafResponse = uafConnector.CallCommand<DABAcceptTeamLeaderCall, DABAcceptTeamLeaderCall.Response>(new DABAcceptTeamLeaderCall
            {
                Id = acceptTeamLeaderCall.CallId,
                TeamLeader = acceptTeamLeaderCall.User
            });
            if (!uafResponse.Succeeded)
            {
                response.Succeeded = false;
                response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                return response;
            }
            return response;
        }

        public StartSerialResponse StartSerial(StartSerialRequest startSerialRequest)
        {
            var response = new StartSerialResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            UAFConnector uafConnector = null;
            try
            {
                uafConnector = new UAFConnector(startSerialRequest.User, startSerialRequest.Password);
            }
            catch (Exception e)
            {
                response.Succeeded = false;
                response.Error = e.Message;
                return response;
            }

            if (startSerialRequest.Status == "Active")
            {
                var uafResponse = uafConnector.CallCommand<DABCompleteSerial, DABCompleteSerial.Response>(new DABCompleteSerial
                {
                    //EquipmentNId = startSerialRequest.Equipment,
                    //MaterialDefinitionNId = startSerialRequest.ProductCode,
                    //SerialNumber = startSerialRequest.SerialNumber,
                    //WorkOrderOperationNId = startSerialRequest.Operation
                    CompleteSerializedWoOpParameterList = new List<CompleteSerializedParameterType>
                    {
                        new CompleteSerializedParameterType
                        {
                            EquipmentNId = startSerialRequest.Equipment,
                            NId = startSerialRequest.Operation,
                            Id = startSerialRequest.OperationId,
                            ActualProducedMaterials = new List<MaterialItemParameterType>
                            {
                                new MaterialItemParameterType
                                {
                                    EquipmentNId = startSerialRequest.Equipment,
                                    MaterialDefinitionNId = startSerialRequest.ProductCode,
                                    SerialNumber = startSerialRequest.SerialNumber,
                                    NId = startSerialRequest.SerialNumber
                                }
                            }
                        }
                    }
                });
                if (!uafResponse.Succeeded)
                {
                    response.Succeeded = false;
                    response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                    return response;
                }
            }
            else
            {
                var uafResponse = uafConnector.CallCommand<DABStartSerial, DABStartSerial.Response>(new DABStartSerial
                {
                    //EquipmentNId = startSerialRequest.Equipment,
                    //MaterialDefinitionNId = startSerialRequest.ProductCode,
                    //SerialNumber = startSerialRequest.SerialNumber,
                    //WorkOrderOperationNId = startSerialRequest.Operation
                    StartWOOperationSerializedParameterTypeList = new List<StartSerializedParameterType>
                    {
                        new StartSerializedParameterType
                        {
                            EquipmentNId = startSerialRequest.Equipment,
                            NId = startSerialRequest.Operation,
                            Id = startSerialRequest.OperationId,
                            //EquipmentName = startSerialRequest.Equipment,
                            ToBeProducedMaterials = new List<MaterialItemParameterType>
                            {
                                new MaterialItemParameterType
                                {
                                    EquipmentNId = startSerialRequest.Equipment,
                                    MaterialDefinitionNId = startSerialRequest.ProductCode,
                                    SerialNumber = startSerialRequest.SerialNumber,
                                    NId = startSerialRequest.SerialNumber
                                }
                            }
                        }
                    }
                 });
                if (!uafResponse.Succeeded)
                {
                    response.Succeeded = false;
                    response.Error = $"Errore {uafResponse.Error.ErrorCode}: {uafResponse.Error.ErrorMessage}";
                    return response;
                }
            }
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
            var smartWatchConfig = XDocument.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "\\SmartWatchConfig.xml");
            XElement user = smartWatchConfig.Root.Elements("SmartWatch").FirstOrDefault(s => s.Attribute("MacAddress").Value.Equals(macAddress));
            if (user != null)
            {
                smartwatchInfo.User = user.Element("User").Value;
                smartwatchInfo.Password = user.Element("Password").Value;
                smartwatchInfo.Equipment = user.Element("Equipment").Value;
                smartwatchInfo.WorkArea = user.Element("WorkArea").Value;
            }
            return smartwatchInfo;
        }
    }
}
