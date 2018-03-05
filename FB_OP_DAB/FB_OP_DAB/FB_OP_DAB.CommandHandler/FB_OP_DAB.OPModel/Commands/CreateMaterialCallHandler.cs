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
    public partial class CreateMaterialCallHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private CreateMaterialCall.Response CreateMaterialCallHandler(CreateMaterialCall command)
        {
            var response = new CreateMaterialCall.Response();
            var materialCall = Platform.Create<IMaterialCall>();

            materialCall.Operatore = command.Operatore;
            materialCall.MaterialDefinition = command.MaterialDefinition;
            materialCall.Quantity = command.Quantity;
            materialCall.Operation = command.Operation;
            materialCall.Equipment = command.Equipment;
            materialCall.WorkArea = command.WorkArea;
            materialCall.WorkOrder = command.WorkOrder;
            materialCall.Date = DateTime.UtcNow;
            materialCall.Accepted = false;

            Platform.Submit(materialCall);
            Platform.FireEvent(new UpdateAndon { WorkArea = materialCall.WorkArea });
            response.Id = materialCall.Id;

            return response;

        }
    }
}
