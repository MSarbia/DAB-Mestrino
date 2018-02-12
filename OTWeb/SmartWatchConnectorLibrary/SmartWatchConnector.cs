using HMIHubConnector;
using HMIHubModel.Repository;
using OTWeb;
using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using static HMIHubConnector.DeviceConnector;

namespace SmartWatchConnectorLibrary
{
    public static class SmartWatchConnector
    {
        private static object _deviceConnectorLock = new object();
        private static DeviceConnector _deviceConnector;

        private static object _clientMessagesLock = new object();
        private static Dictionary<string, ClientRepository> clients = new Dictionary<string, ClientRepository>();
        private static Type otServiceType;
        public static void Init<TOTService>() where TOTService : IOTService
        {
            otServiceType = typeof(TOTService);

            List<Device> devices = new List<Device>();
            lock (_deviceConnectorLock)
            {
                _deviceConnector = new DeviceConnector("OTWeb", "http://161.27.206.191/HMIHub/");
                _deviceConnector.OnClientConnectedMethod += OnSmartWatchConnected;
                _deviceConnector.OnMessageReceivedMethod += OnSmartWatchAcknowledge;
                _deviceConnector.RestoreActions = RestoreType.OnReconnect_BeforeDelegate;
                _deviceConnector.Connect();
                devices.AddRange(_deviceConnector.GetAllDevices().Where(kvp => kvp.Value.Connected).Select(kvp => kvp.Value));
            }
            foreach (var device in devices)
            {
                device.Username = "Op20";
                device.Password = "asdasdasdeee";
                OnSmartWatchConnected(device);
            }
        }

        private static IOTService GetOTService()
        {
            return (IOTService)Activator.CreateInstance(otServiceType);
        }


        private static void OnSmartWatchAcknowledge(PushMessage message)
        {
            RemoveFromClientRepository(message);
            var messageType = GetMessageType(message.ServerMessageId);
            switch (messageType)
            {
                case OTMessageType.DPIBoots:
                    {
                        CheckDPI(message);
                        break;
                    }
                case OTMessageType.DPIGloves:
                    {
                        CheckDPI(message);
                        break;
                    }
                case OTMessageType.DPIHelmet:
                    {
                        CheckDPI(message);
                        break;
                    }
                case OTMessageType.DPITools:
                    {
                        CheckDPI(message);
                        break;
                    }
                case OTMessageType.MaterialCall:
                    { break; }
                case OTMessageType.TeamLeaderCal:
                    { break; }
                case OTMessageType.Serial:
                    {
                        StartSerial(message);
                        break;
                    }
                case OTMessageType.Warning:
                    { break; }
                default:
                    { return; }
            }
        }

        private static void StartSerial(PushMessage message)
        {
            SerialInfo serialInfo = null;
            string user = null;
            string password = null;
            lock (_clientMessagesLock)
            {
                if (clients.ContainsKey(message.ClientUniqueID))
                {
                    var client = clients[message.ClientUniqueID];
                    user = client.UserName;
                    password = client.Password;
                    if (client.Messages.ContainsKey(message.MessageId))
                    {
                        serialInfo = GetMessageData<SerialInfo>(client.Messages[message.MessageId]);
                    }
                }
            }
            if (user == null || password == null || serialInfo == null)
                return;
            StartSerial(serialInfo, user, password);
        }

        private static void StartSerial(SerialInfo serial, string user, string passsword)
        {
            IOTService service = GetOTService();
            var request = new StartSerialRequest
            {
                Equipment = serial.SerialNumber,
                Operation = serial.Operation,
                SerialNumber = serial.SerialNumber,
                Password = passsword,
                User = user
            };
            service.StartSerial(request);
        }

        private static void RefreshSerials(string user, string password, string equipment)
        {
            Dictionary<string, Tuple<string, string>> credentials = new Dictionary<string, Tuple<string, string>>();

            lock (_clientMessagesLock)
            {
                var client = clients.First(c => c.Value.UserName == user && c.Value.Password == password && c.Value.Equipment == equipment);
                credentials.Add(client.Key, new Tuple<string, string>(client.Value.UserName, client.Value.Password));
            }
            RefreshSerials(credentials, equipment);
        }

        public static void RefreshSerials(string equipment)
        {
            Dictionary<string, Tuple<string, string>> credentials = new Dictionary<string, Tuple<string, string>>();

            lock (_clientMessagesLock)
            {
                foreach (var client in clients.Where(c => c.Value.Equipment == equipment))
                {
                    credentials.Add(client.Key, new Tuple<string, string>(client.Value.UserName, client.Value.Password));
                }
            }
            RefreshSerials(credentials, equipment);
        }

