using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAFClientConnectorLibrary;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var response =  UAFConnector.StaticDABGetTestCard("00000000001");
            //UAFConnector.GetTestCard("pippo");
        }
    }
}
