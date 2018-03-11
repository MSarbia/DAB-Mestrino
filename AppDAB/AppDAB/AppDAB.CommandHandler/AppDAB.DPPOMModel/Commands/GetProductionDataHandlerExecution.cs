using System;

using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Class initialize
    /// </summary>
    public partial class GetProductionDataHandlerShell : ICompositeCommandHandler
    {
        private IUnifiedSdkComposite Platform;
        
        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="unifiedSdkcomposite"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        public Response Execute(IUnifiedSdkComposite unifiedSdkcomposite, ICommand command)
        {
            this.Platform = unifiedSdkcomposite;

            return GetProductionDataHandler((GetProductionData)command);
        }

        /// <summary>
        /// Retrieve the type of the command
        /// </summary>
        public System.Type GetCommandType()
        {
            return typeof(GetProductionData);
        }
    }
}
