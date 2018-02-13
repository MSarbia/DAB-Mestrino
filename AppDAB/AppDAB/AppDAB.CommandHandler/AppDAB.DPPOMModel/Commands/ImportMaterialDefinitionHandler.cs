using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ImportMaterialDefinitionHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private ImportMaterialDefinition.Response ImportMaterialDefinitionHandler(ImportMaterialDefinition command)
        {
            var response = new ImportMaterialDefinition.Response();
            var matDef = Platform.ProjectionQuery<MaterialDefinition>().FirstOrDefault(m => m.NId == command.MaterialCode && m.Revision == command.MaterialRevision);
            if(matDef!=null)
            {
                var matUpdateResponse = Platform.CallCommand<UADMUpdateMaterialDefinition, UADMUpdateMaterialDefinition.Response>(new UADMUpdateMaterialDefinition
                {
                    NId = matDef.NId,
                    FirstArticleInspection = matDef.FirstArticleInspection,
                    MaxRecycleCount = matDef.MaxRecycleCount,
                    MinQuantity = matDef.MinQuantity,
                    Name = matDef.Name,
                    Revision = matDef.Revision,
                    Traceable = matDef.Traceable,
                    Description = command.Description,
                    SerialNumberProfile = command.Serialized
                });
                if(!matUpdateResponse.Succeeded)
                {
                    response.SetError(matUpdateResponse.Error.ErrorCode, matUpdateResponse.Error.ErrorMessage);
                    return response;
                }
                response.MaterialCode = matDef.NId;
                response.MaterialRevision = matDef.Revision;
            }
            else
            {
                if(!Platform.ProjectionQuery<UoM>().Any(u=>u.NId == command.UoM))
                {
                    var createUoMResponse = Platform.CallCommand<CreateUoM, CreateUoM.Response>(new CreateUoM {
                         IsActive = true,
                         NId = command.UoM,
                         Name = command.UoM
                    });

                    if(!createUoMResponse.Succeeded)
                    {
                        response.SetError(createUoMResponse.Error.ErrorCode, createUoMResponse.Error.ErrorMessage);
                        return response;
                    }
                }

                if(!string.IsNullOrEmpty(command.MaterialFamily) && !Platform.ProjectionQuery<MaterialClass>().Any(mc => mc.NId == command.MaterialFamily))
                {
                    var createMaterialClassResponse = Platform.CallCommand<CreateMaterialClass, CreateMaterialClass.Response>(new CreateMaterialClass
                    {
                        NId = command.MaterialFamily,
                        Name = command.MaterialFamily
                    });

                    if (!createMaterialClassResponse.Succeeded)
                    {
                        response.SetError(createMaterialClassResponse.Error.ErrorCode, createMaterialClassResponse.Error.ErrorMessage);
                        return response;
                    }
                }

                var createResponse = Platform.CallCommand<UADMCreateMaterialDefinition, UADMCreateMaterialDefinition.Response>(new UADMCreateMaterialDefinition
                {
                    NId = command.MaterialCode,
                    Name = command.MaterialCode,
                    Revision = command.MaterialRevision,
                    Description = command.Description,
                    FirstArticleInspection = false,
                    MaterialClassNId = command.MaterialFamily,
                    SerialNumberProfile = command.Serialized,
                    UOM = command.UoM
                });

                if (!createResponse.Succeeded)
                {
                    response.SetError(createResponse.Error.ErrorCode, createResponse.Error.ErrorMessage);
                    return response;
                }
            }
            response.MaterialCode = command.MaterialCode;
            response.MaterialRevision = command.MaterialRevision;
            return response;
                                
        }
    }
}
