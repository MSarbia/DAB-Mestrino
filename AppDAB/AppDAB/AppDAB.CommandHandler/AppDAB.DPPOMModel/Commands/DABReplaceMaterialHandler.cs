using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands.Published;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Siemens.SimaticIT.U4DM.MsExt.FB_OP_EXT.OEModel.Commands;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.DataModel.ReadingModel;

namespace Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class DABReplaceMaterialHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>This is a Composite Command Handler</remarks>
        [HandlerEntryPoint]
        private DABReplaceMaterial.Response DABReplaceMaterialHandler(DABReplaceMaterial command)
        {
            var response = new DABReplaceMaterial.Response();
            /*
             * Qui dovrete invocare il TransferMaterial definite dentro FB_OP_DAB
             *  e se va a buon fine il comando UADMAcceptChangeAddToBeConsumedMaterial definito dentro
             *  al functional block FB_OP_EXT. Per poterlo chiamare dovete importarlo 
             *  dal Public Object Model Configurator (dominio Ms_Ext).
             *   Anche di questo buttate tanto giù lo scheletro poi vediamo meglio domani.
             */

            /*
             *            int? workOrderId = Platform.ProjectionQuery<ProducedMaterialItem>().Include(pmi => pmi.WorkOrder).Include(pmi => pmi.MaterialItem)
                .Where(pmi => pmi.MaterialItem.SerialNumberCode == command.SerialNumber).Select(pmi => pmi.WorkOrder_Id).FirstOrDefault();
             */
             
         

          //  var input = Platform.ProjectionQuery<??????>().Where(rmn => rmn.RefNum == command.RefNumber).Select(rmn => rmn.OrderNumber);

            var reportInput = new ReportMaterialNonConformance(command.RefNumber,"ordernumber","storageunit",0/*storage quantity*/,"TransIdToDelete"); //PRXXX Cancellare TransId dal model App

            var result = Platform.CallCommand<ReportMaterialNonConformance, ReportMaterialNonConformance.Response>(reportInput);
            
            return response;
        }
    }
}
