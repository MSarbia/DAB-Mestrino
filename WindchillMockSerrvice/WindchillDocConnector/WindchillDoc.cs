using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindchillDocConnectorLibrary
{
    public class WindchillDoc
    {
        public string Name { get; set; }
        public string Revision { get; set; }
        public byte[] Content { get; set; }
        public string DocType { get; set; }
    }
}
