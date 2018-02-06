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
    public partial class DABGetTestCardHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABGetTestCard.Response DABGetTestCardHandler(DABGetTestCard command)
        {
            DABGetTestCard.Response response = new DABGetTestCard.Response();
            int? workOrderId = null;
            //workOrderId = Platform.ProjectionQuery<IWordOrder>().Where().Select(w => w.Id).FirstOrDefault();
            if(workOrderId == null)
            {
                response.SetError(-1000, $"Nessun WorkOrder trovato per il seriale {command.SerialNumber}");
                return response;
            }
            var getInput = new GetTestCard
            {
                WorkOrderId = workOrderId.Value
            };
            var getResponse = Platform.CallCommand<GetTestCard, GetTestCard.Response>(getInput);

            if(getResponse.Succeeded)
            {
                response.TestCard = getResponse.TestCard;
            }
            else
            {
                response.SetError(getResponse.Error.ErrorCode, getResponse.Error.ErrorMessage);
            }
            return response;
                                
        }
    }
}
