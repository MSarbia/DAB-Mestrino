using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABSendTestResultHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABSendTestResult.Response DABSendTestResultHandler(DABSendTestResult command)
        {
            var response = new DABSendTestResult.Response();

            ActualProducedMaterial actualProdMat = Platform.ProjectionQuery<ActualProducedMaterial>().Include("WorkOrderOperation.ToBeUsedMachines").Include(apm => apm.MaterialItem).Where(apm=>apm.PartialWorkedQuantity == 1).Where(apm => apm.MaterialItem.SerialNumberCode == command.Result.SerialNumber).FirstOrDefault();
            if (actualProdMat == null)
            {
                response.SetError(-1000, $"Nessun Ordine attivo trovato per il seriale {command.Result.SerialNumber}");
                return response;
            }
            int? workOrderId = actualProdMat.WorkOrderOperation.WorkOrder_Id;
            var matDef = Platform.ProjectionQuery<MaterialDefinition>().Where(md => md.Id == actualProdMat.MaterialItem.MaterialDefinition).Select(md => md.NId).FirstOrDefault();

            if (!workOrderId.HasValue || workOrderId == 0)
            {
                response.SetError(-1001, $"Nessun Ordine attivo trovato per il seriale {command.Result.SerialNumber}");
                return response;
            }
            //var toBeUsedMachine = actualProdMat.WorkOrderOperation.ToBeUsedMachines.Where(tum => tum.Machine.HasValue).FirstOrDefault().Machine.Value;
            //var equip = Platform.ProjectionQuery<Equipment>().Where(e => e.Id == toBeUsedMachine).FirstOrDefault();

            //var completeResponse = Platform.CallCommand<DABCompleteSerial, DABCompleteSerial.Response>(new DABCompleteSerial
            //{
            //    CompleteSerializedWoOpParameterList = new List<CompleteSerializedParameterType>
            //    {
            //        new CompleteSerializedParameterType
            //        {
            //            EquipmentNId = equip.NId,
            //            Id = actualProdMat.WorkOrderOperation.Id,
            //            NId = actualProdMat.WorkOrderOperation.NId,
            //            ActualProducedMaterials = new List<MaterialItemParameterType>
            //            {
            //                new MaterialItemParameterType
            //                {
            //                    NId = actualProdMat.MaterialItem.NId,
            //                    EquipmentNId = equip.NId,
            //                    MaterialDefinitionNId = matDef,
            //                    SerialNumber = command.Result.SerialNumber
            //                }
            //            }
            //        }
            //    }
            //});
            //if(!completeResponse.Succeeded)
            //{
            //    response.SetError(completeResponse.Error.ErrorCode, completeResponse.Error.ErrorMessage);
            //    return response;
            //}

            var resultResponse = Platform.CallCommand<SendTestResult, SendTestResult.Response>(new SendTestResult { Result = command.Result, WorkOrderId = workOrderId.Value });
            if (!resultResponse.Succeeded)
            {
                response.SetError(resultResponse.Error.ErrorCode, resultResponse.Error.ErrorMessage);
                return response;
            }
            return response;
        }
    }
}
