using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace OTWeb.CallManagement
{
    public class CallHub : Hub
    {
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<CallHub>();

        public Task JoinWorkArea(string workArea)
        {
            return Groups.Add(Context.ConnectionId, workArea);
        }

        public Task LeaveWorkArea(string workArea)
        {
            return Groups.Remove(Context.ConnectionId, workArea);
        }

        public void SendMaterialCall(string message)
        {
            var p = Process.GetCurrentProcess();
            // Call the broadcastMessage method to update clients.
            Clients.All.getMaterialCall("MaterialCall", message);
        }

        public void SendTeamLeaderCall(string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.getTeamLeaderCall("TeamLeaderCall", "message");
        }

        public static void Static_SendMaterialCall(string workArea, string message)
        {
            hubContext.Clients.Group(workArea).getMaterialCall(message);
        }

        public static void Static_SendTeamLeaderCall (string workArea, string message)
        {
            hubContext.Clients.Group(workArea).getTeamLeaderCall(message);
        }

        public static void Static_MaterialCallAccepted(string equipment, string message)
        {
            hubContext.Clients.Group(equipment).materialAnswered(message);
        }

        public static void Static_TeamLeaderCallAccepted(string equipment, string message)
        {
            hubContext.Clients.Group(equipment).leaderAnswered(message);
        }

        public static void Static_SendOperatorCall(string workArea, string message)
        {
            hubContext.Clients.Group(workArea).getNewSerial(message);
        }
    }
}