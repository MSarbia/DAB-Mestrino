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
    public partial class SendTestResultHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private SendTestResult.Response SendTestResultHandler(SendTestResult command)
        {
            var response = new SendTestResult.Response();

            Guid testCardId = Platform.Query<ITestCard>().Where(t => t.WorkOrderId == command.WorkOrderId).Select(t=>t.Id).FirstOrDefault();
            var testResult = Platform.Create<ITestResult>();
            testResult.TestCard_Id = testCardId;
            testResult.CorrenteDiTerra = command.Result.CorrenteDiTerra;
            testResult.CorrenteRigidita = command.Result.CorrenteRigidita;
            testResult.Data = DateTimeOffset.UtcNow;
            testResult.DescrizioneEsito = command.Result.DescrizioneEsito;
            testResult.Esito = command.Result.Esito;
            testResult.ResistenzaDiTerra = command.Result.ResistenzaDiTerra;
            testResult.ResistenzaIsolamento = command.Result.ResistenzaIsolamento;
            testResult.SerialNumber = command.Result.SerialNumber;
            testResult.TensioneIsolamento = command.Result.TensioneIsolamento;
            testResult.TensioneRigidita = command.Result.TensioneRigidita;

            foreach(var ass in command.Result.Assorbimenti)
            {
                var newAss = Platform.Create<IAbsorptionResult>();
                newAss.AmpereFase1 = ass.AmpereFase1;
                newAss.AmpereFase2 = ass.AmpereFase2;
                newAss.AmpereFase3 = ass.AmpereFase3;
                newAss.FattoreDiPotenza = ass.FattoreDiPotenza;
                newAss.Nome = ass.Nome;
                newAss.Portata = ass.Portata;
                newAss.Watt = ass.Watt;
                newAss.Pressione = ass.Pressione;
                newAss.SquilibrioCorrenti = ass.SquilibrioCorrenti;
                newAss.TensioneProva = ass.TensioneProva;
                testResult.AbsorptionResults.Add(newAss);
            }

            Platform.Submit(testResult);

            return response;
        }
    }
}
