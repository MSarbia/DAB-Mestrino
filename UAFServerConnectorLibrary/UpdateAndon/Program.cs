﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAFServerConnectorLibrary;
using Events = Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Andon = Engineering.DAB.Andon;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;

namespace UpdateAndon
{
    class AndonEvent
    {
        public string WorkArea;
        public AndonEvent()
        {
            WorkArea = "100.DM1.D103";
        }
    }
    class Program
    {
        private UAFConnector Platform { get; set; }
        static void Main(string[] args)
        {
            var Platform = new UAFConnector();
            while(true)
            {
                Console.ReadLine();
                //Platform.FireEvent(new Events.UpdateAndon("100.DM1.D103"));
                new Program().Update(new AndonEvent());
            }
        }

        private void Update(AndonEvent evt)
        {
            try
            {
                string kpiVar = $"{evt.WorkArea}_KPI";
                string piVar = $"{evt.WorkArea}_PI";
                string pi2Var = $"{evt.WorkArea}_PI2";
                string vaVar = $"{evt.WorkArea}_VA";
                string lineDesc = evt.WorkArea.Split('.').LastOrDefault();
                DateTime today = DateTime.Today;
                //var localNow = DateTime.Now;
                string product = string.Empty;
                string productDesc = string.Empty;
                decimal orderTotal = 0;
                decimal orderActual = 0;

                string nextProduct = string.Empty;
                string nextProductDesc = string.Empty;
                decimal nextOrderTotal = 0;
                int team = 0;
                var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == evt.WorkArea).Select(e => e.Id).ToList();
                WorkOrder currentOrder = null;
                WorkOrder nextOrder = null;
                GetCurrentOrder(equipIds, out currentOrder, out nextOrder);
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

                if (nextOrder != null)
                {
                    nextOrderTotal = nextOrder.InitialQuantity;
                    MaterialDefinition matDef = Platform.ProjectionQuery<MaterialDefinition>().FirstOrDefault(m => m.Id == nextOrder.FinalMaterial);
                    if (matDef != null)
                    {
                        nextProduct = matDef.NId;
                        nextProductDesc = matDef.Description;
                    }
                }

                var kpiResponse = Platform.CallCommand<GetKPIs, GetKPIs.Response>(new GetKPIs { FromDate = today, ToDate = today.AddDays(1), WorkArea = evt.WorkArea, Realtime = true });
                var piResponse = Platform.CallCommand<GetProductionInfo, GetProductionInfo.Response>(new GetProductionInfo { FromDate = today, ToDate = today.AddDays(1), WorkArea = evt.WorkArea, Realtime = true });
                var andonData = new Andon.Types.AndonData
                {
                    ListKPI = new List<Andon.Types.KPI>
                    {
                        new Andon.Types.KPI
                        {
                            var_name = kpiVar,
                            defect_per_shift = kpiResponse.Defects,
                            description = "KPI",
                            LE_per_shift = decimal.ToDouble(kpiResponse.LE),
                            OEE_per_shift = decimal.ToDouble(kpiResponse.OEE),
                            rework_per_shift = kpiResponse.Rework
                        }
                    },
                    ListProductionInfo = new List<Andon.Types.ProductionInfo>
                    {

                    },
                    ListVisualAlerts = new List<Andon.Types.VisualAlerts>
                    {

                    }
                };

                if (nextOrder != null)
                {
                    andonData.ListProductionInfo.Add(new Andon.Types.ProductionInfo
                    {
                        line_description = lineDesc,
                        order_actual = -1,
                        order_customer = string.Empty,
                        order_product = nextProduct,
                        order_product_description = nextProductDesc,
                        order_total = decimal.ToInt32(nextOrderTotal),
                        shift_actual_production = decimal.ToInt32(piResponse.ActualProducedQuantity),
                        shift_delay_production = decimal.ToInt32(piResponse.DelayProducedQuantity),
                        shift_total_production = 306,//decimal.ToInt32(piResponse.TotalProducedQuantity),
                        team = team,
                        var_name = pi2Var
                    });
                }
                else if (currentOrder != null)
                {
                    andonData.ListProductionInfo.Add(
                        new Andon.Types.ProductionInfo
                        {
                            line_description = lineDesc,
                            order_actual = -1,
                            order_customer = string.Empty,
                            order_product = product,
                            order_product_description = productDesc,
                            order_total = decimal.ToInt32(orderTotal),
                            shift_actual_production = decimal.ToInt32(piResponse.ActualProducedQuantity),
                            shift_delay_production = decimal.ToInt32(piResponse.DelayProducedQuantity),
                            shift_total_production = 306,//decimal.ToInt32(piResponse.TotalProducedQuantity),
                            team = team,
                            var_name = pi2Var
                        }
                        );
                }
                if (currentOrder != null)
                {
                    andonData.ListProductionInfo.Add(
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
                            shift_total_production = 306,//decimal.ToInt32(piResponse.TotalProducedQuantity),
                            team = team,
                            var_name = piVar
                        }
                        );
                }

