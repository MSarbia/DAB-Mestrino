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
            string kpiVar = $"{evt.WorkArea}_KPI";
            string piVar = $"{evt.WorkArea}_PI";
            string vaVar = $"{evt.WorkArea}_VA";
            string lineDesc = evt.WorkArea.Split('.').FirstOrDefault();
            DateTime today = DateTime.Today;

            var equipIds = Platform.ProjectionQuery<Equipment>().Where(e => e.Parent == evt.WorkArea).Select(e => e.Id).ToList();

            var operationIds = Platform.ProjectionQuery<ToBeUsedMachine>().Include(tum => tum.WorkOrderOperation).Where(tum => tum.Machine.HasValue).Where(tum => equipIds.Contains(tum.Machine.Value)).Where(tum => tum.WorkOrderOperation.ActualStartTime >= today).Select(tum=>tum.WorkOrderOperation_Id);

            

            
            
            var andonData = new Andon.Types.AndonData
            {
                ListKPI = new List<Andon.Types.KPI>
                {
                    new Andon.Types.KPI
                    {
                        var_name = kpiVar,
                        defect_per_shift = 0, //set
                        description = "", //set
                        LE_per_shift = 0, //set
                        OEE_per_shift = 0, //set
                        rework_per_shift = 0 //set
                    }
                },
                ListProductionInfo = new List<Andon.Types.ProductionInfo>
                {
                    new Andon.Types.ProductionInfo
                    {
                        line_description = lineDesc,
                        order_actual = 0, //set
                        order_customer = "", //set
                        order_product = "", //set
                        order_product_description = "", //set
                        order_total = 0, //set
                        shift_actual_production = 0, //set
                        shift_delay_production = 0, //set
                        shift_total_production = 0, //set
                        team = 0, //set
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
