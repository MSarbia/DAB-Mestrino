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
                Console.ReadLine();
                var result = LabelPrinter.PrintSNLabel(new List<string>() { "AllWorkAndNoPlayMakesJackADullBoy"},"101110060", "100.DM1.D102");
                Console.WriteLine($"Succeeded: {result.connectionsucceeded}, Error: {result.error}");
            }
        }
    }
}
