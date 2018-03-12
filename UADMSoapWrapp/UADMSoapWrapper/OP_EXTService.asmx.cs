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
using System.Web.Services.Protocols;
using System.Security.Claims;
using Newtonsoft.Json;
using System.Xml;

namespace UADMSoapWrapper
{
    [System.CodeDom.Compiler.GeneratedCodeAttribute("wsdl", "4.6.1590.0")]
    [System.Web.Services.WebServiceAttribute(Namespace = Constants.NameSpace)]
    [System.Web.Services.WebServiceBindingAttribute(Name = "IOP_EXTServiceSoapBinding", Namespace = Constants.NameSpace)]
    [SoapDocumentService(RoutingStyle = SoapServiceRoutingStyle.RequestElement)]
    public class OP_EXTService : IOP_EXTService
    {
        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("", RequestNamespace = Constants.NameSpace, ResponseNamespace = Constants.NameSpace, Use = System.Web.Services.Description.SoapBindingUse.Literal)]
        [return: System.Xml.Serialization.XmlElementAttribute("MaterialDefinitionResponse")]
        public override MaterialDefinitionResponse ImportMaterialDefinition(MaterialDefinitionRequest MaterialDefinition)
        {
            try
            {
                var uafConnector = new UAFConnector();
                var response = uafConnector.CallCommand<ImportMaterialDefinition, ImportMaterialDefinition.Response>(new ImportMaterialDefinition
                {
                    Customized = MaterialDefinition.Customized,
                    Description = MaterialDefinition.Description,
                    MaterialCode = MaterialDefinition.MaterialCode,
                    MaterialFamily = MaterialDefinition.MaterialFamily,
                    MaterialRevision = MaterialDefinition.MaterialRevision,
                    Serialized = MaterialDefinition.Serialized,
                    UoM = MaterialDefinition.UoM
                });
                if (!response.Succeeded)
                {
                    throw new Exception($"Error {response.Error.ErrorCode}: {response.Error.ErrorMessage}");
                }
                return new MaterialDefinitionResponse { MaterialCode = response.MaterialCode, MaterialRevision = response.MaterialRevision };
            }
            catch(Exception e)
            {
                throw e;
            }
            
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
                FinalMaterialCode = ERPOrderInfo.FinalMaterialCode,
                FinalMaterialRevision = ERPOrderInfo.FinalMaterialRevision,
                Orders = new List<ERPOrderPhase> { },
                Priority = ERPOrderInfo.Priority,
                Quantity = ERPOrderInfo.Quantity,
                Warehouse = ERPOrderInfo.Warehouse
            });


            foreach (var order in ERPOrderInfo.Orders)
            {
                if (!string.IsNullOrEmpty(order.CycleTime))
                {
                    input.ERPOrderInfo.CycleTime = XmlConvert.ToTimeSpan(order.CycleTime);
                }
                if (!string.IsNullOrEmpty(order.SetupTime))
                {
                    input.ERPOrderInfo.SetupTime = XmlConvert.ToTimeSpan(order.SetupTime);
                }
                DateTime estimatedStart = order.EstimatedStartTime.Year > 1900 ? order.EstimatedStartTime : DateTime.UtcNow.AddMinutes(3);
                DateTime estimatedEnd = order.EstimatedEndTime.Year > 1900 ? order.EstimatedEndTime : order.EstimatedStartTime.AddMinutes(input.ERPOrderInfo.CycleTime.TotalMinutes * input.ERPOrderInfo.Quantity);


                input.ERPOrderInfo.EstimatedEndTime = estimatedEnd;
                input.ERPOrderInfo.EstimatedStartTime = estimatedStart;
                input.ERPOrderInfo.Operators = order.Operators;
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
