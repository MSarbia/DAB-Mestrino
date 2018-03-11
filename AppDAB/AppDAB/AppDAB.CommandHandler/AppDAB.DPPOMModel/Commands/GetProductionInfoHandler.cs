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
    public partial class GetProductionInfoHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private GetProductionInfo.Response GetProductionInfoHandler(GetProductionInfo command)
        {
            DateTimeOffset toDate = command.ToDate ?? DateTimeOffset.UtcNow;
            bool realTime = command.Realtime.GetValueOrDefault();
            decimal produzioneShift = 0;
            decimal produzionePrevistaShift = 0;
            decimal pezziRitardoShift = 0;
            var now = DateTime.Now;
            var endShift = toDate;

            var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == command.WorkArea).Select(e => e.Id).ToList();

            Dictionary<int, int> operationDictionary;
            Dictionary<int, WorkOrder> completedOrders;
            if (realTime)
            {
                //bool overlap = woo.start < b.end && b.start < woo.end;
                operationDictionary = Platform.ProjectionQuery<ToBeUsedMachine>().Include("WorkOrderOperation.WorkOrder").Where(tum => tum.WorkOrderOperation.WorkOrder.EstimatedStartTime < toDate).Where(tum => tum.WorkOrderOperation.WorkOrder.EstimatedEndTime > command.FromDate).Where(tum => tum.Machine.HasValue).Where(tum => equipIds.Contains(tum.Machine.Value)).Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);
                var orderIds = operationDictionary.Keys.ToList();
                completedOrders = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).ToDictionary(wo => wo.Id, wo => wo);
            }
            else
            {
                operationDictionary = Platform.ProjectionQuery<ToBeUsedMachine>().Include(tum => tum.WorkOrderOperation).Where(tum => tum.WorkOrderOperation.ActualEndTime < toDate).Where(tum => tum.Machine.HasValue).Where(tum => equipIds.Contains(tum.Machine.Value)).Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);
                var orderIds = operationDictionary.Keys.ToList();
                completedOrders = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).Where(wo => wo.Status == "Complete").Where(wo => wo.ActualEndTime < command.ToDate).Where(wo => wo.ActualEndTime > command.FromDate).ToDictionary(wo => wo.Id, wo => wo);
            }

            var completedOrderIds = completedOrders.Keys.ToList();
            var cycleTymes = Platform.ProjectionQuery<WorkOrderExt>().Where(woe => completedOrderIds.Contains(woe.WorkOrderId)).ToDictionary(woe => woe.WorkOrderId, woe => woe.CicleTime);

            foreach (var orderId in completedOrderIds)
            {
                var remainingMinutes = (completedOrders[orderId].EstimatedEndTime - now).GetValueOrDefault(new TimeSpan(0)).TotalMinutes;
                decimal pezziProducibili = 0;
                if (remainingMinutes > 0)
                {
                    pezziProducibili = Math.Min(0, (decimal)(remainingMinutes / cycleTymes[orderId].Value.TotalMinutes));
                }
                var prodottiOrdine = completedOrders[orderId].ProducedQuantity;
                var totaleOrdine = completedOrders[orderId].InitialQuantity;
                var pezziRimanenti = totaleOrdine - prodottiOrdine;
                produzioneShift += prodottiOrdine;
                produzionePrevistaShift += totaleOrdine;
                pezziRitardoShift += decimal.ToInt32(pezziProducibili - pezziRimanenti);
            }
            int producedOrders = completedOrderIds.Count;
            if (realTime)
            {
                producedOrders= Platform.ProjectionQuery<WorkOrder>().Where(wo => completedOrderIds.Contains(wo.Id)).Where(wo => wo.Status == "Complete").Count();
            }

            return new GetProductionInfo.Response
            {
                ActualProducedQuantity = produzioneShift,
                TotalProducedQuantity = produzionePrevistaShift,
                DelayProducedQuantity = pezziRitardoShift,
                ProducedOrders = producedOrders
            };
        }
    }
}
