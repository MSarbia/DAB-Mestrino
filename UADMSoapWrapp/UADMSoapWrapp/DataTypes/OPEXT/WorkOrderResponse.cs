using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("WorkOrderResponse", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract]
    public class WorkOrderResponse
    {
        [DataMember(IsRequired = true)]
        public int WorkOrderId { get; set; }
        [DataMember(IsRequired = true)]
        public string WorkOrderNId { get; set; }
    }
}
