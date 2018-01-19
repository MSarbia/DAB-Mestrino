﻿using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetSerialsResponse : Response
    {
        [DataMember]
        public string Order { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string ProductCode { get; set; }
        [DataMember]
        public List<string> Serials { get; set; }
    }
}