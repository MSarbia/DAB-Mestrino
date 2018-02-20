using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABCompleteSerialHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABCompleteSerial.Response DABCompleteSerialHandler(DABCompleteSerial command)
        {
            var response = new DABCompleteSerial.Response();
            /*
             Qua bisognerà invocare i due comandi di avanzamento fase e avanzamento produzione 
             che avete definito dentro FB_OP_DAB a seconda di alcune logiche che vedremo meglio domani.
             A seguito di questi dovrete invocare il comando UADMCompleteWOOperationSerializedList definito
             dentro al functional block FB_OP_EXT. Per poterlo chimare dovete importarlo dal 
             Public Object Model Configurator (dominio Ms_Ext).
             Anche di questo buttate tanto giù lo scheletro poi vediamo meglio domani.

             */

            var reportOperationProg = new ReportOperationProgress();

            var input = new CompleteWOOperationSerialized();

            var result = Platform.CallCommand<CompleteWOOperationSerialized, CompleteWOOperationSerialized.Response>(input);


            if (result.Succeeded == false)
            {
                response.SetError(-1007,result.WarningMessage);
            }
            return response;

        }
    }
}
