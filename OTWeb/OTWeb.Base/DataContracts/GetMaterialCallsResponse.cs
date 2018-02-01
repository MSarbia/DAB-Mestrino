using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetMaterialCallsResponse : Response
    {
        [DataMember]
        public List<MaterialCall> MaterialCalls { get; set; }
    }
}