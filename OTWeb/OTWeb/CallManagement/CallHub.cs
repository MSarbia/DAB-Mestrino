using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace OTWeb.CallManagement
{
    public class CallHub : Hub
    {
        public void SendMaterialCall(string message)
        {
            var p = Process.GetCurrentProcess();
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage("MaterialCall", message);
        }

        public void SendTeamLeaderCall(string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage("TeamLeaderCall", "message");
        }
    }
}