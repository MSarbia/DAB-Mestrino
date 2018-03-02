using NiceLabelConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrintTestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            while(true)
            {
                Console.WriteLine("1 - Serial");
                Console.WriteLine("2 - Data");
                Console.WriteLine("3 - Package");
                Console.WriteLine("4 - Pallet");
                string option = Console.ReadLine();
                switch (option)
                {
                    case "1":
                        {
                            Console.WriteLine("Insert Serial:");
                            var result = LabelPrinter.PrintSNLabel(new List<string>() {Console.ReadLine() }, "101110060", "100.DM1.D102");
                            Console.WriteLine($"Succeeded: {result.connectionsucceeded}, Error: {result.error}");
                            break;
                        }
                    case "2":
                        {
                            var result = LabelPrinter.PrintDataLabel(new List<string>() { }, "101110060", "100.DM1.D102");
                            Console.WriteLine($"Succeeded: {result.connectionsucceeded}, Error: {result.error}");
                            break;
                        }
                    case "3":
                        {
                            var result = LabelPrinter.PrintPackageLabel(new List<string>() { }, "101110060", "100.DM1.D102");
                            Console.WriteLine($"Succeeded: {result.connectionsucceeded}, Error: {result.error}");
                            break;
                        }
                    case "4":
                        {
                            var result = LabelPrinter.PrintPalletLabel(new List<string>() { }, "101110060", "100.DM1.D102");
                            Console.WriteLine($"Succeeded: {result.connectionsucceeded}, Error: {result.error}");
                            break;
                        }
                }
               


                
            }
        }
    }
}
