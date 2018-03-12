using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class SetProducedPiecesHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private SetProducedPieces.Response SetProducedPiecesHandler(SetProducedPieces command)
        {
            var producedPieces = Platform.Query<IDailyProduction>().FirstOrDefault(p => p.WorkOrderId == command.WorkOrderId && p.Year == command.Year && p.Month == command.Month && p.Day == command.Day);
            if(producedPieces==null)
            {
                producedPieces = Platform.Create<IDailyProduction>();
                producedPieces.WorkOrderId = command.WorkOrderId;
                producedPieces.Year = command.Year;
                producedPieces.Month = command.Month;
                producedPieces.Day = command.Day;
                producedPieces.WorkArea = command.WorkArea;
                producedPieces.Pieces = 1;

                Platform.Submit(producedPieces);
            }
            else
            {
                producedPieces.Pieces += 1;
                Platform.Submit(producedPieces);
            }
            return new SetProducedPieces.Response();
        }
    }
}
