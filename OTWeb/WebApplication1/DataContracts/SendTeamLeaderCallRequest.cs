﻿using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class SendTeamLeaderCallRequest:Request
    {
        [DataMember]
        public string Equipment { get; set; }

        [DataMember]
        public string WorkArea { get; set; }
    }
}