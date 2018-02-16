using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class SetActualOperatorsHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private SetActualOperators.Response SetActualOperatorsHandler(SetActualOperators command)
        {
            var response = new SetActualOperators.Response();

            var worOrderExt = Platform.Query<IWorkOrderExt>().FirstOrDefault(t => t.WorkOrderId == command.WorkOrderId);


            if (worOrderExt != null)
            {
                worOrderExt.ActualOperators = command.ActualOperators;

                Platform.Submit(worOrderExt);
            }
            else response.SetError(-1000, "WorkOrderId non trovato");
            
            return response;

        }
    }
}
