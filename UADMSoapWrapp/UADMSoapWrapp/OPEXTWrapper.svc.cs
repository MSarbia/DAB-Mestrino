using System;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web.Services;
using UADMSoapWrapp.DataTypes.OPEXT;

namespace UADMSoapWrapp
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "OPEXTWrapper" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select OPEXTWrapper.svc or OPEXTWrapper.svc.cs at the Solution Explorer and start debugging.
    [ServiceBehavior(Namespace = Constants.Namespace, IncludeExceptionDetailInFaults = true)]
    public class OPEXTWrapper : IOPEXTWrapper
    {
        public WorkOrderResponse ImportWorkOrder(WorkOrderRequest workOrderInfo)
        {
            return new WorkOrderResponse { WorkOrderId = 1, WorkOrderNId = workOrderInfo.ERPId };
        }

        public MaterialDefinitionResponse ImportMaterialDefinition(MaterialDefinitionRequest materialDefinition)
        {
            if (materialDefinition.MaterialCode == "pippo")
            {
                throw new Exception("Ehhhh pippo pippo..");
            }
            var materialCode = materialDefinition.Customized ? materialDefinition.MaterialCode : $"         {materialDefinition.MaterialCode}";
            return new MaterialDefinitionResponse { MaterialCode = materialDefinition.MaterialCode, MaterialRevision = materialDefinition.MaterialRevision ?? "A" };
        }
    }
}
