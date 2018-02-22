using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{
    public class DABGetTestCard
    {
        public DABGetTestCard()
        {
            CommandFullName = "DABGetTestCard";
        }

        public string CommandFullName { get; }
        public string SerialNumber { get; set; }

        public class Response: BaseResponse
        {
            public Response()
            {

            }
            
            public TestCardParameter TestCard { get; set; }
        }
    }
}
