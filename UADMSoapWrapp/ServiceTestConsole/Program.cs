using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceTestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                using (OPEXTSoapService.OPEXTWrapperClient client = new OPEXTSoapService.OPEXTWrapperClient("BasicHttpBinding_IOPEXTWrapper"))
                {
                    var orderImport = new OPEXTSoapService.WorkOrderRequest { ERPId = "asda", EstimatedStartTime = DateTime.Now, EstimatedEndTime = DateTime.Now, FinalMaterialCode = "asdasd", Priority = 0, Quantity = 10, ToBeConsumedMaterials = new List<OPEXTSoapService.ToBeConsumedMaterial>().ToArray() };
                    var sum = client.ImportWorkOrder(orderImport);
                    Console.WriteLine(sum.WorkOrderId);
                    Console.WriteLine(sum.WorkOrderNId);
                    var sumTask = client.ImportWorkOrderAsync(orderImport);
                    var taskResult = sumTask.Result;
                    Console.WriteLine(taskResult.WorkOrderId);
                    Console.WriteLine(taskResult.WorkOrderNId);
                }
                Console.ReadLine();
            }
            
        }
    }
}
