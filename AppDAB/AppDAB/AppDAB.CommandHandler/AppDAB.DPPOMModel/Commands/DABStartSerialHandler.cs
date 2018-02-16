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

            var workOrderOperation = Platform.ProjectionQuery<WorkOrderOperation>().Include(w=>w.ToBeConsumedMaterials).FirstOrDefault(w=>w.NId == command.WorkOrderOperationNId);

            foreach (var toBeConsumedMat in workOrderOperation.ToBeConsumedMaterials)
            {
                if (toBeConsumedMat != null)
                {
                    var reportInput = new ReportConsumedMaterial(workOrderOperation.WorkOrder.ToString(), workOrderOperation.Sequence, toBeConsumedMat.MaterialDefinition.ToString(), toBeConsumedMat.Sequence, workOrderOperation.ProducedQuantity); ///PRXXX Da verificare

                    var result=Platform.CallCommand<ReportConsumedMaterial, ReportConsumedMaterial.Response>(reportInput);

                    if (result.Succeeded == false)
                    {
                        response.SetError(-1000, $"Impossibile produrre il seriale {command.SerialNumber} per mancanza di disponibilità del componente { toBeConsumedMat.Id}");  //PRXXX verificare input corretto
                    }
                    else
                    {
                       // Platform.CallCommand<StartWOOperationSerialized,StartWOOperationSerialized.Response>(); // PRXXX verificare correttezza metodo invece di StartWOOperationSerializedParameterTypeList
                    }
                }

            }

            /*
Se non viene ritornato null per ogni elemento all’interno di workOrderOperation.ToBeConsumedMaterials dovrà
invocare il commando di Consumo materiali che avete definito dentro FB_OP_DAB.
In caso il comando ritorni errore dovrete fare un 
response.SetError(-1000,”Impossibile produrre il seriale {SerialNumber} 
per mancanza di disponibilità del componente {toBeConsmedMaterial.NId}”) o qualcosa del genere.
Se tutto va bene invece dovrete invocare il comando 
StartWOOperationSerializedParameterTypeList definito dentro al functional block FB_OP_EXT.
Per poterlo chimare dovete importarlo dal Public Object Model Configurator (dominio Ms_Ext).
Iniziate a buttare giù lo scheletro della logica, domani vediamo di estrarre con delle query
i parametri di input che mancano per invocare quest’ultimo comando. 
             */


            return response;

        }
    }
}
