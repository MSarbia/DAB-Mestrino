using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class Call
    {
        [DataMember]
        public Guid CallId { get; set; }
        [DataMember]
        public string Equipment { get; set; }
        [DataMember]
        public DateTime CallDate { get; set; }
    }
}