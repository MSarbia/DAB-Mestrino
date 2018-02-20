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
    public partial class DeclareQuantityHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private DeclareQuantity.Response DeclareQuantityHandler(DeclareQuantity command)
        {
            var response = new DeclareQuantity.Response();

            var toBeConsumedMat = Platform.Query<IToBeConsumedMaterialExt>().FirstOrDefault(t => t.WorkOrderOperationId == command.WorkOrderOperationId && t.ToBeConsumedMaterialId == command.ToBeConsumedMaterialId);

            if (toBeConsumedMat != null)
            {
                toBeConsumedMat.DeclaredQuanity = toBeConsumedMat.DeclaredQuanity + command.DeclaredQuantity;

                Platform.Submit(toBeConsumedMat);
            }
            else response.SetError(-1000, "Coppia WorkOrderOperationId/ToBeConsumedMaterialId non trovata");

            return response;

        }
    }
}
