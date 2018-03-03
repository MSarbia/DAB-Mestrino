using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class AcceptTeamLeaderCallHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private AcceptTeamLeaderCall.Response AcceptTeamLeaderCallHandler(AcceptTeamLeaderCall command)
        {

            var response = new AcceptTeamLeaderCall.Response();
     
            var teamLeaderCall = Platform.GetEntity<ITeamLeaderCall>(command.Id);

            if (teamLeaderCall != null)
            {
                teamLeaderCall.TeamLeader = command.TeamLeader;
                teamLeaderCall.Accepted = true;
                teamLeaderCall.AcceptDate = DateTime.UtcNow;

                Platform.Submit(teamLeaderCall);
                Platform.FireEvent(new UpdateAndon { WorkArea = teamLeaderCall.WorkArea });
            }
            else response.SetError(104,"TeamLeaderCall non trovata!");

            return response;

        }
    }
}
