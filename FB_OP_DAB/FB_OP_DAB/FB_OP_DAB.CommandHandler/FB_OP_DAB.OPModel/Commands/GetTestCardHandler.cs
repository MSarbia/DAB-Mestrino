using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.DataModel;
using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Types;
using WindchillTestConnectorLibrary;

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
            if (testCard == null && command.WindchillIntegration)
            {
                WindchillTestConnectorLibrary.TestCardParameter wTestCard = null;
                using(var connector = new WindchillTestCardConnector())
                {
                    wTestCard = connector.GetTestCard(command.ProductCode);
                }
                if(wTestCard != null)
                {
                    testCard = Platform.Create<ITestCard>();
                    testCard.WorkOrderId = command.WorkOrderId;
                    testCard.CodiceProdotto = command.ProductCode;
                    testCard.CorrenteASecco = wTestCard.CorrenteASecco;
                    testCard.CorrenteASeccoPercent = wTestCard.CorrenteASeccoPercent;
                    testCard.PotenzaASecco = wTestCard.PotenzaASecco;
                    testCard.PotenzaASeccoPercent = wTestCard.PotenzaASeccoPercent;
                    
                    foreach(var a in wTestCard.Assorbimenti)
                    {
                        var absorption = Platform.Create<IAbsorption>();
                        absorption.Ampere = a.Ampere;
                        absorption.AmperePercent = a.AmperePercent;
                        absorption.Nome = a.Nome;
                        absorption.Portata = a.Portata;
                        absorption.PortataPercent = a.PortataPercent;
                        absorption.Pressione = a.Pressione;
                        absorption.PressionePercent = a.PressionePercent;
                        absorption.Watt = a.Watt;
                        absorption.WattPercent = a.WattPercent;
                        testCard.Absorptions.Add(absorption);
                    }
                    Platform.Submit(testCard);
                }
            }
            if(testCard == null)
            {
                response.SetError(-1005, $"Nessuna scheda di collaudo trovata per il codice prodotto: {command.ProductCode}");
                return response;
            }

            response.TestCard = new Types.TestCardParameter
            {
                CodiceProdotto = testCard.CodiceProdotto,
                CorrenteASecco = testCard.CorrenteASecco,
                CorrenteASeccoPercent = testCard.CorrenteASeccoPercent,
                PotenzaASecco = testCard.PotenzaASecco,
                PotenzaASeccoPercent= testCard.PotenzaASeccoPercent,
                Assorbimenti = new List<Types.AbsorptionParameter>()
            };
            foreach (var a in testCard.Absorptions)
            {
                response.TestCard.Assorbimenti.Add(new Types.AbsorptionParameter
                {
                    Nome = a.Nome,
                    Ampere = a.Ampere,
                    AmperePercent = a.AmperePercent,
                    Portata = a.Portata,
                    PortataPercent = a.PortataPercent,
                    Pressione = a.Pressione,
                    PressionePercent = a.PressionePercent,
                    Watt = a.Watt,
                    WattPercent = a.WattPercent
                });
            }

            return response;
        }
    }
}
