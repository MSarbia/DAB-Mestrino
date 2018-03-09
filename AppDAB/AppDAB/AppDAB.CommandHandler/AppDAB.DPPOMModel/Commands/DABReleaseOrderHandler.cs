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
    public partial class DABReleaseOrderHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABReleaseOrder.Response DABReleaseOrderHandler(DABReleaseOrder command)
        {
            var response = new DABReleaseOrder.Response();

            if (command.ActualOperators <= 0)
            {
                response.SetError(-1000, "Inserire il numero di operatori");
                return response;
            }

            var workOrder = this.Platform.ProjectionQuery<WorkOrder>()
                .FirstOrDefault(wo => wo.Id == command.WorkOrderId);

            var releaeOrderResponseSucceeded = true;

            if (workOrder.Status == "Edit")
            {
                var releaseOrderInput = new ReleaseOrder
                {
                    WorkOrderId = command.WorkOrderId,
                    WorkOrderNId = command.WorkOrderNId,
                    SerialNumberCodes = command.SerialNumberCodes
                };

                var releaeOrderResponse =
                    this.Platform.CallCommand<ReleaseOrder, ReleaseOrder.Response>(releaseOrderInput);

                releaeOrderResponseSucceeded = releaeOrderResponse.Succeeded;

                if (!releaeOrderResponseSucceeded)
                {
                    response.SetError(releaeOrderResponse.Error.ErrorCode, releaeOrderResponse.Error.ErrorMessage);
                    return response;
                }
            }

            if (releaeOrderResponseSucceeded)
            {
                var setActualOperatorResponse = 
                    this.Platform.CallCommand<SetActualOperators, SetActualOperators.Response>(
                        new SetActualOperators(command.WorkOrderId, command.ActualOperators));

                if (!setActualOperatorResponse.Succeeded)
                {
                    response.SetError(setActualOperatorResponse.Error.ErrorCode, setActualOperatorResponse.Error.ErrorMessage);
                    return response;
                }
            }

            return response;
        }
    }
}
