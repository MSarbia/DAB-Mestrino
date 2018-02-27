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
            ToBeConsumedMaterial toBeConsumedMaterial = Platform.ProjectionQuery<ToBeConsumedMaterial>().FirstOrDefault(tcm => tcm.Id == command.OldToBeConsumedMaterialId);
            int workOrderOperationId = toBeConsumedMaterial.WorkOrderOperation_Id.GetValueOrDefault();
            int sequence = (Platform.ProjectionQuery<ToBeConsumedMaterialExt>().Where(tce => tce.WorkOrderOperationId == workOrderOperationId).Max(tce => tce.Sequence) + 10);
            command.NewToBeConsumedMaterial.LogicalPosition = sequence.ToString();
            Platform.CallCommand<AcceptChangeAddToBeConsumedMaterial, AcceptChangeAddToBeConsumedMaterial.Response>(new AcceptChangeAddToBeConsumedMaterial
            {
                ChangePartId = command.ChangePartId,
                Notes = command.Notes,
                RefNumber = command.RefNumber,
                ToBeConsumedMaterial = command.NewToBeConsumedMaterial,
                WorkOrderOperationId = workOrderOperationId
            });
            int newToBeConsumedMaterialId = Platform.ProjectionQuery<ToBeConsumedMaterial>().Where(tcm => tcm.WorkOrderOperation_Id == workOrderOperationId && tcm.LogicalPosition == command.NewToBeConsumedMaterial.LogicalPosition).Select(tcm => tcm.Id).FirstOrDefault();
            var order = Platform.ProjectionQuery<WorkOrderOperation>().Include(woo => woo.WorkOrder).Where(woo => woo.Id == toBeConsumedMaterial.WorkOrderOperation_Id).Select(woo => woo.WorkOrder).FirstOrDefault();
            var matDef = Platform.ProjectionQuery<MaterialDefinition>().Where(m => m.Id == command.NewToBeConsumedMaterial.MaterialDefinitionId).FirstOrDefault();

            var reportInput = new ReportMaterialNonConformance(command.RefNumber, order.ERPOrder, matDef.UOM, command.NewToBeConsumedMaterial.Quantity, matDef.NId, matDef.Id, order.Plant, workOrderOperationId, sequence, newToBeConsumedMaterialId); //PRXXX Cancellare TransId dal model App

            var result = Platform.CallCommand<ReportMaterialNonConformance, ReportMaterialNonConformance.Response>(reportInput);
            if(!result.Succeeded)
            {
                response.SetError(result.Error.ErrorCode, result.Error.ErrorMessage);
                return response;
            }
            return response;
        }
    }
}
