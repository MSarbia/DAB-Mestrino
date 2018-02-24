using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class SmartwatchInfo:LoginResponse
    {
        [DataMember]
        public string User { get; set; }
        [DataMember]
        public string Password { get; set; }
    }
}