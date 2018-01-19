using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("Operation", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract(Namespace = Constants.Namespace)]
    public class Operation
    {
        [DataMember(IsRequired = true)]
        public string Name { get; set; }
        [DataMember(IsRequired = true)]
        public int Sequence { get; set; }
        [DataMember(IsRequired = true)]
        public List<ToBeConsumedMaterial> ToBeConsumedMaterials { get; set; }
    }
}
