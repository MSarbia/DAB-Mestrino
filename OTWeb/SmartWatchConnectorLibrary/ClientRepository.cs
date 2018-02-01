using OTWeb.DataContracts;
using System.Collections.Generic;

namespace SmartWatchConnectorLibrary
{
    internal class ClientRepository
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Equipment { get; set; }
        public string WorkArea { get; set; }
        public OTRole Role { get; set; }
        public Dictionary<string, MessageInfo> Messages { get; set; }
        public ClientRepository()
        {
            Messages = new Dictionary<string, MessageInfo>();
        }
    }
}