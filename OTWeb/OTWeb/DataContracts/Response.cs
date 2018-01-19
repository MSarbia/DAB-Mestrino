using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class Response
    {
        [DataMember]
        public bool Succeeded { get; set; }

        [DataMember]
        public string Error { get; set; }
    }
}