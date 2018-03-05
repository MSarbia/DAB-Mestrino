using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetTeamLeaderCallsRequest : Request
    {
        [DataMember]
        public string WorkArea { get; set; }
    }
}