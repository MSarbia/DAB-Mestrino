using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("ERPOrderResponse", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract(Namespace = Constants.Namespace)]
    public class ERPOrderResponse
    {
        [DataMember(IsRequired = true)]
        public int WorkOrderId { get; set; }
        [DataMember(IsRequired = true)]
        public string WorkOrderNId { get; set; }
    }
}
