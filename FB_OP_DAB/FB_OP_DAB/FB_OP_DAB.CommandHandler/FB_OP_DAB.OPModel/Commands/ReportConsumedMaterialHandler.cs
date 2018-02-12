using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using InforConnectorLibrary;

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

            UnplannedMat reportConsumedMaterial = new UnplannedMat(command.ErpOrder, command.OperationSequence, command.ConsumedMaterialDefinition, command.ConsumedMaterialSequence,command.ConsumedQuantity);

            var result = InforConnector.ReportConsumedMaterial(reportConsumedMaterial);

            if (result.InforCallSucceeded == false)
            {
                response.SetError(-1001, result.Error);
            }
            else if (result.Error != null)
            {
                response.SetError(-1002, result.Error);
            }

            return response;
        }
    }
}
