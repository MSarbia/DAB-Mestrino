using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class LoginResponse:Response
    {
        [DataMember]
        public string Token { get; set; }
        [DataMember]
        public string Equipment { get; set; }
        [DataMember]
        public string WorkArea { get; set; }
        [DataMember]
        public OTRole Role { get; set; }
    }
}