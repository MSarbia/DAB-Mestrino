using Engineering.DAB.OperationalData.FB_OP_DAB.OPModel.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            while(true)
            {
                try
                {
                    Console.WriteLine("Fire Andon Refresh");
                    Console.ReadLine();
                    UAFServerConnectorLibrary.UAFConnector platform = new UAFServerConnectorLibrary.UAFConnector();
                    platform.FireEvent(new UpdateAndon("100.DM1.D103"));
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
        }
    }
}
