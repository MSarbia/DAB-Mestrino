using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.OperationalData.IdGenerate.OPModel.Commands;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Commands;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABReleaseOrderHandlerShell 
    {
        private DABReleaseOrder.Response response = new DABReleaseOrder.Response();

        private DABReleaseOrder commandInput = null;

        private WorkOrder workOrder = null;

        private MaterialDefinition finalMaterial = null;

        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABReleaseOrder.Response DABReleaseOrderHandler(DABReleaseOrder command)
        {
            this.commandInput = command;

            if (!this.GetWorkOrder())
            {
                return this.response;
            }
            
            if (!this.CreateAndAssignProducedMaterialItems())
            {
                return this.response;
            }

            if (this.ReleaseWorkOrder())
            {
                this.SetActualOperators();
            }

            return response;
        }

        /// <summary>
        /// Release the provided WorkOrder
        /// </summary>
        /// <param name="workOrder">Instance of the WokOrder</param>
        /// <returns>If ReleaseOrder succeed</returns>
        private bool ReleaseWorkOrder()
        {
            var result = true;

            if (this.workOrder.Status == "Edit")
            {
                var releaseOrderInput = new Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Commands.ReleaseOrder
                {
                    WorkOrderId = this.commandInput.WorkOrderId,
                    WorkOrderNId = this.commandInput.WorkOrderNId,
                    SerialNumberCodes = this.commandInput.SerialNumberCodes
                };

                var releaeOrderResponse =
                    this.Platform.CallCommand<Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Commands.ReleaseOrder, 
                    Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Commands.ReleaseOrder.Response>(releaseOrderInput);
                
                if (!releaeOrderResponse.Succeeded)
                {
                    response.SetError(releaeOrderResponse.Error.ErrorCode, releaeOrderResponse.Error.ErrorMessage);
                    result = false;
                }
            }

            return result;
        }

        /// <summary>
        /// Call command SetActualOperators
        /// </summary>
        /// <returns>If SetActualOperators succeed</returns>
        private bool SetActualOperators()
        {
            var result = true;

            var setActualOperatorsInput = new SetActualOperators
            {
                ActualOperators = this.commandInput.ActualOperators,
                WorkOrderId = this.commandInput.WorkOrderId
            };

            var setActualOperatorResponse =
                    this.Platform.CallCommand<SetActualOperators, SetActualOperators.Response>(setActualOperatorsInput);

            if (!setActualOperatorResponse.Succeeded)
            {
                response.SetError(setActualOperatorResponse.Error.ErrorCode, setActualOperatorResponse.Error.ErrorMessage);
                result = false;
            }

            return result;
        }

        /// <summary>
        /// Create and Assign SN to the WorkOrder
        /// </summary>
        /// <param name="workOrder">Instance of the WorkOrder</param>
        /// <param name="finalMaterial">Instance of the MaterialDefinition related to the final material</param>
        /// <returns></returns>
        private bool CreateAndAssignProducedMaterialItems()
        {
            var result = true;
            var anyTemplate = true;

            var serialNumberList = this.GenerateSerialNumber(out anyTemplate);

            if (serialNumberList.Count > 0)
            {
                var commandCreateAndAssignProducedMaterialItems = new CreateAndAssignProducedMaterialItems()
                {
                    MaterialDefinitionId = this.finalMaterial.Id,
                    SerialNumberCodes = serialNumberList,
                    WorkOrderId = this.commandInput.WorkOrderId,
                    WorkOrderNId = this.commandInput.WorkOrderNId,
                    SerialNumberTemplateGenerated = anyTemplate
                };

                var responseCreateAndAssignProducedMaterialItems = 
                    Platform.CallCommand<CreateAndAssignProducedMaterialItems, CreateAndAssignProducedMaterialItems.Response>(commandCreateAndAssignProducedMaterialItems);

                if (!responseCreateAndAssignProducedMaterialItems.Succeeded)
                {
                    // App: It's not possible assign serial numbers to work order %%1  
                    // Trace: It's not possible assign serial numbers to work order %%2 
                    response.SetError(-1000, "Non è possibile assegnare i SerialNumber al WorkOrder");
                    result = false;

                }
            }

            return result;
        }

        /// <summary>
        /// Generate SerialNumber
        /// </summary>
        /// <param name="workOrder">Instance of the WorkOrder</param>
        /// <param name="finalMaterial">Instance of the MaterialDefinition related to the final material</param>
        /// <returns>List of SerialNumber</returns>
        private List<string> GenerateSerialNumber(out bool anyTemplate)
        {
            var serialNumberList = new List<string>();
            anyTemplate = true;
            
            var producedMaterialItems = Platform.ProjectionQuery<ProducedMaterialItem>()
                .Where(pm => pm.WorkOrder_Id == this.workOrder.Id).ToList();

            int numberSerialNumberMissing = (int)this.workOrder.InitialQuantity - producedMaterialItems.Count;

            if (numberSerialNumberMissing != 0)
            {
                // retrieve the type of serial number to generate codes: 
                DateTimeOffset timeStamp = DateTimeOffset.Now;

                var templateToMaterialPlant = Platform.ProjectionQuery<TemplateToMaterialPlant>()
                    .Include(t => t.Template.TemplateType)
                    .Where(t => t.MaterialDefinitionId == this.finalMaterial.Id)
                    .Where(t => t.Template.TemplateType.NId == "SerialNumber");

                var template = templateToMaterialPlant.Where(t => t.EquipmentId == this.workOrder.Plant).SingleOrDefault();
                if (template == null)
                {
                    template = templateToMaterialPlant.FirstOrDefault(); //TODO verify
                    if (template == null)
                    {
                        //// App: The association between Template, Material Definition and Plant does not exist (Id %%1)
                        //// Trace:The association between Template, Material Definition and Plant does not exist (Id %%1)
                        //response.SetError(Platform, -702247, workOrder.Id.ToString());
                        //return response;
                        anyTemplate = false;
                    }
                }

                if (anyTemplate)
                {
                    var generateSerialNumberCodesInput = new GenerateSerialNumberCodes
                    {
                        Count = numberSerialNumberMissing,
                        MaterialId = this.finalMaterial.NId,
                        OrderId = this.workOrder.NId,
                        Timestamp = timeStamp,
                        TemplateId = template.Template_Id.GetValueOrDefault()
                    };

                    var resultSNS = Platform.CallCommand<GenerateSerialNumberCodes, GenerateSerialNumberCodes.Response>(generateSerialNumberCodesInput);

                    if (!resultSNS.Succeeded)
                    {
                        serialNumberList = GenerateSerialNumberDefault(numberSerialNumberMissing);
                    }
                    else
                    {
                        serialNumberList = resultSNS.SerialNumberCodes.Values;
                    }
                }
                else
                {
                    serialNumberList = GenerateSerialNumberDefault(numberSerialNumberMissing);
                }
            }

            return serialNumberList;
        }

        /// <summary>
        /// Generate default SN Id
        /// </summary>
        /// <param name="howMany">How many SN to genarate</param>
        /// <returns>List of SerialNumber</returns>
        private List<string> GenerateSerialNumberDefault(int howMany)
        {
            var list = new List<string>();
            for (int i = 0; i < howMany; i++)
            {
                list.Add(string.Format("SN_{0}", Guid.NewGuid()));
            }
            return list;
        }

        /// <summary>
        /// Get data of WorkOrder and its final material
        /// </summary>
        /// <returns>All data provided are correct</returns>
        private bool GetWorkOrder()
        {
            var result = true;

            if (this.commandInput.ActualOperators <= 0)
            {
                this.response.SetError(-1000, "Inserire il numero di operatori");
                result = false;
            }

            this.workOrder = Platform.ProjectionQuery<WorkOrder>()
                .Include(wo => wo.ProductionType)
                .Where(wo => wo.Id == this.commandInput.WorkOrderId).FirstOrDefault();

            if (this.workOrder == null)
            {
                this.response.SetError(-1000, "Il WorkOrder selezionato non esiste");
                result = false;
            }

            if ((this.workOrder.ProductionType.NId != "Serialized" &&
                this.workOrder.ProductionType.NId != "FullSerialized"))
            {
                this.response.SetError(-1000, "L'ordine non è di tipo Serialized");
                result = false;
            }

            this.finalMaterial = Platform.ProjectionQuery<MaterialDefinition>()
                .FirstOrDefault(md => md.Id == this.workOrder.FinalMaterial.Value);

            if (this.finalMaterial == null)
            {
                this.response.SetError(-1000, "Il final material del WorkOrder selezionato non esiste");
                result = false;
            }

            return result;
        }
    }
}
