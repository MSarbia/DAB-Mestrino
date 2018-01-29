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
                using (var docConnector = new WindchillDocConnector())
                {

                    docConnector.DownloadDocList("productCode", "productRevision");


                }
                Console.ReadLine();
            }
        }
    }
}
