using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class MaterialCall:Call
    {
        [DataMember]
        public string Order { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string ProductCode { get; set; }
    }
}