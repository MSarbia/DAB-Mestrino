using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace OTWeb.CallManagement
{
    public class CallHub : Hub
    {
        public void SendMaterialCall(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, $"MaterialCall: {message}");
        }

        public void SendTeamLeaderCall(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, $"TeamLeaderCall: {message}");
        }
    }
}