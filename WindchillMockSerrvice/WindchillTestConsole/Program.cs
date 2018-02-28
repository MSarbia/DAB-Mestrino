using Newtonsoft.Json;
using System;
using System.Text.RegularExpressions;
using WindchillDocConnectorLibrary;
using WindchillTestConnectorLibrary;

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
                    TestCardParameter testCard = null;
                    using (var testCardConnector = new WindchillTestCardConnector())
                    {
                        testCard = testCardConnector.GetTestCard(Console.ReadLine());
                    }
                    Console.WriteLine(JsonConvert.SerializeObject(testCard));
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
