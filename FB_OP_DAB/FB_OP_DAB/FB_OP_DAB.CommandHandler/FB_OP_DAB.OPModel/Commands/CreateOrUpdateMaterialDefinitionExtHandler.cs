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
    public partial class CreateOrUpdateMaterialDefinitionExtHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private CreateOrUpdateMaterialDefinitionExt.Response CreateOrUpdateMaterialDefinitionExtHandler(CreateOrUpdateMaterialDefinitionExt command)
        {
            var response = new CreateOrUpdateMaterialDefinitionExt.Response();
            var MaterialDefinitionExt = Platform.Query<IMaterialDefinitionExt>().FirstOrDefault(t => t.MaterialDefinitionId == command.MaterialDefinitionId);
            if (MaterialDefinitionExt == null)
            {
                MaterialDefinitionExt = Platform.Create<IMaterialDefinitionExt>();
                MaterialDefinitionExt.MaterialDefinitionId = command.MaterialDefinitionId;
                MaterialDefinitionExt.Customized = command.Customized;

                Platform.Submit(MaterialDefinitionExt);
            }
            else
            {
                if (MaterialDefinitionExt.Customized != command.Customized)
                {
                    MaterialDefinitionExt.Customized = command.Customized;
                    Platform.Submit(MaterialDefinitionExt);
                }
            }

            return response;
        }
    }
}
