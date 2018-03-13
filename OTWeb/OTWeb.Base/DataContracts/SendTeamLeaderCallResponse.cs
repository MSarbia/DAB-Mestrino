using System;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class SendTeamLeaderCallResponse : Response
    {
        [DataMember]
        public Guid Id { get; set; }
    }
}