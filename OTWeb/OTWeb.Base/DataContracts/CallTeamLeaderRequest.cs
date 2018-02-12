using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class CallTeamLeaderRequest
    {
        [DataMember]
        public string MacAddress { get; set; }
    }
}