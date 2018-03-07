using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;
using InforConnectorLibrary;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ReportConsumedMaterialsHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private ReportConsumedMaterials.Response ReportConsumedMaterialsHandler(ReportConsumedMaterials command)
        {
            var response = new ReportConsumedMaterials.Response();
            var unplannedMats = new List<UnplannedMat>();
            var matExts = new Dictionary<int,IToBeConsumedMaterialExt>();
            foreach (var consumedMat in command.ConsumedMaterials)
            {
                bool customized = Platform.Query<IMaterialDefinitionExt>().Where(cust => cust.MaterialDefinitionId == consumedMat.MaterialDefinitionId).Select(cust => cust.Customized).FirstOrDefault();


                IToBeConsumedMaterialExt consumedMaterialExt = Platform.Query<IToBeConsumedMaterialExt>().FirstOrDefault(cms => cms.ToBeConsumedMaterialId == consumedMat.ToBeConsumedMaterialId && cms.WorkOrderOperationId == consumedMat.WorkOrderOperationId);
                matExts.Add(consumedMat.ToBeConsumedMaterialId, consumedMaterialExt);
                unplannedMats.Add( new UnplannedMat(consumedMat.ERPOrder, consumedMat.OrderSequence, consumedMat.MaterialDefinitionNId, customized, consumedMaterialExt.Sequence, consumedMat.ConsumedQuantity, consumedMat.MaterialDefinitionUoM, consumedMat.Plant));

            }


            var result = InforConnector.ReportConsumedMaterials(unplannedMats);

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
                foreach(var matEx in command.ConsumedMaterials)
                {
                    matExts[matEx.ToBeConsumedMaterialId].DeclaredQuantity = matExts[matEx.ToBeConsumedMaterialId].DeclaredQuantity + matEx.ConsumedQuantity;
                    Platform.Submit(matExts[matEx.ToBeConsumedMaterialId]);
                }
            }

            return response;

        }
    }
}
