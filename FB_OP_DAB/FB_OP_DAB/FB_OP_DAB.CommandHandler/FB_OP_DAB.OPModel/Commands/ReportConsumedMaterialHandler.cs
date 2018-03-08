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
            var consumedMaterial = command.ConsumedMaterial;
            bool customized = Platform.Query<IMaterialDefinitionExt>().Where(cust => cust.MaterialDefinitionId == consumedMaterial.MaterialDefinitionId).Select(cust => cust.Customized).FirstOrDefault();


            IToBeConsumedMaterialExt consumedMaterialExt = Platform.Query<IToBeConsumedMaterialExt>().FirstOrDefault(cms => cms.ToBeConsumedMaterialId == consumedMaterial.ToBeConsumedMaterialId && cms.WorkOrderOperationId == consumedMaterial.WorkOrderOperationId);

            UnplannedMat reportConsumedMaterial = new UnplannedMat(consumedMaterial.ERPOrder, consumedMaterial.OrderSequence, consumedMaterial.MaterialDefinitionNId, customized, consumedMaterialExt.Sequence, consumedMaterial.ConsumedQuantity, consumedMaterial.MaterialDefinitionUoM, consumedMaterial.Plant);

            var result = InforConnector.ReportConsumedMaterial(reportConsumedMaterial);

            if (result.InforCallSucceeded == false)
            {
                response.SetError(-1001, result.Error);
                Platform.Tracer.Write("Siemens-SimaticIT-Trace-UADMRuntime", result.Error);
            }
            else if (!string.IsNullOrEmpty(result.Error))
            {
                response.SetError(-1002, result.Error);
                Platform.Tracer.Write("Siemens-SimaticIT-Trace-UADMRuntime", result.Error);
            }

            if (response.Succeeded)
            {
                consumedMaterialExt.DeclaredQuantity = consumedMaterialExt.DeclaredQuantity + consumedMaterial.ConsumedQuantity;

                Platform.Submit(consumedMaterialExt);
            }

            return response;
        }
    }
}
