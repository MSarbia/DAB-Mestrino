using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetTeamLeaderCallsRequest : Request
    {
        [DataMember]
        public string ProductionLine { get; set; }
    }
}