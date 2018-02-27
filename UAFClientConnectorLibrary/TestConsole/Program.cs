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
            while(true)
            {
                try
                {
                    Console.WriteLine("Enter a Serial Number: ");
                    Console.WriteLine("00000000001");
                    string serialNumber = Console.ReadLine();
                    DABGetTestCard.Response response = UAFConnector.StaticDABGetTestCard(serialNumber);

                    TestResultParameter testResult = new TestResultParameter
                    {
                        CorrenteDiTerra = 1,
                        CorrenteRigidita = 1,
                        DescrizioneEsito = "",
                        Esito = "PASS",
                        ResistenzaDiTerra = 1,
                        ResistenzaIsolamento = 1,
                        SerialNumber = serialNumber,
                        TensioneIsolamento = 1,
                        TensioneRigidita = 1,
                    };
                    Console.WriteLine(response.Succeeded ? "DABGetTestCard Succeeded" : $"DABGetTestCard Error {response.Error.ErrorCode}: {response.Error.ErrorMessage}");
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
                    var sendResponse = UAFConnector.StaticDABSendTestResult(testResult);
                    Console.WriteLine(sendResponse.Succeeded ? "DABGetTestCard Succeeded" : $"DABGetTestCard Error {sendResponse.Error.ErrorCode}: {sendResponse.Error.ErrorMessage}");
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
            
           
        }
    }
}
