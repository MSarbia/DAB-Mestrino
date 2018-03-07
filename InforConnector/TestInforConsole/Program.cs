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
            Console.Write("Inserire ERPOrder (string): ");
            string erpOrder = Console.ReadLine();
            Console.Write("Inserire Sequence (int): ");
            int sequence = Int32.Parse(Console.ReadLine());
            InforResult result = new InforResult();

            while (true)
            {
                Console.WriteLine("Selezionare richiesta:\n\n 1) Report Production\n 2) Unplanned Material\n 3) Material Non Conformance \n 4) Operation Progress\n");

                int choice = Int32.Parse(Console.ReadLine());


                InvTransfer materialNonConf = new InvTransfer("TestOrderNumber", "TransIdTest;ToWarehouseTest", "StorageUnitTest", Convert.ToDecimal(1.2), "100", "002612155", true);
                try
                {
                    if ((choice > 0) && (choice < 5))
                    {
                        if (choice == 1)
                        {
                            ReportProduction reportProd = new ReportProduction(erpOrder, true, "100");

                            result = InforConnector.ReportProducedQuantity(reportProd);
                        }
                        else if (choice == 2)
                        {
                            Console.Write("\nDammi il consumedMaterialSequence (int): ");
                            int consumedMaterialSequence = Int32.Parse(Console.ReadLine());
                            Console.Write("Dammi il consumedMaterialDef (string): ");
                            string consumedMaterialDef = (Console.ReadLine());
                            Console.Write("Dammi la UoM (string): ");
                            string unit = (Console.ReadLine());
                            Console.Write("Dammi il customized (0/1): ");
                            bool customized = Console.ReadLine() == "0" ? false : true;
                            Console.Write("Dammi la quantity (decimal): ");
                            decimal qty = decimal.Parse(Console.ReadLine());

                            UnplannedMat unplannedMat = new UnplannedMat(erpOrder, sequence, consumedMaterialDef, customized, consumedMaterialSequence, Convert.ToDecimal(qty), unit, "100");

                            result = InforConnector.ReportConsumedMaterial(unplannedMat);
                        }
                        else if (choice == 3)
                        {
                            result = InforConnector.ReportMaterialNonConformance(materialNonConf);
                        }
                        else if (choice == 4)
                        {
                            Console.Write("\nDammi il closeOrder (0/1): ");
                            bool closeOrder = Console.ReadLine() == "0" ? false : true;

                            OperatorOperation operationProg = new OperatorOperation(erpOrder, sequence, 1, "100", closeOrder);

                            result = InforConnector.ReportOperationProgress(operationProg);
                        }

                        Console.WriteLine("Test passed: " + result.InforCallSucceeded.ToString() + " with message: " + result.Error);
                    }
                    else
                    {
                        Console.WriteLine("\nScelta errata");
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
        }
    }
}
