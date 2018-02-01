using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class SerialItem
    {
        [DataMember]
        public string SerialNumber { get; set; }
        [DataMember]
        public string Status { get; set; }

        public string Order { get; set; }
    }
}