        private static void RefreshSerials(Dictionary<string, Tuple<string, string>> credentials, string equipment)
        {
            Dictionary<string, List<SerialInfo>> serials = new Dictionary<string, List<SerialInfo>>();
            Dictionary<string, List<SerialInfo>> newSerials = new Dictionary<string, List<SerialInfo>>();
            IOTService service = GetOTService();
            foreach (var c in credentials)
            {
                var serialsResponse = service.GetSerials(new GetSerialsRequest { Equipment = equipment, User = c.Value.Item1, Password = c.Value.Item2 });
                if (serialsResponse.Succeeded)
                {
                    serials.Add(c.Key, serialsResponse.Serials.Select(s => new SerialInfo { Operation = serialsResponse.Operation, Order = serialsResponse.Order, ProductCode = serialsResponse.ProductCode, Status = s.Status, SerialNumber = s.SerialNumber }).ToList());
                }
                if (!serials[c.Key].Any())
                {
                    serials.Remove(c.Key);
                }
            }

            lock (_clientMessagesLock)
            {
                foreach (var equipClient in serials)
                {
                    List<SerialInfo> clientSerials = new List<SerialInfo>();
                    foreach (var s in equipClient.Value)
                    {
                        if (clients[equipClient.Key].Messages.Select(m => m.Value as MessageInfo<SerialInfo>).Any(m => m != null && m.Data.SerialNumber == s.SerialNumber && m.Data.Operation == s.Operation && m.Data.Order == s.Order && m.Data.ProductCode == s.ProductCode))
                        {
                            clientSerials.Add(new SerialInfo
                            {
                                Operation = s.Operation,
                                Order = s.Order,
                                ProductCode = s.ProductCode,
                                SerialNumber = s.ProductCode,
                                Status = s.Status
                            });
                        }
                    }
                    if (clientSerials.Any())
                    {
                        newSerials.Add(equipClient.Key, clientSerials);
                    }
                }
            }
            foreach (var clientId in newSerials)
            {
                foreach (var serialInfo in clientId.Value)
                {
                    SendMessage(clientId.Key, OTMessageType.Serial, serialInfo.SerialNumber, string.Empty, serialInfo);
                }
            }
        }

        public static bool SendMaterialCall(string workArea, string equipment, string serialNumber)
        {
            IEnumerable<string> clientIds;
            lock (_clientMessagesLock)
            {
                clientIds = clients.Where(kvp => kvp.Value.WorkArea == workArea).Select(kvp => kvp.Key);
            }
            foreach (var clientId in clientIds)
            {
                SendMessage(clientId, OTMessageType.MaterialCall, equipment, string.Empty);
            }
            return clientIds.Any();
        }

        public static bool SendTeamLeaderlCall(string workArea, string equipment)
        {
            IEnumerable<string> clientIds;
            lock (_clientMessagesLock)
            {
                clientIds = clients.Where(kvp => kvp.Value.WorkArea == workArea).Select(kvp => kvp.Key);
            }
            foreach (var clientId in clientIds)
            {
                SendMessage(clientId, OTMessageType.TeamLeaderCal, equipment, string.Empty);
            }
            return clientIds.Any();
        }

        private static bool IsDPI(MessageInfo mi)
        {
            return mi.Type.Equals(OTMessageType.DPIBoots) || mi.Type.Equals(OTMessageType.DPIGloves) || mi.Type.Equals(OTMessageType.DPIHelmet) || mi.Type.Equals(OTMessageType.DPITools);
        }

        private static void CheckDPI(PushMessage message)
        {
            string user = string.Empty;
            string password = string.Empty;
            string equipment = string.Empty;
            lock (_clientMessagesLock)
            {
                if (clients[message.ClientUniqueID].Messages.Any(m => IsDPI(m.Value)))
                { return; }
                else
                {
                    user = clients[message.ClientUniqueID].UserName;
                    password = clients[message.ClientUniqueID].Password;
                    equipment = clients[message.ClientUniqueID].Equipment;
                }
            }
            if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(equipment))
                return;

            RefreshSerials(user, password, equipment);
        }

        private static void OnSmartWatchConnected(Device device)
        {
            IOTService service = GetOTService();
            var loginResponse = service.Login(new LoginRequest
            {
                User = device.Username,
                Password = device.Password
            });
            if (loginResponse.Succeeded)
            {
                lock (_clientMessagesLock)
                {
                    if (!clients.ContainsKey(device.ClientUniqueID))
                    {
                        clients.Add(device.ClientUniqueID, new ClientRepository
                        {
                            UserName = device.Username,
                            Password = device.Password,
                            Equipment = loginResponse.Equipment,
                            WorkArea = loginResponse.WorkArea,
                            Role = loginResponse.Role
                        });
                    }
                }
                SendDPICheck(device);
            }
            else
            {
                SendMessage(device.ClientUniqueID, OTMessageType.Warning, "Username o Password errati", string.Empty);
            }

        }

