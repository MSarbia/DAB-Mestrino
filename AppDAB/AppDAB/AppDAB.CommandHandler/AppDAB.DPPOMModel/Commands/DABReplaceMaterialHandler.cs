using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABReplaceMaterialHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABReplaceMaterial.Response DABReplaceMaterialHandler(DABReplaceMaterial command)
        {
            var response = new DABReplaceMaterial.Response();
            ToBeConsumedMaterial toBeConsumedMaterial = Platform.ProjectionQuery<ToBeConsumedMaterial>().First(tcm => tcm.Id == command.ToBeConsumedMaterialId);
            var changePart = Platform.ProjectionQuery<ChangePart>().Include(cp=>cp.NonConformance).First(cp => cp.Id == command.ChangePartId);
            int workOrderOperationId = changePart.WorkOrderOperation_Id ?? toBeConsumedMaterial.WorkOrderOperation_Id.GetValueOrDefault();

            int sequence = (Platform.ProjectionQuery<ToBeConsumedMaterialExt>()
                .Where(tce => tce.WorkOrderOperationId == toBeConsumedMaterial.WorkOrderOperation_Id.Value).Max(tce => tce.Sequence) + 10);
            string logicalPosition = sequence.ToString();
            var acceptResponse = Platform.CallCommand<AcceptChangeAddToBeConsumedMaterial, AcceptChangeAddToBeConsumedMaterial.Response>(new AcceptChangeAddToBeConsumedMaterial
            {
                ChangePartId = command.ChangePartId,
                Notes = command.Notes,
                RefNumber = command.RefNumber,
                ToBeConsumedMaterial = new Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types.ToBeConsumedMaterialParameter
                {
                    LogicalPosition = logicalPosition,
                    MaterialDefinitionId = toBeConsumedMaterial.MaterialDefinition,
                    MaterialSpecificationType = toBeConsumedMaterial.MaterialSpecificationType,
                    Sequence = sequence,
                    AlternativeSelected = toBeConsumedMaterial.AlternativeSelected,
                    GroupId = toBeConsumedMaterial.GroupId,
                    Quantity = command.NewQuantity
                },
                WorkOrderOperationId = workOrderOperationId
            });
            if(!acceptResponse.Succeeded)
            {
                response.SetError(acceptResponse.Error.ErrorCode, acceptResponse.Error.ErrorMessage);
                return response;
            }
            int newToBeConsumedMaterialId = Platform.ProjectionQuery<ToBeConsumedMaterial>().Where(tcm => tcm.WorkOrderOperation_Id == workOrderOperationId && tcm.LogicalPosition == logicalPosition).Select(tcm => tcm.Id).FirstOrDefault();
            var order = Platform.ProjectionQuery<WorkOrderOperation>().Include(woo => woo.WorkOrder).Where(woo => woo.Id == toBeConsumedMaterial.WorkOrderOperation_Id).Select(woo => woo.WorkOrder).First();
            var matDef = Platform.ProjectionQuery<MaterialDefinition>().Where(m => m.Id == toBeConsumedMaterial.MaterialDefinition).First();

            var inforIntConf = Platform.ProjectionQuery<ConfigurationKey>().Where(c => c.NId == "InforIntegration").Select(c => c.Val).FirstOrDefault();
            bool inforIntegration = (!string.IsNullOrEmpty(inforIntConf) && inforIntConf == "true");
                var reportInput = new ReportMaterialNonConformance(command.RefNumber, order.ERPOrder, matDef.UOM, command.NewQuantity, matDef.NId, matDef.Id, order.Plant, workOrderOperationId, sequence, newToBeConsumedMaterialId, inforIntegration); //PRXXX Cancellare TransId dal model App

            var result = Platform.CallCommand<ReportMaterialNonConformance, ReportMaterialNonConformance.Response>(reportInput);
            if (!result.Succeeded)
            {
                response.SetError(result.Error.ErrorCode, result.Error.ErrorMessage);
                return response;
            }
            Platform.CallCommand<DeleteNonConformanceNotification, DeleteNonConformanceNotification.Response>(new DeleteNonConformanceNotification {
                NonConformanceNId = changePart.NonConformance.NId
            });

            var equipId = Platform.ProjectionQuery<ToBeUsedMachine>().Where(tum => tum.WorkOrderOperation_Id == workOrderOperationId).Where(tum => tum.Machine != null).Select(tum => tum.Machine.Value).FirstOrDefault();
            var workArea = Platform.ProjectionQuery<Equipment>().Where(e => e.Id == equipId).Select(e=>e.Parent).FirstOrDefault();
            Platform.CallCommand<FireUpdateAndonEvent, FireUpdateAndonEvent.Response>(new FireUpdateAndonEvent(workArea));
            return response;
        }
    }
}
