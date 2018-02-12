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
            UAFConnector connector = new UAFConnector();
            connector.Initialize();
            connector.HttpCallCommand("pippo", "pluto");
        }
    }
}
