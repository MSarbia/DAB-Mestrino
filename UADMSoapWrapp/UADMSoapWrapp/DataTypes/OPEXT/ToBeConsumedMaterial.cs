using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("ToBeConsumedMaterial", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract(Namespace = Constants.Namespace)]
    public class ToBeConsumedMaterial
    {
        [DataMember(IsRequired = true)]
        public string MaterialCode { get; set; }
        [DataMember]
        public string MaterialRevision { get; set; }
        [DataMember(IsRequired = true)]
        public decimal Quantity { get; set; }
        [DataMember(IsRequired = true)]
        public string UoM { get; set; }
        [DataMember(IsRequired = true)]
        public int Sequence { get; set; }
    }
}
