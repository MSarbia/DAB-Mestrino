using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Types;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABCompleteSerialHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABCompleteSerial.Response DABCompleteSerialHandler(DABCompleteSerial command)
        {
            var response = new DABCompleteSerial.Response();

            var commandInfo = command.CompleteSerializedWoOpParameterList.First();
            var actualProducedMaterial = commandInfo.ActualProducedMaterials.First();
            string serialNumber = actualProducedMaterial.SerialNumber;
            string workOrderOperationNId = commandInfo.NId;
            string materialDefinitionNId = actualProducedMaterial.MaterialDefinitionNId;
            var workOrderOperation = Platform.ProjectionQuery<WorkOrderOperation>().Include(wo => wo.ToBeUsedMachines).Include(wo => wo.Predecessors).Include(wo => wo.Successors).FirstOrDefault(wo => wo.NId == workOrderOperationNId);
            if (!SerialIsCompletedOnAllPreviousOperations(workOrderOperation, serialNumber))
            {
                response.SetError(-1001, $"Il seriale {serialNumber} è ancora attivo sulle operazioni precedenti. Impossibile completare l'operazione");
                return response;
            }

            int equipId = workOrderOperation.ToBeUsedMachines.First().Machine.GetValueOrDefault();
            Equipment equip = Platform.ProjectionQuery<Equipment>().FirstOrDefault(e => e.Id == equipId);
            var mateialItem = Platform.ProjectionQuery<ActualProducedMaterial>().Include(pmi => pmi.MaterialItem).Where(pmi => pmi.WorkOrderOperation_Id == workOrderOperation.Id).Where(pmi => pmi.MaterialItem.SerialNumberCode == serialNumber).Select(pmi => pmi.MaterialItem).Distinct().ToDictionary(mi => mi.NId, mi => mi.MaterialDefinition).FirstOrDefault();
            var materialItemNId = mateialItem.Key;
            var matDefId = mateialItem.Value;
            var matDefNId = Platform.ProjectionQuery<MaterialDefinition>().Where(m => m.Id == matDefId).Select(m => m.NId).FirstOrDefault();

            var completeInput = new CompleteWOOperationSerialized
            {
                CompleteSerializedWoOpParameter = new CompleteSerializedParameterType
                {
                    Id = workOrderOperation.Id,
                    NId = workOrderOperation.NId,
                    EquipmentNId = equip.NId,
                    ActualProducedMaterials = new List<MaterialItemParameterType>
                        {
                            new MaterialItemParameterType
                            {
                                EquipmentNId = equip.NId,
                                MaterialDefinitionNId = matDefNId,
                                NId = materialItemNId,
                                SerialNumber = serialNumber
                            }
                        }
                }
            };
            var completeResponse = Platform.CallCommand<CompleteWOOperationSerialized, CompleteWOOperationSerialized.Response>(completeInput);

            if (!completeResponse.Succeeded)
            {
                response.SetError(completeResponse.Error.ErrorCode, completeResponse.Error.ErrorMessage);
            }
            int producedQuantity = decimal.ToInt32(workOrderOperation.ProducedQuantity) + 1;
            if (IsLastOperationOfOrder(workOrderOperation))
            {
                WorkOrder order = Platform.ProjectionQuery<WorkOrder>().FirstOrDefault(wo => wo.Id == workOrderOperation.WorkOrder_Id);
                WorkOrderExt workOrderExt = Platform.ProjectionQuery<WorkOrderExt>().FirstOrDefault(woe => woe.WorkOrderId == workOrderOperation.WorkOrder_Id);
                var processQuantity = Platform.ProjectionQuery<Process>().Where(p => p.Id == order.Process).Select(p => p.Quantity.Val).FirstOrDefault().GetValueOrDefault();
                if (processQuantity == 0)
                {
                    response.SetError(-1005, $"Impossiblie avanzare la produzione dell'ordine {order.NId}. Dimensione Pallet non impostata.");
                    return response;
                }

                var inforIntConf = Platform.ProjectionQuery<ConfigurationKey>().Where(c => c.NId == "InforIntegration").Select(c => c.Val).FirstOrDefault();
                if(!string.IsNullOrEmpty(inforIntConf) && inforIntConf == "true")
                {
                    if(IsLastPieceOfPallet(workOrderOperation, processQuantity))
                    {
                        var reportOperationProg = new ReportOperationProgress
                        {
                            ErpOrder = order.ERPOrder,
                            OperationSequence = workOrderExt.Sequence.GetValueOrDefault(),
                            ProducedQuantity = producedQuantity,
                            IsComplete = producedQuantity == workOrderOperation.TargetQuantity,
                            Plant = order.Enterprise.Substring(0, order.Enterprise.Length - 4)
                        };
                        var reportOperationResponse = Platform.CallCommand<ReportOperationProgress, ReportOperationProgress.Response>(reportOperationProg);
                        if (!reportOperationResponse.Succeeded)
                        {
                            response.SetError(reportOperationResponse.Error.ErrorCode, reportOperationResponse.Error.ErrorMessage);
                            return response;
                        }

                        var reportQuantity = new ReportProducedQuantity
                        {
                            ErpOrder = order.ERPOrder,
                            CloseOrder = IsLastSerialOfLastOperationOfERPOrder(workOrderOperation, workOrderExt),
                            Plant = order.Enterprise.Substring(0, order.Enterprise.Length - 4),
                            Warehouse = workOrderExt.Warehouse
                        };
                        var reportQuantityResponse = Platform.CallCommand<ReportProducedQuantity, ReportProducedQuantity.Response>(reportQuantity);
                        if (!reportQuantityResponse.Succeeded)
                        {
                            response.SetError(reportQuantityResponse.Error.ErrorCode, reportQuantityResponse.Error.ErrorMessage);
                            return response;
                        }
                    }
                }
                
                var niceLabelIntegration = Platform.ProjectionQuery<ConfigurationKey>().Where(c => c.NId == "NiceLabelIntegration").Select(c => c.Val).FirstOrDefault();
                if (!string.IsNullOrEmpty(niceLabelIntegration) && niceLabelIntegration == "true")
                {
                    var printPackageAndDataLabels = new PrintPackageDataLabel
                    {
                        ProductCode = materialDefinitionNId,
                        WorkArea = equip.Parent,
                        SerialNumbers = new List<string> { serialNumber }
                    };
                    var printPackageAndDataResponse = Platform.CallCommand<PrintPackageDataLabel, PrintPackageDataLabel.Response>(printPackageAndDataLabels);
                    if (!printPackageAndDataResponse.Succeeded)
                    {
                        response.SetError(printPackageAndDataResponse.Error.ErrorCode, printPackageAndDataResponse.Error.ErrorMessage);
                        return response;
                    }
                }
                //print package & data label
                
                //if (!string.IsNullOrEmpty(niceLabelIntegration) && niceLabelIntegration == "true")
                //{
                //    if (IsLastPieceOfPallet(workOrderOperation, processQuantity))
                //    {
                //        var printPalletLabel = new PrintPalletLabel
                //        {
                //            ProductCode = materialDefinitionNId,
                //            WorkArea = equip.Parent,
                //            SerialNumbers = new List<string>(),
                //            Quantity = 1
                //        };
                //        var printPalletResponse = Platform.CallCommand<PrintPalletLabel, PrintPalletLabel.Response>(printPalletLabel);
                //        if (!printPalletResponse.Succeeded)
                //        {
                //            response.SetError(printPalletResponse.Error.ErrorCode, printPalletResponse.Error.ErrorMessage);
                //            return response;
                //        }
                //    }
                //}
            }
            Platform.CallCommand<FireUpdateAndonEvent, FireUpdateAndonEvent.Response>(new FireUpdateAndonEvent(equip.Parent));
            return response;
        }

        private bool IsLastPieceOfPallet(WorkOrderOperation workOrderOperation, decimal processQuantity)
        {
            decimal producedQuantity = workOrderOperation.ProducedQuantity + 1;
            if (producedQuantity % processQuantity == 0)
            {
                return true;
            }
            else if (IsLastSerial(workOrderOperation))
            {
                return true;
            }
            return false;
        }

        private bool IsLastOperationOfOrder(WorkOrderOperation workOrderOperation)
        {
            return !workOrderOperation.Successors.Any();
        }

        private bool IsLastSerial(WorkOrderOperation workOrderOperation)
        {
            return ((workOrderOperation.ProducedQuantity + 1) == workOrderOperation.TargetQuantity);
        }

        private bool IsLastSerialOfLastOperationOfERPOrder(WorkOrderOperation workOrderOperation, WorkOrderExt workOrderExt)
        {
            return workOrderExt.NextOrder == 0 && IsLastSerial(workOrderOperation);
        }

        private bool SerialIsCompletedOnAllPreviousOperations(WorkOrderOperation workOrderOpration, string serialNumber)
        {
            var predecessorIds = workOrderOpration.Predecessors.Select(wo => wo.From_Id).ToList();
            return !Platform.ProjectionQuery<ToBeProducedMaterial>().Include(tpm => tpm.MaterialItem).Where(tpm => predecessorIds.Contains(tpm.WorkOrderOperation_Id)).Any(tpm => tpm.MaterialItem.SerialNumberCode == serialNumber);
        }
    }
}
