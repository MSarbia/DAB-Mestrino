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
    public partial class DABSendTestResultHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABSendTestResult.Response DABSendTestResultHandler(DABSendTestResult command)
        {
            var response = new DABSendTestResult.Response();
            var workOrderId = Platform.ProjectionQuery<ProducedMaterialItem>().Include(pmi => pmi.MaterialItem).Where(pmi => pmi.MaterialItem.SerialNumberCode == command.Result.SerialNumber).Select(pmi => pmi.WorkOrder_Id).FirstOrDefault();
            if (!workOrderId.HasValue || workOrderId == 0)
            {
                response.SetError(-1001, $"Impossibile trovare un Ordine associato al seriale {command.Result.SerialNumber}");
                return response;
            }
            var resultResponse = Platform.CallCommand<SendTestResult, SendTestResult.Response>(new SendTestResult { Result = command.Result, WorkOrderId = workOrderId.Value });
            if (!resultResponse.Succeeded)
            {
                response.SetError(resultResponse.Error.ErrorCode, resultResponse.Error.ErrorMessage);
            }
            return response;
        }
    }
}
