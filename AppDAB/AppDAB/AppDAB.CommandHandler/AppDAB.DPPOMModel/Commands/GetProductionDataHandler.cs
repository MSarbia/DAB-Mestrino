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
    public partial class GetProductionDataHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private GetProductionData.Response GetProductionDataHandler(GetProductionData command)
        {
            DateTime today = DateTime.UtcNow;
            var todayFilter = new DateTime(today.Year, today.Month, today.Day, 23, 59, 59);
            var response = new GetProductionData.Response(new List<Types.GraphPoint>(), new List<Types.GraphPoint>());
            for (int d = 0; d < 15; d++)
            {
                var toDate = todayFilter.AddDays(-d);
                var fromDate = toDate.AddDays(-1);
                var pis = Platform.CallCommand<GetProductionInfo, GetProductionInfo.Response>(new GetProductionInfo { WorkArea = command.WorkArea, FromDate = fromDate, ToDate = toDate });
                

                if (pis.Succeeded)
                {
                    response.ProducedOrders.Add(new Types.GraphPoint($"{toDate.Month}-{toDate.Day}", pis.ProducedOrders));
                    response.ProducedPieces.Add(new Types.GraphPoint($"{toDate.Month}-{toDate.Day}", pis.ActualProducedQuantity));
                }
            }
            return response;
        }
    }
}
