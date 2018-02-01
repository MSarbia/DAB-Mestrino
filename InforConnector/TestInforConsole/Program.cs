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
            Console.WriteLine("Selezionare richiesta:\n\n 1) ReportProduction\n 2) Unplanned Material\n");

            InforResult result = new InforResult();

            while (true)
            {
                int choice = Int32.Parse(Console.ReadLine());
                ReportProduction reportProd = new ReportProduction("D02220137", 1, false);
                UnplannedMat unplannedMat = new UnplannedMat("D02220137", 1, "002612155", 1, Convert.ToDecimal(1.0));

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

                    Console.WriteLine("Test passed : " + result.InforCallSucceeded.ToString() + " with message: " + result.Error);
                }
                else {
                    Console.WriteLine("\nScelta errata");
                }
            }
        }
    }
}
