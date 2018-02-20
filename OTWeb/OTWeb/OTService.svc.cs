using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using OTWeb.CallManagement;
using System.Linq;
using SmartWatchConnectorLibrary;
using System.Xml.Linq;

namespace OTWeb
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "OTService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select OTService.svc or OTService.svc.cs at the Solution Explorer and start debugging.
    public class OTService : IOTService
    {
        private static object tempLock = new object();
        public static List<MaterialCall> MaterialCalls { get; set; } = new List<MaterialCall>();
        public static List<Call> TeamLeaderCalls { get; set; } = new List<Call>();
        public static List<OrderItem> Serials10 { get; set; } = new List<OrderItem>();
        public static List<OrderItem> Serials20 { get; set; } = new List<OrderItem> { };
        public static int CurrentOrder10 { get; set; } = 1;
        public static int CurrentOrder20 { get; set; } = 1;
        static OTService()
        {
            InitSerials();
            // SmartWatchConnector.Init<OTService>();            
        }

        public static void InitSerials()
        {
            lock (tempLock)
            {
                Serials10.Clear();
                Serials10.Add(new OrderItem
                {
                    Order = "Ordine" + CurrentOrder10,
                    Description = "Descrizione dell'ordine corrente",
                    ProductCode = "JET50xyz",
                    Operation = "Operazione10",
                    Serials = new List<SerialItem>()
                });
                for (int s = 1; s < 11; s++)
                {
                    Serials10.First().Serials.Add(new SerialItem
                    {
                        SerialNumber = "Seriale" + s,
                        Status = "Ready"
                    });
                }
            }

        }
        

        public LoginResponse Login(LoginRequest loginRequest)
        {
            var response = new LoginResponse
            {
                Succeeded = true,
                Error = string.Empty
            };
            if (loginRequest.User.ToLowerInvariant().Equals("op10"))
            {
                response.Role = OTRole.Operator;
                response.Equipment = "Postazione10";
                response.WorkArea = "Linea1";
            }
            else if (loginRequest.User.ToLowerInvariant().Equals("op20"))
            {
                response.Role = OTRole.Operator;
                response.Equipment = "Postazione20";
                response.WorkArea = "Linea1";
            }
            else if (loginRequest.User.ToLowerInvariant().StartsWith("tl"))
            {
                response.Role = OTRole.TeamLeader;
                response.WorkArea = "Linea1";
            }
            else
            {
                response.Succeeded = false;
                response.Error = "Username o Password errati";
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
            //SmartWatchConnector.SendTeamLeaderlCall(loginResponse.WorkArea, teamLeaderCall.Equipment);
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
            //SmartWatchConnector.SendMaterialCall(loginResponse.WorkArea, materialCall.Equipment, materialCall.SerialNumber);
            CallHub.Static_SendMaterialCall(loginResponse.WorkArea, materialCall.Equipment);
            return response;
        }

        public GetSerialsResponse GetSerials(GetSerialsRequest getSerials)
        {
            var login = new LoginRequest { User = getSerials.User, Password = getSerials.Password };
            var loginResponse = Login(login);
            var orders = new GetSerialsResponse
            {
                Succeeded = loginResponse.Succeeded,
                Error = loginResponse.Error,
                Orders = new List<OrderItem>()
            };
            if (!orders.Succeeded)
            {
                return orders;
            }
            string orderName = (getSerials.User.ToLowerInvariant() == "op10") ? "Ordine" + CurrentOrder10 : "Ordine" + CurrentOrder20;
            
            lock (tempLock)
            {
                if (getSerials.User.ToLowerInvariant() == "op10")
                {
                    foreach(var order in Serials10)
                    {
                        if(order.Serials.Any(s => s.Status == "Ready"))
                        {
                            orders.Orders.Add(new OrderItem { Order = orderName, Description = "Descrizione dell'ordine corrente", ProductCode = "JET50xyz", Operation = "Operazione10", Serials = new List<SerialItem>() });
                            foreach (var serial in order.Serials.Where(s => s.Status == "Ready"))
                            {
                                orders.Orders.First(o => o.Order == orderName ).Serials.Add(new SerialItem { SerialNumber = serial.SerialNumber, Status = serial.Status });
                                orders.Orders.First(o => o.Order == orderName).Serials.OrderBy(s => s.SerialNumber);
                            }
                        }
                    }
                }
                else
                {
                    foreach (var order in Serials20)
                    {
                        if (order.Serials.Any(s => s.Status != "Complete"))
                        {
                            orders.Orders.Add(new OrderItem { Order = orderName, Description = "Descrizione dell'ordine corrente", ProductCode = "JET50xyz", Operation = "Operazione20", Serials = new List<SerialItem>() });
                            foreach (var serial in order.Serials.Where(s => s.Status != "Complete"))
                            {
                                orders.Orders.First(o => o.Order == orderName).Serials.Add(new SerialItem { SerialNumber = serial.SerialNumber, Status = serial.Status });
                                orders.Orders.First(o => o.Order == orderName).Serials.OrderBy(s => s.SerialNumber);
                            }
                        }
                    }
                }

            }
            orders.Orders.OrderBy(o => o.Order);
            return orders;
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
                SerialItem serial = null;
                if (startSerialRequest.User.ToLowerInvariant() == "op10")
                {
                    serial = Serials10.FirstOrDefault(o=>o.Order == startSerialRequest.Order).Serials.FirstOrDefault(s => s.SerialNumber == startSerialRequest.SerialNumber && s.Status == "Ready");
                }
                    
                else
                    serial = Serials20.FirstOrDefault(o => o.Order == startSerialRequest.Order).Serials.FirstOrDefault(s => s.SerialNumber == startSerialRequest.SerialNumber && s.Status != "Complete");
                if (serial == null)
                {
                    response.Succeeded = false;
                    response.Error = $"Seriale {startSerialRequest.SerialNumber} non trovato";
                    return response;
                }
                if (serial.Status == "Ready")
                {

                    if (startSerialRequest.User.ToLowerInvariant() == "op10")
                    {
                        serial.Status = "Complete";
                        if(!Serials20.Any(o=>o.Order == "Ordine" + CurrentOrder10))
                        {
                            Serials20.Add(new OrderItem
                            {
                                Order = "Ordine" + CurrentOrder10,
                                Description = "Descrizione dell'ordine corrente",
                                ProductCode = "JET50xyz",
                                Operation = "Operazione20",
                                Serials = new List<SerialItem>()
                            });
                        }
                        Serials20.FirstOrDefault(o=>o.Order == "Ordine" + CurrentOrder10).Serials.Add(new SerialItem { SerialNumber = serial.SerialNumber, Status = "Ready"});
                        CallHub.Static_SendOperatorCall("Postazione20", serial.SerialNumber);
                        SmartWatchConnector.RefreshSerials("Postazione20");
                        if (Serials10.First(o => o.Order == "Ordine" + CurrentOrder10).Serials.All(s => s.Status == "Complete"))
                        {
                            CurrentOrder10++;
                            InitSerials();
                        }
                    }
                    else
                    {
                        serial.Status = "Active";
                    }
                }
                else if (serial.Status == "Active")
                {
                    serial.Status = "Complete";
                    if (Serials20.First(o => o.Order == "Ordine" + CurrentOrder20).Serials.All(s => s.Status == "Complete") && CurrentOrder10 != CurrentOrder20)
                    {
                        CurrentOrder20++;
                    }
                }
            }
            return response;
        }

        public CallTeamLeaderResponse CallTeamLeader(CallTeamLeaderRequest teamLeaderCall)
        {
            LoginRequest userInfo = GetSmartWatchUser(teamLeaderCall.MacAddress);
            var loginResponse = Login(userInfo);
            SendTeamLeaderCallRequest request = new SendTeamLeaderCallRequest
            {
                User = userInfo.User,
                Password = userInfo.Password,
                Equipment = loginResponse.Equipment
            };
            var response = SendTeamLeaderCall(request);
            return new CallTeamLeaderResponse
            {
                Error = response.Error,
                Succeeded = response.Succeeded
            };
        }

        public CallMaterialResponse CallMaterial(CallMaterialRequest teamLeaderCall)
        {
            LoginRequest userInfo = GetSmartWatchUser(teamLeaderCall.MacAddress);
            var loginResponse = Login(userInfo);
            SendMaterialCallRequest request = new SendMaterialCallRequest
            {
                User = userInfo.User,
                Password = userInfo.Password,
                Equipment = loginResponse.Equipment
            };
            var response = SendMaterialCall(request);
            return new CallMaterialResponse
            {
                Error = response.Error,
                Succeeded = response.Succeeded
            };
        }

        private LoginRequest GetSmartWatchUser(string macAddress)
        {
            var loginRequest = new LoginRequest
            {
                User = string.Empty,
                Password = string.Empty
            };
            var smartWatchConfig = XDocument.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "\\SmartWatchConfig.xml");
            XElement user = smartWatchConfig.Root.Elements("SmartWatch").FirstOrDefault(s => s.Attribute("MacAddress").Value.Equals(macAddress));
            if (user != null)
            {
                loginRequest.User = user.Element("User").Value;
                loginRequest.Password = user.Element("Password").Value;
            }
            return loginRequest;
        }
    }
}
