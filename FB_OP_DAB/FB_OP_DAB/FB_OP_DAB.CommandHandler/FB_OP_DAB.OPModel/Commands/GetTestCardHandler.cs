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
    public partial class GetTestCardHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private GetTestCard.Response GetTestCardHandler(GetTestCard command)
        {
            var response = new GetTestCard.Response();
            var testCard = Platform.Query<ITestCard>().Include(t => t.Absorptions).FirstOrDefault(t => t.WorkOrderId == command.WorkOrderId);
            if (testCard == null)
            {
                testCard = Platform.Create<ITestCard>();
                testCard.WorkOrderId = command.WorkOrderId;
                //foreach(valore ritornato dal soap service)
                //{ 
                var absorption = Platform.Create<IAbsorption>();
                absorption.Nome = "Ass1";
                testCard.Absorptions.Add(absorption);
                //}
                Platform.Submit(testCard);
            }

            response.TestCard = new Types.TestCardParameter
            {
                WorkOrderId = testCard.WorkOrderId,
                CodiceProdotto = testCard.CodiceProdotto,
                CorrenteASecco = testCard.CorrenteASecco,
                CorrenteASeccoPercent = testCard.CorrenteASeccoPercent,
                PotenzaASecco = testCard.PotenzaASecco,
                PotenzaASeccoPercent= testCard.PotenzaASeccoPercent
            };
            foreach (var a in testCard.Absorptions)
            {
                response.TestCard.Absorptions.Add(new Types.AbsorptionParameter
                {
                    Nome = a.Nome,
                    Ampere = a.Ampere,
                    AmperePercent = a.AmperePercent,
                    Portata = a.Portata,
                    PortataPercent = a.PortataPercent,
                    Pressione = a.Pressione,
                    PressionePercent = a.PressionePercent,
                    Watt = a.Watt,
                    WatPercent = a.WatPercent
                });
            }

            return response;
        }
    }
}
