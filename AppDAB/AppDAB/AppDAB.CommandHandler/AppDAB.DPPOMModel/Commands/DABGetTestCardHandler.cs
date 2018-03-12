using System.Linq;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;
using System.Collections.Generic;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABGetTestCardHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABGetTestCard.Response DABGetTestCardHandler(DABGetTestCard command)
        {
            DABGetTestCard.Response response = new DABGetTestCard.Response();
            ToBeProducedMaterial toBeProdMat = Platform.ProjectionQuery<ToBeProducedMaterial>().Include("WorkOrderOperation.ToBeUsedMachines").Include(tpm => tpm.MaterialItem).Where(pmi => pmi.MaterialItem.SerialNumberCode == command.SerialNumber).FirstOrDefault();
            if (toBeProdMat == null)
            {
                response.SetError(-1000, $"Nessun Ordine trovato per il seriale {command.SerialNumber}");
                return response;
            }
            int? workOrderId = toBeProdMat.WorkOrderOperation.WorkOrder_Id;
            var matDef = Platform.ProjectionQuery<MaterialDefinition>().Where(md => md.Id == toBeProdMat.MaterialItem.MaterialDefinition).FirstOrDefault();
            if (workOrderId == null)
            {
                response.SetError(-1000, $"Nessun Ordine trovato per il seriale {command.SerialNumber}");
                return response;
            }
            var windchillConf = Platform.ProjectionQuery<ConfigurationKey>().Where(c => c.NId == "WindchillIntegration").Select(c => c.Val).FirstOrDefault();
            var windchillIntegration = (!string.IsNullOrEmpty(windchillConf) && windchillConf == "true");

            var getInput = new GetTestCard
            {
                WorkOrderId = workOrderId.Value,
                ProductCode = matDef.NId,
                ProductRevision = matDef.Revision,
                WindchillIntegration = windchillIntegration
            };
            var getResponse = Platform.CallCommand<GetTestCard, GetTestCard.Response>(getInput);
            if (!getResponse.Succeeded)
            {
                response.SetError(getResponse.Error.ErrorCode, getResponse.Error.ErrorMessage);
                return response;
            }
            var toBeUsedMachine = toBeProdMat.WorkOrderOperation.ToBeUsedMachines.Where(tum => tum.Machine.HasValue).FirstOrDefault().Machine.Value;
            var equip = Platform.ProjectionQuery<Equipment>().Where(e => e.Id == toBeUsedMachine).FirstOrDefault();
            var startResponse = Platform.CallCommand<DABStartSerial, DABStartSerial.Response>(new DABStartSerial
            {
                StartWOOperationSerializedParameterTypeList = new List<StartSerializedParameterType>
                {
                    new StartSerializedParameterType
                    {
                        Id = toBeProdMat.WorkOrderOperation.Id,
                        NId = toBeProdMat.WorkOrderOperation.NId,
                        EquipmentName = equip.Name,
                        EquipmentNId = equip.NId,
                        ToBeProducedMaterials = new List<MaterialItemParameterType>
                        {
                            new MaterialItemParameterType
                            {
                                NId = toBeProdMat.MaterialItem.NId,
                                EquipmentNId = equip.NId,
                                MaterialDefinitionNId = matDef.NId,
                                SerialNumber = command.SerialNumber
                            }
                        }
                    }
                }
            });
            if (!startResponse.Succeeded)
            {
                response.SetError(startResponse.Error.ErrorCode, startResponse.Error.ErrorMessage);
                return response;
            }
            response.TestCard = getResponse.TestCard;
            return response;

        }
    }
}
