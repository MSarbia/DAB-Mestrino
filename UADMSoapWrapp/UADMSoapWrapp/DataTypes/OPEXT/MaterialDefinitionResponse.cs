using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("MaterialDefinitionResponse", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract]
    public class MaterialDefinitionResponse
    {
        [DataMember(IsRequired = true)]
        public string MaterialCode { get; set; }
        [DataMember(IsRequired = true)]
        public string MaterialRevision { get; set; }
    }
}
