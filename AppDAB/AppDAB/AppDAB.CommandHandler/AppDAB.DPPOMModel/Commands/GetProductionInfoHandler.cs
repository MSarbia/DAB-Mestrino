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

            decimal produzioneShift = 0;
            decimal produzionePrevistaShift = 0;
            decimal pezziRitardoShift = 0;
            var now = DateTime.Now;
            var endShift = toDate;

            var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == command.WorkArea).Select(e => e.Id).ToList();

            var operationDitonary = Platform.ProjectionQuery<ToBeUsedMachine>().Include(tum => tum.WorkOrderOperation).Where(tum => tum.Machine.HasValue).Where(tum => equipIds.Contains(tum.Machine.Value)).Where(tum => tum.WorkOrderOperation.ActualStartTime >= command.FromDate).Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);
            var operationIds = operationDitonary.Keys.ToList();
            var orderIds = operationDitonary.Values.Distinct().ToList();


            var pezziProdottiInGiornata = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).ToDictionary(wo => wo.Id, wo => wo.ProducedQuantity);
            var produzionePrevista = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).ToDictionary(wo => wo.Id, wo => wo.InitialQuantity);
            var cycleTymes = Platform.ProjectionQuery<WorkOrderExt>().Where(woe => orderIds.Contains(woe.WorkOrderId)).ToDictionary(woe => woe.WorkOrderId, woe => woe.CicleTime);


            var remainingMinutes = (endShift - now).TotalMinutes;
            foreach (var orderId in orderIds)
            {
                var pezziProducibili = (decimal)(remainingMinutes / cycleTymes[orderId].Value.TotalMinutes);
                var prodottiOrdine = pezziProdottiInGiornata[orderId];
                var totaleOrdine = produzionePrevista[orderId];
                var pezziRimanenti = totaleOrdine - prodottiOrdine;
                produzioneShift += prodottiOrdine;
                produzionePrevistaShift += totaleOrdine;
                pezziRitardoShift += Math.Max(0, pezziRimanenti - pezziProducibili);
            }

            return new GetProductionInfo.Response
            {
                ActualProducedQuantity = produzioneShift,
                TotalProducedQuantity = produzionePrevistaShift,
                DelayProducedQuantity = pezziRitardoShift
            };
        }
    }
}
