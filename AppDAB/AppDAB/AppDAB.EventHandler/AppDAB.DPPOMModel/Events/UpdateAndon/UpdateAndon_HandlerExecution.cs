using System;

using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Lean;

using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Events
{
    /// <summary>
    /// 
    /// </summary>
    [UnifiedEvent("Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events.UpdateAndon")]
    public partial class UpdateAndon_HandlerShell : IEventHandler
    {
        private IUnifiedSdkEvent Platform;
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="unifiedSdk"></param>
        /// <param name="evt"></param>
        /// <param name="envelope"></param>
        /// <returns></returns>
        public void Execute(IUnifiedSdkEvent unifiedSdk, IEvent evt, EventEnvelope envelope)
        {
            this.Platform = unifiedSdk;

            UpdateAndon_Handler((UpdateAndon)evt, envelope);
        }

        /// <summary>
        /// 
        /// </summary>
        public System.Type GetEventType()
        {
            return typeof(UpdateAndon);
        }
    }
}
