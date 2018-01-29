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

            while (true)
            {
                int choice = Int32.Parse(Console.ReadLine());

                if ((choice > 0) && (choice < 5))
                {
                    InforConnector.CallWebService(choice);
                    Console.WriteLine("\nChiamata eseguita");
                }
                else {
                    Console.WriteLine("\nScelta errata");
                }
            }
        }
    }
}
