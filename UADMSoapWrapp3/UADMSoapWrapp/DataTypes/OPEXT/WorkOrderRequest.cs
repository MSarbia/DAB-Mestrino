using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace UADMSoapWrapp.DataTypes.OPEXT
{
    [XmlRoot("WorkOrderRequest", Namespace = Constants.Namespace, IsNullable = false)]
    [DataContract(Namespace = Constants.Namespace)]
    public class WorkOrderRequest
    {
        [DataMember(IsRequired =true)]
        public string ERPId { get; set; }
        [DataMember(IsRequired = true)]
        public string FinalMaterialCode { get; set; }
        [DataMember]
        public string FinalMaterialRevision { get; set; }
        [DataMember(IsRequired = true)]
        public int Quantity { get; set; }
        [DataMember]
        public DateTime EstimatedStartTime { get; set; }
        [DataMember]
        public DateTime EstimatedEndTime { get; set; }
        [DataMember(IsRequired = true)]
        public int Priority { get; set; }
        [DataMember(IsRequired = true)]
        public List<Operation> Operations { get; set; }
    }
}
