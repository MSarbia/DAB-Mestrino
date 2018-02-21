using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Commands;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABStartSerialHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABStartSerial.Response DABStartSerialHandler(DABStartSerial command)
        {
            var response = new DABStartSerial.Response();

            var workOrderOperation = Platform.ProjectionQuery<WorkOrderOperation>().Include(w => w.WorkOrder).Include(w=>w.ToBeConsumedMaterials).FirstOrDefault(w=>w.NId == command.WorkOrderOperationNId);

            if(IsFirstOperation(workOrderOperation))
            {
                //PrintSerial
            }
            else
            {
                CompletePreviousOperations(workOrderOperation, command);
            }

            foreach (var toBeConsumedMat in workOrderOperation.ToBeConsumedMaterials)
            {
                if (toBeConsumedMat != null)
                {
                    //Platform.ProjectionQuery<MaterialDefinition> // Id == toBeConsumedMat.MaterialDefinition => select NId
                    var reportInput = new ReportConsumedMaterial(workOrderOperation.WorkOrder.ERPOrder, workOrderOperation.WorkOrder.Sequence.GetValueOrDefault(), toBeConsumedMat.MaterialDefinition.ToString(), toBeConsumedMat.Sequence, workOrderOperation.
                        ); ///PRXXX Da verificare

                    var result=Platform.CallCommand<ReportConsumedMaterial, ReportConsumedMaterial.Response>(reportInput);

                    if (result.Succeeded == false)
                    {
                        response.SetError(-1000, $"Impossibile produrre il seriale {command.SerialNumber} per mancanza di disponibilità del componente { toBeConsumedMat.Id}");  //PRXXX verificare input corretto
                    }
                    else
                    {
                       //Platform.CallCommand<StartWOOperationSerialized,StartWOOperationSerialized.Response>(); // PRXXX verificare correttezza metodo invece di StartWOOperationSerializedParameterTypeList
                    }
                }

            }

            return response;
        }

        private void CompletePreviousOperations(WorkOrderOperation workOrderOperation, DABStartSerial command)
        {
           
        }

        private bool IsFirstOperation(WorkOrderOperation workOrderOperation)
        {
            return true;
        }
    }
}
