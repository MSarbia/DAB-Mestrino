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
    public partial class GetKPIsHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private GetKPIs.Response GetKPIsHandler(GetKPIs command)
        {
            DateTimeOffset toDate = command.ToDate ?? DateTimeOffset.UtcNow;
           
            var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == command.WorkArea).Select(e => e.Id).ToList();

            var operationDitonary = Platform.ProjectionQuery<ToBeUsedMachine>().Include(tum => tum.WorkOrderOperation).Where(tum => tum.Machine.HasValue).Where(tum => equipIds.Contains(tum.Machine.Value)).Where(tum => tum.WorkOrderOperation.ActualStartTime >= command.FromDate).Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);
            var operationIds = operationDitonary.Keys.ToList();
            var orderIds = operationDitonary.Values.Distinct().ToList();
            var pezziProdottiInGiornata = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).ToDictionary(wo => wo.Id, wo => wo.ProducedQuantity);
            var cycleTymes = Platform.ProjectionQuery<WorkOrderExt>().Where(woe => orderIds.Contains(woe.WorkOrderId)).ToDictionary(woe => woe.WorkOrderId, woe => woe.CicleTime);
            var defects = Platform.ProjectionQuery<ChangePart>().Where(cp => operationIds.Contains(cp.WorkOrderOperation_Id.Value)).Count();

            decimal pexxiXCycleTime = 0;
            
            foreach (var orderId in orderIds)
            {
                pexxiXCycleTime += pezziProdottiInGiornata[orderId] * (decimal)cycleTymes[orderId].GetValueOrDefault().TotalMinutes;
            }

            decimal oEE = ((pexxiXCycleTime / 365) * 24) * 60;
            decimal lE = (pexxiXCycleTime / 8) * 60;

            return new GetKPIs.Response
            {
                Defects = defects,
                LE = lE,
                OEE = oEE,
                Rework = 0
            };
        }
    }
}
