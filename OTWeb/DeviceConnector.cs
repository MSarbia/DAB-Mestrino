// Decompiled with JetBrains decompiler
// Type: HMIHubConnector.DeviceConnector
// Assembly: HMIHubConnector, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 2C8B5FE5-79C6-49F6-8A77-7E8F3ABD1AEE
// Assembly location: C:\DAB-Mestrino\GitHub\DAB-Mestrino\OTWeb\SmartWatchConnectorLibrary\bin\Debug\HMIHubConnector.dll

using HMIHubModel.Repository;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using WebSocketSharp;

namespace HMIHubConnector
{
  public class DeviceConnector
  {
    private readonly string ServerId;
    private readonly string HMIHubUrl;
    private readonly RestClient restClient;
    private readonly WebSocket ws;
    public DeviceConnector.RestoreType RestoreActions;
    public DeviceConnector.OnClientConnected OnClientConnectedMethod;
    public DeviceConnector.OnClientReConnected OnClientReConnectedMethod;
    public DeviceConnector.OnClientDisconnected OnClientDisconnectedMethod;
    public DeviceConnector.OnMessageReceived OnMessageReceivedMethod;

    public DeviceConnector(string idServer, string hMIHubUrl)
    {
      this.ServerId = idServer;
      this.HMIHubUrl = hMIHubUrl;
      this.restClient = new RestClient("http://" + this.HMIHubUrl);
      this.ws = new WebSocket("ws://" + this.HMIHubUrl + "SubscriptionHub/ServerConnect?serverId=" + this.ServerId, Array.Empty<string>());
    }

    public bool Connect()
    {
      if (this.OnClientConnectedMethod == null && this.OnClientReConnectedMethod == null && (this.OnClientDisconnectedMethod == null && this.OnMessageReceivedMethod == null))
        return false;
      this.ws.OnMessage += new EventHandler<MessageEventArgs>(this.Ws_OnMessage);
      this.ws.OnClose += new EventHandler<CloseEventArgs>(this.Ws_OnClose);
      this.ws.OnError += new EventHandler<ErrorEventArgs>(this.Ws_OnError);
      this.ws.OnOpen += new EventHandler(this.Ws_OnOpen);
      if (!this.ws.IsAlive)
        this.ws.Connect();
      return true;
    }

    private void Ws_OnError(object sender, ErrorEventArgs e)
    {
      this.Connect();
    }

    private void Ws_OnClose(object sender, CloseEventArgs e)
    {
      this.Connect();
    }

    private void Ws_OnOpen(object sender, EventArgs e)
    {
      foreach (Device device in this.GetAllDevices().Values)
      {
        if (device.Connected)
        {
          if (device.ConnectionType == ConnectionType.Connect)
            this.ClearDevice(device.ClientUniqueID);
          else if (device.ConnectionType == ConnectionType.Reconnect)
            this.DisconnectDevice(device.ClientUniqueID);
        }
      }
    }

    private void Ws_OnMessage(object sender, MessageEventArgs e)
    {
      PushMessage message = JsonConvert.DeserializeObject<PushMessage>(e.Data);
      switch (message.Type)
      {
        case MessageType.SingleMessageClientToServer:
          if (this.OnMessageReceivedMethod == null)
            break;
          this.OnMessageReceivedMethod(message);
          break;
        case MessageType.ClientDisconnected:
          if (this.OnClientDisconnectedMethod == null)
            break;
          this.OnClientDisconnectedMethod(JsonConvert.DeserializeObject<Device>(message.ExtraMessageInfo.ToString()));
          break;
        case MessageType.ClientConnected:
          Device device = JsonConvert.DeserializeObject<Device>(message.ExtraMessageInfo.ToString());
          if (device.ConnectionType == ConnectionType.Connect)
          {
            if (this.RestoreActions.HasFlag((Enum) DeviceConnector.RestoreType.OnConnect_BeforeDelegate))
              this.RestoreDevice(device);
            if (this.OnClientConnectedMethod != null)
              this.OnClientConnectedMethod(device);
            if (!this.RestoreActions.HasFlag((Enum) DeviceConnector.RestoreType.OnConnect_AfterDelegate))
              break;
            this.RestoreDevice(device);
            break;
          }
          if (device.ConnectionType != ConnectionType.Reconnect)
            break;
          if (this.RestoreActions.HasFlag((Enum) DeviceConnector.RestoreType.OnReconnect_BeforeDelegate))
            this.RestoreDevice(device);
          if (this.OnClientReConnectedMethod != null)
            this.OnClientReConnectedMethod(device);
          if (!this.RestoreActions.HasFlag((Enum) DeviceConnector.RestoreType.OnReconnect_AfterDelegate))
            break;
          this.RestoreDevice(device);
          break;
      }
    }

