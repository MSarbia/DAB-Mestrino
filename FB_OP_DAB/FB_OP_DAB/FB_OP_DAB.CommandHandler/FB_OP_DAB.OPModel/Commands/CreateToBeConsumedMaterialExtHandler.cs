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
    public partial class CreateToBeConsumedMaterialExtHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private CreateToBeConsumedMaterialExt.Response CreateToBeConsumedMaterialExtHandler(CreateToBeConsumedMaterialExt command)
        {
            var response = new CreateToBeConsumedMaterialExt.Response();

            var tbcme = Platform.Create<IToBeConsumedMaterialExt>();

            tbcme.WorkOrderOperationId = command.WorkOrderOperationId;

            foreach (var tbcm in command.ToBeConsumedMaterials)
            {
                tbcme.ToBeConsumedMaterialId = tbcm.ToBeConsumedMaterialId;
                tbcme.Sequence = tbcm.Sequence;
                tbcme.DeclaredQuanity = 0;
                Platform.Submit(tbcme);
            }
            return response;
        }
    }
}
