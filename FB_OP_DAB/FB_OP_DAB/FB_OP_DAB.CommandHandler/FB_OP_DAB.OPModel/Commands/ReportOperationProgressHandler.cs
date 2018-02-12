using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using InforConnectorLibrary;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ReportOperationProgressHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private ReportOperationProgress.Response ReportOperationProgressHandler(ReportOperationProgress command)
        {
            var response = new ReportOperationProgress.Response();

            OperatorOperation reportOperationProgress = new OperatorOperation(command.ErpOrder, command.OperationSequence, command.ProducedQuantity);

            var result = InforConnector.ReportOperationProgress(reportOperationProgress);

            if (result.InforCallSucceeded == false)
            {
                response.SetError(-1001, result.Error);
            }
            else if (result.Error != null)
            {
                response.SetError(-1002, result.Error);
            }

            return response;

        }
    }
}
