using System;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class SendMaterialCallResponse : Response
    {
        [DataMember]
        public Guid Id { get; set; }
    }
}