    private bool PostMessage(PushMessage pMsg, out string idMsgSent, bool saveData)
    {
      idMsgSent = "";
      RestRequest restRequest = new RestRequest("MessageHub/SendMessage", Method.POST);
      restRequest.RequestFormat = DataFormat.Json;
      restRequest.AddBody((object) pMsg);
      IRestResponse restResponse = this.restClient.Execute((IRestRequest) restRequest);
      if (!restResponse.IsSuccessful)
        return false;
      PushMessage pushMessage = JsonConvert.DeserializeObject<PushMessage>(restResponse.Content);
      idMsgSent = pushMessage.MessageId;
      if (saveData && pushMessage.ClientDelivered)
        DataManager.WriteData(new List<PushMessage>()
        {
          pushMessage
        });
      return pushMessage.ClientDelivered;
    }

    private bool DisconnectDevice(string clientUniqueID)
    {
      return this.restClient.Execute((IRestRequest) new RestRequest("Utility/DisconnectClientSocket?deviceId=" + clientUniqueID, Method.GET)
      {
        RequestFormat = DataFormat.Json
      }).IsSuccessful;
    }

    private bool GetMessageOnHub(string idMessage, out PushMessage hubMessage)
    {
      hubMessage = (PushMessage) null;
      PushMessage pushMessage = new PushMessage()
      {
        Type = MessageType.GetMessage,
        MessageId = idMessage
      };
      IRestResponse restResponse = this.restClient.Execute((IRestRequest) new RestRequest("MessageHub/GetMessages", Method.POST)
      {
        RequestFormat = DataFormat.Json
      });
      if (!restResponse.IsSuccessful)
        return false;
      hubMessage = JsonConvert.DeserializeObject<PushMessage>(restResponse.Content);
      return true;
    }

    private bool RestoreDeviceOnHub(string clientUniqueID)
    {
      PushMessage pushMessage = new PushMessage()
      {
        ClientUniqueID = clientUniqueID
      };
      RestRequest restRequest = new RestRequest("DeviceHub/RestoreClientWork", Method.POST);
      restRequest.RequestFormat = DataFormat.Json;
      restRequest.AddBody((object) pushMessage);
      return this.restClient.Execute((IRestRequest) restRequest).IsSuccessful;
    }

    public Dictionary<string, Device> GetAllDevices()
    {
      IRestResponse restResponse = this.restClient.Execute((IRestRequest) new RestRequest("DeviceHub/ClientList", Method.GET));
      if (!restResponse.IsSuccessful)
        return new Dictionary<string, Device>();
      return JsonConvert.DeserializeObject<Dictionary<string, Device>>(restResponse.Content);
    }

    public bool SendMessage(PushMessage pMsg, out string idMsgSent)
    {
      return this.PostMessage(pMsg, out idMsgSent, true);
    }

    public bool DeleteMessage(string clientUniqueId, string idMessage)
    {
      List<PushMessage> source = DataManager.ReadData();
      PushMessage pushMessage = source.FirstOrDefault<PushMessage>((Func<PushMessage, bool>) (m =>
      {
        if (m.MessageId == idMessage)
          return m.ClientUniqueID == clientUniqueId;
        return false;
      }));
      if (pushMessage != null)
        source.Remove(pushMessage);
      PushMessage hubMessage;
      if (this.GetMessageOnHub(idMessage, out hubMessage))
      {
        hubMessage.Type = MessageType.SingleMessageDelete;
        string idMsgSent;
        this.PostMessage(hubMessage, out idMsgSent, false);
      }
      return true;
    }