        private static MessagePriority GetPriority(OTMessageType messageType)
        {
            switch (messageType)
            {
                case OTMessageType.DPIBoots:
                    return MessagePriority.Informational;
                case OTMessageType.DPIGloves:
                    return MessagePriority.Informational;
                case OTMessageType.DPIHelmet:
                    return MessagePriority.Informational;
                case OTMessageType.DPITools:
                    return MessagePriority.Informational;
                case OTMessageType.MaterialCall:
                    return MessagePriority.Hight;
                case OTMessageType.TeamLeaderCal:
                    return MessagePriority.Hight;
                case OTMessageType.Serial:
                    return MessagePriority.Normal;
                case OTMessageType.Warning:
                    return MessagePriority.Warning;
                default:
                    return MessagePriority.Normal;
            }
        }
        private static bool SendMessage(string clientId, OTMessageType messageType, string text, string image64)
        {
            return SendMessage<object>(clientId, messageType, text, image64, null);
        }

        private static bool SendMessage<TData>(string clientId, OTMessageType messageType, string text, string image64, TData messageData)
        {
            bool isCall = messageType.Equals(OTMessageType.TeamLeaderCal) || messageType.Equals(OTMessageType.MaterialCall);
            MessageOptions mo = new MessageOptions
            {
                Vibration = isCall || messageType.Equals(OTMessageType.Warning)
            };
            if (!string.IsNullOrEmpty(image64))
            {
                mo.Image64 = image64;
            }
            PushMessage pm = new PushMessage()
            {
                ClientUniqueID = clientId,
                MessagePriority = GetPriority(messageType),
                ACKType = ACKType.Single,
                MessageOptions = mo,
                Type = MessageType.SingleMessageServerToClient,
                ServerMessageId = $"{messageType}_{Guid.NewGuid()}",
                MessageText = string.IsNullOrEmpty(text) ? null : text
            };
            string messageId;
            bool succeeded = false;
            lock (_deviceConnectorLock)
            {
                succeeded = _deviceConnector.SendMessage(pm, out messageId);
            }
            if (succeeded)
            {
                AddToClientRepository(pm, messageData);
            }
            return succeeded;
        }

        private static void AddToClientRepository<TData>(PushMessage pm, TData messageData)
        {
            lock (_clientMessagesLock)
            {
                if (clients.ContainsKey(pm.ClientUniqueID))
                {
                    clients[pm.ClientUniqueID].Messages.Add(pm.MessageId, GetMessageInfo(pm, messageData));
                }
            }
        }

        private static void RemoveFromClientRepository(PushMessage pm)
        {
            lock (_clientMessagesLock)
            {
                if (clients.ContainsKey(pm.ClientUniqueID))
                {
                    clients[pm.ClientUniqueID].Messages.Remove(pm.MessageId);
                }
            }
        }

        private static OTMessageType GetMessageType(string serverMessageId)
        {
            return (OTMessageType)Enum.Parse(typeof(OTMessageType), serverMessageId.Split('_').First());
        }

        private static MessageInfo GetMessageInfo<TData>(PushMessage pm, TData messageData)
        {
            var messageInfo = new MessageInfo<TData>
            {
                Type = GetMessageType(pm.ServerMessageId),
                Delivered = pm.ClientDelivered
            };
            if (messageData != null)
            {
                messageInfo.Data = messageData;
            }
            return messageInfo;
        }
        private static TData GetMessageData<TData>(MessageInfo mi)
        {
            return ((MessageInfo<TData>)mi).Data;
        }

        private static void SendDPICheck(Device device)
        {
            if (SendMessage(device.ClientUniqueID, OTMessageType.DPIBoots, "Scarpe", "immagineScarpe64")
                && SendMessage(device.ClientUniqueID, OTMessageType.DPIGloves, "Guanti", "immagineGuanti64")
                    && SendMessage(device.ClientUniqueID, OTMessageType.DPIHelmet, "Caschetto", "immagineCasco64")
                        && SendMessage(device.ClientUniqueID, OTMessageType.DPITools, "Strumenti di lavoro", "immagineStrumenti64"))
            {
                return;
            }
            else
            {
                lock (_deviceConnectorLock)
                {
                    _deviceConnector.ClearDevice(device.ClientUniqueID);
                }
                SendMessage(device.ClientUniqueID, OTMessageType.Warning, "Errore di connessione. Eseguire nuovo Login", string.Empty);
            }
        }
    }
}
