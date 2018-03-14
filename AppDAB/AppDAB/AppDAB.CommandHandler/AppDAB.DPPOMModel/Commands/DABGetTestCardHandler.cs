using System.Linq;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.IO;

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
            List<ToBeProducedMaterial> toBeProdMats = Platform.ProjectionQuery<ToBeProducedMaterial>().Include("WorkOrderOperation.ToBeUsedMachines").Include(tpm => tpm.MaterialItem).Where(pmi => pmi.MaterialItem.SerialNumberCode == command.SerialNumber).ToList();
            if (!toBeProdMats.Any())
            {
                response.SetError(-1000, $"Nessun Ordine trovato per il seriale {command.SerialNumber}");
                return response;
            }
            List<int> equipIds = toBeProdMats.SelectMany(m => m.WorkOrderOperation.ToBeUsedMachines).Where(e => e.Machine != null).Select(e => e.Machine.Value).ToList();
            var testingIds = Platform.ProjectionQuery<Equipment>().Where(e => equipIds.Contains(e.Id)).Where(e => e.MachineDefinitionNId == "Testing").Select(e => e.Id).ToList();
            if (!testingIds.Any())
            {
                response.SetError(-1000, $"Nessun Ordine trovato per il seriale {command.SerialNumber}");
                return response;
            }

            ToBeProducedMaterial toBeProdMat = toBeProdMats.FirstOrDefault(mat=>mat.WorkOrderOperation.ToBeUsedMachines.Any(m => testingIds.Contains(m.Machine.Value)));
            if(toBeProdMat==null)
            {
                response.SetError(-1000, $"Seriale {command.SerialNumber} non ancora disponibile o già avviato");
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
            RefreshOTWebSerials(workOrderId.Value);

            return response;

        }
        private void RefreshOTWebSerials(int workOrderId)
        {
            int equipId = Platform.ProjectionQuery<WorkOrderOperation>().Include(wo => wo.ToBeUsedMachines).Where(wo => wo.WorkOrder_Id == workOrderId).SelectMany(wo => wo.ToBeUsedMachines).Where(m => m.Machine != null).Select(m => m.Machine.Value).FirstOrDefault();
            string workArea = Platform.ProjectionQuery<Equipment>().Where(e => e.Id == equipId).Select(e => e.Parent).FirstOrDefault();
            if (string.IsNullOrEmpty(workArea))
                return;
            //OTServiceUri
            string otServiceUri = ConfigurationManager.AppSettings["OTServiceUri"];
            var httpWebRequest = (HttpWebRequest)WebRequest.Create($"{otServiceUri}/RefreshSerials");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Accept = "application/json";
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = $"\"{workArea}\"";

                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }
            var httpResponse = httpWebRequest.GetResponse();
        }
    }
}
