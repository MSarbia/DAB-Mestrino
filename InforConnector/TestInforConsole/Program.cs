using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InforConnectorLibrary;

namespace TestInforConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Selezionare richiesta:\n\n 1) Report Production\n 2) Unplanned Material\n 3) Material Non Conformance \n 4) Operation Progress\n");

            InforResult result = new InforResult();

            while (true)
            {
                int choice = Int32.Parse(Console.ReadLine());
                ReportProduction reportProd = new ReportProduction("D02220137", 1, false);
                UnplannedMat unplannedMat = new UnplannedMat("D02220137", 1, "002612155", 1, Convert.ToDecimal(1.0));
                OperatorOperation operationProg = new OperatorOperation("D02220137", 1, 1);
                InvTransfer materialNonConf = new InvTransfer("00302017", Convert.ToDecimal(1.0), "NR");

                if ((choice > 0) && (choice < 5))
                {
                    if (choice == 1)
                    {
                        result = InforConnector.ReportProducedQuantity(reportProd);
                    }
                    else if (choice == 2)
                    {
                        result = InforConnector.ReportConsumedMaterial(unplannedMat);
                    }
                    else if (choice == 3)
                    {
                        result = InforConnector.ReportMaterialNonConformance(materialNonConf);
                    }
                    else if (choice == 4)
                    {
                        result = InforConnector.ReportOperationProgress(operationProg);
                    }

                    Console.WriteLine("Test passed : " + result.InforCallSucceeded.ToString() + " with message: " + result.Error);
                }
                else {
                    Console.WriteLine("\nScelta errata");
                }
            }
        }
    }
}
