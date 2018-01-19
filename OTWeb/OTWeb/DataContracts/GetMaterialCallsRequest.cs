using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetMaterialCallsRequest : Request
    {
        [DataMember]
        public string ProductionLine { get; set; }
    }
}