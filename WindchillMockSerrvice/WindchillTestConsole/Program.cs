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
                    Console.WriteLine("101110060");
                    Console.WriteLine("Revision: ");
                    string revision = Console.ReadLine();
                    using (var docConnector = new WindchillDocConnector())
                    {
                        var docs = docConnector.GetDocumentList(productCode, revision);
                        foreach (var doc in docs)
                        {
                            Console.WriteLine(doc.Number + " " + doc.Revision + " " + doc.SoftType);
                            docConnector.DownloadDoc(doc);
                        }
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
