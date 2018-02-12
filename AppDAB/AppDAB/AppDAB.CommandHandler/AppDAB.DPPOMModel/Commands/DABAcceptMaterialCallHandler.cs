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
    public partial class DABAcceptMaterialCallHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABAcceptMaterialCall.Response DABAcceptMaterialCallHandler(DABAcceptMaterialCall command)
        {
            DABAcceptMaterialCall.Response response = new DABAcceptMaterialCall.Response();

            var getInput = new AcceptMaterialCall
            {
                Id = command.Id,
                TeamLeader = command.TeamLeader

            };

            var getResponse = Platform.CallCommand<AcceptMaterialCall, AcceptMaterialCall.Response>(getInput);

            if (!getResponse.Succeeded)
            {
                response.SetError(getResponse.Error.ErrorCode, getResponse.Error.ErrorMessage);
            }

            return response;
        }
    }
}
