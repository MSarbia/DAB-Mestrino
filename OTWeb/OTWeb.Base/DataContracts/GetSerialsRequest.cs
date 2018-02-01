using System.Runtime.Serialization;

namespace OTWeb.DataContracts
{
    [DataContract]
    public class GetSerialsRequest : Request
    {
        [DataMember]
        public string Equipment { get; set; }
    }
}