    public bool GetMessage(string idMessage, out PushMessage message, bool restoreToHub = false)
    {
      message = DataManager.ReadData().FirstOrDefault<PushMessage>((Func<PushMessage, bool>) (m => m.MessageId == idMessage));
      PushMessage hubMessage;
      if (message == null && this.GetMessageOnHub(idMessage, out hubMessage) && hubMessage.Type != MessageType.SingleMessageDelete)
      {
        message = hubMessage;
        DataManager.WriteData(new List<PushMessage>()
        {
          hubMessage
        });
        return true;
      }
      if (message != null && !this.GetMessageOnHub(idMessage, out hubMessage))
      {
        if (restoreToHub)
        {
          string idMsgSent;
          if (this.PostMessage(message, out idMsgSent, false))
          {
            DataManager.CancelData(new List<string>()
            {
              message.MessageId
            });
            message.MessageId = idMsgSent;
            DataManager.AddData(new List<PushMessage>()
            {
              message
            });
          }
          return true;
        }
        DataManager.CancelData(new List<string>()
        {
          idMessage
        });
        return false;
      }
      if (message == null && !this.GetMessageOnHub(idMessage, out hubMessage))
        return false;
      return message != null;
    }

    public bool GetAllMessages(out List<PushMessage> hubMessages)
    {
      hubMessages = new List<PushMessage>();
      new PushMessage().Type = MessageType.GetMessages;
      IRestResponse restResponse = this.restClient.Execute((IRestRequest) new RestRequest("MessageHub/GetMessages", Method.GET)
      {
        RequestFormat = DataFormat.Json
      });
      if (!restResponse.IsSuccessful)
        return false;
      Dictionary<string, PushMessage> dictionary = JsonConvert.DeserializeObject<Dictionary<string, PushMessage>>(restResponse.Content);
      hubMessages = dictionary.Values.Where<PushMessage>((Func<PushMessage, bool>) (m => m.Type != MessageType.SingleMessageDelete)).ToList<PushMessage>();
      return true;
    }

    public bool ClearDevice(string clientUniqueID)
    {
      return this.ClearDevices(new List<string>()
      {
        clientUniqueID
      });
    }

    public bool ClearDevices(List<string> clientUniqueIDs)
    {
      List<PushMessage> hubMessages;
      if (!this.GetAllMessages(out hubMessages))
        return false;
      foreach (PushMessage pushMessage in hubMessages.Where<PushMessage>((Func<PushMessage, bool>) (m => clientUniqueIDs.Contains(m.ClientUniqueID))).ToList<PushMessage>())
        this.DeleteMessage(pushMessage.ClientUniqueID, pushMessage.MessageId);
      return true;
    }

    public bool ClearAllDevices()
    {
      return this.ClearDevices(this.GetAllDevices().Keys.ToList<string>());
    }

    public bool RestoreDevice(Device device)
    {
      List<PushMessage> pushMessageList = DataManager.ReadData();
      List<PushMessage> list = pushMessageList.Where<PushMessage>((Func<PushMessage, bool>) (m => m.ClientUniqueID == device.ClientUniqueID)).ToList<PushMessage>();
      if (list.Count == 0)
        return this.ClearDevice(device.ClientUniqueID);
      if (!this.RestoreDeviceOnHub(device.ClientUniqueID))
        return false;
      bool flag = false;
      List<PushMessage> hubMessages;
      if (!this.GetAllMessages(out hubMessages))
        return false;
      IEnumerable<PushMessage> source = hubMessages.Where<PushMessage>((Func<PushMessage, bool>) (m => m.ClientUniqueID == device.ClientUniqueID));
      foreach (PushMessage pushMessage in list)
      {
        PushMessage deviceDataMsg = pushMessage;
        if (source.FirstOrDefault<PushMessage>((Func<PushMessage, bool>) (m => m.ClientUniqueID == deviceDataMsg.ClientUniqueID)) == null)
        {
          deviceDataMsg.Type = MessageType.SingleMessageServerToClient;
          string idMsgSent;
          if (!this.PostMessage(deviceDataMsg, out idMsgSent, false))
          {
            deviceDataMsg.MessageId = idMsgSent;
            flag = true;
          }
        }
      }
      if (flag)
        DataManager.SaveData(pushMessageList);
      return true;
    }

    public delegate void OnClientConnected(Device device);

    public delegate void OnClientReConnected(Device device);

    public delegate void OnClientDisconnected(Device device);

    public delegate void OnMessageReceived(PushMessage message);

    [Flags]
    public enum RestoreType
    {
      OnConnect_BeforeDelegate = 0,
      OnConnect_AfterDelegate = 1,
      OnReconnect_BeforeDelegate = 2,
      OnReconnect_AfterDelegate = OnReconnect_BeforeDelegate | OnConnect_AfterDelegate, // 0x00000003
    }
  }
}