                //Visual Alerts
                var operatorCalls = Platform.ProjectionQuery<TeamLeaderCall>().Where(tlc => tlc.Accepted == false && tlc.Date >= today).ToList();
                var materialCalls = Platform.ProjectionQuery<MaterialCall>().Where(mc => mc.Accepted == false && mc.Date >= today).ToList();
                andonData.ListVisualAlerts.Add(new Andon.Types.VisualAlerts
                {
                    alerts = new List<Andon.Types.eachAlert>(),
                    var_name = vaVar
                });
                if (materialCalls.Any() || operatorCalls.Any())
                {
                    int operatorCallsNum = 0;
                    int materialCallsNum = 0;
                    foreach (var oc in operatorCalls.OrderBy(o => o.Date))
                    {
                        string unitDesc = oc.Equipment.Split('.').LastOrDefault();
                        andonData.ListVisualAlerts.First().alerts.Add(
                            new Andon.Types.eachAlert
                            {
                                line = evt.WorkArea,
                                order = operatorCallsNum,
                                status = Andon.Types.alertstatus.OperatorTeamSpeackerAlertActive,
                                timestamp = oc.Date.ToLocalTime().ToString("yyyy-MM-dd HH':'mm':'ss"), //  07/03/2018 09:00  AAAA-MM-gg HH:MM:ss
                                type = Andon.Types.alerttype.Operator,
                                unit = unitDesc
                            });
                        operatorCallsNum++;
                    }
                    foreach (var mc in materialCalls.OrderBy(m => m.Date))
                    {
                        string unitDesc = mc.Equipment.Split('.').LastOrDefault();
                        andonData.ListVisualAlerts.First().alerts.Add(
                            new Andon.Types.eachAlert
                            {
                                line = evt.WorkArea,
                                order = operatorCallsNum + materialCallsNum,
                                status = Andon.Types.alertstatus.MaintenanceOperatorWorking,
                                timestamp = mc.Date.ToLocalTime().ToString("yyyy-MM-dd HH':'mm':'ss"), //  07/03/2018 09:00  AAAA-MM-gg HH:MM:ss
                                type = Andon.Types.alerttype.Screwdriver,
                                unit = unitDesc
                            });
                        materialCallsNum++;
                    }
                }

                var andon = new Andon.Andon();
                andon.SetData("AppDAB", andonData);
            }
            catch (Exception e)
            {
                //Platform.Tracer.Write("Siemens-SimaticIT-Trace-UADMRuntime", $"UpdateAndon Event {evt.WorkArea} END");
            }
        }

        private void GetCurrentOrder(List<int> equipIds, out WorkOrder currentOrder, out WorkOrder nextOrder)
        {
            var woIds = Platform.ProjectionQuery<ToBeUsedMachine>().Include(m => m.WorkOrderOperation)
                    .Where(m => equipIds.Contains(m.Machine.Value))
                    .Where(m => m.WorkOrderOperation.AvailableQuantity > 0 || m.WorkOrderOperation.PartialWorkedQuantity > 0).Where(m => m.WorkOrderOperation.IsReady).Select(m => m.WorkOrderOperation.WorkOrder_Id).Distinct().ToList();

            currentOrder = Platform.ProjectionQuery<WorkOrder>().Where(wo => woIds.Contains(wo.Id)).OrderBy(wo => wo.ActualStartTime).FirstOrDefault();
            nextOrder = Platform.ProjectionQuery<WorkOrder>().Where(wo => woIds.Contains(wo.Id)).Where(wo => wo.Status == "New").OrderBy(wo => wo.EstimatedStartTime).FirstOrDefault();
        }
    }
}
