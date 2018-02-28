using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using NiceLabelConnector;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class PrintSNLabelHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private PrintSNLabel.Response PrintSNLabelHandler(PrintSNLabel command)
        {
            var response = new PrintSNLabel.Response();
            var error = LabelPrinter.PrintSNLabel(command.SerialNumbers,command.ProductCode,command.WorkArea);
            if (error.connectionsucceeded)
            {
                if (!string.IsNullOrEmpty(error.error)) response.SetError(-1000, "Errore di stampa etichetta seriale: " + error.error);
            }
            else
            {
                response.SetError(-1000, "Impossibile connettersi al servizio di stampa: " + error.error);
            }

            return response;
        }
    }
}
