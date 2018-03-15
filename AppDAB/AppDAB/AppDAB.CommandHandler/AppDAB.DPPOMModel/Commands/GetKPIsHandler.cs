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

            bool realTime = command.Realtime.GetValueOrDefault();
            DateTimeOffset toDate = command.ToDate ?? DateTimeOffset.UtcNow;
            var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == command.WorkArea).Select(e => e.Id).ToList();
            Dictionary<int, int> operationDictionary;
            Dictionary<int, WorkOrder> completedOrders;
            if (realTime)
            {
                //bool overlap = woo.start < b.end && b.start < woo.end;
                operationDictionary = Platform.ProjectionQuery<ToBeUsedMachine>()
                    .Include("WorkOrderOperation.WorkOrder")
                    .Where(tum => tum.WorkOrderOperation.WorkOrder.EstimatedStartTime < toDate)
                    .Where(tum => tum.WorkOrderOperation.WorkOrder.EstimatedEndTime > command.FromDate)
                    .Where(tum => tum.Machine.HasValue)
                    .Where(tum => equipIds.Contains(tum.Machine.Value))
                    .Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);

                var orderIds = operationDictionary.Values.ToList();
                completedOrders = Platform.ProjectionQuery<WorkOrder>()
                    .Where(wo => orderIds.Contains(wo.Id))
                    .Where(wo => wo.Status != "Edit")
                    .Where(wo => wo.Status != "Aborted")
                    .ToDictionary(wo => wo.Id, wo => wo);
            }
            else
            {
                operationDictionary = Platform.ProjectionQuery<ToBeUsedMachine>()
                    .Include(tum => tum.WorkOrderOperation)
                    .Where(tum => tum.WorkOrderOperation.ActualEndTime > command.FromDate)
                    .Where(tum => tum.WorkOrderOperation.ActualEndTime < toDate)
                    .Where(tum => tum.Machine.HasValue)
                    .Where(tum => equipIds.Contains(tum.Machine.Value))
                    .Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);

                var orderIds = operationDictionary.Values.ToList();
                completedOrders = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).Where(wo => wo.Status == "Complete").Where(wo => wo.ActualEndTime < command.ToDate).Where(wo => wo.ActualEndTime > command.FromDate).ToDictionary(wo => wo.Id, wo => wo);
            }
            var completedOrdersIds = completedOrders.Select(wo => wo.Key).ToList();
            var orderExts = Platform.ProjectionQuery<WorkOrderExt>().Where(woe => completedOrdersIds.Contains(woe.WorkOrderId)).ToDictionary(woe => woe.WorkOrderId, woe => woe);

            TimeSpan totaleOre = new TimeSpan(0);
            decimal totalePezziXCycleTime = 0;
            decimal leSum = 0;
            decimal oprSum = 0;
            decimal pezziRitardoSum = 0;
            foreach (var orderId in completedOrdersIds)
            {
                decimal qtyProdotta = Platform.ProjectionQuery<WorkOrderOperation>().Where(wo => wo.WorkOrder_Id == orderId).Where(wo => !wo.Successors.Any()).Select(wo => wo.ProducedQuantity).FirstOrDefault();

                //completedOrders[orderId].ProducedQuantity;
                decimal cycleTimeOrdine = Convert.ToDecimal(orderExts[orderId].CicleTime.GetValueOrDefault(new TimeSpan(0)).TotalMinutes);
                totalePezziXCycleTime += (qtyProdotta * cycleTimeOrdine);
                int operatoriTeoriciOrdine = orderExts[orderId].Operators;
                int operatoriRealiOrdine = orderExts[orderId].ActualOperators ?? orderExts[orderId].Operators;
                DateTimeOffset actualEndTime = completedOrders[orderId].ActualEndTime ?? DateTimeOffset.UtcNow;
                TimeSpan oreOrdine = (actualEndTime - completedOrders[orderId].ActualStartTime).GetValueOrDefault(new TimeSpan(0));
                var durataInMinuti = Convert.ToDecimal(oreOrdine.TotalMinutes);
                decimal minutiStimati = Convert.ToDecimal((completedOrders[orderId].EstimatedEndTime - completedOrders[orderId].EstimatedStartTime).GetValueOrDefault(new TimeSpan(0, 1, 0)).TotalMinutes);
                decimal qtyTotale = completedOrders[orderId].InitialQuantity;
                //decimal estimatedCycleTime = minutiStimati / qtyTotale;

                decimal pezziRitardo = 0;
                decimal actualCycleTime = qtyProdotta / durataInMinuti;
                if (actualCycleTime > 0)
                {
                    decimal pezziStimati = minutiStimati / actualCycleTime;
                    //decimal minutiVerosimili = actualCycleTime * qtyTotale;
                    //decimal minutiRitardo = minutiVerosimili - minutiStimati;
                    //pezziRitardo = Math.Min((minutiRitardo / actualCycleTime), (qtyTotale - qtyProdotta));
                    pezziRitardo = Math.Min((qtyTotale - pezziStimati), (qtyTotale - qtyProdotta));
                    decimal pezziRitardoPerOre = pezziRitardo * Convert.ToDecimal(oreOrdine.TotalHours);
                    pezziRitardoSum += pezziRitardoPerOre;
                }
                totaleOre += oreOrdine;

                var durataPerRisorse = durataInMinuti * operatoriRealiOrdine;
                if (durataPerRisorse > 0)
                    leSum += Convert.ToDecimal(oreOrdine.TotalHours) * ((qtyProdotta * cycleTimeOrdine * operatoriTeoriciOrdine) / durataPerRisorse);
                if (durataInMinuti > 0)
                    oprSum += Convert.ToDecimal(oreOrdine.TotalHours) * ((qtyProdotta * cycleTimeOrdine) / durataInMinuti);
            }

            decimal leAVGPercent = totaleOre.TotalHours == 0 ? 0 : Math.Min(100, (leSum / Convert.ToDecimal(totaleOre.TotalHours)) * 100);
            decimal oprPercent = totaleOre.TotalHours == 0 ? 0 : Math.Min(100, (oprSum / Convert.ToDecimal(totaleOre.TotalHours)) * 100);//pezzi prodotti in gg* Tempo Ciclo / 8(ore) * 60(min).
            decimal pezziRitardoAVG = totaleOre.TotalHours == 0 ? 0 : pezziRitardoSum / Convert.ToDecimal(totaleOre.TotalHours);

            //___________________________________
            var operationIds = operationDictionary.Keys.ToList();


            var defects = Platform.ProjectionQuery<ChangePart>().Include(cp => cp.NonConformance).Where(cp => cp.NonConformance.StartDate > command.FromDate).Where(cp => cp.NonConformance.StartDate < command.ToDate).Where(cp => operationIds.Contains(cp.WorkOrderOperation_Id.Value)).Count();

            return new GetKPIs.Response
            {
                Defects = defects,
                LE = leAVGPercent,
                OEE = oprPercent,
                Delay = decimal.ToInt32(pezziRitardoAVG),
                Rework = 0
            };

        }
    }
}
