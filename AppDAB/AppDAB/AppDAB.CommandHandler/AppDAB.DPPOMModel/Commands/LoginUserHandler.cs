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
    public partial class LoginUserHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private LoginUser.Response LoginUserHandler(LoginUser command)
        {
            var response = new LoginUser.Response() { WorkAreas = new List<string>()};
            var equipments = Platform.ProjectionQuery<UserEquipmentAssociation>().Include(e => e.Equipment).Where(e => e.UserId == command.User).Select(e => e.Equipment).ToList();
            foreach (var e in equipments)
            {
                if(e.LevelName == "Area")
                {
                    response.WorkAreas.Add(e.NId);
                    response.Role = "TeamLeader";
                    break;
                }
                else if(e.LevelName == "Machine")
                {
                    response.Equipment = e.NId;
                    if(!response.WorkAreas.Contains(e.Parent))
                    {
                        response.WorkAreas.Add(e.Parent);
                    }
                    response.Role = "Operator";
                    break;
                }
            }
            return response;
        }
    }
}
