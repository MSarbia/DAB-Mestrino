using System;

using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Engineering.DAB.Andon;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using System.Collections.Generic;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using System.Linq;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Events
{
    /// <summary>
    /// 
    /// </summary>
    [Handler(HandlerCategory.Event)]
    public partial class UpdateAndon_HandlerShell
    {
        /// <summary>
        /// This is the Event handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="evt"></param>
        /// <param name="envelope"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private void UpdateAndon_Handler(UpdateAndon evt, EventEnvelope envelope)
        {
            //1)	Produced Pieces: sono i pezzi confermati alla stazione di pallettizzazione per ogni singola giornata;
            //2)	Completed Orders: sono gli ordini COMPLETAMEMTE prodotti nella gg(qty ordine = qty prod).Non importa se l’ordine è partito nei giorni precedenti;
            //3)	OEE: pezzi prodotti in gg* Tempo Ciclo / 365(gg) * 24(ore) * 60(min).Il rapporto viene espresso in %;
            //4)	OPR: pezzi prodotti in gg* Tempo Ciclo / 8(ore) * 60(min).Il rapporto viene espresso in %;
            //5)	LE: pezzi prodotti in gg* Tempo Ciclo / 8(ore) * 60(min).Il rapporto viene espresso in %.

            //Note: 
            //1)	Tempo Ciclo deve arrivare da INFOR;
            //2)	Relativamente al SOLO contesto del Pilota, per OPR e LE, si è concordato di fissare staticamente ad 8 ore, l’intervallo di tempo.Questa logica dovrà essere modifica per le future evoluzioni della soluzione.

            string kpiVar = $"{evt.WorkArea}_KPI";
            string piVar = $"{evt.WorkArea}_PI";
            string vaVar = $"{evt.WorkArea}_VA";
            string lineDesc = evt.WorkArea.Split('.').FirstOrDefault();
            DateTime today = DateTime.Today;

            var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == evt.WorkArea).Select(e => e.Id).ToList();

            var operationDitonary = Platform.ProjectionQuery<ToBeUsedMachine>().Include(tum => tum.WorkOrderOperation).Where(tum => tum.Machine.HasValue).Where(tum => equipIds.Contains(tum.Machine.Value)).Where(tum => tum.WorkOrderOperation.ActualStartTime >= today).Select(tum => tum.WorkOrderOperation).Distinct().ToDictionary(woo => woo.Id, woo => woo.WorkOrder_Id.Value);
            var operationIds = operationDitonary.Keys.ToList();
            var orderIds = operationDitonary.Values.Distinct().ToList();
            
            var localNow = DateTime.Now;
            var currentOrder = Platform.ProjectionQuery<WorkOrder>().Where(wo => orderIds.Contains(wo.Id)).OrderBy(wo => wo.ActualStartTime).FirstOrDefault();
            string product = string.Empty;
            string productDesc = string.Empty;
            decimal orderTotal = 0;
            decimal orderActual = 0;
            int team = 0;
            if (currentOrder != null)
            {
                orderTotal = currentOrder.InitialQuantity;
                orderActual = currentOrder.ProducedQuantity;
                MaterialDefinition matDef = Platform.ProjectionQuery<MaterialDefinition>().FirstOrDefault(m => m.Id == currentOrder.FinalMaterial);
                if (matDef != null)
                {
                    product = matDef.NId;
                    productDesc = matDef.Description;
                }
                team = Platform.ProjectionQuery<WorkOrderExt>().Where(woe => woe.WorkOrderId == currentOrder.Id).Select(woe => woe.ActualOperators).FirstOrDefault().GetValueOrDefault();
            }


            var kpiResponse = Platform.CallCommand<GetKPIs, GetKPIs.Response>(new GetKPIs { FromDate = today, WorkArea = evt.WorkArea });
            var piResponse = Platform.CallCommand<GetProductionInfo, GetProductionInfo.Response>(new GetProductionInfo { FromDate = today, ToDate = new DateTime(localNow.Year, localNow.Month, localNow.Day, 18, 0, 0), WorkArea = evt.WorkArea });
            var andonData = new Andon.Types.AndonData
            {
                ListKPI = new List<Andon.Types.KPI>
                {
                    new Andon.Types.KPI
                    {
                        var_name = kpiVar,
                        defect_per_shift = kpiResponse.Defects,
                        description = "KPI",
                        LE_per_shift = decimal.ToInt32(kpiResponse.LE),
                        OEE_per_shift = decimal.ToInt32(kpiResponse.OEE),
                        rework_per_shift = kpiResponse.Rework
                    }
                },
                ListProductionInfo = new List<Andon.Types.ProductionInfo>
                {
                    new Andon.Types.ProductionInfo
                    {
                        line_description = lineDesc,
                        order_actual = decimal.ToInt32(orderActual),
                        order_customer = string.Empty,
                        order_product = product,
                        order_product_description = productDesc,
                        order_total = decimal.ToInt32(orderTotal),
                        shift_actual_production = decimal.ToInt32(piResponse.ActualProducedQuantity),
                        shift_delay_production = decimal.ToInt32(piResponse.DelayProducedQuantity),
                        shift_total_production = decimal.ToInt32(piResponse.TotalProducedQuantity),
                        team = team,
                        var_name = piVar
                    }
                },
                ListVisualAlerts = new List<Andon.Types.VisualAlerts>
                {

                }
            };

            //Visual Alerts
            var operatorCalls = Platform.ProjectionQuery<TeamLeaderCall>().Where(tlc => tlc.Accepted == false && tlc.Date >= today).ToList();
            var materialCalls = Platform.ProjectionQuery<MaterialCall>().Where(mc => mc.Accepted == false && mc.Date >= today).ToList();
            if (materialCalls.Any() || operatorCalls.Any())
            {
                andonData.ListVisualAlerts.Add(new Andon.Types.VisualAlerts
                {
                    alerts = new List<Andon.Types.eachAlert>(),
                    var_name = vaVar
                });
                int operatorCallsNum = 0;
                int materialCallsNum = 0;
                foreach (var oc in operatorCalls)
                {
                    andonData.ListVisualAlerts.First().alerts.Add(
                        new Andon.Types.eachAlert
                        {
                            line = evt.WorkArea,
                            order = operatorCallsNum,
                            status = Andon.Types.alertstatus.OperatorTeamSpeackerAlertActive,
                            timestamp = oc.Date.ToString(),
                            type = Andon.Types.alerttype.Operator,
                            unit = oc.Equipment
                        });
                    operatorCallsNum++;
                }
                foreach (var mc in materialCalls)
                {
                    andonData.ListVisualAlerts.First().alerts.Add(
                        new Andon.Types.eachAlert
                        {
                            line = evt.WorkArea,
                            order = operatorCallsNum + materialCallsNum,
                            status = Andon.Types.alertstatus.MaintenanceAlertActive,
                            timestamp = mc.Date.ToString(),
                            type = Andon.Types.alerttype.Screwdriver,
                            unit = mc.Equipment
                        });
                    materialCallsNum++;
                }
            }

            var andon = new Andon.Andon();
            andon.SetData("AppDAB", andonData);
        }
    }
}
