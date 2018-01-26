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
            Console.WriteLine("Digitare qualcosa per inviare richiesta");
            while (true)
            {
                int qty = Int32.Parse(Console.ReadLine());
                InforConnector.CallWebService();
                Console.WriteLine("\nChiamata eseguita");
            }
        }
    }
}
