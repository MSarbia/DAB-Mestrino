using System;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class AcceptMaterialCallRequest : Request
    {
        [DataMember]
        public Guid CallId { get; set; }
    }
}