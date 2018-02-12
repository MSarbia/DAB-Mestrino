using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Types;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;
using Siemens.SimaticIT.Unified.Common.Information;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml.Serialization;
using UAFServerConnectorLibrary;

namespace UADMSoapWrapper
{
    [System.CodeDom.Compiler.GeneratedCodeAttribute("wsdl", "4.6.1590.0")]
    [System.Web.Services.WebServiceAttribute(Namespace = Constants.NameSpace)]
    [System.Web.Services.WebServiceBindingAttribute(Name = "IOP_EXTServiceSoapBinding", Namespace = Constants.NameSpace)]
    public class OP_EXTService : IOP_EXTService
    {
        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("", RequestNamespace = Constants.NameSpace, ResponseNamespace = Constants.NameSpace, Use = System.Web.Services.Description.SoapBindingUse.Literal)]
        [return: System.Xml.Serialization.XmlElementAttribute("MaterialDefinitionResponse")]
        public override MaterialDefinitionResponse ImportMaterialDefinition(MaterialDefinitionRequest MaterialDefinition)
        {
            var materialCode = MaterialDefinition.Customized ? MaterialDefinition.MaterialCode : $"         {MaterialDefinition.MaterialCode}";
            return new MaterialDefinitionResponse { MaterialCode = MaterialDefinition.MaterialCode, MaterialRevision = MaterialDefinition.MaterialRevision ?? "A" };
        }

        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("", RequestNamespace = Constants.NameSpace, ResponseNamespace = Constants.NameSpace, Use = System.Web.Services.Description.SoapBindingUse.Literal)]
        [return: System.Xml.Serialization.XmlElementAttribute("ERPOrderResponse")]
        public override ERPOrderResponse ImportERPOrder(ERPOrderRequest ERPOrderInfo)
        {
            var uafConnector = new UAFConnector();
            ImportERPOrder input = new ImportERPOrder(new Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Types.ERPOrderRequest()
            {
                ERPId = ERPOrderInfo.ERPId,
                CycleTimeMs = ERPOrderInfo.CycleTimeMs,
                EstimatedEndTime = ERPOrderInfo.EstimatedEndTime,
                EstimatedStartTime = ERPOrderInfo.EstimatedStartTime,
                FinalMaterialCode = ERPOrderInfo.FinalMaterialCode,
                FinalMaterialRevision = ERPOrderInfo.FinalMaterialRevision,
                Operators = ERPOrderInfo.Operators,
                Orders = new List<ERPOrderPhase> {},
                Priority = ERPOrderInfo.Priority,
                Quantity = ERPOrderInfo.Quantity,
                SetupTimeMs = ERPOrderInfo.SetupTimeMs
            });

            foreach(var order in ERPOrderInfo.Orders)
            {
              
                    var orderPhase = new ERPOrderPhase
                    {
                        Name = order.Name,
                        NextOrder = order.NextOrder,
                        Sequence = order.Sequence,
                        ToBeConsumedMaterials = new List<ERPConsumedMaterial>(),
                        WorkArea = order.WorkArea
                    };
                foreach(var mat in order.ToBeConsumedMaterials)
                {
                    orderPhase.ToBeConsumedMaterials.Add(new ERPConsumedMaterial
                    {
                        MaterialCode = mat.MaterialCode,
                        MaterialRevision = mat.MaterialRevision,
                        Quantity = mat.Quantity,
                        Sequence = mat.Sequence,
                        UoM = mat.UoM
                    });
                }
                input.ERPOrderInfo.Orders.Add(orderPhase);
            }

            var response = uafConnector.CallCommand<ImportERPOrder, ImportERPOrder.Response>(input);
            if(!response.Succeeded)
            {
                throw new Exception($"Error {response.Error.ErrorCode}: {response.Error.ErrorMessage}");
            }
            return new ERPOrderResponse { WorkOrderId = response.WorkOrderIds.First(), WorkOrderNId = ERPOrderInfo.ERPId };
        }
    }
}
