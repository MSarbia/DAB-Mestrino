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
    public partial class AcceptMaterialCallHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private AcceptMaterialCall.Response AcceptMaterialCallHandler(AcceptMaterialCall command)
        {

            var response = new AcceptMaterialCall.Response();
            //var materialCall = Platform.Query<IMaterialCall>().FirstOrDefault(t => t.Id == command.Id);

            var materialCall = Platform.GetEntity<IMaterialCall>(command.Id);

            if (materialCall != null)
            {
                materialCall.TeamLeader = command.TeamLeader;
                materialCall.Accepted = true;
                materialCall.AcceptDate = DateTime.UtcNow;
               
                Platform.Submit(materialCall);
                Platform.FireEvent(new UpdateAndon { WorkArea = materialCall.WorkArea });
            }
            else response.SetError(104, "MaterialCall non trovata!");

            return response;
        }
    }
}
