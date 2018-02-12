using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class CallMaterialRequest
    {
        [DataMember]
        public string MacAddress { get; set; }
    }
}