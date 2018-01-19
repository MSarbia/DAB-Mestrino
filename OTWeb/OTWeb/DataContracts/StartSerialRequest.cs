using System;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class StartSerialRequest:Request
    {
        [DataMember]
        public string SerialNumber { get; set; }
        [DataMember]
        public string Operation { get; set; }
        [DataMember]
        public string Equipment { get; set; }
    }
}