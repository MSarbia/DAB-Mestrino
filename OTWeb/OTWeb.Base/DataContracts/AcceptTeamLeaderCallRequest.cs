using System;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class AcceptTeamLeaderCallRequest : Request
    {
        [DataMember]
        public Guid CallId { get; set; }
        [DataMember]
        public string Equipment { get; set; }
    }
}