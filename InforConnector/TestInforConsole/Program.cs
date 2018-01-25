using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestInforConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            while (true)
            {
                int qty = Int32.Parse(Console.ReadLine());
                InforConnector.InforConnector.CallWebService();
                Console.WriteLine("\nChiamata eseguita");
            }
        }
    }
}
