using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InforConnectorLibrary;
using System.Net;
using System.Xml.Linq;
using System.Xml;

namespace TestInforConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Inserire ERPOrder: ");
            string erpOrder = Console.ReadLine();
            Console.WriteLine("Inserire ERPOrder: ");
            int sequence = Int32.Parse(Console.ReadLine());


                        InforResult result = new InforResult();

            while (true)
            {
                Console.WriteLine("Selezionare richiesta:\n\n 1) Report Production\n 2) Unplanned Material\n 3) Material Non Conformance \n 4) Operation Progress\n");

                int choice = Int32.Parse(Console.ReadLine());


                InvTransfer materialNonConf = new InvTransfer("TestOrderNumber", "TransIdTest;ToWarehouseTest", "StorageUnitTest", Convert.ToDecimal(1.2), "100", "002612155", true);

                if ((choice > 0) && (choice < 5))
                {
                    if (choice == 1)
                    {
                        ReportProduction reportProd = new ReportProduction(erpOrder, true, "100");
                        result = InforConnector.ReportProducedQuantity(reportProd);
                    }
                    else if (choice == 2)
                    {
                        int consumedMaterialSequence = 0;
                        string consumedMaterialDef = string.Empty;
                        string unit = string.Empty;
                        bool customized = false;
                        decimal qty = 0;
                        UnplannedMat unplannedMat = new UnplannedMat(erpOrder, sequence, consumedMaterialDef, customized, consumedMaterialSequence, Convert.ToDecimal(qty), unit, "100");

                        result = InforConnector.ReportConsumedMaterial(unplannedMat);
                    }
                    else if (choice == 3)
                    {
                        result = InforConnector.ReportMaterialNonConformance(materialNonConf);
                    }
                    else if (choice == 4)
                    {
                        bool closeOrder = false;
                        OperatorOperation operationProg = new OperatorOperation(erpOrder, sequence, 1, "100", closeOrder);
                        result = InforConnector.ReportOperationProgress(operationProg);
                    }

                    Console.WriteLine("Test passed : " + result.InforCallSucceeded.ToString() + " with message: " + result.Error);
                }
                else
                {
                    Console.WriteLine("\nScelta errata");
                }
            }
        }
    }
}
