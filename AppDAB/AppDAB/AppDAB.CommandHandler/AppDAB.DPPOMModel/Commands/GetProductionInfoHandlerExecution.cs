using System;

using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Class initialize
    /// </summary>
    public partial class GetProductionInfoHandlerShell : ICompositeCommandHandler
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

            return GetProductionInfoHandler((GetProductionInfo)command);
        }

        /// <summary>
        /// Retrieve the type of the command
        /// </summary>
        public System.Type GetCommandType()
        {
            return typeof(GetProductionInfo);
        }
    }
}
