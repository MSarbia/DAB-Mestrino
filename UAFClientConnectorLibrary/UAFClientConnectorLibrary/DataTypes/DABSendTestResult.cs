using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{
    public class DABSendTestResult
    {
        public DABSendTestResult()
        {
            CommandFullName = "DABSendTestResult";
        }

        public string CommandFullName { get; }

        public TestResultParameter Result { get; set; }

        public class Response : BaseResponse
        {
        }
    }
}
