using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
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
