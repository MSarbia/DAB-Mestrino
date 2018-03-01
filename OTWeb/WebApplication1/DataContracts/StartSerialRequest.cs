using System;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class StartSerialRequest:Request
    {
        [DataMember]
        public string Order { get; set; }
        [DataMember]
        public string SerialNumber { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public string ProductCode { get; set; }
        [DataMember]
        public string Operation { get; set; }
        [DataMember]
        public int OperationId { get; set; }
        [DataMember]
        public string Equipment { get; set; }
    }
}