using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAFClientConnectorLibrary;
using UAFClientConnectorLibrary.DataTypes;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            DABGetTestCard.Response response = UAFConnector.StaticDABGetTestCard("00000000001");



            TestResultParameter testResult = new TestResultParameter
            {
                CorrenteDiTerra = 1,
                CorrenteRigidita = 1,
                DescrizioneEsito = "",
                Esito = "PASS",
                ResistenzaDiTerra = 1,
                ResistenzaIsolamento = 1,
                SerialNumber = "00000000001",
                TensioneIsolamento = 1,
                TensioneRigidita = 1,
            };

            //per ogni assorbimento
            testResult.Assorbimenti.Add(new AbsorptionResultParameter
            {
                Nome = "ASS1",
                AmpereFase1 = 1,
                AmpereFase2 = 1,
                AmpereFase3 = 1,
                FattoreDiPotenza = 1,
                Portata = 1,
                Watt = 1,
                Pressione = 1,
                SquilibrioCorrenti = 1,
                TensioneProva = 1,
            });
            UAFConnector.StaticDABSendTestResult(testResult);
        }
    }
}
