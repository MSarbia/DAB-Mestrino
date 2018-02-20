using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class OrderItem
    {
        [DataMember]
        public string Order { get; set; }
        [DataMember]
        public string Operation { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string ProductCode { get; set; }
        [DataMember]
        public List<SerialItem> Serials { get; set; }
    }
}