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
    public partial class PrintPackageDataLabelHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private PrintPackageDataLabel.Response PrintPackageDataLabelHandler(PrintPackageDataLabel command)
        {
            var response = new PrintPackageDataLabel.Response();

            var error1 = LabelPrinter.PrintDataLabel(command.SerialNumbers, command.ProductCode, command.WorkArea);
            var error2 = LabelPrinter.PrintPackageLabel(command.SerialNumbers, command.ProductCode, command.WorkArea);

            if (error1.connectionsucceeded && error2.connectionsucceeded)
            {
                string error = " |DataLabel:" + error1.error + " |PackageLabel:" + error2.error;
                if ((string.IsNullOrEmpty(error1.error) && string.IsNullOrEmpty(error2.error))) response.SetError(-1000, error);

            }
            else
            {
                response.SetError(-1000, "Impossibile connetersi a NiceLabel");
            }

            return response;

        }
    }
}
