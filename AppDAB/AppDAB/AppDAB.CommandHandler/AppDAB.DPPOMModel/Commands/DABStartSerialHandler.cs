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

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABStartSerialHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABStartSerial.Response DABStartSerialHandler(DABStartSerial command)
        {
            var response = new DABStartSerial.Response();
            var commandInfo = command.StartWOOperationSerializedParameterTypeList.First();

            var toBeProducedMaterial = commandInfo.ToBeProducedMaterials.FirstOrDefault();
            string serialNumber = toBeProducedMaterial?.SerialNumber; //if null -> resume Woop?

            string workOrderOperationNId = commandInfo.NId;
            string materialDefinitionNId = toBeProducedMaterial?.MaterialDefinitionNId;

            var workOrderOperation = Platform.ProjectionQuery<WorkOrderOperation>()
                .Include(w => w.WorkOrder).Include(w => w.ToBeConsumedMaterials)
                .Include(w => w.ToBeUsedMachines).Include(wo => wo.Predecessors)
                .FirstOrDefault(w => w.NId == workOrderOperationNId);

            int equipId = workOrderOperation.ToBeUsedMachines.First().Machine.Value;
            var equip = Platform.ProjectionQuery<Equipment>().FirstOrDefault(e => e.Id == equipId);
            int workOrderSequence = Platform.ProjectionQuery<WorkOrderExt>()
                .Where(woe => woe.WorkOrderId == workOrderOperation.WorkOrder_Id)
                .Select(woe => woe.Sequence).FirstOrDefault().GetValueOrDefault();

            if (serialNumber != null && !AlreadyStarted(serialNumber, workOrderOperation.Id))
            {
                if (IsFirstOperation(workOrderOperation))
                {
                    var niceLabelIntegration = Platform.ProjectionQuery<ConfigurationKey>().Where(c => c.NId == "NiceLabelIntegration").Select(c => c.Val).FirstOrDefault();
                    if (!string.IsNullOrEmpty(niceLabelIntegration) && niceLabelIntegration == "true")
                    {
                        var printResponse = Platform.CallCommand<PrintSNLabel, PrintSNLabel.Response>(new PrintSNLabel { ProductCode = materialDefinitionNId, WorkArea = equip.Parent, SerialNumbers = new List<string> { serialNumber } });
                        if (!printResponse.Succeeded)
                        {
                            response.SetError(printResponse.Error.ErrorCode, printResponse.Error.ErrorMessage);
                            return response;
                        }
                    }
                }
                else
                {
                    var completeResponse = CompletePreviousOperations(workOrderOperation, serialNumber);
                    if (!completeResponse.Succeeded)
                    {
                        response.SetError(completeResponse.Error.ErrorCode, completeResponse.Error.ErrorMessage);
                    }
                }

                decimal operationQuantity = workOrderOperation.PartialWorkedQuantity + workOrderOperation.ProducedQuantity + 1;
                var inforIntConf = Platform.ProjectionQuery<ConfigurationKey>().Where(c => c.NId == "InforIntegration").Select(c => c.Val).FirstOrDefault();
                if (!string.IsNullOrEmpty(inforIntConf) && inforIntConf == "true")
                {
                    foreach (var toBeConsumedMat in workOrderOperation.ToBeConsumedMaterials)
                    {
                        if (toBeConsumedMat != null)
                        {
                            var declaredQuantity = Platform.ProjectionQuery<ToBeConsumedMaterialExt>().Where(dq => dq.ToBeConsumedMaterialId == toBeConsumedMat.Id && dq.WorkOrderOperationId == workOrderOperation.Id).Select(dq => dq.DeclaredQuanity).FirstOrDefault();

                            decimal quantityToDeclare = 0;
                            if (operationQuantity == workOrderOperation.TargetQuantity)
                            {
                                quantityToDeclare = toBeConsumedMat.Quantity.Value - declaredQuantity;
                            }
                            else
                            {
                                decimal neededMatQuantity = toBeConsumedMat.Quantity.GetValueOrDefault() / workOrderOperation.TargetQuantity * operationQuantity;

                                quantityToDeclare = neededMatQuantity - declaredQuantity;
                            }

                            if (quantityToDeclare > 0)
                            {
                                var MatDefNId = Platform.ProjectionQuery<MaterialDefinition>().Where(mdnid => mdnid.Id == toBeConsumedMat.MaterialDefinition).Select(mdnid => mdnid.NId).FirstOrDefault();

                                var reportInput = new ReportConsumedMaterial(workOrderOperation.WorkOrder.ERPOrder, workOrderSequence, toBeConsumedMat.Id, quantityToDeclare, MatDefNId, toBeConsumedMat.MaterialDefinition, workOrderOperation.Id, workOrderOperation.WorkOrder.Plant);

                                var result = Platform.CallCommand<ReportConsumedMaterial, ReportConsumedMaterial.Response>(reportInput);

                                if (result.Succeeded == false)
                                {
                                    response.SetError(-1000, $"Impossibile produrre il seriale {serialNumber} per mancanza di disponibilità del componente { MatDefNId}");  //PRXXX verificare input corretto
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (response.Succeeded)
            {
                var startInput = new StartWOOperationSerialized
                {
                    StartSerializedParameter = new StartSerializedParameterType
                    {
                        Id = workOrderOperation.Id,
                        NId = workOrderOperation.NId,
                        EquipmentName = equip.Name,
                        EquipmentNId = equip.NId,
                        ToBeProducedMaterials = new List<MaterialItemParameterType>()
                    }
                };

                if (serialNumber != null)
                {
                    string mateialItemNId = Platform.ProjectionQuery<ToBeProducedMaterial>().Include(pmi => pmi.MaterialItem)
                        .Where(pmi => pmi.WorkOrderOperation_Id == workOrderOperation.Id)
                        .Where(pmi => pmi.MaterialItem.SerialNumberCode == serialNumber).Select(pmi => pmi.MaterialItem.NId).FirstOrDefault();

                    startInput.StartSerializedParameter.ToBeProducedMaterials.Add(
                        new MaterialItemParameterType
                        {
                            EquipmentNId = equip.NId,
                            SerialNumber = serialNumber,
                            MaterialDefinitionNId = materialDefinitionNId,
                            NId = mateialItemNId
                        });
                }

                var startResponse = Platform.CallCommand<StartWOOperationSerialized, StartWOOperationSerialized.Response>(startInput);
                if (!startResponse.Succeeded)
                {
                    response.SetError(startResponse.Error.ErrorCode, startResponse.Error.ErrorMessage);
                }
            }

            Platform.CallCommand<FireUpdateAndonEvent, FireUpdateAndonEvent.Response>(new FireUpdateAndonEvent(equip.Parent));

            return response;
        }

        private bool AlreadyStarted(string serialNumber, int workOrderOperationid)
        {
            //MSXXX riga sotto da cancellare tenuta solo come esempio
            //var ifStarted = Platform.ProjectionQuery<WorkOrderOperation>().Include("ActualProducedMaterials.MaterialItem").Where(t => t.Id == workOrderOperationid).SelectMany(t => t.ActualProducedMaterials).Any(t => t.MaterialItem.SerialNumberCode == serialNumber);

            var ifStarted = Platform.ProjectionQuery<ActualProducedMaterial>().Where(ifS2 => ifS2.WorkOrderOperation_Id == workOrderOperationid).Any(t => t.MaterialItem.SerialNumberCode == serialNumber);

            return ifStarted;
        }


        private CompleteWOOperationSerialized.Response CompletePreviousOperations(WorkOrderOperation workOrderOperation, string serialNumber)
        {
            var predecessorsIds = workOrderOperation.Predecessors.Select(p => p.From_Id).Distinct().ToList();

            foreach (var predecessorId in predecessorsIds)
            {
                var predecesor = Platform.ProjectionQuery<WorkOrderOperation>().Include(wo => wo.ToBeUsedMachines).First(wo => wo.Id == predecessorId);
                int equipId = predecesor.ToBeUsedMachines.First().Machine.GetValueOrDefault();
                string equipNid = Platform.ProjectionQuery<Equipment>().Where(e => e.Id == equipId).Select(e => e.NId).FirstOrDefault();
                var mateialItem = Platform.ProjectionQuery<ActualProducedMaterial>().Include(pmi => pmi.MaterialItem).Where(pmi => pmi.WorkOrderOperation_Id == predecesor.Id).Where(pmi => pmi.MaterialItem.SerialNumberCode == serialNumber && pmi.PartialWorkedQuantity==1).Select(pmi=>pmi.MaterialItem).FirstOrDefault();
                if (mateialItem == null)
                    continue;
                var materialItemNId = mateialItem.NId;
                var matDefId = mateialItem.MaterialDefinition;
                var matDefNId = Platform.ProjectionQuery<MaterialDefinition>().Where(m => m.Id == matDefId).Select(m => m.NId).FirstOrDefault();

                var completeInput = new CompleteWOOperationSerialized
                {
                    CompleteSerializedWoOpParameter = new CompleteSerializedParameterType
                    {
                        Id = predecesor.Id,
                        NId = predecesor.NId,
                        EquipmentNId = equipNid,
                        ActualProducedMaterials = new List<MaterialItemParameterType>
                        {
                            new MaterialItemParameterType
                            {
                                EquipmentNId = equipNid,
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
                    return completeResponse;
                }
            }
            return new CompleteWOOperationSerialized.Response();
        }

        private bool IsFirstOperation(WorkOrderOperation workOrderOperation)
        {
            return !workOrderOperation.Predecessors.Any();
        }
    }
}
