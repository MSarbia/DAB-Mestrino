using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class SendMaterialCallRequest : SendTeamLeaderCallRequest
    {
        [DataMember]
        public string SerialNumber { get; set; }
    }
}