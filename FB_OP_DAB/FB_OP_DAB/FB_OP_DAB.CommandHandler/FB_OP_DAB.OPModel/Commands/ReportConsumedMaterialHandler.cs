using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using InforConnectorLibrary;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ReportConsumedMaterialHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private ReportConsumedMaterial.Response ReportConsumedMaterialHandler(ReportConsumedMaterial command)
        {
            var response = new ReportConsumedMaterial.Response();

            bool customized = Platform.Query<IMaterialDefinitionExt>().Where(cust => cust.MaterialDefinitionId == command.MaterialDefinitionId).Select(cust => cust.Customized).FirstOrDefault();


            IToBeConsumedMaterialExt consumedMaterialExt = Platform.Query<IToBeConsumedMaterialExt>().FirstOrDefault(cms => cms.ToBeConsumedMaterialId == command.ToBeConsumedMaterialId && cms.WorkOrderOperationId == command.WorkOrderOperationId);

            UnplannedMat reportConsumedMaterial = new UnplannedMat(command.ERPOrder, command.OrderSequence, command.MaterialDefinitionNId, customized, consumedMaterialExt.Sequence, command.ConsumedQuantity, command.Plant);

            var result = InforConnector.ReportConsumedMaterial(reportConsumedMaterial);

            if (result.InforCallSucceeded == false)
            {
                response.SetError(-1001, result.Error);
            }
            else if (!string.IsNullOrEmpty(result.Error))
            {
                response.SetError(-1002, result.Error);
            }

            if (response.Succeeded)
            {
                consumedMaterialExt.DeclaredQuanity = consumedMaterialExt.DeclaredQuanity + command.ConsumedQuantity;

                Platform.Submit(consumedMaterialExt);
            }

            return response;
        }
    }
}
