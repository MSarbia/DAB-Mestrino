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
    public partial class ImportERPOrderHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private ImportERPOrder.Response ImportERPOrderHandler(ImportERPOrder command)
        {
            ImportERPOrder.Response response = new ImportERPOrder.Response()
            {
                WorkOrderIds = new List<int>()
            };
            var matDefId = Platform.ProjectionQuery<MaterialDefinition>().Where(m => m.NId == command.ERPOrderInfo.FinalMaterialCode && m.Revision == command.ERPOrderInfo.FinalMaterialRevision).Select(m => m.Id).FirstOrDefault();
            if (matDefId == 0)
            {
                var matDefs = Platform.ProjectionQuery<MaterialDefinition>().Where(m => m.NId == command.ERPOrderInfo.FinalMaterialCode).ToList();
                if (!matDefs.Any())
                {
                    response.SetError(-1000,"No Material Definition Found with NId: " + command.ERPOrderInfo.FinalMaterialCode);
                    CleanUp(response);
                    return response;
                }
                matDefId = matDefs.Where(m => m.Revision == matDefs.Max(md => md.Revision)).Select(m => m.Id).FirstOrDefault();
            }
            var lastOrderSequence = command.ERPOrderInfo.Orders.Where(o => o.NextOrder == 0).Select(o => o.Sequence).First();
            var processes = Platform.ProjectionQuery<Process>().Where(p => p.FinalMaterialId == matDefId).Where(p => p.Sequence == lastOrderSequence).ToList();
            if (!processes.Any())
            {
                response.SetError(-1000,"No Process Found with FinalMaterial: " + command.ERPOrderInfo.FinalMaterialCode);
                CleanUp(response);
                return response;
            }
            var process = processes.First(p => p.Revision == processes.Max(pr => pr.Revision));
            //prendere as planned e poi il process per sequence
            foreach (var phase in command.ERPOrderInfo.Orders)
            {
                var createInput = new CreateWorkOrderFromProcess
                {
                    AsPlannedId = process.AsPlannedBOP_Id,
                    ERPOrder = command.ERPOrderInfo.ERPId,
                    EstimatedStartTime = command.ERPOrderInfo.EstimatedStartTime,
                    EstimatedEndTime = command.ERPOrderInfo.EstimatedEndTime,
                    Priority = command.ERPOrderInfo.Priority,
                    Quantity = command.ERPOrderInfo.Quantity,
                    ProcessId = process.Id,
                    Plant = process.Plant,
                    FinalMaterialId = matDefId,
                    ProductionTypeNId = "Serialized",
                    NId = $"{command.ERPOrderInfo.ERPId}_{phase.Name}_{phase.Sequence}"
                };

                //rimuovere tutte le to be used non sotto la phase.WorkArea specificata
                //creare tutti i phase.ToBeConsumedMaterials;
                var createResponse = Platform.CallCommand<CreateWorkOrderFromProcess, CreateWorkOrderFromProcess.Response>(createInput);
                if (!createResponse.Succeeded)
                {
                    response.SetError(createResponse.Error.ErrorCode,createResponse.Error.ErrorMessage);
                    CleanUp(response);
                    return response;
                }
                response.WorkOrderIds.Add(createResponse.Id);

                var workOrder = Platform.ProjectionQuery<WorkOrder>().Include("WorkOrderOperations.ToBeUsedMachines").First(w => w.Id == createResponse.Id);
                //[Siemens.SimaticIT.DSL.Common.UnifiedOptionalPropertyAttribute]
                //public TimeSpan? CicleTime { get; set; }
                //public string CommandFullName { get; }
                //[System.ComponentModel.DataAnnotations.RequiredAttribute]
                //public int Operators { get; set; }
                //[Siemens.SimaticIT.DSL.Common.UnifiedOptionalPropertyAttribute]
                //public TimeSpan? SetupTime { get; set; }
                //[System.ComponentModel.DataAnnotations.RequiredAttribute]
                //public int WorkOrderId { get; set; }

                var createWOExtResponse = Platform.CallCommand<CreateWorkOrderExt, CreateWorkOrderExt.Response>(new CreateWorkOrderExt()
                {
                    WorkOrderId = createResponse.Id,
                    ///TODO: add logic
                });
               
                // Manca Sequence, EstimatedDuration, Operators, SetupTime
                //phase.NextOrder da gestire
                //phase.Sequence
                var machineIds = workOrder.WorkOrderOperations.SelectMany(wo => wo.ToBeUsedMachines).Where(m => m.Machine.HasValue).Select(m => m.Machine.Value).Distinct().ToList();
                var workAreaMachines = Platform.ProjectionQuery<Equipment>().Where(e => machineIds.Contains(e.Id)).Where(e => e.Parent == phase.WorkArea).Select(e => e.Id);
                if (!workAreaMachines.Any())
                {
                    response.SetError(-1000,$"No ToBeUsedMachines found in {workOrder.NId} for WorkArea {phase.WorkArea}");
                    CleanUp(response);
                    return response;
                }
                int minSequnece = int.MaxValue;
                WorkOrderOperation firstOperation = null;
                foreach (var wo in workOrder.WorkOrderOperations)
                {
                    if (wo.Sequence < minSequnece)
                    {
                        minSequnece = wo.Sequence;
                        firstOperation = wo;
                    }
                    //Delete ToBeUsedMachines outside the secified WorkArea
                    foreach (var machine in wo.ToBeUsedMachines.Where(tum => tum.Machine.HasValue && !workAreaMachines.Contains(tum.Machine.Value)))
                    {
                        var deleteInput = new DeleteToBeUsedMachine
                        {
                            ToBeUsedMachineId = machine.Id
                        };
                        var deleteMachineResponse = Platform.CallCommand<DeleteToBeUsedMachine, DeleteToBeUsedMachine.Response>(deleteInput);
                        if (!deleteMachineResponse.Succeeded)
                        {
                            response.SetError(deleteMachineResponse.Error.ErrorCode,deleteMachineResponse.Error.ErrorMessage);
                            CleanUp(response);
                            return response;
                        }
                    }
                }
                if (firstOperation == null)
                {
                    response.SetError(-1000,$"Error Creating {command.ERPOrderInfo.ERPId} - {phase.Name}. Process {process.Name} does not contain Operations");
                    CleanUp(response);
                    return response;
                }
                //Crate ToBeConsumedMaterials
                if (phase.ToBeConsumedMaterials.Any())
                {
                    var createToBeConsumedMaterialsInput = new CreateToBeConsumedMaterials(new List<ToBeConsumedMaterialParameter>());
                    var defNids = phase.ToBeConsumedMaterials.Select(m => m.MaterialCode);
                    var matDefs = Platform.ProjectionQuery<MaterialDefinition>().Where(md => defNids.Contains(md.NId)).ToList();
                    foreach (var mat in phase.ToBeConsumedMaterials)
                    {
                        var consMatDefId = matDefs.Where(md => md.NId == mat.MaterialCode && md.Revision == mat.MaterialRevision).Select(m=>m.Id).FirstOrDefault();
                        if (consMatDefId == 0)
                        {
                            response.SetError(-1000, $"Error Creating {command.ERPOrderInfo.ERPId} - {phase.Name}. No Material Definition has been found with code {mat.MaterialCode} and revision {mat.MaterialRevision}");
                            CleanUp(response);
                            return response;
                        }
                        createToBeConsumedMaterialsInput.WorkOrderOperationId = firstOperation.Id;
                        createToBeConsumedMaterialsInput.ToBeConsumedMaterials.Add(
                            new ToBeConsumedMaterialParameter
                            {
                                MaterialDefinitionId = consMatDefId,
                                Quantity = mat.Quantity,
                                Sequence = mat.Sequence,
                                MaterialSpecificationType = "Reference"
                            });
                        
                    }
                    var createToBeConsumedMaterialsResponse = Platform.CallCommand<CreateToBeConsumedMaterials, CreateToBeConsumedMaterials.Response>(createToBeConsumedMaterialsInput);
                    if (!createToBeConsumedMaterialsResponse.Succeeded)
                    {
                        response.SetError(createToBeConsumedMaterialsResponse.Error.ErrorCode,createToBeConsumedMaterialsResponse.Error.ErrorMessage);
                    }
                    List<int> toBeConsumedIds = Platform.ProjectionQuery<ToBeConsumedMaterial>().Where(m => m.WorkOrderOperation_Id == firstOperation.Id).Select(m=>m.Id).ToList();
                   ///TODO:
                    //var createTBCMExtResponse = Platform.CallCommand<CreateToBeConsumedMaterialExt, CreateToBeConsumedMaterialExt.Response>(new CreateToBeConsumedMaterialExt()
                    //{
                    //    ToBeConsumedMaterialIds = toBeConsumedIds
                    //});

                }
            }

            return response;
        }

        private void CleanUp(ImportERPOrder.Response response)
        {
            foreach(var woId in response.WorkOrderIds)
            {
                Platform.CallCommand<DeleteWorkOrder, DeleteWorkOrder.Response>(new DeleteWorkOrder(woId));
            }
            response.WorkOrderIds.Clear();
        }
    }
}
