using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;
using System.Configuration;
using System.Net;
using System.IO;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABSendTestResultHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABSendTestResult.Response DABSendTestResultHandler(DABSendTestResult command)
        {
            var response = new DABSendTestResult.Response();

            List<ActualProducedMaterial> actualProdMats = Platform.ProjectionQuery<ActualProducedMaterial>().Include("WorkOrderOperation.ToBeUsedMachines").Include(apm => apm.MaterialItem).Where(apm => apm.PartialWorkedQuantity == 1).Where(apm => apm.MaterialItem.SerialNumberCode == command.Result.SerialNumber).ToList();

            if (!actualProdMats.Any())
            {
                response.SetError(-1000, $"Nessun Ordine attivo trovato per il seriale {command.Result.SerialNumber}");
                return response;
            }
            List<int> equipIds = actualProdMats.SelectMany(m => m.WorkOrderOperation.ToBeUsedMachines).Where(e => e.Machine != null).Select(e => e.Machine.Value).ToList();
            var testingIds = Platform.ProjectionQuery<Equipment>().Where(e => equipIds.Contains(e.Id)).Where(e => e.MachineDefinitionNId == "Testing").Select(e => e.Id).ToList();
            if (!testingIds.Any())
            {
                response.SetError(-1000, $"Nessun Ordine attivo trovato per il seriale {command.Result.SerialNumber}");
                return response;
            }
            ActualProducedMaterial actualProdMat = actualProdMats.FirstOrDefault(mat => mat.WorkOrderOperation.ToBeUsedMachines.Any(m => testingIds.Contains(m.Machine.Value)));
            if (actualProdMat == null)
            {
                response.SetError(-1000, $"Seriale {command.Result.SerialNumber} non ancora disponibile o gi� completato");
                return response;
            }

            int? workOrderId = actualProdMat.WorkOrderOperation.WorkOrder_Id;

            var resultResponse = Platform.CallCommand<SendTestResult, SendTestResult.Response>(new SendTestResult { Result = command.Result, WorkOrderId = workOrderId.Value });
            if (!resultResponse.Succeeded)
            {
                response.SetError(resultResponse.Error.ErrorCode, resultResponse.Error.ErrorMessage);
                return response;
            }

            if(command.Result.Esito!="PASS")
            {
                response.SetError(-1268, $"Collaudo fallito: {command.Result.DescrizioneEsito}");
                return response;
            }

            var matDef = Platform.ProjectionQuery<MaterialDefinition>().Where(md => md.Id == actualProdMat.MaterialItem.MaterialDefinition).Select(md => md.NId).FirstOrDefault();

            if (!workOrderId.HasValue || workOrderId == 0)
            {
                response.SetError(-1001, $"Nessun Ordine attivo trovato per il seriale {command.Result.SerialNumber}");
                return response;
            }
            var toBeUsedMachine = actualProdMat.WorkOrderOperation.ToBeUsedMachines.Where(tum => tum.Machine.HasValue).FirstOrDefault().Machine.Value;
            var equip = Platform.ProjectionQuery<Equipment>().Where(e => e.Id == toBeUsedMachine).FirstOrDefault();

            var completeResponse = Platform.CallCommand<DABCompleteSerial, DABCompleteSerial.Response>(new DABCompleteSerial
            {
                CompleteSerializedWoOpParameterList = new List<CompleteSerializedParameterType>
                {
                    new CompleteSerializedParameterType
                    {
                        EquipmentNId = equip.NId,
                        Id = actualProdMat.WorkOrderOperation.Id,
                        NId = actualProdMat.WorkOrderOperation.NId,
                        ActualProducedMaterials = new List<MaterialItemParameterType>
                        {
                            new MaterialItemParameterType
                            {
                                NId = actualProdMat.MaterialItem.NId,
                                EquipmentNId = equip.NId,
                                MaterialDefinitionNId = matDef,
                                SerialNumber = command.Result.SerialNumber
                            }
                        }
                    }
                }
            });
            if (!completeResponse.Succeeded)
            {
                response.SetError(completeResponse.Error.ErrorCode, completeResponse.Error.ErrorMessage);
                return response;
            }
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
