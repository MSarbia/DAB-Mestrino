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
    public partial class CreateTeamLeaderCallHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private CreateTeamLeaderCall.Response CreateTeamLeaderCallHandler(CreateTeamLeaderCall command)
        {
            // Put your code here
            // return new CreateTeamLeaderCall.Response() { ... };
            var response = new CreateTeamLeaderCall.Response();
            var teamLeaderCall = Platform.Create<ITeamLeaderCall>();
            teamLeaderCall.Date = DateTime.UtcNow;
            teamLeaderCall.Operatore = command.Operatore;
            teamLeaderCall.Equipment = command.Equipment;
            teamLeaderCall.WorkArea = command.WorkArea;
          
            Platform.Submit(teamLeaderCall);

            response.Id = teamLeaderCall.Id;

            return response;

        }
    }
}
