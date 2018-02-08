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
    public partial class DABCreateTeamLeaderCallHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABCreateTeamLeaderCall.Response DABCreateTeamLeaderCallHandler(DABCreateTeamLeaderCall command)
        {
            {
                DABCreateTeamLeaderCall.Response response = new DABCreateTeamLeaderCall.Response();

                var getInput = new CreateTeamLeaderCall
                {
                    Operatore = command.Operatore,              
                    Equipment = command.Equipment,
                    WorkArea = command.WorkArea
                };

                var getResponse = Platform.CallCommand<CreateTeamLeaderCall, CreateTeamLeaderCall.Response>(getInput);

                if (getResponse.Succeeded)
                {
                    response.Id = getResponse.Id;
                }
                else
                {
                    response.SetError(getResponse.Error.ErrorCode, getResponse.Error.ErrorMessage);
                }
                return response;

            }

        }
    }
}
