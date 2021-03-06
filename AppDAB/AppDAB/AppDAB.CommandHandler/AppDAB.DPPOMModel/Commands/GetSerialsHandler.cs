using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Types;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class GetSerialsHandlerShell
    {
        private int _maxSerials = 30;
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private GetSerials.Response GetSerialsHandler(GetSerials command)
        {

            var response = new GetSerials.Response
            {
                Orders = new List<OrderInfo>()
            };
            var machine = Platform.ProjectionQuery<Equipment>().Where(e => e.NId == command.Equipment).Select(e => e.Id).FirstOrDefault();

            var workOrderOperationIds = Platform.ProjectionQuery<ToBeUsedMachine>().Include(m => m.WorkOrderOperation)
                .Where(m => m.Machine == machine)
                .Where(m => m.WorkOrderOperation.AvailableQuantity > 0 || m.WorkOrderOperation.PartialWorkedQuantity > 0).Where(m => m.WorkOrderOperation.IsReady).Select(m => m.WorkOrderOperation_Id.Value).Distinct().ToList();
            var wos = Platform.ProjectionQuery<WorkOrderOperation>().Where(w => workOrderOperationIds.Contains(w.Id)).ToList();
            var orderIds = wos.Select(w => w.WorkOrder_Id).Distinct().ToList();
            var woDictionary = wos.ToDictionary(wo => wo.Id, wo => wo);
            Dictionary<int, WorkOrder> orders = Platform.ProjectionQuery<WorkOrder>().Where(o => orderIds.Contains(o.Id)).ToDictionary(o => o.Id, o => o);
            List<int> matDefIds = orders.Select(o => o.Value.FinalMaterial.Value).Distinct().ToList();
            Dictionary<int, MaterialDefinition> matDefs = Platform.ProjectionQuery<MaterialDefinition>().Where(m => matDefIds.Contains(m.Id)).ToDictionary(m => m.Id, m => m);
            int numOfSerials = 0;
            foreach (var id in woDictionary.Keys)
            {
                var wo = woDictionary[id];
                var serials = Platform.ProjectionQuery<ToBeProducedMaterial>().Include(pm => pm.MaterialItem).Where(pm => pm.WorkOrderOperation_Id == id).Select(pm => pm.MaterialItem.SerialNumberCode).ToList();
                var pausedSerials = Platform.ProjectionQuery<ActualProducedMaterial>().Include(pm => pm.MaterialItem).Where(pm => pm.WorkOrderOperation_Id == id).Where(pm => pm.PausedQuantity == 1).Select(pm => pm.MaterialItem.SerialNumberCode).ToList();
                List<string> activeSerials = Platform.ProjectionQuery<ActualProducedMaterial>().Include(pm => pm.MaterialItem).Where(pm => pm.WorkOrderOperation_Id == id).Where(pm => pm.PartialWorkedQuantity == 1).Select(pm => pm.MaterialItem.SerialNumberCode).ToList();
                serials = serials.Except(activeSerials).ToList();
                if (Platform.ProjectionQuery<WorkOOperationDependency>().Any(dep => dep.From_Id == id))
                {
                    //is not last operation
                    activeSerials.Clear();
                }

                if (!serials.Any() && !pausedSerials.Any() && !activeSerials.Any())
                    continue;

                var orderInfo = response.Orders.FirstOrDefault(o => o.Order == orders[wo.WorkOrder_Id.Value].NId);
                if (orderInfo == null)
                {
                    orderInfo = new OrderInfo
                    {
                        Description = matDefs[orders[wo.WorkOrder_Id.Value].FinalMaterial.GetValueOrDefault()].Description,
                        Order = orders[wo.WorkOrder_Id.Value].NId,
                        ProductCode = matDefs[orders[wo.WorkOrder_Id.Value].FinalMaterial.GetValueOrDefault()].NId,
                        EstimatedStartDate = orders[wo.WorkOrder_Id.Value].EstimatedStartTime.HasValue ? orders[wo.WorkOrder_Id.Value].EstimatedStartTime.Value : DateTimeOffset.UtcNow,
                        Operation = wo.NId,
                        Serials = new List<SerialInfo>()
                    };
                    response.Orders.Add(orderInfo);
                }
                orderInfo.Operation = wo.NId;
                orderInfo.OperationId = wo.Id;
                foreach (var serial in serials)
                {
                    string status = pausedSerials.Contains(serial) ? "Paused" : "Available";
                    orderInfo.Serials.Add(new SerialInfo { SerialNumber = serial, Status = status });
                    numOfSerials++;
                    if (numOfSerials >= _maxSerials)
                    {
                        break;
                    }
                }
                orderInfo.Serials.AddRange(activeSerials.Select(s => new SerialInfo { SerialNumber = s, Status = "Active" }));
                orderInfo.Serials = orderInfo.Serials.OrderBy(s => s.SerialNumber).ToList();
                if (numOfSerials >= _maxSerials)
                {
                    break;
                }
            }
            response.Orders = response.Orders.OrderBy(o => o.EstimatedStartDate).ToList();
            return response;

        }
    }
}
