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
    public partial class CreateWorkOrderExtHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private CreateWorkOrderExt.Response CreateWorkOrderExtHandler(CreateWorkOrderExt command)
        {
            var response = new CreateWorkOrderExt.Response();
        
            var woe = Platform.Create<IWorkOrderExt>();

            //MSXXX controllo se ordine già esistente???

            woe.Operators = command.Operators;
            woe.SetupTime = command.SetupTime;
            woe.CicleTime = command.CicleTime;
            woe.WorkOrderId = command.WorkOrderId;            

            Platform.Submit(woe);

            return response;
        }
    }
}
