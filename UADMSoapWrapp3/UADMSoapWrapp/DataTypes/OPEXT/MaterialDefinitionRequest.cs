﻿using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("MaterialDefinitionRequest", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract(Namespace = Constants.Namespace)]
    public class MaterialDefinitionRequest
    {
        [DataMember(IsRequired = true)]
        public string MaterialCode { get; set; }
        [DataMember]
        public string MaterialRevision { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember(IsRequired = true)]
        public string UoM { get; set; }
        [DataMember]
        public bool Serialized { get; set; }
        [DataMember]
        public bool Customized { get; set; } // se false aggiungo 9 spazi bianchi al material code
    }
}
