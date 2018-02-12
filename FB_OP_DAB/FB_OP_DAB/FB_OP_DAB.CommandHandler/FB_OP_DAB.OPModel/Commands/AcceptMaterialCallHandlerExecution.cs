using System;

using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified;

namespace Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Commands
{
    /// <summary>
    /// Class initialize
    /// </summary>
    public partial class AcceptMaterialCallHandlerShell : ICommandHandler
    {
        private IUnifiedSdk Platform;
        
        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="unifiedSdk"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        public Response Execute(IUnifiedSdk unifiedSdk, ICommand command)
        {
            this.Platform = unifiedSdk;

            return AcceptMaterialCallHandler((AcceptMaterialCall)command);
        }

        /// <summary>
        /// Retrieve the type of the command
        /// </summary>
        public System.Type GetCommandType()
        {
            return typeof(AcceptMaterialCall);
        }
    }
}
