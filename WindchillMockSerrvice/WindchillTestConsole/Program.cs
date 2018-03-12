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
                    using (var docConnector = new WindchillDocConnector())
                    using (var testCardConnector = new WindchillTestCardConnector())
                    {
                        Console.WriteLine("Dimmi il productCode");
                        string productCodeX = Console.ReadLine();
                        Console.WriteLine("Dimmi il productRevision");
                        string productRevisionX = Console.ReadLine();
                        testCard = testCardConnector.GetTestCard(productCodeX, productRevisionX);

                        Console.WriteLine(JsonConvert.SerializeObject(testCard));
                        //Console.WriteLine("ProductCode: ");
                        //string productCode = Console.ReadLine();
                        //Console.WriteLine("101110060");
                        //Console.WriteLine("Revision: ");
                        //string revision = Console.ReadLine();


                        var docs = docConnector.GetDocumentList(productCodeX, productRevisionX);
                        foreach (var doc in docs)
                        {
                            Console.WriteLine(doc.Number + " " + doc.Revision + " " + doc.SoftType);
                            doc.SoftType = "wt.doc.WTDocument";
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
