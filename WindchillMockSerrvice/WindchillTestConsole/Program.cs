using System;
using WindchillDocConnectorLibrary;

namespace WindchillTestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                try
                {
                    Console.WriteLine("ProductCode: ");
                    string productCode = Console.ReadLine();
                    Console.WriteLine("Revision: ");
                    string revision = Console.ReadLine();
                    using (var docConnector = new WindchillDocConnector())
                    {
                        docConnector.DownloadDocList(productCode, revision);
                    }
                    Console.ReadLine();

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
        }
    }
}
