using System;

using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;

using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Events
{
    /// <summary>
    /// 
    /// </summary>
    [Handler(HandlerCategory.Event)]
    public partial class UpdateAndon_HandlerShell 
    {
        /// <summary>
        /// This is the Event handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="evt"></param>
        /// <param name="envelope"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private void UpdateAndon_Handler (UpdateAndon evt, EventEnvelope envelope)
        {

            // Put your code here
 
            

            throw new NotImplementedException();            
        }
    }
}
