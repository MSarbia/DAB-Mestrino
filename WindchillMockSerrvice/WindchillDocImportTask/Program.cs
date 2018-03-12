using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAFServerConnectorLibrary;
using Engineering.DAB.AppDAB.AppDAB.DPPOMModel.Commands;

namespace WindchillDocImportTask
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                UAFConnector uafConnector = new UAFConnector();
                uafConnector.CallCommand<DABImportDocuments, DABImportDocuments.Response>(new DABImportDocuments());
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
                Console.ReadLine();
            }
            Environment.Exit(0);
        }
    }
}
