using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetSerialsResponse : Response
    {
        [DataMember]
        public List<OrderItem> Orders { get; set; }
    }
}