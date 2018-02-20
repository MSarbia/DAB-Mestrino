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

            var workOrderOperationIds = Platform.ProjectionQuery<ToBeUsedMachine>().Where(m => m.Machine == machine).Select(m=>m.WorkOrderOperation_Id.Value).ToList();
            var wos = Platform.ProjectionQuery<WorkOrderOperation>().Where(w => workOrderOperationIds.Contains(w.Id)).Where(w => w.IsReady).ToList();
            var orderIds = wos.Select(w => w.WorkOrder_Id).Distinct().ToList();
            var woDictionary = wos.ToDictionary(wo=>wo.Id,wo=>wo);
            Dictionary<int, WorkOrder> orders = Platform.ProjectionQuery<WorkOrder>().Where(o => orderIds.Contains(o.Id)).ToDictionary(o => o.Id, o => o);
            foreach (var id in workOrderOperationIds)
            {
                var wo = woDictionary[id];
                var serials = Platform.ProjectionQuery<ToBeProducedMaterial>().Include(pm => pm.MaterialItem).Where(pm =>pm.WorkOrderOperation_Id == id).Select(pm => pm.MaterialItem).Where(m => m.Status == "").ToList();

                if(!Platform.ProjectionQuery<WorkOOperationDependency>().Any(dep=>dep.From_Id == id))
                {
                    //is last operation
                    serials.AddRange(Platform.ProjectionQuery<ActualProducedMaterial>().Include(pm => pm.MaterialItem).Where(pm => pm.WorkOrderOperation_Id == id).Select(pm => pm.MaterialItem).Where(m => m.Status == "").ToList());
                }
                
                if (!serials.Any())
                    continue;

                var orderInfo = response.Orders.FirstOrDefault(o => o.Order == orders[wo.WorkOrder_Id.Value].Name);

                //var order = new OrderInfo
                //{
                //    Description = woDictionary[],
                //    Order = orders[],
                //    ProductCode = o.FinalMaterial
                //};
            }
            return response;

        }
    }
}