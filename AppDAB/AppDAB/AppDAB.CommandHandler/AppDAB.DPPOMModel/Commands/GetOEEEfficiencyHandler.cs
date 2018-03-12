using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class GetOEEEfficiencyHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private GetOEEEfficiency.Response GetOEEEfficiencyHandler(GetOEEEfficiency command)
        {
            DateTime today = DateTime.UtcNow;
            var todayFilter = new DateTime(today.Year, today.Month, today.Day, 23, 59, 59);
            var response = new GetOEEEfficiency.Response(new List<Types.GraphPoint>(), new List<Types.GraphPoint>());
            for (int d = 0; d < 15; d++)
            {
                var toDate = todayFilter.AddDays(-d);
                var fromDate = toDate.AddDays(-1);
                var kpis = Platform.CallCommand<GetKPIs, GetKPIs.Response>(new GetKPIs { WorkArea = command.WorkArea, FromDate = fromDate, ToDate = toDate });
                if (kpis.Succeeded)
                {
                    response.LE.Add(new Types.GraphPoint($"{toDate.Month}-{toDate.Day}", kpis.LE));
                    response.OEE.Add(new Types.GraphPoint($"{toDate.Month}-{toDate.Day}", kpis.OEE));
                }
            }
            return response;
        }
    }
}
