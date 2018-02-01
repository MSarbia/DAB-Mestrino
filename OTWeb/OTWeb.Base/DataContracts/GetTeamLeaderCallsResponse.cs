using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetTeamLeaderCallsResponse : Response
    {
        [DataMember]
        public List<Call> TeamLeaderCalls { get; set; }
    }
}