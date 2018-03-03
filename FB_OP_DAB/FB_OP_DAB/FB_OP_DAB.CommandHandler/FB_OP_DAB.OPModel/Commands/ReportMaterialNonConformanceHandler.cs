using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using InforConnectorLibrary;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ReportMaterialNonConformanceHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private ReportMaterialNonConformance.Response ReportMaterialNonConformanceHandler(ReportMaterialNonConformance command)
        {
            var response = new ReportMaterialNonConformance.Response();
            bool customized = Platform.Query<IMaterialDefinitionExt>().Where(cust => cust.MaterialDefinitionId == command.MaterialDefinitionId).Select(cust => cust.Customized).FirstOrDefault();

            if(command.InforIntegration)
            {
                InvTransfer reportMaterialNonConformance = new InvTransfer(command.OrderNumber, command.RefNum, command.StorageUnit, command.StorageQuantity, command.Plant, command.MaterialDefinitionNId, customized);

                var result = InforConnector.ReportMaterialNonConformance(reportMaterialNonConformance);

                if (result.InforCallSucceeded == false)
                {
                    response.SetError(-1001, result.Error);
                    return response;
                }
                else if (!string.IsNullOrEmpty(result.Error))
                {
                    response.SetError(-1002, result.Error);
                    return response;
                }
            }
            

            var createTBEResponse =  Platform.CallCommand<CreateToBeConsumedMaterialExt, CreateToBeConsumedMaterialExt.Response>(new CreateToBeConsumedMaterialExt
            {
                ToBeConsumedMaterials = new List<Types.ToBeConsumedMaterialExtParameter>
                { new Types.ToBeConsumedMaterialExtParameter
                    {
                        Sequence = command.Sequence,
                        ToBeConsumedMaterialId = command.ToBeConsumedMaterialId
                    }
                },
                WorkOrderOperationId = command.WorkOrderOperationid
            });

            var declareTBEQuantityResponse =  Platform.CallCommand<DeclareQuantity, DeclareQuantity.Response>(new DeclareQuantity
            {
                ToBeConsumedMaterialId = command.ToBeConsumedMaterialId,
                DeclaredQuantity = command.StorageQuantity,
                WorkOrderOperationId = command.WorkOrderOperationid
            });

            return response;

        }
    }
}
